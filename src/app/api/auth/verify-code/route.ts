import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import VerificationCode from '@/models/VerificationCode';

export async function POST(req: Request) {
  try {
    const { email, newEmail, code, token } = await req.json();

    if (!email || !code || !token) {
      console.log('Missing required fields:', { email, code, token });
      return NextResponse.json(
        { error: 'Code is invalid, please try again.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Log the verification attempt
    console.log('Verifying code:', { email, newEmail, code, token });

    // Build query based on available data
    const query: any = {
      email,
      code,
      token,
    };

    // Only add newEmail to query if it exists
    if (newEmail) {
      query.newEmail = newEmail;
    }

    // Find the verification code
    const verificationCode = await VerificationCode.findOne(query);

    // Log the result
    console.log('Verification result:', verificationCode ? 'Found' : 'Not found');

    if (!verificationCode) {
      // Check if there's any code for this email to help debug
      const existingCodes = await VerificationCode.find({ email });
      console.log('Existing codes for email:', existingCodes);

      return NextResponse.json(
        { error: 'Code is invalid, please try again.' },
        { status: 400 }
      );
    }

    // Don't delete the code here - it will be deleted after email update
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Code is invalid, please try again.' },
      { status: 500 }
    );
  }
} 