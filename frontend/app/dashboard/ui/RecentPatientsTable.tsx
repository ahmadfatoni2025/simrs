import type { RegistrationRow } from "~/lib/api";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";

const statusColor: Record<string, string> = {
    Menunggu: "bg-amber-100/80 text-amber-700",
    Diperiksa: "bg-purple-100/80 text-[#6344f5]",
    Selesai: "bg-emerald-100/80 text-emerald-700",
};

export function RecentPatientsTable({ rows }: { rows: RegistrationRow[] }) {
    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Pendaftaran Pasien Terbaru</h2>
                <button className="rounded-full bg-[#6344f5] px-4 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#5232e0] transition-all">
                    + Daftar Baru
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="px-6 py-3 font.semibold">No. Pendaftaran</th>
                            <th className="px-6 py-3 font-semibold">Nama Pasien</th>
                            <th className="px-6 py-3 font-semibold">Poli</th>
                            <th className="px-6 py-3 font-semibold">Dokter</th>
                            <th className="px-6 py-3 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/70">
                        {rows.map((p) => (
                            <tr key={p.no} className="hover:bg-purple-50/30 transition-colors">
                                <td className="px-6 py-3.5 font-mono text-xs text-slate-400 font-medium">{p.no}</td>
                                <td className="px-6 py-3.5 font-bold text-slate-900">{p.name}</td>
                                <td className="px-6 py-3.5 text-slate-600 font-medium">{p.poli}</td>
                                <td className="px-6 py-3.5 text-slate-600 font-medium">{p.dokter}</td>
                                <td className="px-6 py-3.5">
                                    <Badge className={statusColor[p.status] ?? "bg-slate-100 text-slate-600"}>
                                        {p.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}