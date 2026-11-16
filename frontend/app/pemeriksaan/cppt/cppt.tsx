import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
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
    Download,
    ShieldCheck,
    Stethoscope
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { PatientRecord, CPPTEntry } from "../types";
import { getSavedPatients, getPatientById, setActivePatientId } from "../mockData";
import { CustomAlertModal, type AlertType } from "~/components/ui/CustomAlertModal";

const SEEDED_CPPT_ENTRIES: CPPTEntry[] = [
    {
        id: "cppt-1",
        tanggal: "05 Okt 2026, 08:35 WIB",
        ppa: "Perawat",
        namaPPA: "Ns. Ratna Wulandari, S.Kep",
        subjective: "Pasien mengeluh pusing dan tengkuk terasa berat saat tiba di poliklinik.",
        objective: "TD: 135/85 mmHg, HR: 82 bpm, RR: 20 x/m, Suhu: 36.6 °C, GCS: 15 (Compos Mentis).",
        assessment: "Ketidaknyamanan fisik b.d peningkatan tekanan vaskular serebral.",
        plan: "Posisikan pasien semi-fowler, observasi tanda-tanda vital, anjurkan relaksasi napas dalam, laporkan ke DPJP.",
        instruksi: "TTV ulang 15 menit pasca istirahat di ruang tunggu poli.",
        isVerified: true
    },
    {
        id: "cppt-2",
        tanggal: "05 Okt 2026, 08:50 WIB",
        ppa: "Dokter (DPJP)",
        namaPPA: "dr. Andi Prasetyo, Sp.PD",
        subjective: "Keluhan nyeri dada tumpul retrosternal saat menaiki tangga 2 lantai, berkurang dengan istirahat.",
        objective: "Cor: S1-S2 normal, murmur (-). Pulmo: Vesikuler (+/+). EKG: Sinus ritme, iskemia inferolateral ringan.",
        assessment: "Angina Pectoris Stabil CCS II e.c Susp. CAD + Hipertensi Stage I.",
        plan: "Terapi antiangina (ISDN 5mg SL prn), ACE-inhibitor dilanjutkan, jadwalkan Treadmill Test minggu depan.",
        instruksi: "Resepkan ISDN dan Amlodipine 5mg. Edukasi hindari stres fisik mendadak.",
        isVerified: true
    },
    {
        id: "cppt-3",
        tanggal: "05 Okt 2026, 09:15 WIB",
        ppa: "Apoteker",
        namaPPA: "apt. Dimas Nugraha, S.Farm",
        subjective: "Pasien memahami cara pemakaian obat sebelumnya, namun lupa jadwal minum obat malam.",
        objective: "Rekonsiliasi obat: Penggunaan Amlodipine 5mg rutin, riwayat alergi Penicillin.",
        assessment: "Ketidakpatuhan jadwal minum obat hipertensi teratasi dengan edukasi pillbox.",
        plan: "Edukasi waktu konsumsi obat malam sebelum tidur dan teknik penggunaan obat sublingual.",
        instruksi: "Pastikan etiket obat dilengkapi tanda waktu spesifik (jam 21.00 WIB).",
        isVerified: true
    }
];

