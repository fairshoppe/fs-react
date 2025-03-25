import { NextResponse } from 'next/server';
import { logger, logError } from '@/utils/logger';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown) {
  logError(error, 'API');

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
    { status: 500 }
  );
}

export function createAPIError(message: string, statusCode: number, code: string) {
  return new APIError(message, statusCode, code);
}

export function handleApiError(error: unknown, context: string) {
  if (error instanceof Error) {
    logError(error, context);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  logger.error(`Unknown error in ${context}`);
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
} 