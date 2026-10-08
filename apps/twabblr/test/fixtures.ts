import type { FakeSeed } from './fake-prisma';

export const alice = {
  id: 'user-alice',
  email: 'alice@test.dev',
  name: 'Alice'
};
export const bob = { id: 'user-bob', email: 'bob@test.dev', name: 'Bob' };
export const mallory = {
  id: 'user-mallory',
  email: 'mallory@test.dev',
  name: 'Mallory'
};

/** Alice and Bob share one conversation; Mallory is in none. */
export const CONVERSATION_ID = 'conversation-alice-bob';

export const baseSeed = (): FakeSeed => ({
  users: [alice, bob, mallory],
  conversations: [{ id: CONVERSATION_ID, userIds: [alice.id, bob.id] }],
  messages: [
    {
      id: 'message-hello',
      conversationId: CONVERSATION_ID,
      senderId: alice.id,
      seenIds: [alice.id],
      body: 'hello'
    }
  ]
});
