import { useState } from "react";
import { CreditCard, Fingerprint, MonitorSmartphone, ScanLine, Ticket } from "lucide-react";
import { cn } from "~/lib/utils";
import { EmptyState, FeatureShell } from "../ui/FeatureShell";

const modes = [
    { key: "KTP", label: "Scan KTP", icon: CreditCard },
    { key: "BPJS", label: "Scan BPJS", icon: Fingerprint },
    { key: "KARTU", label: "Scan Kartu Pasien", icon: ScanLine },
    { key: "QR", label: "Scan QR Code", icon: MonitorSmartphone },
];

export default function AnjunganMandiri() {
    const [mode, setMode] = useState("KTP");
    const [nik, setNik] = useState("");
    const [identitasValid, setIdentitasValid] = useState(false);

    function validasi() {
        setIdentitasValid(/^\d{16}$/.test(nik));
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
            <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Validasi Identitas</h2>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                        {modes.map((m) => (
                            <button
                                key={m.key}
                                type="button"
                                onClick={() => {
                                    setMode(m.key);
                                    setIdentitasValid(false);
                                }}
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

                    <label className="mt-5 block text-xs font-semibold text-slate-500">Nomor Identitas (NIK)</label>
                    <input
                        value={nik}
                        onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
                        placeholder="16 digit NIK"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-center text-lg font-mono tracking-widest focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={validasi}
                        disabled={!nik}
                        className="mt-3 w-full rounded-lg bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
                    >
                        Validasi Identitas
                    </button>

                    {identitasValid ? (
                        <p className="mt-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                            Identitas valid. Silakan pilih poli dan dokter pada langkah berikutnya.
                        </p>
                    ) : (
                        nik && !identitasValid && (
                            <p className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                NIK harus terdiri dari 16 digit angka.
                            </p>
                        )
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Langkah Selanjutnya</h2>
                    {identitasValid ? (
                        <div className="mt-4 space-y-2.5">
                            {["Pilih Poli", "Pilih Dokter", "Pilih Jadwal", "Generate Antrean", "Cetak Tiket"].map((step, i) => (
                                <div
                                    key={step}
                                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                                        {i + 1}
                                    </span>
                                    <span className="font-medium text-slate-700">{step}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<ScanLine className="h-8 w-8 text-slate-300" />}
                            title="Validasi identitas terlebih dahulu"
                            description="Lakukan scan KTP/BPJS/Kartu pasien atau input NIK untuk melanjutkan."
                        />
                    )}
                </div>
            </div>
        </FeatureShell>
    );
}
