import { isAuthUser } from '@/shared/lib';
import { auth } from '@/shared/lib/index.server';
import { NextResponse } from 'next/server';

const isAuthRoute = (pathname: string) => pathname === '/login' || pathname === '/register';

export const authProxy = auth((request) => {
  const pathname = request.nextUrl.pathname;
  const isAuth = isAuthUser(request.auth?.user);

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  if (!isAuth && !isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuth && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return NextResponse.next();
});
