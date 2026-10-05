import { useState } from "react";
import {
    Clock,
    Volume2,
    CheckCircle2,
    UserX,
    Phone,
    Search,
    Filter,
    Stethoscope,
    Sparkles,
    Calendar,
    Tag,
    X,
    UserCheck,
    Timer
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { PatientRecord } from "../pemeriksaan";

interface AntreanPoliklinikProps {
    patients: PatientRecord[];
    onStartExam: (patient: PatientRecord) => void;
}

export default function AntreanPoliklinik({
    patients: initialPatients,
    onStartExam
}: AntreanPoliklinikProps) {
    const [patients, setPatients] = useState<PatientRecord[]>(initialPatients);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClinic, setSelectedClinic] = useState("Semua Poli");
    const [activeCalledPatient, setActiveCalledPatient] = useState<PatientRecord | null>(null);
    const [callCountMap, setCallCountMap] = useState<Record<string, number>>({});

    const handleCallPatient = (patient: PatientRecord) => {
        const count = (callCountMap[patient.id] || 0) + 1;
        setCallCountMap(prev => ({ ...prev, [patient.id]: count }));
        setActiveCalledPatient(patient);

        // TTS Speech Synthesis
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            try {
                window.speechSynthesis.cancel();
                const text = `Nomor antrean ${patient.queueNo}, atas nama ${patient.name}, silakan menuju ${patient.clinic}`;
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = "id-ID";
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            } catch {
                // Ignore TTS error
            }
        }
    };

    const handleUpdateStatus = (id: string, newStatus: PatientRecord["status"]) => {
        setPatients(prev =>
            prev.map(p => p.id === id ? { ...p, status: newStatus } : p)
        );
        if (activeCalledPatient?.id === id && (newStatus === "Selesai" || newStatus === "Batal")) {
            setActiveCalledPatient(null);
        }
    };

    const filtered = patients.filter(p => {
        const matchesClinic = selectedClinic === "Semua Poli" || p.clinic.toLowerCase().includes(selectedClinic.toLowerCase());
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.norm.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.queueNo.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesClinic && matchesSearch;
    });

    const waitingList = filtered.filter(p => p.status === "Menunggu");
    const activeList = filtered.filter(p => p.status === "Sedang Diperiksa");
    const finishedList = filtered.filter(p => p.status === "Selesai");

    return (
        <div className="space-y-6">
            {/* Display Banner for Called Patient */}
            {activeCalledPatient ? (
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl border border-slate-800">
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                            </span>
                            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
                                PASIEN DIPANGGIL SAAT INI (LIVE CALL)
                            </span>
                        </div>
                        <button
                            onClick={() => setActiveCalledPatient(null)}
                            className="rounded-lg bg-slate-800 p-1 text-slate-400 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="relative z-10 mt-5 grid items-center gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-2xl bg-slate-800/90 border border-slate-700 p-5 text-center">
                            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">NOMOR ANTREAN</p>
                            <p className="font-mono text-5xl font-black text-amber-300 my-1 drop-shadow-md">
                                {activeCalledPatient.queueNo}
                            </p>
                            <span className="rounded-full bg-blue-500/20 px-3 py-0.5 text-xs font-bold text-blue-300 border border-blue-500/30">
                                {activeCalledPatient.clinic}
                            </span>
                        </div>

                        <div className="lg:col-span-5 space-y-2">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Pasien</p>
                            <h2 className="text-2xl font-extrabold text-white">{activeCalledPatient.name}</h2>
                            <p className="text-xs text-slate-300">
                                RM: <strong className="text-white font-mono">{activeCalledPatient.norm}</strong> • DPJP: <strong className="text-white">{activeCalledPatient.doctorName}</strong>
                            </p>
                        </div>

                        <div className="lg:col-span-3 flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => handleCallPatient(activeCalledPatient)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-all cursor-pointer"
                            >
                                <Volume2 className="h-4 w-4" /> Panggil Ulang (TTS)
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleUpdateStatus(activeCalledPatient.id, "Sedang Diperiksa");
                                    onStartExam(activeCalledPatient);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-all cursor-pointer"
                            >
                                <Stethoscope className="h-4 w-4" /> Mulai Pemeriksaan
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    <div className="relative min-w-[200px] flex-1 max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama / RM / antrean..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:bg-white focus:outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="h-3.5 w-3.5 text-slate-400" />
                        <select
                            value={selectedClinic}
                            onChange={(e) => setSelectedClinic(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-slate-800 focus:bg-white focus:outline-none transition-all"
                        >
                            <option value="Semua Poli">Semua Poli</option>
                            <option value="Poli Umum">Poli Umum</option>
                            <option value="Poli Anak">Poli Anak</option>
                            <option value="Poli Jantung">Poli Jantung</option>
                            <option value="Poli Gigi">Poli Gigi</option>
                        </select>
                    </div>
                </div>

                <div className="text-xs font-semibold text-slate-500">
                    Menampilkan <strong>{filtered.length}</strong> pasien antrean
                </div>
            </div>

            {/* Kanban Columns (Menunggu, Diperiksa, Selesai) */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Column 1: Menunggu */}
                <div className="flex flex-col rounded-3xl border border-slate-200/70 bg-slate-50/60 p-3 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold border border-slate-200 bg-slate-100 text-slate-800">
                            <span className="h-2 w-2 rounded-full bg-slate-500" />
                            <span>Menunggu Periksa</span>
                            <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-800 font-bold">
                                {waitingList.length}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {waitingList.map((p) => (
                            <div key={p.id} className="rounded-2xl bg-white p-4 shadow-2xs border border-slate-200 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                        #{p.queueNo}
                                    </span>
                                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                                        {p.guarantee}
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                                <p className="text-xs text-slate-500">{p.clinic} • {p.doctorName}</p>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => handleCallPatient(p)}
                                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-slate-900 py-1.5 text-[11px] font-bold text-white shadow-2xs hover:bg-slate-800 cursor-pointer"
                                    >
                                        <Phone className="h-3 w-3" /> Panggil
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleUpdateStatus(p.id, "Sedang Diperiksa");
                                            onStartExam(p);
                                        }}
                                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
                                    >
                                        <Stethoscope className="h-3 w-3" /> Periksa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 2: Diperiksa */}
                <div className="flex flex-col rounded-3xl border border-blue-200/70 bg-blue-50/30 p-3 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold border border-blue-200 bg-blue-100 text-blue-900">
                            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                            <span>Sedang Diperiksa</span>
                            <span className="ml-1 rounded-full bg-blue-200 px-2 py-0.5 text-[11px] text-blue-950 font-bold">
                                {activeList.length}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {activeList.map((p) => (
                            <div key={p.id} className="rounded-2xl bg-white p-4 shadow-2xs border border-blue-300 ring-2 ring-blue-100 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                        #{p.queueNo}
                                    </span>
                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                        Diperiksa
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                                <p className="text-xs text-slate-500">{p.clinic} • {p.doctorName}</p>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => onStartExam(p)}
                                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-blue-600 py-1.5 text-[11px] font-bold text-white shadow-2xs hover:bg-blue-700 cursor-pointer"
                                    >
                                        <Stethoscope className="h-3 w-3" /> Rekam Medis
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateStatus(p.id, "Selesai")}
                                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-500 cursor-pointer"
                                    >
                                        <CheckCircle2 className="h-3 w-3" /> Selesai
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 3: Selesai */}
                <div className="flex flex-col rounded-3xl border border-emerald-200/70 bg-emerald-50/30 p-3 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold border border-emerald-200 bg-emerald-100 text-emerald-900">
                            <span className="h-2 w-2 rounded-full bg-emerald-600" />
                            <span>Selesai Pelayanan</span>
                            <span className="ml-1 rounded-full bg-emerald-200 px-2 py-0.5 text-[11px] text-emerald-950 font-bold">
                                {finishedList.length}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {finishedList.map((p) => (
                            <div key={p.id} className="rounded-2xl bg-white p-4 shadow-2xs border border-emerald-200 space-y-2 opacity-90">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        #{p.queueNo}
                                    </span>
                                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                                        Selesai
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                                <p className="text-xs text-slate-500">{p.clinic} • {p.doctorName}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
