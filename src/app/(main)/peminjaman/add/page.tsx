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

const formSchema = z.object({
    id_user: z.coerce.number().min(1, { message: "User ID is required" }),
    id_item: z.coerce.number().min(1, { message: "Item ID is required" }),
    date_loan: z.string().min(1, { message: "Loan date is required" }),
    date_return: z.string().min(1, { message: "Return date is required" }),
    quantity: z.coerce.number().min(1, { message: "Quantity is required" }),
});

const AddLoanPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id_user: 0,
            id_item: 0,
            date_loan: '',
            date_return: '',
            quantity: 1,
        },
    });

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        toast('Loan has been added successfully', { description: `User ID: ${data.id_user}` });
        // Contoh POST:
        // await fetch('/api/loan', { method: 'POST', body: JSON.stringify(data) });
    };

    return (
        <>
            <BackButton text='Back To Loans' link='/peminjaman' />
            <h3 className="text-2xl mb-4">Add New Loan</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                    <FormField
                        control={form.control}
                        name='id_user'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User ID</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder='Enter User ID' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='id_item'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item ID</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder='Enter Item ID' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='date_loan'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loan Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='date_return'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Return Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
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
                                    <Input type="number" min={1} placeholder='Enter Quantity' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className='w-full dark:bg-slate-800 dark:text-white'>
                        Add Loan
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default AddLoanPage;