
"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Committee, User } from "@/lib/types"

const committeeSchema = z.object({
  id: z.string().optional(),
  userId: z.string({ required_error: "Please select a user." }),
  position: z.string().min(3, "Position is required"),
})

type CommitteeFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  committee: Committee | null;
  onSave: (committee: Omit<Committee, 'user'>) => void;
  allUsers: User[];
  existingCommitteeUserIds: string[];
}

export function CommitteeForm({ open, onOpenChange, committee, onSave, allUsers, existingCommitteeUserIds }: CommitteeFormProps) {
  const form = useForm<z.infer<typeof committeeSchema>>({
    resolver: zodResolver(committeeSchema),
    defaultValues: committee || { userId: "", position: "" },
  })

  useEffect(() => {
    if (open) {
      form.reset(committee || { userId: "", position: "" });
    }
  }, [committee, open, form])

  function onSubmit(values: z.infer<typeof committeeSchema>) {
    const committeeData: Omit<Committee, 'user'> = {
        ...values,
        id: committee?.id || "",
    };
    onSave(committeeData);
  }
  
  const availableUsers = allUsers.filter(user => 
      !existingCommitteeUserIds.includes(user.id) || (committee && user.id === committee.userId)
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{committee ? "Edit Anggota Panitia" : "Tambah Anggota Panitia"}</SheetTitle>
          <SheetDescription>
            {committee ? "Perbarui detail anggota." : "Pilih pengguna untuk ditambahkan sebagai panitia."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!committee}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Pengguna" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name} - ({user.email})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posisi</FormLabel>
                  <FormControl>
                    <Input placeholder="Posisi Anggota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="pt-4">
                <SheetClose asChild>
                    <Button type="button" variant="outline">Batal</Button>
                </SheetClose>
                <Button type="submit">Simpan</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
