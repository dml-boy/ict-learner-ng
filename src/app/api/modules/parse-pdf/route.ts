import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
// @ts-ignore
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userRole = (session?.user as { role?: string })?.role;
    
    if (!session?.user || userRole !== 'teacher') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Teacher clearance required.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'Only PDF format is supported for text extraction.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdfParse(buffer);

    return NextResponse.json({ 
      success: true, 
      data: {
        text: data.text,
        pageCount: data.numpages,
        info: data.info
      }
    });
  } catch (error) {
    console.error('[API] PDF Parse Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to extract text from PDF.' }, { status: 500 });
  }
}
