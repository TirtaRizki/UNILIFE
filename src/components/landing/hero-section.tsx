"use client";
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FaInstagram } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const HeroSection = () => {
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

  const slides = [
    { src: '/images/ciki_cinta.png', alt: 'Introducing Ciki & Cinta', hint: 'cartoon characters festival' },
    { src: '/images/unilife_bg.png', alt: 'Unilife Festival', hint: 'concert crowd illustration' }
  ];

  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        <Carousel 
          className="absolute inset-0 w-full h-full"
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
            }),
          ]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-screen">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover bg-center animate-hero-bg-zoom"
                    data-ai-hint={slide.hint}
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        
        <div className="relative z-10 px-4 flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground font-headline uppercase tracking-wider mb-4 animate-fade-up" style={{animationDelay: '0.2s'}}>
                UNILIFE LAMPUNG FEST 2025
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-8 font-headline animate-fade-up" style={{animationDelay: '0.4s'}}>
                Back To School
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 mb-4 animate-fade-up" style={{animationDelay: '0.6s'}}>30-31 Agustus 2025</p>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-up" style={{animationDelay: '0.8s'}}>PKOR, Bandar Lampung</p>
            <Button size="lg" className="h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-105 animate-fade-up" style={{animationDelay: '1s'}} asChild>
                <a href="#dashboard-info" onClick={handleGetTicketClick}>
                    Get Ticket
                </a>
            </Button>
            <div className="flex space-x-6 mt-12 animate-fade-up" style={{animationDelay: '1.2s'}}>
                <a href="https://www.instagram.com/unilife.festival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><FaInstagram size={24} /></a>
            </div>
        </div>
    </section>
  );
};

export default HeroSection;
