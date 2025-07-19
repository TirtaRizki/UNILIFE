
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, getDocs, query, orderBy } from 'firebase/firestore';
import type { Event } from '@/lib/types';
import { revalidateTag } from 'next/cache';

const eventsCollection = collection(db, 'events');

// GET /api/events
export async function GET() {
    try {
        const q = query(eventsCollection, orderBy("date", "desc"));
        const eventsSnapshot = await getDocs(q);
        const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ message: 'Error fetching events', error: (error as Error).message }, { status: 500 });
    }
}

// POST /api/events
export async function POST(request: Request) {
    try {
        const eventData: Event = await request.json();
        let savedEvent: Event;

        if (eventData.id) { // Update
            const eventDoc = doc(db, "events", eventData.id);
            const { id, ...dataToUpdate } = eventData;
            await updateDoc(eventDoc, dataToUpdate);
            savedEvent = eventData;
        } else { // Create
            const { id, ...dataToAdd } = eventData;
            const docRef = await addDoc(eventsCollection, dataToAdd);
            savedEvent = { ...eventData, id: docRef.id };
        }
        
        revalidateTag('events'); // Revalidate the cache for events

        return NextResponse.json({ message: 'Event saved successfully', event: savedEvent }, { status: 201 });

    } catch (error) {
        console.error("Error saving event:", error);
        return NextResponse.json({ message: 'Error saving event', error: (error as Error).message }, { status: 500 });
    }
}
