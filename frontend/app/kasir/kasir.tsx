import { useState } from "react";
import { useSearchParams } from "react-router";
import {
    Banknote,
    Receipt,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    Plus,
    Printer,
    Building2,
    ShieldCheck,
    CreditCard,
    FileSpreadsheet,
    Scale,
    TrendingUp
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

export default function KasirPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get("tab") || "pembayaran";
    const [search, setSearch] = useState("");

    const tabs = [
        { id: "pembayaran", label: "Pembayaran & Billing Kasir", icon: Receipt },
        { id: "deposit", label: "Deposit Pasien", icon: Wallet },
        { id: "buka-tutup", label: "Buka / Tutup Kasir", icon: Clock },
        { id: "bendahara", label: "Penerimaan & Pengeluaran Kas", icon: Banknote },
        { id: "akuntansi", label: "Jurnal & Buku Besar", icon: Scale },
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
                                <Banknote className="h-4 w-4" /> Modul Keuangan & Kasir SIMRS
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Manajemen Kasir, Billing & Akuntansi RS</h1>
                            <p className="mt-1 text-xs text-blue-100 max-w-2xl">
                                Pusat transaksi billing pasien, arus kas deposit, penerimaan kasir, jurnal otomatis, dan rekapitulasi buku besar rumah sakit.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all shadow-2xs backdrop-blur-xs"
                            >
                                <Printer className="h-4 w-4" /> Cetak Rekap Shift
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-all shadow-md active:scale-98"
                            >
                                <Plus className="h-4 w-4" /> Transaksi Kasir Baru
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistik Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Pendapatan Hari Ini</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <ArrowDownLeft className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-3 text-xl font-extrabold text-slate-900">Rp 48.750.000</p>
                        <p className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> +14.2% dari kemarin
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Pending Billing Pasien</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-3 text-xl font-extrabold text-slate-900">18 Pasien</p>
                        <p className="mt-1 text-[11px] text-slate-400 font-medium">Menunggu verifikasi pembayaran</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Total Deposit Pasien</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Wallet className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-3 text-xl font-extrabold text-slate-900">Rp 125.400.000</p>
                        <p className="mt-1 text-[11px] text-slate-400 font-medium">Rawat Inap & Tindakan MCU</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Status Shift Kasir</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-3 text-xl font-extrabold text-slate-900">Shift 1 (Aktif)</p>
                        <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Kasir: Siti Rahmawati, S.E.</p>
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

                {/* Main Content Area */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
                    {/* Search & Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari No. Billing, Nama Pasien, No RM..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button type="button" className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                <Filter className="h-3.5 w-3.5 text-slate-500" /> Filter Status
                            </button>
                            <button type="button" className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" /> Export Excel
                            </button>
                        </div>
                    </div>

                    {/* Table List Billing Pasien */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">No. Kwitansi / Billing</th>
                                    <th className="px-4 py-3">Pasien & No RM</th>
                                    <th className="px-4 py-3">Layanan / Poli</th>
                                    <th className="px-4 py-3">Penjamin</th>
                                    <th className="px-4 py-3">Total Biaya</th>
                                    <th className="px-4 py-3">Metode Bayar</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/80 text-slate-700 font-medium">
                                {[
                                    { id: "INV-2026-0901", rm: "RM-9941", nama: "Budi Santoso", layanan: "Poli Penyakit Dalam", penjamin: "BPJS Kesehatan", total: 450000, metode: "BPJS (Klaim)", status: "Lunas" },
                                    { id: "INV-2026-0902", rm: "RM-9942", nama: "Siti Aminah", layanan: "Rawat Inap Bed 3A", penjamin: "Umum / Tunai", total: 3250000, metode: "QRIS", status: "Lunas" },
                                    { id: "INV-2026-0903", rm: "RM-9943", nama: "Ahmad Dahlan", layanan: "Laboratorium & Radiologi", penjamin: "Asuransi Mandiri", total: 820000, metode: "Transfer Bank", status: "Pending" },
                                    { id: "INV-2026-0904", rm: "RM-9944", nama: "Dewi Lestari", layanan: "Poli Kebidanan", penjamin: "Umum / Tunai", total: 275000, metode: "Tunai", status: "Lunas" },
                                ].map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3 font-bold text-slate-900">{row.id}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-slate-900">{row.nama}</div>
                                            <div className="text-[11px] text-slate-400">{row.rm}</div>
                                        </td>
                                        <td className="px-4 py-3">{row.layanan}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                                                <ShieldCheck className="h-3 w-3 text-blue-600" /> {row.penjamin}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-slate-900">
                                            Rp {row.total.toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-4 py-3 text-xs">{row.metode}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize",
                                                row.status === "Lunas" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                            )}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                                <Printer className="h-3 w-3 text-slate-500" /> Detail
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
