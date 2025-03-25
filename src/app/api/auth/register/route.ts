import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getFirestoreDb } from '@/lib/init-firebase';
import { logger, logError } from '@/utils/logger';
import { handleApiError } from '@/utils/api-error';

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, phone, captchaValue } = await req.json();
    logger.info('Processing registration request', { email });

    // Validate required fields
    if (!email || !password) {
      logger.warn('Missing required fields for registration');
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Initialize Firestore
    const db = await getFirestoreDb();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUsers = await usersCollection.where('email', '==', email).get();

    if (!existingUsers.empty) {
      logger.warn('User already exists', { email });
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user document
    const userDoc = await usersCollection.add({
      email,
      password_hash: hashedPassword,
      first_name: firstName || null,
      last_name: lastName || null,
      phone: phone || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Create shopping cart document
    const cartsCollection = db.collection('carts');
    await cartsCollection.add({
      user_id: userDoc.id,
      items: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    logger.info('User registered successfully', { userId: userDoc.id });

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: userDoc.id,
          email
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, 'User Registration');
  }
} 