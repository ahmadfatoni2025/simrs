import { useState } from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import type { ResourceColumn, Row } from "~/components/resource/types";
import { cellOf, cn, getPriorityColor } from "~/components/resource/utils";

const nc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("nama") || c.key.toLowerCase().includes("name") || c.key.toLowerCase().includes("pasien")) || cols[0]!;
const dc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("tanggal") || c.key.toLowerCase().includes("date") || c.key.toLowerCase().includes("created_at"));
const sc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("status") || c.key.toLowerCase().includes("keluar"));
const pc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("prioritas") || c.key.toLowerCase().includes("priority"));

const preferredOrder = ["Menunggu", "Diperiksa", "Selesai"];

const columnColors: Record<string, string> = {
    Menunggu: "text-slate-700",
    Diperiksa: "text-amber-800",
    Selesai: "text-emerald-800",
};

const tabDotColors: Record<string, string> = {
    Menunggu: "bg-slate-400",
    Diperiksa: "bg-amber-500",
    Selesai: "bg-emerald-500",
};

function KanbanCard({ data, columns, onOpen }: { data: Row; columns: ResourceColumn[]; onOpen: (row: Row) => void }) {
    const nameCol = nc(columns);
    const statusCol = sc(columns);
    const detailCols = columns.filter(
        (c) => c.key !== nameCol.key && c.key !== statusCol?.key && c.key !== dc(columns)?.key && c.key !== pc(columns)?.key
    );
    const name = String(cellOf(nameCol, data)) === "-" ? "Tanpa Nama" : String(cellOf(nameCol, data));
    const status = statusCol ? cellOf(statusCol, data) : null;
    return (
        <div onClick={() => onOpen(data)} className="group relative flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
            <div className="flex justify-between items-start gap-2">
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">{name}</h3>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
            {status && (
                <div className="flex flex-wrap gap-1.5">
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium", getPriorityColor(status))}>{String(status)}</span>
                </div>
            )}
            {detailCols.slice(0, 3).map((col) => {
                const val = cellOf(col, data);
                if (val === "-") return null;
                return (
                    <div key={col.key} className="flex items-start justify-between gap-3 text-xs">
                        <span className="shrink-0 text-slate-400 capitalize">{col.label}</span>
                        <span className="truncate text-right font-medium text-slate-700">{val}</span>
                    </div>
                );
            })}
        </div>
    );
}

// Layout tab Pendaftaran — kanban 1 baris, dengan tab status sticky di atas
export default function PasienKanban({
    rows,
    columns,
    groupByKey = "status",
    onOpen,
}: {
    rows: Row[];
    columns: ResourceColumn[];
    groupByKey?: string;
    onOpen: (row: Row) => void;
}) {
    const [active, setActive] = useState<string>(preferredOrder[0]!);

    const groups: Record<string, Row[]> = {};
    rows.forEach((row) => {
        const g = row[groupByKey] == null || row[groupByKey] === "" ? "Menunggu" : String(row[groupByKey]);
        if (!groups[g]) groups[g] = [];
        groups[g].push(row);
    });

    const tabs = preferredOrder;
    const shown = groups[active] ?? [];

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Tab sticky */}
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-3 pt-3 backdrop-blur">
                <div className="flex gap-1 overflow-x-auto pb-2">
                    {tabs.map((t) => {
                        const count = groups[t]?.length || 0;
                        const isActive = t === active;
                        return (
                            <button
                                key={t}
                                onClick={() => setActive(t)}
                                className={cn(
                                    "flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                )}
                            >
                                <span className={cn("h-2 w-2 rounded-full", tabDotColors[t] ?? "bg-slate-400")} />
                                <span className={cn("uppercase tracking-wide", columnColors[t] ?? "text-slate-600")}>
                                    {t}
                                </span>
                                <span
                                    className={cn(
                                        "rounded-full px-2 py-0.5 text-xs font-bold",
                                        isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                                    )}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Kartu scroll ke bawah */}
            <div className="flex flex-col gap-3 overflow-y-auto p-3">
                {shown.length === 0 ? (
                    <div className="flex w-full items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-sm text-slate-400">
                        Tidak ada pasien berstatus {active.toLowerCase()}.
                    </div>
                ) : (
                    shown.map((row, idx) => (
                        <KanbanCard key={String(row.id ?? row.no ?? idx)} data={row} columns={columns} onOpen={onOpen} />
                    ))
                )}
            </div>
        </div>
    );
}