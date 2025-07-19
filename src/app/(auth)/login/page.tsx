
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

const Logo = () => {
    return <Image src="/images/unilife_logo.png" alt="Unilife Logo" width={140} height={40} className="object-contain" priority />;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch(`/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }
        
        const foundUser = data.user;

        sessionStorage.setItem('loggedInUser', JSON.stringify(foundUser));
        window.dispatchEvent(new Event('storage')); // Notify auth hook

        toast({
            title: "Login Successful",
            description: `Welcome back, ${foundUser.name}!`,
        });
        router.push("/dashboard");

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
        });
    }
  };

  return (
    <div className="auth-layout px-4">
      <Card className="w-full max-w-md rounded-2xl border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-lg sm:p-8">
        <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-4 h-10">
                <Logo />
            </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">Admin & Panitia Login</CardTitle>
          <CardDescription className="text-center text-muted-foreground">CMS Access for UNILIFE LAMPUNG FEST 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@unilifefest.com"
                required
                className="bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <Button type="submit" className="w-full text-base font-semibold mt-2">
                Login
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <Link href="/" className="underline text-muted-foreground hover:text-primary">
              Back to Landing Page
            </Link>
          </div>
        </CardContent>
        <CardFooter className="pt-6">
            <p className="w-full text-center text-xs text-muted-foreground">Powered by UNIYOUTH © 2025</p>
        </CardFooter>
      </Card>
    </div>
  );
}
