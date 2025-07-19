
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';
import type { Event } from '@/lib/types';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const dummyEvents: Event[] = [
    {
        id: "dummy-event-1",
        name: "Presale 2 ( Day 1 ) - MOS",
        description: "Hari pertama festival dengan penampilan spektakuler dari deretan artis nasional. Rasakan euforia musik dan semangat kebersamaan di panggung utama UNILIFE dengan Fasilitas Music Festival, Experience Booths, F&B, etc.",
        date: "2025-08-30",
        location: "PKOR Way Halim, Bandar Lampung",
        status: "Upcoming",
        imageUrl: "/images/event3.jpg"
    },
    {
        id: "dummy-event-2",
        name: "Presale 2 ( Day 2 ) - GRADUATION",
        description: "Puncak acara UNILIFE! Jangan lewatkan penampilan pamungkas dari guest star utama dan nikmati malam penutupan yang meriah dengan Fasilitas Music Festival, Experience Booths, F&B, etc.",
        date: "2025-08-31",
        location: "PKOR Way Halim, Bandar Lampung",
        status: "Upcoming",
        imageUrl: "/images/event1.jpg"
    },
    {
        id: "dummy-event-3",
        name: "Presale 2 ( 2 Day Pass )",
        description: "Ikuti workshop seni dan kreativitas bersama para ahli. Buat karyamu sendiri dan bawa pulang sebagai kenang-kenangan dengan Fasilitas Music Festival, Experience Booths, F&B, etc.",
        date: "2025-08-30",
        location: "Creative Corner, PKOR",
        status: "Upcoming",
        imageUrl: "/images/event2.jpg"
    }
];

const EventCard = ({ event, index }: { event: Event, index: number }) => {
    const { toast } = useToast();

    const handleViewDetailsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetElement = document.querySelector('#dashboard-info');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        toast({
            title: "Siap-siap War Tiket! 🔥",
            description: "Anda sedang diarahkan ke bagian hitung mundur tiket.",
        });
    };

    return (
        <Card 
            className="bg-card/80 border-border/20 rounded-xl overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full animate-fade-up"
            style={{animationDelay: `${index * 0.15}s`}}
        >
            <CardHeader className="p-0">
                <div className="relative w-full aspect-[4/3]">
                    <Image
                        src={event.imageUrl || "https://placehold.co/400x300.png"}
                        alt={event.name}
                        fill
                        className="object-cover"
                        data-ai-hint="event concert festival"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
                <h3 className="text-xl font-bold font-headline mb-2 text-foreground">{event.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{event.description}</p>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex flex-col items-start gap-4">
                <div className="flex flex-col gap-2 w-full text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{format(new Date(event.date), "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.location}</span>
                    </div>
                </div>
                <Button asChild size="sm" className="w-full bg-primary/10 text-primary hover:bg-primary/20 font-semibold">
                    <a href="#dashboard-info" onClick={handleViewDetailsClick}>
                        View Details
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
};

const EventCardSkeleton = () => (
    <Card className="flex flex-col h-full">
        <CardHeader className="p-0">
            <Skeleton className="w-full aspect-[4/3]" />
        </CardHeader>
        <CardContent className="p-6 flex-grow">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-4" />
        </CardContent>
        <CardFooter className="p-6 pt-0 flex flex-col items-start gap-4">
            <div className="w-full space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-9 w-full" />
        </CardFooter>
    </Card>
);

const EventSection = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                let data: Event[] = await response.json();
                let upcomingEvents = data.filter(event => event.status === "Upcoming");
                
                if (upcomingEvents.length === 0) {
                    upcomingEvents = dummyEvents.filter(event => event.status === "Upcoming");
                }
                setEvents(upcomingEvents);
            } catch (error) {
                console.error("Error fetching events for landing page:", error);
                setEvents(dummyEvents.filter(event => event.status === "Upcoming"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (isLoading) {
         return (
            <section id="events" className="py-20 md:py-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Upcoming Events</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, index) => (
                           <EventCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }
    
    if (events.length === 0) {
        return null;
    }

    return (
        <section id="events" className="py-20 md:py-32 overflow-hidden animate-fade-up">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Upcoming Events</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, index) => (
                        <EventCard key={event.id} event={event} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventSection;
