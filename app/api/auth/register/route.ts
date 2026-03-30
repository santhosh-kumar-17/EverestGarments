import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password, displayName } = await req.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { message: 'Email, password, and display name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      displayName,
    });

    // Generate token
    const token = generateToken(newUser.email);

    return NextResponse.json(
      {
        message: 'Registration successful',
        data: {
          token,
          email: newUser.email,
          displayName: newUser.displayName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
