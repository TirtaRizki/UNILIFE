
"use client";

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const VisitorCounter = ({ initialCount }: { initialCount: number }) => {
    // Initialize state with the value passed from the server
    const [count, setCount] = useState(initialCount);

    useEffect(() => {
        // This effect runs only on the client
        const incrementVisitorCount = async () => {
            try {
                // We only want to increment the count, not fetch it again.
                if (!sessionStorage.getItem('visitorCounted')) {
                    await fetch('/api/visitors', { method: 'POST' });
                    setCount(prevCount => prevCount + 1); // Optimistically update UI
                    sessionStorage.setItem('visitorCounted', 'true');
                }
            } catch (error) {
                console.error("Failed to increment visitor count:", error);
            }
        };

        incrementVisitorCount();
        // The dependency array is empty, so this runs once on mount.
    }, []);

    const displayCount = count.toLocaleString('id-ID');

    return (
        <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 flex items-center gap-3 text-white min-w-[140px]">
            <Users className="h-5 w-5 text-primary" />
            <div className="text-left">
                <p className="font-bold text-lg leading-none">{displayCount}</p>
                <p className="text-xs text-white/70">Total Visitors</p>
            </div>
        </div>
    );
};

export default VisitorCounter;
