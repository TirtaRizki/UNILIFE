
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';

const usersCollection = collection(db, 'users');

// GET /api/users
export async function GET() {
    try {
        const snapshot = await getDocs(usersCollection);
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            // Ensure password is not sent to the client
            const { password, ...user } = data;
            return { id: doc.id, ...user };
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: 'Error fetching users', error: (error as Error).message }, { status: 500 });
    }
}

// POST /api/users
export async function POST(request: Request) {
    try {
        const userData: Partial<User> & { id?: string } = await request.json();
        const { id, ...data } = userData;

        if (id) { // Update existing user
            const userDocRef = doc(db, "users", id);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }
            
            // Don't update the password if it's not provided or empty
            const dataToUpdate = { ...data };
            if (!dataToUpdate.password) {
                delete dataToUpdate.password;
            }

            await updateDoc(userDocRef, dataToUpdate);
            const updatedDoc = await getDoc(userDocRef);
            const updatedData = {id: updatedDoc.id, ...updatedDoc.data()};

            const { password, ...userToReturn } = updatedData;
            return NextResponse.json({ message: 'User updated successfully', user: userToReturn }, { status: 200 });

        } else { // Create new user
            // Check if email already exists
            const q = query(usersCollection, where("email", "==", userData.email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
            }
            if (!data.password) {
                 return NextResponse.json({ message: 'Password is required for new users' }, { status: 400 });
            }
            const docRef = await addDoc(usersCollection, data);
            const savedUser = { ...data, id: docRef.id };
            
            const { password, ...userToReturn } = savedUser;
            return NextResponse.json({ message: 'User created successfully', user: userToReturn }, { status: 201 });
        }
        
    } catch (error) {
        console.error("Error saving user:", error);
        return NextResponse.json({ message: 'Error saving user', error: (error as Error).message }, { status: 500 });
    }
}
