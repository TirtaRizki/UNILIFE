// src/app/(app)/about/about-client-wrapper.tsx
"use client"; // Menandakan ini adalah Client Component

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Edit, Trash2 } from "lucide-react";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { About } from "@/lib/types";
import { AboutForm } from './about-form'; // Mengimpor komponen formulir About
import { useAuth } from '@/hooks/use-auth'; // Mengimpor hook autentikasi
import { useToast } from '@/hooks/use-toast'; // Mengimpor hook toast notifikasi

// Komponen presentasional untuk menampilkan konten About
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
                    {canManage && ( // Tampilkan tombol edit/hapus jika pengguna memiliki izin
                        <CardFooter className="p-0 pt-6 flex gap-2">
                            <Button onClick={() => onEdit(about)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                            <Button variant="destructive" onClick={() => onDelete(about.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                        </CardFooter>
                    )}
                </div>
                <div className="bg-muted/50 flex items-center justify-center p-8 md:p-12">
                    <Image
                        src="https://placehold.co/600x400.png" // Placeholder gambar
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

// Komponen presentasional untuk tampilan saat konten About kosong
const EmptyState = ({ onAdd, canManage }: { onAdd: () => void, canManage: boolean }) => {
    return (
        <Card className="content-card flex items-center justify-center p-12">
            <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">Konten 'About' Kosong</h3>
                <p className="mt-1 text-sm text-muted-foreground">Anda belum menambahkan konten untuk halaman 'About'.</p>
                {canManage && ( // Tampilkan tombol tambah jika pengguna memiliki izin
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

// Komponen utama yang membungkus logika sisi klien untuk halaman About
export function AboutClientWrapper({ initialAbouts }: { initialAbouts: About[] }) {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']); // Periksa peran pengguna untuk manajemen
    const [abouts, setAbouts] = useState<About[]>(initialAbouts); // Inisialisasi state dengan data yang diambil dari server
    const [sheetOpen, setSheetOpen] = useState(false); // State untuk mengontrol tampilan formulir
    const [selectedAbout, setSelectedAbout] = useState<About | null>(null); // State untuk data About yang dipilih saat edit
    const [isLoading, setIsLoading] = useState(false); // State loading untuk operasi mutasi (add/edit/delete)
    const { toast } = useToast(); // Hook untuk menampilkan notifikasi

    // Efek untuk memperbarui state 'abouts' jika 'initialAbouts' berubah dari server.
    // Ini penting jika server melakukan re-render dan mengirimkan data baru.
    useEffect(() => {
        setAbouts(initialAbouts);
    }, [initialAbouts]);

    // Fungsi untuk mengambil ulang data About dari API
    const fetchAbouts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/about`);
            if (!response.ok) throw new Error("Failed to fetch about content");
            const data = await response.json();
            setAbouts(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch about content.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    // Handler untuk menambah konten About baru
    const handleAdd = () => {
        setSelectedAbout(null); // Reset data yang dipilih
        setSheetOpen(true); // Buka formulir
    };

    // Handler untuk mengedit konten About yang sudah ada
    const handleEdit = (about: About) => {
        setSelectedAbout(about); // Set data About yang akan diedit
        setSheetOpen(true); // Buka formulir
    };

    // Handler untuk menghapus konten About
    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/about/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete about content");
            }
            toast({ title: "Success", description: "About content deleted successfully." });
            fetchAbouts(); // Ambil ulang data setelah penghapusan berhasil
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    };

    // Handler untuk menyimpan (menambah atau memperbarui) konten About
    const handleSave = async (aboutData: About) => {
        try {
            const response = await fetch(`/api/about`, {
                method: 'POST', // Gunakan POST untuk menambah, API route Anda mungkin juga mendukung PUT untuk update
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aboutData),
            });
             if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save about content");
            }
            toast({ title: "Success", description: "About content saved successfully." });
            setSheetOpen(false); // Tutup formulir
            setSelectedAbout(null); // Reset data yang dipilih
            fetchAbouts(); // Ambil ulang data setelah penyimpanan berhasil
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    }

    // Tampilkan konten About yang pertama ditemukan (asumsi hanya ada satu konten About utama)
    const mainAboutContent = abouts.length > 0 ? abouts[0] : null;

    return (
        <>
            {/* Header halaman dengan tombol "Tambah Konten About" jika diizinkan dan belum ada konten */}
            <PageHeader title="About" actions={
                canManage && !mainAboutContent && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Konten About
                    </Button>
                )
            } />

            {/* Tampilkan AboutDisplay jika ada konten, jika tidak tampilkan EmptyState */}
            {mainAboutContent ? (
                <AboutDisplay about={mainAboutContent} onEdit={handleEdit} onDelete={handleDelete} canManage={canManage} />
            ) : (
                <EmptyState onAdd={handleAdd} canManage={canManage} />
            )}

            {/* Tampilkan formulir AboutForm jika diizinkan mengelola */}
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
