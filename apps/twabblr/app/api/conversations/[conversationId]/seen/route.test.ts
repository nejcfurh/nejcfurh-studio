import { baseSeed, bob, CONVERSATION_ID, mallory } from '@/test/fixtures';
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

const markSeen = (conversationId: string) =>
  POST(
    new Request(`http://localhost/api/conversations/${conversationId}/seen`, {
      method: 'POST'
    }),
    { params: Promise.resolve({ conversationId }) }
  );

describe('POST /api/conversations/[conversationId]/seen', () => {
  beforeEach(() => {
    resetDoubles(baseSeed());
  });

  it('returns 404 to a non-member without reading or touching messages', async () => {
    signInAs(mallory.email);

    const response = await markSeen(CONVERSATION_ID);

    expect(response.status).toBe(404);
    expect(await response.text()).not.toContain('hello');
    expect(fakePrisma.message.update).not.toHaveBeenCalled();
    expect(triggeredEvents()).toEqual([]);
  });

  it('returns 404 for a conversation that does not exist', async () => {
    signInAs(bob.email);

    const response = await markSeen('missing');

    expect(response.status).toBe(404);
  });

  it('marks the last message seen for a member and announces it privately', async () => {
    signInAs(bob.email);

    const response = await markSeen(CONVERSATION_ID);

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      id: 'message-hello',
      seenIds: expect.arrayContaining([bob.id])
    });
    expect(triggeredEvents()).toEqual([
      { channel: `private-user-${bob.id}`, event: 'conversation:update' },
      {
        channel: `private-conversation-${CONVERSATION_ID}`,
        event: 'message:update'
      }
    ]);
  });
});
