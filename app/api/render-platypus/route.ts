import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { AVAILABLE_TRAITS } from '@/app/profile-pool/traits';

const ASSETS_DIR = path.join(process.cwd(), 'private/assets');

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const traitsParam = searchParams.get('traits');

    if (!traitsParam) {
      return new NextResponse('Missing traits parameter', { status: 400 });
    }

    const traits = JSON.parse(decodeURIComponent(traitsParam));

    // Validate and normalize traits
    const normalizedTraits = {
      background: traits.background || AVAILABLE_TRAITS.background[0],
      skin: traits.skin || AVAILABLE_TRAITS.skin[0],
      eyes: traits.eyes || AVAILABLE_TRAITS.eyes[0],
      bill: traits.bill || AVAILABLE_TRAITS.bill[0],
      clothes: traits.clothes || AVAILABLE_TRAITS.clothes[0],
      tail: traits.tail || AVAILABLE_TRAITS.tail[0],
      head: traits.head || '',
      feet: traits.feet || '',
      leftHand: traits.leftHand || '',
      rightHand: traits.rightHand || ''
    };

    // Load and composite images
    let composite = sharp({
      create: {
        width: 800,
        height: 800,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    });

    const layers = [
      { trait: 'background', dir: 'background' },
      { trait: 'skin', dir: 'skins' },
      { trait: 'eyes', dir: 'eyes' },
      { trait: 'bill', dir: 'bill' },
      { trait: 'clothes', dir: 'clothes' },
      { trait: 'tail', dir: 'tail' },
      { trait: 'head', dir: 'head' },
      { trait: 'feet', dir: 'feet' },
      { trait: 'leftHand', dir: 'lefthand' },
      { trait: 'rightHand', dir: 'righthand' }
    ];

    const images = [];
    for (const layer of layers) {
      const traitValue = normalizedTraits[layer.trait];
      if (traitValue) {
        const imagePath = path.join(ASSETS_DIR, layer.dir, `${traitValue}.png`);
        if (fs.existsSync(imagePath)) {
          images.push({ input: imagePath, top: 0, left: 0 });
        } else {
          console.warn(`Image not found: ${imagePath}`);
        }
      }
    }

    if (images.length === 0) {
      console.error('No valid images found for traits:', normalizedTraits);
      return new NextResponse('No valid images found', { status: 400 });
    }

    composite = composite.composite(images);

    // Generate final image
    const buffer = await composite.png().toBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error rendering platypus:', error);
    return new NextResponse('Error rendering platypus', { status: 500 });
  }
}