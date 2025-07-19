
"use client";
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Banner } from "@/lib/types";
import { BannerForm } from './banner-form';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function BannerTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchBanners = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/banners`);
            if (!response.ok) throw new Error("Failed to fetch banners");
            const data = await response.json();
            setBanners(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch banners.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleAdd = () => {
        setSelectedBanner(null);
        setSheetOpen(true);
    };

    const handleEdit = (banner: Banner) => {
        setSelectedBanner(banner);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete banner");
            }
            toast({ title: "Success", description: "Banner deleted successfully." });
            fetchBanners();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    };

    const handleSave = async (bannerData: Banner) => {
        try {
            const response = await fetch(`/api/banners`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bannerData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save banner");
            }
            toast({ title: "Success", description: "Banner saved successfully." });
            setSheetOpen(false);
            setSelectedBanner(null);
            fetchBanners();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    };
    
    const getBadgeVariant = (status: Banner['status']) => {
        switch (status) {
            case 'Active': return 'default';
            case 'Inactive': return 'secondary';
            default: return 'outline';
        }
    };
    
    if (isLoading) {
        return <div>Loading banners...</div>;
    }

    return (
        <>
            <PageHeader title="Banner" actions={
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Banner
                    </Button>
                )
            } />
            <Card className="content-card">
                <CardHeader>
                    <CardTitle>Daftar Banner</CardTitle>
                    <CardDescription>Kelola banner iklan untuk event Anda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    {canManage && (
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {banners.length > 0 ? banners.map((banner) => (
                                    <TableRow key={banner.id}>
                                        <TableCell>
                                            <Image 
                                                src={banner.imageUrl || "https://placehold.co/400x225.png"}
                                                alt={banner.title}
                                                width={400}
                                                height={225}
                                                className="rounded-md object-cover w-full aspect-video"
                                                data-ai-hint="banner advertisement"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{banner.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(banner.status)}>{banner.status}</Badge>
                                        </TableCell>
                                        {canManage && (
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEdit(banner)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(banner.id)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={canManage ? 4 : 3} className="text-center">No banners found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {canManage && (
                <BannerForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    banner={selectedBanner}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
