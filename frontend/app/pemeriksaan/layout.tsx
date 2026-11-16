import { Outlet } from "react-router";
import { AppShell } from "~/components/layout/AppShell";
import PemeriksaanNav from "./PemeriksaanNav";

export default function PemeriksaanLayout() {
    return (
        <AppShell>
            <div className="space-y-6">
                <PemeriksaanNav />
                <div className="min-w-0 flex-1">
                    <Outlet />
                </div>
            </div>
        </AppShell>
    );
}
