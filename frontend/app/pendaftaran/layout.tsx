import { Outlet } from "react-router";
import { AppShell } from "~/components/layout/AppShell";

export default function PendaftaranLayout() {
    return (
        <AppShell>
            <div className="min-w-0 flex-1">
                <Outlet />
            </div>
        </AppShell>
    );
}


