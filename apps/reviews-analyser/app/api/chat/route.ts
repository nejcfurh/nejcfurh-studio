import { google, convertToModelMessages, streamText } from '@repo/shared/ai-sdk';

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages ?? [];

  const modelMessages = convertToModelMessages(messages);

  const result = await streamText({
    model: google('gemini-2.5-flash-lite'),
    system: 'You are a helpful assistant.',
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
