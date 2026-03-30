import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Subject from '@/models/Subject';
import '@/models/User'; // Ensure User is registered for populate

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const filter = teacherId ? { createdBy: teacherId } : {};

    const subjects = await Subject.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    console.error('[API] Subjects Fetch Failure:', error);
    return NextResponse.json({ success: false, error: 'Registry sterilization failure. Catalog inaccessible.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userRole = (session?.user as { role?: string })?.role;
    
    if (!session?.user || userRole !== 'teacher') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Teacher clearance required.' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    // Assign the logged-in teacher as the creator
    const subjectData = {
      ...body,
      createdBy: session.user.id
    };

    const subject = await Subject.create(subjectData);
    // Populate immediately so the frontend has the creator name
    await subject.populate('createdBy', 'name email');
    
    return NextResponse.json({ success: true, message: 'New ICT Subject established.', data: subject }, { status: 201 });
  } catch (error) {
    console.error('[API] Subject Creation Failure:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
