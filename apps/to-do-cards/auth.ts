import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Facebook from 'next-auth/providers/facebook';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Twitter from 'next-auth/providers/twitter';

const DAILY_LIST = {
  name: 'Daily',
  url: 'https://images.unsplash.com/photo-1506485338023-6ce5f36692df?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  body: 'Daily tasks!'
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
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
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET
    }),
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID,
      clientSecret: process.env.AUTH_TWITTER_SECRET,
      profile(profile) {
        const data = profile.data ?? profile;
        return {
          id: data.id,
          name: data.name,
          email: data.email ?? null,
          image: data.profile_image_url
        };
      }
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET
    })
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') return true;

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
          await User.create({
            twitterXId: account?.providerAccountId,
            name: user.name,
            email: user.email || `${user.name}@Twitter/X`,
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

      return true;
    },
    async jwt({ token, user, account }) {
      if (user && account?.provider === 'credentials') {
        token.userId = user.id;
      } else if (account && account.provider !== 'credentials') {
        await connectDB();
        let dbUser;

        if (account.provider === 'twitter' || account.provider === 'github') {
          const idField =
            account.provider === 'twitter' ? 'twitterXId' : 'gitHubId';
          dbUser = await User.findOne({
            [idField]: account.providerAccountId
          });
        } else {
          dbUser = await User.findOne({ email: user?.email });
        }

        if (dbUser) {
          token.userId = dbUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    }
  }
});
