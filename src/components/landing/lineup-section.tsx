
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import type { Lineup } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import Link from 'next/link';

const dummyLineups: Lineup[] = [
    { id: "dummy-1", artistName: "Pamungkas", day: "Sabtu", date: "2025-08-30" },
    { id: "dummy-2", artistName: "Banda Neira", day: "Sabtu", date: "2025-08-30" },
    { id: "dummy-3", artistName: "Straight Club", day: "Sabtu", date: "2025-08-30" },
    { id: "dummy-4", artistName: "Maisonic", day: "Sabtu", date: "2025-08-31" },
    { id: "dummy-5", artistName: "Belangkon Haji", day: "Minggu", date: "2025-08-31" },
    { id: "dummy-6", artistName: "Unlefreak", day: "Minggu", date: "2025-08-31" },
    { id: "dummy-7", artistName: "Rumahsakit", day: "Minggu", date: "2025-08-31" },
    { id: "dummy-8", artistName: "The Overtunes", day: "Minggu", date: "2025-08-31" },
];


const LineupSection = () => {
    const [lineups, setLineups] = useState<Lineup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLineups = async () => {
            try {
                const response = await fetch('/api/lineup');
                if (!response.ok) {
                    throw new Error('Failed to fetch lineups');
                }
                let data: Lineup[] = await response.json();
                if (!data || data.length === 0) {
                    data = dummyLineups;
                }
                setLineups(data);
            } catch (error) {
                console.error("Error fetching lineups for landing page:", error);
                setLineups(dummyLineups);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLineups();
    }, []);

    const mainHeadliner = { name: "PARADE HUJAN", origin: "(Payung Teduh x Pusakata)" };
    const otherArtists = lineups.map(l => l.artistName);

    const renderSkeleton = () => (
        <section id="lineup" className="py-20 md:py-32 bg-background/5 backdrop-blur-sm">
            <div className="container mx-auto px-4 text-center">
                <Skeleton className="h-10 w-3/4 mx-auto mb-12" />
                <Skeleton className="h-16 w-1/2 mx-auto mb-8" />
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 max-w-4xl mx-auto mb-8">
                    {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-8 w-24" />)}
                </div>
                <Skeleton className="h-10 w-64 mx-auto mb-8" />
                <Skeleton className="h-8 w-80 mx-auto" />
            </div>
        </section>
    );

    if (isLoading) {
        return renderSkeleton();
    }
    
    if (lineups.length === 0) {
        return null;
    }

    return (
        <section id="lineup" className="relative py-20 md:py-32 bg-blue-400 text-white overflow-hidden animate-fade-up">
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-30" 
                style={{backgroundImage: "url('/images/day1.jpg')"}}
                data-ai-hint="sky clouds"
            ></div>
            <Image 
                src="/images/day2.jpg"
                alt="Disco Ball"
                width={200}
                height={200}
                className="absolute top-10 left-10 opacity-70 animate-subtle-float"
                data-ai-hint="disco ball"
            />
            <div className="relative z-10 container mx-auto px-4 text-center font-headline">
                <p className="tracking-widest text-sm mb-2 text-white/80">A FESTIVAL EXPERIENCE BY UNIYOUTH</p>
                <h2 className="text-7xl md:text-9xl font-black mb-2">{mainHeadliner.name}</h2>
                <p className="text-2xl md:text-3xl font-bold mb-10">{mainHeadliner.origin}</p>
                
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 max-w-5xl mx-auto text-xl md:text-2xl font-bold leading-relaxed">
                    {otherArtists.map((artist, index) => (
                        <React.Fragment key={artist}>
                            <span>{artist.toUpperCase()}</span>
                            {index < otherArtists.length - 1 && <span className="text-yellow-400 text-2xl">•</span>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="my-10">
                    <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-500 rounded-full px-6 py-3 font-bold">
                        <Link href="https://www.instagram.com/unilife.festival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                            MORE GUEST STARS TO BE ANNOUNCED
                        </Link>
                    </Button>
                </div>
                
                <div className="flex justify-center items-center gap-4 text-2xl font-bold tracking-wider">
                    <span>30-31 AGUSTUS 2025</span>
                    <Separator orientation="vertical" className="h-6 bg-white/50" />
                    <span>PKOR WAY HALIM, BANDAR LAMPUNG</span>
                </div>
            </div>
        </section>
    );
};

export default LineupSection;
