import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendResponse } from '@/lib/response';
import { CreateOrderSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate request body
    const validatedData = CreateOrderSchema.parse(body);

    // Create order
    const order = new Order(validatedData);
    await order.save();

    return sendResponse(
      201,
      true,
      'Order created successfully',
      order
    );
  } catch (error) {
    console.error('Error creating order:', error);
    
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
      'Failed to create order',
      null,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function GET(_request: Request) {
  try {
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
