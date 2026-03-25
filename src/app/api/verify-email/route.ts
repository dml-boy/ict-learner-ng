import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing_token', req.url));
  }

  try {
    await dbConnect();

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', req.url));
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.redirect(new URL('/login?verified=true', req.url));
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', req.url));
  }
}
