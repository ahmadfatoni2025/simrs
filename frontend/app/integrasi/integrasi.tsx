import { useState } from "react";
import { useSearchParams } from "react-router";
import {
    Network,
    RefreshCw,
    ShieldCheck,
    Building2,
    CheckCircle2,
    Activity,
    Search,
    Filter,
    QrCode,
    Cpu,
    ExternalLink,
    FileText,
    Key
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

export default function IntegrasiPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get("tab") || "bpjs";

    const tabs = [
        { id: "bpjs", label: "BPJS V-Claim & HFIS", icon: ShieldCheck },
        { id: "satusehat", label: "SATUSEHAT Kemenkes", icon: Network },
        { id: "sitb", label: "SITB (Tuberkulosis)", icon: Activity },
        { id: "rs-online", label: "RS Online & Apotek Online", icon: Building2 },
    ];

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white shadow-lg">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">
                                <Network className="h-4 w-4" /> Modul Integrasi & Bridging Eksternal
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight">Hub Integrasi BPJS, SATUSEHAT & Portal Resmi</h1>
                            <p className="mt-1 text-xs text-blue-100 max-w-2xl">
                                Pusat pemantauan konektivitas API bridging BPJS Kesehatan (V-Claim, HFIS, Antrean), SATUSEHAT Kemenkes (FHIR / Encounter), SITB, dan RS Online.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-all shadow-md active:scale-98"
                            >
                                <RefreshCw className="h-4 w-4" /> Sync Ulang API Status
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Integration Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">BPJS V-Claim API</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-3 text-xl font-extrabold text-slate-900">Terhubung (Online)</p>
                        <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Latency: 124ms</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">SATUSEHAT FHIR Engine</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-3 text-xl font-extrabold text-slate-900">Encounter Ready</p>
                        <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Org ID: 100028491</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Pelaporan SITB TB</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Activity className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-3 text-xl font-extrabold text-slate-900">12 Pasien Terlaporkan</p>
                        <p className="mt-1 text-[11px] text-slate-400 font-medium">Bulan September 2026</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">RS Online Tempat Tidur</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <Building2 className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-3 text-xl font-extrabold text-slate-900">Auto Sync Active</p>
                        <p className="mt-1 text-[11px] text-slate-400 font-medium">Sync per 15 menit</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = currentTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setSearchParams({ tab: tab.id })}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Main Interface */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Daftar Log Transaksi & Bridging Endpoint</h3>
                            <p className="text-xs text-slate-500">Status sinkronisasi data riil dengan server Kementerian Kesehatan & BPJS</p>
                        </div>
                        <button type="button" className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                            <Key className="h-3.5 w-3.5 text-slate-500" /> API Secret Credentials
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Timestamp Sync</th>
                                    <th className="px-4 py-3">Endpoint API</th>
                                    <th className="px-4 py-3">Ref ID / SEP</th>
                                    <th className="px-4 py-3">HTTP Status</th>
                                    <th className="px-4 py-3">Keterangan</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/80 text-slate-700 font-medium">
                                {[
                                    { time: "28/09/2026 22:15", endpoint: "POST /vclaim-rest/SEP/2.0/insert", ref: "0001R0010926V00012", status: "200 OK", note: "SEP Rawat Jalan Berhasil Diterbitkan" },
                                    { time: "28/09/2026 22:10", endpoint: "POST /satusehat/Encounter", ref: "enc-992182-412", status: "201 Created", note: "Encounter Pendaftaran synced to Kemenkes" },
                                    { time: "28/09/2026 21:45", endpoint: "GET /hfis/ref/dokter", ref: "DR-HFIS-102", status: "200 OK", note: "Jadwal Dokter HFIS BPJS Synchronized" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3 text-slate-500">{row.time}</td>
                                        <td className="px-4 py-3 font-mono text-slate-800 font-bold">{row.endpoint}</td>
                                        <td className="px-4 py-3 font-bold text-slate-900">{row.ref}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{row.note}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button type="button" className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline">
                                                Payload <ExternalLink className="h-3 w-3" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
