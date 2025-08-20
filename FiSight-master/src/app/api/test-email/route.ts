import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function GET() {
  try {
    console.log('🔧 Testing email configuration...');
    
    // Test SMTP connection
    const connectionTest = await emailService.testConnection();
    
    if (!connectionTest) {
      return NextResponse.json(
        { 
          error: 'SMTP connection failed',
          details: 'Please check your SMTP configuration in environment variables'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'SMTP connection successful',
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER ? 'configured' : 'missing',
        from: process.env.SMTP_FROM,
      }
    });

  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { 
        error: 'Email test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required for testing' },
        { status: 400 }
      );
    }

    // Send test welcome email
    await emailService.sendWelcomeEmail({
      email,
      name,
    });

    return NextResponse.json({ 
      success: true,
      message: `Test welcome email sent to ${email}` 
    });

  } catch (error) {
    console.error('Test email send error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
