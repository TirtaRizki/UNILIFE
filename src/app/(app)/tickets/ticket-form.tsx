
"use client"

import React, { useEffect } from "react"
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
import type { Ticket } from "@/lib/types"

const ticketSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(3, "Ticket type is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  status: z.enum(["Available", "Sold Out"]),
})

type TicketFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
  onSave: (ticket: Ticket) => void;
}

export function TicketForm({ open, onOpenChange, ticket, onSave }: TicketFormProps) {
  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: ticket || { type: "", price: 0, status: "Available" },
  })

  useEffect(() => {
    if (open) {
      form.reset(ticket || { type: "", price: 0, status: "Available" });
    }
  }, [ticket, open, form])

  function onSubmit(values: z.infer<typeof ticketSchema>) {
    const ticketData: Ticket = {
        ...values,
        id: ticket?.id || "",
    };
    onSave(ticketData);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{ticket ? "Edit Tiket" : "Tambah Tiket Baru"}</SheetTitle>
          <SheetDescription>
            {ticket ? "Perbarui detail tiket." : "Isi detail untuk tipe tiket baru."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Tiket</FormLabel>
                  <FormControl>
                    <Input placeholder="cth., General Admission" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Available">Tersedia</SelectItem>
                      <SelectItem value="Sold Out">Habis</SelectItem>
                    </SelectContent>
                  </Select>
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
