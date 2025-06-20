'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton';
import React from 'react';

const formSchema = z.object({
    item_code: z.string().min(1, { message: 'Item code wajib diisi' }),
    item_name: z.string().min(1, { message: 'Nama item wajib diisi' }),
    item_brand: z.string().min(1, { message: 'Brand wajib diisi' }),
    item_category: z.string().min(1, { message: 'Kategori wajib diisi' }),
    quantity: z.coerce.number().min(1, { message: 'Jumlah wajib diisi' }),
    image: z.any().optional(),
});



const AddItemPage = () => {
    const [preview, setPreview] = useState<string | null>(null);
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
        formData.append("item_category", data.item_category);
        formData.append("quantity", String(data.quantity));
        if (data.image instanceof File) {
            formData.append("image", data.image);
        }
        try {
            const res = await fetch("http://127.0.0.1:8000/api/admin/units/create", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
            const result = await res.json();
            if (res.ok) {
                toast.success(result.message || "Item berhasil dibuat");
                form.reset();
                setPreview(null);
            } else {
                toast.error(result.message || "Gagal menambah item");
            }
        } catch {
            toast.error("Terjadi kesalahan jaringan");
        }
    };

    return (
        <div>
            <BackButton text="Go Back" link="/"></BackButton>
            <h3 className='text-2xl mb-4'>Tambah Item</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                    <FormField
                        control={form.control}
                        name='item_code'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kode Item</FormLabel>
                                <FormControl>
                                    <Input placeholder='Kode Item' {...field} />
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
                                <FormLabel>Nama Item</FormLabel>
                                <FormControl>
                                    <Input placeholder='Nama Item' {...field} />
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
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Input placeholder='Brand' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="item_category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item Category</FormLabel>
                                <FormControl>
                                    <select
                                        className="bg-slate-100 dark:bg-slate-500 border-0 rounded w-full py-2 px-3"
                                        disabled={loadingCategories}
                                        value={field.value || ""}
                                        onChange={e => field.onChange(e.target.value)}
                                    >
                                        <option value="" disabled>
                                            {loadingCategories ? "Loading..." : "Pilih Kategori"}
                                        </option>
                                        {categories.map(cat => (
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
                                <FormLabel>Jumlah</FormLabel>
                                <FormControl>
                                    <Input type="number" min={1} placeholder='Jumlah' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='image'
                        render={() => (
                            <FormItem>
                                <FormLabel>Gambar</FormLabel>
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
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className='w-full'>Tambah Item</Button>
                </form>
            </Form>
        </div>
    );
};

export default AddItemPage;