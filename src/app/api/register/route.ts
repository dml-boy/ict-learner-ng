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

    const newUser = await User.create({ 
      name, 
      email, 
      passwordHash, 
      role: role || 'student',
      isEmailVerified: false,
      verificationToken
    });

    // Send verification email
    try {
      const emailRes = await sendVerificationEmail(email, verificationToken, name);
      if (!emailRes.success) {
        console.warn('Registration: Email dispatch failed for:', email);
      }
    } catch (emailErr) {
      console.error('Registration: Critical email dispatch error:', emailErr);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Account constructed successfully. Dispatched verification protocol.',
      data: { id: newUser._id, email: newUser.email }
    });
  } catch (error) {
    console.error('[API] Registration Critical Failure:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Platform sterilization interrupted. Internal registry failure.' 
    }, { status: 500 });
  }
}
