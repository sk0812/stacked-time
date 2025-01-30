import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import VerificationCode from '@/models/VerificationCode';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface VerificationQuery {
  email: string;
  code: string;
  token: string;
  newEmail?: string;
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { currentEmail, newEmail, code, token } = await req.json();

    if (!currentEmail || !newEmail || !code || !token) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Build query based on available data
    const query: VerificationQuery = {
      email: currentEmail,
      code,
      token,
    };

    // Only add newEmail to query if it's different from currentEmail
    if (newEmail !== currentEmail) {
      query.newEmail = newEmail;
    }

    // Verify the code
    const verificationRecord = await VerificationCode.findOne(query);

    if (!verificationRecord) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Check if new email is already in use by another user
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }

    // Update user's email
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { email: newEmail },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete the verification code
    await VerificationCode.deleteOne({ _id: verificationRecord._id });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
} 