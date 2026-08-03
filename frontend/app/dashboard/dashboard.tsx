import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Activity, CalendarCheck2, CircleDollarSign, Loader2, RefreshCw, Stethoscope, Users, BedDouble, Bed, ClipboardList } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { api, getToken, type DashboardData } from "~/lib/api";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "~/components/ui/chart";

const statIcons = [
    { key: "pasien_hari_ini", icon: Users, accent: "bg-indigo-500" },
    { key: "dokter_aktif", icon: Stethoscope, accent: "bg-sky-500" },
    { key: "janji_temu_hari_ini", icon: CalendarCheck2, accent: "bg-amber-500" },
    { key: "pendapatan_bulan_ini", icon: CircleDollarSign, accent: "bg-emerald-500" },
];

function statusPill(status: string): string {
    const s = status.toLowerCase();
    if (s.includes("periksa")) return "bg-blue-100 text-blue-700";
    if (s.includes("selesai")) return "bg-emerald-100 text-emerald-700";
    return "bg-amber-100 text-amber-700";
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const maxVisits = Math.max(1, ...(data?.weekly_visits ?? []).map((v) => v.value));
    const stats = data?.stats ?? [];
    const rooms = data?.rooms;

    const chartConfig = {
        visits: {
            label: "Kunjungan",
            color: "var(--color-chart-1)",
        },
    } satisfies ChartConfig;

    const chartData = (data?.weekly_visits ?? []).map((v) => ({
        date: v.date,
        label: v.label,
        visits: v.value,
    }));

    return (
        <AppShell>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="mt-0.5 text-sm text-slate-500">Ringkasan aktivitas pendaftaran & rawat jalan hari ini</p>
                </div>
                <button
                    type="button"
                    onClick={() => void load()}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                    Muat Ulang
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            {loading && !data ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-24 text-slate-400">
                    <Loader2 className="h-7 w-7 animate-spin" />
                    <p className="text-sm">Memuat data dashboard...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statIcons.map(({ key, icon: Icon, accent }) => {
                            const item = stats.find((s) => s.key === key);
                            if (!item) return null;
                            return (
                                <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white", accent)}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-medium text-slate-500">{item.label}</p>
                                            <p className="text-2xl font-extrabold leading-tight text-slate-900">{item.value}</p>
                                        </div>
                                    </div>
                                    {item.change != null && <ChangeFooter change={item.change} />}
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        {/* Weekly visits */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                                    <Activity className="h-4 w-4 text-indigo-500" /> Kunjungan 7 Hari Terakhir
                                </h2>
                            </div>
                            {chartData.length === 0 ? (
                                <p className="py-10 text-center text-sm text-slate-400">Belum ada data kunjungan.</p>
                            ) : (
                                <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
                                    <BarChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="label"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => String(value)}
                                        />
                                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={24} tickFormatter={(v) => String(v)} />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent className="w-[140px]" nameKey="visits" />}
                                        />
                                        <Bar dataKey="visits" fill="var(--color-visits)" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </div>

                        {/* Rooms */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                                <BedDouble className="h-4 w-4 text-sky-500" /> Kamar
                            </h2>
                            {!rooms ? (
                                <p className="py-10 text-center text-sm text-slate-400">Belum ada data kamar.</p>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                        <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                            <Bed className="h-4 w-4 text-slate-400" /> Total Kamar
                                        </span>
                                        <span className="text-lg font-extrabold text-slate-900">{rooms.total}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                        <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                            <Bed className="h-4 w-4 text-slate-400" /> Kapasitas Tempat Tidur
                                        </span>
                                        <span className="text-lg font-extrabold text-slate-900">{rooms.kapasitas}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 pt-1">
                                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-center">
                                            <p className="text-lg font-extrabold text-amber-700">{rooms.terisi}</p>
                                            <p className="text-[10px] font-medium text-amber-600">Terisi</p>
                                        </div>
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-center">
                                            <p className="text-lg font-extrabold text-emerald-700">{rooms.kosong}</p>
                                            <p className="text-[10px] font-medium text-emerald-600">Kosong</p>
                                        </div>
                                        <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-center">
                                            <p className="text-lg font-extrabold text-blue-700">{rooms.perawatan}</p>
                                            <p className="text-[10px] font-medium text-blue-600">Perawatan</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent registrations */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                                <ClipboardList className="h-4 w-4 text-emerald-500" /> Pendaftaran Terbaru
                            </h2>
                            <span className="text-xs text-slate-400">5 terakhir</span>
                        </div>
                        {(data?.recent_registrations ?? []).length === 0 ? (
                            <p className="py-12 text-center text-sm text-slate-400">Belum ada pendaftaran.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] uppercase tracking-wide text-slate-400">
                                            <th className="px-5 py-2.5 font-semibold">No. Kunjungan</th>
                                            <th className="px-5 py-2.5 font-semibold">Nama Pasien</th>
                                            <th className="px-5 py-2.5 font-semibold">Poliklinik</th>
                                            <th className="px-5 py-2.5 font-semibold">Dokter</th>
                                            <th className="px-5 py-2.5 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data!.recent_registrations.map((r, idx) => (
                                            <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                                                <td className="px-5 py-3 font-mono text-xs text-slate-500">{r.no}</td>
                                                <td className="px-5 py-3 font-semibold text-slate-800">{r.name}</td>
                                                <td className="px-5 py-3 text-slate-600">{r.poli}</td>
                                                <td className="px-5 py-3 text-slate-600">{r.dokter}</td>
                                                <td className="px-5 py-3">
                                                    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", statusPill(r.status))}>
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
        </AppShell>
    );
}

function ChangeFooter({ change }: { change: string }) {
    const s = String(change ?? "");
    const positive = s.startsWith("+") && s !== "0%";
    const negative = s.startsWith("-");
    return (
        <p
            className={cn(
                "mt-3 text-[11px] font-semibold",
                positive ? "text-emerald-600" : negative ? "text-red-500" : "text-slate-400"
            )}
        >
            {s === "0%" ? "Tidak ada perubahan dibanding kemarin" : `${s} dibanding kemarin`}
        </p>
    );
}
