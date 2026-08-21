import { useState, type FormEvent } from "react";
import { AlertTriangle, FileCheck2, FileX2, FilePen, RefreshCw, ShieldCheck, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { FeatureShell } from "../ui/FeatureShell";

const actions = [
    { key: "sepsis", label: "Validasi Peserta", icon: ShieldCheck },
    { key: "sep", label: "Generate SEP", icon: FileCheck2 },
    { key: "update", label: "Update SEP", icon: FilePen },
    { key: "cancel", label: "Cancel SEP", icon: FileX2 },
];

export default function BridgingBPJS() {
    const [action, setAction] = useState("sep");
    const [noBpjs, setNoBpjs] = useState("");
    const [noSep, setNoSep] = useState("");
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    function handleActionClick(key: string, label: string) {
        setAction(key);
        setAlertMessage(`🚧 Fitur '${label}' Sedang Dalam Pengembangan. Integrasi VClaim BPJS versi terbaru sedang disiapkan.`);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const label = actions.find((a) => a.key === action)?.label ?? action;
        setAlertMessage(`🚧 Fitur '${label}' Sedang Dalam Pengembangan. Panggilan Web Service VClaim BPJS sedang dalam tahap integrasi.`);
    }

    function handleFeatureClick(name: string) {
        setAlertMessage(`🚧 Fitur '${name}' Sedang Dalam Pengembangan. Modul BPJS ini akan aktif pada rilis berikutnya.`);
    }

    return (
        <FeatureShell
            title="Bridging BPJS"
            subtitle="Validasi peserta, generate/update/cancel SEP, finger print, surat kontrol, dan cek rujukan"
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

            <div className="grid gap-5 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                    <div className="flex flex-wrap gap-2">
                        {actions.map((a) => (
                            <button
                                key={a.key}
                                type="button"
                                onClick={() => handleActionClick(a.key, a.label)}
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                                    action === a.key ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                )}
                            >
                                <a.icon className="h-3.5 w-3.5" /> {a.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500">Nomor Kartu BPJS *</label>
                            <input
                                value={noBpjs}
                                onChange={(e) => setNoBpjs(e.target.value.replace(/\D/g, "").slice(0, 13))}
                                placeholder="13 digit nomor BPJS"
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                required
                            />
                        </div>
                        {(action === "update" || action === "cancel") && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-500">Nomor SEP</label>
                                <input
                                    value={noSep}
                                    onChange={(e) => setNoSep(e.target.value)}
                                    placeholder="Nomor SEP"
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                        )}
                        <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-500 transition-colors">
                            <RefreshCw className="h-4 w-4" /> Proses Bridging BPJS
                        </button>
                    </form>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Fitur BPJS Lainnya</h2>
                    <div className="mt-3 space-y-2">
                        {["Finger Print BPJS", "Surat Kontrol & SKDP", "Cek Rujukan Faskes", "Riwayat Histori SEP"].map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => handleFeatureClick(f)}
                                className="w-full text-left rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all flex items-center justify-between group"
                            >
                                <span>{f}</span>
                                <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 group-hover:bg-amber-200">Dev</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </FeatureShell>
    );
}
