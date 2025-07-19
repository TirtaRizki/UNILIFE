
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Event } from '@/lib/types';

// GET /api/stats
export async function GET() {
    try {
        const usersCollection = collection(db, 'users');
        const committeesCollection = collection(db, 'committees');
        const eventsCollection = collection(db, 'events');
        const lineupsCollection = collection(db, 'lineups');
        
        const [
            usersSnapshot,
            committeesSnapshot,
            eventsSnapshot,
            lineupsSnapshot,
        ] = await Promise.all([
            getDocs(usersCollection),
            getDocs(committeesCollection),
            getDocs(eventsCollection),
            getDocs(lineupsCollection),
        ]);
        
        // Filter events in memory
        const allEvents = eventsSnapshot.docs.map(doc => doc.data() as Event);
        const activeEventsCount = allEvents.filter(event => event.status === 'Upcoming').length;

        const stats = {
            usersCount: usersSnapshot.size,
            committeesCount: committeesSnapshot.size,
            activeEventsCount: activeEventsCount,
            lineupsCount: lineupsSnapshot.size,
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ message: 'Error fetching stats', error: (error as Error).message }, { status: 500 });
    }
}
