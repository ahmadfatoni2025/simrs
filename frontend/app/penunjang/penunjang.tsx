import { useState } from "react";
import { useSearchParams } from "react-router";
import {
    FlaskConical,
    FileText,
    Activity,
    Stethoscope,
    Search,
    Filter,
    Printer,
    Plus,
    Clock,
    CheckCircle2,
    Calendar,
    Syringe,
    ExternalLink
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

export default function PenunjangPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get("tab") || "laboratorium";
    const [search, setSearch] = useState("");

    const tabs = [
        { id: "laboratorium", label: "Laboratorium Patologi & Darah", icon: FlaskConical },
        { id: "radiologi", label: "Radiologi (X-Ray, CT, USG, MRI)", icon: FileText },
        { id: "rehab-medik", label: "Rehab Medik & FISIO", icon: Activity },
        { id: "mcu", label: "Paket MCU (Medical Check Up)", icon: Stethoscope },
        { id: "operasi", label: "Jadwal & Order Operasi (OK)", icon: Syringe },
    ];

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white shadow-lg">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">
                                <FlaskConical className="h-4 w-4" /> Modul Layanan Penunjang Medis SIMRS
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Pemeriksaan Penunjang Medis & Laboratorium</h1>
                            <p className="mt-1 text-xs text-blue-100 max-w-2xl">
                                Kelola order sampel laboratorium, hasil tes expertise radiologi, rehabilitasi medik, pemeriksaan MCU, serta antrean jadwal bedah operasi.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-all shadow-md active:scale-98"
                            >
                                <Plus className="h-4 w-4" /> Order Penunjang Baru
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = currentTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setSearchParams({ tab: tab.id })}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Main Area */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari No. Order, Pasien, Parameter Tes..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>
                        <button type="button" className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                            <Filter className="h-3.5 w-3.5 text-slate-500" /> Filter Status Sampel
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">No. Order</th>
                                    <th className="px-4 py-3">Pasien & No RM</th>
                                    <th className="px-4 py-3">Asal Poli / Bangsal</th>
                                    <th className="px-4 py-3">Item Pemeriksaan</th>
                                    <th className="px-4 py-3">Status Hasil</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/80 text-slate-700 font-medium">
                                {[
                                    { order: "ORD-LAB-901", nama: "Siti Rahma", rm: "RM-7011", asal: "Poli Dalam (dr. Andi)", item: "Darah Lengkap, SGOT, SGPT", status: "Selesai (Expertise)" },
                                    { order: "ORD-LAB-902", nama: "Dedi Supriyadi", rm: "RM-7012", asal: "IGD Emergency", item: "Foto Thorax PA (Radiologi)", status: "Proses Pembacaan" },
                                    { order: "ORD-LAB-903", nama: "Nurul Hidayah", rm: "RM-7013", asal: "Rawat Inap Bed 4B", item: "Tes Urine & Elektrolit", status: "Proses Sampel" },
                                ].map((row) => (
                                    <tr key={row.order} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3 font-bold text-slate-900">{row.order}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-slate-900">{row.nama}</div>
                                            <div className="text-[11px] text-slate-400">{row.rm}</div>
                                        </td>
                                        <td className="px-4 py-3">{row.asal}</td>
                                        <td className="px-4 py-3 font-semibold">{row.item}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize",
                                                row.status.includes("Selesai") ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                            )}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                                <Printer className="h-3 w-3 text-slate-500" /> Hasil & Expertise
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
