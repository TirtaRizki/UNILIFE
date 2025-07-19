
"use client";
import React, { useState, useEffect } from 'react';
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Committee, User } from "@/lib/types";
import { CommitteeForm } from './committee-form';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function CommitteeTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [committeesRes, usersRes] = await Promise.all([
                fetch(`/api/committee`),
                fetch(`/api/users`),
            ]);
            if (!committeesRes.ok || !usersRes.ok) throw new Error("Failed to fetch data");
            
            const committeesData = await committeesRes.json();
            const usersData = await usersRes.json();

            setCommittees(committeesData);
            setAllUsers(usersData);

        } catch (error) {
            toast({ title: "Error", description: "Could not fetch committee data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setSelectedCommittee(null);
        setSheetOpen(true);
    };

    const handleEdit = (committee: Committee) => {
        setSelectedCommittee(committee);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/committee/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Failed to delete committee member");
            toast({ title: "Success", description: "Committee member deleted successfully." });
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Could not delete committee member.", variant: "destructive" });
        }
    };

    const handleSave = async (committeeData: Omit<Committee, 'user'>) => {
        try {
            const response = await fetch(`/api/committee`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(committeeData),
            });
            if (!response.ok) throw new Error("Failed to save committee member");
            toast({ title: "Success", description: "Committee member saved successfully." });
            setSheetOpen(false);
            setSelectedCommittee(null);
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Could not save committee member.", variant: "destructive" });
        }
    }
    
    if (isLoading) {
        return <div>Loading committee members...</div>;
    }

    return (
        <>
            <PageHeader title="Panitia" actions={
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Panitia
                    </Button>
                )
            } />
            <Card className="content-card">
                <CardHeader>
                    <CardTitle>Daftar Panitia</CardTitle>
                    <CardDescription>Kelola anggota panitia penyelenggara.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Posisi</TableHead>
                                    <TableHead>Role</TableHead>
                                    {canManage && (
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {committees.length > 0 ? committees.map((committee) => (
                                    <TableRow key={committee.id}>
                                        <TableCell className="font-medium">{committee.user?.name || 'User not found'}</TableCell>
                                        <TableCell>{committee.position}</TableCell>
                                        <TableCell>
                                            {committee.user?.role ? <Badge variant="secondary">{committee.user.role}</Badge> : '-'}
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
                                                        <DropdownMenuItem onClick={() => handleEdit(committee)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(committee.id)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No committee members found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {canManage && (
                <CommitteeForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    committee={selectedCommittee}
                    onSave={handleSave}
                    allUsers={allUsers}
                    existingCommitteeUserIds={committees.map(c => c.userId)}
                />
            )}
        </>
    );
}
