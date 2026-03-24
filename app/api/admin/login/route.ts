import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { sendResponse } from '@/lib/response';
import { comparePassword } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { AdminLoginSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate request body
    const validatedData = AdminLoginSchema.parse(body);

    // Find admin by username
    const admin = await Admin.findOne({ username: validatedData.username.toLowerCase() });

    if (!admin) {
      return sendResponse(401, false, 'Invalid credentials');
    }

    // Compare passwords
    const passwordMatch = await comparePassword(
      validatedData.password,
      admin.passwordHash
    );

    if (!passwordMatch) {
      return sendResponse(401, false, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(admin.username);

    return sendResponse(200, true, 'Login successful', { token, username: admin.username });
  } catch (error) {
    console.error('Error during login:', error);
    
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
      'Login failed',
      null,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
