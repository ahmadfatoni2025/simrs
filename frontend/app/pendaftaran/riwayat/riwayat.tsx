import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { History } from "lucide-react";
import { api, getToken } from "~/lib/api";
import type { Row } from "~/components/resource/types";
import { EmptyState, FeatureShell } from "../ui/FeatureShell";

interface PageMeta {
    last_page: number;
    total: number;
}

const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

export default function RiwayatKunjungan() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<Row[]>([]);
    const [meta, setMeta] = useState<PageMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [tanggalAwal, setTanggalAwal] = useState("");
    const [tanggalAkhir, setTanggalAkhir] = useState("");
    const [search, setSearch] = useState("");

    function load() {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        setLoading(true);
        const params = new URLSearchParams({ per_page: "100" });
        if (search) params.set("search", search);
        api<{ data?: Row[]; meta?: PageMeta }>(`/pendaftaran?${params}`)
            .then((p) => {
                setRows(Array.isArray(p.data) ? p.data : []);
                if (p.meta) setMeta(p.meta);
            })
            .catch(() => setRows([]))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
    }, [search, navigate]);

    const filtered = rows.filter((r) => {
        const t = String(r.tanggal ?? "");
        if (tanggalAwal && t < tanggalAwal) return false;
        if (tanggalAkhir && t > tanggalAkhir) return false;
        return true;
    });

    return (
        <FeatureShell
            title="Riwayat Kunjungan"
            subtitle="Semua kunjungan pasien beserta poli, dokter, dan status"
        >
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-3 sm:grid-cols-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500">Tanggal Awal</label>
                        <input type="date" className={inputClass} value={tanggalAwal} onChange={(e) => setTanggalAwal(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500">Tanggal Akhir</label>
                        <input type="date" className={inputClass} value={tanggalAkhir} onChange={(e) => setTanggalAkhir(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500">Cari Pasien / No. Kunjungan</label>
                        <input className={inputClass} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nama / no RM" />
                    </div>
                    <div className="flex items-end text-xs text-slate-400">Total: {filtered.length}</div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="space-y-3 p-5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-50" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-5">
                        <EmptyState icon={<History className="h-8 w-8 text-slate-300" />} title="Tidak ada riwayat kunjungan" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">No. Kunjungan</th>
                                    <th className="px-4 py-3">Nama Pasien</th>
                                    <th className="px-4 py-3">Poliklinik</th>
                                    <th className="px-4 py-3">Dokter</th>
                                    <th className="px-4 py-3">Tanggal</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((r, i) => (
                                    <tr key={String(r.id ?? i)} className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">#{String(r.no ?? "-")}</td>
                                        <td className="px-4 py-3 font-semibold text-slate-800">{String(r.name ?? "-")}</td>
                                        <td className="px-4 py-3 text-slate-600">{String(r.poli ?? "-")}</td>
                                        <td className="px-4 py-3 text-slate-600">{String(r.dokter ?? "-")}</td>
                                        <td className="px-4 py-3 text-slate-500">{String(r.tanggal ?? "-")}</td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                                {String(r.status ?? "-")}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {meta && <p className="text-xs text-slate-400">Total seluruh data: {meta.total}</p>}
        </FeatureShell>
    );
}
