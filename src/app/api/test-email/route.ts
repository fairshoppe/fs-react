import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { logger, logError } from '@/utils/logger';
import { handleApiError } from '@/utils/api-error';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    logger.info('Sending test email', { to: email });

    if (!email) {
      logger.warn('No email address provided');
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: process.env.EMAIL_SERVER_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Test Email from Fair Shoppe',
      text: 'This is a test email from Fair Shoppe.',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from Fair Shoppe.</p>
        <p>If you received this email, it means our email system is working correctly.</p>
      `,
    });

    logger.info('Test email sent successfully', { to: email });

    return NextResponse.json({
      message: 'Test email sent successfully',
    });
  } catch (error) {
    return handleApiError(error, 'Test Email');
  }
} 