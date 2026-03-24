import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
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
      return sendResponse(400, false, 'Invalid order ID');
    }

    const order = await Order.findById(id);

    if (!order) {
      return sendResponse(404, false, 'Order not found');
    }

    return sendResponse(200, true, 'Order fetched successfully', order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return sendResponse(
      500,
      false,
      'Failed to fetch order',
      null,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
