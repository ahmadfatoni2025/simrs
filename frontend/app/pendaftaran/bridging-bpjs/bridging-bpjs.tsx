import { useState, type FormEvent } from "react";
import { FileCheck2, FileX2, FilePen, RefreshCw, ShieldCheck } from "lucide-react";
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
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        if (!/^\d{13}$/.test(noBpjs)) {
            setError("Nomor BPJS harus 13 digit.");
            return;
        }
        const label = actions.find((a) => a.key === action)?.label ?? action;
        setResult(`${label} berhasil dilakukan untuk peserta ${noBpjs}${noSep ? ` · SEP ${noSep}` : ""}.`);
    }

    return (
        <FeatureShell
            title="Bridging BPJS"
            subtitle="Validasi peserta, generate/update/cancel SEP, finger print, surat kontrol, dan cek rujukan"
        >
            <div className="grid gap-5 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                    <div className="flex flex-wrap gap-2">
                        {actions.map((a) => (
                            <button
                                key={a.key}
                                type="button"
                                onClick={() => setAction(a.key)}
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
                        <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-500">
                            <RefreshCw className="h-4 w-4" /> Proses
                        </button>
                    </form>

                    {error && <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
                    {result && <p className="mt-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{result}</p>}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Fitur Lainnya</h2>
                    <div className="mt-3 space-y-2">
                        {["Finger Print", "Surat Kontrol", "Cek Rujukan", "Riwayat SEP"].map((f) => (
                            <div key={f} className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-600">
                                {f}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </FeatureShell>
    );
}
