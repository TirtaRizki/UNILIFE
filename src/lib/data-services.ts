/**
 * @fileoverview This file contains data fetching services for the application.
 * It centralizes all Firestore queries, using the Firebase Admin SDK for server-side rendering.
 * NOTE: As of the last update, most landing page components were moved to client-side fetching
 * via API routes to ensure robust environment variable access. These functions are kept
 * for potential server-side use elsewhere or for reference.
 */
import { adminDb } from '@/lib/firebase-admin';
import type { About, Banner, Event, Lineup, Recap, BrandingSettings, User } from '@/lib/types';
import { unstable_cache } from 'next/cache';

// This function now explicitly ensures the admin app is initialized.
async function getCollection<T>(collectionName: string, orderByField?: string, orderDirection: 'asc' | 'desc' = 'asc'): Promise<T[]> {
    try {
        let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = adminDb().collection(collectionName);
        if (orderByField) {
            query = query.orderBy(orderByField, orderDirection);
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
        console.error(`Error fetching collection ${collectionName}:`, error);
        return [];
    }
}

// This function now explicitly ensures the admin app is initialized.
async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
        const docRef = adminDb().collection(collectionName).doc(docId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            return { id: docSnap.id, ...docSnap.data() } as T;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching document ${docId} from ${collectionName}:`, error);
        return null;
    }
}


// --- Branding Settings Service ---
const BRANDING_DOC_ID = 'singleton';

export const getBrandingSettings = unstable_cache(
    async (): Promise<BrandingSettings | null> => getDocument<BrandingSettings>('branding', BRANDING_DOC_ID),
    ['branding_settings'],
    { 
        revalidate: 3600,
        tags: ['branding_settings_tag'],
    } 
);

// --- Visitor Service ---
export const getVisitorCount = unstable_cache(
    async (): Promise<number> => {
        try {
            const docRef = adminDb().collection("siteStats").doc("visitors");
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                return docSnap.data()?.count || 0;
            }
            // If the document doesn't exist, create it.
            await docRef.set({ count: 0 });
            return 0;
        } catch (error) {
            console.error("Error fetching visitor count:", error);
            return 0;
        }
    },
    ['visitor_count'],
    {
        revalidate: 60, // Revalidate every minute
        tags: ['visitor_count'],
    }
);
