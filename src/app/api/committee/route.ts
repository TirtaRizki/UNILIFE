
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import type { Committee, User } from '@/lib/types';

// GET /api/committee
export async function GET() {
    try {
        const committeeSnapshot = await getDocs(collection(db, 'committees'));
        const committees = committeeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Omit<Committee, 'user'>[];
        
        const populatedCommittees = await Promise.all(
            committees.map(async (committee) => {
                if (!committee.userId) return { ...committee, user: undefined };
                const userDocRef = doc(db, "users", committee.userId);
                const userDoc = await getDoc(userDocRef);
                const user = userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } as User : undefined;
                return { ...committee, user };
            })
        );
        
        return NextResponse.json(populatedCommittees);
    } catch (error) {
        console.error("Error fetching committees:", error);
        return NextResponse.json({ message: 'Error fetching committees', error }, { status: 500 });
    }
}

// POST /api/committee
export async function POST(request: Request) {
    try {
        const committeeData: Omit<Committee, 'user'> = await request.json();
        let savedCommittee: Omit<Committee, 'user'>;

        if (committeeData.id) { // Update
            const committeeDoc = doc(db, "committees", committeeData.id);
            const { id, ...dataToUpdate } = committeeData;
            await updateDoc(committeeDoc, dataToUpdate);
            savedCommittee = committeeData;
        } else { // Create
            const { id, ...dataToAdd } = committeeData;
            const docRef = await addDoc(collection(db, 'committees'), dataToAdd);
            savedCommittee = { ...committeeData, id: docRef.id };
        }
        
        return NextResponse.json({ message: 'Committee member saved successfully', committee: savedCommittee }, { status: 201 });

    } catch (error) {
        console.error("Error saving committee member:", error);
        return NextResponse.json({ message: 'Error saving committee member', error }, { status: 500 });
    }
}
