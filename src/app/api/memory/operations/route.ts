import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error('Memory operations error:', error);
    return NextResponse.json({ error: 'Failed to process memory operation' }, { status: 500 });
  }
}