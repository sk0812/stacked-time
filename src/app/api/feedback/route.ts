import { NextResponse } from 'next/server';
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'stackedtime@focusmaths.com';
const TO_EMAIL = 'sidkheria@gmail.com'; // Replace with your email

export async function POST(req: Request) {
  try {
    const { reaction, message } = await req.json();

    if (!reaction || !message) {
      return NextResponse.json(
        { error: 'Reaction and message are required' },
        { status: 400 }
      );
    }

    // Send the feedback email
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `Stacked Time Feedback: ${reaction}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Feedback Received</h2>
          <p><strong>Type:</strong> ${reaction}</p>
          <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <p style="margin: 0;"><strong>Message:</strong></p>
            <p style="margin: 10px 0 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending feedback:', error);
    return NextResponse.json(
      { error: 'Failed to send feedback' },
      { status: 500 }
    );
  }
} 