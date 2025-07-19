
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { revalidateTag } from 'next/cache';

// DELETE /api/banners/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const bannerDoc = doc(db, "banners", id);
        
        const docSnap = await getDoc(bannerDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
        }
        
        await deleteDoc(bannerDoc);
        revalidateTag('banners'); // Revalidate the cache for banners

        return NextResponse.json({ message: 'Banner deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error deleting banner:", error);
        return NextResponse.json({ message: 'Error deleting banner', error }, { status: 500 });
    }
}
