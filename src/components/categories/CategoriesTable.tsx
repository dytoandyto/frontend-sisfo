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

interface Category {
    id: number;
    name_category: string;
    description?: string;
    date?: string;
}

interface CategoriesTableProps {
    limit?: number;
    name_category?: string;
}

const CategoriesTable = ({ limit, name_category }: CategoriesTableProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    // Ambil data kategori dari backend
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:8000/api/admin/categories", {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                // Urutkan dari yang terbaru ke terlama (jika ada field date)
                const sorted = data.sort(
                    (a: Category, b: Category) =>
                        new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime()
                );
                setCategories(limit ? sorted.slice(0, limit) : sorted);
            } catch {
                toast.error("Gagal mengambil data kategori");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [limit]);

    // Hapus kategori ke backend
    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("token");
        toast.promise(
            new Promise(async (resolve, reject) => {
                if (confirm("Are you sure you want to delete this category?")) {
                    try {
                        const res = await fetch(`http://localhost:8000/api/admin/categories/delete/${id}`, {
                            method: "DELETE",
                            headers: {
                                "Accept": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                        });
                        const result = await res.json();
                        if (res.ok) {
                            setCategories(categories.filter(c => c.id !== id));
                            resolve(result.message || "Kategori berhasil dihapus!");
                        } else {
                            reject(result.message || "Gagal menghapus kategori");
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

    return (
        <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className='text-2xl mb-4 font-semibold'>{name_category ? name_category : 'Daftar Kategori'}</h3>
                <Link href="/categories/add">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xs">
                        + Tambahkan kategori baru
                    </button>
                </Link>
            </div>
            <Table>
                <TableCaption>A list of Categories</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name Category</TableHead>
                        <TableHead className='hidden md:table-cell'>Description</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) : categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">No data</TableCell>
                        </TableRow>
                    ) : (
                        categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.name_category}</TableCell>
                                <TableCell className='hidden md:table-cell'>
                                    {category.description}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={`/categories/edit/${category.id}`}>
                                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs'>
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs'
                                            onClick={() => handleDelete(category.id)}
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

export default CategoriesTable;