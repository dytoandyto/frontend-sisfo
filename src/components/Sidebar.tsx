import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import {
    LayoutDashboard,
    Newspaper,
    Folders,
    CreditCard,
    User,
    SettingsIcon
} from "lucide-react"
import Link from "next/link";

const Sidebar = () => {
    return <Command className="bg-secondary rounded-none flex-1 overflow-visible ">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="overflow-visible ">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
                <CommandItem>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <Link href="/">Dashboard</Link>
                </CommandItem>
                <CommandItem>
                    <Newspaper className="mr-2 h-4 w-4" />
                    <Link href="/posts">Posts</Link>
                </CommandItem>
                <CommandItem>
                    <Folders className="mr-2 h-4 w-4" />
                    <Link href="/categories">Kategori</Link>
                </CommandItem>
                <CommandItem>
                    <Folders className="mr-2 h-4 w-4" />
                    <Link href="/barang">Barang</Link>
                </CommandItem>
                <CommandItem>
                    <Folders className="mr-2 h-4 w-4" />
                    <Link href="/peminjaman">Peminjaman</Link>
                </CommandItem>
                <CommandItem>
                    <Folders className="mr-2 h-4 w-4" />
                    <Link href="/pengembalian">Pengembalian</Link>
                </CommandItem>  
                <CommandItem>
                    <Folders className="mr-2 h-4 w-4" />
                    <Link href="/Users">Pengguna</Link>
                </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
                <CommandItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <CommandShortcut>ctrl + p</CommandShortcut>
                </CommandItem>
                <CommandItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                    <CommandShortcut>ctrl + b</CommandShortcut>
                </CommandItem>
                <CommandItem>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Setting</span>
                    <CommandShortcut>ctrl + s</CommandShortcut>
                </CommandItem>
            </CommandGroup>
        </CommandList>
    </Command>;
}

export default Sidebar;