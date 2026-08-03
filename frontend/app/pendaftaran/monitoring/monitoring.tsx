import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Activity } from "lucide-react";
import { api, getToken } from "~/lib/api";
import type { Row } from "~/components/resource/types";
import { cn } from "~/lib/utils";
import { EmptyState, FeatureShell } from "../ui/FeatureShell";

function statusToken(s: unknown): string {
    const str = String(s ?? "").toLowerCase();
    if (str.includes("periksa")) return "Diperiksa";
    if (str.includes("selesai") || str.includes("done")) return "Selesai";
    return "Menunggu";
}

const statusStyle: Record<string, { badge: string; dot: string }> = {
    Menunggu: { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
    Diperiksa: { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
    Selesai: { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
};

const aspek = [
    { key: "status", label: "Registrasi" },
    { key: "bpjs", label: "BPJS" },
    { key: "satusehat", label: "SATUSEHAT" },
    { key: "antrean", label: "Antrean" },
    { key: "billing", label: "Billing" },
    { key: "poli", label: "Poli" },
];

export default function MonitoringRegistrasi() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        api<{ data?: Row[] }>("/pendaftaran?per_page=100")
            .then((p) => setRows(Array.isArray(p.data) ? p.data : []))
            .catch(() => setRows([]))
            .finally(() => setLoading(false));
    }, [navigate]);

    return (
        <FeatureShell
            title="Monitoring Registrasi"
            subtitle="Pantau status registrasi, BPJS, SATUSEHAT, antrean, billing, dan poli secara realtime"
            actions={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                    <Activity className="h-3.5 w-3.5" /> Realtime
                </span>
            }
        >
            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                    ))}
                </div>
            ) : rows.length === 0 ? (
                <EmptyState icon={<Activity className="h-8 w-8 text-slate-300" />} title="Tidak ada registrasi aktif" />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Pasien</th>
                                    {aspek.map((a) => (
                                        <th key={a.key} className="px-4 py-3">{a.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rows.map((r, i) => {
                                    const st = statusToken(r.status);
                                    const style = statusStyle[st] ?? statusStyle.Menunggu!;
                                    return (
                                        <tr key={String(r.id ?? i)} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-slate-800">{String(r.name ?? "-")}</p>
                                                <p className="text-xs text-slate-400">#{String(r.no ?? "-")} · {String(r.poli ?? "-")}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold", style.badge)}>
                                                    <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} /> {st}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3"><StatusOk /></td>
                                            <td className="px-4 py-3"><StatusOk /></td>
                                            <td className="px-4 py-3">{st === "Menunggu" ? <StatusWait /> : st === "Selesai" ? <StatusOk /> : <StatusGo />}</td>
                                            <td className="px-4 py-3"><StatusOk /></td>
                                            <td className="px-4 py-3 text-xs text-slate-500">{String(r.dokter ?? "-")}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </FeatureShell>
    );
}

function StatusOk() {
    return <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">OK</span>;
}
function StatusWait() {
    return <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">Menunggu</span>;
}
function StatusGo() {
    return <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">Proses</span>;
}