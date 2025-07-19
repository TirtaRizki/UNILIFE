
/**
 * @fileoverview This file handles the Firebase Admin SDK initialization using a robust singleton pattern.
 * This pattern ensures the SDK is initialized only once and is safe for Next.js server environments,
 * including serverless functions and hot-reloads during development.
 */
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

// Ensure this file is only run on the server
import 'server-only';

// Use globalThis to store the initialized app, preventing re-initialization.
declare global {
  var firebaseAdminApp: App | undefined;
}

/**
 * Retrieves the necessary Firebase service account credentials from environment variables.
 * Throws an error if any of the required variables are missing.
 * @returns The service account object for Firebase Admin SDK initialization.
 */
function getServiceAccount() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error(
      'Firebase Admin credentials are not set in environment variables. Required: FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    );
  }

  return {
    projectId: projectId,
    clientEmail: clientEmail,
    // Replace escaped newlines with actual newlines for the private key
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };
}

/**
 * Retrieves the Firebase Storage bucket name from environment variables.
 * Throws an error if the variable is missing.
 * @returns The Firebase Storage bucket name.
 */
function getStorageBucket() {
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
        throw new Error('Firebase Storage bucket name is not configured in environment variables (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET).');
    }
    return bucketName;
}


/**
 * Initializes and returns the Firebase Admin app instance, ensuring it's created only once.
 * This function uses a singleton pattern to prevent re-initialization during hot reloads or across serverless function invocations.
 * @returns The initialized Firebase Admin App.
 */
function getAdminApp(): App {
  // If the app is already initialized on the global object, return it.
  if (globalThis.firebaseAdminApp) {
    return globalThis.firebaseAdminApp;
  }
  
  const serviceAccount = getServiceAccount();
  const storageBucket = getStorageBucket();

  // Initialize the app with the retrieved credentials.
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageBucket,
  });

  console.log('Firebase Admin SDK initialized successfully.');

  // Store the initialized app on the global object for reuse.
  globalThis.firebaseAdminApp = app;

  return app;
}

/**
 * Provides access to the Firestore database instance from the initialized Firebase Admin SDK.
 * @returns The Firestore database instance.
 */
export const adminDb = () => admin.firestore();

/**
 * Provides access to the Cloud Storage instance from the initialized Firebase Admin SDK.
 * @returns The Cloud Storage instance.
 */
export const adminStorage = () => admin.storage();
