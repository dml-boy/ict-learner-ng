import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subject from '@/models/Subject';

export async function GET() {
  await dbConnect();
  try {
    const subjects = await Subject.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    console.error('[API] Subjects Fetch Failure:', error);
    return NextResponse.json({ success: false, error: 'Registry sterilization failure. Catalog inaccessible.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const subject = await Subject.create(body);
    return NextResponse.json({ success: true, message: 'New ICT Subject established.', data: subject }, { status: 201 });
  } catch (error) {
    console.error('[API] Subject Creation Failure:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
