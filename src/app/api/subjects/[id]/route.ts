import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subject from '@/models/Subject';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const deletedSubject = await Subject.findByIdAndDelete(params.id);
    if (!deletedSubject) {
      return NextResponse.json({ success: false, error: 'Subject not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
