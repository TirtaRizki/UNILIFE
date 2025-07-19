"use client";

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function AboutSectionClient() {
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
