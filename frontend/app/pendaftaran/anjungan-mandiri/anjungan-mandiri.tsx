import { useState } from "react";
import { AlertTriangle, CreditCard, Fingerprint, MonitorSmartphone, ScanLine, Ticket, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { FeatureShell } from "../ui/FeatureShell";

const modes = [
    { key: "KTP", label: "Scan KTP", icon: CreditCard },
    { key: "BPJS", label: "Scan BPJS", icon: Fingerprint },
    { key: "KARTU", label: "Scan Kartu Pasien", icon: ScanLine },
    { key: "QR", label: "Scan QR Code", icon: MonitorSmartphone },
];

export default function AnjunganMandiri() {
    const [mode, setMode] = useState("KTP");
    const [nik, setNik] = useState("");
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    function validasi() {
        setAlertMessage(`🚧 Fitur Anjungan Mandiri (Kiosk) Sedang Dalam Pengembangan. Integrasi perangkat keras scanner ${mode} dan tiket antrean sedang dikembangkan.`);
    }

    function handleModeClick(key: string, label: string) {
        setMode(key);
        setAlertMessage(`🚧 Fitur Mode '${label}' Sedang Dalam Pengembangan. Koneksi ke scanner ${label} fisik sedang dikonfigurasi.`);
    }

    function handleStepClick(stepName: string) {
        setAlertMessage(`🚧 Fitur Langkah '${stepName}' Sedang Dalam Pengembangan.`);
    }

    return (
        <FeatureShell
            title="Registrasi Anjungan Mandiri (Kiosk)"
            subtitle="Simulasi antarmuka anjungan mandiri untuk pasien mendaftar sendiri"
            actions={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-600">
                    <Ticket className="h-3.5 w-3.5" /> Antrean dihasilkan otomatis
                </span>
            }
        >
            {/* Banner Notifikasi UI Alert */}
            {alertMessage && (
                <div className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shadow-2xs">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-amber-900">Fitur Dalam Pengembangan</p>
                            <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">{alertMessage}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setAlertMessage(null)}
                        className="rounded-lg p-1 text-amber-600 hover:bg-amber-100 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Validasi Identitas Kiosk</h2>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                        {modes.map((m) => (
                            <button
                                key={m.key}
                                type="button"
                                onClick={() => handleModeClick(m.key, m.label)}
                                className={cn(
                                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[11px] font-semibold transition-colors",
                                    mode === m.key
                                        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                <m.icon className="h-5 w-5" />
                                {m.label}
                            </button>
                        ))}
                    </div>

                    <label className="mt-5 block text-xs font-semibold text-slate-500">Nomor Identitas Pasien (NIK)</label>
                    <input
                        value={nik}
                        onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
                        placeholder="16 digit NIK"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-center text-lg font-mono tracking-widest focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={validasi}
                        className="mt-3 w-full rounded-lg bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-colors"
                    >
                        Validasi Identitas Pasien
                    </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Alur Anjungan Mandiri</h2>
                    <div className="mt-4 space-y-2.5">
                        {["Scan KTP / Kartu BPJS", "Pilih Poli Tujuan", "Pilih Dokter & Jam", "Generate Nomor Antrean", "Cetak Tiket Antrean"].map((step, i) => (
                            <button
                                key={step}
                                type="button"
                                onClick={() => handleStepClick(step)}
                                className="w-full flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-left hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                                        {i + 1}
                                    </span>
                                    <span className="font-medium text-slate-700 group-hover:text-indigo-900">{step}</span>
                                </div>
                                <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5">Dev</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </FeatureShell>
    );
}
