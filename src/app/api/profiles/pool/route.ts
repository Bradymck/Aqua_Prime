import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        dateGenerated: 'desc'
      }
    });

    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    console.error('Failed to fetch profile pool:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
} 