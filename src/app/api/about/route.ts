
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, addDoc, updateDoc, collection, getDocs, limit, query } from 'firebase/firestore';
import type { About } from '@/lib/types';
import { revalidateTag } from 'next/cache';

// GET /api/about
export async function GET() {
    try {
        // There should only be one 'about' document. We fetch the first one we find.
        const q = query(collection(db, "abouts"), limit(1));
        const querySnapshot = await getDocs(q);
        
        let aboutContent: About | null = null;
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            aboutContent = { id: doc.id, ...doc.data() } as About;
        }

        // To maintain consistency, we return an array, even if it's just one item or empty.
        const data = aboutContent ? [aboutContent] : [];
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching about content:", error);
        return NextResponse.json({ message: 'Error fetching about content', error: (error as Error).message }, { status: 500 });
    }
}

// POST /api/about
export async function POST(request: Request) {
    try {
        const aboutData: About = await request.json();
        let savedAbout: About;

        if (aboutData.id) { // Update
            const aboutDoc = doc(db, "abouts", aboutData.id);
            const { id, ...dataToUpdate } = aboutData;
            await updateDoc(aboutDoc, dataToUpdate);
            savedAbout = aboutData;
        } else { // Create
            // Since there should only be one about page, this logic handles creation.
            // A more robust solution might use a known document ID.
            const { id, ...dataToAdd } = aboutData;
            const docRef = await addDoc(collection(db, 'abouts'), dataToAdd);
            savedAbout = { ...aboutData, id: docRef.id };
        }

        revalidateTag('about_data'); // Revalidate the cache for about data

        return NextResponse.json({ message: 'About content saved successfully', about: savedAbout }, { status: 201 });

    } catch (error) {
        console.error("Error saving about content:", error);
        return NextResponse.json({ message: 'Error saving about content', error: (error as Error).message }, { status: 500 });
    }
}
