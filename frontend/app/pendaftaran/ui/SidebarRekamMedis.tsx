import { useEffect, useState } from "react";
import {
    ChevronDown,
    Filter,
    Plus,
    RefreshCw,
    Search,
    User,
} from "lucide-react";
import { api } from "~/lib/api";

interface PasienRM {
    id: number;
    no_rekam_medis?: string;
    nama?: string;
    nama_pasien?: string;
    jenis_kelamin?: string;
    tanggal_lahir?: string;
    no_bpjs?: string;
    alamat?: string;
    no_telepon?: string;
    umur?: string;
    [key: string]: unknown;
}

type SidebarTab = "REKAM_MEDIS" | "BOOKING" | "LOKET_CALL";

interface SidebarRekamMedisProps {
    onSelectPasien?: (pasien: PasienRM) => void;
}

function formatAge(tanggalLahir: string | undefined): string {
    if (!tanggalLahir) return "-";
    const birth = new Date(tanggalLahir);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) {
        months--;
        days += 30;
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    return `${years} th ${months} bl ${days} hr`;
}

function getGenderLabel(jk: string | undefined): string {
    if (!jk) return "-";
    if (jk === "L" || jk.toLowerCase().startsWith("laki")) return "Laki-Laki";
    if (jk === "P" || jk.toLowerCase().startsWith("perempuan")) return "Perempuan";
    return jk;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0] ?? "")
        .join("")
        .toUpperCase();
}

export default function SidebarRekamMedis({ onSelectPasien }: SidebarRekamMedisProps) {
    const [activeTab, setActiveTab] = useState<SidebarTab>("REKAM_MEDIS");
    const [searchRM, setSearchRM] = useState("");
    const [searchNama, setSearchNama] = useState("");
    const [pasienList, setPasienList] = useState<PasienRM[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPasien, setTotalPasien] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const tabs: { key: SidebarTab; label: string }[] = [
        { key: "REKAM_MEDIS", label: "REKAM MEDIS" },
        { key: "BOOKING", label: "BOOKING" },
        { key: "LOKET_CALL", label: "LOKET CALL" },
    ];

    async function fetchPasien() {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), per_page: "20" });
            if (searchRM) params.set("search", searchRM);
            if (searchNama) params.set("nama", searchNama);
            const res = await api<{ data: PasienRM[]; meta?: { total: number; last_page: number } }>(
                `/rekam-medis?${params}`
            );
            setPasienList(Array.isArray(res.data) ? res.data : []);
            if (res.meta) {
                setTotalPasien(res.meta.total);
                setTotalPages(res.meta.last_page);
            }
        } catch {
            setPasienList([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (activeTab === "REKAM_MEDIS") {
            void fetchPasien();
        }
    }, [page, activeTab]);

    function handleSearch() {
        setPage(1);
        void fetchPasien();
    }

    const avatarColors = [
        "bg-sky-100 text-sky-700",
        "bg-rose-100 text-rose-700",
        "bg-amber-100 text-amber-700",
        "bg-emerald-100 text-emerald-700",
        "bg-violet-100 text-violet-700",
        "bg-teal-100 text-teal-700",
    ];

    return (
        <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 px-2 py-3 text-center text-xs font-bold uppercase tracking-wider transition-colors ${
                            activeTab === tab.key
                                ? "border-b-2 border-sky-500 text-sky-600 bg-white"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "REKAM_MEDIS" && (
                <>
                    {/* Search Fields */}
                    <div className="space-y-2 border-b border-slate-200 px-3 py-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchRM}
                                onChange={(e) => setSearchRM(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Nomor Rekam Medis / NIK"
                                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                            <input
                                type="text"
                                value={searchNama}
                                onChange={(e) => setSearchNama(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Nama Pasien"
                                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="rounded-md bg-sky-500 px-3 py-2 text-white hover:bg-sky-600 transition-colors"
                            >
                                <Search className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        {/* Action Row */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-teal-500 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-600 shadow-sm transition-colors"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Tambah Profil Rekam Medis
                            </button>
                            <button
                                type="button"
                                onClick={() => void fetchPasien()}
                                className="rounded-md border border-slate-300 p-2 text-slate-500 hover:bg-slate-50 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                className="rounded-md border border-slate-300 p-2 text-slate-500 hover:bg-slate-50 transition-colors"
                                title="Filter"
                            >
                                <Filter className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Pasien Cards */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="space-y-3 p-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-20 rounded-lg bg-slate-50 animate-pulse" />
                                ))}
                            </div>
                        ) : pasienList.length === 0 ? (
                            <div className="flex items-center justify-center p-8 text-sm text-slate-400">
                                Belum ada data rekam medis.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {pasienList.map((pasien, idx) => {
                                    const nama = String(pasien.nama ?? pasien.nama_pasien ?? "Tanpa Nama");
                                    const colorClass = avatarColors[idx % avatarColors.length]!;
                                    return (
                                        <button
                                            key={pasien.id ?? idx}
                                            type="button"
                                            onClick={() => onSelectPasien?.(pasien)}
                                            className="flex w-full items-start gap-3 px-3 py-3 text-left hover:bg-sky-50/60 transition-colors group"
                                        >
                                            {/* Avatar */}
                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${colorClass}`}
                                            >
                                                {getInitials(nama)}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-sky-700 transition-colors">
                                                    {nama}
                                                </p>
                                                <div className="mt-0.5 space-y-0.5 text-[11px] text-slate-500">
                                                    <p className="flex items-center gap-1.5">
                                                        <span className="text-slate-400">#</span>
                                                        <span>{pasien.no_rekam_medis ?? "-"}</span>
                                                    </p>
                                                    <p className="flex items-center gap-1.5">
                                                        <User className="h-3 w-3 text-slate-400" />
                                                        <span>{getGenderLabel(pasien.jenis_kelamin)}</span>
                                                    </p>
                                                    <p className="flex items-center gap-1.5">
                                                        <span className="text-slate-400">📅</span>
                                                        <span>{pasien.tanggal_lahir ?? "-"}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right side info */}
                                            <div className="shrink-0 text-right space-y-0.5">
                                                {pasien.no_bpjs && (
                                                    <p className="text-[10px] text-slate-400 font-mono">
                                                        🏥 {pasien.no_bpjs}
                                                    </p>
                                                )}
                                                <p className="text-[11px] text-slate-500">
                                                    ⏱ {formatAge(pasien.tanggal_lahir)}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Pagination Footer */}
                    <div className="border-t border-slate-200 px-3 py-2 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>
                            Hlm {page} dari {totalPages}
                        </span>
                        <span>Total {totalPasien.toLocaleString("id-ID")}</span>
                    </div>
                </>
            )}

            {activeTab === "BOOKING" && (
                <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-400">
                    Fitur booking akan tersedia di sini.
                </div>
            )}

            {activeTab === "LOKET_CALL" && (
                <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-400">
                    Fitur loket call akan tersedia di sini.
                </div>
            )}
        </div>
    );
}
