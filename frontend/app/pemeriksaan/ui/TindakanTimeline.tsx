import type { ResourceColumn, Row } from "~/components/resource/types";
import { cellOf } from "~/components/resource/utils";

const nc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("nama") || c.key.toLowerCase().includes("name")) || cols[0]!;
const dc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("tanggal") || c.key.toLowerCase().includes("date") || c.key.toLowerCase().includes("created_at"));

// Layout tab Pemeriksaan — garis waktu
export default function TindakanTimeline({
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
    const detailCols = columns.filter((c) => c.key !== nameCol.key && c.key !== dateCol?.key);
    return (
        <div className="space-y-3">
            {rows.map((row, i) => {
                const name = String(cellOf(nameCol, row)) === "-" ? "Tanpa Nama" : String(cellOf(nameCol, row));
                return (
                    <button key={String(row.id ?? row.no ?? i)} onClick={() => onOpen(row)} className="relative flex w-full gap-4 text-left rounded-xl border border-slate-200 bg-white p-4 pl-6 hover:border-violet-300 hover:shadow-md transition-all">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-violet-500 ring-4 ring-violet-100" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900">{name}</p>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {detailCols.map((c) => {
                                    const val = String(cellOf(c, row));
                                    if (val === "-") return null;
                                    return <span key={c.key} className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">{c.label}: {val}</span>;
                                })}
                            </div>
                        </div>
                        {dateCol && <span className="shrink-0 text-xs text-slate-400 self-start">{String(cellOf(dateCol, row))}</span>}
                    </button>
                );
            })}
        </div>
    );
}