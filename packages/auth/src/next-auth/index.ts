import NextAuth, {
  type Account,
  type NextAuthConfig,
  type NextAuthResult,
  type Profile,
  type User
} from 'next-auth';

import { createAuthConfig, type CreateAuthConfigOptions } from './config';

import './types';

export { AuthError } from 'next-auth';

export {
  createAuthConfig,
  createEdgeAuth,
  type Authorize,
  type CreateAuthConfigOptions,
  type CredentialsOptions,
  type OAuthProviderName
} from './config';

export interface OAuthSignInParams {
  user: User;
  account: Account | null;
  profile?: Profile;
}

export interface ResolveUserIdParams {
  user: User | undefined;
  account: Account | null;
}

export interface CreateAuthOptions extends CreateAuthConfigOptions {
  /** Database adapter (e.g. `PrismaAdapter(prisma)`). Omit for credentials/manual apps. */
  adapter?: NextAuthConfig['adapter'];
  secret?: string;
  debug?: boolean;
  /**
   * Called on OAuth sign-in (non-credentials) to provision the user in the
   * app's own store. No-op by default. Apps backed by an `adapter` usually
   * don't need this.
   */
  onOAuthSignIn?: (params: OAuthSignInParams) => Promise<void> | void;
  /**
   * Resolve the canonical user id stored on the token at sign-in. Defaults to
   * `user.id`. Apps that manage their own users without an adapter (e.g.
   * mapping an OAuth account to a Mongo `_id`) override this.
   */
  resolveUserId?: (
    params: ResolveUserIdParams
  ) => Promise<string | undefined> | string | undefined;
}

/**
 * Node-side NextAuth factory. Returns the standard `{ handlers, auth, signIn,
 * signOut }`. App-specific seams (authorize, adapter, provisioning, id
 * resolution) are injected; the shared jwt/session callbacks place the
 * resolved id on `token.userId` -> `session.user.id`.
 */
export function createAuth(options: CreateAuthOptions = {}): NextAuthResult {
  const {
    adapter,
    secret,
    debug,
    onOAuthSignIn,
    resolveUserId,
    ...configOptions
  } = options;

  const baseConfig = createAuthConfig(configOptions);

  return NextAuth({
    ...baseConfig,
    ...(adapter ? { adapter } : {}),
    ...(secret ? { secret } : {}),
    ...(debug !== undefined ? { debug } : {}),
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account?.provider !== 'credentials' && onOAuthSignIn) {
          await onOAuthSignIn({ user, account: account ?? null, profile });
        }
        return true;
      },
      async jwt({ token, user, account }) {
        if (user || account) {
          if (resolveUserId) {
            const id = await resolveUserId({ user, account: account ?? null });
            if (id) token.userId = id;
          } else if (user?.id) {
            token.userId = user.id;
          }
        }
        return token;
      },
      async session({ session, token }) {
        if (token.userId && session.user) {
          session.user.id = token.userId;
        }
        return session;
      }
    }
  });
}
