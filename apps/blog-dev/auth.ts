import { createAuth } from '@repo/auth/next-auth';

export const { handlers, auth, signIn, signOut } = createAuth({
  signInPath: '/login',
  credentials: {
    fields: {
      username: { label: 'Username' },
      password: { label: 'Password', type: 'password' }
    },
    authorize: async (credentials) => {
      const { username, password } = credentials as {
        username: string;
        password: string;
      };

      if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
      ) {
        return { id: '1', name: 'Admin' };
      }

      return null;
    }
  }
});
