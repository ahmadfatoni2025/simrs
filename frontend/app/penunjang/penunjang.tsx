import { useState } from "react";
import { useSearchParams } from "react-router";
import {
    FlaskConical,
    FileText,
    Activity,
    Stethoscope,
    Syringe,
    Calendar,
    Clock,
    Search,
    CheckCircle2,
    Sparkles,
    Eye,
    Printer,
    Download,
    AlertCircle
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

export type PenunjangTab =
    | "laboratorium"
    | "radiologi"
    | "rehab-medik"
    | "mcu"
    | "operasi";

interface LabOrder {
    id: string;
    noOrder: string;
    pasien: string;
    norm: string;
    dokter: string;
    poli: string;
    jenis: string;
    waktu: string;
    status: "Menunggu Sampler" | "Pemeriksaan" | "Hasil Selesai";
    hasil?: { parameter: string; nilai: string; rujukan: string; satuan: string }[];
}

const MOCK_LAB_ORDERS: LabOrder[] = [
    {
        id: "lab-1",
        noOrder: "LAB-2026-0412",
        pasien: "Budi Santoso",
        norm: "RM-2026-0041",
        dokter: "dr. Andi Prasetyo, Sp.PD",
        poli: "Poli Umum",
        jenis: "Darah Lengkap + GDS + Ureum",
        waktu: "08:30 WIB",
        status: "Hasil Selesai",
        hasil: [
            { parameter: "Hemoglobin (Hb)", nilai: "14.2", rujukan: "13.0 - 17.5", satuan: "g/dL" },
            { parameter: "Leukosit", nilai: "8,500", rujukan: "4,000 - 10,000", satuan: "/µL" },
            { parameter: "Trombosit", nilai: "245,000", rujukan: "150,000 - 450,000", satuan: "/µL" },
            { parameter: "Gula Darah Sewaktu (GDS)", nilai: "115", rujukan: "< 140", satuan: "mg/dL" },
        ]
    },
    {
        id: "lab-2",
        noOrder: "LAB-2026-0413",
        pasien: "Siti Rahma",
        norm: "RM-2026-0042",
        dokter: "dr. Maya Kartika, Sp.A",
        poli: "Poli Anak",
        jenis: "Widal Test + Hematologi Rutin",
        waktu: "09:00 WIB",
        status: "Pemeriksaan"
    }
];

export default function PenunjangPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") || "laboratorium") as PenunjangTab;

    const setTab = (tab: string) => {
        if (tab === "laboratorium") setSearchParams({});
        else setSearchParams({ tab });
    };

    const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(MOCK_LAB_ORDERS[0]);

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Penunjang Medis SIMRS
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
                                <FlaskConical className="h-3.5 w-3.5" /> Lab, Radiologi, OK & MCU
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Pusat Pelayanan Laboratorium Patologi, Radiologi Diagnostic, Fisioterapi & Operasi.
                        </p>
                    </div>
                </div>

                {/* TAB 1: LABORATORIUM PATOLOGI */}
                {(activeTab === "laboratorium" || !searchParams.get("tab")) && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                                    Daftar Order Laboratorium Masuk
                                </h3>

                                <div className="space-y-3">
                                    {MOCK_LAB_ORDERS.map((ord) => (
                                        <div key={ord.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-purple-600">{ord.noOrder}</span>
                                                    <span className={cn(
                                                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                                        ord.status === "Hasil Selesai" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                                    )}>
                                                        {ord.status}
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-900 mt-1">{ord.pasien} ({ord.norm})</h4>
                                                <p className="text-xs text-slate-500">{ord.jenis} • DPJP: {ord.dokter}</p>
                                            </div>

                                            <button
                                                onClick={() => setSelectedOrder(ord)}
                                                className="inline-flex items-center gap-1 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-500 shadow-2xs"
                                            >
                                                <Eye className="h-3.5 w-3.5" /> Detail Hasil
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Detail Panel */}
                        <div className="space-y-4">
                            {selectedOrder ? (
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Hasil Laboratorium</h4>
                                        <button onClick={() => alert(`Mencetak Hasil Lab ${selectedOrder.noOrder}`)} className="text-xs text-purple-600 font-bold flex items-center gap-1">
                                            <Printer className="h-3.5 w-3.5" /> Cetak
                                        </button>
                                    </div>

                                    <div className="text-xs space-y-1">
                                        <p><span className="text-slate-400">Pasien:</span> <strong>{selectedOrder.pasien}</strong></p>
                                        <p><span className="text-slate-400">Pemeriksaan:</span> <strong>{selectedOrder.jenis}</strong></p>
                                    </div>

                                    {selectedOrder.hasil ? (
                                        <div className="space-y-2 border-t border-slate-100 pt-3">
                                            {selectedOrder.hasil.map((h, i) => (
                                                <div key={i} className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                    <div>
                                                        <p className="font-bold text-slate-900">{h.parameter}</p>
                                                        <span className="text-[10px] text-slate-400">Rujukan: {h.rujukan} {h.satuan}</span>
                                                    </div>
                                                    <span className="font-mono font-black text-purple-700">{h.nilai} {h.satuan}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                                            Pemeriksaan sedang berlangsung di ruang sampel.
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* TAB 2, 3, 4, 5 OTHER VIEWS */}
                {activeTab !== "laboratorium" && searchParams.get("tab") && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs text-center space-y-3">
                        <FlaskConical className="h-10 w-10 text-purple-600 mx-auto" />
                        <h3 className="text-base font-bold text-slate-900">
                            Modul {activeTab === "radiologi" ? "Radiologi Diagnostic (PACS)" : activeTab === "rehab-medik" ? "Rehab Medik & FISIO" : activeTab === "mcu" ? "Paket Medical Check Up (MCU)" : "Jadwal & Order Operasi (OK)"}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Modul penunjang medis SIMRS terintegrasi langsung dengan unit radiologi dan laboratorium.
                        </p>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
