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
import items from "../../../data/items";
import { Item } from "../../../types/items";

interface ItemsTableProps {
    limit?: number;
    category?: string;
}

const ItemsTable = ({ limit, category }: ItemsTableProps) => {
    // Urutkan data berdasarkan tanggal
    const sortedItems: Item[] = [...items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Filter berdasarkan kategori jika ada
    const filteredItems = category
        ? sortedItems.filter((item) => item.item_category === category)
        : sortedItems;

    // Batasi jumlah item jika ada limit
    const displayedItems = limit ? filteredItems.slice(0, limit) : filteredItems;

    return (
        <div className="mt-10">
            <h3 className="text-2xl mb-4 font-semibold">
                {displayedItems.length > 0 ? "Items" : "No Items"}
            </h3>
            <Table>
                <TableCaption>A list of Items</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Item Code</TableHead>
                        <TableHead className="hidden md:table-cell">Name</TableHead>
                        <TableHead className="hidden md:table-cell">Brand</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead className="hidden md:table-cell">Quantity</TableHead>
                        <TableHead className="hidden md:table-cell text-right">
                            Created At
                        </TableHead>
                        <TableHead>View</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayedItems.map((item, idx) => (
                        <TableRow key={item.item_code}>
                            <TableCell>{idx + 1}</TableCell>
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
                            <TableCell className="hidden md:table-cell text-right">
                                {item.createdAt}
                            </TableCell>
                            <TableCell>
                                <Link href={`/barang/edit/${item.item_code}`}>
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs">
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

export default ItemsTable;