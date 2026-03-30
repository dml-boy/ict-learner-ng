import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Topic from '@/models/Topic';
import '@/models/User'; // For populate

// GET all topics (optionally filter by subjectId or teacherId)
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const teacherId = searchParams.get('teacherId');
    
    // Explicit typing for the query filter
    const filter: Record<string, string> = {};
    if (subjectId) filter.subjectId = subjectId;
    if (teacherId) filter.createdBy = teacherId;
    
    const topics = await Topic.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ success: true, count: topics.length, data: topics });
  } catch (error) {
    console.error('[API] Topics Fetch Failure:', error);
    return NextResponse.json({ success: false, error: 'Database synchronization interrupted.' }, { status: 500 });
  }
}

// POST create a topic
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userRole = (session?.user as { role?: string })?.role;
    
    if (!session?.user || userRole !== 'teacher') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Teacher clearance required.' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    const topicData = {
      ...body,
      createdBy: session.user.id
    };

    const topic = await Topic.create(topicData);
    await topic.populate('createdBy', 'name email');
    
    return NextResponse.json({ success: true, message: 'New ICT Topic cataloged.', data: topic }, { status: 201 });
  } catch (error) {
    console.error('[API] Topic Creation Failure:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
