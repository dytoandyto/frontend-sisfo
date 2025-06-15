"use client"

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ThemeToggler from "@/components/ThemeToggler";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter();

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
            await fetch("http://localhost:8000/api/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            // Optional: handle error
        }
        localStorage.removeItem("token");
        router.push("/auth");
    };
    return (
        <div className='bg-primary dark:bg-slate-700 text-white py-2 px-5 flex justify-between'>
            <Link href='/'>
                <Image src="/logo.png" alt="ini logo" width={40} height={40} />
            </Link>

            <div className="flex items-center">
                <ThemeToggler />
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback className='text-black'>BT</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default Navbar;