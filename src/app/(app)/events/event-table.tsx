
"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Calendar, MapPin } from "lucide-react";
import PageHeader from "@/components/page-header";
import type { Event } from "@/lib/types";
import { EventForm } from './event-form';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Link from 'next/link';

const dummyEvents: Event[] = [
    {
        id: "dummy-event-1",
        name: "UNILIFE Main Concert Day 1",
        description: "Hari pertama festival dengan penampilan spektakuler dari deretan artis nasional. Rasakan euforia musik dan semangat kebersamaan di panggung utama UNILIFE.",
        date: "2025-08-30",
        location: "PKOR Way Halim, Bandar Lampung",
        status: "Upcoming",
        imageUrl: "https://placehold.co/400x300.png"
    },
    {
        id: "dummy-event-2",
        name: "UNILIFE Main Concert Day 2",
        description: "Puncak acara UNILIFE! Jangan lewatkan penampilan pamungkas dari guest star utama dan nikmati malam penutupan yang meriah dengan pesta kembang api.",
        date: "2025-08-31",
        location: "PKOR Way Halim, Bandar Lampung",
        status: "Upcoming",
        imageUrl: "https://placehold.co/400x300.png"
    }
];

const EventCard = ({ event, onEdit, onDelete, canManage }: { event: Event, onEdit: (event: Event) => void, onDelete: (id: string) => void, canManage: boolean }) => {
    const content = (
        <Card className="overflow-hidden content-card group flex flex-col h-full">
            <CardHeader className="p-0">
                <div className="relative w-full aspect-[4/3]">
                    <Image
                        src={event.imageUrl || "https://placehold.co/400x300.png"}
                        alt={event.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="event concert festival"
                    />
                    {canManage && (
                        <div className="absolute top-2 right-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={(e) => {e.preventDefault(); e.stopPropagation(); onEdit(event)}}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => {e.preventDefault(); e.stopPropagation(); onDelete(event.id)}}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-bold mb-2">{event.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                    {event.description}
                </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-sm text-muted-foreground bg-white/50 border-t border-black/5">
                <div className="flex flex-col gap-2 w-full">
                     <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.date), "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );

    return (
         <Link href="https://mytiketin.com/event/79" target="_blank" rel="noopener noreferrer" className="block h-full">
            {content}
        </Link>
    );
};

export default function EventGrid() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    const [events, setEvents] = useState<Event[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/events`);
            if (!response.ok) throw new Error("Failed to fetch events");
            let data = await response.json();
            if (!data || data.length === 0) {
                data = dummyEvents;
            }
            setEvents(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch events. Displaying dummy data.", variant: "destructive" });
            setEvents(dummyEvents);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleAdd = () => {
        setSelectedEvent(null);
        setSheetOpen(true);
    };

    const handleEdit = (event: Event) => {
        setSelectedEvent(event);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        if (id.startsWith('dummy-')) {
            toast({ title: "Info", description: "Cannot delete dummy data." });
            return;
        }
        try {
            const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete event");
            }
            toast({ title: "Success", description: "Event deleted successfully." });
            fetchEvents();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    };

    const handleSave = async (eventData: Event) => {
        try {
            const response = await fetch(`/api/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData.id.startsWith('dummy-') ? { ...eventData, id: '' } : eventData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save event");
            }
            toast({ title: "Success", description: "Event saved successfully." });
            setSheetOpen(false);
            setSelectedEvent(null);
            fetchEvents();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    };
    
    if (isLoading) {
        return <div>Loading events...</div>
    }

    return (
        <>
            <PageHeader title="Event" actions={
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Event
                    </Button>
                )
            } />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.length > 0 ? events.map((event) => (
                    <EventCard 
                        key={event.id}
                        event={event} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                        canManage={canManage} 
                    />
                )) : (
                    <p>No events found. {canManage && "Add one to get started!"}</p>
                )}
            </div>
            
            {canManage && (
                <EventForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    event={selectedEvent}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
