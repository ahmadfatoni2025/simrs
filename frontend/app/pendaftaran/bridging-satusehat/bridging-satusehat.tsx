import { useState } from "react";
import { Network, RefreshCw } from "lucide-react";
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
    const [syncing, setSyncing] = useState<string | null>(null);
    const [done, setDone] = useState<string[]>([]);

    function sync(key: string) {
        setSyncing(key);
        setTimeout(() => {
            setSyncing(null);
            setDone((d) => (d.includes(key) ? d : [...d, key]));
        }, 1200);
    }

    return (
        <FeatureShell
            title="Bridging SATUSEHAT"
            subtitle="Sinkronisasi data ke platform SATUSEHAT (FHIR)"
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {entities.map((e) => {
                    const isDone = done.includes(e.key);
                    return (
                        <div key={e.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", isDone ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                                    <Network className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-800">{e.label}</p>
                                    <p className="text-xs text-slate-400">{e.desc}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => sync(e.key)}
                                disabled={syncing === e.key}
                                className={cn(
                                    "mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors",
                                    isDone ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-indigo-600 text-white hover:bg-indigo-500",
                                    syncing === e.key && "opacity-60"
                                )}
                            >
                                <RefreshCw className={cn("h-3.5 w-3.5", syncing === e.key && "animate-spin")} />
                                {syncing === e.key ? "Menyinkronkan..." : isDone ? "Tersinkron ✓" : "Sinkronkan"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </FeatureShell>
    );
}
