import { createEdgeAuth } from '@repo/auth/next-auth/config';

const { auth } = createEdgeAuth({
  signInPath: '/login',
  providers: ['google', 'facebook', 'twitter', 'github'],
  credentials: {}
});

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const protectedPaths = ['/todos', '/account', '/about', '/contact'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }

  if (pathname === '/login' && isLoggedIn) {
    return Response.redirect(new URL('/todos', req.nextUrl));
  }
});

export const config = {
  matcher: [
    '/todos/:path*',
    '/account/:path*',
    '/about/:path*',
    '/contact/:path*',
    '/login'
  ]
};
