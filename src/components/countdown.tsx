
"use client";
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Ticket } from 'lucide-react';
import Link from 'next/link';

type CountdownProps = {
    targetDate: string;
    title: string;
    showButtonOnEnd?: boolean;
    buttonText?: string;
    buttonLink?: string;
};

const Countdown = ({ targetDate, title, showButtonOnEnd = false, buttonText = "Get Ticket", buttonLink = "#" }: CountdownProps) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isOver: false
    });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    isOver: false,
                };
            }
            return newTimeLeft;
        };
        
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        
        return () => clearInterval(timer);
    }, [targetDate]);

    const formatTime = (time: number) => {
        return String(time).padStart(2, '0');
    }
    
    const TimerUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="bg-gradient-to-br from-primary via-red-500 to-yellow-400 text-white rounded-lg p-3 md:p-4 text-center min-w-[70px] md:min-w-[80px] shadow-lg">
            <div className="text-2xl md:text-3xl font-bold">{isClient ? formatTime(value) : '00'}</div>
            <div className="text-xs uppercase opacity-80">{label}</div>
        </div>
    );

    if (isClient && timeLeft.isOver && showButtonOnEnd) {
        return (
            <div className="text-center w-full">
                <h2 className="text-lg font-semibold uppercase tracking-widest text-foreground dark:text-primary-foreground mb-4">{title}</h2>
                <Button size="lg" className="w-full max-w-xs animate-pulse" asChild>
                    <Link href={buttonLink} target="_blank" rel="noopener noreferrer">
                        <Ticket className="mr-2 h-5 w-5"/> {buttonText}
                    </Link>
                </Button>
            </div>
        );
    }
    
    return (
        <div className="text-center">
            <h2 className="text-lg font-semibold uppercase tracking-widest text-foreground dark:text-primary-foreground mb-4">{title}</h2>
            <div className="flex justify-center items-center gap-2 md:gap-4">
                <TimerUnit value={timeLeft.days} label="Days" />
                <TimerUnit value={timeLeft.hours} label="Hours" />
                <TimerUnit value={timeLeft.minutes} label="Minutes" />
                <TimerUnit value={timeLeft.seconds} label="Seconds" />
            </div>
        </div>
    );
};

export default Countdown;
