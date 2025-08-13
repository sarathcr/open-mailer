import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { parseJwt } from './utils/parseJwt';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Prevent redirect for static files like JS, CSS, images, etc.
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }
  if (
    pathname.startsWith('/auth/forgot-password') ||
    pathname.startsWith('/auth/change-password')
  ) {
    const response = NextResponse.next();
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  const token = request.cookies.get('refresh_token');
  const accessToken =
    (request.cookies.get('access_token')?.value as string) ?? '';

  const token_decoded = accessToken ? parseJwt(accessToken) : {};
  const admin_status = !!token_decoded.isAdmin;
  console.log('admin_status', admin_status);
  console.log('token_decoded', token_decoded);

  if (!admin_status) {
    if (
      request.nextUrl.pathname.startsWith('/dashboard/users') ||
      request.nextUrl.pathname.startsWith('/dashboard/cards')
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (pathname === '/auth/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname !== '/auth/login' && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}
