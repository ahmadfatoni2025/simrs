import { useState } from "react";
import { Link } from "react-router";
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Search,
    ShieldCheck,
    Users,
} from "lucide-react";
import { pendaftaranCategories } from "./ui/PendaftaranCategoryNav";

export default function PendaftaranIndex() {
    const [searchQuery, setSearchQuery] = useState("");

    const categoriesWithItems = pendaftaranCategories.filter((c) => c.key !== "portal");

    const filteredCategories = categoriesWithItems
        .map((cat) => ({
            ...cat,
            filteredItems: cat.items.filter(
                (item) =>
                    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((cat) => cat.filteredItems.length > 0);

    return (
        <div className="space-y-6">
            {/* Banner Header Portal */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 md:p-8 text-white shadow-xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 -mb-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative z-10 max-w-3xl space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md">
                        <Users className="h-3.5 w-3.5" />
                        <span>Modul Pendaftaran Pasien & Admisi</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        Pusat Layanan Pendaftaran Pasien SIMRS
                    </h1>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Akses cepat dan terstruktur untuk semua fitur registrasi, antrean, validasi penjamin, bridging BPJS/SATUSEHAT, dokumen kunjungan, dan operasional admisi.
                    </p>

                    {/* Search Bar Feature */}
                    <div className="pt-2">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari fitur pendaftaran (cth: Antrean, BPJS, Registrasi Baru)..."
                                className="w-full rounded-2xl bg-slate-800/90 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 border border-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Stat Pill Highlights */}
                <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-slate-800 pt-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400">Status BPJS</p>
                            <p className="text-sm font-bold text-white">Bridging Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400">Antrean Aktif</p>
                            <p className="text-sm font-bold text-white">42 Pasien</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400">Registrasi Hari Ini</p>
                            <p className="text-sm font-bold text-white">128 Pasien</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400">Bridging SATUSEHAT</p>
                            <p className="text-sm font-bold text-white">Terhubung</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categorized Features Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Kategori Fitur Pendaftaran</h2>
                        <p className="text-xs text-slate-500">Pilih kategori atau sub-fitur di bawah ini untuk memulai operasional</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                        {filteredCategories.length} Kategori Ditemukan
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.key}
                            className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:border-sky-300 hover:shadow-md transition-all duration-200"
                        >
                            <div>
                                {/* Category Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                                            <category.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                                                {category.label}
                                            </h3>
                                            <p className="text-[11px] text-slate-400">
                                                {category.filteredItems.length} Sub-fitur
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to={category.defaultTo}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                                        title={`Buka ${category.label}`}
                                    >
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                {/* List of Sub-features inside Category */}
                                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                                    {category.filteredItems.map((item) => (
                                        <Link
                                            key={item.to}
                                            to={item.to}
                                            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-sky-50/80 hover:text-sky-700 transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <item.icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                <span className="truncate">{item.label}</span>
                                            </div>
                                            <ArrowRight className="h-3 w-3 shrink-0 text-slate-300" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Footer link to default feature */}
                            <div className="mt-4 pt-3 border-t border-slate-100">
                                <Link
                                    to={category.defaultTo}
                                    className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-900 hover:text-white transition-all"
                                >
                                    <span>Buka Fitur Utamanya</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
