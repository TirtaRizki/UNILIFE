import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { revalidateTag } from 'next/cache';

// Helper function: ensures visitors doc exists
async function ensureVisitorDocExists(visitorDocRef: FirebaseFirestore.DocumentReference) {
    try {
        const docSnap = await visitorDocRef.get();
        if (!docSnap.exists) {
            console.warn("siteStats/visitors not found. Creating new document...");
            await visitorDocRef.set({ count: 0 });
            return { count: 0 };
        }
        return docSnap.data();
    } catch (err) {
        console.error("Failed to check or create siteStats/visitors:", err);
        throw new Error("Firestore error: " + (err instanceof Error ? err.message : String(err)));
    }
}

// GET /api/visitors - Fetch current visitor count
export async function GET() {
    try {
        const db = adminDb();
        const visitorDocRef = db.collection("siteStats").doc("visitors");
        const data = await ensureVisitorDocExists(visitorDocRef);

        return NextResponse.json({ count: data?.count || 0 });
    } catch (error) {
        console.error("Error fetching visitor count:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return NextResponse.json(
            { message: 'Error fetching visitor count', error: errorMessage },
            { status: 500 }
        );
    }
}

// POST /api/visitors - Increment visitor count
export async function POST() {
    try {
        const db = adminDb();
        const visitorDocRef = db.collection("siteStats").doc("visitors");
        await ensureVisitorDocExists(visitorDocRef);

        await visitorDocRef.update({
            count: FieldValue.increment(1)
        });

        // Revalidate tag to update cached visitor count
        revalidateTag('visitor_count');

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error incrementing visitor count:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return NextResponse.json(
            { message: 'Error incrementing visitor count', error: errorMessage },
            { status: 500 }
        );
    }
}
