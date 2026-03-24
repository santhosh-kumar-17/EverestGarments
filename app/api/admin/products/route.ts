import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { sendResponse } from '@/lib/response';
import { verifyToken, extractTokenFromRequest } from '@/lib/auth';
import { CreateProductSchema } from '@/lib/validation';

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

    await connectDB();

    const body = await request.json();

    // Validate request body
    const validatedData = CreateProductSchema.parse(body);

    // Create product
    const product = new Product(validatedData);
    await product.save();

    return sendResponse(201, true, 'Product created successfully', product);
  } catch (error) {
    console.error('Error creating product:', error);

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
      'Failed to create product',
      null,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function GET(request: Request) {
  try {
    const authUser = authenticate(request);
    if (!authUser) {
      return sendResponse(401, false, 'Unauthorized');
    }

    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 });

    return sendResponse(
      200,
      true,
      'Products fetched successfully',
      products
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return sendResponse(
      500,
      false,
      'Failed to fetch products',
      null,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
