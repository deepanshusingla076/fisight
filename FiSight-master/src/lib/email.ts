import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

interface WelcomeEmailData {
  name: string;
  email: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Log SMTP configuration (without sensitive data)
    console.log('🔧 Initializing SMTP with:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? '***configured***' : 'NOT SET',
      pass: process.env.SMTP_PASS ? '***configured***' : 'NOT SET',
      from: process.env.SMTP_FROM,
    });

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true, // Enable debug logs
      logger: true, // Enable logger
    });
  }

  private async sendEmail({ to, subject, html, text }: EmailOptions) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
      text,
    };

    console.log('📧 Sending email to:', to, 'Subject:', subject);
    
    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Email send failed:', error);
      throw error;
    }
  }

  async sendContactForm(data: ContactFormData) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">FiSight Contact Form</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f8fafc;">
          <h2 style="color: #2563eb; margin-top: 0;">New Contact Form Submission</h2>
          
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>Name:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${data.email}</td>
              </tr>
              ${data.subject ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>Subject:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${data.subject}</td>
              </tr>
              ` : ''}
            </table>
            
            <div style="margin-top: 20px;">
              <strong>Message:</strong>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 4px; margin-top: 10px; line-height: 1.6;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #e2e8f0; border-radius: 8px;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              📧 Received on ${new Date().toLocaleString('en-US', { 
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })} IST
            </p>
          </div>
        </div>
        
        <div style="background-color: #1e293b; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            This email was sent from FiSight Contact Form | 
            <a href="https://fisight.com" style="color: #60a5fa;">www.fisight.com</a>
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: process.env.SMTP_TO || 'contact@fisight.com',
      subject: `New Contact: ${data.subject || 'General Inquiry'} - ${data.name}`,
      html,
    });
  }

  async sendWelcomeEmail(data: WelcomeEmailData) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to FiSight!</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 10px 0 0 0;">Your Financial Journey Starts Here</p>
        </div>
        
        <div style="padding: 40px; background-color: #f8fafc;">
          <h2 style="color: #2563eb; margin-top: 0;">Hello ${data.name}! 👋</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Thank you for joining FiSight! We're excited to help you take control of your financial future with AI-powered insights and personalized recommendations.
          </p>

          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 25px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">🚀 Get Started:</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li>📊 Connect your bank accounts and investments</li>
              <li>📈 Track your portfolio performance in real-time</li>
              <li>🤖 Get AI-powered financial advice</li>
              <li>🎯 Set and achieve your financial goals</li>
              <li>📱 Access your dashboard anytime, anywhere</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:9002'}/dashboard" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>

          <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
            <p style="color: #0c4a6e; margin: 0; font-size: 14px;">
              <strong>💡 Pro Tip:</strong> Complete your financial profile to get more accurate AI recommendations tailored to your goals.
            </p>
          </div>
        </div>
        
        <div style="background-color: #1e293b; padding: 30px; text-align: center;">
          <p style="color: #94a3b8; font-size: 14px; margin: 0 0 10px 0;">
            Need help? We're here for you!
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            Contact us at <a href="mailto:support@fisight.com" style="color: #60a5fa;">support@fisight.com</a> | 
            <a href="https://fisight.com" style="color: #60a5fa;">www.fisight.com</a>
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: data.email,
      subject: '🎉 Welcome to FiSight - Your Financial Journey Begins!',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, resetLink: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset Request</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f8fafc;">
          <h2 style="color: #2563eb; margin-top: 0;">Reset Your Password</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            We received a request to reset your password for your FiSight account. Click the button below to reset your password:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Reset Password
            </a>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
            </p>
          </div>
        </div>
        
        <div style="background-color: #1e293b; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            This email was sent from FiSight Security | 
            <a href="https://fisight.com" style="color: #60a5fa;">www.fisight.com</a>
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: '🔐 FiSight Password Reset Request',
      html,
    });
  }

  // Test method to verify SMTP configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection test failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
