import { NextResponse } from 'next/server';
import { getFirestoreDb } from '@/lib/init-firebase';
import { logger, logError } from '@/utils/logger';
import { handleApiError } from '@/utils/api-error';

export async function GET() {
  try {
    logger.info('Fetching all products...');
    const db = getFirestoreDb();
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    logger.info('Products fetched successfully', { count: products.length });
    return NextResponse.json(products);
  } catch (error) {
    return handleApiError(error, 'Products GET');
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logger.info('Creating new product', { data });

    const db = getFirestoreDb();
    const productsRef = db.collection('products');
    const docRef = await productsRef.add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const newProduct = await docRef.get();
    logger.info('Product created successfully', { productId: docRef.id });

    return NextResponse.json({
      id: docRef.id,
      ...newProduct.data(),
    });
  } catch (error) {
    return handleApiError(error, 'Products POST');
  }
} 