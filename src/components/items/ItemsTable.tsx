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
import { toast } from 'sonner'
import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

interface Item {
    id: number;
    item_code: string;
    item_name: string;
    item_brand: string;
    image: string;
    item_category: string;
    quantity: number;
    created_at: string; // ubah ke snake_case sesuai response baru
    updated_at: string;
}

interface ItemsTableProps {
    limit?: number;
    category?: number;
}

const ItemsTable = ({ limit, category }: ItemsTableProps) => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);

    // Ambil data dari backend
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:8000/api/admin/units", {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                let filtered = data.data; // ambil dari data.data sesuai response baru
                if (category) {
                    filtered = filtered.filter((item: Item) => item.item_category === String(category));
                }
                // Urutkan dari terbaru ke terlama
                filtered = filtered.sort(
                    (a: Item, b: Item) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setItems(limit ? filtered.slice(0, limit) : filtered);
            } catch {
                toast.error("Gagal mengambil data barang");
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [limit, category]);

    // Hapus item ke backend
    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("token");
        toast.promise(
            new Promise(async (resolve, reject) => {
                if (confirm("Are you sure you want to delete this data?")) {
                    try {
                        const res = await fetch(`http://localhost:8000/api/admin/units/delete/${id}`, {
                            method: "DELETE",
                            headers: {
                                "Accept": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                        });
                        const result = await res.json();
                        if (res.ok) {
                            setItems(items.filter(item => item.id !== id));
                            resolve(result.message || "Data berhasil dihapus!");
                        } else {
                            reject(result.message || "Gagal menghapus data");
                        }
                    } catch {
                        reject("Terjadi kesalahan jaringan");
                    }
                } else {
                    reject("Dibatalkan");
                }
            }),
            {
                loading: "Menghapus data...",
                success: (msg) => String(msg),
                error: (msg) => String(msg),
            }
        );
    };

    // Export ke Excel
    const handleExportExcel = () => {
        const exportData = items.map(item => ({
            ID: item.id,
            "Item Code": item.item_code,
            "Item Name": item.item_name,
            "Item Brand": item.item_brand,
            "Category": item.item_category,
            "Quantity": item.quantity,
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Items");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // Buat link download manual
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "daftar_barang.xlsx";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    };

    return (
        <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl mb-4 font-semibold">{items.length > 0 ? "Daftar Barang" : "No Items"}</h3>
                <div className="flex gap-2">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
                        onClick={handleExportExcel}
                        disabled={items.length === 0}
                    >
                        Export Excel
                    </button>
                    <Link href="/barang/add">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xs">
                            + Tambahkan barang baru
                        </button>
                    </Link>
                </div>
            </div>
            <Table>
                <TableCaption>A list of Items</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Item Code</TableHead>
                        <TableHead className="hidden md:table-cell">Name</TableHead>
                        <TableHead className="hidden md:table-cell">Brand</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead className="hidden md:table-cell">Quantity</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) : items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">No data</TableCell>
                        </TableRow>
                    ) : (
                        items.map((item, idx) => (
                            <TableRow key={item.id}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.item_name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    ) : (
                                        <span className="text-zinc-400 italic">Tidak ada gambar</span>
                                    )}
                                </TableCell>
                                <TableCell>{item.item_code}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {item.item_name}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {item.item_brand}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {item.item_category}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {item.quantity}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={`/barang/edit/${item.id}`}>
                                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs'>
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs'
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ItemsTable;