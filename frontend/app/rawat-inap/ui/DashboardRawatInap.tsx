import { useState } from "react";
import {
    BedDouble,
    Users,
    Activity,
    CheckCircle2,
    Clock,
    Sparkles,
    ChevronRight,
    UserPlus,
    FileText,
    ArrowLeftRight,
    LogOut,
    TrendingUp,
    ShieldCheck
} from "lucide-react";
import { cn } from "~/lib/utils";

interface InpatientRecord {
    id: string;
    norm: string;
    namaPasien: string;
    kamar: string;
    kelas: string;
    bedNo: string;
    dpjp: string;
    diagnosaMasuk: string;
    tglMasuk: string;
    status: "Perawatan" | "Rencana Pulang" | "Kritis";
    guarantee: "BPJS" | "Umum" | "Asuransi";
}

const MOCK_INPATIENTS: InpatientRecord[] = [
    { id: "1", norm: "RM-2026-0039", namaPasien: "Rina Kusuma", kamar: "Kamar Mawar 01", kelas: "VIP B", bedNo: "Bed-01", dpjp: "Prof. Dr. Niall Horan, Sp.OT", diagnosaMasuk: "Post Fraktur Femur Dextra", tglMasuk: "01 Okt 2026", status: "Perawatan", guarantee: "Umum" },
    { id: "2", norm: "RM-2026-0044", namaPasien: "Ahmad Fauzi", kamar: "Kamar Melati 01", kelas: "III", bedNo: "Bed-02", dpjp: "Dr. Veronica Nguyen, Sp.N", diagnosaMasuk: "Stroke Iskemik Akut", tglMasuk: "03 Okt 2026", status: "Kritis", guarantee: "BPJS" },
    { id: "3", norm: "RM-2026-0028", namaPasien: "Hendra Wijaya", kamar: "Kamar Anggrek 01", kelas: "I", bedNo: "Bed-01", dpjp: "Dr. Adam Hall, Sp.PD", diagnosaMasuk: "DHF Grade II", tglMasuk: "02 Okt 2026", status: "Rencana Pulang", guarantee: "Asuransi" },
    { id: "4", norm: "RM-2026-0015", namaPasien: "Maya Putri", kamar: "Kamar Cempaka 02", kelas: "II", bedNo: "Bed-03", dpjp: "Dr. Jennie Kim, Sp.A", diagnosaMasuk: "Bronkopneumonia", tglMasuk: "04 Okt 2026", status: "Perawatan", guarantee: "BPJS" },
];

interface DashboardRawatInapProps {
    onSelectTab: (tab: string) => void;
}

export default function DashboardRawatInap({ onSelectTab }: DashboardRawatInapProps) {
    const patients = MOCK_INPATIENTS;

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl border border-slate-800">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                                <Sparkles className="h-3.5 w-3.5" /> Rawat Inap & Bangsal SIMRS
                            </span>
                            <span className="text-xs text-slate-400">Bed Management System</span>
                        </div>
                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            Pelayanan Rawat Inap & Monitoring Pasien
                        </h2>
                        <p className="mt-1 text-xs text-slate-300 max-w-xl">
                            Peta ketersediaan tempat tidur, admisi booking bed, CPPT perawat bangsal, monitoring vital signs EWS, transfer mutasi, & discharge planning.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => onSelectTab("beds")}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 active:scale-98 transition-all cursor-pointer"
                        >
                            <BedDouble className="h-4 w-4" /> Peta Kamar (Bed Map)
                        </button>
                        <button
                            type="button"
                            onClick={() => onSelectTab("admisi")}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all cursor-pointer"
                        >
                            <UserPlus className="h-4 w-4 text-emerald-400" /> Admisi Pasien
                        </button>
                    </div>
                </div>
            </div>

            {/* Room Capacity Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Total Tempat Tidur</span>
                        <BedDouble className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">30 Bed</p>
                    <span className="text-[11px] text-slate-400 font-medium">Kapasitas Maksimal RS</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Kamar Terisi (BOR 70%)</span>
                        <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-600">18 Bed</p>
                    <span className="text-[11px] text-emerald-600 font-bold">Sedang Dirawat</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Bed Ready (Kosong)</span>
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-blue-600">7 Bed</p>
                    <span className="text-[11px] text-blue-600 font-bold">Siap Pakai / Admisi</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Perawatan / Cleaning</span>
                        <Activity className="h-5 w-5 text-amber-600" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-amber-600">5 Bed</p>
                    <span className="text-[11px] text-amber-600 font-bold">Sterilisasi Tempat Tidur</span>
                </div>
            </div>

            {/* Active Inpatients Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">Daftar Pasien Rawat Inap Aktif</h3>
                    <button onClick={() => onSelectTab("beds")} className="text-xs font-bold text-blue-600 hover:underline">
                        Lihat Peta Bangsal Complete →
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px]">
                            <tr>
                                <th className="px-4 py-3">Pasien & RM</th>
                                <th className="px-4 py-3">Lokasi Kamar & Bed</th>
                                <th className="px-4 py-3">Kelas</th>
                                <th className="px-4 py-3">DPJP Dokter</th>
                                <th className="px-4 py-3">Diagnosa Masuk</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {patients.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <p className="font-bold text-slate-900">{p.namaPasien}</p>
                                        <p className="text-[11px] font-mono text-slate-400">{p.norm}</p>
                                    </td>
                                    <td className="px-4 py-3.5 font-semibold text-blue-700">
                                        {p.kamar} ({p.bedNo})
                                    </td>
                                    <td className="px-4 py-3.5 font-bold text-slate-700">{p.kelas}</td>
                                    <td className="px-4 py-3.5 text-slate-600 font-medium">{p.dpjp}</td>
                                    <td className="px-4 py-3.5 text-slate-600">{p.diagnosaMasuk}</td>
                                    <td className="px-4 py-3.5">
                                        <span className={cn(
                                            "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                                            p.status === "Kritis" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                                            p.status === "Rencana Pulang" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                            "bg-blue-50 text-blue-700 border border-blue-200"
                                        )}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <button
                                            type="button"
                                            onClick={() => onSelectTab("cppt")}
                                            className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800"
                                        >
                                            CPPT & Vitals
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
