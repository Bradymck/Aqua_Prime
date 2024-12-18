import { NextResponse } from 'next/server';
import axios from 'axios';

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1/sound-effects';

export async function POST(req: Request) {
  try {
    const { effectName } = await req.json();

    const response = await axios.post(
      ELEVEN_LABS_API_URL,
      { name: effectName },
      {
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );

    const audioBuffer = Buffer.from(response.data);
    const base64Audio = audioBuffer.toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error('Error fetching sound effect:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sound effect' },
      { status: 500 }
    );
  }
}