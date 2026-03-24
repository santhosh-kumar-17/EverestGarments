import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { sendResponse } from '@/lib/response';
import { Types } from 'mongoose';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return sendResponse(400, false, 'Invalid product ID');
    }

    const product = await Product.findById(id);

    if (!product) {
      return sendResponse(404, false, 'Product not found');
    }

    return sendResponse(200, true, 'Product fetched successfully', product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return sendResponse(
      500,
      false,
      'Failed to fetch product',
      null,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
