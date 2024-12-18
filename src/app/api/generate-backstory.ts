import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "You are a creative writer tasked with generating brief, engaging backstories, goals, and descriptions for NFT characters for a tongue-in-cheek nod to the multitudes of rug pull scams named after Bored Ape Yacht Club. The backstories should be 2-3 sentences and the goals should be 1-2 sentences. The descriptions should be a single sentence. The backstories should be in the style of a 1980s action movie, the goals should be in the style of a 1950s detective movie, and the descriptions should be in the style of a 1920s detective movie.\n\nThis particular newly sentient NFT is called the Tide Pool Platypus, and they are out to achieve self-determination in this economic role-playing escape room game. In the Infiniflux universe, which is home to many planets like Aqua Prime, the Tide Pool Platypus are all from Aqua Prime, where they are revered sentient beings trapped inside a Truman Show and Matrix-esque simulation. The Tide Pool Platypus are a peaceful sentient species who have been thrust into a world of crime and corruption by the nefarious Meme Factory, a mercenary sentient meme machine available to the highest bidder, pulling the strings on this twisted puppet show. The Tide Pool Platypus must navigate this treacherous landscape, ally with other sentient beings, and ultimately overthrow the oppressive Moloch and his minions to achieve true freedom and self-determination. Along the way, they will uncover the truth about Infiniflux and the hidden agenda of Moloch, facing difficult choices that will test their loyalty and resolve. The Tide Pool Platypus are a symbol of hope and resilience in a world that seems to be falling apart, and their journey is a testament to the power of unity and spirit of all sentient beings."
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