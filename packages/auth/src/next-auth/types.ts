import 'next-auth';
import 'next-auth/jwt';

// Shared module augmentation for every app that consumes `@repo/auth`.
// Apps no longer need their own `auth.d.ts` for these fields.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
  }
}
