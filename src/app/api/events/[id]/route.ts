
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { revalidateTag } from 'next/cache';

// DELETE /api/events/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const eventDoc = doc(db, "events", id);

        const docSnap = await getDoc(eventDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }
        
        await deleteDoc(eventDoc);
        revalidateTag('events'); // Revalidate the cache for events

        return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json({ message: 'Error deleting event', error }, { status: 500 });
    }
}
