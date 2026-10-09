import { createHash, timingSafeEqual } from 'node:crypto';
import { createAuth } from '@repo/auth/next-auth';

const digest = (value: string) => createHash('sha256').update(value).digest();

// Hashing first gives timingSafeEqual equal-length inputs, so the comparison
// time does not depend on how much of the secret the input matches.
const matchesSecret = (input: unknown, secret: string | undefined) =>
  typeof input === 'string' &&
  !!secret &&
  timingSafeEqual(digest(input), digest(secret));

export const { handlers, auth, signIn, signOut } = createAuth({
  signInPath: '/login',
  credentials: {
    fields: {
      username: { label: 'Username' },
      password: { label: 'Password', type: 'password' }
    },
    authorize: async (credentials) => {
      // Both are compared before either result is used, so a wrong username
      // takes as long to reject as a wrong password.
      const usernameMatches = matchesSecret(
        credentials.username,
        process.env.ADMIN_USERNAME
      );
      const passwordMatches = matchesSecret(
        credentials.password,
        process.env.ADMIN_PASSWORD
      );

      return usernameMatches && passwordMatches
        ? { id: '1', name: 'Admin' }
        : null;
    }
  }
});
