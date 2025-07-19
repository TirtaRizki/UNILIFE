
import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from '@/lib/types';
import { rateLimitMiddleware } from '@/lib/rate-limiter';

const usersCollection = collection(db, 'users');

// Hardcoded default users - This list is used to bootstrap the first users if the database is empty.
const defaultUsers: Omit<User, 'id'>[] = [
    { email: 'admin@unilifefest.com', password: 'unilifejaya123', role: 'Admin', name: 'Super Admin', phoneNumber: '08001234567' },
    { email: 'panitia2025@unilife.com', password: 'lampungfest123', role: 'Panitia', name: 'Panitia 2025', phoneNumber: '08119876543' }
];

async function initializeDefaultUsers() {
    console.log("Initializing default users...");
    for (const userData of defaultUsers) {
        // Check if user already exists
        const q = query(usersCollection, where("email", "==", userData.email));
        const existingUserSnapshot = await getDocs(q);
        if (existingUserSnapshot.empty) {
            await addDoc(usersCollection, userData);
            console.log(`Created user: ${userData.email}`);
        }
    }
}

// POST /api/auth/login
export async function POST(request: Request) {
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const { email, password } = await request.json();

        // Check if there are any users in the database. If not, create the defaults.
        const allUsersSnapshot = await getDocs(usersCollection);
        if (allUsersSnapshot.empty) {
            await initializeDefaultUsers();
        }

        // Find the user by email
        const q = query(usersCollection, where("email", "==", email));
        const userSnapshot = await getDocs(q);

        if (userSnapshot.empty) {
            return NextResponse.json({ message: 'Invalid credentials or user not found.' }, { status: 401 });
        }

        const userDoc = userSnapshot.docs[0];
        const foundUser = { id: userDoc.id, ...userDoc.data() } as User;

        if (foundUser.password !== password) {
            return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
        }

        // Only allow Admin or Panitia to log in to the CMS
        if (foundUser.role === 'Admin' || foundUser.role === 'Panitia') {
            const { password, ...userToReturn } = foundUser;
            return NextResponse.json({ message: 'Login successful', user: userToReturn });
        } else {
            return NextResponse.json({ message: 'This account does not have admin/committee privileges.' }, { status: 403 });
        }
        
    } catch (error) {
        console.error("Login error:", error);
        const err = error as Error;
        return NextResponse.json({ message: 'An internal server error occurred', error: err.message }, { status: 500 });
    }
}
