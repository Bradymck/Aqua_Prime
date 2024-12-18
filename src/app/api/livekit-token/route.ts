import { AccessToken } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { nftId } = await req.json();
    
    // Create access token
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      {
        identity: nftId,
        name: `ARI-${nftId}`
      }
    );

    // Add video grant
    at.addGrant({ 
      room: `aquaprime-${nftId}`,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true
    });

    return NextResponse.json({ token: at.toJwt() });

  } catch (error) {
    console.error('LiveKit token error:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
} 