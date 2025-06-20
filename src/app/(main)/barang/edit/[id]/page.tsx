'use client'

import BackButton from "@/components/BackButton";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from 'sonner'
import React from "react";

const formSchema = z.object({
    item_code: z.string().min(1, { message: 'Item code is required' }),
    item_name: z.string().min(1, { message: 'Item name is required' }),
    item_brand: z.string().min(1, { message: 'Item brand is required' }),
    item_category: z.string().min(1, { message: 'Item category is required' }),
    quantity: z.coerce.number().min(1, { message: 'Item quantity is required' }),
    image: z.any().optional(), // untuk file upload
});

const EditItemPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState<string | null>(null);
    const [oldImage, setOldImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = React.useState<{ id: number; name_category: string }[]>([]);
    const [loadingCategories, setLoadingCategories] = React.useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            item_code: '',
            item_name: '',
            item_brand: '',
            item_category: '',
            quantity: 1,
            image: undefined,
        },
    });

    // Ambil kategori dari backend
    React.useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:8000/api/admin/categories", {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setCategories(data);
            } catch {
                toast.error("Gagal mengambil data kategori");
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Ambil data barang dari backend (setelah kategori didapat)
    useEffect(() => {
        if (!id || loadingCategories) return;
        const fetchItem = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`http://localhost:8000/api/admin/units/${id}`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Gagal mengambil data barang");
                const result = await res.json();
                const data = result.data;

                // Jika item_category dari backend adalah nama, mapping ke ID
                let categoryId = data.item_category;
                if (isNaN(Number(data.item_category))) {
                    categoryId = categories.find(cat => cat.name_category === data.item_category)?.id ?? '';
                }

                form.reset({
                    item_code: data.item_code,
                    item_name: data.item_name,
                    item_brand: data.item_brand,
                    item_category: String(categoryId),
                    quantity: data.quantity,
                    image: undefined,
                });
                setOldImage(data.image);
                setPreview(data.image);
            } catch {
                toast.error("Gagal mengambil data barang");
                router.push("/barang");
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, loadingCategories]);

    // Preview gambar baru
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            form.setValue("image", file);
        }
    };

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("item_code", data.item_code);
        formData.append("item_name", data.item_name);
        formData.append("item_brand", data.item_brand);
        formData.append("item_category", data.item_category); // sudah ID
        formData.append("quantity", String(data.quantity));
        if (data.image instanceof File) {
            formData.append("image", data.image);
        }
        try {
            const res = await fetch(`http://localhost:8000/api/admin/units/edit/${id}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
            const result = await res.json();
            if (res.ok) {
                toast.success('Item has been updated successfully', { description: `Updated: ${data.item_name}` });
                router.push("/barang");
            } else {
                toast.error(result.message || "Gagal update barang");
            }
        } catch {
            toast.error("Terjadi kesalahan jaringan");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <>
            <BackButton text='Back' link='/barang' />
            <h3 className='text-2xl mb-4'>Edit Item</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                    <FormField
                        control={form.control}
                        name='item_code'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                                    Item Code
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                        placeholder='Enter Item Code'
                                        {...field}
                                        disabled
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='item_name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                                    Item Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                        placeholder='Enter Item Name'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='item_brand'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                                    Item Brand
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                        placeholder='Enter Item Brand'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Image upload & preview */}
                    <FormItem>
                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                            Image
                        </FormLabel>
                        <FormControl>
                            <div>
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mb-2 w-32 h-32 object-cover rounded"
                                    />
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>

                    <FormField
                        control={form.control}
                        name='item_category'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kategori</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        value={field.value || ''}
                                        onChange={e => field.onChange(e.target.value)}
                                        className='bg-slate-100 dark:bg-slate-500 text-black dark:text-white rounded px-3 py-2'
                                    >
                                        <option value="" disabled>Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name_category}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='quantity'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                                    Quantity
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                        placeholder='Enter Quantity'
                                        {...field}
                                        value={field.value ?? ''}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button className='w-full dark:bg-slate-800 dark:text-white'>
                        Update Item
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default EditItemPage;