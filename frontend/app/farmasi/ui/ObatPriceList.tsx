import type { ResourceColumn, Row } from "~/components/resource/types";
import { cellOf } from "~/components/resource/utils";

const nc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("nama") || c.key.toLowerCase().includes("name")) || cols[0]!;
const mc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase() === "nominal" || c.key.toLowerCase().includes("tarif") || c.key.toLowerCase().includes("harga"));

// Layout tab Farmasi — daftar harga / tarif
export default function ObatPriceList({
    rows,
    columns,
    onOpen,
}: {
    rows: Row[];
    columns: ResourceColumn[];
    onOpen: (row: Row) => void;
}) {
    const nameCol = nc(columns);
    const moneyCol = mc(columns);
    const detailCols = columns.filter((c) => c.key !== nameCol.key && c.key !== moneyCol?.key);
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {rows.map((row, i) => {
                const name = String(cellOf(nameCol, row)) === "-" ? "Tanpa Nama" : String(cellOf(nameCol, row));
                const money = moneyCol ? cellOf(moneyCol, row) : null;
                return (
                    <button key={String(row.id ?? row.no ?? i)} onClick={() => onOpen(row)} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-amber-50/40 transition-colors">
                        <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">{name}</p>
                            {detailCols.slice(1, 2).map((c) => {
                                const v = cellOf(c, row);
                                return v !== "-" ? <p key={c.key} className="truncate text-xs text-slate-400">{v}</p> : null;
                            })}
                        </div>
                        {money && <span className="shrink-0 text-base font-bold text-amber-600">{money}</span>}
                    </button>
                );
            })}
        </div>
    );
}