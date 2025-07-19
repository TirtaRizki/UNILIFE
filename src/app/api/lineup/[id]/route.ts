import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getAuth } from 'firebase-admin/auth';
import { collection, getDocs, addDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import type { Ticket } from '@/lib/types';

const ticketsCollection = collection(db, 'tickets');

// Middleware: Verifikasi Firebase ID Token
async function verifyUser(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw { status: 401, message: 'Unauthorized: Missing token' };
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken;
}

// GET /api/tickets - Fetch tickets for the logged-in user (or all if admin)
export async function GET(request: Request) {
    try {
        const decodedToken = await verifyUser(request);

        let q;
        if (decodedToken.admin) {
            // Admin gets all tickets
            q = ticketsCollection;
        } else {
            // User only gets their own tickets
            q = query(ticketsCollection, where('ownerId', '==', decodedToken.uid));
        }

        const snapshot = await getDocs(q);
        const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Ticket[];

        return NextResponse.json(tickets);
    } catch (error: any) {
        console.error("Error fetching tickets:", error);
        const status = error.status || 500;
        return NextResponse.json({ message: 'Error fetching tickets', error: error.message }, { status });
    }
}

// POST /api/tickets - Create or update a ticket
export async function POST(request: Request) {
    try {
        const decodedToken = await verifyUser(request);
        const ticketData: Ticket = await request.json();
        let savedTicket: Ticket;

        if (ticketData.id) {
            // Update existing ticket
            const ticketDoc = doc(db, 'tickets', ticketData.id);
            const existingDoc = await getDocs(query(ticketsCollection, where('__name__', '==', ticketData.id)));

            if (!decodedToken.admin) {
                const existingOwnerId = existingDoc.docs[0]?.data()?.ownerId;
                if (existingOwnerId !== decodedToken.uid) {
                    throw { status: 403, message: 'Forbidden: Not the ticket owner' };
                }
            }

            const { id, ...dataToUpdate } = ticketData;
            await updateDoc(ticketDoc, dataToUpdate);
            savedTicket = ticketData;
        } else {
            // Create new ticket
            const { id, ...dataToAdd } = ticketData;
            const docRef = await addDoc(ticketsCollection, {
                ...dataToAdd,
                ownerId: decodedToken.uid, // Set ownerId to current user
                createdAt: Date.now(),
            });
            savedTicket = { ...dataToAdd, id: docRef.id };
        }

        return NextResponse.json({ message: 'Ticket saved successfully', ticket: savedTicket }, { status: 201 });
    } catch (error: any) {
        console.error("Error saving ticket:", error);
        const status = error.status || 500;
        return NextResponse.json({ message: 'Error saving ticket', error: error.message }, { status });
    }
}
