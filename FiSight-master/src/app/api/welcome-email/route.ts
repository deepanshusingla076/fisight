import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    // Validation
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP not configured, skipping welcome email for:', email);
      
      return NextResponse.json(
        { message: 'Welcome email skipped - SMTP not configured' },
        { status: 200 }
      );
    }

    // Send welcome email using enhanced email service
    await emailService.sendWelcomeEmail({
      email,
      name,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Welcome email sent successfully!' 
    }, { status: 200 });

  } catch (error) {
    console.error('Welcome email error:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email' },
      { status: 500 }
    );
  }
}
