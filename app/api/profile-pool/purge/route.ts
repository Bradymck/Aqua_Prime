import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Handle both POST and DELETE methods for backward compatibility
export async function POST() {
  return handlePurge();
}

export async function DELETE() {
  return handlePurge();
}

async function handlePurge() {
  try {
    // Delete all likes
    await prisma.like.deleteMany();

    // Delete all dislikes
    await prisma.dislike.deleteMany();

    // Delete all profiles
    await prisma.profile.deleteMany();

    return NextResponse.json({
      success: true,
      message: 'Successfully purged all profile data'
    });
  } catch (error) {
    console.error('Error purging database:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to purge database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}