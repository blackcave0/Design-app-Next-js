import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Parse the request body to get the messages
    const { messages } = await req.json();
    
    // Convert messages into a core format and use GPT-4-turbo model
    const result = await streamText({
      model: openai('gpt-4-turbo'),
      messages: convertToCoreMessages(messages),
    });

    // Stream response to the client
    return result.toDataStreamResponse();

  } catch (error) {
    // If any error occurs, log it for debugging
    console.error('Error processing request:', error);

    // Return a user-friendly error message and status code
    return new Response(JSON.stringify({
      error: 'Failed to process the request. Please try again later.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
