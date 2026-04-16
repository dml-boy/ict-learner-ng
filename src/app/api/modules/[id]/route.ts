import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Module from '@/models/Module';

// GET a single module
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();
  try {
    const moduleDoc = await Module.findById(id).populate({
      path: 'topicId',
      populate: { path: 'subjectId' }
    });
    if (!moduleDoc) {
      console.warn(`[API] Module ${id} not found.`);
      return NextResponse.json({ success: false, error: 'Module not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: moduleDoc });
  } catch (error) {
    console.error(`[API] Critical error fetching module ${id}:`, error);
    return NextResponse.json({ success: false, error: "System synchronization failure. The module metadata may be fragmented." }, { status: 500 });
  }
}

// DELETE a module
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();
  try {
    const deletedModule = await Module.findByIdAndDelete(id);
    if (!deletedModule) {
      return NextResponse.json({ success: false, error: 'Module not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deletedModule });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
