import { NextResponse } from 'next/server';
import { getFirestoreDb } from '@/lib/init-firebase';
import { logger, logError } from '@/utils/logger';

export async function GET() {
  try {
    logger.info('Starting Firebase connection test...');
    const db = getFirestoreDb();

    logger.info('Firestore initialized');
    const testCollection = db.collection('test_collection');

    logger.info('Collection reference created');
    const snapshot = await testCollection.limit(1).get();

    logger.info('Successfully read from collection');
    logger.info('Number of documents:', snapshot.size);

    return NextResponse.json({
      success: true,
      message: 'Firebase connection test successful',
      documentsRead: snapshot.size,
    });
  } catch (error) {
    logger.error('Firebase connection test failed');

    if (error instanceof Error) {
      logError(error, 'Firebase Test');
      return NextResponse.json(
        {
          success: false,
          message: 'Firebase connection test failed',
          error: error.message,
        },
        { status: 500 }
      );
    }

    logger.error('Unknown error type during Firebase test');
    return NextResponse.json(
      {
        success: false,
        message: 'Firebase connection test failed',
        error: 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
} 