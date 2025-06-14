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
    name_category?: string;
}

const CategoriesTable = ({ limit, name_category }: CategoriesTableProps) => {
    // Urutkan data categories berdasarkan tanggal
    const sortedCategories: Categories[] = [...categories].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Batasi jumlah categories jika ada limit
    const filteredCategories = limit ? sortedCategories.slice(0, limit) : sortedCategories;

    return (
        <div className='mt-10'>
            <h3 className='text-2xl mb-4 font-semibold'>{name_category ? name_category : 'Categories'}</h3>
            <Table>
                <TableCaption>A list of Categories</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name Category</TableHead>
                        <TableHead className='hidden md:table-cell'>Description</TableHead>
                        <TableHead className='hidden md:table-cell text-right'>Date</TableHead>
                        <TableHead>View</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell>{category.name_category}</TableCell>
                            <TableCell className='hidden md:table-cell'>
                                {category.description}
                            </TableCell>
                            <TableCell className='text-right hidden md:table-cell'>
                                {category.date}
                            </TableCell>
                            <TableCell>
                                <Link href={`/categories/edit/${category.id}`}>
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