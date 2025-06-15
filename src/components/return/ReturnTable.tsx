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

interface ReturnItem {
    id: number;
    id_loan: number;
    user?: { id: number; name: string };
    item?: { id: number; item_name: string };
    date_return: string;
    date_returned?: string;
    notes?: string;
    condition: string;
    created_at: string;
}

const ReturnTable = () => {
    const [returns, setReturns] = useState<ReturnItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReturns = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:8000/api/admin/return", {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const result = await res.json();
                const data = result.data || [];
                setReturns(data);
            } catch {
                toast.error("Gagal mengambil data pengembalian");
            } finally {
                setLoading(false);
            }
        };
        fetchReturns();
    }, []);

    return (
        <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl mb-4 font-semibold">Daftar Pengembalian</h3>
                <Link href="/pengembalian/add">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xs">
                        + Tambahkan Pengembalian
                    </button>
                </Link>
            </div>
            <Table>
                <TableCaption>Daftar Pengembalian Barang</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Peminjam</TableHead>
                        <TableHead>Nama Barang</TableHead>
                        <TableHead>Tanggal Pengembalian</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) : returns.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-zinc-400">
                                Tidak ada data pengembalian.
                            </TableCell>
                        </TableRow>
                    ) : (
                        returns.map((ret) => (
                            <TableRow key={ret.id}>
                                <TableCell>{ret.id}</TableCell>
                                <TableCell>{ret.user?.name || '-'}</TableCell>
                                <TableCell>{ret.item?.item_name || '-'}</TableCell>
                                {/* <TableCell>{ret.date_return}</TableCell> */}
                                <TableCell>{ret.date_returned}</TableCell>
                                <TableCell>{ret.condition}</TableCell>
                                <TableCell>{ret.notes || '-'}</TableCell>
                                <TableCell>
                                    <Link href={`/pengembalian/detail/${ret.id}`}>
                                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs'>
                                            Detail
                                        </button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ReturnTable;