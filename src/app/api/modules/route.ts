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
      .sort({ createdAt: -1 })
      .lean();
      
    return NextResponse.json({ success: true, count: modules.length, data: modules });
  } catch (error) {
    console.error('[API] Modules Fetch Failure:', error);
    return NextResponse.json({ success: false, error: 'Module registry unavailable.' }, { status: 500 });
  }
}

// POST create a module
export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "65f1234567890abcd1234567";
    await dbConnect();
    const data = await req.json();
    const newModule = await Module.create({ ...data, createdBy: userId });
    return NextResponse.json({ success: true, data: newModule });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "65f1234567890abcd1234567";
    const { id } = await req.json();
    await dbConnect();
    const deleted = await Module.findOneAndDelete({ _id: id, createdBy: userId });
    if (!deleted) return NextResponse.json({ success: false, error: "Not found or unauthorized" }, { status: 404 });
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
