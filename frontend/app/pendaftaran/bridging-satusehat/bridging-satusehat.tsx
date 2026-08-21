import { useState } from "react";
import { AlertTriangle, Network, RefreshCw, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { FeatureShell } from "../ui/FeatureShell";

const entities = [
    { key: "pasien", label: "Sinkronisasi Pasien", desc: "FHIR Patient" },
    { key: "encounter", label: "Sinkronisasi Encounter", desc: "FHIR Encounter" },
    { key: "organization", label: "Sinkronisasi Organization", desc: "FHIR Organization" },
    { key: "practitioner", label: "Sinkronisasi Practitioner", desc: "FHIR Practitioner" },
    { key: "appointment", label: "Sinkronisasi Appointment", desc: "FHIR Appointment" },
];

export default function BridgingSATUSEHAT() {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    function sync(label: string) {
        setAlertMessage(`🚧 Fitur '${label}' Sedang Dalam Pengembangan. Integrasi API FHIR SATUSEHAT Kemkes RI sedang disiapkan.`);
    }

    return (
        <FeatureShell
            title="Bridging SATUSEHAT"
            subtitle="Sinkronisasi data ke platform SATUSEHAT (FHIR Kemkes RI)"
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

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {entities.map((e) => {
                    return (
                        <div key={e.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    <Network className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-800">{e.label}</p>
                                    <p className="text-xs text-slate-400">{e.desc}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => sync(e.label)}
                                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                Sinkronkan FHIR
                            </button>
                        </div>
                    );
                })}
            </div>
        </FeatureShell>
    );
}
