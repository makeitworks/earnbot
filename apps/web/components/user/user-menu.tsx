
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StateKeys } from "@/lib/state-key";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link"


export function UserMenu() {
    const queryClient = useQueryClient();

    function logout() {
        localStorage.removeItem("token");
        
        queryClient.removeQueries({ queryKey: [StateKeys.USER_DATA]});

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