
"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import PageHeader from "@/components/page-header";
import type { Recap } from "@/lib/types";
import { RecapForm } from './recap-form';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const dummyRecaps: Recap[] = [
    {
        id: "dummy-recap-1",
        title: "Aftermovie UNILIFE 2024",
        description: "Lihat kembali keseruan dan momen tak terlupakan dari UNILIFE tahun lalu!",
        status: "Published",
        imageUrl: "https://placehold.co/500x500.png"
    },
    {
        id: "dummy-recap-2",
        title: "Keseruan Bazaar & Workshop",
        description: "Intip berbagai kegiatan kreatif di area bazaar dan workshop.",
        status: "Published",
        imageUrl: "https://placehold.co/500x500.png"
    },
    {
        id: "dummy-recap-3",
        title: "Antusiasme Penonton",
        description: "Energi luar biasa dari para Unifriends yang hadir!",
        status: "Published",
        imageUrl: "https://placehold.co/500x500.png"
    },
     {
        id: "dummy-recap-4",
        title: "Behind The Scenes",
        description: "Momen di balik panggung dan persiapan para panitia.",
        status: "Draft",
        imageUrl: "https://placehold.co/500x500.png"
    }
];

const RecapCard = ({ recap, onEdit, onDelete, canManage }: { recap: Recap, onEdit: (recap: Recap) => void, onDelete: (id: string) => void, canManage: boolean }) => {
    const getBadgeVariant = (status: Recap['status']) => {
        switch (status) {
            case 'Published': return 'default';
            case 'Draft': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <Card className="overflow-hidden content-card group flex flex-col">
            <CardHeader className="p-0">
                <div className="relative w-full aspect-video">
                    <Image
                        src={recap.imageUrl || "https://placehold.co/400x225.png"}
                        alt={recap.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="event recap concert"
                    />
                    {canManage && (
                        <div className="absolute top-2 right-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => onEdit(recap)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(recap.id)}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-bold">{recap.title}</CardTitle>
                    <Badge variant={getBadgeVariant(recap.status)}>{recap.status}</Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                    {recap.description}
                </CardDescription>
            </CardContent>
        </Card>
    );
};

export default function RecapGrid() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    const [recaps, setRecaps] = useState<Recap[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedRecap, setSelectedRecap] = useState<Recap | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchRecaps = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/recap`);
            if (!response.ok) throw new Error("Failed to fetch recaps");
            let data = await response.json();
            if (!data || data.length === 0) {
                data = dummyRecaps;
            }
            setRecaps(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch recaps. Displaying dummy data.", variant: "destructive" });
            setRecaps(dummyRecaps);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecaps();
    }, []);

    const handleAdd = () => {
        setSelectedRecap(null);
        setSheetOpen(true);
    };

    const handleEdit = (recap: Recap) => {
        setSelectedRecap(recap);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        if (id.startsWith('dummy-')) {
            toast({ title: "Info", description: "Cannot delete dummy data." });
            return;
        }
        try {
            const response = await fetch(`/api/recap/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete recap");
            }
            toast({ title: "Success", description: "Recap deleted successfully." });
            fetchRecaps();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    };

    const handleSave = async (recapData: Recap) => {
        try {
            const response = await fetch(`/api/recap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recapData.id.startsWith('dummy-') ? { ...recapData, id: '' } : recapData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save recap");
            }
            toast({ title: "Success", description: "Recap saved successfully." });
            setSheetOpen(false);
            setSelectedRecap(null);
            fetchRecaps();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    }
    
    if (isLoading) {
        return <div>Loading recaps...</div>;
    }

    return (
        <>
            <PageHeader title="Recap" actions={
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Recap
                    </Button>
                )
            } />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {recaps.length > 0 ? recaps.map((recap) => (
                    <RecapCard key={recap.id} recap={recap} onEdit={handleEdit} onDelete={handleDelete} canManage={canManage} />
                )) : (
                    <p>No recaps found. {canManage && "Add one to get started!"}</p>
                )}
            </div>
            
            {canManage && (
                <RecapForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    recap={selectedRecap}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
