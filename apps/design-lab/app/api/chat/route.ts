import { convertToModelMessages, google, streamText } from '@repo/ai-sdk';
import { z } from '@repo/validation';
import { NextResponse } from 'next/server';

const MAX_MESSAGES = 40;
const MAX_PARTS_PER_MESSAGE = 10;
const MAX_TEXT_LENGTH = 4000;
const MAX_OUTPUT_TOKENS = 1024;

const TextPartSchema = z.object({
  type: z.enum(['text', 'reasoning']),
  text: z.string().max(MAX_TEXT_LENGTH)
});

const StepStartPartSchema = z.object({ type: z.literal('step-start') });

// Only user and assistant turns are accepted, so a client cannot inject a
// system message that overrides the server's system prompt.
const MessageSchema = z.object({
  id: z.string().max(100),
  role: z.enum(['user', 'assistant']),
  parts: z
    .array(z.union([TextPartSchema, StepStartPartSchema]))
    .max(MAX_PARTS_PER_MESSAGE)
});

const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(MAX_MESSAGES)
});

export async function POST(req: Request) {
  const parsed = ChatRequestSchema.safeParse(
    await req.json().catch(() => null)
  );

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const modelMessages = convertToModelMessages(parsed.data.messages);

  const result = await streamText({
    model: google('gemini-2.5-flash-lite'),
    system: 'You are a helpful assistant.',
    messages: modelMessages,
    maxOutputTokens: MAX_OUTPUT_TOKENS
  });

  return result.toUIMessageStreamResponse();
}
