import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      // Don't leak if the user exists or not, but give a generic success message
      return NextResponse.json({ 
        success: true, 
        message: 'If an unverified account exists, a new verification protocol has been dispatched.' 
      });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ 
        success: true, 
        message: 'Account is already fully authorized.' 
      });
    }

    // Re-trigger the verification email
    try {
      const emailRes = await sendVerificationEmail(user.email, user.verificationToken || '', user.name);
      if (!emailRes.success) {
        console.warn('Resend: Email dispatch failed for:', user.email);
        return NextResponse.json({ success: false, error: 'Internal dispatch failure.' }, { status: 500 });
      }
    } catch (emailErr) {
      console.error('Resend: Critical email dispatch error:', emailErr);
      return NextResponse.json({ success: false, error: 'Security protocol interrupted.' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'New verification protocol dispatched to your terminal.' 
    });
  } catch (error) {
    console.error('[API] Resend Critical Failure:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Platform sterilization interrupted. Internal registry failure.' 
    }, { status: 500 });
  }
}
