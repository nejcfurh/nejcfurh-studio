import { adminAuth } from '@/lib/firebase/admin';
import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'firebase-session';
const PROTECTED_PREFIXES = ['/profile', '/create-listing'];
const AUTH_PREFIXES = ['/auth/login', '/auth/register'];

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!sessionCookie) {
    if (isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/profile';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch {
    const response = isProtected
      ? NextResponse.redirect(
          (() => {
            const url = request.nextUrl.clone();
            url.pathname = '/auth/login';
            url.searchParams.set('next', pathname);
            return url;
          })()
        )
      : NextResponse.next();
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
};

export const config = {
  matcher: [
    '/profile/:path*',
    '/create-listing/:path*',
    '/auth/login',
    '/auth/register'
  ]
};
