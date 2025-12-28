
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


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
                <DropdownMenuItem>profile</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}