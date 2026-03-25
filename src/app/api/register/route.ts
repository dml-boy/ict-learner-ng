import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'All fields required' }, { status: 400 });
    }

    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await User.create({ 
      name, 
      email, 
      passwordHash, 
      role: role || 'student',
      isEmailVerified: false,
      verificationToken
    });

    // Send verification email
    const emailRes = await sendVerificationEmail(email, verificationToken, name);
    
    if (!emailRes.success) {
      console.error('Email sending failed, but user created:', emailRes.error);
      // We still return success but maybe a warning in logs
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful. Please verify your email.' 
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
