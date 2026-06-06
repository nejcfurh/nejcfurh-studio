import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { createAuth } from '@repo/auth/next-auth';
import bcrypt from 'bcrypt';

const DAILY_LIST = {
  name: 'Daily',
  url: 'https://images.unsplash.com/photo-1506485338023-6ce5f36692df?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  body: 'Daily tasks!'
};

export const { handlers, auth, signIn, signOut } = createAuth({
  signInPath: '/login',
  providers: ['google', 'facebook', 'twitter', 'github'],
  credentials: {
    authorize: async (credentials) => {
      const { email, password } = credentials as {
        email: string;
        password: string;
      };

      await connectDB();
      const user = await User.findOne({ email });

      if (!user || !user.password) return null;

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return null;

      return { id: user._id.toString(), email: user.email, name: user.name };
    }
  },
  onOAuthSignIn: async ({ user, account, profile }) => {
    await connectDB();
    const provider = account?.provider;

    if (provider === 'google') {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create({
          googleId: account?.providerAccountId,
          name: user.name || profile?.name,
          email: user.email,
          lists: [DAILY_LIST]
        });
      }
    } else if (provider === 'facebook') {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create({
          facebookId: account?.providerAccountId,
          name: user.name,
          email: user.email,
          lists: [DAILY_LIST]
        });
      }
    } else if (provider === 'twitter') {
      const existingUser = await User.findOne({
        twitterXId: account?.providerAccountId
      });
      if (!existingUser) {
        // Twitter OAuth 2.0 never returns an email, so we synthesise one.
        // It must be unique (email has a unique index): prefer the unique
        // @handle, falling back to the always-present, immutable account id.
        const username = (profile as { data?: { username?: string } })?.data
          ?.username;
        await User.create({
          twitterXId: account?.providerAccountId,
          name: user.name,
          email:
            user.email ||
            `${username ?? account?.providerAccountId}@twitter.local`,
          lists: [DAILY_LIST]
        });
      }
    } else if (provider === 'github') {
      const existingUser = await User.findOne({
        gitHubId: account?.providerAccountId
      });
      if (!existingUser) {
        await User.create({
          gitHubId: account?.providerAccountId,
          name: user.name || (profile as { login?: string })?.login,
          email:
            user.email || `${(profile as { login?: string })?.login}@GitHub`,
          password: null,
          lists: [DAILY_LIST]
        });
      }
    }
  },
  resolveUserId: async ({ user, account }) => {
    if (!account || account.provider === 'credentials') {
      return user?.id;
    }

    await connectDB();
    let dbUser;

    if (account.provider === 'twitter' || account.provider === 'github') {
      const idField =
        account.provider === 'twitter' ? 'twitterXId' : 'gitHubId';
      dbUser = await User.findOne({ [idField]: account.providerAccountId });
    } else {
      dbUser = await User.findOne({ email: user?.email });
    }

    return dbUser?._id.toString();
  }
});
