import { useState } from "react";
import {
    FileText,
    CheckCircle2,
    Plus,
    Printer,
    Sparkles,
    UserCheck,
    Clock,
    Send,
    User,
    ChevronRight,
    Download
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { PatientRecord } from "../pemeriksaan";

interface CPPTResumeMedisProps {
    patients: PatientRecord[];
}

interface CPPTEntry {
    id: string;
    tanggal: string;
    ppa: "Dokter (DPJP)" | "Perawat" | "Apoteker" | "Gizi";
    namaPPA: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    instruksi: string;
    isVerified: boolean;
}

export default function CPPTResumeMedis({ patients }: CPPTResumeMedisProps) {
    const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(patients[0] || {
        id: "1",
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
        chiefComplaint: "Pemeriksaan medis rutin"
    });

    const [activeSubTab, setActiveSubTab] = useState<"cppt" | "resume">("cppt");

    const [cpptEntries, setCpptEntries] = useState<CPPTEntry[]>([
        {
            id: "cppt-1",
            tanggal: "05 Okt 2026, 09:15 WIB",
            ppa: "Dokter (DPJP)",
            namaPPA: selectedPatient.doctorName || "dr. Andi Prasetyo",
            subjective: "Pasien mengeluhkan pusing dan lemas sejak kemarin.",
            objective: "TD: 120/80 mmHg, Nadi: 78x/mnt, Suhu: 36.6°C, Kesadaran: CM.",
            assessment: "A01.0 - Typhoid Fever / Suspek Demam Enterik",
            plan: "Pemberian antibiotik oral, istirahat baring, observasi vital sign.",
            instruksi: "Cek Darah Lengkap (DL) & Widal. Edukasi nutrisi lunak.",
            isVerified: true
        },
        {
            id: "cppt-2",
            tanggal: "05 Okt 2026, 08:30 WIB",
            ppa: "Perawat",
            namaPPA: "Ns. Ratna Wulandari, S.Kep",
            subjective: "Pasien mengeluh mual saat bangun tidur.",
            objective: "TD: 118/78 mmHg, Suhu: 36.8°C.",
            assessment: "Mual berhubungan dengan proses penyakit.",
            plan: "Pemberian minum hangat, pantau asupan cairan.",
            instruksi: "Kolaborasi dengan DPJP untuk terapi antiemetik.",
            isVerified: true
        }
    ]);

    // New CPPT Form State
    const [newSubjective, setNewSubjective] = useState("");
    const [newObjective, setNewObjective] = useState("");
    const [newAssessment, setNewAssessment] = useState("");
    const [newPlan, setNewPlan] = useState("");
    const [newInstruksi, setNewInstruksi] = useState("");

    const handleAddCPPT = () => {
        if (!newSubjective && !newAssessment) {
            alert("Harap isi setidaknya bagian S (Subjective) atau A (Assessment)!");
            return;
        }

        const newEntry: CPPTEntry = {
            id: `cppt-${Date.now()}`,
            tanggal: new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
            ppa: "Dokter (DPJP)",
            namaPPA: selectedPatient.doctorName || "dr. Andi Prasetyo",
            subjective: newSubjective || "Tidak ada keluhan tambahan.",
            objective: newObjective || "Vital sign stabil.",
            assessment: newAssessment || "Evaluasi perkembangan klinis.",
            plan: newPlan || "Terapi dilanjutkan.",
            instruksi: newInstruksi || "Monitoring rutin.",
            isVerified: true
        };

        setCpptEntries(prev => [newEntry, ...prev]);
        setNewSubjective("");
        setNewObjective("");
        setNewAssessment("");
        setNewPlan("");
        setNewInstruksi("");
    };

    return (
        <div className="space-y-6">
            {/* Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Catatan Perkembangan Pasien Terintegrasi (CPPT) & Resume Medis
                        </h3>
                        <p className="text-xs text-slate-500">
                            Catatan perkembangan medis PPA (DPJP, Perawat, Apoteker) format SOAP & Ringkasan Pulang.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={selectedPatient.id}
                        onChange={(e) => {
                            const found = patients.find(p => p.id === e.target.value);
                            if (found) setSelectedPatient(found);
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800"
                    >
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.queueNo} - {p.name} ({p.clinic})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Sub-Tab Navigation (CPPT vs Resume Medis) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveSubTab("cppt")}
                        className={cn(
                            "rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer",
                            activeSubTab === "cppt"
                                ? "bg-slate-900 text-white shadow-2xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                    >
                        Catatan CPPT (SOAP)
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSubTab("resume")}
                        className={cn(
                            "rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer",
                            activeSubTab === "resume"
                                ? "bg-slate-900 text-white shadow-2xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                    >
                        Resume Medis Pasien
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => alert(`Mencetak Resume Medis & CPPT Pasien ${selectedPatient.name}`)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
                >
                    <Printer className="h-3.5 w-3.5 text-slate-500" /> Cetak CPPT
                </button>
            </div>

            {/* SubTab 1: CPPT (SOAP) */}
            {activeSubTab === "cppt" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Form Tulis CPPT Baru (1 col) */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                                Form Tulis Catatan CPPT (SOAP) Baru
                            </h4>

                            <div className="space-y-2.5 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Subjective (S)</label>
                                    <textarea
                                        rows={2}
                                        value={newSubjective}
                                        onChange={(e) => setNewSubjective(e.target.value)}
                                        placeholder="Keluhan subjektif pasien..."
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Objective (O)</label>
                                    <textarea
                                        rows={2}
                                        value={newObjective}
                                        onChange={(e) => setNewObjective(e.target.value)}
                                        placeholder="Hasil pemeriksaan fisik & vital signs..."
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Assessment (A)</label>
                                    <input
                                        type="text"
                                        value={newAssessment}
                                        onChange={(e) => setNewAssessment(e.target.value)}
                                        placeholder="Diagnosa / Evaluasi perkembangan..."
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Plan (P)</label>
                                    <input
                                        type="text"
                                        value={newPlan}
                                        onChange={(e) => setNewPlan(e.target.value)}
                                        placeholder="Rencana penatalaksanaan / terapi..."
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Instruksi PPA</label>
                                    <input
                                        type="text"
                                        value={newInstruksi}
                                        onChange={(e) => setNewInstruksi(e.target.value)}
                                        placeholder="Instruksi untuk perawat/apoteker..."
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddCPPT}
                                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-all cursor-pointer mt-2"
                            >
                                + Simpan Catatan CPPT
                            </button>
                        </div>
                    </div>

                    {/* Timeline Log CPPT (2 cols) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                                Riwayat Catatan Perkembangan Pasien (CPPT Timeline)
                            </h4>

                            <div className="space-y-4">
                                {cpptEntries.map((entry) => (
                                    <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold",
                                                    entry.ppa.includes("Dokter") ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                                                )}>
                                                    {entry.ppa}
                                                </span>
                                                <span className="text-xs font-bold text-slate-900">{entry.namaPPA}</span>
                                            </div>
                                            <span className="text-[11px] text-slate-400 font-medium">{entry.tanggal}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <span className="font-bold text-blue-600">S (Subjective):</span>
                                                <p className="text-slate-700 mt-0.5">{entry.subjective}</p>
                                            </div>
                                            <div>
                                                <span className="font-bold text-purple-600">O (Objective):</span>
                                                <p className="text-slate-700 mt-0.5">{entry.objective}</p>
                                            </div>
                                            <div>
                                                <span className="font-bold text-emerald-600">A (Assessment):</span>
                                                <p className="text-slate-700 mt-0.5 font-semibold">{entry.assessment}</p>
                                            </div>
                                            <div>
                                                <span className="font-bold text-amber-600">P (Plan):</span>
                                                <p className="text-slate-700 mt-0.5">{entry.plan}</p>
                                            </div>
                                        </div>

                                        {entry.instruksi && (
                                            <div className="rounded-xl bg-white p-2.5 border border-slate-200 text-xs">
                                                <span className="font-bold text-slate-800">Instruksi PPA:</span> {entry.instruksi}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SubTab 2: Resume Medis Pasien */}
            {activeSubTab === "resume" && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
                    <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900">RESUME MEDIS PASIEN RAWAT JALAN</h3>
                            <p className="text-xs text-slate-500">SIMRS Rekam Medis Elektronik — RS Harapan Sehat</p>
                        </div>
                        <button
                            onClick={() => alert(`Unduh PDF Resume Medis Pasien ${selectedPatient.name}`)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-slate-800 cursor-pointer"
                        >
                            <Download className="h-4 w-4" /> Unduh PDF Resume
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs">
                        <div><span className="text-slate-400">Nama Pasien:</span> <strong className="text-slate-900">{selectedPatient.name}</strong></div>
                        <div><span className="text-slate-400">No. Rekam Medis:</span> <strong className="font-mono text-slate-900">{selectedPatient.norm}</strong></div>
                        <div><span className="text-slate-400">Poliklinik:</span> <strong className="text-slate-900">{selectedPatient.clinic}</strong></div>
                        <div><span className="text-slate-400">DPJP Dokter:</span> <strong className="text-slate-900">{selectedPatient.doctorName}</strong></div>
                    </div>

                    <div className="space-y-4 text-xs">
                        <div>
                            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">1. Diagnosa Utama & Sekunder</h4>
                            <p className="text-slate-700 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                                A01.0 - Typhoid fever (Demam Enterik)
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">2. Ringkasan Riwayat Penyakit & Pemeriksaan</h4>
                            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                Pasien datang dengan keluhan demam bertahap selama 4 hari, badan lemas, dan nafsu makan menurun. Pemeriksaan vital sign dalam batas stabil. Hasil laboratorium menunjukkan Widal O 1/320.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">3. Terapi Pulang & Edukasi Dokter</h4>
                            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                Obat minum oral dilanjutkan 5 hari. Istirahat cukup dan diet makanan lunak tinggi kalori. Jadwal kontrol ulang 1 minggu mendatang.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
