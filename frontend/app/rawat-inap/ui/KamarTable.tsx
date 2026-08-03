import type { ResourceColumn, Row } from "~/components/resource/types";
import { cellOf } from "~/components/resource/utils";

const nc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("nama") || c.key.toLowerCase().includes("name")) || cols[0]!;
const sc = (cols: ResourceColumn[]) =>
    cols.find((c) => c.key.toLowerCase().includes("status") || c.key.toLowerCase().includes("keluar"));

// Layout tab Rawat Inap — tabel kamar
export default function KamarTable({
    rows,
    columns,
    onOpen,
}: {
    rows: Row[];
    columns: ResourceColumn[];
    onOpen: (row: Row) => void;
}) {
    const nameCol = nc(columns);
    const statusCol = sc(columns);
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                            {columns.map((c) => <th key={c.key} className="px-4 py-3 font-semibold whitespace-nowrap">{c.label}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.map((row) => (
                            <tr key={String(row.id ?? row.no ?? nameCol.key)} onClick={() => onOpen(row)} className="hover:bg-indigo-50/40 cursor-pointer transition-colors">
                                {columns.map((c) => (
                                    <td key={c.key} className="px-4 py-3 text-slate-700 whitespace-nowrap">
                                        {c.render ? cellOf(c, row) : <span className="truncate">{String(cellOf(c, row))}</span>}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}