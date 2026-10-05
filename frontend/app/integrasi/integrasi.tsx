import { useState } from "react";
import { useSearchParams } from "react-router";
import {
    Network,
    ShieldCheck,
    Activity,
    Building2,
    Calendar,
    RefreshCw,
    CheckCircle2,
    Sparkles,
    Search,
    FileText
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

export type IntegrasiTab =
    | "bpjs"
    | "satusehat"
    | "sitb"
    | "rs-online";

export default function IntegrasiPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") || "bpjs") as IntegrasiTab;

    const setTab = (tab: string) => {
        if (tab === "bpjs") setSearchParams({});
        else setSearchParams({ tab });
    };

    const [nokartu, setNokartu] = useState("0001234567890");
    const [nik, setNik] = useState("3529012345670001");
    const [sepResult, setSepResult] = useState<any>(null);

    const handleCekBPJS = () => {
        setSepResult({
            peserta: "Budi Santoso",
            nokartu,
            nik,
            hakKelas: "Kelas 1",
            status: "AKTIF",
            faskes1: "Puskesmas Kenanga"
        });
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Integrasi & Bridging Sistem External
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                                <Network className="h-3.5 w-3.5" /> BPJS & SATUSEHAT API
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Bridging V-Claim BPJS Kesehatan v2.0, SATUSEHAT Kemenkes FHIR R4, SITB TB & SIRANAP.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>05 Oktober 2026</span>
                    </div>
                </div>

                {/* Sub-menu Tabs */}
                <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200/60 shadow-inner overflow-x-auto scrollbar-none">
                    {[
                        { id: "bpjs", label: "BPJS V-Claim & HFIS", icon: ShieldCheck },
                        { id: "satusehat", label: "SATUSEHAT Kemenkes", icon: Network },
                        { id: "sitb", label: "SITB (Tuberkulosis)", icon: Activity },
                        { id: "rs-online", label: "RS Online & Apotek Online", icon: Building2 },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = activeTab === tab.id || (activeTab === ("" as any) && tab.id === "bpjs");
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                                    isSelected
                                        ? "bg-white text-blue-700 shadow-sm font-bold"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* TAB 1: BPJS BRIDGING V-CLAIM */}
                {(activeTab === "bpjs" || !searchParams.get("tab")) && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                                    Cek Peserta & Bridging SEP V-Claim 2.0
                                </h3>

                                <div className="space-y-3 text-xs">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">No. Kartu BPJS</label>
                                            <input
                                                type="text"
                                                value={nokartu}
                                                onChange={(e) => setNokartu(e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">NIK Kependudukan</label>
                                            <input
                                                type="text"
                                                value={nik}
                                                onChange={(e) => setNik(e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCekBPJS}
                                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-500 cursor-pointer"
                                    >
                                        Ping & Cek Kepesertaan BPJS
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel */}
                        <div className="space-y-4">
                            {sepResult ? (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-2xs space-y-3">
                                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                                        <h4 className="text-xs font-bold text-emerald-900">Status Peserta BPJS</h4>
                                        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                            {sepResult.status}
                                        </span>
                                    </div>
                                    <div className="text-xs space-y-1 text-emerald-950">
                                        <p><span className="text-emerald-700">Nama:</span> <strong>{sepResult.peserta}</strong></p>
                                        <p><span className="text-emerald-700">Hak Kelas:</span> <strong>{sepResult.hakKelas}</strong></p>
                                        <p><span className="text-emerald-700">Faskes I:</span> <strong>{sepResult.faskes1}</strong></p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* OTHER TABS */}
                {activeTab !== "bpjs" && searchParams.get("tab") && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs text-center space-y-3">
                        <Network className="h-10 w-10 text-blue-600 mx-auto" />
                        <h3 className="text-base font-bold text-slate-900">
                            Bridging Integrasi — {activeTab.toUpperCase()}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Platform integrasi standar Kemenkes SATUSEHAT FHIR R4, SITB, dan SIRANAP Online RS.
                        </p>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
