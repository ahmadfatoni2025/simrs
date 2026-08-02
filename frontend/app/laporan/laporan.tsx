import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppShell } from "~/components/layout/AppShell";
import { RecentPatientsTable } from "~/components/dashboard/RecentPatientsTable";
import { RoomsCard } from "~/components/dashboard/RoomsCard";
import { StatGrid } from "~/components/dashboard/StatGrid";
import { Card } from "~/components/ui/Card";
import { api, getToken, type DashboardData } from "~/lib/api";

export default function LaporanPage() {
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        api<{ data: DashboardData }>("/dashboard")
            .then((r) => setData(r.data))
            .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat laporan."));
    }, [navigate]);

    return (
        <AppShell>
            <Card>
                <div className="px-6 pt-6">
                    <h1 className="text-lg font-bold text-slate-900">Laporan</h1>
                    <p className="text-xs text-slate-500">Ringkasan operasional rumah sakit</p>
                </div>
            </Card>
            {error ? (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
            ) : data ? (
                <>
                    <StatGrid stats={data.stats} />
                    <RoomsCard rooms={data.rooms} />
                    <RecentPatientsTable rows={data.recent_registrations} />
                </>
            ) : (
                <p className="py-24 text-center text-sm text-slate-500">Menyiapkan laporan...</p>
            )}
        </AppShell>
    );
}
