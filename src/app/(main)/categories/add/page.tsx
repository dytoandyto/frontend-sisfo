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
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner'

const formSchema = z.object({
    name_category: z.string().min(1, { message: "Category name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
});

const AddCategoryPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name_category: '',
            description: '',
        },
    });

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/admin/categories", {
                method: "POST",
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
                toast.success('Category has been added successfully', { description: `Added: ${data.name_category}` });
                form.reset();
            } else {
                toast.error(result.message || "Gagal menambah kategori");
            }
        } catch {
            toast.error("Terjadi kesalahan jaringan");
        }
    };

    return (
        <>
            <BackButton text='Back To Categories' link='/categories' />
            <h3 className="text-2xl mb-4">Add New Category</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                    <FormField
                        control={form.control}
                        name='name_category'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter Category Name' {...field} />
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
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder='Enter Description' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className='w-full dark:bg-slate-800 dark:text-white'>
                        Add Category
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default AddCategoryPage;