import { Calendar, MoreHorizontal, User, X } from "lucide-react";
import type { ResourceColumn, Row } from "./types";
import { cellOf, cn, getPriorityColor, isMoney, nameOf, resolveMeta } from "./utils";

// MODAL DETAIL (dibuka saat kartu/baris diklik) — untuk semua variant
export default function DetailModal({
    data,
    columns,
    onClose,
}: {
    data: Row | null;
    columns: ResourceColumn[];
    onClose: () => void;
}) {
    if (!data) return null;
    const { nameColumn, statusColumn, dateColumn, detailColumns } = resolveMeta(columns);
    const definedKeys = columns.map((c) => c.key);
    const extraKeys = Object.keys(data).filter((k) => !definedKeys.includes(k));

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-start gap-4 rounded-t-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/40">
                        <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold leading-tight line-clamp-2">{nameOf(data, nameColumn)}</h2>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/90">
                            {dateColumn && <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Calendar className="h-3 w-3" />{String(cellOf(dateColumn, data))}</span>}
                            {statusColumn && (
                                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 font-medium", getPriorityColor(data[statusColumn.key]))}>
                                    {String(cellOf(statusColumn, data))}
                                </span>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="shrink-0 rounded-full p-1.5 hover:bg-white/20 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Badan informasi */}
                <div className="p-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Informasi</h3>
                    <dl className="mt-3 divide-y divide-slate-100">
                        {detailColumns.map((col) => {
                            const val = cellOf(col, data);
                            if (val === "-" || val == null) return null;
                            return (
                                <div key={col.key} className="flex items-start justify-between gap-4 py-2.5">
                                    <dt className="text-sm text-slate-500">{col.label}</dt>
                                    <dd className={cn("text-sm font-medium text-slate-800 text-right", isMoney(col.key) ? "text-indigo-600 font-semibold" : "font-mono")}>{val}</dd>
                                </div>
                            );
                        })}
                        {statusColumn && cellOf(statusColumn, data) !== "-" && (
                            <div className="flex items-start justify-between gap-4 py-2.5">
                                <dt className="text-sm text-slate-500">Status</dt>
                                <dd>{cellOf(statusColumn, data)}</dd>
                            </div>
                        )}
                    </dl>

                    {extraKeys.length > 0 && (
                        <>
                            <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">Data Lainnya</h3>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {extraKeys.map((k) => {
                                    const v = data[k];
                                    if (v == null || v === "" || typeof v === "object") return null;
                                    return (
                                        <span key={k} className="rounded-md bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
                                            <span className="font-medium text-slate-400 capitalize">{k.replace(/_/g, " ")}</span>: {String(v)}
                                        </span>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <div className="mt-6 flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                        <MoreHorizontal className="h-4 w-4" />
                        Fitur aksi lanjutan (edit / riwayat) bisa ditambahkan di sini.
                    </div>
                </div>
            </div>
        </div>
    );
}