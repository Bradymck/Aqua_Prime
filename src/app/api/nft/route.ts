import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const nfts = await prisma.nFTMetadata.findMany({
      include: {
        coreMemory: true,
        adminLogs: true
      }
    });
    return NextResponse.json(nfts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch NFTs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const nft = await prisma.nFTMetadata.create({
      data: {
        ...body,
        lastInteraction: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        coreMemory: true,
        adminLogs: true
      }
    });
    return NextResponse.json(nft);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create NFT' }, { status: 500 });
  }
} 