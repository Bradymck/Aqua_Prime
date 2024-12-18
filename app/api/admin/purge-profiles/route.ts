import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // Delete all profiles and related data
    await prisma.$transaction([
      prisma.like.deleteMany({}),
      prisma.dislike.deleteMany({}),
      prisma.profile.deleteMany({})
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error purging profiles:', error);
    return NextResponse.json(
      { error: 'Failed to purge profiles' },
      { status: 500 }
    );
  }
}