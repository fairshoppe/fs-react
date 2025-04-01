import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { logger, logError } from '@/utils/logger';

export function initializeFirebaseAdmin() {
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

    // Initialize the app if it doesn't exist
    const apps = getApps();
    if (!apps.length) {
      initializeApp({
        credential: cert({
          projectId: requiredEnvVars.projectId,
          clientEmail: requiredEnvVars.clientEmail,
          privateKey,
        }),
      });
      logger.info('Firebase Admin app initialized successfully with project:', requiredEnvVars.projectId);
    } else {
      logger.info('Using existing Firebase Admin app');
    }

    return apps[0];
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
    await initializeFirebaseAdmin();
  } catch (err) {
    if (err instanceof Error) {
      logError(err, 'Firebase Admin Initialization');
    } else {
      logger.error('Unknown error during Firebase Admin initialization');
    }
  }
})(); 