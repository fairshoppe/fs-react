import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logger } from '@/utils/logger';
import { handleApiError } from '@/utils/api-error';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('isAdmin');

    if (!isAdmin || isAdmin.value !== 'true') {
      logger.warn('Admin check failed: No valid admin cookie');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    logger.info('Admin check successful');
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Admin check error:', error);
    return handleApiError(error, 'Admin Check');
  }
} 