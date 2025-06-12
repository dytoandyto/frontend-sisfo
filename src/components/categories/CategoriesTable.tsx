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
import categories from "../../../data/categories";
import { Categories } from "../../../types/categories";

interface CategoriesTableProps {
    limit?: number;
    name?: string;
}

const CategoriesTable = ({ limit, name }: CategoriesTableProps) => {
    // mengurutkan data categoriess berdasarkan tanggal
    const sortedcategories: Categories[] = [...categories].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Filter categoriess to limit
    const filteredcategories = limit ? sortedcategories.slice(0, limit) : sortedcategories;

    return (
        <div className='mt-10'>
            <h3 className='text-2xl mb-4 font-semibold'>{name ? name : 'categoriess'}</h3>
            <Table>
                <TableCaption>A list of Categories</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className='hidden md:table-cell'></TableHead>
                        <TableHead className='hidden md:table-cell text-right'>
                            Date
                        </TableHead>
                        <TableHead>View</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredcategories.map((categories) => (
                        <TableRow key={categories.id}>
                        <TableCell>{categories.name}</TableCell>
                            <TableCell className='hidden md:table-cell'>
                            </TableCell>
                            <TableCell className='text-right hidden md:table-cell'>
                                {categories.date}
                            </TableCell>
                            <TableCell>
                                <Link href={`/categoriess/edit/${categories.id}`}>
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

export default CategoriesTable;
