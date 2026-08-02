import { navItems } from "./navItems";
import { SidebarNavItem } from "./SidebarNavItem";

export function SidebarNav() {
    return (
        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
            {navItems.map((item) => (
                <SidebarNavItem key={item.to} item={item} />
            ))}
        </nav>
    );
}