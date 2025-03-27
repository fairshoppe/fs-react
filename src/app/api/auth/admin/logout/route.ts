import { NextResponse } from 'next/server';
import { logger } from '@/utils/logger';
import { handleApiError } from '@/utils/api-error';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('isAdmin');
    
    logger.info('Admin logout successful');
    return response;
  } catch (error) {
    return handleApiError(error, 'Admin Logout');
  }
} 