import { ChevronRight } from "lucide-react";
import type { ResourceColumn, Row } from "~/components/resource/types";
import { cellOf, cn, getPriorityColor } from "~/components/resource/utils";

const nc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("nama") || c.key.toLowerCase().includes("name")) || cols[0]!;
const dc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("tanggal") || c.key.toLowerCase().includes("date") || c.key.toLowerCase().includes("created_at"));
const sc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("status") || c.key.toLowerCase().includes("keluar"));

// Layout tab Rekam Medis — baris list ringkas
export default function DiagnosaList({
    rows,
    columns,
    onOpen,
}: {
    rows: Row[];
    columns: ResourceColumn[];
    onOpen: (row: Row) => void;
}) {
    const nameCol = nc(columns);
    const dateCol = dc(columns);
    const statusCol = sc(columns);
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {rows.map((row, i) => (
                <button key={String(row.id ?? row.no ?? i)} onClick={() => onOpen(row)} className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500" />
                        <span className="truncate text-sm font-medium text-slate-800">
                            {String(cellOf(nameCol, row)) === "-" ? "Tanpa Nama" : String(cellOf(nameCol, row))}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        {dateCol && <span className="text-xs text-slate-400 hidden sm:inline">{String(cellOf(dateCol, row))}</span>}
                        {statusCol && <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", getPriorityColor(cellOf(statusCol, row)))}>{String(cellOf(statusCol, row))}</span>}
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                </button>
            ))}
        </div>
    );
}