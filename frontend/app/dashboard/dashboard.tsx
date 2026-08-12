import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    Activity,
    Calendar,
    BedDouble,
    Clock,
    Loader2,
    MoreHorizontal,
    RefreshCw,
    Pencil,
    Plus,
    Wallet,
    ClipboardList,
    AlertCircle,
} from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { api, getToken, type DashboardData } from "~/lib/api";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

// Types
interface ChartTooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: {
            date: string;
            label: string;
            visits: number;
            projected: number;
        };
        value: number;
    }>;
}

// Custom Tooltip Component
const ChartTooltip = ({ active, payload }: ChartTooltipProps) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <p className="mb-2 text-xs font-semibold text-slate-700">{data.date}</p>
            <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-900" />
                    <span className="text-xs text-slate-500">Kunjungan:</span>
                    <span className="text-xs font-bold text-slate-900">{data.visits}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-xs text-slate-500">Target:</span>
                    <span className="text-xs font-bold text-slate-900">{data.projected}</span>
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({
    icon: Icon,
    label,
    value,
    subValue,
    badge,
    badgeColor = "emerald"
}: {
    icon: any;
    label: string;
    value: string;
    subValue?: string;
    badge?: string;
    badgeColor?: "emerald" | "blue";
}) => (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-200">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        {value}
                        {subValue && (
                            <span className="ml-1 text-sm font-normal text-slate-400">{subValue}</span>
                        )}
                    </p>
                </div>
            </div>
            <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                <MoreHorizontal className="h-4 w-4" />
            </button>
        </div>
        {badge && (
            <div className="mt-4">
                <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    badgeColor === "emerald"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-blue-50 text-blue-700"
                )}>
                    {badge}
                </span>
            </div>
        )}
    </div>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    async function load() {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        setLoading(true);
        setError("");
        try {
            const payload = await api<{ data: DashboardData }>("/dashboard");
            setData(payload.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat data dashboard.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
    }, [navigate]);

    const stats = data?.stats ?? [];
    const rooms = data?.rooms;

    const chartData = (data?.weekly_visits ?? []).map((v) => ({
        date: v.date,
        label: v.label,
        visits: v.value,
        projected: Math.round(v.value * 1.15),
    }));

    const roomProgressData = [
        { name: "Terisi", value: rooms?.terisi ?? 18, color: "#2563eb" },
        { name: "Kosong", value: rooms?.kosong ?? 7, color: "#f59e0b" },
        { name: "Perawatan", value: rooms?.perawatan ?? 5, color: "#ef4444" },
    ];

    const totalBeds = rooms?.kapasitas ?? 30;
    const occupancyRate = totalBeds > 0 ? Math.round(((rooms?.terisi ?? 18) / totalBeds) * 100) : 70;

    const tabs = [
        { id: "all", label: "Semua Kunjungan" },
        { id: "poli", label: "Poliklinik Utama" },
        { id: "dokter", label: "Jadwal Dokter" },
    ];

    return (
        <AppShell>
            <div className=" lg:px-8">
                {/* Header Section */}
                <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                            Proyek Pelayanan SIMRS & Rawat Jalan
                        </h1>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>12 Agt 2026 - 19 Agt 2026</span>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                Periode Aktif
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => void load()}
                            disabled={loading}
                            className="group inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
                            title="Refresh data"
                        >
                            <RefreshCw className={cn(
                                "h-3.5 w-3.5 transition-transform group-hover:rotate-180",
                                loading && "animate-spin"
                            )} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>

                        <button
                            type="button"
                            className="group inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                            title="Edit laporan"
                        >
                            <Pencil className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-indigo-600" />
                            <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:bg-emerald-800"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Registrasi Baru</span>
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && !data ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-28 shadow-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        <p className="text-sm text-slate-500">Memuat statistik dashboard...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <StatCard
                                icon={Clock}
                                label="Total Pasien Hari Ini"
                                value={stats.find((s) => s.key === "pasien_hari_ini")?.value ?? "132"}
                                badge="+12.4%"
                            />
                            <StatCard
                                icon={Wallet}
                                label="Pendapatan Bulan Ini"
                                value={stats.find((s) => s.key === "pendapatan_bulan_ini")?.value ?? "Rp 10.4M"}
                                badge="+8.2%"
                            />
                            <StatCard
                                icon={BedDouble}
                                label="Kamar Tersedia"
                                value={String(rooms?.kosong ?? 7)}
                                subValue={`/ ${rooms?.total ?? 30} Bed`}
                                badge="Siap Pakai"
                                badgeColor="blue"
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Area Chart */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-slate-700" />
                                        <h2 className="text-sm font-bold text-slate-900">
                                            Tren Kunjungan Pasien
                                        </h2>
                                    </div>
                                    <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#1e293b" stopOpacity={0.08} />
                                                    <stop offset="95%" stopColor="#1e293b" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="label"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                            />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="visits"
                                                stroke="#1e293b"
                                                strokeWidth={2.5}
                                                fillOpacity={1}
                                                fill="url(#colorVisits)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                                        <span>Rawat Jalan</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                                        <span>Target Harian</span>
                                    </div>
                                </div>
                            </div>

                            {/* Donut Chart */}
                            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BedDouble className="h-4 w-4 text-slate-700" />
                                        <h2 className="text-sm font-bold text-slate-900">Okupansi Kamar</h2>
                                    </div>
                                    <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="relative flex flex-1 items-center justify-center">
                                    <div className="h-[200px] w-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={roomProgressData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={70}
                                                    outerRadius={90}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {roomProgressData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-3xl font-bold tracking-tight text-slate-900">
                                            {occupancyRate}%
                                        </span>
                                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                                            Terisi
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    {roomProgressData.map((item) => (
                                        <div key={item.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-2.5 w-2.5 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="text-xs text-slate-600">{item.name}</span>
                                            </div>
                                            <span className="text-xs font-semibold text-slate-900">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {/* Tab Navigation */}
                            <div className="border-b border-slate-200">
                                <div className="flex items-center justify-between px-6 pt-4">
                                    <nav className="flex space-x-6">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setActiveTab(tab.id)}
                                                className={cn(
                                                    "relative pb-3 text-xs font-semibold transition-colors",
                                                    activeTab === tab.id
                                                        ? "text-slate-900"
                                                        : "text-slate-400 hover:text-slate-600"
                                                )}
                                            >
                                                {tab.label}
                                                {activeTab === tab.id && (
                                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-slate-900" />
                                                )}
                                            </button>
                                        ))}
                                    </nav>
                                    <span className="hidden text-xs text-slate-400 sm:inline">
                                        Menampilkan 5 data terbaru
                                    </span>
                                </div>
                            </div>

                            {/* Table Content */}
                            {(data?.recent_registrations ?? []).length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <ClipboardList className="mb-3 h-8 w-8 text-slate-300" />
                                    <p className="text-sm text-slate-400">Belum ada data pendaftaran</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50">
                                            <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                                <th className="px-6 py-3">No. Kunjungan</th>
                                                <th className="px-6 py-3">Nama Pasien</th>
                                                <th className="px-6 py-3">Poliklinik</th>
                                                <th className="px-6 py-3">Dokter</th>
                                                <th className="px-6 py-3 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {data!.recent_registrations.map((r, idx) => (
                                                <tr key={idx} className="transition-colors hover:bg-slate-50">
                                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                                        {r.no}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                                        {r.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">{r.poli}</td>
                                                    <td className="px-6 py-4 text-slate-600">{r.dokter}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={cn(
                                                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                                                            r.status.toLowerCase().includes("selesai")
                                                                ? "bg-emerald-50 text-emerald-700"
                                                                : r.status.toLowerCase().includes("periksa")
                                                                    ? "bg-blue-50 text-blue-700"
                                                                    : "bg-amber-50 text-amber-700"
                                                        )}>
                                                            <span className={cn(
                                                                "h-1.5 w-1.5 rounded-full",
                                                                r.status.toLowerCase().includes("selesai")
                                                                    ? "bg-emerald-500"
                                                                    : "bg-amber-500"
                                                            )} />
                                                            {r.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}