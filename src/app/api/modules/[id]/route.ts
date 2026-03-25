import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Module from '@/models/Module';

// GET a single module
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const moduleDoc = await Module.findById(id).populate({
      path: 'topicId',
      populate: { path: 'subjectId' }
    });
    if (!moduleDoc) {
      return NextResponse.json({ success: false, error: 'Module not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: moduleDoc });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// DELETE a module
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const deletedModule = await Module.findByIdAndDelete(id);
    if (!deletedModule) {
      return NextResponse.json({ success: false, error: 'Module not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deletedModule });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
