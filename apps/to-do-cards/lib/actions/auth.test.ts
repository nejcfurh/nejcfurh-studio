import { allUsers, seedUsers } from '@/test/fake-user';
import bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { registerAction } from './auth';

vi.mock('@/auth', () => ({ signIn: async () => undefined, signOut: vi.fn() }));
vi.mock('@/lib/db', () => ({ connectDB: async () => undefined }));
vi.mock('@/lib/models/user', async () => ({
  User: (await import('@/test/fake-user')).FakeUser
}));

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

describe('registerAction', () => {
  beforeEach(() => {
    seedUsers([]);
  });

  it('hashes new passwords with bcrypt cost 12', async () => {
    await registerAction(
      form({ name: 'New', email: 'new@example.com', password: 'pw-123456' })
    );

    const [user] = allUsers();
    expect(bcrypt.getRounds(user.password as string)).toBe(12);
    expect(await bcrypt.compare('pw-123456', user.password as string)).toBe(
      true
    );
  });

  it('rejects an empty password without creating an account', async () => {
    const result = await registerAction(
      form({ name: 'New', email: 'new@example.com', password: '' })
    );

    expect(result).toEqual({ error: 'All fields are required.' });
    expect(allUsers()).toEqual([]);
  });
});
