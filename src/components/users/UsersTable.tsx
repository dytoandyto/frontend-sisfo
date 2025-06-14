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
import clients from "@data/users";
import { Client } from "../../../types/users";

interface UsersTableProps {
    limit?: number;
    title?: string;
}

const UsersTable = ({ limit, title }: UsersTableProps) => {
    // Urutkan data users dari yang terbaru
    const sortedUsers: Client[] = [...clients].sort(
        (a, b) => new Date(b.created_at ?? '').getTime() - new Date(a.created_at ?? '').getTime()
    );
    // Batasi data users jika ada limit
    const filteredUsers = limit ? sortedUsers.slice(0, limit) : sortedUsers;

    return (
        <div className="mt-10">
            <h3 className="text-2xl mb-4 font-semibold">{title ? title : 'Users'}</h3>
            <Table>
                <TableCaption>A list of recent users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className='hidden md:table-cell'>Created At</TableHead>
                        <TableHead>View</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className='hidden md:table-cell'>{user.created_at}</TableCell>
                            <TableCell>
                                <Link href={`/Users/edit/${user.id}`}>
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
}

export default UsersTable;