import type { VisitPoint } from "~/lib/api";
import { Card } from "~/components/ui/Card";

export function VisitsChart({ data }: { data: VisitPoint[] }) {
    const max = Math.max(...data.map((v) => v.value), 1);
    const total = data.reduce((acc, v) => acc + v.value, 0);

    return (
        <Card className="p-6 xl:col-span-2">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Kunjungan Pasien Mingguan</h2>
                    <p className="text-xs font-medium text-slate-400">Total {total} kunjungan 7 hari terakhir</p>
                </div>
                <select className="rounded-full border border-slate-200/80 bg-slate-50/60 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition-all hover:bg-white focus:border-purple-300">
                    <option>7 Hari</option>
                    <option>30 Hari</option>
                </select>
            </div>
            <div className="flex h-56 items-end gap-3 sm:gap-6 pt-4">
                {data.map((v) => (
                    <div key={v.date} className="flex flex-1 flex-col items-center gap-2.5 h-full justify-end">
                        <div className="flex w-full flex-1 items-end bg-slate-50/70 rounded-t-xl p-1">
                            <div
                                className="w-full rounded-t-lg bg-[#6344f5] transition-all hover:bg-[#5232e0] shadow-xs"
                                style={{ height: `${(v.value / max) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{v.label}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}