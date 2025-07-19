
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { About } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const dummyAboutData: About = {
    id: 'dummy-about',
    title: "UNILIFE LAMPUNG FEST 2025",
    description: "UNILIFE (UNIYOUTH LIFE FESTIVAL) adalah festival 'Back To School' terbesar di Lampung yang diselenggarakan oleh UNIYOUTH. UniLife adalah sebuah inisiatif kreatif yang lahir dari semangat anak muda untuk menciptakan ruang berkumpul yang seru, positif, dan penuh inspirasi.Dirancang oleh dan untuk remaja, UniLife menghadirkan event musik yang menggabungkan semangat kekinian, tren throwback, eksplorasi fashion, dan dunia konten digital.Kami ingin membangun komunitas kreatif yang tidak hanya menikmati musik, tetapi juga mengekspresikan diri dan membentuk koneksi yang bermakna!"
};

const AboutSectionClient = () => {
  const { toast } = useToast();

  const handleGetTicketClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.querySelector('#dashboard-info');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    toast({
      title: "Prepare for The War! 🚀",
      description: "You are being scrolled to the ticket countdown section.",
    });
  };

  return (
    <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
        <a href="#dashboard-info" onClick={handleGetTicketClick}>
            Get Your Ticket
        </a>
    </Button>
  );
}

const AboutSection = () => {
    const [about, setAbout] = useState<About | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await fetch('/api/about');
                if (!response.ok) {
                    throw new Error('Failed to fetch about data');
                }
                const data = await response.json();
                // API returns an array, we take the first element
                if (data && data.length > 0) {
                    setAbout(data[0]);
                } else {
                    setAbout(dummyAboutData);
                }
            } catch (error) {
                console.error("Error fetching about section data:", error);
                setAbout(dummyAboutData);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAbout();
    }, []);

    if (isLoading) {
        return (
            <section id="about" className="py-20 md:py-32 bg-background/5 backdrop-blur-sm overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <Skeleton className="h-12 w-3/4 mb-6" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-6 w-4/5 mb-8" />
                            <Skeleton className="h-12 w-40" />
                        </div>
                        <div className="flex justify-center">
                            <Skeleton className="w-[500px] h-[500px] rounded-xl" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    
    if (!about) {
        return null; // Don't render the section if there's no data
    }

    return (
        <section id="about" className="py-20 md:py-32 bg-background/5 backdrop-blur-sm overflow-hidden animate-fade-up">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-primary">{about.title}</h2>
                        <p className="text-muted-foreground text-lg mb-8 whitespace-pre-wrap">{about.description}</p>
                        <AboutSectionClient />
                    </div>
                    <div className="flex justify-center">
                         <Image
                            src="/images/about.png"
                            alt="About Unilife Fest"
                            width={500}
                            height={500}
                            className="rounded-xl shadow-2xl shadow-primary/20 object-cover"
                            data-ai-hint="music festival crowd"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
