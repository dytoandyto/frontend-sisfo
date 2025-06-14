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
import categories from "@data/categories";
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

const CategoriesEditPage = ({ id }: CategoriesEditPageProps) => {
    // Cari kategori berdasarkan id
    const category = categories.find((category) => category.id === id);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name_category: category?.name_category || '',
            description: category?.description || '',
        },
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        // Lakukan update ke backend di sini jika sudah terhubung API
        toast('Category has been updated successfully', { description: `Updated: ${data.name_category}` });
    };

    return (
        <>
            <BackButton text='Back' link='/' />
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