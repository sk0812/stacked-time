import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { connectToDatabase } from '@/lib/mongodb';
import VerificationCode from '@/models/VerificationCode';
import User from '@/models/User';
import crypto from 'crypto';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'onboarding@boilerplate.com';

export async function POST(req: Request) {
  try {
    const { email, newEmail, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // If this is a signup flow (no newEmail), check if the email already exists
    if (!newEmail) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'This email is already registered. Please sign in instead.' },
          { status: 400 }
        );
      }
    }

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate a token
    const token = crypto.randomBytes(32).toString('hex');

    // Delete any existing codes for this email
    await VerificationCode.deleteMany({ email });

    // Create verification record data
    const verificationData: any = {
      email,
      code,
      token,
    };

    // Add newEmail only if it exists (for email change)
    if (newEmail) {
      verificationData.newEmail = newEmail;
    }

    // Save the code to the database
    const verificationRecord = await VerificationCode.create(verificationData);

    console.log('Created verification record:', { 
      email, 
      newEmail,
      code, 
      token: verificationRecord.token 
    });

    // Prepare email content based on whether it's signup or email change
    const emailSubject = newEmail ? 'Verify your email change request' : 'Verify your email address';
    const emailContent = newEmail
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Change Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to change your email address to: ${newEmail}</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 4px; margin: 20px 0;">
            <strong>${code}</strong>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this change, you can safely ignore this email.</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Stacked Time!</h2>
          <p>Hi ${name},</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 4px; margin: 20px 0;">
            <strong>${code}</strong>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `;

    // Send the verification email
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: emailSubject,
      html: emailContent,
    });

    return NextResponse.json({ 
      success: true,
      token: verificationRecord.token
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
} 