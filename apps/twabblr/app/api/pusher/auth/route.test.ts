import { createHmac } from 'node:crypto';
import { alice, baseSeed, CONVERSATION_ID, mallory } from '@/test/fixtures';
import {
  PUSHER_KEY,
  PUSHER_SECRET,
  resetDoubles,
  signInAs
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

const SOCKET_ID = '1234.5678';

const authorize = (channel: string) =>
  POST(
    new Request('http://localhost/api/pusher/auth', {
      method: 'POST',
      body: new URLSearchParams({
        socket_id: SOCKET_ID,
        channel_name: channel
      }).toString()
    })
  );

const expectedSignature = (stringToSign: string) =>
  `${PUSHER_KEY}:${createHmac('sha256', PUSHER_SECRET).update(stringToSign).digest('hex')}`;

describe('POST /api/pusher/auth', () => {
  beforeEach(() => {
    resetDoubles(baseSeed());
  });

  it('rejects a request without a session', async () => {
    const response = await authorize(`private-user-${alice.id}`);

    expect(response.status).toBe(401);
  });

  it("signs the user's own user channel", async () => {
    signInAs(alice.email);
    const channel = `private-user-${alice.id}`;

    const response = await authorize(channel);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      auth: expectedSignature(`${SOCKET_ID}:${channel}`)
    });
  });

  it("refuses another user's user channel", async () => {
    signInAs(mallory.email);

    const response = await authorize(`private-user-${alice.id}`);

    expect(response.status).toBe(403);
  });

  it('signs a conversation channel for a member', async () => {
    signInAs(alice.email);
    const channel = `private-conversation-${CONVERSATION_ID}`;

    const response = await authorize(channel);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      auth: expectedSignature(`${SOCKET_ID}:${channel}`)
    });
  });

  it('refuses a conversation channel to a non-member', async () => {
    signInAs(mallory.email);

    const response = await authorize(`private-conversation-${CONVERSATION_ID}`);

    expect(response.status).toBe(403);
  });

  it('refuses a conversation channel for a conversation that does not exist', async () => {
    signInAs(alice.email);

    const response = await authorize('private-conversation-missing');

    expect(response.status).toBe(403);
  });

  it('signs the presence channel with the email as the member id', async () => {
    signInAs(mallory.email);
    const channel = 'presence-messenger';
    const channelData = JSON.stringify({ user_id: mallory.email });

    const response = await authorize(channel);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      auth: expectedSignature(`${SOCKET_ID}:${channel}:${channelData}`),
      channel_data: channelData
    });
  });

  it.each([
    ['a bare conversation id', CONVERSATION_ID],
    ['a bare email', alice.email],
    ['an unknown private channel', 'private-anything'],
    ['an empty user channel', 'private-user-']
  ])('refuses %s', async (_label, channel) => {
    signInAs(alice.email);

    const response = await authorize(channel);

    expect(response.status).toBe(403);
  });
});
