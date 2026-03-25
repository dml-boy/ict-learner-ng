import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Module from '@/models/Module';

// GET all modules (optionally filtered by topicId)
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');
    const filter = topicId ? { topicId } : {};
    const modules = await Module.find(filter).populate('topicId', 'title').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: modules });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// POST create a module
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const moduleDoc = await Module.create(body);
    return NextResponse.json({ success: true, data: moduleDoc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
