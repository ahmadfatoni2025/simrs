import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
    Stethoscope,
    Activity,
    FileText,
    CheckCircle2,
    HeartPulse,
    Search,
    Plus,
    X,
    User,
    Sparkles,
    AlertCircle,
    Thermometer,
    Scale,
    Ruler,
    ShieldAlert,
    Save,
    PillBottle,
    FlaskConical,
    ChevronRight,
    ChevronLeft,
    Clock,
    Zap,
    RotateCcw,
    Layers,
    ArrowRight
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { PatientRecord, ExamFormData } from "../types";
import {
    getSavedPatients,
    savePatients,
    getPatientById,
    setActivePatientId,
    updatePatientStatus
} from "../mockData";
import { CustomAlertModal, type AlertType } from "~/components/ui/CustomAlertModal";

// Common Primary & Specialist Care ICD-10 Favorites
const QUICK_ICD10_LIST = [
    { code: "I10", name: "Essential (primary) hypertension", category: "Kardiovaskular" },
    { code: "I20.9", name: "Angina Pectoris, unspecified", category: "Kardiovaskular" },
    { code: "E11.9", name: "Type 2 diabetes mellitus without complications", category: "Endokrin" },
    { code: "J00", name: "Acute nasopharyngitis (common cold / ISPA)", category: "Respirasi" },
    { code: "J20.9", name: "Acute bronchitis, unspecified", category: "Respirasi" },
    { code: "K29.7", name: "Gastritis, unspecified", category: "Gastrointestinal" },
    { code: "K30", name: "Functional dyspepsia", category: "Gastrointestinal" },
    { code: "R50.9", name: "Fever, unspecified (Febris)", category: "Gejala Umum" },
    { code: "M79.1", name: "Myalgia (Nyeri Otot)", category: "Muskuloskeletal" },
    { code: "A09", name: "Infectious gastroenteritis and colitis (Diare Akut)", category: "Gastrointestinal" },
];

// Quick Symptoms for Chief Complaint
const QUICK_SYMPTOMS = [
    "Demam",
    "Nyeri Dada",
    "Batuk Kering",
    "Batuk Berdahak",
    "Sesak Napas",
    "Sakit Kepala",
    "Pusing Berputar",
    "Nyeri Ulu Hati",
    "Mual & Muntah",
    "Diare",
    "Lemas",
    "Nafsu Makan Turun"
];

const NORMAL_EXAM_PRESETS = {
    kepala: "Kepala: Normosefali. Mata: Konjungtiva anemis (-/-), Sklera ikterik (-/-). THT: Sekret (-), Faring hiperemis (-). Leher: Pembesaran KGB (-), JVP tidak meningkat.",
    thorax: "Cor: S1-S2 murni reguler, murmur (-), gallop (-). Pulmo: Suara napas vesikuler (+/+), Ronkhi (-/-), Wheezing (-/-).",
    abdomen: "Abdomen: Datar, supel, bising usus (+) normal 8x/menit, nyeri tekan (-), hepar/lien tidak teraba membesar.",
    ekstremitas: "Ekstremitas: Akral hangat, CRT < 2 detik pada 4 ekstremitas, edema tungkai (-/-), reflek fisiologis normal (+/+)."
};

export default function PemeriksaanAnamnesisPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const patientIdParam = searchParams.get("patientId");

    const [patients, setPatients] = useState<PatientRecord[]>(() => getSavedPatients());
    const [currentPatient, setCurrentPatient] = useState<PatientRecord>(() => {
        return getPatientById(patientIdParam);
    });

    // Alert Modal State
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

    // Active Clinical Tab Step: 'all' | 'subjective' | 'objective' | 'assessment' | 'plan'
    const [activeSection, setActiveSection] = useState<"all" | "subjective" | "objective" | "assessment" | "plan">("all");

    // Form Storage Key
    const storageKey = `simrs_soap_exam_${currentPatient.id}`;

    // --- FORM STATES ---
    const [keluhanUtama, setKeluhanUtama] = useState(currentPatient.chiefComplaint || "");
    const [riwayatSekarang, setRiwayatSekarang] = useState("Keluhan dirasakan memberat sejak 3 hari terakhir, terutama saat beraktivitas fisik.");
    const [riwayatPenyakitDahulu, setRiwayatPenyakitDahulu] = useState("Riwayat Hipertensi terkontrol 2 tahun. DM disangkal. Riwayat asma disangkal.");
    const [riwayatPenyakitKeluarga, setRiwayatPenyakitKeluarga] = useState("Ayah ada riwayat penyakit jantung koroner.");
    const [riwayatAlergi, setRiwayatAlergi] = useState(currentPatient.allergies?.join(", ") || "Alergi Obat: Penicillin (Reaksi: Ruam kulit / gatal)");

    // Vitals
    const [bpSys, setBpSys] = useState(currentPatient.vitals?.bp?.split("/")[0] || "120");
    const [bpDia, setBpDia] = useState(currentPatient.vitals?.bp?.split("/")[1] || "80");
    const [hr, setHr] = useState(currentPatient.vitals?.hr || "78");
    const [temp, setTemp] = useState(currentPatient.vitals?.temp || "36.6");
    const [rr, setRr] = useState(currentPatient.vitals?.rr || "20");
    const [spo2, setSpo2] = useState(currentPatient.vitals?.spo2 || "98");
    const [height, setHeight] = useState(currentPatient.vitals?.height || "170");
    const [weight, setWeight] = useState(currentPatient.vitals?.weight || "68");
    const [kesadaran, setKesadaran] = useState(currentPatient.vitals?.kesadaran || "Compos Mentis (GCS E4V5M6)");

    // Physical Exam
    const [pemeriksaanKepala, setPemeriksaanKepala] = useState(NORMAL_EXAM_PRESETS.kepala);
    const [pemeriksaanThorax, setPemeriksaanThorax] = useState(NORMAL_EXAM_PRESETS.thorax);
    const [pemeriksaanAbdomen, setPemeriksaanAbdomen] = useState(NORMAL_EXAM_PRESETS.abdomen);
    const [pemeriksaanEkstremitas, setPemeriksaanEkstremitas] = useState(NORMAL_EXAM_PRESETS.ekstremitas);
    const [statusLokalisLain, setStatusLokalisLain] = useState("");

    // Assessment ICD-10
    const [icdSearchQuery, setIcdSearchQuery] = useState("");
    const [icdCode, setIcdCode] = useState(currentPatient.icdCode || "I20.9");
    const [icdName, setIcdName] = useState(currentPatient.diagnosis || "Angina Pectoris, unspecified");
    const [diagnosaSekunder, setDiagnosaSekunder] = useState("I10 - Essential (primary) hypertension");
    const [catatanMedis, setCatatanMedis] = useState("Kondisi klinis hemodinamik stabil. Pasien dianjurkan istirahat cukup dan modifikasi diet rendah garam.");

    // Plan & Follow-up
    const [tindakLanjut, setTindakLanjut] = useState("Rawat Jalan / Kontrol Ulang 1 Minggu");
    const [edukasiPasien, setEdukasiPasien] = useState("Edukasi minum obat teratur, pembatasan aktivitas berat mendadak, kontrol tanda bahaya nyeri dada.");

    // Load persisted state when patient changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    const data: Partial<ExamFormData> = JSON.parse(saved);
                    if (data.keluhanUtama) setKeluhanUtama(data.keluhanUtama);
                    if (data.riwayatSekarang) setRiwayatSekarang(data.riwayatSekarang);
                    if (data.riwayatPenyakitDahulu) setRiwayatPenyakitDahulu(data.riwayatPenyakitDahulu);
                    if (data.riwayatPenyakitKeluarga) setRiwayatPenyakitKeluarga(data.riwayatPenyakitKeluarga);
                    if (data.riwayatAlergi) setRiwayatAlergi(data.riwayatAlergi);
                    if (data.bpSys) setBpSys(data.bpSys);
                    if (data.bpDia) setBpDia(data.bpDia);
                    if (data.hr) setHr(data.hr);
                    if (data.temp) setTemp(data.temp);
                    if (data.rr) setRr(data.rr);
                    if (data.spo2) setSpo2(data.spo2);
                    if (data.height) setHeight(data.height);
                    if (data.weight) setWeight(data.weight);
                    if (data.kesadaran) setKesadaran(data.kesadaran);
                    if (data.pemeriksaanKepala) setPemeriksaanKepala(data.pemeriksaanKepala);
                    if (data.pemeriksaanThorax) setPemeriksaanThorax(data.pemeriksaanThorax);
                    if (data.pemeriksaanAbdomen) setPemeriksaanAbdomen(data.pemeriksaanAbdomen);
                    if (data.pemeriksaanEkstremitas) setPemeriksaanEkstremitas(data.pemeriksaanEkstremitas);
                    if (data.statusLokalisLain) setStatusLokalisLain(data.statusLokalisLain);
                    if (data.icdCode) setIcdCode(data.icdCode);
                    if (data.icdName) setIcdName(data.icdName);
                    if (data.diagnosaSekunder) setDiagnosaSekunder(data.diagnosaSekunder);
                    if (data.catatanMedis) setCatatanMedis(data.catatanMedis);
                    if (data.tindakLanjut) setTindakLanjut(data.tindakLanjut);
                    if (data.edukasiPasien) setEdukasiPasien(data.edukasiPasien);
                } catch {
                    // Ignore JSON parse error
                }
            } else {
                setKeluhanUtama(currentPatient.chiefComplaint || "");
                setIcdCode(currentPatient.icdCode || "I20.9");
                setIcdName(currentPatient.diagnosis || "Angina Pectoris, unspecified");
            }
        }
    }, [currentPatient.id, storageKey]);

    // Handle patient selection change
    const handleSwitchPatient = (patient: PatientRecord) => {
        setCurrentPatient(patient);
        setActivePatientId(patient.id);
        setSearchParams({ patientId: patient.id });
    };

    // Calculate next and prev patient indices
    const currentIdx = patients.findIndex(p => p.id === currentPatient.id);
    const prevPatient = currentIdx > 0 ? patients[currentIdx - 1] : null;
    const nextPatient = currentIdx < patients.length - 1 ? patients[currentIdx + 1] : null;

    // BMI Calculation & Indicators
    const bmiNum = Number(height) > 0 ? Number(weight) / Math.pow(Number(height) / 100, 2) : 0;
    const bmi = bmiNum > 0 ? bmiNum.toFixed(1) : "0";
    const bmiCategory = bmiNum < 18.5 ? "Underweight" : bmiNum < 25 ? "Normal Weight" : bmiNum < 30 ? "Overweight" : "Obesity";

    // Blood Pressure Indicator
    const sysNum = Number(bpSys);
    const diaNum = Number(bpDia);
    const bpStatus = sysNum >= 140 || diaNum >= 90
        ? { text: "Hipertensi", color: "text-rose-700 bg-rose-50 border-rose-200" }
        : sysNum >= 120 || diaNum >= 80
        ? { text: "Pre-Hipertensi", color: "text-amber-700 bg-amber-50 border-amber-200" }
        : { text: "Normal", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };

    // HR Status
    const hrNum = Number(hr);
    const hrStatus = hrNum > 100
        ? { text: "Takikardia", color: "text-rose-700 bg-rose-50 border-rose-200" }
        : hrNum < 60
        ? { text: "Bradikardia", color: "text-amber-700 bg-amber-50 border-amber-200" }
        : { text: "Normal", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };

    // Temp Status
    const tempNum = Number(temp);
    const tempStatus = tempNum >= 37.5
        ? { text: "Febris / Demam", color: "text-rose-700 bg-rose-50 border-rose-200" }
        : tempNum < 36.0
        ? { text: "Hipotermia", color: "text-blue-700 bg-blue-50 border-blue-200" }
        : { text: "Afebris Normal", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };

    // SpO2 Status
    const spo2Num = Number(spo2);
    const spo2Status = spo2Num < 95
        ? { text: "Hipoksia", color: "text-rose-700 bg-rose-50 border-rose-200" }
        : { text: "Normal", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };

    // Quick Append Symptom
    const handleAddSymptom = (sym: string) => {
        if (!keluhanUtama.trim()) {
            setKeluhanUtama(sym);
        } else if (!keluhanUtama.includes(sym)) {
            setKeluhanUtama(prev => `${prev}, ${sym}`);
        }
    };

    // Apply 1-Click All Normal Physical Exam
    const handleSetAllNormalPhysicalExam = () => {
        setPemeriksaanKepala(NORMAL_EXAM_PRESETS.kepala);
        setPemeriksaanThorax(NORMAL_EXAM_PRESETS.thorax);
        setPemeriksaanAbdomen(NORMAL_EXAM_PRESETS.abdomen);
        setPemeriksaanEkstremitas(NORMAL_EXAM_PRESETS.ekstremitas);
        showAlert("Seluruh pemeriksaan fisik sistemik (Kepala, Thorax, Abdomen, Ekstremitas) telah diatur ke Dalam Batas Normal (DBN).", "Preset DBN Diterapkan", "info");
    };

    // Save Handlers
    const handleSaveExam = (nextAction?: "resep" | "order" | "cppt") => {
        const payload: ExamFormData = {
            patientId: currentPatient.id,
            keluhanUtama,
            riwayatSekarang,
            riwayatPenyakitDahulu,
            riwayatPenyakitKeluarga,
            riwayatAlergi,
            bpSys,
            bpDia,
            hr,
            temp,
            rr,
            spo2,
            height,
            weight,
            kesadaran,
            pemeriksaanKepala,
            pemeriksaanThorax,
            pemeriksaanAbdomen,
            pemeriksaanEkstremitas,
            statusLokalisLain,
            icdCode,
            icdName,
            diagnosaSekunder,
            catatanMedis,
            tindakLanjut,
            edukasiPasien,
            lastSaved: new Date().toLocaleTimeString("id-ID")
        };

        if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, JSON.stringify(payload));
        }

        // Also update patient diagnosis in shared list
        const updatedPatients = patients.map(p => {
            if (p.id === currentPatient.id) {
                return {
                    ...p,
                    chiefComplaint: keluhanUtama,
                    diagnosis: icdName,
                    icdCode: icdCode,
                    vitals: {
                        bp: `${bpSys}/${bpDia}`,
                        hr,
                        temp,
                        rr,
                        spo2,
                        height,
                        weight,
                        kesadaran
                    }
                };
            }
            return p;
        });
        setPatients(updatedPatients);
        savePatients(updatedPatients);

        if (nextAction === "resep") {
            navigate(`/pemeriksaan/resep?patientId=${currentPatient.id}`);
        } else if (nextAction === "order") {
            navigate(`/pemeriksaan/order?patientId=${currentPatient.id}`);
        } else if (nextAction === "cppt") {
            navigate(`/pemeriksaan/cppt?patientId=${currentPatient.id}`);
        } else {
            showAlert(
                `Pemeriksaan klinis (SOAP) pasien ${currentPatient.name} (${currentPatient.norm}) berhasil disimpan secara lokal dan tersinkronisasi ke EMR!`,
                "Pemeriksaan Tersimpan",
                "success"
            );
        }
    };

    // Filtered ICD-10 Search List
    const filteredIcd10 = useMemo(() => {
        if (!icdSearchQuery.trim()) return QUICK_ICD10_LIST;
        const q = icdSearchQuery.toLowerCase();
        return QUICK_ICD10_LIST.filter(i =>
            i.code.toLowerCase().includes(q) ||
            i.name.toLowerCase().includes(q) ||
            i.category.toLowerCase().includes(q)
        );
    }, [icdSearchQuery]);

    return (
        <div className="space-y-6">
            <CustomAlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            {/* TOP CLINICAL PATIENT BANNER */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Patient identity */}
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xl shadow-md shadow-blue-500/20">
                            {currentPatient.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-lg font-black text-slate-900">{currentPatient.name}</h2>
                                <span className="font-mono text-xs font-black bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-xl border border-blue-200">
                                    {currentPatient.norm}
                                </span>
                                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-xl">
                                    Antrean {currentPatient.queueNo}
                                </span>
                                <span className={cn(
                                    "text-[10px] font-extrabold px-2 py-0.5 rounded-full border",
                                    currentPatient.guarantee === "BPJS"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-blue-50 text-blue-700 border-blue-200"
                                )}>
                                    {currentPatient.guarantee}
                                </span>
                            </div>

                            <p className="text-xs text-slate-500 mt-1">
                                {currentPatient.age} Tahun ({currentPatient.gender === "L" ? "Laki-laki" : "Perempuan"}) • Poli: <strong className="text-slate-800">{currentPatient.clinic}</strong> • DPJP: <strong className="text-slate-800">{currentPatient.doctorName}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Quick Patient Switcher Controls */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-2xl bg-slate-50 p-1 border border-slate-200">
                            <button
                                type="button"
                                disabled={!prevPatient}
                                onClick={() => prevPatient && handleSwitchPatient(prevPatient)}
                                title={prevPatient ? `Sebelumnya: ${prevPatient.name}` : "Awal antrean"}
                                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            <select
                                value={currentPatient.id}
                                onChange={(e) => {
                                    const found = patients.find(p => p.id === e.target.value);
                                    if (found) handleSwitchPatient(found);
                                }}
                                className="rounded-xl bg-transparent px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                            >
                                {patients.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.queueNo} - {p.name} ({p.clinic})
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                disabled={!nextPatient}
                                onClick={() => nextPatient && handleSwitchPatient(nextPatient)}
                                title={nextPatient ? `Berikutnya: ${nextPatient.name}` : "Akhir antrean"}
                                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Action Quick Link: Prescribe Recipe */}
                        <button
                            type="button"
                            onClick={() => handleSaveExam("resep")}
                            className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs cursor-pointer transition-all"
                        >
                            <PillBottle className="h-3.5 w-3.5" />
                            <span>E-Resep</span>
                        </button>

                        {/* Action Quick Link: Order Lab/Rad */}
                        <button
                            type="button"
                            onClick={() => handleSaveExam("order")}
                            className="flex items-center gap-1.5 rounded-2xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-2xs cursor-pointer transition-all"
                        >
                            <FlaskConical className="h-3.5 w-3.5" />
                            <span>Order Lab/Rad</span>
                        </button>
                    </div>
                </div>

                {/* Prominent Allergy Status Banner */}
                <div className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-2xl p-3 border text-xs",
                    riwayatAlergi && !riwayatAlergi.toLowerCase().includes("tidak ada")
                        ? "bg-rose-50/80 border-rose-200 text-rose-900"
                        : "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                )}>
                    <div className="flex items-center gap-2">
                        <ShieldAlert className={cn(
                            "h-4 w-4 shrink-0",
                            riwayatAlergi && !riwayatAlergi.toLowerCase().includes("tidak ada") ? "text-rose-600 animate-pulse" : "text-emerald-600"
                        )} />
                        <div>
                            <span className="font-extrabold uppercase tracking-wide text-[11px] mr-1">
                                Peringatan Alergi:
                            </span>
                            <span className="font-semibold">{riwayatAlergi || "Tidak Ada Riwayat Alergi (NKDA)"}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-slate-500">Edit cepat alergi:</span>
                        <input
                            type="text"
                            value={riwayatAlergi}
                            onChange={(e) => setRiwayatAlergi(e.target.value)}
                            placeholder="Tulis alergi obat/makanan..."
                            className="rounded-xl border border-rose-300 bg-white px-2.5 py-1 text-xs text-rose-950 font-bold focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* SECTION STEPPER NAVIGATION */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                    type="button"
                    onClick={() => setActiveSection("all")}
                    className={cn(
                        "flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer border",
                        activeSection === "all"
                            ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    )}
                >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Tampilkan Semua (SOAP Lengkap)</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveSection("subjective")}
                    className={cn(
                        "flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer border",
                        activeSection === "subjective"
                            ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50"
                    )}
                >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">S</span>
                    <span>1. Anamnesis (Subjective)</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveSection("objective")}
                    className={cn(
                        "flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer border",
                        activeSection === "objective"
                            ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-purple-50"
                    )}
                >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">O</span>
                    <span>2. TTV & Fisik (Objective)</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveSection("assessment")}
                    className={cn(
                        "flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer border",
                        activeSection === "assessment"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50"
                    )}
                >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">A</span>
                    <span>3. Diagnosa ICD-10 (Assessment)</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveSection("plan")}
                    className={cn(
                        "flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer border",
                        activeSection === "plan"
                            ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50"
                    )}
                >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">P</span>
                    <span>4. Rencana & Terapi (Plan)</span>
                </button>
            </div>

            {/* MAIN CLINICAL CONTENT GRID */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* LEFT & CENTER 2 COLUMNS: DETAILED SOAP FORM */}
                <div className="lg:col-span-2 space-y-6">

                    {/* SECTION 1: ANAMNESIS (SUBJECTIVE) */}
                    {(activeSection === "all" || activeSection === "subjective") && (
                        <div className="rounded-3xl border border-blue-200/80 bg-white p-5 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-black">
                                        S
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900">1. Anamnesis Pasien (Subjective)</h3>
                                        <p className="text-[11px] text-slate-500">Keluhan utama, riwayat penyakit, dan latar belakang medis</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                                    Standar Rekam Medis
                                </span>
                            </div>

                            <div className="space-y-4 text-xs">
                                {/* Chief Complaint with quick symptom tagger */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="font-extrabold text-slate-800">
                                            Keluhan Utama (Chief Complaint) <span className="text-rose-500">*</span>
                                        </label>
                                        <span className="text-[11px] text-slate-400">Klik gejala untuk menambahkan cepat</span>
                                    </div>

                                    {/* Quick symptom chip tagger */}
                                    <div className="flex flex-wrap gap-1.5 pb-1">
                                        {QUICK_SYMPTOMS.map((sym) => (
                                            <button
                                                key={sym}
                                                type="button"
                                                onClick={() => handleAddSymptom(sym)}
                                                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800 transition-all cursor-pointer"
                                            >
                                                + {sym}
                                            </button>
                                        ))}
                                    </div>

                                    <textarea
                                        rows={2}
                                        value={keluhanUtama}
                                        onChange={(e) => setKeluhanUtama(e.target.value)}
                                        placeholder="Tulis keluhan utama yang dirasakan pasien saat datang..."
                                        className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                    />
                                </div>

                                {/* Riwayat Penyakit Sekarang */}
                                <div>
                                    <label className="block font-extrabold text-slate-800 mb-1">
                                        Riwayat Penyakit Sekarang (RPS)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={riwayatSekarang}
                                        onChange={(e) => setRiwayatSekarang(e.target.value)}
                                        placeholder="Onset, durasi keluhan, kualitas rasa sakit, faktor memperberat / memperingan..."
                                        className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                    />
                                </div>

                                {/* RPD & RPK */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block font-extrabold text-slate-800 mb-1">
                                            Riwayat Penyakit Dahulu (RPD)
                                        </label>
                                        <input
                                            type="text"
                                            value={riwayatPenyakitDahulu}
                                            onChange={(e) => setRiwayatPenyakitDahulu(e.target.value)}
                                            placeholder="Hipertensi, DM, Jantung, Asma, Operasi terdahulu..."
                                            className="w-full rounded-2xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-extrabold text-slate-800 mb-1">
                                            Riwayat Penyakit Keluarga (RPK)
                                        </label>
                                        <input
                                            type="text"
                                            value={riwayatPenyakitKeluarga}
                                            onChange={(e) => setRiwayatPenyakitKeluarga(e.target.value)}
                                            placeholder="Penyakit kronis dalam silsilah keluarga..."
                                            className="w-full rounded-2xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: PEMERIKSAAN FISIK HEAD-TO-TOE (OBJECTIVE) */}
                    {(activeSection === "all" || activeSection === "objective") && (
                        <div className="rounded-3xl border border-purple-200/80 bg-white p-5 shadow-2xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-black">
                                        O
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900">2. Pemeriksaan Fisik Head-to-Toe (Objective)</h3>
                                        <p className="text-[11px] text-slate-500">Evaluasi sistemik anatomi dan organ tubuh</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSetAllNormalPhysicalExam}
                                    className="inline-flex items-center gap-1.5 rounded-2xl bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-800 hover:bg-purple-200 transition-all cursor-pointer self-start sm:self-auto"
                                    title="Isi otomatis semua organ dengan temuan Dalam Batas Normal"
                                >
                                    <Zap className="h-3.5 w-3.5 text-purple-700" />
                                    <span>Set Semua Normal (DBN)</span>
                                </button>
                            </div>

                            <div className="space-y-3.5 text-xs">
                                <div>
                                    <label className="block font-extrabold text-slate-800 mb-1">
                                        Kepala, Mata, THT, Mulut & Leher
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={pemeriksaanKepala}
                                        onChange={(e) => setPemeriksaanKepala(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block font-extrabold text-slate-800 mb-1">
                                        Thorax (Jantung & Paru-Paru)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={pemeriksaanThorax}
                                        onChange={(e) => setPemeriksaanThorax(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block font-extrabold text-slate-800 mb-1">
                                            Abdomen & Gastrointestinal
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={pemeriksaanAbdomen}
                                            onChange={(e) => setPemeriksaanAbdomen(e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-extrabold text-slate-800 mb-1">
                                            Ekstremitas & Neurologis
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={pemeriksaanEkstremitas}
                                            onChange={(e) => setPemeriksaanEkstremitas(e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-extrabold text-slate-800 mb-1">
                                        Status Lokalis Khusus / Catatan Tambahan
                                    </label>
                                    <input
                                        type="text"
                                        value={statusLokalisLain}
                                        onChange={(e) => setStatusLokalisLain(e.target.value)}
                                        placeholder="Cth: Regio manus dextra terdapat luka lecet 2x1 cm, perdarahan aktif (-)..."
                                        className="w-full rounded-2xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION 3: ASSESSMENT & DIAGNOSA ICD-10 (ASSESSMENT) */}
                    {(activeSection === "all" || activeSection === "assessment") && (
                        <div className="rounded-3xl border border-emerald-200/80 bg-white p-5 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-black">
                                        A
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900">3. Assessment & Diagnosa ICD-10</h3>
                                        <p className="text-[11px] text-slate-500">Penetapan diagnosa kerja dan klasifikasi standar WHO ICD-10</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                                    Katalog ICD-10 Cepat
                                </span>
                            </div>

                            <div className="space-y-4 text-xs">
                                {/* Quick diagnosis catalog chips */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-extrabold text-slate-700">Pilih Cepat Diagnosa Populer:</span>
                                        <span className="text-[11px] text-slate-400">1-Klik untuk mengisi kode & nama</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {QUICK_ICD10_LIST.map((icd) => (
                                            <button
                                                key={icd.code}
                                                type="button"
                                                onClick={() => {
                                                    setIcdCode(icd.code);
                                                    setIcdName(icd.name);
                                                }}
                                                className={cn(
                                                    "rounded-xl border px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer",
                                                    icdCode === icd.code
                                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                                                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50"
                                                )}
                                            >
                                                <strong>{icd.code}</strong> - {icd.name.split("(")[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ICD-10 Primary input fields */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block font-extrabold text-slate-800 mb-1">
                                            Kode ICD-10 Utama <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={icdCode}
                                            onChange={(e) => setIcdCode(e.target.value)}
                                            placeholder="Cth: I20.9"
                                            className="w-full rounded-2xl border border-slate-200 bg-white p-2.5 font-mono text-xs font-black text-slate-900 focus:border-emerald-600 focus:outline-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block font-extrabold text-slate-800 mb-1">
                                            Nama Diagnosa ICD-10 Utama <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={icdName}
                                            onChange={(e) => setIcdName(e.target.value)}
                                            placeholder="Nama deskripsi diagnosa medis..."
                                            className="w-full rounded-2xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Secondary Diagnoses */}
                                <div>
                                    <label className="block font-extrabold text-slate-800 mb-1">
                                        Diagnosa Sekunder / Komorbiditas Tambahan
                                    </label>
                                    <input
                                        type="text"
                                        value={diagnosaSekunder}
                                        onChange={(e) => setDiagnosaSekunder(e.target.value)}
                                        placeholder="Diagnosa penyerta ICD-10 lainnya..."
                                        className="w-full rounded-2xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
                                    />
                                </div>

                                {/* Clinical Notes */}
                                <div>
                                    <label className="block font-extrabold text-slate-800 mb-1">
                                        Catatan Evaluasi Medis & Telaah DPJP
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={catatanMedis}
                                        onChange={(e) => setCatatanMedis(e.target.value)}
                                        placeholder="Catatan telaah medis, prognosa, respon terapi, dll..."
                                        className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION 4: PLAN & TINDAK LANJUT (PLAN) */}
                    {(activeSection === "all" || activeSection === "plan") && (
                        <div className="rounded-3xl border border-amber-200/80 bg-white p-5 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-black">
                                        P
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900">4. Rencana Terapi & Edukasi (Plan)</h3>
                                        <p className="text-[11px] text-slate-500">Tindak lanjut pasien, resep, order penunjang, dan edukasi</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
                                    Instruksi Klinis
                                </span>
                            </div>

                            <div className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-extrabold text-slate-800 mb-1">
                                        Edukasi & Rencana Terapi Non-Farmakologis
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={edukasiPasien}
                                        onChange={(e) => setEdukasiPasien(e.target.value)}
                                        placeholder="Instruksi pola makan, istirahat, kontrol tanda bahaya, edukasi obat..."
                                        className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-amber-600 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block font-extrabold text-slate-800 mb-1">
                                        Rencana Tindak Lanjut Pasien
                                    </label>
                                    <select
                                        value={tindakLanjut}
                                        onChange={(e) => setTindakLanjut(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-800 focus:border-amber-600 focus:bg-white focus:outline-none cursor-pointer"
                                    >
                                        <option value="Rawat Jalan / Kontrol Ulang 1 Minggu">Rawat Jalan / Kontrol Ulang 1 Minggu</option>
                                        <option value="Rawat Jalan / Kontrol Ulang 2 Minggu">Rawat Jalan / Kontrol Ulang 2 Minggu</option>
                                        <option value="Selesai / Sembuh (Tidak Perlu Kontrol)">Selesai / Sembuh Total</option>
                                        <option value="Rujuk Rawat Inap (Ranap)">Rujuk Rawat Inap (Bangsal Ranap)</option>
                                        <option value="Rujuk Eksternal / RS Tipe Lebih Tinggi">Rujuk Eksternal RS Tipe Lebih Tinggi</option>
                                    </select>
                                </div>

                                {/* Integrated Module Triggers */}
                                <div className="rounded-2xl bg-amber-50/60 p-4 border border-amber-200/80 space-y-2">
                                    <h4 className="font-extrabold text-amber-900 text-xs">Aksi Lanjutan Resep & Pemeriksaan Penunjang:</h4>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => handleSaveExam("resep")}
                                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs cursor-pointer"
                                        >
                                            <PillBottle className="h-3.5 w-3.5" />
                                            <span>Simpan & Buat Resep Obat (E-Prescribing)</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleSaveExam("order")}
                                            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-2xs cursor-pointer"
                                        >
                                            <FlaskConical className="h-3.5 w-3.5" />
                                            <span>Simpan & Order Penunjang Lab/Rad</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleSaveExam("cppt")}
                                            className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-900 shadow-2xs cursor-pointer"
                                        >
                                            <FileText className="h-3.5 w-3.5" />
                                            <span>Sinkronkan ke CPPT Terintegrasi</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT 1 COLUMN: VITAL SIGNS, BMI & SAVE ACTION WORKSTATION */}
                <div className="space-y-4">
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4 sticky top-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-rose-600" />
                                <h3 className="text-sm font-black text-slate-900">Tanda-Tanda Vital (TTV)</h3>
                            </div>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                                EWS Monitoring
                            </span>
                        </div>

                        {/* Kesadaran */}
                        <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-600">Tingkat Kesadaran</label>
                            <select
                                value={kesadaran}
                                onChange={(e) => setKesadaran(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none cursor-pointer"
                            >
                                <option value="Compos Mentis (GCS E4V5M6)">Compos Mentis (GCS 15)</option>
                                <option value="Apatis (GCS E3V5M6)">Apatis (GCS 14)</option>
                                <option value="Somnolen (GCS E3V4M5)">Somnolen (GCS 12)</option>
                                <option value="Sopor (GCS E2V2M4)">Sopor (GCS 8)</option>
                                <option value="Koma (GCS E1V1M1)">Koma (GCS 3)</option>
                            </select>
                        </div>

                        {/* Interactive Vital Signs Cards Grid */}
                        <div className="grid grid-cols-2 gap-2.5 text-xs">
                            {/* Tekanan Darah */}
                            <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-500">Tekanan Darah</span>
                                    <span className={cn("text-[9px] font-extrabold px-1.5 py-0.2 rounded border", bpStatus.color)}>
                                        {bpStatus.text}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        value={bpSys}
                                        onChange={(e) => setBpSys(e.target.value)}
                                        className="w-12 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono text-sm font-black text-slate-900 focus:outline-none"
                                    />
                                    <span className="text-slate-400 font-bold">/</span>
                                    <input
                                        type="number"
                                        value={bpDia}
                                        onChange={(e) => setBpDia(e.target.value)}
                                        className="w-12 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono text-sm font-black text-slate-900 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400">mmHg</span>
                                </div>
                            </div>

                            {/* Denyut Nadi (HR) */}
                            <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-500">Nadi (HR)</span>
                                    <span className={cn("text-[9px] font-extrabold px-1.5 py-0.2 rounded border", hrStatus.color)}>
                                        {hrStatus.text}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="number"
                                        value={hr}
                                        onChange={(e) => setHr(e.target.value)}
                                        className="w-14 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono text-sm font-black text-slate-900 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400 font-semibold">bpm</span>
                                </div>
                            </div>

                            {/* Suhu Tubuh */}
                            <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-500">Suhu (°C)</span>
                                    <span className={cn("text-[9px] font-extrabold px-1.5 py-0.2 rounded border", tempStatus.color)}>
                                        {tempStatus.text}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="text"
                                        value={temp}
                                        onChange={(e) => setTemp(e.target.value)}
                                        className="w-14 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono text-sm font-black text-slate-900 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400 font-semibold">°C</span>
                                </div>
                            </div>

                            {/* Pernapasan (RR) */}
                            <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100 space-y-1">
                                <span className="text-[10px] font-bold text-slate-500 block">Pernapasan</span>
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="number"
                                        value={rr}
                                        onChange={(e) => setRr(e.target.value)}
                                        className="w-14 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono text-sm font-black text-slate-900 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400 font-semibold">x/mnt</span>
                                </div>
                            </div>

                            {/* Saturasi O2 */}
                            <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-500">SpO2</span>
                                    <span className={cn("text-[9px] font-extrabold px-1.5 py-0.2 rounded border", spo2Status.color)}>
                                        {spo2Status.text}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="number"
                                        value={spo2}
                                        onChange={(e) => setSpo2(e.target.value)}
                                        className="w-14 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono text-sm font-black text-slate-900 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400 font-semibold">%</span>
                                </div>
                            </div>

                            {/* Berat / Tinggi */}
                            <div className="rounded-2xl bg-slate-50/70 p-3 border border-slate-100 space-y-1">
                                <span className="text-[10px] font-bold text-slate-500 block">BB / TB</span>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        title="Berat Badan (kg)"
                                        className="w-10 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono text-xs font-black text-slate-900 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400">kg</span>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        title="Tinggi Badan (cm)"
                                        className="w-10 rounded-lg border border-slate-200 bg-white p-1 text-center font-mono text-xs font-black text-slate-900 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400">cm</span>
                                </div>
                            </div>
                        </div>

                        {/* Automated BMI Card */}
                        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-3 border border-blue-100 text-center space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                                Body Mass Index (BMI)
                            </span>
                            <div className="text-xl font-black text-blue-900">
                                {bmi} <span className="text-xs font-normal text-blue-600">kg/m²</span>
                            </div>
                            <span className="inline-block rounded-full bg-blue-200/80 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-900">
                                {bmiCategory}
                            </span>
                        </div>

                        {/* Save & Finish Action Buttons */}
                        <div className="space-y-2 pt-2">
                            <button
                                type="button"
                                onClick={() => handleSaveExam()}
                                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-black text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
                            >
                                <Save className="h-4 w-4" />
                                <span>Simpan Pemeriksaan (SOAP)</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    updatePatientStatus(currentPatient.id, "Selesai");
                                    showAlert(`Pemeriksaan pasien ${currentPatient.name} telah ditandai Selesai!`, "Status Diperbarui", "success");
                                    if (nextPatient) {
                                        setTimeout(() => handleSwitchPatient(nextPatient), 1200);
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer"
                            >
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span>Tandai Selesai & Pasien Berikutnya</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
