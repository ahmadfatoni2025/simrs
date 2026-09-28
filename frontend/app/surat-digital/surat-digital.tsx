import { useState } from "react";
import { useSearchParams } from "react-router";
import {
    FileText,
    Plus,
    Printer,
    Search,
    Filter,
    CheckCircle2,
    Calendar,
    UserCheck,
    Stethoscope,
    HeartPulse,
    Download
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

export default function SuratDigitalPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get("tab") || "sakit";
    const [search, setSearch] = useState("");

    const tabs = [
        { id: "sakit", label: "Surat Keterangan Sakit", icon: FileText },
        { id: "dirawat", label: "Surat Keterangan Dirawat", icon: HeartPulse },
        { id: "kontrol", label: "Surat Kontrol Rawat Inap/Poli", icon: Calendar },
        { id: "kematian", label: "Surat Kematian", icon: FileText },
        { id: "sehat", label: "Surat Keterangan Sehat", icon: UserCheck },
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
                                <FileText className="h-4 w-4" /> Modul Surat & Dokumen Digital
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Manajemen Surat Digital & Sertifikasi Medis</h1>
                            <p className="mt-1 text-xs text-blue-100 max-w-2xl">
                                Pusat penerbitan, verifikasi tanda tangan elektronik (TTE), dan pencetakan surat medis resmi pasien rumah sakit.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-all shadow-md active:scale-98"
                            >
                                <Plus className="h-4 w-4" /> Buat Surat Medis Baru
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

                {/* Content Area */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari No. Surat, Nama Pasien, Dokter..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>
                        <button type="button" className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                            <Filter className="h-3.5 w-3.5 text-slate-500" /> Filter Tanggal
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">No. Surat</th>
                                    <th className="px-4 py-3">Nama Pasien & RM</th>
                                    <th className="px-4 py-3">Dokter Penanggung Jawab</th>
                                    <th className="px-4 py-3">Tanggal Terbit</th>
                                    <th className="px-4 py-3">Status TTE</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/80 text-slate-700 font-medium">
                                {[
                                    { no: "SKD/2026/09/001", nama: "Anisa Rahma", rm: "RM-8821", dokter: "dr. Andi Wijaya, Sp.PD", tanggal: "28/09/2026", tte: "Terverifikasi TTE" },
                                    { no: "SKD/2026/09/002", nama: "Bambang Kurniawan", rm: "RM-8822", dokter: "dr. Rina Astuti, Sp.A", tanggal: "27/09/2026", tte: "Terverifikasi TTE" },
                                ].map((row) => (
                                    <tr key={row.no} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3 font-bold text-slate-900">{row.no}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-slate-900">{row.nama}</div>
                                            <div className="text-[11px] text-slate-400">{row.rm}</div>
                                        </td>
                                        <td className="px-4 py-3 font-semibold">{row.dokter}</td>
                                        <td className="px-4 py-3 text-slate-500">{row.tanggal}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                                                <CheckCircle2 className="h-3 w-3" /> {row.tte}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                                            <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                                <Printer className="h-3 w-3 text-slate-500" /> Cetak
                                            </button>
                                            <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                                                <Download className="h-3 w-3" /> PDF
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
