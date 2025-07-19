
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Edit, Trash2 } from "lucide-react";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { About } from "@/lib/types";
import { AboutForm } from './about-form';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const dummyAboutData: About = {
    id: 'dummy-about',
    title: "UNILIFE LAMPUNG FEST 2025",
    description: "UNILIFE (UNIYOUTH LIFE FESTIVAL) adalah festival 'Back To School' terbesar di Lampung yang diselenggarakan oleh UNIYOUTH. Acara ini merupakan perpaduan antara musik, seni, dan kreativitas anak muda, menciptakan momen tak terlupakan sebelum kembali ke rutinitas sekolah.\n\nNikmati penampilan dari musisi-musisi ternama, jelajahi instalasi seni yang mengagumkan, dan ikut serta dalam berbagai workshop kreatif. UNILIFE adalah wadah bagi generasi muda untuk berekspresi, berkolaborasi, dan merayakan semangat masa muda. Bergabunglah dengan kami dalam perayaan akbar ini!"
};

const AboutDisplay = ({ about, onEdit, onDelete, canManage }: { about: About, onEdit: (about: About) => void, onDelete: (id: string) => void, canManage: boolean }) => {
    return (
        <Card className="content-card overflow-hidden">
            <div className="grid md:grid-cols-2">
                <div className="p-6 md:p-8 flex flex-col justify-center">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-3xl font-headline font-bold text-primary">{about.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-muted-foreground whitespace-pre-wrap">{about.description}</p>
                    </CardContent>
                    {canManage && (
                        <CardFooter className="p-0 pt-6 flex gap-2">
                            <Button onClick={() => onEdit(about)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                            <Button variant="destructive" onClick={() => onDelete(about.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                        </CardFooter>
                    )}
                </div>
                <div className="bg-muted/50 flex items-center justify-center p-8 md:p-12">
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="About Us Illustration"
                        width={600}
                        height={400}
                        className="rounded-lg object-cover"
                        data-ai-hint="team collaboration abstract"
                    />
                </div>
            </div>
        </Card>
    )
}

const EmptyState = ({ onAdd, canManage }: { onAdd: () => void, canManage: boolean }) => {
    return (
        <Card className="content-card flex items-center justify-center p-12">
            <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">Konten 'About' Kosong</h3>
                <p className="mt-1 text-sm text-muted-foreground">Anda belum menambahkan konten untuk halaman 'About'.</p>
                {canManage && (
                    <div className="mt-6">
                        <Button onClick={onAdd}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Konten
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default function AboutContent() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    const [abouts, setAbouts] = useState<About[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedAbout, setSelectedAbout] = useState<About | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchAbouts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/about`);
            if (!response.ok) throw new Error("Failed to fetch about content");
            let data = await response.json();
            
            if (!data || data.length === 0) {
                // If database is empty, use dummy data
                data = [dummyAboutData];
            }
            setAbouts(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch about content. Displaying dummy data.", variant: "destructive" });
            // On error, use dummy data
            setAbouts([dummyAboutData]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAbouts();
    }, []);

    const handleAdd = () => {
        setSelectedAbout(null);
        setSheetOpen(true);
    };

    const handleEdit = (about: About) => {
        setSelectedAbout(about);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        if (id === 'dummy-about') {
            toast({ title: "Info", description: "Cannot delete dummy data." });
            return;
        }
        try {
            const response = await fetch(`/api/about/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete about content");
            }
            toast({ title: "Success", description: "About content deleted successfully." });
            fetchAbouts();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    };

    const handleSave = async (aboutData: About) => {
        try {
            const response = await fetch(`/api/about`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aboutData.id === 'dummy-about' ? { ...aboutData, id: '' } : aboutData),
            });
             if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save about content");
            }
            toast({ title: "Success", description: "About content saved successfully." });
            setSheetOpen(false);
            setSelectedAbout(null);
            fetchAbouts();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    }
    
    if (isLoading) {
        return <div>Loading about content...</div>;
    }

    // We'll display the first "About" content found.
    const mainAboutContent = abouts.length > 0 ? abouts[0] : null;

    return (
        <>
            <PageHeader title="About" actions={
                // Hide add button if content already exists, only one 'About' is needed.
                canManage && !mainAboutContent && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Konten About
                    </Button>
                )
            } />

            {mainAboutContent ? (
                <AboutDisplay about={mainAboutContent} onEdit={handleEdit} onDelete={handleDelete} canManage={canManage} />
            ) : (
                <EmptyState onAdd={handleAdd} canManage={canManage} />
            )}
            
            {canManage && (
                <AboutForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    about={selectedAbout}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
