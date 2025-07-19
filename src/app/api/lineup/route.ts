
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, getDocs, query, orderBy } from 'firebase/firestore';
import type { Lineup } from '@/lib/types';
import { revalidateTag } from 'next/cache';

const lineupsCollection = collection(db, 'lineups');

// GET /api/lineup
export async function GET() {
    try {
        const q = query(lineupsCollection, orderBy("date", "asc"));
        const lineupsSnapshot = await getDocs(q);
        const lineups = lineupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Lineup[];
        return NextResponse.json(lineups);
    } catch (error) {
        console.error("Error fetching lineups:", error);
        return NextResponse.json({ message: 'Error fetching lineups', error: (error as Error).message }, { status: 500 });
    }
}

// POST /api/lineup
export async function POST(request: Request) {
    try {
        const lineupData: Lineup = await request.json();
        let savedLineup: Lineup;

        if (lineupData.id) { // Update
            const lineupDoc = doc(db, "lineups", lineupData.id);
            const { id, ...dataToUpdate } = lineupData;
            await updateDoc(lineupDoc, dataToUpdate);
            savedLineup = lineupData;
        } else { // Create
            const { id, ...dataToAdd } = lineupData;
            const docRef = await addDoc(lineupsCollection, dataToAdd);
            savedLineup = { ...lineupData, id: docRef.id };
        }
        
        revalidateTag('lineups'); // Revalidate the cache for lineups

        return NextResponse.json({ message: 'Lineup artist saved successfully', lineup: savedLineup }, { status: 201 });

    } catch (error) {
        console.error("Error saving lineup:", error);
        return NextResponse.json({ message: 'Error saving lineup artist', error: (error as Error).message }, { status: 500 });
    }
}
