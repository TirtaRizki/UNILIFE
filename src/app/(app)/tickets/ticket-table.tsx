
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, ExternalLink } from "lucide-react";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Ticket } from "@/lib/types";
import { TicketForm } from './ticket-form';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const dummyTickets: Ticket[] = [
    { id: "dummy-t1", type: "Early Bird - Day 1", price: 75000, status: "Sold Out" },
    { id: "dummy-t2", type: "Presale 1 - Day 1", price: 100000, status: "Available" },
    { id: "dummy-t3", type: "Early Bird - Day 2", price: 75000, status: "Sold Out" },
    { id: "dummy-t4", type: "Presale 1 - Day 2", price: 100000, status: "Available" },
    { id: "dummy-t5", type: "Presale 1 - 2 Days Pass", price: 180000, status: "Available" },
    { id: "dummy-t6", type: "VIP Access", price: 500000, status: "Available" },
];


export default function TicketTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/tickets`);
            if (!response.ok) throw new Error("Failed to fetch tickets");
            let data = await response.json();
            if (!data || data.length === 0) {
                data = dummyTickets;
            }
            setTickets(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch tickets. Displaying dummy data.", variant: "destructive" });
            setTickets(dummyTickets);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleAdd = () => {
        setSelectedTicket(null);
        setSheetOpen(true);
    };

    const handleEdit = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        if (id.startsWith('dummy-')) {
            toast({ title: "Info", description: "Cannot delete dummy data." });
            return;
        }
        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete ticket");
            }
            toast({ title: "Success", description: "Ticket deleted successfully." });
            fetchTickets(); // Refresh data
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
             toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    };

    const handleSave = async (ticketData: Ticket) => {
        try {
            const response = await fetch(`/api/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData.id.startsWith('dummy-') ? { ...ticketData, id: '' } : ticketData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save ticket");
            }
            toast({ title: "Success", description: "Ticket saved successfully." });
            setSheetOpen(false);
            setSelectedTicket(null);
            fetchTickets(); // Refresh data
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    }
    
    const getBadgeVariant = (status: Ticket['status']) => {
        switch (status) {
            case 'Available':
                return 'default';
            case 'Sold Out':
                return 'destructive';
            default:
                return 'outline';
        }
    };
    
    if (isLoading) {
        return <div>Loading tickets...</div>;
    }

    return (
        <>
            <PageHeader title="Tiket" actions={
                <>
                    <Link href="https://mytiketin.com/event/79" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Beli Tiket
                        </Button>
                    </Link>
                    {canManage && (
                        <Button onClick={handleAdd}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Tiket
                        </Button>
                    )}
                </>
            } />
            <Card className="content-card">
                <CardHeader>
                    <CardTitle>Manajemen Tiket</CardTitle>
                    <CardDescription>Kelola semua tiket event: lihat penjualan, status, dan terbitkan tiket baru.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    {canManage && (
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.length > 0 ? tickets.map((ticket) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell className="font-medium">{ticket.type}</TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(ticket.price)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                                        </TableCell>
                                        {canManage && (
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEdit(ticket)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(ticket.id)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={canManage ? 4 : 3} className="text-center">No tickets found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {canManage && (
                <TicketForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    ticket={selectedTicket}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
