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
import items from "@data/items";
import { toast } from 'sonner'
import categories from "@data/categories";

const formSchema = z.object({
    item_code: z.string().min(1, {
        message: 'Item code is required'
    }),
    item_name: z.string().min(1, {
        message: 'Item name is required'
    }),
    item_brand: z.string().min(1, {
        message: 'Item brand is required'
    }),
    item_category: z.string().min(1, {
        message: 'Item category is required'
    }),
    quantity: z.coerce.number().min(1, {
        message: 'Item quantity is required'
    }),
});

interface PostItemsLayoutProps {
    params: {
        item_code: string;
    }
}

const PostItemsLayout = ({ params: { item_code } }: PostItemsLayoutProps) => {
    // Cari item berdasarkan id
    const item = items.find((item) => item.item_code === item_code);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            item_code: item?.item_code || '',
            item_name: item?.item_name || '',
            item_brand: item?.item_brand || '',
            item_category: item?.item_category || '',
            quantity: item?.quantity ?? 1,
        },
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        // Lakukan update ke backend di sini jika sudah terhubung API
        toast('Item has been updated successfully', { description: `Updated: ${data.item_name}` });
    };

    return (
        <>
            <BackButton text='Back' link='/' />
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
                                    // biasa kode tidak diubah
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

                    <FormField
                        control={form.control}
                        name='item_category'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                                    Item Category
                                </FormLabel>
                                <FormControl>
                                    <select
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0 rounded w-full py-2 px-3'
                                        {...field}
                                        value={field.value || ''}
                                    >
                                        <option value="" disabled>Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.name_category}>
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

export default PostItemsLayout;