'use client'

import BackButton from "@/components/BackButton";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import clients from "@data/users";
import { toast } from 'sonner'

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email" }),
});

interface EditUserPageProps {
    params: {
        id: string;
    }
}

const EditUserPage = ({ params }: EditUserPageProps) => {
    const user = clients.find((u) => String(u.id) === params.id);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        // PATCH ke backend di sini jika sudah ada API
        toast('User has been updated successfully', { description: `Updated: ${data.name}` });
        // Contoh PATCH:
        // await fetch(`/api/users/${user?.id}`, { method: 'PATCH', body: JSON.stringify(data) });
    };

    if (!user) {
        return (
            <>
                <BackButton text='Back To Users' link='/users' />
                <div className="text-center text-red-500 mt-10">User not found.</div>
            </>
        );
    }

    return (
        <>
            <BackButton text='Back To Users' link='/users' />
            <h3 className="text-2xl mb-4">Edit User</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter Name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter Email' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className='w-full dark:bg-slate-800 dark:text-white'>
                        Update User
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default EditUserPage;