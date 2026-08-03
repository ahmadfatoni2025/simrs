import { Outlet } from "react-router";
import { AppShell } from "~/components/layout/AppShell";

export default function PendaftaranLayout() {
    return (
        <AppShell>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start">

                {/* ── Konten fitur ── */}
                <div className="min-w-0 flex-1">
                    <Outlet />
                </div>
            </div>
        </AppShell>
    );
}
