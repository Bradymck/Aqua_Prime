import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { prompt, memories, messages } = await req.json();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a context analyzer for an AI dating app." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    return NextResponse.json(response.choices[0].message.content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process memory' }, { status: 500 });
  }
} 