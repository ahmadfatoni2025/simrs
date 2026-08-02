import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans antialiased">
            <Sidebar />
            <div className="lg:pl-64">
                <main className="space-y-6 p-4 lg:p-8 max-w-7xl mx-auto">{children}</main>
            </div>
        </div>
    );
}