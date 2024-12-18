import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('Fetching profiles from pool...');

    // Fetch global (popular) profiles
    const globalProfiles = await prisma.profile.findMany({
      where: {
        isActive: true,
        isInGlobalPool: true
      },
      select: {
        id: true,
        name: true,
        bio: true,
        location: true,
        nftMetadata: true,
        createdAt: true,
        updatedAt: true,
        isInGlobalPool: true,
        isActive: true,
        ownerAddress: true,
        _count: {
          select: {
            likes: true,
            dislikes: true
          }
        }
      }
    });

    // Fetch user profiles
    const userProfiles = await prisma.profile.findMany({
      where: {
        isActive: true,
        isInGlobalPool: false,
        ...(userId ? { ownerAddress: userId } : {})
      },
      select: {
        id: true,
        name: true,
        bio: true,
        location: true,
        nftMetadata: true,
        createdAt: true,
        updatedAt: true,
        isInGlobalPool: true,
        isActive: true,
        ownerAddress: true,
        _count: {
          select: {
            likes: true,
            dislikes: true
          }
        }
      }
    });

    // Parse nftMetadata from string to JSON
    const enhancedProfiles = [...globalProfiles, ...userProfiles].map(profile => ({
      ...profile,
      nftMetadata: JSON.parse(profile.nftMetadata),
      totalLikes: profile._count.likes,
      isPopular: profile.isInGlobalPool
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