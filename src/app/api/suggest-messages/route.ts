// Suggested code may be subject to a license. Learn more: ~LicenseLog:3326222726.
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
// import { streamText, convertToCoreMessages } from 'ai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST() {
  try {
    // const { messages } = await request.json();
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be saperated by '||'. These questions are for an anonymous social message platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or senstive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this : 'what's a hobby you've recently started? || if you could have dinner with any historical figure, who would it be?||";
    

    /* const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    }); */
    const response = await openai.completions.create({
      model : 'gpt-3.5-turbo-instruct',
      max_tokens : 400,
      stream : true,
      prompt,
    })

    return NextResponse.json({ output: response });
    // const stream = await streamText(response.choices[0].message.content);
    // return new NextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error
      return NextResponse.json({
        name,
        status,
        headers,
        message
      }, { status: error.status })
    } else {
      console.error('Error processing request:', error);
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
  }
}

