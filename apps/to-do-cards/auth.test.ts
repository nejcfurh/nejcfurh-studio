import { allUsers, seedUsers } from '@/test/fake-user';
import type {
  CreateAuthOptions,
  OAuthSignInParams
} from '@repo/auth/next-auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const captured = vi.hoisted(() => ({ options: {} as CreateAuthOptions }));

vi.mock('@repo/auth/next-auth', () => ({
  createAuth: (options: CreateAuthOptions) => {
    captured.options = options;
    return {};
  }
}));
vi.mock('@/lib/db', () => ({ connectDB: async () => undefined }));
vi.mock('@/lib/models/user', async () => ({
  User: (await import('@/test/fake-user')).FakeUser
}));

await import('./auth');

type Account = NonNullable<OAuthSignInParams['account']>;

const oauthAccount = (provider: string, providerAccountId: string) =>
  ({ provider, providerAccountId, type: 'oauth' }) as Account;

const signInWith = async (
  provider: string,
  providerAccountId: string,
  email: string | null
) => {
  const account = oauthAccount(provider, providerAccountId);
  const user = { name: 'OAuth User', email };
  await captured.options.onOAuthSignIn?.({ user, account });
  return captured.options.resolveUserId?.({ user, account });
};

const PASSWORD_ACCOUNT = {
  name: 'Victim',
  email: 'victim@example.com',
  password: '$2b$12$hash-of-the-real-owner',
  lists: []
};

describe('to-do-cards OAuth sign-in', () => {
  beforeEach(() => {
    seedUsers([PASSWORD_ACCOUNT]);
  });

  it.each(['google', 'facebook'])(
    'refuses a %s login whose email belongs to an existing password account',
    async (provider) => {
      await expect(
        signInWith(provider, 'attacker-1', PASSWORD_ACCOUNT.email)
      ).rejects.toThrow('already exists');

      expect(allUsers()).toEqual([{ ...PASSWORD_ACCOUNT, _id: 'user-1' }]);
    }
  );

  it.each(['google', 'facebook'])(
    'never resolves a %s login to an account only because the email matches',
    async (provider) => {
      const userId = await captured.options.resolveUserId?.({
        user: { email: PASSWORD_ACCOUNT.email },
        account: oauthAccount(provider, 'attacker-1')
      });

      expect(userId).toBeUndefined();
    }
  );

  it('refuses a GitHub login whose email belongs to an existing password account', async () => {
    await expect(
      signInWith('github', 'attacker-1', PASSWORD_ACCOUNT.email)
    ).rejects.toThrow('duplicate key');
  });

  it.each([
    ['google', 'googleId'],
    ['facebook', 'facebookId']
  ])(
    'creates an account on the first %s login with an unused email and resolves to it',
    async (provider, idField) => {
      const userId = await signInWith(provider, 'new-1', 'new@example.com');

      const created = allUsers().find((user) => user._id === userId);
      expect(created).toMatchObject({
        email: 'new@example.com',
        [idField]: 'new-1'
      });
    }
  );

  it('resolves a returning Google user by provider id, even after the provider email changed', async () => {
    const [, owner] = seedUsers([
      PASSWORD_ACCOUNT,
      { name: 'Owner', email: 'old@example.com', googleId: 'g-1', lists: [] }
    ]);

    const userId = await signInWith('google', 'g-1', 'renamed@example.com');

    expect(userId).toBe(owner._id);
    expect(allUsers()).toHaveLength(2);
  });

  it('leaves the session without a user id when the provider account id is missing', async () => {
    const userId = await captured.options.resolveUserId?.({
      user: { email: PASSWORD_ACCOUNT.email },
      account: oauthAccount('google', '')
    });

    expect(userId).toBeUndefined();
  });

  it('leaves the session without a user id for a provider the app does not map', async () => {
    const userId = await captured.options.resolveUserId?.({
      user: { email: PASSWORD_ACCOUNT.email },
      account: oauthAccount('unknown', 'x-1')
    });

    expect(userId).toBeUndefined();
  });
});
