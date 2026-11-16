import { Link, useLocation } from "react-router";
import {
    LayoutDashboard,
    Clock,
    Stethoscope,
    PillBottle,
    FlaskConical,
    FileText,
    Sparkles,
    Calendar,
    RefreshCw,
    User,
    CheckCircle2,
    ChevronRight,
    Activity
} from "lucide-react";
import { cn } from "~/lib/utils";
import { getPatientById, getActivePatientId } from "./mockData";
import { useState, useEffect } from "react";
import type { PatientRecord } from "./types";

interface NavTabItem {
    label: string;
    to: string;
    icon: typeof LayoutDashboard;
    badge?: string;
    description: string;
}

export default function PemeriksaanNav() {
    const location = useLocation();
    const [activePatient, setActivePatient] = useState<PatientRecord | null>(null);

    useEffect(() => {
        const updatePatient = () => {
            const p = getPatientById();
            setActivePatient(p);
        };
        updatePatient();
        window.addEventListener("storage", updatePatient);
        return () => window.removeEventListener("storage", updatePatient);
    }, [location.pathname]);

    const isCurrentActive = (to: string) => {
        if (to === "/pemeriksaan") {
            return location.pathname === "/pemeriksaan";
        }
        return location.pathname === to || location.pathname.startsWith(`${to}/`);
    };

    return (
        <div className="space-y-4">
            {/* Top Page Header */}
            <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 border border-slate-200/80 shadow-2xs md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                            <Stethoscope className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                                    Kedokteran & CPPT
                                </h1>
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
                                    <Sparkles className="h-3 w-3" /> Pelayanan Medis
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">
                                Modul Pelayanan Klinis Dokter, Rekam Medis SOAP, E-Prescribing, dan Resume Terintegrasi
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Active Patient Indicator Chip */}
                    {activePatient && (
                        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-700">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-slate-400 font-medium">Pasien Aktif:</span>
                            <span className="font-bold text-slate-900">{activePatient.name}</span>
                            <span className="font-mono text-[11px] bg-white border border-slate-200 px-1.5 py-0.2 rounded font-bold text-blue-700">
                                {activePatient.norm}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        <span>05 Okt 2026</span>
                    </div>
                </div>
            </div>

            {/* Horizontal Sub-Navigation Tab Pills */}

        </div>
    );
}
