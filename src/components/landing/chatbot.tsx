"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Phone, Send, X, Bot } from 'lucide-react';
import { chatWithCiki } from '@/ai/flows/chat-flow';

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'ciki';
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Haii! Aku Ciki, teman virtual kamu di Unilife. Mau nanya-nanya soal festival atau mau curhat? Gasss, sini aku dengerin! 😊",
            sender: 'ciki'
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            scrollToBottom();
        }, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const result = await chatWithCiki({ message: inputValue });
            const cikiMessage: Message = {
                id: Date.now() + 1,
                text: result.response,
                sender: 'ciki',
            };
            setMessages((prev) => [...prev, cikiMessage]);
        } catch (error) {
            console.error("Error chatting with Ciki:", error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: "Aduh, maaf banget, kayaknya koneksiku lagi error nih. Coba lagi nanti ya! 🙏",
                sender: 'ciki',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'fixed bottom-5 left-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl transition-all duration-300 transform',
                    'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-105 hover:shadow-2xl',
                    isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                )}
                aria-label="Open Chat"
            >
                <Phone className="h-5 w-5 animate-bounce" />
                <span className="font-medium">Cari info? Tanya di sini 👋</span>
            </Button>

            <div
                className={cn(
                    "fixed bottom-5 left-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm h-[70vh] max-h-[600px] origin-bottom-left transition-all duration-300 ease-in-out",
                    isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
            >
                <div className="flex h-full flex-col rounded-2xl border bg-card text-card-foreground shadow-2xl overflow-hidden">
                    <header className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
                        <div className="flex items-center gap-3">
                            <Avatar className="border-2 border-white/50">
                                <AvatarImage src="https://placehold.co/40x40.png" alt="Ciki" />
                                <AvatarFallback>CK</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-bold">Ciki</h3>
                                <p className="text-xs text-primary-foreground/80">Teman Unilife kamu 🥳</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full hover:bg-white/20">
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close chat</span>
                        </Button>
                    </header>
                    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(
                                        "flex items-end gap-2",
                                        message.sender === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {message.sender === 'ciki' && (
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src="https://placehold.co/24x24.png" alt="Ciki" />
                                            <AvatarFallback>CK</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-xl px-4 py-2 text-sm whitespace-pre-wrap",
                                            message.sender === 'user'
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted text-muted-foreground rounded-bl-none"
                                        )}
                                    >
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-end gap-2 justify-start">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src="https://placehold.co/24x24.png" alt="Ciki" />
                                        <AvatarFallback>CK</AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted text-muted-foreground rounded-xl rounded-bl-none px-4 py-2 text-sm">
                                        <span className="animate-pulse">Ciki is typing...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <footer className="p-4 border-t">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Tulis pertanyaanmu..."
                                autoComplete="off"
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
