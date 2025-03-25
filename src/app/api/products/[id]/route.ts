import { NextResponse } from 'next/server';
import { getFirestoreDb } from '@/lib/init-firebase';
import { logger, logError } from '@/utils/logger';
import { handleApiError } from '@/utils/api-error';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    logger.info('Fetching product by ID', { productId: id });

    const db = getFirestoreDb();
    const productRef = db.collection('products').doc(id);
    const product = await productRef.get();

    if (!product.exists) {
      logger.warn('Product not found', { productId: id });
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    logger.info('Product fetched successfully', { productId: id });
    return NextResponse.json({
      id: product.id,
      ...product.data(),
    });
  } catch (error) {
    return handleApiError(error, 'Product GET');
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    logger.info('Updating product', { productId: id, data });

    const db = getFirestoreDb();
    const productRef = db.collection('products').doc(id);
    const product = await productRef.get();

    if (!product.exists) {
      logger.warn('Product not found for update', { productId: id });
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
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
    });
  } catch (error) {
    return handleApiError(error, 'Product PUT');
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    logger.info('Deleting product', { productId: id });

    const db = getFirestoreDb();
    const productRef = db.collection('products').doc(id);
    const product = await productRef.get();

    if (!product.exists) {
      logger.warn('Product not found for deletion', { productId: id });
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    await productRef.delete();
    logger.info('Product deleted successfully', { productId: id });

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'Product DELETE');
  }
} 