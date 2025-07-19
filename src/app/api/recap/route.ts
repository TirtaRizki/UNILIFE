
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, getDocs, query, orderBy } from 'firebase/firestore';
import type { Recap } from '@/lib/types';
import { revalidateTag } from 'next/cache';


const recapsCollection = collection(db, 'recaps');

// GET /api/recap
export async function GET() {
    try {
        const q = query(recapsCollection, orderBy("title", "asc"));
        const recapsSnapshot = await getDocs(q);
        const recaps = recapsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recap[];
        return NextResponse.json(recaps);
    } catch (error) {
        console.error("Error fetching recaps:", error);
        return NextResponse.json({ message: 'Error fetching recaps', error: (error as Error).message }, { status: 500 });
    }
}

// POST /api/recap
export async function POST(request: Request) {
    try {
        const recapData: Recap = await request.json();
        let savedRecap: Recap;

        if (recapData.id) { // Update
            const recapDoc = doc(db, "recaps", recapData.id);
            const { id, ...dataToUpdate } = recapData;
            await updateDoc(recapDoc, dataToUpdate);
            savedRecap = recapData;
        } else { // Create
            const { id, ...dataToAdd } = recapData;
            const docRef = await addDoc(recapsCollection, dataToAdd);
            savedRecap = { ...recapData, id: docRef.id };
        }
        
        revalidateTag('recaps'); // Revalidate the cache for recaps

        return NextResponse.json({ message: 'Recap saved successfully', recap: savedRecap }, { status: 201 });

    } catch (error) {
        console.error("Error saving recap:", error);
        return NextResponse.json({ message: 'Error saving recap', error: (error as Error).message }, { status: 500 });
    }
}
