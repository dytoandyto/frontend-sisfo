'use client'

import React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner'

const formSchema = z.object({
    name_category: z.string().min(1, {
        message: 'Category Name is required'
    }),
    description: z.string().min(1, {
        message: 'Description is required'
    }),
});

interface CategoriesEditPageProps {
    params: {
        id: string;
    }
}

const CategoriesEditPage = ({ params }: CategoriesEditPageProps) => {
    const { id } = React.use(params);
    const [loading, setLoading] = React.useState(true);

    // Inisialisasi form sebelum useEffect
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name_category: '',
            description: '',
        },
    });

    // Ambil data kategori dari backend dan set ke form
    React.useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`http://localhost:8000/api/admin/categories/${id}`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();
                form.reset({
                    name_category: data.name_category,
                    description: data.description,
                });
            } catch {
                toast.error("Kategori tidak ditemukan");
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // PUT /api/admin/categories/edit/{id}
    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/admin/categories/edit/${id}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name_category: data.name_category,
                    description: data.description,
                }),
            });
            const result = await res.json();
            if (res.ok) {
                toast.success('Category has been updated successfully', { description: `Updated: ${data.name_category}` });
            } else {
                toast.error(result.message || "Gagal update kategori");
            }
        } catch {
            toast.error("Terjadi kesalahan jaringan");
        }
    };

    if (loading) {
        return (
            <>
                <BackButton text='Back' link='/categories' />
                <div className="text-center mt-10">Loading...</div>
            </>
        );
    }

    return (
        <>
            <BackButton text='Back' link='/categories' />
            <h3 className='text-2xl mb-4'>Edit Category</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                    <FormField
                        control={form.control}
                        name='name_category'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                                    Category Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                        placeholder='Enter Category Name'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                        placeholder='Enter Description'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button className='w-full dark:bg-slate-800 dark:text-white'>
                        Update Category
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default CategoriesEditPage;