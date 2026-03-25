import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subject from '@/models/Subject';

export async function GET() {
  await dbConnect();
  try {
    const subjects = await Subject.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: subjects });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const subject = await Subject.create(body);
    return NextResponse.json({ success: true, data: subject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
