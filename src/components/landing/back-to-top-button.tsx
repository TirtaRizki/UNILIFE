"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <Button
            onClick={scrollToTop}
            className={cn(
                'fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full p-0 shadow-lg transition-all duration-300',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'
            )}
            aria-label="Go to top"
        >
            <ArrowUp className="h-6 w-6" />
        </Button>
    );
};

export default BackToTopButton;
