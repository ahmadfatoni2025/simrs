import { SidebarBrand } from "./SidebarBrand";
import { SidebarNav } from "./SidebarNav";
import { SidebarProfile } from "./SidebarProfile";

export function Sidebar() {
    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-white border-r border-slate-200/70 text-slate-700 lg:flex">
            <SidebarBrand />
            <SidebarNav />
            <SidebarProfile />
        </aside>
    );
}