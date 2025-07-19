
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from "firebase/firestore";

// DELETE /api/users/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const userDoc = doc(db, "users", id);

        const docSnap = await getDoc(userDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        
        await deleteDoc(userDoc);
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: 'Error deleting user', error }, { status: 500 });
    }
}
