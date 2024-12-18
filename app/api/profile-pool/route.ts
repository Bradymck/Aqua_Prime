import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = Number(searchParams.get('limit')) || 10;
    const offset = Number(searchParams.get('offset')) || 0;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId is required'
      }, { status: 400 });
    }

    // Get profiles the user has already liked or disliked
    const [likes, dislikes] = await Promise.all([
      prisma.like.findMany({
        where: { userId },
        select: { profileId: true }
      }),
      prisma.dislike.findMany({
        where: { userId },
        select: { profileId: true }
      })
    ]);

    const excludeProfileIds = [
      ...likes.map(like => like.profileId),
      ...dislikes.map(dislike => dislike.profileId)
    ];

    // Get global profiles (excluding ones user has interacted with)
    const globalProfiles = await prisma.profile.findMany({
      where: {
        isInGlobalPool: true,
        isActive: true,
        id: {
          notIn: excludeProfileIds
        }
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get user-generated profiles (excluding ones user has interacted with)
    const userProfiles = await prisma.profile.findMany({
      where: {
        isInGlobalPool: false,
        isActive: true,
        id: {
          notIn: excludeProfileIds
        }
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get like counts and enhance profiles
    const enhancedProfiles = await Promise.all([...globalProfiles, ...userProfiles].map(async (profile) => {
      const totalLikes = await prisma.like.count({
        where: {
          profileId: profile.id
        }
      });

      return {
        ...profile,
        totalLikes,
        isPopular: profile.isInGlobalPool
      };
    }));

    // Shuffle the profiles to mix global and local
    const shuffledProfiles = enhancedProfiles
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    console.log(`Found ${shuffledProfiles.length} profiles in pool`);

    return NextResponse.json({
      success: true,
      data: {
        profiles: shuffledProfiles
      }
    });
  } catch (error) {
    console.error('Error in profile-pool API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch profiles from pool',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Admin endpoint to purge stale profiles
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const purgeType = searchParams.get('type') || 'stale';
    const olderThanDays = Number(searchParams.get('olderThanDays')) || 30;

    let whereClause = {};

    switch (purgeType) {
      case 'stale':
        whereClause = {
          updatedAt: {
            lt: new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000)
          }
        };
        break;
      case 'inactive':
        whereClause = {
          isActive: false
        };
        break;
      case 'all':
        whereClause = {};
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid purge type'
        }, { status: 400 });
    }

    // Delete associated likes and dislikes first
    await prisma.like.deleteMany({
      where: {
        profile: whereClause
      }
    });

    await prisma.dislike.deleteMany({
      where: {
        profile: whereClause
      }
    });

    // Then delete the profiles
    const { count } = await prisma.profile.deleteMany({
      where: whereClause
    });

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: count,
        purgeType
      }
    });
  } catch (error) {
    console.error('Error purging profiles:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to purge profiles',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}