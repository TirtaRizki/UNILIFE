
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Music, Sparkles, Ticket } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Countdown from '@/components/countdown';
import { Button } from '@/components/ui/button';

const TiketinCta = () => (
    <Link href="https://mytiketin.com/" target="_blank" rel="noopener noreferrer" className="block group">
        <div className="relative rounded-xl overflow-hidden p-8 md:p-12 text-center text-white bg-gradient-to-r from-green-500 via-blue-500 to-red-500 transition-transform duration-300 group-hover:scale-[1.02] shadow-lg shadow-primary/30">
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4">
                    Tinggal Klik, Tiketin Aja!
                </h2>
                <p className="max-w-xl mx-auto mb-6 text-white/80">
                    Sekarang beli tiket hanya semudah klik, cari informasi tentang event kamu disini biar gak ketinggalan!
                </p>
                <Button 
                    size="lg"
                    className="bg-white/90 text-primary hover:bg-yellow-300 hover:text-black font-semibold transition-all"
                >
                    Cari Event Sekarang
                </Button>
            </div>
        </div>
    </Link>
);


export default function DashboardSection() {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    useEffect(() => {
        if(isClient) {
            setDate(new Date());
        }
    }, [isClient]);

    return (
        <section id="dashboard-info" className="py-20 md:py-32 bg-background/80 backdrop-blur-sm animate-fade-up">
            <div className="container mx-auto px-4 grid gap-8">
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-5">
                    <Card className="lg:col-span-3 bg-card/80 border-border/20 p-4 md:p-6 flex flex-col gap-8 items-center justify-center rounded-xl shadow-lg">
                        <Countdown targetDate="2025-08-30T00:00:00" title="Start The Event" />
                        <div className="relative w-full max-w-sm flex items-center justify-center">
                            <div className="absolute inset-x-0 h-px bg-border/50"></div>
                            <div className="relative flex items-center gap-4 bg-background px-4 rounded-full">
                                <Sparkles className="h-5 w-5 text-yellow-500" />
                                <Ticket className="h-5 w-5 text-red-500" />
                                <Music className="h-5 w-5 text-green-500" />
                            </div>
                        </div>
                        <Countdown 
                            targetDate="2025-07-21T19:00:00" 
                            title="War Tiket Dimulai" 
                            showButtonOnEnd={true}
                            buttonText="Beli Tiket Sekarang"
                            buttonLink="https://mytiketin.com/event/79"
                        />
                    </Card>
                    <Card className="lg:col-span-2 bg-card/80 border-border/20 flex justify-center items-center p-2 rounded-xl shadow-lg">
                        {isClient && (
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md"
                            />
                        )}
                    </Card>
                </div>
                <TiketinCta />
                <Card className="bg-card/80 border-border/20 rounded-xl shadow-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Music className="h-6 w-6 text-primary" />
                            <CardTitle>UNILIFE Official Playlist</CardTitle>
                        </div>
                        <CardDescription>Get in the mood with our official event playlist on Spotify.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="rounded-xl overflow-hidden bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20 p-1">
                            <iframe 
                                style={{ borderRadius: "12px" }} 
                                src="https://open.spotify.com/embed/playlist/7Gp1oke4hrLetCkoLy696N?utm_source=generator&theme=0"
                                width="100%" 
                                height="352" 
                                frameBorder="0" 
                                allowFullScreen={true}
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                loading="lazy"
                                className="mix-blend-luminosity">
                            </iframe>
                       </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
