"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { Banner } from "@/lib/types";
import { Skeleton } from '../ui/skeleton';

const BannerSection = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('/api/banners');
                if (!response.ok) {
                    throw new Error('Failed to fetch banners');
                }
                const data: Banner[] = await response.json();
                const activeBanners = data.filter(banner => banner.status === "Active");
                setBanners(activeBanners);
            } catch (error) {
                console.error("Error fetching banners for landing page:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, []);

    if (isLoading) {
        return (
            <section id="banners" className="container mx-auto px-4 py-12">
                 <Carousel>
                    <CarouselContent>
                        {[...Array(3)].map((_, i) => (
                             <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                                 <div className="p-1">
                                    <Skeleton className="aspect-video w-full rounded-lg" />
                                 </div>
                             </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </section>
        );
    }

    if (banners.length === 0) {
        return null; // Don't render the section if there are no active banners
    }

    return (
        <section id="banners" className="container mx-auto px-4 py-12 animate-fade-up">
            <Carousel opts={{ loop: true, align: "start" }}>
                <CarouselContent>
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <div className="relative aspect-video overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                    <Image
                                        src={banner.imageUrl || "https://placehold.co/1600x900.png"}
                                        alt={banner.title}
                                        fill
                                        className="object-cover"
                                        data-ai-hint="advertisement banner"
                                    />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
};

export default BannerSection;
