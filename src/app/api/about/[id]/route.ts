
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { revalidateTag } from 'next/cache';

// DELETE /api/about/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const aboutDoc = doc(db, "abouts", id);
        
        const docSnap = await getDoc(aboutDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'About content not found' }, { status: 404 });
        }
        
        await deleteDoc(aboutDoc);
        revalidateTag('about_data'); // Revalidate the cache for about data

        return NextResponse.json({ message: 'About content deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error deleting about content:", error);
        return NextResponse.json({ message: 'Error deleting about content', error }, { status: 500 });
    }
}
