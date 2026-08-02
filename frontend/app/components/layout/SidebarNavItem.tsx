import { NavLink } from "react-router";
import type { NavItem } from "./navItems";
import { cn } from "~/lib/utils";
import { ChevronRight } from "lucide-react";

export function SidebarNavItem({ item }: { item: NavItem }) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-3 rounded-[0.5rem] px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                        ? "bg-[#f0ebff] text-[#6344f5] font-bold shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
            }
        >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.to !== "/dashboard" && (
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            )}
        </NavLink>
    );
}