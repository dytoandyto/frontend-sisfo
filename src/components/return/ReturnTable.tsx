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
import Returns from "@data/return";
import { Return } from "../../../types/return";

interface ReturnTableProps {
    limit?: number;
    title?: string;
}

const ReturnTable = ({ limit, title }: ReturnTableProps) => {
    // Urutkan data return berdasarkan tanggal pengembalian
    const sortedReturns: Return[] = [...Returns].sort(
        (a, b) => new Date(b.date_returned ?? '').getTime() - new Date(a.date_returned ?? '').getTime()
    );
    // Batasi jumlah return jika ada limit
    const filteredReturns = limit ? sortedReturns.slice(0, limit) : sortedReturns;

    return (
        <div className="mt-10">
            <h3 className="text-2xl mb-4 font-semibold">{title ? title : 'Returns'}</h3>
            <Table>
                <TableCaption>A list of recent Returns</TableCaption>
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
                    {filteredReturns.map((ret) => (
                        <TableRow key={ret.id}>
                            <TableCell>{ret.id}</TableCell>
                            <TableCell>{ret.id_user}</TableCell>
                            <TableCell>{ret.id_item}</TableCell>
                            <TableCell className='hidden md:table-cell'>{ret.date_loan}</TableCell>
                            <TableCell className='hidden md:table-cell'>{ret.date_return}</TableCell>
                            <TableCell className='hidden md:table-cell'>{ret.date_returned ?? '-'}</TableCell>
                            <TableCell className='hidden md:table-cell'>{ret.quantity}</TableCell>
                            <TableCell className='hidden md:table-cell'>{ret.condition}</TableCell>
                            <TableCell>
                                <Link href={`/pengembalian/edit/${ret.id}`}>
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
    )
}

export default ReturnTable