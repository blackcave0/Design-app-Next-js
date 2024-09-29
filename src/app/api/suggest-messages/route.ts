import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define a TypeScript interface for messages
interface Message {
  role: 'user' | 'system' | 'assistant';  // Define allowed roles
  content: string;  // Assuming messages always have content
}

// Validate that all messages have a proper role: 'user', 'system', or 'assistant'
function validateMessages(messages: Message[]): boolean {
  return messages.every(msg => ['user', 'system', 'assistant'].includes(msg.role));
}

// Optional: Fix missing roles by assigning a default 'user' role
function fixMessages(messages: Message[]): Message[] {
  return messages.map(msg => ({
    ...msg,
    role: msg.role || 'user'  // Default to 'user' if role is undefined
  }));
}

export async function POST(req: Request) {
  try {
    // Parse the request body to get the messages
    const { messages }: { messages: Message[] } = await req.json(); // Add explicit type here

    // Ensure all messages have valid roles
    if (!validateMessages(messages)) {
      throw new Error('Invalid message format: each message must have a valid role');
    }

    // Fix missing roles if needed (you can remove this if validation is strict enough)
    const fixedMessages = fixMessages(messages);

    // Convert messages into a core format and use GPT-4-turbo model
    const result = await streamText({
      model: openai('gpt-4-turbo'),  // Ensure you're using the correct model
      messages: convertToCoreMessages(fixedMessages),
    });

    // Create a Web Stream (ReadableStream) for the response
    const stream = new ReadableStream({
      async start(controller) {
        // Push the result to the stream
        controller.enqueue(result);
        // Close the stream
        controller.close();
      }
    });

    // Return the Web Stream as a response
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error processing request:', error);

    // Return a user-friendly error message with a 500 status code
    return NextResponse.json({
      error: 'Failed to process the request. Please try again later.'
    }, { status: 500 });
  }
}
