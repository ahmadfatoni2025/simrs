import { User } from "lucide-react";
import type { ResourceColumn, Row } from "~/components/resource/types";
import { cellOf, cn, getPriorityColor } from "~/components/resource/utils";

const nc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("nama") || c.key.toLowerCase().includes("name")) || cols[0]!;
const dc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("tanggal") || c.key.toLowerCase().includes("date") || c.key.toLowerCase().includes("created_at"));
const sc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("status") || c.key.toLowerCase().includes("keluar"));

// Layout tab Jadwal Dokter — kartu grid
export default function DokterGrid({
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
    const detailCols = columns.filter(
        (c) => c.key !== nameCol.key && c.key !== statusCol?.key && c.key !== dateCol?.key
    );
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rows.map((row) => {
                const name = String(cellOf(nameCol, row)) === "-" ? "Tanpa Nama" : String(cellOf(nameCol, row));
                return (
                    <button
                        key={String(row.id ?? row.no ?? name)}
                        onClick={() => onOpen(row)}
                        className="group text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
                                {dateCol && <p className="truncate text-xs text-slate-400">{String(cellOf(dateCol, row))}</p>}
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {detailCols.slice(0, 4).map((col) => {
                                const val = String(cellOf(col, row));
                                if (val === "-") return null;
                                return <span key={col.key} className="rounded-lg bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">{val}</span>;
                            })}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}