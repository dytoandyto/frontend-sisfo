import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import Link from "next/link";
import loans from "../../../data/loan";
import { loan } from "../../../types/loan";

interface LoanTableProps {
    limit?: number;
    title?: string;
}

const LoanTable = ({ limit, title }: LoanTableProps) => {
    // Urutkan data loan berdasarkan tanggal pinjam
    const sortedLoans: loan[] = [...loans].sort(
        (a, b) => new Date(b.date_loan).getTime() - new Date(a.date_loan).getTime()
    );
    // Batasi jumlah loan jika ada limit
    const filteredLoans = limit ? sortedLoans.slice(0, limit) : sortedLoans;

    return (
        <div className="mt-10">
            <h3 className="text-2xl mb-4 font-semibold">{title ? title : 'Loans'}</h3>
            <Table>
                <TableCaption>A list of recent Loans</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Item ID</TableHead>
                        <TableHead className='hidden md:table-cell'>Loan Date</TableHead>
                        <TableHead className='hidden md:table-cell'>Return Date</TableHead>
                        <TableHead className='hidden md:table-cell'>Returned</TableHead>
                        <TableHead className='hidden md:table-cell'>Quantity</TableHead>
                        <TableHead className='hidden md:table-cell'>Status</TableHead>
                        <TableHead>View</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredLoans.map((loan) => (
                        <TableRow key={loan.id}>
                            <TableCell>{loan.id}</TableCell>
                            <TableCell>{loan.id_user}</TableCell>
                            <TableCell>{loan.id_item}</TableCell>
                            <TableCell className='hidden md:table-cell'>{loan.date_loan}</TableCell>
                            <TableCell className='hidden md:table-cell'>{loan.date_return}</TableCell>
                            <TableCell className='hidden md:table-cell'>{loan.date_returned ?? '-'}</TableCell>
                            <TableCell className='hidden md:table-cell'>{loan.quantity}</TableCell>
                            <TableCell className='hidden md:table-cell'>{loan.status}</TableCell>
                            <TableCell>
                                <Link href={`/peminjaman/edit/${loan.id}`}>
                                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs'>
                                        Edit
                                    </button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default LoanTable;