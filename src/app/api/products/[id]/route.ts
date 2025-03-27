import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb } from '@/lib/init-firebase';
import { logger } from '@/utils/logger';
import { handleApiError } from '@/utils/api-error';
import type { Handler } from 'typed-route-handler';

type ProductResponse = {
  id: string;
  [key: string]: any;
};

type ErrorResponse = {
  error: string;
};

type DeleteResponse = {
  message: string;
};

function isValidId(id: string | string[] | undefined): id is string {
  return typeof id === 'string' && id.length > 0;
}

export const GET: Handler<ProductResponse | ErrorResponse> = async (
  request: NextRequest,
  context
) => {
  try {
    const params = await context.params;
    const id = params.id;

    if (!isValidId(id)) {
      logger.warn('Invalid product ID provided', { id });
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    logger.info('Fetching product by ID', { productId: id });

    const db = getFirestoreDb();
    const productRef = db.collection('products').doc(id);
    const product = await productRef.get();

    if (!product.exists) {
      logger.warn('Product not found', { productId: id });
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    logger.info('Product fetched successfully', { productId: id });
    return NextResponse.json({
      id: product.id,
      ...product.data(),
    }, { status: 200 });
  } catch (error) {
    return handleApiError(error, 'Product GET');
  }
};

export const PUT: Handler<ProductResponse | ErrorResponse> = async (
  request: NextRequest,
  context
) => {
  try {
    const params = await context.params;
    const id = params.id;

    if (!isValidId(id)) {
      logger.warn('Invalid product ID provided', { id });
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const data = await request.json();
    logger.info('Updating product', { productId: id, data });

    const db = getFirestoreDb();
    const productRef = db.collection('products').doc(id);
    const product = await productRef.get();

    if (!product.exists) {
      logger.warn('Product not found for update', { productId: id });
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await productRef.update({
      ...data,
      updatedAt: new Date().toISOString(),
    });

    const updatedProduct = await productRef.get();
    logger.info('Product updated successfully', { productId: id });

    return NextResponse.json({
      id: updatedProduct.id,
      ...updatedProduct.data(),
    }, { status: 200 });
  } catch (error) {
    return handleApiError(error, 'Product PUT');
  }
};

export const DELETE: Handler<DeleteResponse | ErrorResponse> = async (
  request: NextRequest,
  context
) => {
  try {
    const params = await context.params;
    const id = params.id;

    if (!isValidId(id)) {
      logger.warn('Invalid product ID provided', { id });
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    logger.info('Deleting product', { productId: id });

    const db = getFirestoreDb();
    const productRef = db.collection('products').doc(id);
    const product = await productRef.get();

    if (!product.exists) {
      logger.warn('Product not found for deletion', { productId: id });
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await productRef.delete();
    logger.info('Product deleted successfully', { productId: id });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    return handleApiError(error, 'Product DELETE');
  }
}; 