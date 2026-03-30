import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch orders for this user's email (which is stored as username in token)
    const orders = await Order.find({ email: decoded.username })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: 'Orders fetched successfully',
        data: orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
