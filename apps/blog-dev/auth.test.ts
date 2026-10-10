import type { Authorize, CreateAuthOptions } from '@repo/auth/next-auth';
import { afterEach, describe, expect, it, vi } from 'vitest';

const captured = vi.hoisted(() => ({ options: {} as CreateAuthOptions }));

vi.mock('@repo/auth/next-auth', () => ({
  createAuth: (options: CreateAuthOptions) => {
    captured.options = options;
    return {};
  }
}));

await import('./auth');

const authorize: Authorize = (credentials) => {
  const check = captured.options.credentials?.authorize;
  if (!check) throw new Error('auth.ts registered no credentials check');
  return check(credentials);
};

const ADMIN = { id: '1', name: 'Admin' };

describe('blog-dev admin login', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('with the admin credentials configured', () => {
    const configure = () => {
      vi.stubEnv('ADMIN_USERNAME', 'admin');
      vi.stubEnv('ADMIN_PASSWORD', 'correct horse');
    };

    it('accepts the configured username and password', async () => {
      configure();

      await expect(
        authorize({ username: 'admin', password: 'correct horse' })
      ).resolves.toEqual(ADMIN);
    });

    it.each([
      ['a wrong password', { username: 'admin', password: 'wrong' }],
      ['a password prefix', { username: 'admin', password: 'correct' }],
      ['a wrong username', { username: 'root', password: 'correct horse' }],
      ['an empty password', { username: 'admin', password: '' }],
      ['a missing password', { username: 'admin' }],
      ['a non-string password', { username: 'admin', password: ['x'] }],
      ['no credentials at all', {}]
    ])('rejects %s', async (_, credentials) => {
      configure();

      await expect(authorize(credentials)).resolves.toBeNull();
    });
  });

  describe.each([
    ['both are missing', undefined, undefined],
    ['the username is missing', undefined, 'correct horse'],
    ['the password is missing', 'admin', undefined],
    ['both are empty', '', ''],
    ['the password is empty', 'admin', '']
  ])('when the admin env vars: %s', (_, username, password) => {
    it.each([
      ['no credentials', {}],
      ['empty credentials', { username: '', password: '' }],
      [
        'the configured values',
        { username: username ?? '', password: password ?? '' }
      ]
    ])('rejects %s', async (__, credentials) => {
      vi.stubEnv('ADMIN_USERNAME', username);
      vi.stubEnv('ADMIN_PASSWORD', password);

      await expect(authorize(credentials)).resolves.toBeNull();
    });
  });
});
