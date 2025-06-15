'use client'

import BackButton from "@/components/BackButton";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form, FormField, FormItem, FormLabel, FormMessage, FormControl
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import React from "react";

// Ubah schema agar item_category bertipe number
const formSchema = z.object({
    item_code: z.string().min(1, { message: "Item code is required" }),
    item_name: z.string().min(1, { message: "Item name is required" }),
    item_brand: z.string().min(1, { message: "Item brand is required" }),
    item_category: z.coerce.number().min(1, { message: "Item category is required" }),
    quantity: z.coerce.number().min(1, { message: "Quantity is required" }),
});

const AddItemPage = () => {
    const [categories, setCategories] = React.useState<{ id: number; name_category: string }[]>([]);
    const [loadingCategories, setLoadingCategories] = React.useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            item_code: '',
            item_name: '',
            item_brand: '',
            item_category: 0,
            quantity: 1,
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

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/admin/units/create", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (res.ok) {
                toast.success('Item has been added successfully', { description: `Added: ${data.item_name}` });
                form.reset();
            } else {
                toast.error(result.message || "Gagal menambah barang");
            }
        } catch {
            toast.error("Terjadi kesalahan jaringan");
        }
    };

    return (
        <>
            <BackButton text='Back To Items' link='/barang' />
            <h3 className="text-2xl mb-4">Add New Item</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                    <FormField
                        control={form.control}
                        name='item_code'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item Code</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter Item Code' {...field} />
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
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter Item Name' {...field} />
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
                                <FormLabel>Item Brand</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter Item Brand' {...field} />
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
                                        onChange={e => field.onChange(Number(e.target.value))}
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
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
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
                        Add Item
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default AddItemPage;