import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get('room')?.trim();
  const username = req.nextUrl.searchParams.get('username');

  if (!room) {
    return NextResponse.json({ error: 'Missing room parameter' }, { status: 400 });
  }

  if (!username) {
    return NextResponse.json({ error: 'Missing username parameter' }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  console.log('API Key:', apiKey);
  console.log('API Secret:', apiSecret);

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: 'LiveKit API key or secret is not configured' }, { status: 500 });
  }

  const at = new AccessToken(apiKey, apiSecret, { identity: username });

  at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });

  const token = at.toJwt();
  console.log('Generated token:', token);
  // Remove the line logging token claims as it's not a valid property
  
  return NextResponse.json({ token });
}
