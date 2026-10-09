import { seedUsers } from '@/test/fake-user';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getAccountInfo, updateAvatar } from './account';

const session = vi.hoisted(() => ({ userId: '' }));

vi.mock('@/auth', () => ({
  auth: async () => ({ user: { id: session.userId } })
}));
vi.mock('@/lib/db', () => ({ connectDB: async () => undefined }));
vi.mock('@/lib/models/user', async () => ({
  User: (await import('@/test/fake-user')).FakeUser
}));
vi.mock('next/cache', () => ({ revalidatePath: () => undefined }));

describe('account actions', () => {
  beforeEach(() => {
    const [user] = seedUsers([
      {
        name: 'Owner',
        email: 'owner@example.com',
        password: '$2b$12$secret-hash',
        lists: []
      }
    ]);
    session.userId = user._id;
  });

  it('returns the account without the password hash', async () => {
    const user = await getAccountInfo();

    expect(user).toMatchObject({ email: 'owner@example.com' });
    expect(user).not.toHaveProperty('password');
  });

  it('returns the updated account without the password hash', async () => {
    const user = await updateAvatar('avatar.png');

    expect(user).toMatchObject({ avatar: 'avatar.png' });
    expect(user).not.toHaveProperty('password');
  });
});
