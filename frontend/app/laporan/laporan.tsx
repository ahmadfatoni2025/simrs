import { useState } from "react";
import { useSearchParams } from "react-router";
import {
    BarChart3,
    LayoutDashboard,
    FileText,
    Banknote,
    Activity,
    Boxes,
    Calendar,
    Download,
    Printer,
    Sparkles,
    Search
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

export type LaporanTab =
    | "dashboard"
    | "rl"
    | "keuangan"
    | "pelayanan"
    | "farmasi";

const MOCK_RL_REPORTS = [
    { code: "RL 1.1", name: "Data Dasar Rumah Sakit", status: "Siap Export", miring: "Format Kemenkes SIRS 2026" },
    { code: "RL 3.1", name: "Rekapitulasi Pelayanan Rawat Inap", status: "Siap Export", miring: "Format Kemenkes SIRS 2026" },
    { code: "RL 3.2", name: "Rekapitulasi Pelayanan Rawat Jalan", status: "Siap Export", miring: "Format Kemenkes SIRS 2026" },
    { code: "RL 4a", name: "Morbiditas Pasien Rawat Inap (10 Besar Penyakit)", status: "Siap Export", miring: "ICD-10 Categorized" },
    { code: "RL 5.1", name: "Pengunjung Rumah Sakit", status: "Siap Export", miring: "Demografi Pasien" },
];

export default function LaporanPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") || "dashboard") as LaporanTab;

    const setTab = (tab: string) => {
        if (tab === "dashboard") setSearchParams({});
        else setSearchParams({ tab });
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Laporan & Analitik RS
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                                <BarChart3 className="h-3.5 w-3.5" /> Pelaporan Kemenkes SIRS RL
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Pusat Pelaporan Wajib SIRS Kemenkes (RL 1.1 - 5.4), Laporan Keuangan, Morbiditas & Kunjungan.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>05 Oktober 2026</span>
                    </div>
                </div>

                {/* Sub-menu Tabs */}
                <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200/60 shadow-inner overflow-x-auto scrollbar-none">
                    {[
                        { id: "dashboard", label: "Pusat Laporan & Dashboard", icon: LayoutDashboard },
                        { id: "rl", label: "Laporan Wajib RL (1.1 - 5.4)", icon: FileText },
                        { id: "keuangan", label: "Laporan Keuangan & Kasir", icon: Banknote },
                        { id: "pelayanan", label: "Laporan Kunjungan Pelayanan", icon: Activity },
                        { id: "farmasi", label: "Laporan Farmasi & Inventori", icon: Boxes },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = activeTab === tab.id || (activeTab === ("" as any) && tab.id === "dashboard");
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                                    isSelected
                                        ? "bg-white text-blue-700 shadow-sm font-bold"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* TAB CONTENT: RL REPORTS & DASHBOARD */}
                {(activeTab === "rl" || activeTab === "dashboard" || !searchParams.get("tab")) && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900">
                                    Format Laporan Wajib SIRS Kemenkes RL (Rekapitulasi Laporan)
                                </h3>
                                <button onClick={() => alert("Mengunduh semua file Laporan RL Kemenkes format Excel/CSV")} className="text-xs font-bold text-blue-600 flex items-center gap-1">
                                    <Download className="h-3.5 w-3.5" /> Export Excel
                                </button>
                            </div>

                            <div className="space-y-3">
                                {MOCK_RL_REPORTS.map((rl) => (
                                    <div key={rl.code} className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{rl.code}</span>
                                                <h4 className="text-xs font-bold text-slate-900">{rl.name}</h4>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{rl.miring}</p>
                                        </div>

                                        <button
                                            onClick={() => alert(`Mengunduh berkas laporan Kemenkes ${rl.code}`)}
                                            className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                                        >
                                            Unduh Format SIRS
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
