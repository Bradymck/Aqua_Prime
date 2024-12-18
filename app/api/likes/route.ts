import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: 'userId is required'
    }, { status: 400 });
  }

  try {
    // Fetch all liked profiles for the user
    const likes = await prisma.like.findMany({
      where: {
        userId: userId
      },
      include: {
        profile: {
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
        }
      }
    });

    // Get total likes for each profile to show popularity
    const profilesWithLikes = await Promise.all(
      likes.map(async (like) => {
        const totalLikes = await prisma.like.count({
          where: {
            profileId: like.profile.id
          }
        });

        return {
          id: like.id,
          userId: like.userId,
          profile: {
            ...like.profile,
            totalLikes,
            isPopular: like.profile.isInGlobalPool
          }
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        likes: profilesWithLikes
      }
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch likes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, profile } = await request.json();

    if (!userId || !profile) {
      return NextResponse.json({
        success: false,
        error: 'userId and profile are required'
      }, { status: 400 });
    }

    // Verify the profile exists
    const existingProfile = await prisma.profile.findFirst({
      where: {
        id: profile.id,
        isActive: true
      }
    });

    if (!existingProfile) {
      return NextResponse.json({
        success: false,
        error: 'Profile not found'
      }, { status: 404 });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        profileId: profile.id
      }
    });

    if (existingLike) {
      return NextResponse.json({
        success: false,
        error: 'You have already liked this profile'
      }, { status: 400 });
    }

    // If it's a user-generated profile, check the like limit
    if (!existingProfile.isInGlobalPool) {
      const userLikeCount = await prisma.like.count({
        where: {
          userId: userId,
          profile: {
            isInGlobalPool: false
          }
        }
      });

      if (userLikeCount >= 20) {
        return NextResponse.json({
          success: false,
          error: 'You can only save up to 20 user-generated profiles. Global profiles are always available!'
        }, { status: 400 });
      }
    }

    const like = await prisma.like.create({
      data: {
        userId: userId,
        profileId: profile.id,
        likedById: profile.id // This might need adjustment based on your schema
      },
      include: {
        profile: {
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
        }
      }
    });

    // Get total likes for the profile
    const totalLikes = await prisma.like.count({
      where: {
        profileId: profile.id
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        like: {
          id: like.id,
          userId: like.userId,
          profile: {
            ...like.profile,
            totalLikes,
            isPopular: like.profile.isInGlobalPool
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating like:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({
          success: false,
          error: 'You have already liked this profile',
        }, { status: 400 });
      }
      if (error.code === 'P2003') {
        return NextResponse.json({
          success: false,
          error: 'Profile not found',
        }, { status: 404 });
      }
    }
    return NextResponse.json({
      success: false,
      error: 'Failed to like profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}