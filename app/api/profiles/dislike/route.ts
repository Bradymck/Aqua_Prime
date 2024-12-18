import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { profileId, userId } = await request.json();

    if (!profileId || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    // First verify the profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: profileId }
    });

    if (!profile) {
      return NextResponse.json({
        success: false,
        error: 'Profile not found'
      }, { status: 404 });
    }

    // Check if dislike already exists
    const existingDislike = await prisma.dislike.findFirst({
      where: {
        userId,
        profileId,
      },
    });

    if (existingDislike) {
      return NextResponse.json({
        success: false,
        error: 'You have already disliked this profile'
      }, { status: 400 });
    }

    // Save dislike to database
    const dislike = await prisma.dislike.create({
      data: {
        userId,
        profileId,
        dislikedById: userId // This might need adjustment based on your schema
      },
      include: {
        profile: true
      }
    });

    return NextResponse.json({
      success: true,
      data: { dislike }
    });
  } catch (error) {
    console.error('Error in dislike endpoint:', error);
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'You have already disliked this profile',
      }, { status: 400 });
    }
    if (error.code === 'P2003') {
      return NextResponse.json({
        success: false,
        error: 'Profile not found',
      }, { status: 404 });
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process dislike',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing userId parameter'
        },
        { status: 400 }
      );
    }

    const dislikes = await prisma.dislike.findMany({
      where: {
        userId: String(userId),
      },
      include: {
        profile: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: { dislikes }
    });
  } catch (error) {
    console.error('Error fetching dislikes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch disliked profiles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}