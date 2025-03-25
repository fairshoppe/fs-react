import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, CollectionReference, Firestore } from 'firebase-admin/firestore';
import { logger, logError } from '@/utils/logger';

let firestoreDb: Firestore;

export function getFirestoreDb() {
  if (firestoreDb) {
    logger.debug('Returning existing Firestore instance');
    return firestoreDb;
  }

  try {
    logger.info('Initializing Firebase Admin app...');

    // Check required environment variables
    const requiredEnvVars = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    };

    // Type guard to ensure all environment variables are defined
    const isEnvVarsComplete = (vars: typeof requiredEnvVars): vars is {
      projectId: string;
      clientEmail: string;
      privateKey: string;
    } => {
      return Object.values(vars).every(value => value !== undefined && value !== null);
    };

    // Validate environment variables
    if (!isEnvVarsComplete(requiredEnvVars)) {
      const missingVars = Object.entries(requiredEnvVars)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Log environment variables check (without sensitive data)
    logger.info('Environment variables check:', {
      projectId: requiredEnvVars.projectId ? 'Set' : 'Missing',
      clientEmail: requiredEnvVars.clientEmail ? 'Set' : 'Missing',
      privateKey: requiredEnvVars.privateKey ? 'Set' : 'Missing',
    });

    // Format private key correctly
    const privateKey = requiredEnvVars.privateKey.replace(/\\n/g, '\n');

    // Construct database URL
    const databaseURL = `https://${requiredEnvVars.projectId}.firebaseio.com`;
    logger.info('Initializing Firebase Admin with database URL:', databaseURL);

    // Initialize the app if it doesn't exist
    const apps = getApps();
    if (!apps.length) {
      initializeApp({
        credential: cert({
          projectId: requiredEnvVars.projectId,
          clientEmail: requiredEnvVars.clientEmail,
          privateKey,
        }),
        databaseURL,
      });
      logger.info('Firebase Admin app initialized successfully with project:', requiredEnvVars.projectId);
    } else {
      logger.info('Using existing Firebase Admin app');
    }

    logger.info('Initializing Firestore...');
    firestoreDb = getFirestore();

    // Test database connection
    void (async () => {
      try {
        logger.debug('Testing Firestore connection...');
        const collections = await firestoreDb.listCollections();
        logger.info('Successfully connected to Firestore database');
        logger.debug(
          'Available collections:',
          collections.map((c: CollectionReference) => c.id)
        );
      } catch (err) {
        // Only log connection test errors in development mode
        if (process.env.NODE_ENV === 'development') {
          if (err instanceof Error) {
            logger.warn('Firestore connection test failed:', err.message);
          } else {
            logger.warn('Unknown error during Firestore connection test');
          }
        }
        // Don't throw the error as it's just a test
      }
    })();

    return firestoreDb;
  } catch (err) {
    if (err instanceof Error) {
      logError(err, 'Firebase Admin Initialization');
    } else {
      logger.error('Unknown error during Firebase Admin initialization');
    }
    throw err;
  }
}

// Initialize Firebase Admin
void (async () => {
  try {
    await getFirestoreDb();
  } catch (err) {
    if (err instanceof Error) {
      logError(err, 'Firebase Admin Initialization');
    } else {
      logger.error('Unknown error during Firebase Admin initialization');
    }
  }
})(); 