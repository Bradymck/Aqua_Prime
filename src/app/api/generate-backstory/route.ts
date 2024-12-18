import { NextResponse } from 'next/server';
import OpenAI from 'openai';

let openai: OpenAI | null = null;

if (typeof process.env.OPENAI_API_KEY === 'string' && process.env.OPENAI_API_KEY.length > 0) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(req: Request) {
  try {
    const { traits } = await req.json();

    if (!traits || !Array.isArray(traits)) {
      return NextResponse.json({ error: 'Traits array is required' }, { status: 400 });
    }

    const prompt = `Generate a backstory for a character with the following traits: ${traits.map(trait => `${trait.category}: ${trait.image.split('/').pop()}`).join(', ')}`;

    if (!openai) {
      console.warn('OPENAI_API_KEY is not set or invalid. Returning a mock response.');
      return NextResponse.json({ 
        backstory: "This is a mock backstory generated without using the OpenAI API. Please set a valid OPENAI_API_KEY environment variable to generate real backstories."
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "You are a creative writer tasked with generating brief, engaging backstories, goals, and descriptions for NFT characters."
      }, {
        role: "user",
        content: prompt
      }],
      max_tokens: 200
    });

    const generatedBackstory = response.choices[0].message.content || '';
    return NextResponse.json({ backstory: generatedBackstory });
  } catch (error) {
    console.error('Error generating backstory:', error);
    return NextResponse.json({ 
      error: 'Failed to generate backstory', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}