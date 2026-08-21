import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Bell, CheckCircle2, Phone, RotateCcw, Stethoscope, Timer } from "lucide-react";
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

const columns = [
    { key: "Menunggu", color: "border-amber-300 bg-amber-50", dot: "bg-amber-500" },
    { key: "Diperiksa", color: "border-blue-300 bg-blue-50", dot: "bg-blue-500" },
    { key: "Selesai", color: "border-emerald-300 bg-emerald-50", dot: "bg-emerald-500" },
];

export default function Antrean() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [called, setCalled] = useState<string | null>(null);
    const [reset, setReset] = useState(0);

    useEffect(() => {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        api<{ data?: Row[] }>("/pendaftaran?per_page=100")
            .then((p) => setRows(Array.isArray(p.data) ? p.data : []))
            .catch(() => setRows([]))
            .finally(() => setLoading(false));
    }, [navigate, reset]);

    const grouped: Record<string, Row[]> = {};
    rows.forEach((r) => {
        const k = statusToken(r.status);
        if (!grouped[k]) grouped[k] = [];
        grouped[k].push(r);
    });

    return (
        <FeatureShell
            title="Manajemen Antrean"
            subtitle="Display antrean, pemanggilan, dan status per lokasi registrasi"
            actions={
                <>
                    <button
                        type="button"
                        onClick={() => void setCalled(null)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                        <Bell className="h-3.5 w-3.5" /> Voice Calling
                    </button>
                    <button
                        type="button"
                        onClick={() => setReset((r) => r + 1)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        <RotateCcw className="h-3.5 w-3.5" /> Reset Harian
                    </button>
                </>
            }
        >
            {called && (
                <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                    <Phone className="h-5 w-5" /> Memanggil: <span className="font-mono">{called}</span> silakan menuju ke loket registrasi.
                </div>
            )}

            {loading ? (
                <div className="grid gap-4 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-3">
                    {columns.map((col) => {
                        const items = grouped[col.key] ?? [];
                        return (
                            <div key={col.key} className={cn("rounded-2xl border p-3", col.color)}>
                                <div className="mb-3 flex items-center justify-between px-1">
                                    <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <span className={cn("h-2 w-2 rounded-full", col.dot)} />
                                        {col.key}
                                    </span>
                                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold">{items.length}</span>
                                </div>
                                <div className="space-y-2">
                                    {items.length === 0 ? (
                                        <p className="rounded-xl border border-dashed border-white/60 px-3 py-8 text-center text-xs text-slate-500">
                                            Kosong
                                        </p>
                                    ) : (
                                        items.map((r, i) => (
                                            <div key={String(r.id ?? i)} className="rounded-xl bg-white p-3 shadow-sm">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
                                                        #{String(r.no ?? "-")}
                                                    </span>
                                                    <span
                                                        className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600"
                                                        title="Prioritas"
                                                    >
                                                        <Timer className="h-3 w-3" /> Antri
                                                    </span>
                                                </div>
                                                <p className="mt-1.5 truncate text-sm font-semibold text-slate-800">
                                                    {String(r.name ?? "-")}
                                                </p>
                                                <p className="truncate text-xs text-slate-400">
                                                    {String(r.poli ?? "-")} · {String(r.dokter ?? "")}
                                                </p>
                                                <div className="mt-2 flex gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCalled(`#${String(r.no ?? "-")} - ${String(r.name ?? "")}`)}
                                                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                                                    >
                                                        <Phone className="h-3 w-3" /> Panggil
                                                    </button>
                                                    {col.key === "Menunggu" && (
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                r.status = "Diperiksa";
                                                                try {
                                                                    const rowId = r.id ?? r.id_pendaftaran;
                                                                    if (rowId) await api(`/pendaftaran/${rowId}`, { method: "PUT", body: JSON.stringify({ status: "Diperiksa" }) });
                                                                } catch { }
                                                                setReset((x) => x + 1);
                                                            }}
                                                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-500 transition-colors"
                                                        >
                                                            <Stethoscope className="h-3 w-3" /> Periksa
                                                        </button>
                                                    )}
                                                    {col.key === "Diperiksa" && (
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                r.status = "Selesai";
                                                                try {
                                                                    const rowId = r.id ?? r.id_pendaftaran;
                                                                    if (rowId) await api(`/pendaftaran/${rowId}`, { method: "PUT", body: JSON.stringify({ status: "Selesai" }) });
                                                                } catch { }
                                                                setReset((x) => x + 1);
                                                            }}
                                                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-500 transition-colors"
                                                        >
                                                            <CheckCircle2 className="h-3 w-3" /> Selesai
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </FeatureShell>
    );
}