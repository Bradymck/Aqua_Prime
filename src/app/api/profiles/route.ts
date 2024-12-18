import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await prisma.profile.deleteMany();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete profiles' },
      { status: 500 }
    );
  }
}
