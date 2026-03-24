import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { sendResponse } from '@/lib/response';
import { verifyToken, extractTokenFromRequest } from '@/lib/auth';
import { UpdateProductSchema } from '@/lib/validation';
import { Types } from 'mongoose';

function authenticate(request: Request) {
  const token = extractTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const authUser = authenticate(request);
    if (!authUser) {
      return sendResponse(401, false, 'Unauthorized');
    }

    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return sendResponse(400, false, 'Invalid product ID');
    }

    const body = await request.json();

    // Validate request body
    const validatedData = UpdateProductSchema.parse(body);

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return sendResponse(404, false, 'Product not found');
    }

    return sendResponse(200, true, 'Product updated successfully', product);
  } catch (error) {
    console.error('Error updating product:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return sendResponse(
        400,
        false,
        'Validation error',
        null,
        error.message
      );
    }

    return sendResponse(
      500,
      false,
      'Failed to update product',
      null,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const authUser = authenticate(request);
    if (!authUser) {
      return sendResponse(401, false, 'Unauthorized');
    }

    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return sendResponse(400, false, 'Invalid product ID');
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return sendResponse(404, false, 'Product not found');
    }

    return sendResponse(200, true, 'Product deleted successfully', product);
  } catch (error) {
    console.error('Error deleting product:', error);
    return sendResponse(
      500,
      false,
      'Failed to delete product',
      null,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
