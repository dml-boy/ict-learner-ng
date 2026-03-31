import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image provided for uplift.' }, { status: 400 });
    }

    // Convert file to Base64 buffer for GitHub
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');

    // Generate unique filename to avoid collision
    const fileExt = file.name.split('.').pop() || 'png';
    const filename = `${crypto.randomBytes(8).toString('hex')}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${filename}`;

    const githubToken = process.env.GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER;
    const githubRepo = process.env.GITHUB_REPO;

    if (!githubToken || !githubOwner || !githubRepo) {
      console.error('[API] GitHub CDN Configuration Missing');
      return NextResponse.json({ success: false, error: 'Internal CDN configuration error.' }, { status: 500 });
    }

    const githubApiUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`;

    const response = await fetch(githubApiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'ICT-Learner-NG-Backend',
      },
      body: JSON.stringify({
        message: `Upload asset: ${filename}`,
        content: base64String,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[API] GitHub Push Failure:', data);
      throw new Error(data.message || 'Failed to upload to Global Registry (GitHub)');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Asset synchronized to Global Registry.',
      url: data.content.download_url
    });

  } catch (error) {
    console.error('[API] Image Upload Critical Failure:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Data sync interrupted. Ensure file size is manageable.' 
    }, { status: 500 });
  }
}
