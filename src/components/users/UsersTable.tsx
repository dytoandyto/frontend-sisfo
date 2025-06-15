"use client"

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
import { toast } from "sonner";

interface User {
    role: string;
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface UsersTableProps {
    limit?: number;
    title?: string;
}

const UsersTable = ({ limit, title }: UsersTableProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    // Ambil data user dari backend
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://127.0.0.1:8000/api/admin/users", {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                // Terbaru di atas, terlama di bawah
                const sorted = limit ? data.slice(0, limit) : data;
                setUsers(sorted.reverse());
            } catch (e) {
                toast.error("Gagal mengambil data user");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [limit]);

    // Hapus user ke backend
    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("token");
        toast.promise(
            new Promise(async (resolve, reject) => {
                if (confirm("Are you sure you want to delete this user?")) {
                    try {
                        // Ganti method sesuai backend kamu (POST/DELETE)
                        const res = await fetch(`http://127.0.0.1:8000/api/admin/users/delete/${id}`, {
                            method: "DELETE", // Ganti ke "DELETE" jika backend pakai DELETE
                            headers: {
                                "Accept": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                        });
                        const result = await res.json();
                        if (res.ok) {
                            setUsers(users.filter(u => u.id !== id));
                            resolve(result.message || "User berhasil dihapus!");
                        } else {
                            reject(result.message || "Gagal menghapus user");
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
                <h3 className="text-2xl font-semibold">{title ? title : 'Daftar Pengguna'}</h3>
                <Link href="/Users/add">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xs">
                        + Tambahkan pengguna
                    </button>
                </Link>
            </div>
            <Table>
                <TableCaption>A list of recent users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className='hidden md:table-cell'>Created At</TableHead>
                        <TableHead>View</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) : users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">No data</TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell className='hidden md:table-cell'>{user.created_at}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={`/Users/edit/${user.id}`}>
                                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs'>
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs'
                                            onClick={() => handleDelete(user.id)}
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
}

export default UsersTable;