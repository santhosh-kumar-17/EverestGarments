import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { sendResponse } from '@/lib/response';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return sendResponse(200, true, 'Products fetched successfully', products);
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