export default function CPPTResumeMedisPage() {
    const [searchParams] = useSearchParams();
    const patientIdParam = searchParams.get("patientId");

    const [patients] = useState<PatientRecord[]>(() => getSavedPatients());
    const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(() => {
        return getPatientById(patientIdParam);
    });

    const [activeSubTab, setActiveSubTab] = useState<"cppt" | "resume">("cppt");
    const [cpptEntries, setCpptEntries] = useState<CPPTEntry[]>(SEEDED_CPPT_ENTRIES);

    // Form Tambah CPPT Baru
    const [isAddingCPPT, setIsAddingCPPT] = useState(false);
    const [ppaRole, setPpaRole] = useState<CPPTEntry["ppa"]>("Dokter (DPJP)");
    const [namaPPA, setNamaPPA] = useState("dr. Andi Prasetyo, Sp.PD");
    const [subInput, setSubInput] = useState("");
    const [objInput, setObjInput] = useState("");
    const [assInput, setAssInput] = useState("");
    const [planInput, setPlanInput] = useState("");
    const [instruksiInput, setInstruksiInput] = useState("");

    // Custom Alert Modal
    const [alertState, setAlertState] = useState<{
        isOpen: boolean;
        title?: string;
        message: string;
        type?: AlertType;
    }>({
        isOpen: false,
        message: ""
    });

    const showAlert = (message: string, title?: string, type: AlertType = "success") => {
        setAlertState({ isOpen: true, message, title, type });
    };

    const handleSaveNewCPPT = (e: React.FormEvent) => {
        e.preventDefault();
        const newEntry: CPPTEntry = {
            id: `cppt-${Date.now()}`,
            tanggal: `${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`,
            ppa: ppaRole,
            namaPPA: namaPPA || "Tenaga Medis SIMRS",
            subjective: subInput || "-",
            objective: objInput || "-",
            assessment: assInput || "-",
            plan: planInput || "-",
            instruksi: instruksiInput || "-",
            isVerified: ppaRole === "Dokter (DPJP)"
        };

        setCpptEntries([newEntry, ...cpptEntries]);
        setIsAddingCPPT(false);
        setSubInput("");
        setObjInput("");
        setAssInput("");
        setPlanInput("");
        setInstruksiInput("");
        showAlert("Catatan CPPT baru berhasil ditambahkan ke lembar rekam medis pasien!", "Catatan CPPT Tersimpan", "success");
    };

    return (
        <div className="space-y-6">
            <CustomAlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            {/* Header Pasien & Sub-Tabs */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 font-black text-lg shadow-2xs">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-black text-slate-900">{selectedPatient.name}</h2>
                                <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                                    {selectedPatient.norm}
                                </span>
                                <span className="text-xs text-slate-400">({selectedPatient.queueNo})</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {selectedPatient.clinic} • DPJP: {selectedPatient.doctorName} • Penjamin: <strong className="text-emerald-700">{selectedPatient.guarantee}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Pilih Pasien:</span>
                        <select
                            value={selectedPatient.id}
                            onChange={(e) => {
                                const found = patients.find(p => p.id === e.target.value);
                                if (found) {
                                    setSelectedPatient(found);
                                    setActivePatientId(found.id);
                                }
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-amber-600 focus:outline-none"
                        >
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.queueNo} - {p.name} ({p.clinic})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Sub Tab Switcher: CPPT vs Resume Medis */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                    <button
                        type="button"
                        onClick={() => setActiveSubTab("cppt")}
                        className={cn(
                            "flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all cursor-pointer border",
                            activeSubTab === "cppt"
                                ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        )}
                    >
                        <Clock className="h-3.5 w-3.5" />
                        <span>Timeline Catatan CPPT Terintegrasi ({cpptEntries.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveSubTab("resume")}
                        className={cn(
                            "flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all cursor-pointer border",
                            activeSubTab === "resume"
                                ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        )}
                    >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Lembar Resume Medis Elektronik (RME)</span>
                    </button>
                </div>
            </div>

            {/* VIEW 1: CPPT TIMELINE */}
            {activeSubTab === "cppt" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <h3 className="text-sm font-black text-slate-900">
                                Catatan Perkembangan Pasien Terintegrasi (CPPT)
                            </h3>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsAddingCPPT(!isAddingCPPT)}
                            className="flex items-center gap-1.5 rounded-2xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-2xs transition-all cursor-pointer"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>{isAddingCPPT ? "Batal Input" : "Tambah Catatan CPPT"}</span>
                        </button>
                    </div>

                    {/* Form Tambah CPPT */}
                    {isAddingCPPT && (
                        <form onSubmit={handleSaveNewCPPT} className="rounded-3xl border border-blue-200 bg-blue-50/40 p-5 shadow-2xs space-y-4">
                            <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">Input Catatan SOAP Baru</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Pemberi Pelayanan Asuhan (PPA)</label>
                                    <select
                                        value={ppaRole}
                                        onChange={(e) => setPpaRole(e.target.value as any)}
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold"
                                    >
                                        <option value="Dokter (DPJP)">Dokter (DPJP)</option>
                                        <option value="Perawat">Perawat</option>
                                        <option value="Apoteker">Apoteker</option>
                                        <option value="Gizi">Dietisien / Tenaga Gizi</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Nama Petugas PPA</label>
                                    <input
                                        type="text"
                                        value={namaPPA}
                                        onChange={(e) => setNamaPPA(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Subjective (S)</label>
                                    <textarea
                                        rows={2}
                                        value={subInput}
                                        onChange={(e) => setSubInput(e.target.value)}
                                        placeholder="Keluhan pasien..."
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Objective (O)</label>
                                    <textarea
                                        rows={2}
                                        value={objInput}
                                        onChange={(e) => setObjInput(e.target.value)}
                                        placeholder="TTV, hasil pemeriksaan fisik/lab..."
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Assessment (A)</label>
                                    <textarea
                                        rows={2}
                                        value={assInput}
                                        onChange={(e) => setAssInput(e.target.value)}
                                        placeholder="Diagnosa kerja/masalah keperawatan..."
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Plan & Instruksi PPA (P)</label>
                                    <textarea
                                        rows={2}
                                        value={planInput}
                                        onChange={(e) => setPlanInput(e.target.value)}
                                        placeholder="Rencana tindakan, resep, diet..."
                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingCPPT(false)}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
                                >
                                    Simpan CPPT
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Timeline List of CPPT Cards */}
                    <div className="space-y-4">
                        {cpptEntries.map((entry) => (
                            <div key={entry.id} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <span className={cn(
                                            "rounded-xl px-2.5 py-1 text-xs font-extrabold uppercase",
                                            entry.ppa === "Dokter (DPJP)" ? "bg-blue-100 text-blue-800" :
                                            entry.ppa === "Perawat" ? "bg-purple-100 text-purple-800" :
                                            entry.ppa === "Apoteker" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                        )}>
                                            {entry.ppa}
                                        </span>
                                        <span className="text-xs font-black text-slate-900">{entry.namaPPA}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{entry.tanggal}</span>
                                        {entry.isVerified && (
                                            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                                                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Terverifikasi DPJP
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100 space-y-1">
                                        <span className="font-extrabold text-blue-700 block text-[11px]">S - Subjective:</span>
                                        <p className="text-slate-700 leading-relaxed">{entry.subjective}</p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100 space-y-1">
                                        <span className="font-extrabold text-purple-700 block text-[11px]">O - Objective:</span>
                                        <p className="text-slate-700 leading-relaxed">{entry.objective}</p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100 space-y-1">
                                        <span className="font-extrabold text-emerald-700 block text-[11px]">A - Assessment:</span>
                                        <p className="text-slate-700 leading-relaxed">{entry.assessment}</p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100 space-y-1">
                                        <span className="font-extrabold text-amber-700 block text-[11px]">P - Plan & Instruksi:</span>
                                        <p className="text-slate-700 leading-relaxed">{entry.plan}</p>
                                        {entry.instruksi && (
                                            <p className="text-[11px] text-slate-500 font-semibold mt-1">
                                                Instruksi: {entry.instruksi}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VIEW 2: RESUME MEDIS ELEKTRONIK */}
            {activeSubTab === "resume" && (
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-6">
                    {/* Header Resume Medis */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">
                                RUMAH SAKIT UMUM SIMRS TERAKREDITASI PARIPURNA
                            </span>
                            <h3 className="text-xl font-black text-slate-900">
                                Ringkasan Masuk & Keluar / Resume Medis Rawat Jalan
                            </h3>
                            <p className="text-xs text-slate-500">
                                Rekam Medis Elektronik Terintegrasi (Kemenkes RI SATUSEHAT Compliant)
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                            >
                                <Printer className="h-4 w-4" />
                                <span>Cetak Resume</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => showAlert("Dokumen Resume Medis berhasil diekspor sebagai PDF tersertifikasi digital!", "Ekspor PDF", "success")}
                                className="flex items-center gap-1.5 rounded-2xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer shadow-2xs"
                            >
                                <Download className="h-4 w-4" />
                                <span>Export PDF</span>
                            </button>
                        </div>
                    </div>

                    {/* Data Pasien Resume */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs">
                        <div>
                            <span className="text-slate-400 block text-[10px] font-bold">Nama Pasien</span>
                            <strong className="text-slate-900 text-sm">{selectedPatient.name}</strong>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] font-bold">Nomor Rekam Medis</span>
                            <strong className="text-slate-900 font-mono text-sm">{selectedPatient.norm}</strong>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] font-bold">Usia / Jenis Kelamin</span>
                            <strong className="text-slate-900">{selectedPatient.age} Tahun / {selectedPatient.gender === "L" ? "Laki-laki" : "Perempuan"}</strong>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] font-bold">Dokter Penanggung Jawab (DPJP)</span>
                            <strong className="text-slate-900">{selectedPatient.doctorName}</strong>
                        </div>
                    </div>

                    {/* Ringkasan Medis */}
                    <div className="space-y-4 text-xs">
                        <div className="rounded-2xl border border-slate-200/80 p-4 space-y-2">
                            <h4 className="font-extrabold text-slate-900 text-xs">1. Diagnosa Utama & Diagnosa Sekunder</h4>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                                    {selectedPatient.icdCode || "I20.9"}
                                </span>
                                <span className="font-bold text-slate-800">{selectedPatient.diagnosis || "Angina Pectoris, unspecified"}</span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200/80 p-4 space-y-2">
                            <h4 className="font-extrabold text-slate-900 text-xs">2. Keluhan Utama & Ringkasan Riwayat Penyakit</h4>
                            <p className="text-slate-700 leading-relaxed">
                                {selectedPatient.chiefComplaint}. Pasien datang dengan keluhan klinis poliklinik dan telah dilakukan pemeriksaan fisik menyeluruh oleh DPJP.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200/80 p-4 space-y-2">
                            <h4 className="font-extrabold text-slate-900 text-xs">3. Terapi Pulang & Anjuran Kontrol</h4>
                            <p className="text-slate-700 leading-relaxed">
                                Terapi medikamentosa dilanjutkan sesuai resep elektronik yang diterbitkan. Pasien dianjurkan kontrol ulang 1 minggu ke Poliklinik Rawat Jalan atau segera ke IGD jika keluhan memberat secara akut.
                            </p>
                        </div>
                    </div>

                    {/* Digital Signature */}
                    <div className="flex justify-end pt-4">
                        <div className="text-center space-y-1 text-xs">
                            <span className="text-slate-400 text-[11px]">Dokter Penanggung Jawab Pelayanan,</span>
                            <div className="py-2">
                                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-700">
                                    <ShieldCheck className="h-4 w-4" /> Tanda Tangan Elektronik Sah (BSrE)
                                </div>
                            </div>
                            <strong className="block text-slate-900">{selectedPatient.doctorName}</strong>
                            <span className="text-[10px] text-slate-400">SIP. 446/1029/DINKES/2024</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
