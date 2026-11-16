import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
    Timer,
    ArrowRight,
    User,
    Activity,
    AlertCircle
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { PatientRecord } from "../types";
import {
    getSavedPatients,
    savePatients,
    setActivePatientId,
    updatePatientStatus
} from "../mockData";

export default function AntreanPoliklinikPage() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<PatientRecord[]>(() => getSavedPatients());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClinic, setSelectedClinic] = useState("Semua Poli");
    const [activeCalledPatient, setActiveCalledPatient] = useState<PatientRecord | null>(null);
    const [callCountMap, setCallCountMap] = useState<Record<string, number>>({});
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleCallPatient = (patient: PatientRecord) => {
        const count = (callCountMap[patient.id] || 0) + 1;
        setCallCountMap(prev => ({ ...prev, [patient.id]: count }));
        setActiveCalledPatient(patient);
        setIsSpeaking(true);

        // TTS Speech Synthesis in Indonesian
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            try {
                window.speechSynthesis.cancel();
                const text = `Nomor antrean ${patient.queueNo}, atas nama ${patient.name}, silakan menuju ${patient.clinic}`;
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = "id-ID";
                utterance.rate = 0.9;
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = () => setIsSpeaking(false);
                window.speechSynthesis.speak(utterance);
            } catch {
                setIsSpeaking(false);
            }
        } else {
            setTimeout(() => setIsSpeaking(false), 2000);
        }
    };

    const handleUpdateStatus = (id: string, newStatus: PatientRecord["status"]) => {
        const updated = updatePatientStatus(id, newStatus);
        setPatients(updated);
        if (activeCalledPatient?.id === id && (newStatus === "Selesai" || newStatus === "Batal")) {
            setActiveCalledPatient(null);
        }
    };

    const handleStartExam = (patient: PatientRecord) => {
        setActivePatientId(patient.id);
        handleUpdateStatus(patient.id, "Sedang Diperiksa");
        navigate(`/pemeriksaan/anamnesis?patientId=${patient.id}`);
    };

    const clinics = ["Semua Poli", "Poli Umum", "Poli Anak", "Poli Jantung", "Poli Gigi", "Poli Mata"];

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
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-6 text-white shadow-xl border border-blue-500/30">
                    <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "flex h-3 w-3 rounded-full bg-emerald-400",
                                    isSpeaking ? "animate-ping" : ""
                                )} />
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                                    {isSpeaking ? "🔊 Pengumuman Suara Sedang Berbunyi..." : "Sedang Dipanggil ke Ruang Poli"}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-baseline gap-4">
                                <span className="font-mono text-5xl font-black tracking-tight text-white drop-shadow-md">
                                    {activeCalledPatient.queueNo}
                                </span>
                                <div>
                                    <h2 className="text-2xl font-black text-white">{activeCalledPatient.name}</h2>
                                    <p className="text-sm text-blue-200">
                                        No. RM: <strong className="text-white font-mono">{activeCalledPatient.norm}</strong> • Poli: <strong className="text-white">{activeCalledPatient.clinic}</strong> • DPJP: <strong className="text-white">{activeCalledPatient.doctorName}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => handleCallPatient(activeCalledPatient)}
                                className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer border border-white/10"
                            >
                                <Volume2 className="h-4 w-4 text-emerald-400" />
                                <span>Panggil Ulang ({callCountMap[activeCalledPatient.id] || 1}x)</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleStartExam(activeCalledPatient)}
                                className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-all cursor-pointer"
                            >
                                <Stethoscope className="h-4 w-4" />
                                <span>Mulai Pemeriksaan SOAP</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveCalledPatient(null)}
                                className="rounded-2xl p-2.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Header Filter & Statistics Bar */}
            <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 border border-slate-200/80 shadow-2xs md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    {clinics.map(c => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setSelectedClinic(c)}
                            className={cn(
                                "rounded-2xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer",
                                selectedClinic === c
                                    ? "bg-slate-900 text-white shadow-xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama, RM, no antrean..."
                            className="rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Queue Split View: Menunggu vs Sedang Diperiksa */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* 1. ANTRIAN MENUNGGU */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-600" />
                            <h3 className="text-sm font-black text-slate-900">Pasien Menunggu Panggilan</h3>
                        </div>
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                            {waitingList.length} Pasien
                        </span>
                    </div>

                    <div className="space-y-3">
                        {waitingList.length === 0 ? (
                            <div className="py-12 text-center text-xs text-slate-400">
                                Tidak ada antrean menunggu untuk {selectedClinic}.
                            </div>
                        ) : (
                            waitingList.map((p) => {
                                const callCount = callCountMap[p.id] || 0;
                                return (
                                    <div
                                        key={p.id}
                                        className="group rounded-2xl border border-slate-200/80 p-4 transition-all hover:border-blue-300 hover:shadow-xs bg-slate-50/40"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 font-mono font-black text-base shadow-2xs">
                                                    {p.queueNo}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-black text-slate-900">{p.name}</h4>
                                                        <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                                            {p.norm}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {p.clinic} • {p.age} th ({p.gender}) • <strong className="text-emerald-700">{p.guarantee}</strong>
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-1">
                                                        "{p.chiefComplaint}"
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCallPatient(p)}
                                                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600 transition-all cursor-pointer shadow-2xs"
                                                >
                                                    <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                                                    <span>Panggil {callCount > 0 ? `(${callCount}x)` : ""}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleStartExam(p)}
                                                    className="flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
                                                >
                                                    <Stethoscope className="h-3 w-3" />
                                                    <span>Mulai Periksa</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* 2. SEDANG DIPERIKSA / SELESAI */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-blue-600" />
                            <h3 className="text-sm font-black text-slate-900">Sedang Diperiksa & Selesai</h3>
                        </div>
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                            {activeList.length + finishedList.length} Pasien
                        </span>
                    </div>

                    <div className="space-y-3">
                        {activeList.map((p) => (
                            <div
                                key={p.id}
                                className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 transition-all"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-mono font-black text-base shadow-sm shadow-blue-500/20">
                                            {p.queueNo}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-black text-slate-900">{p.name}</h4>
                                                <span className="rounded-full bg-blue-200 text-blue-900 text-[10px] font-black px-2 py-0.2 animate-pulse">
                                                    Sedang Diperiksa
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 mt-0.5">
                                                {p.clinic} • DPJP: {p.doctorName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleStartExam(p)}
                                            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-all cursor-pointer"
                                        >
                                            <Stethoscope className="h-3.5 w-3.5" />
                                            <span>Lanjut SOAP</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateStatus(p.id, "Selesai")}
                                            className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                                        >
                                            Tandai Selesai
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {finishedList.map((p) => (
                            <div
                                key={p.id}
                                className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 opacity-80"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs font-bold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-xl">
                                            {p.queueNo}
                                        </span>
                                        <div>
                                            <span className="text-xs font-bold text-slate-700 line-through mr-2">{p.name}</span>
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                Selesai
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleStartExam(p)}
                                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                                    >
                                        Lihat RM
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
