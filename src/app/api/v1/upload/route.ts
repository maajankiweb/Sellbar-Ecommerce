import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // 1. Handle FormData multipart file upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const files = formData.getAll('images') as File[];

      if (!files || files.length === 0) {
        return NextResponse.json(
          { success: false, message: 'No images provided' },
          { status: 400 }
        );
      }

      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (typeof file === 'object' && 'arrayBuffer' in file) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const mimeType = file.type || 'image/jpeg';
          const base64 = buffer.toString('base64');
          const dataUrl = `data:${mimeType};base64,${base64}`;
          uploadedUrls.push(dataUrl);
        }
      }

      return NextResponse.json({
        success: true,
        message: `${uploadedUrls.length} image(s) processed successfully!`,
        urls: uploadedUrls,
      });
    }

    // 2. Handle JSON base64 or URL payload
    const body = await request.json();
    if (body.images && Array.isArray(body.images)) {
      return NextResponse.json({
        success: true,
        urls: body.images,
      });
    }

    if (body.url) {
      return NextResponse.json({
        success: true,
        urls: [body.url],
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid payload. Send multipart/form-data or JSON with images.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Image processing failed' },
      { status: 500 }
    );
  }
}
