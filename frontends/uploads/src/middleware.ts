import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refresh_token');
  const openCasURL = process.env.OPENCAS_URL;
  // const port = process.env.FE_MAILER_PORT;
  // const currentOrigin = request.nextUrl.origin;
  let origin = request.url;

  if (process.env.NODE_ENV === 'production') {
    origin = process.env.FE_UPLOADS_URL || request.url;
  }

  if (!token) {
    const encodedOrigin = encodeURIComponent(origin);
    return NextResponse.redirect(
      new URL(`${openCasURL}/auth/login?origin=${encodedOrigin}`, request.url)
    );
  } else if (token && request.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
