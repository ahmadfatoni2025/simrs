import { useState, type FormEvent } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { FeatureShell } from "../ui/FeatureShell";

const alasan = [
    "Salah Input",
    "Pasien Tidak Datang",
    "Jadwal Dokter Berubah",
    "Duplicate",
    "Permintaan Pasien",
];

const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";
const labelClass = "block text-xs font-semibold text-slate-500 mb-1";

export default function PembatalanRegistrasi() {
    const [noKunjungan, setNoKunjungan] = useState("");
    const [alasanPilih, setAlasanPilih] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [result, setResult] = useState<string | null>(null);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!alasanPilih) {
            setResult(null);
            return;
        }
        setResult(
            `Registrasi ${noKunjungan} dibatalkan. Alasan: ${alasanPilih}. Antrean & billing dibatalkan, audit log tersimpan.`
        );
    }

    return (
        <FeatureShell
            title="Pembatalan Registrasi"
            subtitle="Batalkan registrasi dengan alasan yang jelas; efek membatalkan antrean, billing, dan audit log"
        >
            <form onSubmit={handleSubmit} className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                    <XCircle className="h-4 w-4 text-red-500" /> Form Pembatalan
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>No. Kunjungan / RM *</label>
                        <input className={inputClass} value={noKunjungan} onChange={(e) => setNoKunjungan(e.target.value)} placeholder="REG-00001" required />
                    </div>
                    <div>
                        <label className={labelClass}>Alasan Pembatalan *</label>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {alasan.map((a) => (
                                <button
                                    key={a}
                                    type="button"
                                    onClick={() => setAlasanPilih(a)}
                                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                                        alasanPilih === a ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Keterangan Tambahan</label>
                        <textarea className={inputClass} rows={3} value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Detail alasan pembatalan" />
                    </div>
                    <button
                        type="submit"
                        disabled={!alasanPilih}
                        className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-40"
                    >
                        Batalkan Registrasi
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