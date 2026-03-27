import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Topic from '@/models/Topic';

// GET all topics (optionally filter by subjectId)
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const filter = subjectId ? { subjectId } : {};
    
    const topics = await Topic.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: topics.length, data: topics });
  } catch (error) {
    console.error('[API] Topics Fetch Failure:', error);
    return NextResponse.json({ success: false, error: 'Database synchronization interrupted.' }, { status: 500 });
  }
}

// POST create a topic
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const topic = await Topic.create(body);
    return NextResponse.json({ success: true, message: 'New ICT Topic cataloged.', data: topic }, { status: 201 });
  } catch (error) {
    console.error('[API] Topic Creation Failure:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
