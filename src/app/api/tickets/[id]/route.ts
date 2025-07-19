import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase-admin/auth"; // gunakan Admin SDK untuk verifikasi token

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Ambil ID token Firebase dari header Authorization
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];

        // Verifikasi token & ambil user info
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // Ambil dokumen tiket
        const id = params.id;
        const ticketDoc = doc(db, 'tickets', id);
        const docSnap = await getDoc(ticketDoc);

        if (!docSnap.exists()) {
            return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
        }

        const ticketData = docSnap.data();
        // Pastikan user yang menghapus adalah pemilik tiket atau admin
        if (ticketData.ownerId !== userId && !decodedToken.admin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        // Hapus tiket
        await deleteDoc(ticketDoc);
        return NextResponse.json({ message: 'Ticket deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error deleting ticket:", error);
        return NextResponse.json({ message: 'Error deleting ticket', error: String(error) }, { status: 500 });
    }
}
