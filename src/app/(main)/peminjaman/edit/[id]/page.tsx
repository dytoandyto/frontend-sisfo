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
import { Button } from '@/components/ui/button'
import loans from "@data/loan";
import { toast } from 'sonner'

const formSchema = z.object({
    status: z.string(),
});

interface LoaneditPageProps {
    params: {
        id: string;
    }
}

const EditLoanPage = ({ id }: LoaneditPageProps) => {
    const loan = loans.find((loan) => loan.id === id);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: loan?.status || '',
        },
    });

    const handlePatch = async (status: string) => {
        // PATCH ke backend di sini jika sudah ada API
        form.setValue('status', status);
        toast(`Loan has been ${status}`, { description: `Loan ID: ${loan?.id}` });
        // Contoh PATCH:
        // await fetch(`/api/loan/${loan?.id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    };

    return (
        <>
            <BackButton text='Back To Loans' link='/peminjaman' />
            <h3 className="text-2xl mb-4">Approve / Reject Loan</h3>
            <div className="mb-4 p-4 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                <div><span className="font-semibold">User ID:</span> {loan?.id_user}</div>
                <div><span className="font-semibold">Item ID:</span> {loan?.id_item}</div>
                <div><span className="font-semibold">Loan Date:</span> {loan?.date_loan}</div>
                <div><span className="font-semibold">Return Date:</span> {loan?.date_return}</div>
                <div><span className="font-semibold">Quantity:</span> {loan?.quantity}</div>
                <div><span className="font-semibold">Status:</span> {form.watch('status')}</div>
            </div>
            <Form {...form}>
                <div className="flex gap-4">
                    <Button
                        type="button"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handlePatch('approved')}
                    >
                        Approve
                    </Button>
                    <Button
                        type="button"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handlePatch('rejected')}
                    >
                        Reject
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default EditLoanPage;