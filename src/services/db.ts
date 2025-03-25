import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Firestore,
} from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { logger, logError } from '@/utils/logger';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firestoreDb: Firestore;

const initializeFirebase = () => {
  try {
    logger.info('Initializing Firebase with config:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    
    if (!getApps().length) {
      logger.info('No existing Firebase app, initializing new one');
    } else {
      logger.info('Using existing Firebase app');
    }

    firestoreDb = getFirestore(app, 'fs-react-db');

    // Initialize Analytics if supported
    isSupported().then((supported) => {
      if (supported) {
        const analytics = getAnalytics(app);
        logger.info('Analytics initialized successfully');
      }
    }).catch((error) => {
      logger.warn('Analytics initialization failed:', error);
    });

    return app;
  } catch (error) {
    logError(error, 'Firebase Initialization');
    throw error;
  }
};

// Initialize Firebase on module load
initializeFirebase();

// Retry mechanism for Firestore operations
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      logError(error, `Operation failed (attempt ${attempt}/${maxRetries})`);
      
      if (attempt === maxRetries) break;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  throw lastError;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description?: string;
  image: string;
  category: string;
  condition: string;
  size?: string;
  brand?: string;
  created_at?: Date;
  updated_at?: Date;
}

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    return withRetry(async () => {
      logger.info('Client: Fetching products from Firestore...');
      const querySnapshot = await getDocs(collection(firestoreDb, 'products'));
      
      const products = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Convert Firestore timestamps to Date objects safely
        const created_at = data.created_at?.toDate?.() || null;
        const updated_at = data.updated_at?.toDate?.() || null;
        
        return {
          id: doc.id,
          ...data,
          price: Number(data.price),
          created_at,
          updated_at,
        } as Product;
      });

      logger.info('Client: Successfully fetched products:', products.length);
      return products;
    });
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    return withRetry(async () => {
      logger.info('Client: Creating new product in Firestore:', product);
      
      const productData = {
        ...product,
        price: Number(product.price),
        created_at: new Date(),
        updated_at: new Date(),
      };

      logger.debug('Client: Processed product data:', productData);
      
      const docRef = await addDoc(collection(firestoreDb, 'products'), productData);
      const newProduct = { id: docRef.id, ...productData };
      
      logger.info('Client: Successfully created product:', newProduct);
      return newProduct;
    });
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<void> => {
    return withRetry(async () => {
      logger.info('Client: Updating product in Firestore:', { id, product });
      
      const updateData = {
        ...product,
        updated_at: new Date(),
      };

      if ('price' in product) {
        updateData.price = Number(product.price);
      }

      logger.debug('Client: Processed update data:', updateData);
      
      await updateDoc(doc(firestoreDb, 'products', id), updateData);
      logger.info('Client: Successfully updated product');
    });
  },

  deleteProduct: async (id: string): Promise<void> => {
    return withRetry(async () => {
      logger.info('Client: Deleting product from Firestore:', id);
      await deleteDoc(doc(firestoreDb, 'products', id));
      logger.info('Client: Successfully deleted product');
    });
  },
}; 