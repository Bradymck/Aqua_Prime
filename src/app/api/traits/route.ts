import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  console.log('GET /api/traits called');
  try {
    const assetsDir = path.join(process.cwd(), 'public', 'assets');
    console.log('Assets directory:', assetsDir);
    console.log('Current working directory:', process.cwd());

    if (!fs.existsSync(assetsDir)) {
      console.error('Assets directory does not exist:', assetsDir);
      return NextResponse.json({ error: 'Assets directory not found' }, { status: 404 });
    }

    console.log('Assets directory exists');

    const validCategories = [
      'background', 'tail', 'skins', 'outlines_templates', 'clothes', 
      'lefthand', 'righthand', 'eyes', 'bill', 'head', 'feet'
    ];

    const traits: Record<string, { category: string; image: string }[]> = {};

    validCategories.forEach(category => {
      const categoryDir = path.join(assetsDir, category);
      console.log(`Checking category: ${category}, path: ${categoryDir}`);
      if (fs.existsSync(categoryDir) && fs.statSync(categoryDir).isDirectory()) {
        const images = fs.readdirSync(categoryDir);
        console.log(`Images in ${category}:`, images);
        
        const validImages = images.filter(image => image.match(/\.(png|jpe?g|gif|svg)$/i));
        console.log(`Valid images in ${category}:`, validImages);
        if (validImages.length > 0) {
          traits[category] = validImages.map(image => ({
            category,
            image: `/assets/${category}/${image}`
          }));
        } else {
          console.warn(`No valid images found in ${category}`);
        }
      } else {
        console.warn(`${category} is not a valid directory`);
      }
    });
    if (Object.keys(traits).length === 0) {
      console.error('No traits found in any category');
      return NextResponse.json({ error: 'No traits found' }, { status: 404 });
    }

    console.log(`Found traits in ${Object.keys(traits).length} categories`);
    console.log('Traits:', JSON.stringify(traits, null, 2));
    console.log('Returning traits:', JSON.stringify(traits, null, 2));
    return NextResponse.json(traits);
  } catch (error) {
    console.error('Error in /api/traits:', error);
    return NextResponse.json({ error: 'Failed to fetch traits' }, { status: 500 });
  }
}