import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE() {
  try {
    await prisma.profile.deleteMany({});
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete profiles' },
      { status: 500 }
    );
  }
} 