
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, Ticket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Line Up', href: '#lineup' },
    { name: 'Recap', href: '#recap' },
];

// The component now accepts logoUrl as a prop
const PublicHeaderClient = ({ logoUrl }: { logoUrl: string }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
      return () => {
        document.body.style.overflow = 'auto';
      }
    }, [mobileMenuOpen]);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);

        if (href === '#dashboard-info') {
            toast({
                title: "Prepare for The War! 🚀",
                description: "You are being scrolled to the ticket countdown section.",
            });
        }
    };

    return (
        <>
            <header className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled || mobileMenuOpen ? "bg-background/80 backdrop-blur-sm shadow-lg" : "bg-transparent"
            )}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        <Link href="#home" onClick={(e) => handleLinkClick(e, '#home')}>
                            <Image src={logoUrl} alt="Unilife Logo" width={120} height={32} className="object-contain" priority />
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-base font-medium text-foreground hover:text-primary transition-colors">
                                    {link.name}
                                </a>
                            ))}
                        </nav>

                        <div className="hidden md:flex items-center gap-2">
                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                                <a href="#dashboard-info" onClick={(e) => handleLinkClick(e, '#dashboard-info')}>
                                    Get Ticket
                                </a>
                            </Button>
                            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary font-bold">
                                <Link href="/login">
                                    Admin Login
                                </Link>
                            </Button>
                        </div>

                        <div className="md:hidden flex items-center gap-2">
                             <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                                <a href="#dashboard-info" onClick={(e) => handleLinkClick(e, '#dashboard-info')}>
                                    <Ticket className="h-4 w-4 mr-2"/>
                                    Get Ticket
                                </a>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
                                <Menu className="h-6 w-6 text-foreground" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden",
                    mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setMobileMenuOpen(false)}
            />
            <div
                className={cn(
                    "fixed top-0 right-0 bottom-0 w-4/5 max-w-sm z-50 transition-transform duration-300 ease-in-out md:hidden",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 to-blue-950/90 text-white backdrop-blur-xl border-l border-white/10">
                    <div className="flex items-center justify-between p-4 border-b border-border/10">
                         <Link href="#home" onClick={(e) => handleLinkClick(e, '#home')}>
                            <Image src={logoUrl} alt="Unilife Logo" width={100} height={28} className="object-contain" />
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                            <X className="h-6 w-6 text-white" />
                        </Button>
                    </div>

                    <nav className="flex-1 flex flex-col justify-center p-8">
                        <ul className="space-y-6 text-center">
                            {navLinks.map((link, index) => (
                                <li
                                    key={link.name}
                                    className="transition-all duration-300"
                                    style={{
                                        transitionDelay: `${index * 75}ms`,
                                        opacity: mobileMenuOpen ? 1 : 0,
                                        transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(15px)',
                                    }}
                                >
                                    <a 
                                        href={link.href} 
                                        onClick={(e) => handleLinkClick(e, link.href)} 
                                        className="text-2xl font-bold text-white hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div 
                      className="p-8 mt-auto border-t border-border/10 space-y-4 transition-all duration-300"
                      style={{
                          transitionDelay: `${navLinks.length * 75}ms`,
                          opacity: mobileMenuOpen ? 1 : 0,
                      }}
                    >
                      <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold w-full">
                          <a href="#dashboard-info" onClick={(e) => handleLinkClick(e, '#dashboard-info')}>
                              Get Ticket
                          </a>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="border-primary text-primary bg-transparent hover:bg-primary/10 hover:text-primary font-bold w-full">
                          <Link href="/login">
                              Admin Login
                          </Link>
                      </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicHeaderClient;
