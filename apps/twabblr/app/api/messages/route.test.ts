import {
  alice,
  baseSeed,
  bob,
  CONVERSATION_ID,
  mallory
} from '@/test/fixtures';
import {
  fakePrisma,
  resetDoubles,
  signInAs,
  triggeredEvents
} from '@/test/mocks';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from './route';

vi.mock('@/auth', async () => ({ auth: (await import('@/test/mocks')).auth }));
vi.mock('@/app/libs/prismadb', async () => ({
  default: (await import('@/test/mocks')).fakePrisma
}));
vi.mock('@/app/libs/pusher', async () => ({
  pusherServer: (await import('@/test/mocks')).pusherServer
}));

const sendMessage = (body: unknown) =>
  POST(
    new Request('http://localhost/api/messages', {
      method: 'POST',
      body: JSON.stringify(body)
    })
  );

describe('POST /api/messages', () => {
  beforeEach(() => {
    resetDoubles(baseSeed());
  });

  it('rejects a request without a session', async () => {
    const response = await sendMessage({
      message: 'hi',
      conversationId: CONVERSATION_ID
    });

    expect(response.status).toBe(401);
    expect(fakePrisma.message.create).not.toHaveBeenCalled();
  });

  it('returns 404 and stores nothing when the sender is not a member', async () => {
    signInAs(mallory.email);

    const response = await sendMessage({
      message: 'let me in',
      conversationId: CONVERSATION_ID
    });

    expect(response.status).toBe(404);
    expect(fakePrisma.message.create).not.toHaveBeenCalled();
    expect(triggeredEvents()).toEqual([]);
  });

  it.each([
    ['no conversation id', { message: 'hi' }],
    ['neither text nor image', { conversationId: CONVERSATION_ID }],
    ['blank text', { message: '   ', conversationId: CONVERSATION_ID }],
    [
      'an image that is not a URL',
      { image: 'not a url', conversationId: CONVERSATION_ID }
    ],
    ['a non-string message', { message: 42, conversationId: CONVERSATION_ID }]
  ])('returns 400 for a body with %s', async (_label, body) => {
    signInAs(alice.email);

    const response = await sendMessage(body);

    expect(response.status).toBe(400);
    expect(fakePrisma.message.create).not.toHaveBeenCalled();
  });

  it('returns 400 for a body that is not JSON', async () => {
    signInAs(alice.email);

    const response = await POST(
      new Request('http://localhost/api/messages', {
        method: 'POST',
        body: 'not json'
      })
    );

    expect(response.status).toBe(400);
  });

  it('stores a member message and announces it on private channels only', async () => {
    signInAs(alice.email);

    const response = await sendMessage({
      message: 'hi Bob',
      conversationId: CONVERSATION_ID
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      body: 'hi Bob',
      conversationId: CONVERSATION_ID,
      senderId: alice.id
    });
    expect(triggeredEvents()).toEqual([
      {
        channel: `private-conversation-${CONVERSATION_ID}`,
        event: 'messages:new'
      },
      { channel: `private-user-${alice.id}`, event: 'conversation:update' },
      { channel: `private-user-${bob.id}`, event: 'conversation:update' }
    ]);
  });

  it('stores an image message from a member', async () => {
    signInAs(bob.email);

    const response = await sendMessage({
      image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      conversationId: CONVERSATION_ID
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      senderId: bob.id
    });
  });
});
