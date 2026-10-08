import { alice, baseSeed, CONVERSATION_ID, mallory } from '@/test/fixtures';
import { resetDoubles, signInAs } from '@/test/mocks';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import getConversationById from './getConversationById';
import getMessages from './getMessages';

vi.mock('@/auth', async () => ({ auth: (await import('@/test/mocks')).auth }));
vi.mock('@/app/libs/prismadb', async () => ({
  default: (await import('@/test/mocks')).fakePrisma
}));

describe('conversation page data', () => {
  beforeEach(() => {
    resetDoubles(baseSeed());
  });

  describe('getConversationById', () => {
    it('returns the conversation to a member', async () => {
      signInAs(alice.email);

      const conversation = await getConversationById(CONVERSATION_ID);

      expect(conversation?.id).toBe(CONVERSATION_ID);
    });

    it('returns null to a non-member', async () => {
      signInAs(mallory.email);

      expect(await getConversationById(CONVERSATION_ID)).toBeNull();
    });

    it('returns null without a session', async () => {
      expect(await getConversationById(CONVERSATION_ID)).toBeNull();
    });
  });

  describe('getMessages', () => {
    it('returns the messages to a member', async () => {
      signInAs(alice.email);

      const messages = await getMessages(CONVERSATION_ID);

      expect(messages.map((message) => message.body)).toEqual(['hello']);
    });

    it('returns nothing to a non-member', async () => {
      signInAs(mallory.email);

      expect(await getMessages(CONVERSATION_ID)).toEqual([]);
    });

    it('returns nothing without a session', async () => {
      expect(await getMessages(CONVERSATION_ID)).toEqual([]);
    });
  });
});
