import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Parse the request body to get the messages
    const { messages } = await req.json();

    // Convert messages into a core format and use GPT-4-turbo model
    const result = await streamText({
      model: openai('gpt-3.5-turbo-instruct'),
      messages: convertToCoreMessages(messages),
    });

    console.log('result', result);
       // Create a readable stream and return it
       const readable = new Readable();
       readable.push(result);
       readable.push(null); // Mark the end of the stream
       console.log('readable : ' ,readable)

       return Response.json({
          stream: readable,
          headers : {
            'Content-Type' : 'application/json'
          }
       })
    // Stream response to the client
    // return result.toDataStreamResponse();

  } catch (error) {
    // If any error occurs, log it for debugging
    console.error('Error processing request:', error);

    // Return a user-friendly error message and status code
    return NextResponse.json({
      error: 'Failed to process the request. Please try again later.'
    }, {
      status: 500,
    });
  }
}
