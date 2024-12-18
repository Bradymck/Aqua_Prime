import { NextRequest, NextResponse } from 'next/server';

const callbacks = new Map<string, (message: string) => void>();

export async function POST(req: NextRequest) {
  const { message, callbackId } = await req.json();
  const callback = callbacks.get(callbackId);
  
  if (callback) {
    callback(message);
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ success: false }, { status: 404 });
}

export const registerCallback = (id: string, callback: (message: string) => void) => {
  callbacks.set(id, callback);
}; 