import prisma from '@/app/libs/prismadb';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { createAuth } from '@repo/auth/next-auth';
import bcrypt from 'bcrypt';

export const { handlers, auth, signIn, signOut } = createAuth({
  signInPath: '/',
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: ['google', 'facebook', 'github'],
  credentials: {
    authorize: async (credentials) => {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string }
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
