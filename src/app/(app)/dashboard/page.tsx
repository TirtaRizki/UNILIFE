
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserCheck, Calendar as CalendarIcon, Mic, Music, Sparkles, Ticket } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { User, Event } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Countdown from '@/components/countdown';


const StatCard = ({ title, value, icon: Icon, isLoading }: { title: string, value: string, icon: React.ElementType, isLoading: boolean }) => (
    <Card className="content-card p-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-2 pt-0">
            {isLoading ? <div className="h-8 w-1/2 bg-muted rounded animate-pulse" /> : <div className="text-2xl font-bold text-foreground">{value}</div>}
        </CardContent>
    </Card>
);

const TiketinCta = () => (
    <Link href="https://mytiketin.com/" target="_blank" rel="noopener noreferrer" className="block group">
        <div className="relative rounded-xl overflow-hidden p-8 md:p-12 text-center text-white bg-gradient-to-r from-[#0a205a] via-[#0a4d9e] to-[#0a4d9e] transition-transform duration-300 group-hover:scale-[1.02]">
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4">
                    Tinggal Klik, Tiketin Aja!
                </h2>
                <p className="max-w-xl mx-auto mb-6 text-white/80">
                    Sekarang beli tiket hanya semudah klik, cari informasi tentang event kamu disini biar gak ketinggalan!
                </p>
                <Button 
                    size="lg"
                    className="bg-white/90 text-primary hover:bg-white font-semibold transition-all"
                >
                    Cari Event Sekarang
                </Button>
            </div>
        </div>
    </Link>
);


export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [stats, setStats] = useState({
      committeesCount: 0,
      usersCount: 0,
      activeEventsCount: 0,
      lineupsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
   const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set date only on the client-side to avoid hydration mismatch
    setIsClient(true);
  }, []);

   useEffect(() => {
    if (isClient) {
        setDate(new Date());
    }
  }, [isClient]);

  useEffect(() => {
    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/stats');
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard stats');
            }
            const data = await response.json();
            setStats(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not load dashboard data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchDashboardData();
  }, [toast]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Panitia" value={String(stats.committeesCount)} icon={Users} isLoading={isLoading} />
        <StatCard title="Peserta Terdaftar" value={String(stats.usersCount)} icon={UserCheck} isLoading={isLoading} />
        <StatCard title="Event Aktif" value={String(stats.activeEventsCount)} icon={CalendarIcon} isLoading={isLoading} />
        <StatCard title="Lineup Artis" value={String(stats.lineupsCount)} icon={Mic} isLoading={isLoading} />
      </div>
      <div className="grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-5">
        <Card className="lg:col-span-3 content-card p-4 md:p-6 flex flex-col gap-8 items-center justify-center">
          <Countdown targetDate="2025-08-30T00:00:00" title="Start The Event" />
          <div className="relative w-full max-w-sm flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-border"></div>
            <div className="relative flex items-center gap-4 bg-background px-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <Ticket className="h-5 w-5 text-primary" />
                <Music className="h-5 w-5 text-primary" />
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
        <Card className="lg:col-span-2 content-card flex justify-center items-center p-2">
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
      <Card className="content-card">
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
    </>
  );
}
