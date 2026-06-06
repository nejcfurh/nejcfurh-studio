import NextAuth, {
  type NextAuthConfig,
  type NextAuthResult,
  type User
} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Facebook from 'next-auth/providers/facebook';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Twitter from 'next-auth/providers/twitter';

import './types';

export type OAuthProviderName = 'google' | 'github' | 'facebook' | 'twitter';

export type Authorize = (
  credentials: Partial<Record<string, unknown>>
) => Promise<User | null> | User | null;

export interface CredentialsOptions {
  /**
   * Credential input fields. Defaults to email + password.
   * blog-dev overrides this with a `username` field.
   */
  fields?: Record<string, { label?: string; type?: string }>;
  /**
   * App-specific credential check (DB lookup / env compare). Runs in the
   * Node entry only — the edge config injects a `() => null` stub so that
   * middleware never pulls bcrypt/db code into the edge bundle.
   */
  authorize?: Authorize;
}

export interface CreateAuthConfigOptions {
  /** Path of the sign-in page. Defaults to `/login`. */
  signInPath?: string;
  /** OAuth providers to enable, wired to the `AUTH_*_ID` / `AUTH_*_SECRET` env convention. */
  providers?: OAuthProviderName[];
  /** Enable the Credentials provider (with optional custom fields + authorize). */
  credentials?: CredentialsOptions;
}

const DEFAULT_CREDENTIAL_FIELDS: Record<
  string,
  { label?: string; type?: string }
> = {
  email: { label: 'Email' },
  password: { label: 'Password', type: 'password' }
};

function buildOAuthProviders(
  names: OAuthProviderName[]
): NonNullable<NextAuthConfig['providers']> {
  return names.map((name) => {
    switch (name) {
      case 'google':
        return Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET
        });
      case 'github':
        return GitHub({
          clientId: process.env.AUTH_GITHUB_ID,
          clientSecret: process.env.AUTH_GITHUB_SECRET
        });
      case 'facebook':
        return Facebook({
          clientId: process.env.AUTH_FACEBOOK_ID,
          clientSecret: process.env.AUTH_FACEBOOK_SECRET
        });
      case 'twitter':
        return Twitter({
          clientId: process.env.AUTH_TWITTER_ID,
          clientSecret: process.env.AUTH_TWITTER_SECRET,
          profile(profile) {
            const data = (profile.data ?? profile) as {
              id: string;
              name?: string;
              username?: string;
              email?: string | null;
              profile_image_url?: string;
            };
            return {
              id: data.id,
              name: data.name ?? data.username ?? 'Twitter User',
              email: data.email ?? null,
              image: data.profile_image_url
            };
          }
        });
    }
  });
}

/**
 * Builds the shared, edge-safe NextAuth config: providers + jwt session
 * strategy + sign-in page. Contains NO database/bcrypt code, so it is safe to
 * use from middleware (`proxy.ts`).
 */
export function createAuthConfig(
  options: CreateAuthConfigOptions = {}
): NextAuthConfig {
  const { signInPath = '/login', providers = [], credentials } = options;

  const providerList: NonNullable<NextAuthConfig['providers']> = [];

  if (credentials) {
    providerList.push(
      Credentials({
        credentials: credentials.fields ?? DEFAULT_CREDENTIAL_FIELDS,
        authorize: credentials.authorize ?? (async (): Promise<null> => null)
      })
    );
  }

  providerList.push(...buildOAuthProviders(providers));

  return {
    providers: providerList,
    session: { strategy: 'jwt' },
    pages: { signIn: signInPath }
  };
}

/**
 * Edge-safe NextAuth instance for middleware. Use the returned `auth` to wrap
 * `proxy.ts`; app-specific route-guard logic stays in the app.
 */
export function createEdgeAuth(
  options: CreateAuthConfigOptions = {}
): NextAuthResult {
  return NextAuth(createAuthConfig(options));
}
