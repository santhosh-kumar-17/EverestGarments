import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendResponse } from '@/lib/response';
import { verifyToken, extractTokenFromRequest } from '@/lib/auth';

function authenticate(request: Request) {
  const token = extractTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

export async function GET(request: Request) {
  try {
    const authUser = authenticate(request);
    if (!authUser) {
      return sendResponse(401, false, 'Unauthorized');
    }

    await connectDB();

    const orders = await Order.find().sort({ createdAt: -1 });

    return sendResponse(
      200,
      true,
      'Orders fetched successfully',
      orders
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return sendResponse(
      500,
      false,
      'Failed to fetch orders',
      null,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
