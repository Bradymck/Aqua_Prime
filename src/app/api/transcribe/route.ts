// import { NextResponse } from 'next/server';
// import { DeepgramClient } from '@deepgram/sdk';

// // Correctly initialize DeepgramClient with options
// const deepgram = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY || '' });

// export async function POST(request: Request) {
//   const { audio } = await request.json();
//   try {
//     const response = await deepgram.transcription.preRecorded(
//       { buffer: Buffer.from(audio) },
//       { punctuate: true, language: 'en-US' }
//     );
    
//     return NextResponse.json({ transcript: response.results.channels[0].alternatives[0].transcript });
//   } catch {
//     return NextResponse.json({ error: 'Error transcribing audio' }, { status: 500 });
//   }
// }