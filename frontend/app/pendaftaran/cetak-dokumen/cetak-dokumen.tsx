import { useState } from "react";
import { FileText, Printer } from "lucide-react";
import { cn } from "~/lib/utils";
import { FeatureShell } from "../ui/FeatureShell";

const dokumenList = [
    "Bukti Registrasi",
    "Nomor Antrean",
    "Kartu Pasien",
    "Label Pasien",
    "Gelang Pasien",
    "SEP BPJS",
    "Surat Kontrol",
];

export default function CetakDokumen() {
    const [printed, setPrinted] = useState<string[]>([]);
    const [nomorKunjungan, setNomorKunjungan] = useState("");

    function cetak(doc: string) {
        setPrinted((p) => (p.includes(doc) ? p : [...p, doc]));
    }

    return (
        <FeatureShell
            title="Cetak Dokumen"
            subtitle="Cetak bukti registrasi, antrean, kartu pasien, dan dokumen pendukung lainnya"
        >
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <label className="block text-xs font-semibold text-slate-500">No. Kunjungan / Rekam Medis</label>
                <input
                    value={nomorKunjungan}
                    onChange={(e) => setNomorKunjungan(e.target.value)}
                    placeholder="cth: REG-00001 / RM-0001"
                    className="mt-1 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {dokumenList.map((doc) => {
                    const isPrinted = printed.includes(doc);
                    return (
                        <div key={doc} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", isPrinted ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600")}>
                                    <FileText className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-semibold text-slate-800">{doc}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => cetak(doc)}
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors",
                                    isPrinted ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-slate-800 text-white hover:bg-slate-700"
                                )}
                            >
                                <Printer className="h-3.5 w-3.5" />
                                {isPrinted ? "Cetak Lagi" : "Cetak"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </FeatureShell>
    );
}
