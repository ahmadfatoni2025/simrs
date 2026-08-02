import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Card } from "~/components/ui/Card";
import { api, getToken } from "~/lib/api";

export interface ResourceColumn {
    key: string;
    label: string;
    render?: (row: Record<string, unknown>) => ReactNode;
}

interface ResourcePageProps {
    title: string;
    subtitle?: string;
    endpoint: string;
    columns: ResourceColumn[];
    searchPlaceholder?: string;
    action?: ReactNode;
    refreshKey?: number;
}

interface Row {
    [key: string]: unknown;
}

interface PageMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function ResourcePage({
    title,
    subtitle,
    endpoint,
    columns,
    searchPlaceholder,
    action,
    refreshKey,
}: ResourcePageProps) {
    const navigate = useNavigate();
    const [rows, setRows] = useState<Row[]>([]);
    const [meta, setMeta] = useState<PageMeta | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ page: String(page), per_page: "10" });
        if (search) params.set("search", search);

        try {
            const payload = await api<{ data?: Row; meta?: PageMeta }>(
                `${endpoint}?${params}`
            );
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

    return (
        <AppShell>
            <Card>
                <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
                        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        {action}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder={searchPlaceholder ?? "Cari..."}
                                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={() => void load()}
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Muat Ulang
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="m-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
                                {columns.map((col) => (
                                    <th key={col.key} className="px-6 py-3 font-medium">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                        Tidak ada data.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, idx) => (
                                    <tr
                                        key={String(row.id ?? row.no ?? idx)}
                                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                                    >
                                        {columns.map((col) => (
                                            <td key={col.key} className="px-6 py-3 text-slate-700">
                                                {col.render
                                                    ? col.render(row)
                                                    : String(row[col.key] ?? "-")}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {meta && meta.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 text-sm">
                        <p className="text-slate-500">
                            Total {meta.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
                            >
                                Sebelumnya
                            </button>
                            <span>
                                Hal {meta.current_page} / {meta.last_page}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                                disabled={page >= meta.last_page}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
                            >
                                Berikutnya
                            </button>
                        </div>
                    </div>
                )}
            </Card>
        </AppShell>
    );
}