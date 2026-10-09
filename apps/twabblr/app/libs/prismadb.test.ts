import {
  afterAll,
  beforeAll,
  describe,
  expect,
  expectTypeOf,
  it
} from 'vitest';

import prisma, { createPrismaClient } from './prismadb';

// Never executed: these exist so their inferred result types can be checked.
const queries = {
  user: () => prisma.user.findFirstOrThrow(),
  conversationUsers: () =>
    prisma.conversation.findFirstOrThrow({ include: { users: true } }),
  messageUsers: () =>
    prisma.message.findFirstOrThrow({
      include: { sender: true, seen: true }
    }),
  login: () => prisma.user.findFirstOrThrow({ omit: { hashedPassword: false } })
};

describe('prisma client', () => {
  // Checked by `tsc` (pnpm type:check), which includes test files.
  it('types user results without hashedPassword unless a query opts back in', () => {
    expectTypeOf(queries.user).returns.resolves.not.toHaveProperty(
      'hashedPassword'
    );
    expectTypeOf(queries.conversationUsers)
      .returns.resolves.toHaveProperty('users')
      .items.not.toHaveProperty('hashedPassword');
    expectTypeOf(queries.messageUsers)
      .returns.resolves.toHaveProperty('sender')
      .not.toHaveProperty('hashedPassword');
    expectTypeOf(queries.messageUsers)
      .returns.resolves.toHaveProperty('seen')
      .items.not.toHaveProperty('hashedPassword');
    expectTypeOf(queries.login).returns.resolves.toHaveProperty(
      'hashedPassword'
    );
  });
});

/**
 * Runtime check against a real database, since the type check cannot prove
 * Prisma strips the field from nested includes. Opt-in: set TEST_DATABASE_URL
 * (MongoDB replica set) to run it. It writes only records whose emails end in
 * TEST_EMAIL_DOMAIN and deletes them afterwards.
 */
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
const TEST_EMAIL_DOMAIN = '@omit-test.twabblr.invalid';

describe.skipIf(!TEST_DATABASE_URL)('prisma client against a database', () => {
  const HASH = 'not-a-real-bcrypt-hash';
  // The app's own client config, pointed explicitly at the test database so a
  // DATABASE_URL from the environment or a .env file is never written to.
  const db = createPrismaClient(TEST_DATABASE_URL);
  let conversationId = '';

  const cleanUp = async () => {
    const users = await db.user.findMany({
      where: { email: { endsWith: TEST_EMAIL_DOMAIN } },
      select: { id: true }
    });
    const ids = users.map((user) => user.id);
    await db.message.deleteMany({ where: { senderId: { in: ids } } });
    await db.conversation.deleteMany({
      where: { userIds: { hasSome: ids } }
    });
    await db.user.deleteMany({ where: { id: { in: ids } } });
  };

  beforeAll(async () => {
    await cleanUp();

    const sender = await db.user.create({
      data: { email: `sender${TEST_EMAIL_DOMAIN}`, hashedPassword: HASH }
    });
    const recipient = await db.user.create({
      data: { email: `recipient${TEST_EMAIL_DOMAIN}`, hashedPassword: HASH }
    });
    const conversation = await db.conversation.create({
      data: { users: { connect: [{ id: sender.id }, { id: recipient.id }] } }
    });
    conversationId = conversation.id;
    await db.message.create({
      data: {
        body: 'hello',
        conversation: { connect: { id: conversation.id } },
        sender: { connect: { id: sender.id } },
        seen: { connect: { id: sender.id } }
      }
    });
  });

  afterAll(async () => {
    await cleanUp();
    const left = await db.user.count({
      where: { email: { endsWith: TEST_EMAIL_DOMAIN } }
    });
    expect(left).toBe(0);
    await db.$disconnect();
  });

  it('leaves hashedPassword out of top-level and nested user results', async () => {
    const users = await db.user.findMany({
      where: { email: { endsWith: TEST_EMAIL_DOMAIN } }
    });
    const conversation = await db.conversation.findUniqueOrThrow({
      where: { id: conversationId },
      include: {
        users: true,
        messages: { include: { sender: true, seen: true } }
      }
    });

    const returnedUsers = [
      ...users,
      ...conversation.users,
      ...conversation.messages.flatMap((message) => [
        message.sender,
        ...message.seen
      ])
    ];

    expect(returnedUsers).toHaveLength(2 + 2 + 2);
    for (const user of returnedUsers) {
      expect(user).not.toHaveProperty('hashedPassword');
    }
  });

  it('returns hashedPassword to a query that opts back in, as login does', async () => {
    const user = await db.user.findUniqueOrThrow({
      where: { email: `sender${TEST_EMAIL_DOMAIN}` },
      omit: { hashedPassword: false }
    });

    expect(user.hashedPassword).toBe(HASH);
  });
});
