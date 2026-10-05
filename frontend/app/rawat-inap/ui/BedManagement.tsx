import { useState } from "react";
import {
    BedDouble,
    CheckCircle2,
    Users,
    Activity,
    AlertCircle,
    UserPlus,
    X,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import { cn } from "~/lib/utils";

export interface Bed {
    id: string;
    kamarName: string;
    kelas: "VIP" | "VIP B" | "I" | "II" | "III" | "ICU" | "ISOLASI";
    bedNumber: string;
    status: "Kosong" | "Terisi" | "Perawatan" | "Kritis";
    pasienName?: string;
    norm?: string;
    dpjp?: string;
}

const INITIAL_BEDS: Bed[] = [
    { id: "b1", kamarName: "Kamar Melati 01", kelas: "III", bedNumber: "Bed-01", status: "Terisi", pasienName: "Budi Santoso", norm: "RM-2026-0041", dpjp: "dr. Andi Prasetyo, Sp.PD" },
    { id: "b2", kamarName: "Kamar Melati 01", kelas: "III", bedNumber: "Bed-02", status: "Terisi", pasienName: "Ahmad Fauzi", norm: "RM-2026-0044", dpjp: "dr. Veronica Nguyen, Sp.N" },
    { id: "b3", kamarName: "Kamar Melati 01", kelas: "III", bedNumber: "Bed-03", status: "Kosong" },
    { id: "b4", kamarName: "Kamar Melati 01", kelas: "III", bedNumber: "Bed-04", status: "Perawatan" },

    { id: "b5", kamarName: "Kamar Melati 02", kelas: "III", bedNumber: "Bed-01", status: "Terisi", pasienName: "Dewi Lestari", norm: "RM-2026-0043", dpjp: "dr. Jennie Kim, Sp.A" },
    { id: "b6", kamarName: "Kamar Melati 02", kelas: "III", bedNumber: "Bed-02", status: "Kosong" },
    { id: "b7", kamarName: "Kamar Melati 02", kelas: "III", bedNumber: "Bed-03", status: "Kosong" },
    { id: "b8", kamarName: "Kamar Melati 02", kelas: "III", bedNumber: "Bed-04", status: "Terisi", pasienName: "Siti Rahma", norm: "RM-2026-0042", dpjp: "dr. Alexandra Boje, Sp.JP" },

    { id: "b9", kamarName: "Kamar Anggrek 01", kelas: "I", bedNumber: "Bed-01", status: "Terisi", pasienName: "Hendra Wijaya", norm: "RM-2026-0028", dpjp: "dr. Adam Hall, Sp.PD" },
    { id: "b10", kamarName: "Kamar Anggrek 01", kelas: "I", bedNumber: "Bed-02", status: "Kosong" },

    { id: "b11", kamarName: "Kamar Mawar 01 (VIP)", kelas: "VIP", bedNumber: "Bed-01", status: "Terisi", pasienName: "Rina Kusuma", norm: "RM-2026-0039", dpjp: "Prof. Dr. Niall Horan, Sp.OT" },

    { id: "b12", kamarName: "Kamar Teratai ICU", kelas: "ICU", bedNumber: "Bed-01", status: "Kritis", pasienName: "Ivan Saputra", norm: "RM-2026-0012", dpjp: "Dr. Alexandra Boje, Sp.JP" },
    { id: "b13", kamarName: "Kamar Teratai ICU", kelas: "ICU", bedNumber: "Bed-02", status: "Perawatan" },
];

export default function BedManagement({ onSelectAdmisi }: { onSelectAdmisi?: () => void }) {
    const [beds, setBeds] = useState<Bed[]>(INITIAL_BEDS);
    const [selectedKelasFilter, setSelectedKelasFilter] = useState<string>("Semua Kelas");
    const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

    const filteredBeds = beds.filter(b =>
        selectedKelasFilter === "Semua Kelas" || b.kelas === selectedKelasFilter
    );

    const totalBeds = beds.length;
    const occupiedCount = beds.filter(b => b.status === "Terisi" || b.status === "Kritis").length;
    const emptyCount = beds.filter(b => b.status === "Kosong").length;
    const maintenanceCount = beds.filter(b => b.status === "Perawatan").length;

    return (
        <div className="space-y-6">
            {/* Top Bar Stats */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <BedDouble className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Bed Management (Peta Kamar Bangsal)</h3>
                        <p className="text-xs text-slate-500">
                            Monitoring ketersediaan tempat tidur rawat inap realtime.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {["Semua Kelas", "VIP", "I", "II", "III", "ICU"].map((kelas) => (
                        <button
                            key={kelas}
                            type="button"
                            onClick={() => setSelectedKelasFilter(kelas)}
                            className={cn(
                                "rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                                selectedKelasFilter === kelas
                                    ? "bg-slate-900 text-white shadow-2xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            {kelas}
                        </button>
                    ))}
                </div>
            </div>

            {/* Legend Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span>Kosong ({emptyCount} Bed)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-blue-600" />
                    <span>Terisi ({occupiedCount} Bed)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-amber-500" />
                    <span>Sterilisasi/Maintenance ({maintenanceCount} Bed)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-600" />
                    <span>Kritikal (ICU)</span>
                </div>
            </div>

            {/* Bed Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredBeds.map((bed) => (
                    <div
                        key={bed.id}
                        onClick={() => setSelectedBed(bed)}
                        className={cn(
                            "flex flex-col justify-between rounded-2xl border bg-white p-4 transition-all cursor-pointer hover:shadow-md",
                            bed.status === "Kosong" ? "border-emerald-200 bg-emerald-50/20 hover:border-emerald-400" :
                            bed.status === "Terisi" ? "border-blue-200 bg-blue-50/20 hover:border-blue-400" :
                            bed.status === "Kritis" ? "border-rose-300 bg-rose-50/30 hover:border-rose-400" :
                            "border-amber-200 bg-amber-50/20 hover:border-amber-400"
                        )}
                    >
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    {bed.bedNumber}
                                </span>
                                <span className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                    bed.status === "Kosong" ? "bg-emerald-500 text-white" :
                                    bed.status === "Terisi" ? "bg-blue-600 text-white" :
                                    bed.status === "Kritis" ? "bg-rose-600 text-white animate-pulse" :
                                    "bg-amber-500 text-white"
                                )}>
                                    {bed.status}
                                </span>
                            </div>

                            <h4 className="mt-3 text-sm font-bold text-slate-900">{bed.kamarName}</h4>
                            <p className="text-xs text-slate-500 font-semibold">Kelas {bed.kelas}</p>

                            {bed.pasienName ? (
                                <div className="mt-3 space-y-1 text-xs bg-white p-2.5 rounded-xl border border-slate-200/80">
                                    <p className="font-bold text-slate-900 line-clamp-1">{bed.pasienName}</p>
                                    <p className="text-[11px] font-mono text-slate-400">{bed.norm}</p>
                                </div>
                            ) : (
                                <p className="mt-3 text-xs text-emerald-700 font-bold bg-white p-2 rounded-xl border border-emerald-100 text-center">
                                    Siap Ditempati Pasien
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected Bed Modal Detail */}
            {selectedBed && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">{selectedBed.kamarName}</h3>
                                <p className="text-xs text-slate-500">{selectedBed.bedNumber} • Kelas {selectedBed.kelas}</p>
                            </div>
                            <button onClick={() => setSelectedBed(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {selectedBed.pasienName ? (
                            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p><span className="text-slate-400">Pasien:</span> <strong className="text-slate-900">{selectedBed.pasienName}</strong></p>
                                <p><span className="text-slate-400">No. RM:</span> <strong className="font-mono text-slate-900">{selectedBed.norm}</strong></p>
                                <p><span className="text-slate-400">DPJP:</span> <strong>{selectedBed.dpjp}</strong></p>
                            </div>
                        ) : (
                            <div className="text-center p-4 text-xs bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900">
                                Tempat tidur ini dalam kondisi <strong>KOSONG & SIAP PAKAI</strong> untuk pendaftaran admisi baru.
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setSelectedBed(null)}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
