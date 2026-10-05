import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
    Stethoscope,
    Building2,
    UserCheck,
    ClipboardList,
    History as HistoryIcon,
    Search,
    Calendar,
    Clock,
    PillBottle,
    FlaskConical,
    FileText,
    LayoutDashboard,
    Sparkles,
    RefreshCw,
    X
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";
import TindakanTimeline from "./ui/TindakanTimeline";
import DashboardKedokteran from "./ui/DashboardKedokteran";
import AntreanPoliklinik from "./ui/AntreanPoliklinik";
import PemeriksaanAnamnesis from "./ui/PemeriksaanAnamnesis";
import EPrescribing from "./ui/EPrescribing";
import OrderPenunjang from "./ui/OrderPenunjang";
import CPPTResumeMedis from "./ui/CPPTResumeMedis";
import { api } from "~/lib/api";

// --- Types ---
export type KedokteranTabType =
    | "dashboard"
    | "antrean"
    | "pemeriksaan"
    | "resep"
    | "order"
    | "cppt"
    | "history";

export interface Category {
    id: string;
    name: string;
    labelShort: string;
    icon: any;
    count: number;
    color: string;
    bgLight: string;
}

export interface Doctor {
    id: string;
    name: string;
    title: string;
    specialty: string;
    categoryId: string;
    avatar: string;
    experienceYears: number;
    rating: number;
    reviewCount: string;
    totalPatients: string;
    fee: number;
    status: "Praktik" | "Istirahat" | "Dalam Pemeriksaan";
    scheduleTime: string;
    room: string;
    isFavorite?: boolean;
    nextAvailableDate: string;
    about: string;
}

export interface PatientRecord {
    id: string;
    queueNo: string;
    norm: string;
    name: string;
    age: number;
    gender: "L" | "P";
    clinic: string;
    doctorName: string;
    arrivalTime: string;
    guarantee: "BPJS" | "Umum" | "Asuransi Mandiri";
    status: "Menunggu" | "Sedang Diperiksa" | "Selesai" | "Batal";
    chiefComplaint: string;
    vitals?: {
        bp: string;
        hr: string;
        temp: string;
        spo2: string;
    };
    diagnosis?: string;
}

export interface HistoryItem {
    id: string;
    date: string;
    patientName: string;
    norm: string;
    doctorName: string;
    clinic: string;
    actionName: string;
    nominal: number;
    status: string;
    keterangan: string;
}

const FEMALE_AVATARS = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1594824813566-78a9c5123d47?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&auto=format&fit=crop&q=80",
];

const MALE_AVATARS = [
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80",
];

const SEEDED_DOCTORS: Doctor[] = [
    {
        id: "doc-1",
        name: "dr. Andi Prasetyo",
        title: "Sp.PD",
        specialty: "Poli Umum",
        categoryId: "gp",
        avatar: MALE_AVATARS[0],
        experienceYears: 10,
        rating: 4.9,
        reviewCount: "5.4K",
        totalPatients: "8,920",
        fee: 200000,
        status: "Praktik",
        scheduleTime: "08.00 AM - 14.00 PM",
        room: "Poli Umum R.101",
        isFavorite: true,
        nextAvailableDate: "Hari Ini, 05 Okt 2026",
        about: "dr. Andi Prasetyo adalah dokter umum senior berdedikasi tinggi di SIMRS."
    },
    {
        id: "doc-2",
        name: "dr. Maya Kartika",
        title: "Sp.A",
        specialty: "Poli Anak",
        categoryId: "pediatri",
        avatar: FEMALE_AVATARS[0],
        experienceYears: 8,
        rating: 4.8,
        reviewCount: "4.2K",
        totalPatients: "6,120",
        fee: 250000,
        status: "Praktik",
        scheduleTime: "08.00 AM - 14.00 PM",
        room: "Poli Anak R.102",
        isFavorite: false,
        nextAvailableDate: "Hari Ini, 05 Okt 2026",
        about: "Spesialis kesehatan dan tumbuh kembang anak."
    }
];

const SEEDED_PATIENTS: PatientRecord[] = [
    {
        id: "pat-1",
        queueNo: "A-012",
        norm: "RM-2026-0041",
        name: "Budi Santoso",
        age: 34,
        gender: "L",
        clinic: "Poli Umum",
        doctorName: "dr. Andi Prasetyo",
        arrivalTime: "08:15 WIB",
        guarantee: "BPJS",
        status: "Sedang Diperiksa",
        chiefComplaint: "Pemeriksaan medis rutin dan kontrol kesehatan",
        vitals: { bp: "120/80", hr: "78 bpm", temp: "36.6 °C", spo2: "98%" }
    },
    {
        id: "pat-2",
        queueNo: "A-013",
        norm: "RM-2026-0042",
        name: "Siti Rahma",
        age: 28,
        gender: "P",
        clinic: "Poli Anak",
        doctorName: "dr. Maya Kartika",
        arrivalTime: "08:30 WIB",
        guarantee: "Umum",
        status: "Menunggu",
        chiefComplaint: "Demam dan flu 2 hari"
    }
];

