import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { logger, logError } from '@/utils/logger';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports like 587
  auth: {
    user: 'thefairshoppe@gmail.com',
    pass: 'etdl giyh jisd thkz',
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate the input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email content
    const mailOptions = {
      from: 'thefairshoppe@gmail.com',
      to: 'thefairshoppe@gmail.com', // Send to the same email
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    logger.info(`Contact form submission sent successfully from ${email}`);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    logError(error, 'Contact Form');
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 