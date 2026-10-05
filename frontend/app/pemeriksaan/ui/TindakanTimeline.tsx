import type { ResourceColumn, Row } from "~/components/resource/types";
import { cellOf } from "~/components/resource/utils";
import { Clock, CheckCircle2, ChevronRight, Activity } from "lucide-react";

const nc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("nama") || c.key.toLowerCase().includes("name")) || cols[0]!;
const dc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("tanggal") || c.key.toLowerCase().includes("date") || c.key.toLowerCase().includes("created_at"));

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

    if (!rows || rows.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
                <Activity className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-500">Belum ada riwayat tindakan medis</p>
                <p className="text-xs text-slate-400 mt-1">Data riwayat akan muncul di sini setelah pemeriksaan selesai.</p>
            </div>
        );
    }

    return (
        <div className="relative space-y-4 before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100">
            {rows.map((row, i) => {
                const name = String(cellOf(nameCol, row)) === "-" ? "Tindakan Medis Standard" : String(cellOf(nameCol, row));
                const dateVal = dateCol ? String(cellOf(dateCol, row)) : "Hari ini";
                return (
                    <div key={String(row.id ?? row.no ?? i)} className="relative flex items-start gap-4 pl-12 group">
                        {/* Timeline Node */}
                        <div className="absolute left-4 top-4.5 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-white ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all">
                            <span className="h-2 w-2 rounded-full bg-blue-600" />
                        </div>

                        {/* Card */}
                        <button
                            type="button"
                            onClick={() => onOpen(row)}
                            className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-xs transition-all hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                        <CheckCircle2 className="h-3 w-3" /> Selesai
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-900 truncate">{name}</h4>
                                </div>
                                
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {detailCols.map((c) => {
                                        const val = String(cellOf(c, row));
                                        if (val === "-") return null;
                                        return (
                                            <span key={c.key} className="rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-[11px] text-slate-600 font-medium">
                                                <span className="text-slate-400 mr-1">{c.label}:</span>
                                                {val}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium bg-slate-50 px-2.5 py-1 rounded-lg">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{dateVal}</span>
                                </div>
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}