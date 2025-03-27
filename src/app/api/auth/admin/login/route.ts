import { NextResponse } from 'next/server';
import { logger } from '@/utils/logger';
import { handleApiError } from '@/utils/api-error';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log('Login attempt details:', {
      providedUsername: username,
      providedPassword: password,
      envUsername: process.env.ADMIN_USERNAME,
      envPassword: process.env.ADMIN_PASSWORD,
      nodeEnv: process.env.NODE_ENV,
    });

    // Get admin credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured:', {
        hasUsername: !!adminUsername,
        hasPassword: !!adminPassword,
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const credentialsMatch = username === adminUsername && password === adminPassword;
    console.log('Credentials match:', credentialsMatch);

    if (credentialsMatch) {
      console.log('Credentials valid, setting cookie');
      
      // Create headers with the cookie (20 minutes expiration)
      const headers = new Headers();
      headers.append('Set-Cookie', 'isAdmin=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=1200');

      // Create the response with the cookie header
      const response = NextResponse.json(
        { success: true },
        { headers }
      );

      console.log('Cookie set successfully');
      logger.info('Admin login successful');
      return response;
    }

    console.log('Invalid credentials');
    logger.warn('Failed admin login attempt');
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return handleApiError(error, 'Admin Login');
  }
} 