
"use client"

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const profileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nama harus memiliki setidaknya 3 karakter"),
  email: z.string().email("Alamat email tidak valid"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password harus memiliki setidaknya 8 karakter").optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});


export function ProfileForm() {
    const { user: authUser, setUser } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            id: authUser?.id || "",
            name: authUser?.name || "",
            email: authUser?.email || "",
            phoneNumber: authUser?.phoneNumber || "",
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (authUser) {
            form.reset({
                id: authUser.id,
                name: authUser.name,
                email: authUser.email,
                phoneNumber: authUser.phoneNumber || "",
                password: "",
                confirmPassword: "",
            });
        }
    }, [authUser, form]);
    
    const onSubmit = async (values: z.infer<typeof profileSchema>) => {
        if (!authUser) return;
        setIsSaving(true);
        
        try {
            const userToUpdate: Partial<User> & { id: string } = {
                id: authUser.id,
                name: values.name,
                email: values.email,
                phoneNumber: values.phoneNumber,
            };

            if (values.password) {
                userToUpdate.password = values.password;
            }

            const response = await fetch(`/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userToUpdate),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal memperbarui profil');
            }
            
            // Update user in auth context and session storage
            const updatedUserForAuth = result.user as Omit<User, 'password'>;
            setUser(updatedUserForAuth);
            sessionStorage.setItem('loggedInUser', JSON.stringify(updatedUserForAuth));
            window.dispatchEvent(new Event('storage'));

            toast({
                title: "Profil Diperbarui",
                description: "Informasi profil Anda telah berhasil disimpan.",
            });
            form.reset({ ...form.getValues(), password: '', confirmPassword: '' });

        } catch (error) {
            const err = error as Error;
            toast({
                title: "Error",
                description: err.message,
                variant: 'destructive'
            });
        } finally {
            setIsSaving(false);
        }
    };

    if(!authUser) return <div>Memuat profil...</div>

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-4 border-white/50 shadow-md">
                        <AvatarImage src="https://placehold.co/80x80.png" alt={authUser.name} data-ai-hint="person user"/>
                        <AvatarFallback>{authUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold">{authUser.name}</h3>
                        <p className="text-muted-foreground">{authUser.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Lengkap</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama lengkap Anda" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alamat Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="email@anda.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nomor Telepon</FormLabel>
                                <FormControl>
                                    <Input placeholder="081234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div></div>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password Baru</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Biarkan kosong untuk tidak mengubah" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Konfirmasi Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Konfirmasi password baru Anda" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                </div>
            </form>
        </Form>
    );
}
