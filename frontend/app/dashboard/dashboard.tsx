import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    Activity, Calendar, BedDouble, Clock, Loader2, MoreHorizontal,
    Wallet, ClipboardList, AlertCircle, Users, FileText, PillBottle,
    FlaskConical, HeartPulse, ChevronRight, ChevronLeft, AlertTriangle,
    TrendingUp, Search, Send, Sparkles, Syringe, ArrowUpRight, ArrowDownRight,
    Plus, CreditCard, SendHorizontal, ArrowDownLeft, Clock3, Filter,
    CheckCircle2, AlertCircle as AlertIcon, RefreshCw, ChevronDown, Bell, Mail,
    UserPlus, Stethoscope, Bed, DollarSign, FileCheck, ExternalLink,
    type LucideIcon,
} from "lucide-react";
import { api, getToken, type DashboardData } from "~/lib/api";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

interface RecentActivity {
    id: string;
    avatar: string;
    text: string;
    time: string;
    dayGroup: "Today" | "Yesterday";
}
const RECENT_ACTIVITIES: RecentActivity[] = [
    {
        id: "act1",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        text: "Dr. Rina memperbarui resep & CPPT pasien Arjun Sharma",
        time: "10:15 WIB",
        dayGroup: "Today",
    },
    {
        id: "act2",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        text: "Laboratorium menerbitkan hasil Darah Lengkap Neha Kapoor",
        time: "09:45 WIB",
        dayGroup: "Today",
    },
    {
        id: "act3",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        text: "Pendaftaran pasien baru BPJS - Rakesh Patel (Ranap)",
        time: "16:20 WIB",
        dayGroup: "Yesterday",
    },
    {
        id: "act4",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        text: "Verifikasi klaim klaim asuransi rawat inap selesai",
        time: "14:10 WIB",
        dayGroup: "Yesterday",
    },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedYear, setSelectedYear] = useState("Tahun Ini");
    const [searchQuery, setSearchQuery] = useState("");

    async function load() {
        if (!getToken()) { navigate("/login", { replace: true }); return; }
        setLoading(true); setError("");
        try {
            const payload = await api<{ data: DashboardData }>("/dashboard");
            setData(payload.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat data dashboard.");
        } finally { setLoading(false); }
    }

    useEffect(() => { void load(); }, [navigate]);

    // Live Synchronized Database Data
    const stats = data?.stats ?? [];
    const rooms = data?.rooms;
    const weeklyVisits = data?.weekly_visits ?? [];
    const recentRegs = data?.recent_registrations ?? [];

    // Calculate Dynamic Summaries
    const totalVisits = weeklyVisits.reduce((acc, curr) => acc + curr.value, 0);
    const totalBeds = rooms?.kapasitas ?? 30;
    const filledBeds = rooms?.terisi ?? 18;
    const roomOccupancy = totalBeds > 0 ? Math.round((filledBeds / totalBeds) * 100) : 60;

    const pendapatanStat = stats.find((s) => s.key === "pendapatan_bulan_ini")?.value ?? "Rp 1.170.000.000";
    const pasienStat = stats.find((s) => s.key === "pasien_hari_ini")?.value ?? "42";

    // Quick Interactive Actions for Workflow Efficiency
    const QUICK_ACTIONS = [
        { label: "Daftar Pasien Baru", icon: UserPlus, path: "/pendaftaran", color: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" },
        { label: "Pemeriksaan Dokter", icon: Stethoscope, path: "/pemeriksaan", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" },
        { label: "Manajemen Bangsal", icon: Bed, path: "/rawat-inap", color: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100" },
        { label: "Resep Farmasi", icon: PillBottle, path: "/farmasi", color: "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100" },
        { label: "Laboratorium", icon: FlaskConical, path: "/penunjang?tab=laboratorium", color: "bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100" },
        { label: "Kasir & Billing", icon: DollarSign, path: "/laporan", color: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100" },
    ];

    // Filter registrations by search
    const filteredRegistrations = recentRegs.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.poli.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.dokter.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppShell>
            <div className="min-h-screen bg-[#F7F8FA] p-3 sm:p-6 text-slate-800 font-sans">

                {/* ──────────────────────────────────────────────────────── */}
                {/*  TOP BAR (Dashboard Header + Global Search + Profile)   */}
                {/* ──────────────────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Dashboard SIMRS Integrasi
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">Summary data realtime & alur kerja rumah sakit</p>
                    </div>

                    {/* Center Search Input */}
                    <div className="relative w-full sm:w-[420px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari pasien, No. RM, poliklinik, atau dokter..."
                            className="w-full rounded-full bg-white border-0 py-2.5 pl-11 pr-4 text-xs shadow-sm ring-1 ring-slate-200/60 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400 transition-all"
                        />
                    </div>

                </div>

                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-2xl bg-rose-50 p-4 text-xs font-medium text-rose-700 ring-1 ring-rose-200/60">
                        <div className="flex items-center gap-2">
                            <AlertIcon className="h-4 w-4 shrink-0" /> {error}
                        </div>
                        <button onClick={load} className="underline font-bold text-rose-800">Coba Lagi</button>
                    </div>
                )}

                {loading && !data ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-white py-32 ring-1 ring-slate-200/60 shadow-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                        <p className="text-xs text-slate-400 font-medium">Sinkronisasi Data Realtime dari Database...</p>
                    </div>
                ) : (
                    /* ──────────────────────────────────────────────────────── */
                    /* MAIN 2-COLUMN GRID SYSTEM (LEFT 68% | RIGHT 32%)         */
                    /* ──────────────────────────────────────────────────────── */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* =================================================== */}
                        {/* LEFT COLUMN: MAIN ANALYTICS & TRANSACTIONS (8 COLS) */}
                        {/* =================================================== */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Top 4 Real Data KPI Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

                                {/* Card 1: Total Pendapatan Realtime */}
                                <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-200/50 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-[11px] font-medium text-slate-500">Pendapatan Bulan Ini</p>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <Wallet className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                            {pendapatanStat}
                                        </h3>
                                        <p className="text-[10px] text-emerald-600 font-semibold mt-1">Realtime DB Sync</p>
                                    </div>
                                </div>

                                {/* Card 2: Pasien Hari Ini */}
                                <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-200/50 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-[11px] font-medium text-slate-500">Pasien Hari Ini</p>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                            <Users className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                            {pasienStat} <span className="text-xs font-normal text-slate-400">orang</span>
                                        </h3>
                                        <p className="text-[10px] text-blue-600 font-semibold mt-1">Poli & IGD Total</p>
                                    </div>
                                </div>

                                {/* Card 3: Bed Occupancy Ranap */}
                                <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-200/50 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-[11px] font-medium text-slate-500">Okupansi Kamar</p>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                                            <BedDouble className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                            {filledBeds} / {totalBeds} <span className="text-xs font-bold text-amber-600">({roomOccupancy}%)</span>
                                        </h3>
                                        <p className="text-[10px] text-slate-400 font-medium mt-1">{rooms?.kosong ?? 7} Bed Kosong</p>
                                    </div>
                                </div>

                                {/* Card 4: Kunjungan Mingguan Total */}
                                <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-200/50 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-[11px] font-medium text-slate-500">Total Kunjungan</p>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                                            <Activity className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                            {totalVisits} <span className="text-xs font-normal text-slate-400">kunjungan</span>
                                        </h3>
                                        <p className="text-[10px] text-purple-600 font-semibold mt-1">Grafik 7 Hari Terakhir</p>
                                    </div>
                                </div>

                            </div>

                            {/* Main Earnings & Visitor Bar Chart Card */}
                            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 relative">

                                {/* Header Controls */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500">Grafik Kunjungan & Tren Pasien Realtime</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                                {totalVisits} <span className="text-sm font-semibold text-slate-500">Total Pasien Minggu Ini</span>
                                            </h2>
                                            <span className="inline-flex items-center font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs">
                                                Terdaftar di DB
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                                            <span>{selectedYear}</span>
                                            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                                        </button>
                                        <button onClick={() => navigate("/pendaftaran")} className="flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 text-xs font-bold hover:bg-emerald-100 transition-colors">
                                            <span>Lihat Rekap Pendaftaran</span>
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Bars Container */}
                                <div className="relative pt-6 pb-2">
                                    <div className="grid grid-cols-7 gap-3 sm:gap-4 items-end h-[200px] pt-4 pl-4">
                                        {weeklyVisits.map((bar, idx) => {
                                            const maxVal = Math.max(...weeklyVisits.map(v => v.value), 1);
                                            const pct = Math.round((bar.value / maxVal) * 100);
                                            const isLast = idx === weeklyVisits.length - 1;
                                            return (
                                                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                                                    <div className="w-full flex flex-col items-center justify-end h-full relative">
                                                        <div
                                                            className={cn(
                                                                "w-full max-w-[36px] rounded-t-xl transition-all duration-300 relative group-hover:bg-emerald-500",
                                                                isLast ? "bg-emerald-500 shadow-md shadow-emerald-200" : "bg-emerald-200/80"
                                                            )}
                                                            style={{ height: `${Math.max(12, pct)}%` }}
                                                        >
                                                            <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md transition-opacity whitespace-nowrap">
                                                                {bar.value} Pasien
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={cn(
                                                        "text-[11px] font-medium transition-colors",
                                                        isLast ? "text-slate-900 font-bold" : "text-slate-500"
                                                    )}>
                                                        {bar.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Synchronized Realtime Registrations Table */}
                            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Data Pendaftaran Pasien Terbaru</h3>
                                        <p className="text-xs text-slate-400">Menampilkan {filteredRegistrations.length} pendaftaran dari database</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button onClick={() => navigate("/pendaftaran")} className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-100">
                                            <span>Buka Modul Pendaftaran</span>
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-[11px] font-medium text-slate-400">
                                                <th className="pb-3 pt-1 font-semibold">No. Reg</th>
                                                <th className="pb-3 pt-1 font-semibold">Nama Pasien</th>
                                                <th className="pb-3 pt-1 font-semibold">Poliklinik</th>
                                                <th className="pb-3 pt-1 font-semibold">Dokter PJ</th>
                                                <th className="pb-3 pt-1 font-semibold text-right">Status</th>
                                                <th className="pb-3 pt-1 font-semibold text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100/80">
                                            {filteredRegistrations.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                                                        Tidak ada data pendaftaran yang sesuai pencarian.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredRegistrations.map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="py-3.5 pr-3 font-mono text-[11px] text-slate-500 font-semibold">
                                                            {row.no}
                                                        </td>
                                                        <td className="py-3.5 px-2">
                                                            <p className="font-bold text-slate-900">{row.name}</p>
                                                            <span className="text-[10px] text-slate-400 font-medium">JK: {row.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}</span>
                                                        </td>
                                                        <td className="py-3.5 px-2 text-slate-600 font-medium">
                                                            {row.poli}
                                                        </td>
                                                        <td className="py-3.5 px-2 text-slate-600">
                                                            {row.dokter}
                                                        </td>
                                                        <td className="py-3.5 pl-2 text-right">
                                                            <span className={cn(
                                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold",
                                                                row.status.toLowerCase().includes("selesai") && "bg-emerald-50 text-emerald-600",
                                                                row.status.toLowerCase().includes("periksa") && "bg-blue-50 text-blue-600",
                                                                !row.status.toLowerCase().includes("selesai") && !row.status.toLowerCase().includes("periksa") && "bg-amber-50 text-amber-600"
                                                            )}>
                                                                <span className={cn(
                                                                    "h-1.5 w-1.5 rounded-full",
                                                                    row.status.toLowerCase().includes("selesai") ? "bg-emerald-500" : "bg-amber-500"
                                                                )} />
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 text-center">
                                                            <button
                                                                onClick={() => navigate("/pemeriksaan")}
                                                                className="rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 px-2.5 py-1 text-[10px] font-bold text-slate-700 transition-colors"
                                                            >
                                                                Periksa
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                        {/* =================================================== */}
                        {/* RIGHT COLUMN: CARDS, LIMIT, & RECENT (4 COLS)       */}
                        {/* =================================================== */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Section 1: My Card Widget & SIMRS Financial Overview */}
                            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">Kas SIMRS & Finansial</h3>
                                    <button onClick={() => navigate("/laporan")} className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
                                        <Plus className="h-3.5 w-3.5" /> + Billing RS
                                    </button>
                                </div>

                                {/* Minimalist Dark Green Credit Card */}
                                <div className="rounded-2xl bg-[#1C3A2B] p-5 text-white shadow-md relative overflow-hidden space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-emerald-300">
                                            <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                                            <div className="h-3 w-3 rounded-full bg-emerald-500/50 -ml-1.5" />
                                        </div>
                                        <CreditCard className="h-5 w-5 text-emerald-200/60" />
                                    </div>

                                    <div>
                                        <p className="text-lg font-bold tracking-wide">RSUD SIMRS UTAMA</p>
                                        <div className="flex justify-between items-end mt-4">
                                            <div>
                                                <p className="text-[10px] text-emerald-200/60 uppercase tracking-wider">Saldo Operasional DB</p>
                                                <p className="text-2xl font-extrabold tracking-tight text-white mt-0.5">{pendapatanStat}</p>
                                            </div>
                                            <div className="flex gap-3 text-[10px] text-right text-emerald-200/80">
                                                <div>
                                                    <p className="text-[9px] text-emerald-200/50">VA RS</p>
                                                    <p className="font-bold">8802-91</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Shortcuts */}
                                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                                    {[
                                        { icon: UserPlus, label: "Daftar", path: "/pendaftaran" },
                                        { icon: Stethoscope, label: "Dokter", path: "/pemeriksaan" },
                                        { icon: PillBottle, label: "Farmasi", path: "/farmasi" },
                                        { icon: Bed, label: "Ranap", path: "/rawat-inap" },
                                    ].map((act, i) => (
                                        <button key={i} onClick={() => navigate(act.path)} className="flex flex-col items-center gap-1.5 group">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200/60 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                                                <act.icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900">{act.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section 2: Bangsal & Bed Occupancy Live Meter */}
                            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/50 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">Kapasitas Rawat Inap</h3>
                                    <button onClick={() => navigate("/rawat-inap")} className="text-xs font-bold text-emerald-600 hover:underline">
                                        Detail Ranap
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500">
                                    <span className="font-bold text-slate-900">{filledBeds} Bed Terisi</span> dari kapasitas {totalBeds} bed
                                </p>

                                {/* Progress bar */}
                                <div className="relative h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${roomOccupancy}%` }} />
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                                    <span>Tersedia: {rooms?.kosong ?? 7} bed</span>
                                    <span className="font-bold text-emerald-600">{roomOccupancy}% Occupancy</span>
                                </div>
                            </div>

                            {/* Section 3: Recent Activity Timeline */}
                            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">Log Aktivitas Layanan RS</h3>
                                    <button onClick={load} className="text-slate-400 hover:text-slate-600">
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Today list */}
                                <div>
                                    <p className="text-xs font-bold text-slate-400 mb-3">Hari Ini</p>
                                    <div className="space-y-3">
                                        {RECENT_ACTIVITIES.filter((a) => a.dayGroup === "Today").map((act) => (
                                            <div key={act.id} className="flex items-start gap-3">
                                                <img src={act.avatar} alt="Avatar" className="h-8 w-8 rounded-full object-cover shrink-0 mt-0.5" />
                                                <div className="flex-1 text-xs">
                                                    <p className="font-semibold text-slate-800 leading-snug">{act.text}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Yesterday list */}
                                <div className="pt-2 border-t border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 mb-3">Kemarin</p>
                                    <div className="space-y-3">
                                        {RECENT_ACTIVITIES.filter((a) => a.dayGroup === "Yesterday").map((act) => (
                                            <div key={act.id} className="flex items-start gap-3">
                                                <img src={act.avatar} alt="Avatar" className="h-8 w-8 rounded-full object-cover shrink-0 mt-0.5" />
                                                <div className="flex-1 text-xs">
                                                    <p className="font-semibold text-slate-800 leading-snug">{act.text}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                )}
            </div>
        </AppShell>
    );
}