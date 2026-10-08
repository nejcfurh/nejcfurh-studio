/// <reference types="vite/client" />

import { convexTest } from 'convex-test';
import { Webhook } from 'svix';
import { describe, expect, it } from 'vitest';

import { api } from './_generated/api';
import { Id } from './_generated/dataModel';
import { CLERK_DOMAIN } from './auth.config';
import schema from './schema';

const modules = import.meta.glob('./**/*.*s');

type Role = 'admin' | 'member';

const tokenFor = (clerkUserId: string) => `${CLERK_DOMAIN}|${clerkUserId}`;

const setup = () => convexTest(schema, modules);

type TestConvex = ReturnType<typeof setup>;

const insertUser = (
  t: TestConvex,
  clerkUserId: string,
  organizationIds: { organizationId: string; role: Role }[]
) =>
  t.run((ctx) =>
    ctx.db.insert('users', {
      tokenIdentifier: tokenFor(clerkUserId),
      organizationIds,
      name: clerkUserId
    })
  );

const getUserDoc = (t: TestConvex, userId: Id<'users'>) =>
  t.run((ctx) => ctx.db.get(userId));

const insertFile = (
  t: TestConvex,
  organizationId: string,
  userId: Id<'users'>
) =>
  t.run(async (ctx) => {
    const storageId = await ctx.storage.store(new Blob(['hello']));
    return ctx.db.insert('files', {
      fileId: storageId,
      type: 'csv',
      name: 'report.csv',
      organizationId,
      userId
    });
  });

const asClerkUser = (t: TestConvex, clerkUserId: string) =>
  t.withIdentity({
    tokenIdentifier: tokenFor(clerkUserId),
    subject: clerkUserId,
    issuer: CLERK_DOMAIN
  });

const sendClerkWebhook = (
  t: TestConvex,
  event: { type: string; data: unknown },
  options: { tamper?: boolean } = {}
) => {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set for tests');
  }

  const payload = JSON.stringify({ object: 'event', ...event });
  const msgId = `msg_${crypto.randomUUID()}`;
  const timestamp = new Date();
  const signature = new Webhook(secret).sign(msgId, timestamp, payload);

  return t.fetch('/clerk', {
    method: 'POST',
    body: options.tamper ? payload.replace('org_', 'org_x') : payload,
    headers: {
      'svix-id': msgId,
      'svix-timestamp': Math.floor(timestamp.getTime() / 1000).toString(),
      'svix-signature': signature
    }
  });
};

const membershipEvent = (
  type: string,
  clerkUserId: string,
  organizationId: string,
  role: 'org:admin' | 'org:member'
) => ({
  type,
  data: {
    object: 'organization_membership',
    id: `orgmem_${clerkUserId}_${organizationId}`,
    role,
    organization: { id: organizationId },
    public_user_data: { user_id: clerkUserId }
  }
});

