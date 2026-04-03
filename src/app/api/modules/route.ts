import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Module from '@/models/Module';
import '@/models/Topic'; // Explicit registration for populate
import '@/models/User';  // Explicit registration for populate

// GET all modules (optionally filtered by topicId or teacherId)
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');
    const teacherId = searchParams.get('teacherId');
    
    const filter: Record<string, string> = {};
    if (topicId) filter.topicId = topicId;
    if (teacherId) filter.createdBy = teacherId;
    
    const modules = await Module.find(filter)
      .populate('topicId', 'title')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ success: true, count: modules.length, data: modules });
  } catch (error) {
    console.error('[API] Modules Fetch Failure:', error);
    return NextResponse.json({ success: false, error: 'Module registry unavailable.' }, { status: 500 });
  }
}

// POST create a module
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userRole = (session?.user as { role?: string })?.role;
    
    if (!session?.user || userRole !== 'teacher') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Teacher clearance required.' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    const moduleData = {
      ...body,
      createdBy: session.user.id
    };

    const moduleDoc = await Module.create(moduleData);
    await moduleDoc.populate('createdBy', 'name email');
    
    return NextResponse.json({ success: true, message: 'Pedagogical module constructed.', data: moduleDoc }, { status: 201 });
  } catch (error) {
    console.error('[API] Module Creation Failure:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
