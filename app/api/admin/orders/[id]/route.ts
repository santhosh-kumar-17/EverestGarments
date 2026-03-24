import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendResponse } from '@/lib/response';
import { verifyToken, extractTokenFromRequest } from '@/lib/auth';
import { Types } from 'mongoose';
import { z } from 'zod';

function authenticate(request: Request) {
  const token = extractTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

const UpdateOrderSchema = z.object({
  status: z.enum(['pending', 'contacted', 'completed']),
});

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
      return sendResponse(400, false, 'Invalid order ID');
    }

    const body = await request.json();

    // Validate request body
    const validatedData = UpdateOrderSchema.parse(body);

    // Update order
    const order = await Order.findByIdAndUpdate(
      id,
      { status: validatedData.status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return sendResponse(404, false, 'Order not found');
    }

    return sendResponse(200, true, 'Order updated successfully', order);
  } catch (error) {
    console.error('Error updating order:', error);

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
      'Failed to update order',
      null,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
