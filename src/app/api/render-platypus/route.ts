import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const IMAGE_SIZE = 800; // Set a consistent size for all images

const LAYER_ORDER: TraitCategory[] = [
  'background',
  'skins',
  'outlines_templates',
  'tail',
  'clothes',
  'bill',
  'eyes',
  'head',
  'lefthand',
  'righthand',
  'feet'
];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const traitsParam = url.searchParams.get('traits');
    
    if (!traitsParam) {
      return NextResponse.json({ error: 'No traits provided' }, { status: 400 });
    }

    const traits = JSON.parse(traitsParam);
    const assetsDir = path.join(process.cwd(), 'public', 'assets');
    const compositeImages = [];

    // Create transparent base
    const baseImage = await sharp({
      create: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    }).png().toBuffer();

    // Handle background
    if (traits.background) {
      const backgroundPath = path.join(assetsDir, 'background', `${traits.background}.png`);
      if (fs.existsSync(backgroundPath)) {
        compositeImages.push({ 
          input: await sharp(backgroundPath)
            .resize(IMAGE_SIZE, IMAGE_SIZE, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toBuffer(),
          top: 0,
          left: 0 
        });
      }
    }

    // Handle skin from skins folder
    if (traits.skin) {
      const skinPath = path.join(assetsDir, 'skins', `${traits.skin}.png`);
      if (fs.existsSync(skinPath)) {
        compositeImages.push({
          input: await sharp(skinPath)
            .resize(IMAGE_SIZE, IMAGE_SIZE, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toBuffer(),
          top: 0,
          left: 0
        });
      }
    }

    // Always add master outline after skin
    const outlinePath = path.join(assetsDir, 'outlines_templates', 'master_outline.png');
    if (fs.existsSync(outlinePath)) {
      compositeImages.push({
        input: await sharp(outlinePath)
          .resize(IMAGE_SIZE, IMAGE_SIZE, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .toBuffer(),
        top: 0,
        left: 0
      });
    }

    // Continue with remaining layers...
    for (const layer of LAYER_ORDER.slice(3)) {  // Skip first 3 as we handled them
      if (traits[layer]) {
        const traitPath = path.join(assetsDir, layer, `${traits[layer]}.png`);
        if (fs.existsSync(traitPath)) {
          const traitBuffer = await sharp(traitPath)
            .resize(IMAGE_SIZE, IMAGE_SIZE, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toBuffer();
          compositeImages.push({ input: traitBuffer, top: 0, left: 0 });
        }
      }
    }

    // Composite all layers
    const finalImage = await sharp(baseImage)
      .composite(compositeImages)
      .png()
      .toBuffer();

    return new Response(finalImage, {
      headers: {
        'Content-Type': 'image/png'
      }
    });
  } catch (error) {
    console.error('Error generating platypus:', error);
    return NextResponse.json({ error: 'Failed to generate platypus' }, { status: 500 });
  }
} 