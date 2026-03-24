import { verifyToken, extractTokenFromRequest } from '@/lib/auth';
import { sendResponse } from '@/lib/response';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function authenticate(request: Request) {
  const token = extractTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

export async function POST(request: Request) {
  try {
    const authUser = authenticate(request);
    if (!authUser) {
      return sendResponse(401, false, 'Unauthorized');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return sendResponse(400, false, 'No file provided');
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'everest-garments',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(buffer);
    });

    const uploadResult = result as any;
    return sendResponse(200, true, 'Image uploaded successfully', {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return sendResponse(
      500,
      false,
      'Failed to upload image',
      null,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
