import { vi } from 'vitest';

/**
 * In-memory stand-in for the Prisma client, covering only the queries the
 * route handlers and actions make. Filters are evaluated the way Prisma
 * evaluates them, and an unsupported filter key throws: a handler that drops
 * or reshapes its membership filter fails loudly instead of matching rows it
 * should not see.
 */

export interface FakeUser {
  id: string;
  email: string;
  name: string;
}

export interface FakeConversation {
  id: string;
  userIds: string[];
}

export interface FakeMessage {
  id: string;
  conversationId: string;
  senderId: string;
  seenIds: string[];
  body?: string;
  image?: string;
}

type Where = Record<string, unknown>;

const assertKnownKeys = (where: Where, allowed: string[], model: string) => {
  for (const key of Object.keys(where)) {
    if (!allowed.includes(key)) {
      throw new Error(`fake prisma: unsupported ${model} filter "${key}"`);
    }
  }
};

const matchesUserIds = (userIds: string[], filter: unknown) => {
  if (filter === undefined) {
    return true;
  }
  const { has, hasSome } = filter as { has?: string; hasSome?: string[] };
  assertKnownKeys(filter as Where, ['has', 'hasSome'], 'userIds');
  if (has !== undefined && !userIds.includes(has)) {
    return false;
  }
  if (hasSome !== undefined && !hasSome.some((id) => userIds.includes(id))) {
    return false;
  }
  return true;
};

const matchesConversation = (conversation: FakeConversation, where: Where) => {
  assertKnownKeys(where, ['id', 'userIds'], 'conversation');
  if (where.id !== undefined && conversation.id !== where.id) {
    return false;
  }
  return matchesUserIds(conversation.userIds, where.userIds);
};

export interface FakeSeed {
  users: FakeUser[];
  conversations: FakeConversation[];
  messages?: FakeMessage[];
}

export const createFakePrisma = () => {
  let users: FakeUser[] = [];
  let conversations: FakeConversation[] = [];
  let messages: FakeMessage[] = [];
  let nextMessageId = 1;

  const seed = (data: FakeSeed) => {
    users = data.users.map((user) => ({ ...user }));
    conversations = data.conversations.map((conversation) => ({
      ...conversation,
      userIds: [...conversation.userIds]
    }));
    messages = (data.messages ?? []).map((message) => ({
      ...message,
      seenIds: [...message.seenIds]
    }));
    nextMessageId = 1;
  };

  const userById = (id: string) => users.find((user) => user.id === id);

  // Copies seenIds so a returned row is a snapshot, as it is from Prisma.
  const withMessageRelations = (message: FakeMessage) => ({
    ...message,
    seenIds: [...message.seenIds],
    sender: userById(message.senderId),
    seen: message.seenIds.map(userById)
  });

  const withConversationRelations = (conversation: FakeConversation) => ({
    ...conversation,
    users: conversation.userIds.map(userById),
    messages: messages
      .filter((message) => message.conversationId === conversation.id)
      .map(withMessageRelations)
  });

  const findConversation = (where: Where) =>
    conversations.find((conversation) =>
      matchesConversation(conversation, where)
    );

  return {
    seed,
    user: {
      findUnique: vi.fn(async ({ where }: { where: Where }) => {
        assertKnownKeys(where, ['email'], 'user');
        return users.find((user) => user.email === where.email) ?? null;
      })
    },
    conversation: {
      findFirst: vi.fn(async ({ where }: { where: Where }) => {
        const conversation = findConversation(where);
        return conversation ? withConversationRelations(conversation) : null;
      }),
      findUnique: vi.fn(async ({ where }: { where: Where }) => {
        const conversation = findConversation(where);
        return conversation ? withConversationRelations(conversation) : null;
      }),
      update: vi.fn(async ({ where }: { where: Where }) => {
        const conversation = findConversation(where);
        if (!conversation) {
          throw new Error('fake prisma: conversation to update not found');
        }
        return withConversationRelations(conversation);
      }),
      deleteMany: vi.fn(async ({ where }: { where: Where }) => {
        const matching = conversations.filter((conversation) =>
          matchesConversation(conversation, where)
        );
        for (const conversation of matching) {
          conversations.splice(conversations.indexOf(conversation), 1);
        }
        return { count: matching.length };
      })
    },
    message: {
      findMany: vi.fn(async ({ where }: { where: Where }) => {
        assertKnownKeys(where, ['conversationId', 'conversation'], 'message');
        return messages
          .filter((message) => {
            if (
              where.conversationId !== undefined &&
              message.conversationId !== where.conversationId
            ) {
              return false;
            }
            if (where.conversation === undefined) {
              return true;
            }
            const conversation = conversations.find(
              (candidate) => candidate.id === message.conversationId
            );
            return (
              conversation !== undefined &&
              matchesConversation(conversation, where.conversation as Where)
            );
          })
          .map(withMessageRelations);
      }),
      create: vi.fn(
        async ({
          data
        }: {
          data: {
            body?: string;
            image?: string;
            conversation: { connect: { id: string } };
            sender: { connect: { id: string } };
          };
        }) => {
          const message: FakeMessage = {
            id: `message-${nextMessageId++}`,
            conversationId: data.conversation.connect.id,
            senderId: data.sender.connect.id,
            seenIds: [data.sender.connect.id],
            body: data.body,
            image: data.image
          };
          messages.push(message);
          return withMessageRelations(message);
        }
      ),
      update: vi.fn(
        async ({
          where,
          data
        }: {
          where: { id: string };
          data: { seen: { connect: { id: string } } };
        }) => {
          const message = messages.find(
            (candidate) => candidate.id === where.id
          );
          if (!message) {
            throw new Error('fake prisma: message to update not found');
          }
          if (!message.seenIds.includes(data.seen.connect.id)) {
            message.seenIds.push(data.seen.connect.id);
          }
          return withMessageRelations(message);
        }
      )
    }
  };
};

export type FakePrisma = ReturnType<typeof createFakePrisma>;
