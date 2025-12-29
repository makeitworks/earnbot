
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"


export function UserMenu() {
    function logout() {
        localStorage.removeItem("token");
        window.location.reload();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
                👤
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}