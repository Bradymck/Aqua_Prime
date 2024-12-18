import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const resolvedParams = await params;
    const { address } = resolvedParams;
    const baseName = `Base-${address.substring(0, 6)}`;
    return NextResponse.json({ baseName });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}