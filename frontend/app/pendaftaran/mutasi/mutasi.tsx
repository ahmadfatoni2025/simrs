import { useState, type FormEvent } from "react";
import { ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { FeatureShell } from "../ui/FeatureShell";

const jenisMutasi = [
    "Ganti Poli",
    "Ganti Dokter",
    "Ganti Penjamin",
    "Ganti Jadwal",
    "Koreksi Data",
];

const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";
const labelClass = "block text-xs font-semibold text-slate-500 mb-1";

export default function MutasiRegistrasi() {
    const [jenis, setJenis] = useState(jenisMutasi[0]!);
    const [noKunjungan, setNoKunjungan] = useState("");
    const [alasan, setAlasan] = useState("");
    const [result, setResult] = useState<string | null>(null);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setResult(`Mutasi "${jenis}" untuk ${noKunjungan} berhasil diajukan. Data akan diverifikasi sistem.`);
    }

    return (
        <FeatureShell
            title="Mutasi Registrasi"
            subtitle="Ganti poli, dokter, penjamin, jadwal, atau koreksi data registrasi"
        >
            <form onSubmit={handleSubmit} className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">Form Mutasi</h2>
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Jenis Mutasi *</label>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {jenisMutasi.map((j) => (
                                <button
                                    key={j}
                                    type="button"
                                    onClick={() => setJenis(j)}
                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                                        jenis === j ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    <ArrowLeftRight className="h-3.5 w-3.5" /> {j}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>No. Kunjungan / RM *</label>
                            <input className={inputClass} value={noKunjungan} onChange={(e) => setNoKunjungan(e.target.value)} placeholder="REG-00001" required />
                        </div>
                        <div>
                            <label className={labelClass}>Alasan Mutasi</label>
                            <input className={inputClass} value={alasan} onChange={(e) => setAlasan(e.target.value)} placeholder="Alasan mutasi" />
                        </div>
                    </div>
                    <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-500">
                        Simpan Mutasi
                    </button>
                </div>
            </form>
            {result && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 max-w-2xl">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {result}
                </div>
            )}
        </FeatureShell>
    );
}