export default function PemeriksaanPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Map search param 'tab' to active state (default: "dashboard")
    const activeTab = (searchParams.get("tab") || "dashboard") as KedokteranTabType;

    const setTab = (tabName: string) => {
        if (tabName === "dashboard" || tabName === "") {
            setSearchParams({});
        } else {
            setSearchParams({ tab: tabName });
        }
    };

    // States
    const [doctors, setDoctors] = useState<Doctor[]>(SEEDED_DOCTORS);
    const [patients, setPatients] = useState<PatientRecord[]>(SEEDED_PATIENTS);
    const [selectedPatientForExam, setSelectedPatientForExam] = useState<PatientRecord | null>(null);
    const [loading, setLoading] = useState(false);

    // Sync API Database
    const fetchDatabase = async () => {
        setLoading(true);
        try {
            const regRes = await api<{ data: any[] }>("/pendaftaran?per_page=100").catch(() => null);
            if (regRes?.data && Array.isArray(regRes.data)) {
                const mapped: PatientRecord[] = regRes.data.map((r, idx) => ({
                    id: String(r.id ?? idx + 1),
                    queueNo: String(r.no ?? `REG-000${idx + 1}`),
                    norm: String(r.rm ?? `RM-000${idx + 1}`),
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
            }

            const docRes = await api<{ data: any[] }>("/master-data/pegawai?per_page=100").catch(() => null);
            if (docRes?.data && Array.isArray(docRes.data)) {
                const mappedDoc: Doctor[] = docRes.data.map((p, idx) => ({
                    id: `doc-${p.id_pegawai ?? idx + 1}`,
                    name: String(p.nama_pegawai ?? "dr. Dokter"),
                    title: p.no_sip_pegawai ? "Spesialis" : "Sp.PD",
                    specialty: p.sub_unit_pegawai?.nama_sub_unit_pegawai ?? "Poli Umum",
                    categoryId: "gp",
                    avatar: (p.jenis_kelamin_pegawai === "P" ? FEMALE_AVATARS : MALE_AVATARS)[idx % 3],
                    experienceYears: 8 + (idx % 5),
                    rating: 4.8,
                    reviewCount: "4.5K",
                    totalPatients: "6,500",
                    fee: 200000,
                    status: "Praktik",
                    scheduleTime: "08.00 AM - 14.00 PM",
                    room: `Poli R.10${idx + 1}`,
                    nextAvailableDate: "Hari Ini, 05 Okt 2026",
                    about: `${p.nama_pegawai} bertugas aktif di SIMRS.`
                }));
                if (mappedDoc.length > 0) setDoctors(mappedDoc);
            }
        } catch {
            // Keep default seeded
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchDatabase();
    }, []);

    const handleStartExamForPatient = (p: PatientRecord) => {
        setSelectedPatientForExam(p);
        setTab("pemeriksaan");
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Top Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Kedokteran & CPPT
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                                <Sparkles className="h-3.5 w-3.5" /> Pelayanan Dokter
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Modul Rekam Medis Elektronik, E-Prescribing, Order Penunjang & CPPT Terintegrasi.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => void fetchDatabase()}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer"
                        >
                            <RefreshCw className={cn("h-3.5 w-3.5 text-slate-500", loading ? "animate-spin" : "")} />
                            Sync DB
                        </button>

                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span>05 Oktober 2026</span>
                        </div>
                    </div>
                </div>


                {/* TAB CONTENT VIEWS */}
                {(activeTab === "dashboard" || !searchParams.get("tab")) && (
                    <DashboardKedokteran
                        doctors={doctors}
                        patients={patients}
                        onSelectTab={setTab}
                        onSelectPatientForExam={handleStartExamForPatient}
                    />
                )}

                {activeTab === "antrean" && (
                    <AntreanPoliklinik
                        patients={patients}
                        onStartExam={handleStartExamForPatient}
                    />
                )}

                {activeTab === "pemeriksaan" && (
                    <PemeriksaanAnamnesis
                        patients={patients}
                        selectedPatient={selectedPatientForExam}
                    />
                )}

                {activeTab === "resep" && (
                    <EPrescribing patients={patients} />
                )}

                {activeTab === "order" && (
                    <OrderPenunjang patients={patients} />
                )}

                {activeTab === "cppt" && (
                    <CPPTResumeMedis patients={patients} />
                )}
            </div>
        </AppShell>
    );
}
