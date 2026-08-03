import type { ReactNode } from "react";
import { useState } from "react";
import { Menu, PanelLeftOpen } from "lucide-react";
import { Sidebar } from "./sidebar";
import { cn } from "~/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans antialiased">
            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onToggle={() => setCollapsed((c) => !c)}
                onCloseMobile={() => setMobileOpen(false)}
            />

            {/* Hamburger untuk mobile */}
            <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:hidden"
                title="Buka menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Tombol perluas: tampil saat sidebar di-collapse (desktop) */}
            {collapsed && (
                <button
                    type="button"
                    onClick={() => setCollapsed(false)}
                    className="fixed top-1/2 left-16 z-30 hidden h-12 w-8 -translate-y-1/2 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-lg transition-colors hover:bg-gray-50 hover:text-indigo-600 lg:flex"
                    title="Perluas sidebar"
                >
                    <PanelLeftOpen className="h-4 w-4" />
                </button>
            )}

            <div
                className={cn(
                    "transition-all duration-300",
                    collapsed ? "lg:pl-[76px]" : "lg:pl-64"
                )}
            >
                <main className="space-y-6 p-4 lg:p-8 max-w-7xl mx-auto">{children}</main>
            </div>
        </div>
    );
}