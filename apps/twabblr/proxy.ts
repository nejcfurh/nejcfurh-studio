import { createEdgeAuth } from '@repo/auth/next-auth/config';

const { auth } = createEdgeAuth({
  signInPath: '/',
  providers: ['google', 'facebook', 'github'],
  credentials: {}
});

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const protectedPaths = ['/users', '/conversations'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL('/', req.nextUrl));
  }
});

export const config = {
  matcher: ['/users/:path*', '/conversations/:path*']
};
