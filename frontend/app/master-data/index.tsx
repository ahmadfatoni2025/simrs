import { useState } from "react";
import { Link } from "react-router";
import {
    ArrowRight,
    Boxes,
    Building2,
    Database,
    FileText,
    FlaskConical,
    HeartPulse,
    Layers,
    Package,
    PillBottle,
    Search,
    ShieldCheck,
    Stethoscope,
    Users,
    Wallet,
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { masterEntities } from "./masterDataConfig";
import { cn } from "~/lib/utils";

const CATEGORIES = [
    { key: "all", label: "Semua Katalog" },
    { key: "farmasi", label: "Farmasi & Logistik" },
    { key: "pelayanan", label: "Pelayanan & Medis" },
    { key: "pendaftaran", label: "Pendaftaran & Pasien" },
    { key: "sdm", label: "SDM & Organisasi" },
    { key: "keuangan", label: "Keuangan & Akuntansi" },
    { key: "lainnya", label: "Diagnosa & Wilayah" },
] as const;

export default function MasterDataIndex() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const filteredEntities = masterEntities.filter((item) => {
        const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
            item.key.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Banner Header Master Data */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 md:p-8 text-white shadow-xl">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md border border-sky-500/30">
                            <Database className="h-3.5 w-3.5" />
                            <span>Pusat Katalog & Referensi Master Data SIMRS</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Manajemen Master Data Terpadu
                        </h1>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Kelola seluruh referensi data farmasi, tarif pelayanan, data pasien, tenaga medis, kamar perawatan, akun akuntansi, hingga pengkodean ICD-10 secara terpusat.
                        </p>

                        {/* Search Bar Feature */}
                        <div className="pt-2">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari master data (cth: Obat, Tarif, Kamar, Pegawai, ICD X)..."
                                    className="w-full rounded-2xl bg-slate-800/90 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 border border-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Stat Pill Highlights */}
                    <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-slate-800 pt-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                                <Layers className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-slate-400">Total Katalog Master</p>
                                <p className="text-sm font-bold text-white">{masterEntities.length} Entitas Data</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                                <PillBottle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-slate-400">Katalog Farmasi</p>
                                <p className="text-sm font-bold text-white">12 Modul</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                                <Stethoscope className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-slate-400">Pelayanan & Tarif</p>
                                <p className="text-sm font-bold text-white">15 Modul</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-slate-400">Status Validasi</p>
                                <p className="text-sm font-bold text-white">Terintegrasi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs & Counter */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.key}
                                type="button"
                                onClick={() => setSelectedCategory(cat.key)}
                                className={cn(
                                    "rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shadow-2xs",
                                    selectedCategory === cat.key
                                        ? "bg-slate-900 text-white"
                                        : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                        Menampilkan <strong>{filteredEntities.length}</strong> entitas master data
                    </span>
                </div>

                {/* Master Data Grid Catalog */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEntities.map((item) => (
                        <div
                            key={item.key}
                            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md transition-all hover:border-slate-300"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 border border-slate-200/60">
                                        {item.category ?? "master"}
                                    </span>
                                    <span className="text-[11px] font-mono font-semibold text-slate-400">
                                        {item.fields.length} Kolom Input
                                    </span>
                                </div>

                                <h3 className="mt-3 text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="mt-1 text-xs font-medium text-slate-500 leading-relaxed">
                                    {item.subtitle || "Kelola referensi data master sistem RS."}
                                </p>
                            </div>

                            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-700 transition-colors">
                                    {item.searchable?.join(" · ") || "Master Catalog"}
                                </span>
                                <Link
                                    to={`/master-data/${item.key}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-sky-600 transition-colors"
                                >
                                    Kelola Data <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
