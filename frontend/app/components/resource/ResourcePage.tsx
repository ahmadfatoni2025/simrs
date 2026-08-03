import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { AppShell } from "~/components/layout/AppShell";
import { api, getToken } from "~/lib/api";
import DetailModal from "./DetailModal";
import type { PageMeta, ResourceColumn, ResourcePageProps, Row } from "./types";

export type { ResourceColumn } from "./types";

export default function ResourcePage({
    title,
    subtitle,
    endpoint,
    columns,
    searchPlaceholder,
    action,
    refreshKey,
    layout,
}: ResourcePageProps & { layout: (rows: Row[], onOpen: (row: Row) => void) => ReactNode }) {
    const navigate = useNavigate();
    const [rows, setRows] = useState<Row[]>([]);
    const [meta, setMeta] = useState<PageMeta | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Row | null>(null);

    async function load() {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({ page: String(page), per_page: "20" });
        if (search) params.set("search", search);
        try {
            const payload = await api<{ data?: Row; meta?: PageMeta }>(`${endpoint}?${params}`);
            setRows(Array.isArray(payload.data) ? payload.data : []);
            if (payload.meta) setMeta(payload.meta);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat data.");
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
    }, [endpoint, search, page, navigate, refreshKey]);

    const open = (row: Row) => setSelected(row);

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        {action}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder={searchPlaceholder ?? "Cari..."}
                                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            onClick={() => void load()}
                            className="flex items-center gap-2 rounded-lg bg-[#121212] px-4 py-2 text-sm font-medium text-white hover:bg-black transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Muat Ulang
                        </button>
                    </div>
                </div>

                {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">{error}</div>}

                {/* Body */}
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : rows.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
                        Tidak ada data ditemukan.
                    </div>
                ) : (
                    layout(rows, open)
                )}

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                        <p className="text-slate-500">Total {meta.total} data</p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 hover:bg-slate-50">Sebelumnya</button>
                            <span className="px-2 font-medium">Hal {meta.current_page} / {meta.last_page}</span>
                            <button onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={page >= meta.last_page} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 hover:bg-slate-50">Berikutnya</button>
                        </div>
                    </div>
                )}
            </div>

            <DetailModal data={selected} columns={columns} onClose={() => setSelected(null)} />
        </AppShell>
    );
}