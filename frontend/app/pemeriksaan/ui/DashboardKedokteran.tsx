import { useState } from "react";
import {
    Stethoscope,
    Users,
    ClipboardList,
    PillBottle,
    FlaskConical,
    FileText,
    Clock,
    CheckCircle2,
    Calendar,
    ChevronRight,
    Search,
    Sparkles,
    Activity,
    UserCheck,
    Star,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { Doctor, PatientRecord } from "../pemeriksaan";

interface DashboardKedokteranProps {
    doctors: Doctor[];
    patients: PatientRecord[];
    onSelectTab: (tab: string) => void;
    onSelectPatientForExam: (patient: PatientRecord) => void;
}

export default function DashboardKedokteran({
    doctors,
    patients,
    onSelectTab,
    onSelectPatientForExam
}: DashboardKedokteranProps) {
    const waitingPatients = patients.filter(p => p.status === "Menunggu");
    const activeExamPatients = patients.filter(p => p.status === "Sedang Diperiksa");
    const finishedPatients = patients.filter(p => p.status === "Selesai");

    return (
        <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Antrean Menunggu</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">{waitingPatients.length}</p>
                    <p className="mt-1 text-[11px] text-slate-400">Pasien di ruang tunggu poli</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Sedang Diperiksa</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold">
                            <Stethoscope className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">{activeExamPatients.length}</p>
                    <p className="mt-1 text-[11px] text-blue-600 font-medium">Sesi periksa aktif saat ini</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Pemeriksaan Selesai</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">{finishedPatients.length}</p>
                    <p className="mt-1 text-[11px] text-emerald-600 font-medium">Telah dilayani hari ini</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Dokter Bertugas</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold">
                            <UserCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">{doctors.length}</p>
                    <p className="mt-1 text-[11px] text-purple-600 font-medium">Dokter spesialis SIMRS</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Active Queue Table (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-600" />
                            <h3 className="text-base font-bold text-slate-900">
                                Daftar Antrean Pasien Poliklinik Hari Ini
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => onSelectTab("antrean")}
                            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            Lihat Semua Antrean <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200/80">
                                    <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        <th className="px-4 py-3">No. Antrean</th>
                                        <th className="px-4 py-3">Pasien</th>
                                        <th className="px-4 py-3">Poli & Dokter</th>
                                        <th className="px-4 py-3">Penjamin</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {patients.slice(0, 6).map((patient) => (
                                        <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-4 py-3.5 font-mono font-bold text-blue-600">
                                                {patient.queueNo}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <p className="font-bold text-slate-900">{patient.name}</p>
                                                <p className="text-[11px] text-slate-400 font-mono">{patient.norm}</p>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <p className="font-semibold text-slate-800">{patient.clinic}</p>
                                                <p className="text-[11px] text-slate-500">{patient.doctorName}</p>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className={cn(
                                                    "rounded-md px-2 py-0.5 text-[10px] font-bold",
                                                    patient.guarantee === "BPJS" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                                                )}>
                                                    {patient.guarantee}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                                                    patient.status === "Sedang Diperiksa"
                                                        ? "bg-blue-50 text-blue-700"
                                                        : patient.status === "Selesai"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-amber-50 text-amber-700"
                                                )}>
                                                    {patient.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => onSelectPatientForExam(patient)}
                                                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition-colors cursor-pointer"
                                                >
                                                    <Stethoscope className="h-3.5 w-3.5" />
                                                    <span>{patient.status === "Selesai" ? "Hasil" : "Periksa"}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Dokter On Duty & Quick Actions */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">Dokter On-Duty Hari Ini</h3>
                            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                {doctors.length} Aktif
                            </span>
                        </div>

                        <div className="space-y-3">
                            {doctors.slice(0, 4).map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <img src={doc.avatar} alt={doc.name} className="h-10 w-10 rounded-xl object-cover" />
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                                            <p className="text-[11px] text-slate-500">{doc.specialty}</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                        doc.status === "Praktik" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                                    )}>
                                        {doc.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
