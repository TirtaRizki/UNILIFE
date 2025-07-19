
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Recap } from "@/lib/types";
import { Skeleton } from '../ui/skeleton';

const dummyRecaps: Recap[] = [
    {
        id: "dummy-recap-1",
        title: "SPILL LAGU FAVORIT KAMU DARI BANDA NEIRA",
        description: "Haloo, Peeps!👋🏻Siapa nih yang suka dengerin karyanya @_berjalanlebihjauhNih, mimin kasih kesempatan untuk kalian spill lagu favorit kalian dari Banda Neira Tulis di kolom komentar, siapatau lagu favorit kamu nanti dibawain Banda Neira di #unilifefestival 🤩See you on #unilifefestival Peeps!🥰",
        status: "Published",
        imageUrl: "/images/section1.png"
    },
    {
        id: "dummy-recap-2",
        title: "Dresscode UNILIFE FEST 2025",
        description: "Ini dia penjelasan sedikit buat kalian tentang dresscode di day 1 dan day 2 Kalian ga harus pakai baju seragam sekolah tapi boleh kok pakai yang bernuansa sekolah aja, dan di hari kedua pakai baju bebas dan hanya memakai beberapa atribut saja🥳 Seru banget deh, jangan sampai kalian ketinggalan yaa.",
        status: "Published",
        imageUrl: "/images/section2.png"
    },
    {
        id: "dummy-recap-3",
        title: "Tiket Offline UNILIFE FEST 2025",
        description: "Siapa nih yang nanyain terus tentang tiket offline?🫣Nih, kita wujudin permintaan kalian untuk bisa beli tiket secara offline sambal dengerin perform dari band anak sekolah🤭Jadi, jangan lupa datengin outlet tempat kita open booth dan beli tiket kamu🥳",
        status: "Published",
        imageUrl: "/images/section3.png"
    },
     {
        id: "dummy-recap-4",
        title: "Guest Star UNILIFE FEST 2025",
        description: "It’s not the full line up yet, Peeps!🤭UniLife Festival promised everyone to have unforgettable night to remember🎉 So, this is not the last guest star we’ll announce😚Stay tune and don’t miss any surprises from us!🥳alik panggung dan persiapan para panitia.",
        status: "Published",
        imageUrl: "/images/section4.png"
    }
];

const RecapCard = ({ recap, index }: { recap: Recap, index: number }) => (
    <div 
        className="group relative aspect-square overflow-hidden rounded-lg shadow-lg animate-fade-up"
        style={{animationDelay: `${index * 0.15}s`}}
    >
        <Image
            src={recap.imageUrl || "https://placehold.co/500x500.png"}
            alt={recap.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            data-ai-hint="concert aftermovie photo"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 md:p-6">
            <h3 className="text-lg font-bold text-white">{recap.title}</h3>
            {recap.description && <p className="text-sm text-white/80 mt-1 line-clamp-2">{recap.description}</p>}
        </div>
    </div>
);

const RecapCardSkeleton = () => (
    <div className="relative aspect-square overflow-hidden rounded-lg">
        <Skeleton className="w-full h-full" />
    </div>
);

const RecapSection = () => {
    const [recaps, setRecaps] = useState<Recap[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecaps = async () => {
            try {
                const response = await fetch('/api/recap');
                if (!response.ok) {
                    throw new Error('Failed to fetch recaps');
                }
                let data: Recap[] = await response.json();
                let publishedRecaps = data.filter(recap => recap.status === "Published");
                
                if (publishedRecaps.length === 0) {
                    publishedRecaps = dummyRecaps.filter(recap => recap.status === "Published");
                }
                setRecaps(publishedRecaps);
            } catch (error) {
                console.error("Error fetching recaps for landing page:", error);
                setRecaps(dummyRecaps.filter(recap => recap.status === "Published"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecaps();
    }, []);
    
    if (isLoading) {
        return (
             <section id="recap" className="py-20 md:py-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Recap Aftermovie</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, index) => (
                           <RecapCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (recaps.length === 0) {
        return null;
    }

    return (
        <section id="recap" className="py-20 md:py-32 overflow-hidden animate-fade-up">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Recap Aftermovie</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recaps.map((recap, index) => (
                        <RecapCard key={recap.id} recap={recap} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecapSection;
