import { useState } from "react";
import { BarChart3, Download } from "lucide-react";
import { cn } from "~/lib/utils";
import { FeatureShell } from "../ui/FeatureShell";

const laporan = [
    { label: "Registrasi Harian", periode: "Harian" },
    { label: "Registrasi Bulanan", periode: "Bulanan" },
    { label: "Pasien Baru", periode: "Beragam" },
    { label: "Pasien Lama", periode: "Beragam" },
    { label: "BPJS", periode: "Beragam" },
    { label: "Umum", periode: "Beragam" },
    { label: "Per Poli", periode: "Beragam" },
    { label: "Per Dokter", periode: "Beragam" },
    { label: "Statistik Antrean", periode: "Beragam" },
    { label: "Statistik Penjamin", periode: "Beragam" },
];

const exports = ["PDF", "Excel", "CSV"] as const;

export default function Laporan() {
    const [done, setDone] = useState<Record<string, string>>({});

    function exportLaporan(label: string, fmt: typeof exports[number]) {
        setDone((d) => ({ ...d, [label]: fmt }));
    }

    return (
        <FeatureShell
            title="Laporan"
            subtitle="Laporan registrasi dan statistik dengan ekspor PDF, Excel, atau CSV"
        >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {laporan.map((l) => {
                    const finished = done[l.label];
                    return (
                        <div key={l.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-slate-800">{l.label}</p>
                                    <p className="text-xs text-slate-400">Periode: {l.periode}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                {exports.map((f) => (
                                    <button
                                        key={f}
                                        type="button"
                                        onClick={() => exportLaporan(l.label, f)}
                                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-800 py-2 text-xs font-bold text-white hover:bg-slate-700"
                                    >
                                        <Download className="h-3 w-3" /> {f}
                                    </button>
                                ))}
                            </div>
                            {finished && (
                                <p className="mt-2 text-[11px] font-medium text-emerald-600">Terkonfirmasi: {finished} berhasil diekspor.</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </FeatureShell>
    );
}