describe('Clerk organization membership webhook', () => {
  it('removes the organization from the user when a membership is deleted', async () => {
    const t = setup();
    const userId = await insertUser(t, 'user_a', [
      { organizationId: 'org_1', role: 'member' },
      { organizationId: 'org_2', role: 'admin' }
    ]);

    const response = await sendClerkWebhook(
      t,
      membershipEvent(
        'organizationMembership.deleted',
        'user_a',
        'org_1',
        'org:member'
      )
    );

    expect(response.status).toBe(200);
    expect((await getUserDoc(t, userId))?.organizationIds).toEqual([
      { organizationId: 'org_2', role: 'admin' }
    ]);
  });

  it('cuts a removed member off from the organization files', async () => {
    const t = setup();
    const ownerId = await insertUser(t, 'user_owner', [
      { organizationId: 'org_1', role: 'admin' }
    ]);
    await insertUser(t, 'user_a', [
      { organizationId: 'org_1', role: 'member' }
    ]);
    await insertFile(t, 'org_1', ownerId);
    const member = asClerkUser(t, 'user_a');

    expect(
      await member.query(api.files.getFiles, { organizationId: 'org_1' })
    ).toHaveLength(1);

    await sendClerkWebhook(
      t,
      membershipEvent(
        'organizationMembership.deleted',
        'user_a',
        'org_1',
        'org:member'
      )
    );

    expect(
      await member.query(api.files.getFiles, { organizationId: 'org_1' })
    ).toEqual([]);
  });

  it('treats a repeated delete as a no-op', async () => {
    const t = setup();
    const userId = await insertUser(t, 'user_a', [
      { organizationId: 'org_2', role: 'member' }
    ]);

    const response = await sendClerkWebhook(
      t,
      membershipEvent(
        'organizationMembership.deleted',
        'user_a',
        'org_1',
        'org:member'
      )
    );

    expect(response.status).toBe(200);
    expect((await getUserDoc(t, userId))?.organizationIds).toEqual([
      { organizationId: 'org_2', role: 'member' }
    ]);
  });

  it('writes the new role when a membership is updated', async () => {
    const t = setup();
    const userId = await insertUser(t, 'user_a', [
      { organizationId: 'org_1', role: 'admin' },
      { organizationId: 'org_2', role: 'admin' }
    ]);

    const response = await sendClerkWebhook(
      t,
      membershipEvent(
        'organizationMembership.updated',
        'user_a',
        'org_1',
        'org:member'
      )
    );

    expect(response.status).toBe(200);
    expect((await getUserDoc(t, userId))?.organizationIds).toEqual([
      { organizationId: 'org_1', role: 'member' },
      { organizationId: 'org_2', role: 'admin' }
    ]);
  });

  it("stops a demoted admin from deleting other users' files", async () => {
    const t = setup();
    const ownerId = await insertUser(t, 'user_owner', [
      { organizationId: 'org_1', role: 'member' }
    ]);
    await insertUser(t, 'user_a', [{ organizationId: 'org_1', role: 'admin' }]);
    const fileId = await insertFile(t, 'org_1', ownerId);

    await sendClerkWebhook(
      t,
      membershipEvent(
        'organizationMembership.updated',
        'user_a',
        'org_1',
        'org:member'
      )
    );

    await expect(
      asClerkUser(t, 'user_a').mutation(api.files.deleteFile, { fileId })
    ).rejects.toThrow('You do not have sufficient permissions');
  });

  it('adds the organization when a membership is created', async () => {
    const t = setup();
    const userId = await insertUser(t, 'user_a', []);

    await sendClerkWebhook(
      t,
      membershipEvent(
        'organizationMembership.created',
        'user_a',
        'org_1',
        'org:admin'
      )
    );

    expect((await getUserDoc(t, userId))?.organizationIds).toEqual([
      { organizationId: 'org_1', role: 'admin' }
    ]);
  });

  it('rejects a payload whose signature does not match', async () => {
    const t = setup();
    const userId = await insertUser(t, 'user_a', [
      { organizationId: 'org_1', role: 'member' }
    ]);

    const response = await sendClerkWebhook(
      t,
      membershipEvent(
        'organizationMembership.deleted',
        'user_a',
        'org_1',
        'org:member'
      ),
      { tamper: true }
    );

    expect(response.status).toBe(500);
    expect((await getUserDoc(t, userId))?.organizationIds).toEqual([
      { organizationId: 'org_1', role: 'member' }
    ]);
  });
});

describe('personal workspace access', () => {
  it('lets a user read files in their own personal workspace', async () => {
    const t = setup();
    const userId = await insertUser(t, 'user_1', []);
    await insertFile(t, 'user_1', userId);

    expect(
      await asClerkUser(t, 'user_1').query(api.files.getFiles, {
        organizationId: 'user_1'
      })
    ).toHaveLength(1);
  });

  it('does not grant access when the organization id is only a substring of the token', async () => {
    const t = setup();
    const ownerId = await insertUser(t, 'user_1', []);
    await insertUser(t, 'user_12', []);
    await insertFile(t, 'user_1', ownerId);
    await insertFile(t, 'clerk', ownerId);
    const other = asClerkUser(t, 'user_12');

    expect(
      await other.query(api.files.getFiles, { organizationId: 'user_1' })
    ).toEqual([]);
    expect(
      await other.query(api.files.getFiles, { organizationId: 'clerk' })
    ).toEqual([]);
  });
});

describe('getStorage', () => {
  it('returns a URL to a member of the file organization', async () => {
    const t = setup();
    const userId = await insertUser(t, 'user_a', [
      { organizationId: 'org_1', role: 'member' }
    ]);
    const fileId = await insertFile(t, 'org_1', userId);

    expect(
      await asClerkUser(t, 'user_a').query(api.files.getStorage, { fileId })
    ).toEqual(expect.any(String));
  });

  it('returns null to a signed-out caller and to a non-member', async () => {
    const t = setup();
    const ownerId = await insertUser(t, 'user_a', [
      { organizationId: 'org_1', role: 'member' }
    ]);
    await insertUser(t, 'user_b', [{ organizationId: 'org_2', role: 'admin' }]);
    const fileId = await insertFile(t, 'org_1', ownerId);

    expect(await t.query(api.files.getStorage, { fileId })).toBeNull();
    expect(
      await asClerkUser(t, 'user_b').query(api.files.getStorage, { fileId })
    ).toBeNull();
  });
});

describe('getUserProfile', () => {
  it('returns the profile to a signed-in caller', async () => {
    const t = setup();
    const userId = await insertUser(t, 'user_a', []);
    await insertUser(t, 'user_b', []);

    expect(
      await asClerkUser(t, 'user_b').query(api.users.getUserProfile, {
        userId
      })
    ).toEqual({ name: 'user_a', imageUrl: undefined });
  });

  it('returns null to a signed-out caller', async () => {
    const t = setup();
    const userId = await insertUser(t, 'user_a', []);

    expect(await t.query(api.users.getUserProfile, { userId })).toBeNull();
  });
});
