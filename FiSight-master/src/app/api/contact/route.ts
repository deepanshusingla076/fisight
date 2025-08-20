import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, subject } = await request.json();

    // Validation
    if (!name || !email || !message) {
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
      console.warn('SMTP not configured, logging contact form submission:', {
        name,
        email,
        message,
        subject,
        timestamp: new Date().toISOString(),
      });
      
      return NextResponse.json(
        { message: 'Message received successfully' },
        { status: 200 }
      );
    }

    // Send email using enhanced email service
    await emailService.sendContactForm({
      name,
      email,
      message,
      subject,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you soon.' 
    }, { status: 200 });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
