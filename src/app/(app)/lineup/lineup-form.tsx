"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { Lineup } from "@/lib/types"

const lineupSchema = z.object({
  id: z.string().optional(),
  artistName: z.string().min(2, "Artist name is required"),
  day: z.string().min(3, "Day is required"),
  date: z.date({ required_error: "A date is required." }),
})

type LineupFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lineup: Lineup | null;
  onSave: (lineup: Lineup) => void;
}

export function LineupForm({ open, onOpenChange, lineup, onSave }: LineupFormProps) {
  const form = useForm<z.infer<typeof lineupSchema>>({
    resolver: zodResolver(lineupSchema),
    defaultValues: lineup
      ? { ...lineup, date: new Date(lineup.date) }
      : { artistName: "", day: "", date: new Date() },
  })

  useEffect(() => {
    if (open) {
      const defaultValues = lineup
        ? { ...lineup, date: new Date(lineup.date) }
        : { artistName: "", day: "", date: new Date() };
      form.reset(defaultValues);
    }
  }, [lineup, open, form])

  function onSubmit(values: z.infer<typeof lineupSchema>) {
    const lineupData: Lineup = {
        ...values,
        id: lineup?.id || "",
        date: format(values.date, "yyyy-MM-dd"),
    };
    onSave(lineupData);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{lineup ? "Edit Lineup" : "Tambah ke Lineup"}</SheetTitle>
          <SheetDescription>
            {lineup ? "Perbarui detail artis." : "Tambah artis baru ke lineup."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="artistName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Artis</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Artis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hari</FormLabel>
                  <FormControl>
                    <Input placeholder="cth., Jumat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
