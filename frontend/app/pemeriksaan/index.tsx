import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import {
    Clock,
    Stethoscope,
    CheckCircle2,
    UserCheck,
    Activity,
    ChevronRight,
    Search,
    Sparkles,
    Calendar,
    ArrowRight,
    RefreshCw,
    PillBottle,
    FlaskConical,
    FileText,
    Users,
    AlertCircle,
    User
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { Doctor, PatientRecord } from "./types";
import {
    INITIAL_DOCTORS,
    getSavedPatients,
    savePatients,
    setActivePatientId,
    updatePatientStatus
} from "./mockData";
import { api } from "~/lib/api";

export default function PemeriksaanDashboardPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Handle backward compatibility for old query params like ?tab=antrean
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) {
            if (tab === "antrean") navigate("/pemeriksaan/antrean", { replace: true });
            else if (tab === "pemeriksaan" || tab === "anamnesis") navigate("/pemeriksaan/anamnesis", { replace: true });
            else if (tab === "resep") navigate("/pemeriksaan/resep", { replace: true });
            else if (tab === "order") navigate("/pemeriksaan/order", { replace: true });
            else if (tab === "cppt") navigate("/pemeriksaan/cppt", { replace: true });
        }
    }, [searchParams, navigate]);

    const [patients, setPatients] = useState<PatientRecord[]>(() => getSavedPatients());
    const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
    const [loadingSync, setLoadingSync] = useState(false);
    const [searchFilter, setSearchFilter] = useState("");

    // Sync from database if available
    const handleSyncDB = async () => {
        setLoadingSync(true);
        try {
            const regRes = await api<{ data: any[] }>("/pendaftaran?per_page=100").catch(() => null);
            if (regRes?.data && Array.isArray(regRes.data) && regRes.data.length > 0) {
                const mapped: PatientRecord[] = regRes.data.map((r, idx) => ({
                    id: String(r.id ?? idx + 1),
                    queueNo: String(r.no ?? `A-0${idx + 10}`),
                    norm: String(r.rm ?? `RM-2026-00${idx + 10}`),
                    name: String(r.name ?? "Pasien SIMRS"),
                    age: 25 + ((idx * 7) % 40),
                    gender: idx % 2 === 0 ? "L" : "P",
                    clinic: String(r.poli ?? "Poli Umum"),
                    doctorName: String(r.dokter ?? "dr. Andi Prasetyo"),
                    arrivalTime: "08:00 WIB",
                    guarantee: idx % 2 === 0 ? "BPJS" : "Umum",
                    status: String(r.status ?? "").toLowerCase().includes("selesai") ? "Selesai" :
                        String(r.status ?? "").toLowerCase().includes("periksa") ? "Sedang Diperiksa" : "Menunggu",
                    chiefComplaint: `Pemeriksaan klinis rutin ${r.poli ?? 'Poli Umum'}`
                }));
                setPatients(mapped);
                savePatients(mapped);
            }
        } catch {
            // Keep current
        } finally {
            setLoadingSync(false);
        }
    };

    const handleStartExam = (patient: PatientRecord) => {
        setActivePatientId(patient.id);
        updatePatientStatus(patient.id, "Sedang Diperiksa");
        navigate(`/pemeriksaan/anamnesis?patientId=${patient.id}`);
    };

    const waitingPatients = patients.filter(p => p.status === "Menunggu");
    const activeExamPatients = patients.filter(p => p.status === "Sedang Diperiksa");
    const finishedPatients = patients.filter(p => p.status === "Selesai");

    const filteredPatients = patients.filter(p => {
        const query = searchFilter.toLowerCase();
        return (
            p.name.toLowerCase().includes(query) ||
            p.norm.toLowerCase().includes(query) ||
            p.queueNo.toLowerCase().includes(query) ||
            p.clinic.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            {/* Quick KPI Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-white p-5 shadow-2xs hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800">Antrean Menunggu</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white font-bold shadow-sm shadow-amber-500/20">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-black text-slate-900">{waitingPatients.length}</p>
                    <p className="mt-1 text-xs text-amber-700/80 font-medium">Pasien siap dipanggil ke ruang periksa</p>
                </div>

                <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-50/50 to-white p-5 shadow-2xs hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-800">Sedang Diperiksa</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/20">
                            <Stethoscope className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-black text-slate-900">{activeExamPatients.length}</p>
                    <p className="mt-1 text-xs text-blue-700/80 font-medium">Sesi pemeriksaan klinis aktif</p>
                </div>

                <div className="rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-2xs hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800">Pemeriksaan Selesai</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-500/20">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-black text-slate-900">{finishedPatients.length}</p>
                    <p className="mt-1 text-xs text-emerald-700/80 font-medium">Pelayanan tuntas hari ini</p>
                </div>

                <div className="rounded-3xl border border-purple-200/60 bg-gradient-to-br from-purple-50/50 to-white p-5 shadow-2xs hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-800">Dokter Praktik</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 text-white font-bold shadow-sm shadow-purple-500/20">
                            <UserCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-black text-slate-900">{doctors.length}</p>
                    <p className="mt-1 text-xs text-purple-700/80 font-medium">DPJP poliklinik bertugas aktif</p>
                </div>
            </div>

            {/* Quick Action Feature Banners */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    to="/pemeriksaan/anamnesis"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 p-5 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <div className="relative z-10 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="rounded-xl bg-white/20 p-2 text-white">
                                <Stethoscope className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Workstation Dokter</span>
                        </div>
                        <h3 className="text-lg font-black leading-snug">Pemeriksaan & Anamnesis (SOAP)</h3>
                        <p className="text-xs text-blue-100 leading-relaxed">
                            Input keluhan, tanda vital interaktif, fisik head-to-toe, dan diagnosa ICD-10 dengan cepat.
                        </p>
                        <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-white group-hover:underline">
                            Buka Ruang Pemeriksaan <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </Link>

                <Link
                    to="/pemeriksaan/antrean"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <div className="relative z-10 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="rounded-xl bg-white/10 p-2 text-white">
                                <Clock className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Antrean Poliklinik</span>
                        </div>
                        <h3 className="text-lg font-black leading-snug">Panggilan & Antrean Suara</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Panggil pasien berikutnya dengan audio speaker otomatis (Text-to-Speech) poliklinik.
                        </p>
                        <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-white group-hover:underline">
                            Buka Layar Panggilan <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </Link>

                <Link
                    to="/pemeriksaan/resep"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-800 p-5 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <div className="relative z-10 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="rounded-xl bg-white/20 p-2 text-white">
                                <PillBottle className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Resep Elektronik</span>
                        </div>
                        <h3 className="text-lg font-black leading-snug">E-Prescribing Depo Farmasi</h3>
                        <p className="text-xs text-emerald-100 leading-relaxed">
                            Resep obat langsung terkoneksi ke sistem apotek tanpa kertas, racikan & etiket siap saji.
                        </p>
                        <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-white group-hover:underline">
                            Buat Resep Pasien <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Main Content Grid: Patient Queue & Doctors Active */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Active Queue Table (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-600" />
                            <h3 className="text-base font-black text-slate-900">
                                Daftar Pasien Poliklinik Hari Ini
                            </h3>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                                {patients.length} Pasien
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                    placeholder="Cari pasien / No. RM..."
                                    className="rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => void handleSyncDB()}
                                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                title="Sinkronkan dengan Database SIMRS"
                            >
                                <RefreshCw className={cn("h-3.5 w-3.5 text-slate-500", loadingSync ? "animate-spin" : "")} />
                                Sync
                            </button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50/80 border-b border-slate-200/80">
                                    <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        <th className="px-4 py-3.5">Antrean</th>
                                        <th className="px-4 py-3.5">Pasien</th>
                                        <th className="px-4 py-3.5">Poli & DPJP</th>
                                        <th className="px-4 py-3.5">Penjamin</th>
                                        <th className="px-4 py-3.5">Status</th>
                                        <th className="px-4 py-3.5 text-right">Tindakan Klinis</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredPatients.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                                Tidak ada data pasien yang sesuai kriteria pencarian.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPatients.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-4 py-3.5">
                                                    <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                                                        {p.queueNo}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                        <span>{p.norm}</span>
                                                        <span>•</span>
                                                        <span>{p.age} th ({p.gender})</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="font-semibold text-slate-800">{p.clinic}</div>
                                                    <div className="text-[11px] text-slate-400">{p.doctorName}</div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span className={cn(
                                                        "rounded-md px-2 py-0.5 text-[10px] font-bold",
                                                        p.guarantee === "BPJS"
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            : "bg-blue-50 text-blue-700 border border-blue-200"
                                                    )}>
                                                        {p.guarantee}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold",
                                                        p.status === "Sedang Diperiksa"
                                                            ? "bg-blue-100 text-blue-800 animate-pulse"
                                                            : p.status === "Selesai"
                                                                ? "bg-emerald-100 text-emerald-800"
                                                                : "bg-amber-100 text-amber-800"
                                                    )}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStartExam(p)}
                                                        className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-2xs cursor-pointer transition-all"
                                                    >
                                                        <Stethoscope className="h-3.5 w-3.5" />
                                                        <span>Periksa</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Doctors on Duty & Quick Guidelines */}
                <div className="space-y-4">
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-purple-600" />
                                <h3 className="text-sm font-black text-slate-900">Dokter Spesialis Hari Ini</h3>
                            </div>
                            <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                                {doctors.length} Dokter
                            </span>
                        </div>

                        <div className="space-y-3">
                            {doctors.map((doc) => (
                                <div key={doc.id} className="flex items-center gap-3 rounded-2xl p-2.5 border border-slate-100 hover:border-slate-200 transition-all bg-slate-50/50">
                                    <img
                                        src={doc.avatar}
                                        alt={doc.name}
                                        className="h-10 w-10 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black text-slate-900 truncate">{doc.name}</h4>
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                                {doc.status}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 truncate">{doc.specialty}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{doc.room} • {doc.scheduleTime}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
