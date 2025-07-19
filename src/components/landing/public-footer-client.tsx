
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Line Up', href: '#lineup' },
    { name: 'Recap', href: '#recap' },
];

const PublicFooterClient = ({ logoUrl }: { logoUrl: string }) => {
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Link href="/" className="inline-block mb-4" onClick={(e) => handleLinkClick(e, '#home')}>
                <Image
                    src={logoUrl}
                    alt="Unilife Logo"
                    width={180}
                    height={48}
                    className="object-contain"
                />
            </Link>
            <p className="text-lg max-w-md text-gray-400 mt-2 mb-6">
                The most anticipated back-to-school festival in Lampung, uniting music, art, and youthful creativity.
            </p>
            <div className="flex space-x-6 mb-8">
                <a href="https://www.instagram.com/unilife.festival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-transform duration-300 hover:scale-110">
                    <FaInstagram size={28} />
                </a>
                <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-transform duration-300 hover:scale-110">
                    <FaTiktok size={28} />
                </a>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
                {navLinks.map((link) => (
                    <a key={link.href} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-base text-gray-300 hover:text-primary transition-colors">
                        {link.name}
                    </a>
                ))}
            </nav>
        </>
    );
};

export default PublicFooterClient;
