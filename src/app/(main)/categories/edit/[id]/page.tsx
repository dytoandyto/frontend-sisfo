'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const formSchema = z.object({
    name_category: z.string().min(1, { message: 'Nama kategori wajib diisi' }),
    description: z.string().optional(),
});

const EditCategoryPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [loading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name_category: '',
            description: '',
        },
    });

    useEffect(() => {
        if (!id) return;
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
                if (!res.ok) throw new Error("Gagal mengambil data kategori");
                const result = await res.json();
                form.reset({
                    name_category: result.data.name_category,
                    description: result.data.description || '',
                });
            } catch {
                toast.error("Gagal mengambil data kategori");
                router.push("/categories");
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/admin/categories/edit/${id}`, {
                method: "Put",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (res.ok) {
                toast.success('Kategori berhasil diupdate');
                router.push("/categories");
            } else {
                toast.error(result.message || "Gagal update kategori");
            }
        } catch {
            toast.error("Terjadi kesalahan jaringan");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div>
            <h3 className='text-2xl mb-4'>Edit Kategori</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                    <FormField
                        control={form.control}
                        name='name_category'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Kategori</FormLabel>
                                <FormControl>
                                    <Input placeholder='Nama Kategori' {...field} />
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
                                <FormLabel>Deskripsi</FormLabel>
                                <FormControl>
                                    <Input placeholder='Deskripsi' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className='w-full'>Update Kategori</Button>
                </form>
            </Form>
        </div>
    );
};

export default EditCategoryPage;