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

import { DELETE } from './route';

vi.mock('@/auth', async () => ({ auth: (await import('@/test/mocks')).auth }));
vi.mock('@/app/libs/prismadb', async () => ({
  default: (await import('@/test/mocks')).fakePrisma
}));
vi.mock('@/app/libs/pusher', async () => ({
  pusherServer: (await import('@/test/mocks')).pusherServer
}));

const deleteConversation = (conversationId: string) =>
  DELETE(
    new Request(`http://localhost/api/conversations/${conversationId}`, {
      method: 'DELETE'
    }),
    { params: Promise.resolve({ conversationId }) }
  );

describe('DELETE /api/conversations/[conversationId]', () => {
  beforeEach(() => {
    resetDoubles(baseSeed());
  });

  it('returns 404 to a non-member and does not announce a removal to the members', async () => {
    signInAs(mallory.email);

    const response = await deleteConversation(CONVERSATION_ID);

    expect(response.status).toBe(404);
    expect(fakePrisma.conversation.deleteMany).not.toHaveBeenCalled();
    expect(triggeredEvents()).toEqual([]);
  });

  it('deletes the conversation for a member and tells each member privately', async () => {
    signInAs(alice.email);

    const response = await deleteConversation(CONVERSATION_ID);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ count: 1 });
    expect(triggeredEvents()).toEqual([
      { channel: `private-user-${alice.id}`, event: 'conversation:remove' },
      { channel: `private-user-${bob.id}`, event: 'conversation:remove' }
    ]);
  });
});
