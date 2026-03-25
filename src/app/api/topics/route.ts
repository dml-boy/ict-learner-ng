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
    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// POST create a topic
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const topic = await Topic.create(body);
    return NextResponse.json({ success: true, data: topic }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
