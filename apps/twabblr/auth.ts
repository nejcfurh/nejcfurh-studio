import prisma from '@/app/libs/prismadb';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { PrismaClient } from '@prisma/client';
import { createAuth } from '@repo/auth/next-auth';
import bcrypt from 'bcrypt';

export const { handlers, auth, signIn, signOut } = createAuth({
  signInPath: '/',
  // The adapter's parameter type does not accept a client built with a global
  // `omit`; it never reads hashedPassword, so the omitting client works as is.
  adapter: PrismaAdapter(prisma as unknown as PrismaClient),
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: ['google', 'facebook', 'github'],
  credentials: {
    authorize: async (credentials) => {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
        omit: { hashedPassword: false }
      });

      if (!user || !user?.hashedPassword) {
        return null;
      }

      const isCorrectPassword = await bcrypt.compare(
        credentials.password as string,
        user.hashedPassword
      );

      if (!isCorrectPassword) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image
      };
    }
  }
});
