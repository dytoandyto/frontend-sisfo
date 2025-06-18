'use client'
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
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import * as XLSX from "xlsx";

interface Loan {
    id: number;
    user: { id: number; name: string };
    item: { id: number; item_name: string };
    date_loan: string;
    date_return: string;
    date_returned?: string;
    quantity: number;
    status: string;
}

interface LoanTableProps {
    limit?: number;
    title?: string;
}

const LoanTable = ({ limit, title }: LoanTableProps) => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(false);

    // Ambil data loan dari backend
    useEffect(() => {
        const fetchLoans = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:8000/api/admin/loans", {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const result = await res.json();
                const data = result.data || [];
                const sorted = data.sort(
                    (a: Loan, b: Loan) => new Date(b.date_loan).getTime() - new Date(a.date_loan).getTime()
                );
                setLoans(limit ? sorted.slice(0, limit) : sorted);
            } catch {
                toast.error("Gagal mengambil data peminjaman");
            } finally {
                setLoading(false);
            }
        };
        fetchLoans();
    }, [limit]);

    // Approve loan
    const handleApprove = async (id: number) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/admin/loans/approve/${id}`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const result = await res.json();
            if (res.ok) {
                toast.success(result.message || "Berhasil approve peminjaman");
                setLoans(loans.map(loan => loan.id === id ? { ...loan, status: "approved" } : loan));
            } else {
                toast.error(result.message || "Gagal approve peminjaman");
            }
        } catch {
            toast.error("Terjadi kesalahan jaringan");
        }
    };

    // Reject loan
    const handleReject = async (id: number) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/admin/loans/reject/${id}`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const result = await res.json();
            if (res.ok) {
                toast.success(result.message || "Berhasil reject peminjaman");
                setLoans(loans.map(loan => loan.id === id ? { ...loan, status: "rejected" } : loan));
            } else {
                toast.error(result.message || "Gagal reject peminjaman");
            }
        } catch {
            toast.error("Terjadi kesalahan jaringan");
        }
    };
    // ...existing code...

    const handleExportExcel = () => {
        const exportData = loans.map((loan, idx) => ({
            No: idx + 1,
            "Nama Peminjam": loan.user?.name || '-',
            "Nama Barang": loan.item?.item_name || '-',
            "Loan Date": loan.date_loan,
            "Return Date": loan.date_return,
            "Returned": loan.date_returned || '-',
            "Quantity": loan.quantity,
            "Status": loan.status,
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Loans");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // Buat link download manual
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "daftar_peminjaman.xlsx";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    };

    // ...existing code...

    return (
        <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl mb-4 font-semibold">{title ? title : 'Daftar Peminjaman'}</h3>
                <div className="flex gap-2">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
                        onClick={handleExportExcel}
                        disabled={loans.length === 0}
                    >
                        Export Excel
                    </button>
                    <Link href="/peminjaman/add">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xs">
                            + Tambahkan peminjaman baru
                        </button>
                    </Link>
                </div>
            </div>
            <Table>
                <TableCaption>A list of recent Loans</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Peminjam</TableHead>
                        <TableHead>Nama Barang</TableHead>
                        <TableHead className='hidden md:table-cell'>Loan Date</TableHead>
                        <TableHead className='hidden md:table-cell'>Return Date</TableHead>
                        <TableHead className='hidden md:table-cell'>Returned</TableHead>
                        <TableHead className='hidden md:table-cell'>Quantity</TableHead>
                        <TableHead className='hidden md:table-cell'>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) : loans.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center text-zinc-400">
                                Tidak ada data peminjaman.
                            </TableCell>
                        </TableRow>
                    ) : (
                        loans.map((loan) => (
                            <TableRow key={loan.id}>
                                <TableCell>{loan.id}</TableCell>
                                <TableCell>{loan.user?.name || '-'}</TableCell>
                                <TableCell>{loan.item?.item_name || '-'}</TableCell>
                                <TableCell className='hidden md:table-cell'>{loan.date_loan}</TableCell>
                                <TableCell className='hidden md:table-cell'>{loan.date_return}</TableCell>
                                <TableCell className='hidden md:table-cell'>{loan.date_returned}</TableCell>
                                <TableCell className='hidden md:table-cell'>{loan.quantity}</TableCell>
                                <TableCell className='hidden md:table-cell'>{loan.status}</TableCell>
                                <TableCell>
                                    {loan.status === "pending" || loan.status === "waiting for respond" ? (
                                        <div className="flex gap-2">
                                            <button
                                                className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xs'
                                                onClick={() => handleApprove(loan.id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs'
                                                onClick={() => handleReject(loan.id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-zinc-400 italic">-</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default LoanTable;