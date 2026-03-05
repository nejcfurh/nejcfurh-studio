import { authConfig } from '@/auth.config';
import NextAuth from 'next-auth';

const { auth } = NextAuth(authConfig);

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
