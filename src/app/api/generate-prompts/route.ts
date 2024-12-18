import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const { address, nftId } = await request.json();
    
    const memories = await fetch(`${process.env.API_URL}/memories/${address}/${nftId}`).then(r => r.json());
    
    const prompt = `
      Based on these conversation memories:
      ${JSON.stringify(memories)}

      Generate 3 conversation prompts that:
      1. Reference personal details shared by the user
      2. Build on shared experiences or inside jokes
      3. Subtly hint at the simulation nature of reality

      Return as JSON array with fields: type, content, context
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a conversation prompt generator for an AI dating app." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const generatedPrompts = JSON.parse(content);
    return NextResponse.json(generatedPrompts);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate prompts' }, { status: 500 });
  }
} 