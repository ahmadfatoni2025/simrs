import { useState } from "react";
import { useSearchParams } from "react-router";
import {
    Boxes,
    Package,
    Truck,
    ClipboardCheck,
    ArrowLeftRight,
    FileSpreadsheet,
    Search,
    Filter,
    Plus,
    CheckCircle2,
    Clock,
    AlertTriangle,
    PillBottle,
    Building2,
    Printer
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

export default function InventoryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get("tab") || "stok";
    const [search, setSearch] = useState("");

    const tabs = [
        { id: "stok", label: "Katalog & Stok Logistik", icon: Boxes },
        { id: "pemesanan", label: "Pemesanan Barang (PO)", icon: Truck },
        { id: "penerimaan", label: "Penerimaan & SP", icon: ClipboardCheck },
        { id: "distribusi", label: "Permintaan & Distribusi Unit", icon: ArrowLeftRight },
        { id: "opname", label: "Stok Opname & Kartu Stok", icon: FileSpreadsheet },
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
                                <Boxes className="h-4 w-4" /> Modul Logistik & Inventori SIMRS
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Manajemen Inventory & Gudang Logistik</h1>
                            <p className="mt-1 text-xs text-blue-100 max-w-2xl">
                                Kelola rantai pasok barang medis, non-medis, gizi, pemesanan ke vendor (PBF/Supplier), penerimaan, dan distribusi ke unit pelayanan.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all shadow-2xs backdrop-blur-xs"
                            >
                                <Printer className="h-4 w-4" /> Cetak Kartu Stok
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-all shadow-md active:scale-98"
                            >
                                <Plus className="h-4 w-4" /> Pemesanan Barang Baru
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistik Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Total Item Barang</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Boxes className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-3 text-xl font-extrabold text-slate-900">2.480 Item</p>
                        <p className="mt-1 text-[11px] text-slate-400 font-medium">Farmasi, Gizi & RT</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Peringatan Stok Minimum</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-3 text-xl font-extrabold text-amber-600">14 Item</p>
                        <p className="mt-1 text-[11px] text-amber-600 font-semibold">Perlu restock segera</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">PO Menunggu Supplier</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                                <Truck className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-3 text-xl font-extrabold text-slate-900">6 Pesanan</p>
                        <p className="mt-1 text-[11px] text-slate-400 font-medium">Pengiriman dari PBF/Supplier</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Permintaan Unit Masuk</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <ArrowLeftRight className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-3 text-xl font-extrabold text-slate-900">9 Permintaan</p>
                        <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Ruang Ranap & Poli</p>
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

                {/* Table Area */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari Kode Barang, Nama Item, Supplier..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                <Filter className="h-3.5 w-3.5 text-slate-500" /> Kategori Barang
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Kode Item</th>
                                    <th className="px-4 py-3">Nama Barang</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Satuan</th>
                                    <th className="px-4 py-3">Stok Gudang</th>
                                    <th className="px-4 py-3">Stok Min</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/80 text-slate-700 font-medium">
                                {[
                                    { kode: "BRG-001", nama: "Paracetamol 500mg Tab", kat: "Barang Farmasi", satuan: "Strip", stok: 1200, min: 200, status: "Aman" },
                                    { kode: "BRG-002", nama: "Spuit 3cc Terumo", kat: "Alkes / Logistik", satuan: "Pcs", stok: 45, min: 100, status: "Stok Menipis" },
                                    { kode: "BRG-003", nama: "Cefotaxime 1g Inj", kat: "Barang Farmasi", satuan: "Vial", stok: 350, min: 50, status: "Aman" },
                                    { kode: "BRG-004", nama: "Kertas EKG 3 Channel", kat: "Rumah Tangga", satuan: "Roll", stok: 12, min: 20, status: "Stok Menipis" },
                                ].map((row) => (
                                    <tr key={row.kode} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3 font-bold text-slate-900">{row.kode}</td>
                                        <td className="px-4 py-3 font-bold text-slate-900">{row.nama}</td>
                                        <td className="px-4 py-3">{row.kat}</td>
                                        <td className="px-4 py-3">{row.satuan}</td>
                                        <td className="px-4 py-3 font-bold text-slate-900">{row.stok}</td>
                                        <td className="px-4 py-3 text-slate-400">{row.min}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize",
                                                row.status === "Aman" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                            )}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                                Mutasi Unit
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
