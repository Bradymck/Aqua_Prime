import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Debug: Log the requested path
    console.log('Requested asset path:', params.path);

    // Reconstruct the file path
    const filePath = path.join(process.cwd(), 'private', 'assets', ...params.path);

    // Debug: Log the full file path
    console.log('Full file path:', filePath);

    // Basic security check to prevent directory traversal
    const privatePath = path.join(process.cwd(), 'private', 'assets');
    if (!filePath.startsWith(privatePath)) {
      console.error('Invalid path access attempt:', filePath);
      return new NextResponse('Invalid path', { status: 400 });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Asset not found at path: ${filePath}`);
      // Try lowercase version as fallback
      const lowercaseFilePath = path.join(
        path.dirname(filePath),
        path.basename(filePath).toLowerCase()
      );
      if (fs.existsSync(lowercaseFilePath)) {
        console.log('Found asset with lowercase name:', lowercaseFilePath);
        const file = await fs.promises.readFile(lowercaseFilePath);
        return new NextResponse(file, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        });
      }
      return new NextResponse('Asset not found', { status: 404 });
    }

    // Read the file
    const file = await fs.promises.readFile(filePath);

    // Return the file with appropriate headers
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error serving asset:', error);
    return new NextResponse('Error serving asset', { status: 500 });
  }
}