import { connectDB } from '@/lib/mongodb';
import { hashPassword, comparePassword } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

interface User {
  email: string;
  password: string;
  displayName: string;
  createdAt: string;
}

interface UsersCollection {
  findOne: (query: any) => Promise<User | null>;
  insertOne: (doc: User) => Promise<any>;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { message: 'Email, password, and display name are required' },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const users = db.collection('users') as UsersCollection;

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = {
      email,
      password: hashedPassword,
      displayName,
      createdAt: new Date().toISOString(),
    };

    await users.insertOne(newUser);

    // Generate token
    const token = generateToken({ email, type: 'user' });

    return NextResponse.json(
      {
        message: 'Registration successful',
        data: {
          token,
          email,
          displayName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    );
  }
}
