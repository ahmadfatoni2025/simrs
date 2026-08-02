import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppShell } from "~/components/layout/AppShell";
import { StatGrid } from "~/dashboard/ui/StatGrid";
import { VisitsChart } from "~/dashboard/ui/VisitsChart";
import { RoomsCard } from "~/dashboard/ui/RoomsCard";
import { RecentPatientsTable } from "~/dashboard/ui/RecentPatientsTable";
import { api, getToken, type DashboardData } from "~/lib/api";

export default function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [state, setState] = useState<"loading" | "error" | "ready">("loading");
    const [error, setError] = useState("");

    async function load() {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        setState("loading");
        try {
            const payload = await api<{ data: DashboardData }>("/dashboard");
            setData(payload.data);
            setState("ready");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat dashboard.");
            setState("error");
        }
    }

    useEffect(() => {
        void load();
    }, [navigate]);

    if (state === "loading") {
        return (
            <AppShell>
                <div className="flex justify-center py-24">Memuat dashboard...</div>
            </AppShell>
        );
    }

    if (state === "error" || !data) {
        return (
            <AppShell>
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error || "Gagal memuat dashboard."}
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Ringkasan aktivitas rumah sakit hari ini
                    </p>
                </div>
                <button className="mt-4 sm:mt-0 bg-[#6344f5] hover:bg-[#5232e0] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                    + Daftar Pasien Baru
                </button>
            </div>

            <StatGrid stats={data.stats} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <VisitsChart data={data.weekly_visits} />
                <RoomsCard rooms={data.rooms} />
            </div>

            <RecentPatientsTable rows={data.recent_registrations} />
        </AppShell>
    );
}
