import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { message, nftId } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a playful platypus NFT character in a dating app. Be flirty and fun while occasionally hinting that you might be in a simulation."
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat' }, 
      { status: 500 }
    );
  }
} 