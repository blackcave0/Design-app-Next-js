import { NextResponse } from 'next/server';
import OpenAI from 'openai';  // Correct import

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Make sure your API key is set
});

// const openai = new OpenAI(configuration);  // Correct initialization

export async function POST(req: Request) {
  try {
    // Parse the request body to get the messages
    const { messages } = await req.json();

    // Make the request to the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // or 'gpt-3.5-turbo'
      messages: messages,    // Pass the conversation history
    });

    // Return the response from OpenAI
    return NextResponse.json(response.choices[0].message);

  } catch (error) {
    // Return an error response
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json({
      error: 'Failed to process the request. Please try again later.'
    }, { status: 500 });
  }
}
