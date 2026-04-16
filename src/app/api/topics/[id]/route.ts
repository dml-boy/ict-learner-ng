import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Topic from '@/models/Topic';

// DELETE a topic
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();
  try {
    const deletedTopic = await Topic.findByIdAndDelete(id);
    if (!deletedTopic) {
      return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deletedTopic });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
