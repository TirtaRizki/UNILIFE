
"use client";
import '@/lib/firebase'; // Import for side-effects to ensure initialization
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from "next-themes";
import { Moon, Sun } from 'lucide-react';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE_MB = 8.0;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function SettingsPage() {
    const { hasRole } = useAuth();
    const isAdmin = hasRole(['Admin']);
    const { toast } = useToast();
    const [logoUrl, setLogoUrl] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { theme, setTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const fetchLogo = async () => {
             try {
                const response = await fetch('/api/branding');
                if (response.ok) {
                    const settings = await response.json();
                    if (settings?.logoUrl) {
                        setLogoUrl(settings.logoUrl);
                        setLogoPreview(settings.logoUrl);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch branding settings for settings page", error);
            }
        };
        fetchLogo();
    }, []);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE_BYTES) {
                toast({
                    title: "File Terlalu Besar",
                    description: `Ukuran file maksimal adalah ${MAX_FILE_SIZE_MB} MB.`,
                    variant: "destructive"
                });
                e.target.value = ''; // Reset input
                return;
            }
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                setLogoPreview(dataUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setLogoUrl(url);
        setLogoPreview(url);
        setLogoFile(null); // Clear file if URL is being used
    };

    const handleSaveLogo = async () => {
        setIsSaving(true);
        try {
            let finalLogoUrl = logoUrl;

            // Jika ada file yang dipilih, unggah ke Firebase Storage
            if (logoFile) {
                const storage = getStorage();
                const uniqueFilename = `${uuidv4()}-${logoFile.name}`;
                const fileRef = storageRef(storage, `logos/${uniqueFilename}`);
                
                const uploadResult = await uploadBytes(fileRef, logoFile);
                finalLogoUrl = await getDownloadURL(uploadResult.ref);
            }

            if (!finalLogoUrl) {
                toast({ title: "Error", description: "Logo URL atau file tidak boleh kosong.", variant: "destructive" });
                setIsSaving(false);
                return;
            }

            // Simpan URL final (baik dari URL input atau hasil unggahan) ke database
            const response = await fetch('/api/branding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logoUrl: finalLogoUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('🚨 Branding save error:', errorData);
                throw new Error(errorData.message || 'Gagal menyimpan logo ke database');
            }
            
            // This event tells other components (like the sidebar) to refetch the logo
            window.dispatchEvent(new Event('storage'));

            toast({
                title: "Logo Diperbarui",
                description: "Logo aplikasi telah berhasil diganti.",
            });
            setLogoUrl(finalLogoUrl); // Update state to reflect saved URL
            setLogoFile(null); // Clear file selection

        } catch (error) {
             toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Gagal menyimpan logo.",
                variant: "destructive"
            });
            console.error("🚨 Full error object in handleSaveLogo:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isMounted) {
        return null;
    }


    return (
        <>
            <PageHeader title="Settings" />
            <div className="grid gap-6">
                {isAdmin && (
                    <Card className="content-card">
                        <CardHeader>
                            <CardTitle>Branding</CardTitle>
                            <CardDescription>Sesuaikan logo aplikasi Anda.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label>Pratinjau Logo</Label>
                                <div className="mt-2 flex h-20 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-4">
                                    {logoPreview ? (
                                        <Image src={logoPreview} alt="Logo Preview" height={60} width={200} className="object-contain" />
                                    ) : (
                                        <p className="text-muted-foreground">Tidak ada logo</p>
                                    )}
                                </div>
                            </div>
                            <Tabs defaultValue="url" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="url">URL</TabsTrigger>
                                    <TabsTrigger value="upload">Upload</TabsTrigger>
                                </TabsList>
                                <TabsContent value="url">
                                    <Label htmlFor="logoUrl">URL Logo</Label>
                                    <Input 
                                        id="logoUrl"
                                        placeholder="https://example.com/logo.png" 
                                        value={logoUrl}
                                        onChange={handleUrlChange}
                                    />
                                </TabsContent>
                                <TabsContent value="upload">
                                    <Label htmlFor="logoUpload">Upload File (Max {MAX_FILE_SIZE_MB}MB)</Label>
                                    <Input
                                        id="logoUpload"
                                        type="file"
                                        accept="image/png, image/jpeg, image/gif, image/svg+xml"
                                        onChange={handleFileChange}
                                        className="w-full text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary/10 file:text-primary
                                            hover:file:bg-primary/20"
                                    />
                                </TabsContent>
                            </Tabs>
                            <div className="flex justify-end">
                                <Button onClick={handleSaveLogo} disabled={isSaving}>{isSaving ? 'Menyimpan...' : 'Simpan Logo'}</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="content-card">
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Sesuaikan tampilan aplikasi.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Aktifkan untuk beralih ke tema gelap.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sun className="h-5 w-5" />
                                <Switch
                                    id="dark-mode"
                                    checked={theme === 'dark'}
                                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                />
                                <Moon className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="content-card">
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>Manage general application settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="appName">Application Name</Label>
                            <Input id="appName" defaultValue="UNILIFE Dashboard" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="appUrl">Application URL</Label>
                            <Input id="appUrl" defaultValue="https://unilife.com" />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="maintenance-mode" className="text-base">Maintenance Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Temporarily disable access to the public site.
                                </p>
                            </div>
                            <Switch id="maintenance-mode" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="content-card">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage how you receive notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive an email for important updates.
                                </p>
                            </div>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive push notifications on your devices.
                                </p>
                            </div>
                            <Switch id="push-notifications" />
                        </div>
                    </CardContent>
                </Card>

                 <div className="flex justify-end">
                    <Button>Save All Settings</Button>
                </div>
            </div>
        </>
    );
}
