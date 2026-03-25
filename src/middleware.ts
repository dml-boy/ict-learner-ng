import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Protect teacher routes — must be authenticated AND have role 'teacher'
  if (pathname.startsWith('/teacher')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login?role=teacher', req.url));
    }
    const user = session.user as { role?: string; isEmailVerified?: boolean };
    if (!user.isEmailVerified) {
      return NextResponse.redirect(new URL('/login?error=unverified', req.url));
    }
    if (user.role !== 'teacher') {
      return NextResponse.redirect(new URL('/student', req.url));
    }
  }

  // Protect student routes — must be authenticated
  if (pathname.startsWith('/student')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login?role=student', req.url));
    }
    const user = session.user as { isEmailVerified?: boolean };
    if (!user.isEmailVerified) {
      return NextResponse.redirect(new URL('/login?error=unverified', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/teacher/:path*', '/student/:path*'],
};
