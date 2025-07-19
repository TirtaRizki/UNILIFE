
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from "firebase/firestore";

// DELETE /api/committee/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const committeeDoc = doc(db, "committees", id);
        
        const docSnap = await getDoc(committeeDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'Committee member not found' }, { status: 404 });
        }
        
        await deleteDoc(committeeDoc);
        return NextResponse.json({ message: 'Committee member deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error deleting committee member:", error);
        return NextResponse.json({ message: 'Error deleting committee member', error }, { status: 500 });
    }
}
