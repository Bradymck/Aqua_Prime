import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { RouteHandlerContext } from '../../../../types/api';

export async function GET(
  _request: NextRequest,
  context: RouteHandlerContext<{ tokenId: string }>
) {
  try {
    const nft = await prisma.nFTMetadata.findUnique({
      where: { tokenId: parseInt(context.params.tokenId) },
      include: {
        coreMemory: true,
        adminLogs: true
      }
    });

    if (!nft) {
      return NextResponse.json({ error: 'NFT not found' }, { status: 404 });
    }

    // Parse the JSON traits field if needed
    const response = {
      ...nft,
      traits: nft.traits ? JSON.parse(JSON.stringify(nft.traits)) : null
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching NFT:', error);
    return NextResponse.json({ error: 'Failed to fetch NFT' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { tokenId: string } }
) {
  try {
    const body = await request.json();
    const nft = await prisma.nFTMetadata.update({
      where: { tokenId: parseInt(params.tokenId) },
      data: {
        ...body,
        updatedAt: new Date()
      }
    });
    return NextResponse.json(nft);
  } catch (error) {
    console.error('Error updating NFT:', error);
    return NextResponse.json({ error: 'Failed to update NFT' }, { status: 500 });
  }
} 