import { connectDB } from '@/lib/mongodb';
import { comparePassword } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

interface User {
  email: string;
  password: string;
  displayName: string;
}

interface UsersCollection {
  findOne: (query: any) => Promise<User | null>;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const users = db.collection('users') as UsersCollection;

    // Find user
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({ email, type: 'user' });

    return NextResponse.json(
      {
        message: 'Login successful',
        data: {
          token,
          email,
          displayName: user.displayName,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
}
