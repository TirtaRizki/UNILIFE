
"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Banner } from "@/lib/types"

const bannerSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  status: z.enum(["Active", "Inactive"]),
  imageUrl: z.string().optional(),
})

type BannerFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
  onSave: (banner: Banner) => void;
}

export function BannerForm({ open, onOpenChange, banner, onSave }: BannerFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof bannerSchema>>({
    resolver: zodResolver(bannerSchema),
    defaultValues: banner || { title: "", status: "Active", imageUrl: "" },
  })

  useEffect(() => {
    if (open) {
      const defaultValues = banner || { title: "", status: "Active", imageUrl: "" };
      form.reset(defaultValues);
      setImagePreview(defaultValues.imageUrl || null);
    }
  }, [banner, open, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        form.setValue("imageUrl", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue("imageUrl", url);
    setImagePreview(url);
  };

  function onSubmit(values: z.infer<typeof bannerSchema>) {
    const bannerData: Banner = {
        ...values,
        id: banner?.id || "",
        imageUrl: imagePreview || values.imageUrl,
    };
    onSave(bannerData);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{banner ? "Edit Banner" : "Tambah Banner Baru"}</SheetTitle>
          <SheetDescription>
            {banner ? "Perbarui detail banner." : "Isi detail untuk banner baru."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="Judul Banner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
                <FormLabel>Gambar Banner</FormLabel>
                {imagePreview && (
                  <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden border">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="banner advertisement"
                    />
                  </div>
                )}
                <Tabs defaultValue="url" className="w-full mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="url">URL</TabsTrigger>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url">
                        <FormControl>
                            <Input 
                              placeholder="https://placehold.co/400x225.png" 
                              onChange={handleUrlChange}
                              defaultValue={form.getValues("imageUrl")}
                            />
                        </FormControl>
                    </TabsContent>
                    <TabsContent value="upload">
                         <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary/10 file:text-primary
                                hover:file:bg-primary/20"
                            />
                        </FormControl>
                    </TabsContent>
                </Tabs>
            </FormItem>

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
                      <SelectItem value="Active">Aktif</SelectItem>
                      <SelectItem value="Inactive">Tidak Aktif</SelectItem>
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
