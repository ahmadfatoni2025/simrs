import { useState, useEffect } from "react";
import {
    Stethoscope,
    Activity,
    ClipboardList,
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
    Save
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { PatientRecord } from "../pemeriksaan";

import { CustomAlertModal, type AlertType } from "~/components/ui/CustomAlertModal";

interface PemeriksaanAnamnesisProps {
    patients: PatientRecord[];
    selectedPatient?: PatientRecord | null;
    onSaveSuccess?: () => void;
}

export default function PemeriksaanAnamnesis({
    patients,
    selectedPatient: propPatient,
    onSaveSuccess
}: PemeriksaanAnamnesisProps) {
    const [currentPatient, setCurrentPatient] = useState<PatientRecord>(
        propPatient || patients[0] || {
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
            chiefComplaint: "Keluhan nyeri dada ringan dan sesak napas saat tangga.",
            vitals: { bp: "120/80", hr: "78 bpm", temp: "36.6 °C", spo2: "98%" }
        }
    );

    // Custom Alert State
    const [alertState, setAlertState] = useState<{ isOpen: boolean; title?: string; message: string; type?: AlertType }>({
        isOpen: false,
        message: ""
    });

    const showAlert = (message: string, title?: string, type: AlertType = "success") => {
        setAlertState({ isOpen: true, message, title, type });
    };

    // Dynamic Form Data with Persistence
    const storageKey = `simrs_exam_${currentPatient.id}`;

    const [keluhanUtama, setKeluhanUtama] = useState(currentPatient.chiefComplaint || "");
    const [riwayatSekarang, setRiwayatSekarang] = useState("Keluhan dirasakan sejak 3 hari lalu, bertambah berat jika aktivitas fisik.");
    const [riwayatPenyakitDahulu, setRiwayatPenyakitDahulu] = useState("Hipertensi (terkontrol 2 tahun), Tidak ada riwayat Diabetes Mellitus.");
    const [riwayatPenyakitKeluarga, setRiwayatPenyakitKeluarga] = useState("Ayah riwayat Penyakit Jantung Koroner (PJK).");
    const [riwayatAlergi, setRiwayatAlergi] = useState("Alergi Obat: Penicillin (Gatal/Ruam kulit)");

    // Vitals
    const [bpSys, setBpSys] = useState("120");
    const [bpDia, setBpDia] = useState("80");
    const [hr, setHr] = useState("78");
    const [temp, setTemp] = useState("36.6");
    const [rr, setRr] = useState("20");
    const [spo2, setSpo2] = useState("98");
    const [height, setHeight] = useState("170");
    const [weight, setWeight] = useState("68");
    const [kesadaran, setKesadaran] = useState("Compos Mentis (GCS E4V5M6)");

    // Physical Examination (Head-to-Toe)
    const [pemeriksaanKepala, setPemeriksaanKepala] = useState("Mata: Anemis (-/-), Ikterik (-/-). THT: DBN.");
    const [pemeriksaanThorax, setPemeriksaanThorax] = useState("Jantung: S1-S2 murni, Murmur (-). Paru: Vesikuler (+/+), Ronkhi (-/-), Wheezing (-/-).");
    const [pemeriksaanAbdomen, setPemeriksaanAbdomen] = useState("Datar, Supel, Bising Usus (+) normal, Nyeri tekan (-).");
    const [pemeriksaanEkstremitas, setPemeriksaanEkstremitas] = useState("Akral hangat, CRT < 2 detik, Edema (-/-).");

    // ICD-10 Diagnosis & Assessment
    const [icdCode, setIcdCode] = useState("I20.9");
    const [icdName, setIcdName] = useState("Angina Pectoris, unspecified");
    const [diagnosaSekunder, setDiagnosaSekunder] = useState("I10 - Essential (primary) hypertension");
    const [catatanMedis, setCatatanMedis] = useState("Kondisi klinis hemodinamik stabil. Terapi antiangina dan antihipertensi dilanjutkan.");
    const [tindakLanjut, setTindakLanjut] = useState("Rawat Jalan / Kontrol Ulang 1 Minggu");

    // Load persisted state on patient change
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    setKeluhanUtama(data.keluhanUtama || currentPatient.chiefComplaint || "");
                    setRiwayatSekarang(data.riwayatSekarang || "");
                    setRiwayatPenyakitDahulu(data.riwayatPenyakitDahulu || "");
                    setRiwayatPenyakitKeluarga(data.riwayatPenyakitKeluarga || "");
                    setRiwayatAlergi(data.riwayatAlergi || "");
                    setBpSys(data.bpSys || "120");
                    setBpDia(data.bpDia || "80");
                    setHr(data.hr || "78");
                    setTemp(data.temp || "36.6");
                    setRr(data.rr || "20");
                    setSpo2(data.spo2 || "98");
                    setHeight(data.height || "170");
                    setWeight(data.weight || "68");
                    setKesadaran(data.kesadaran || "Compos Mentis (GCS E4V5M6)");
                    setPemeriksaanKepala(data.pemeriksaanKepala || "");
                    setPemeriksaanThorax(data.pemeriksaanThorax || "");
                    setPemeriksaanAbdomen(data.pemeriksaanAbdomen || "");
                    setPemeriksaanEkstremitas(data.pemeriksaanEkstremitas || "");
                    setIcdCode(data.icdCode || "I20.9");
                    setIcdName(data.icdName || "Angina Pectoris, unspecified");
                    setDiagnosaSekunder(data.diagnosaSekunder || "");
                    setCatatanMedis(data.catatanMedis || "");
                    setTindakLanjut(data.tindakLanjut || "Rawat Jalan / Kontrol Ulang 1 Minggu");
                } catch (e) { /* ignore */ }
            } else {
                setKeluhanUtama(currentPatient.chiefComplaint || "");
            }
        }
    }, [currentPatient.id, storageKey]);

    // Calculated BMI
    const bmiNum = Number(height) > 0 ? (Number(weight) / Math.pow(Number(height) / 100, 2)) : 0;
    const bmi = bmiNum > 0 ? bmiNum.toFixed(1) : "0";
    const bmiCategory = bmiNum < 18.5 ? "Underweight" : bmiNum < 25 ? "Normal Weight" : bmiNum < 30 ? "Overweight" : "Obesity";

    const handleSave = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const payload = {
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
            icdCode,
            icdName,
            diagnosaSekunder,
            catatanMedis,
            tindakLanjut
        };

        if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, JSON.stringify(payload));
        }

        showAlert(
            `Pemeriksaan Anamnesis & Fisik Pasien ${currentPatient.name} (${currentPatient.norm}) berhasil disimpan dan tersinkronisasi ke Rekam Medis Elektronik!`,
            "Pemeriksaan Disimpan",
            "success"
        );
        if (onSaveSuccess) onSaveSuccess();
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <CustomAlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />
            {/* Active Patient Selector & Header Bar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-slate-900">{currentPatient.name}</h3>
                            <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                                {currentPatient.norm}
                            </span>
                            <span className="text-xs text-slate-400">({currentPatient.queueNo})</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {currentPatient.age} Tahun ({currentPatient.gender}) • Poli: <strong className="text-slate-800">{currentPatient.clinic}</strong> • DPJP: <strong className="text-slate-800">{currentPatient.doctorName}</strong> • Penjamin: <strong className="text-emerald-700">{currentPatient.guarantee}</strong>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Pilih Pasien:</span>
                    <select
                        value={currentPatient.id}
                        onChange={(e) => {
                            const found = patients.find(p => p.id === e.target.value);
                            if (found) {
                                setCurrentPatient(found);
                            }
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:outline-none"
                    >
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.queueNo} - {p.name} ({p.clinic})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Anamnesis & Clinical Forms Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Subjective, Physical Exam, and Diagnoses Forms (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* SECTION 1: Subjective Anamnesis (S) */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-slate-900">1. Anamnesis Pasien (S - Subjective)</h3>
                            </div>
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Standard Rekam Medis</span>
                        </div>

                        <div className="space-y-3.5 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Keluhan Utama (Chief Complaint)</label>
                                <textarea
                                    rows={2}
                                    value={keluhanUtama}
                                    onChange={(e) => setKeluhanUtama(e.target.value)}
                                    placeholder="Keluhan utama yang dirasakan pasien..."
                                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs focus:border-blue-600 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Riwayat Penyakit Sekarang (RPS)</label>
                                <textarea
                                    rows={2}
                                    value={riwayatSekarang}
                                    onChange={(e) => setRiwayatSekarang(e.target.value)}
                                    placeholder="Onset, durasi, lokasi, kualitas, faktor memperberat/memperringan..."
                                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs focus:border-blue-600 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Riwayat Penyakit Dahulu (RPD)</label>
                                    <input
                                        type="text"
                                        value={riwayatPenyakitDahulu}
                                        onChange={(e) => setRiwayatPenyakitDahulu(e.target.value)}
                                        placeholder="Hipertensi, Diabetes, Asma, Operasi terdahulu..."
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Riwayat Penyakit Keluarga (RPK)</label>
                                    <input
                                        type="text"
                                        value={riwayatPenyakitKeluarga}
                                        onChange={(e) => setRiwayatPenyakitKeluarga(e.target.value)}
                                        placeholder="Riwayat penyakit keturunan dalam keluarga..."
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-rose-700 mb-1 flex items-center gap-1">
                                    <ShieldAlert className="h-3.5 w-3.5 text-rose-600" /> Riwayat Alergi (Obat / Makanan / Lingkungan)
                                </label>
                                <input
                                    type="text"
                                    value={riwayatAlergi}
                                    onChange={(e) => setRiwayatAlergi(e.target.value)}
                                    placeholder="Tulis jenis alergi dan reaksi alergi pasien..."
                                    className="w-full rounded-xl border border-rose-200 bg-rose-50/50 p-2.5 text-xs text-rose-900 font-semibold focus:border-rose-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Pemeriksaan Fisik Head-to-Toe (O) */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-purple-600" />
                                <h3 className="text-sm font-bold text-slate-900">2. Pemeriksaan Fisik Head-to-Toe (O - Objective)</h3>
                            </div>
                            <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">Status Lokalis</span>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Kepala, Mata, Leher, THT</label>
                                    <input
                                        type="text"
                                        value={pemeriksaanKepala}
                                        onChange={(e) => setPemeriksaanKepala(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-purple-600 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Thorax (Jantung & Paru)</label>
                                    <input
                                        type="text"
                                        value={pemeriksaanThorax}
                                        onChange={(e) => setPemeriksaanThorax(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-purple-600 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Abdomen & Pelvis</label>
                                    <input
                                        type="text"
                                        value={pemeriksaanAbdomen}
                                        onChange={(e) => setPemeriksaanAbdomen(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-purple-600 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Ekstremitas & Skin</label>
                                    <input
                                        type="text"
                                        value={pemeriksaanEkstremitas}
                                        onChange={(e) => setPemeriksaanEkstremitas(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-purple-600 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Assessment & Diagnosa ICD-10 (A) */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-slate-900">3. Assessment & Diagnosa ICD-10 (A - Assessment)</h3>
                            </div>
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">ICD-10 Standard</span>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Kode ICD-10 Utama</label>
                                    <input
                                        type="text"
                                        required
                                        value={icdCode}
                                        onChange={(e) => setIcdCode(e.target.value)}
                                        placeholder="I20.9"
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono font-bold focus:border-emerald-600 focus:outline-none"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block font-bold text-slate-700 mb-1">Nama Diagnosa ICD-10 Utama</label>
                                    <input
                                        type="text"
                                        required
                                        value={icdName}
                                        onChange={(e) => setIcdName(e.target.value)}
                                        placeholder="Angina Pectoris, unspecified"
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Diagnosa Sekunder / Komorbid</label>
                                <input
                                    type="text"
                                    value={diagnosaSekunder}
                                    onChange={(e) => setDiagnosaSekunder(e.target.value)}
                                    placeholder="Diagnosa penyerta ICD-10 lainnya..."
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Catatan Evaluasi Klinis DPJP</label>
                                <textarea
                                    rows={2}
                                    value={catatanMedis}
                                    onChange={(e) => setCatatanMedis(e.target.value)}
                                    placeholder="Catatan telaah medis, prognosa, atau resume klinis..."
                                    className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-600 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Vital Signs, BMI & Save (1 col) */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4 sticky top-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-slate-900">Vital Signs Pasien</h3>
                            </div>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">EWS Status</span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Tingkat Kesadaran</label>
                                <select
                                    value={kesadaran}
                                    onChange={(e) => setKesadaran(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                                >
                                    <option value="Compos Mentis (GCS E4V5M6)">Compos Mentis (GCS E4V5M6)</option>
                                    <option value="Apatis (GCS E3V5M6)">Apatis</option>
                                    <option value="Somnolen (GCS E3V4M5)">Somnolen</option>
                                    <option value="Sopor (GCS E2V2M4)">Sopor</option>
                                    <option value="Koma (GCS E1V1M1)">Koma</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                                    <span className="text-slate-400 block text-[10px] font-semibold">Tekanan Darah</span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <input value={bpSys} onChange={(e) => setBpSys(e.target.value)} className="w-8 font-bold text-slate-900 bg-white border border-slate-200 rounded text-center text-xs" />
                                        <span>/</span>
                                        <input value={bpDia} onChange={(e) => setBpDia(e.target.value)} className="w-8 font-bold text-slate-900 bg-white border border-slate-200 rounded text-center text-xs" />
                                        <span className="text-[10px] text-slate-400">mmHg</span>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                                    <span className="text-slate-400 block text-[10px] font-semibold">Nadi (HR)</span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <input value={hr} onChange={(e) => setHr(e.target.value)} className="w-10 font-bold text-slate-900 bg-white border border-slate-200 rounded text-center text-xs" />
                                        <span className="text-[10px] text-slate-400">bpm</span>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                                    <span className="text-slate-400 block text-[10px] font-semibold">Suhu Tubuh</span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <input value={temp} onChange={(e) => setTemp(e.target.value)} className="w-10 font-bold text-slate-900 bg-white border border-slate-200 rounded text-center text-xs" />
                                        <span className="text-[10px] text-slate-400">°C</span>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                                    <span className="text-slate-400 block text-[10px] font-semibold">Pernapasan (RR)</span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <input value={rr} onChange={(e) => setRr(e.target.value)} className="w-10 font-bold text-slate-900 bg-white border border-slate-200 rounded text-center text-xs" />
                                        <span className="text-[10px] text-slate-400">x/mnt</span>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                                    <span className="text-slate-400 block text-[10px] font-semibold">Saturasi (SpO2)</span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <input value={spo2} onChange={(e) => setSpo2(e.target.value)} className="w-10 font-bold text-slate-900 bg-white border border-slate-200 rounded text-center text-xs" />
                                        <span className="text-[10px] text-slate-400">%</span>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                                    <span className="text-slate-400 block text-[10px] font-semibold">Berat / Tinggi</span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <input value={weight} onChange={(e) => setWeight(e.target.value)} className="w-7 font-bold text-slate-900 bg-white border border-slate-200 rounded text-center text-xs" />
                                        <span className="text-[10px]">kg /</span>
                                        <input value={height} onChange={(e) => setHeight(e.target.value)} className="w-7 font-bold text-slate-900 bg-white border border-slate-200 rounded text-center text-xs" />
                                        <span className="text-[10px]">cm</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-blue-50 p-3 border border-blue-100 text-center text-xs space-y-0.5">
                                <span className="text-blue-600 font-medium text-[11px]">Body Mass Index (BMI):</span>
                                <p className="text-lg font-black text-blue-900">{bmi} <span className="text-xs font-normal">kg/m²</span></p>
                                <span className="inline-block rounded-full bg-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-900">
                                    {bmiCategory}
                                </span>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Rencana Tindak Lanjut Pasien</label>
                                <select
                                    value={tindakLanjut}
                                    onChange={(e) => setTindakLanjut(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                                >
                                    <option value="Rawat Jalan / Kontrol Ulang 1 Minggu">Rawat Jalan / Kontrol Ulang</option>
                                    <option value="Selesai / Sembuh (Tidak Perlu Kontrol)">Selesai / Sembuh Total</option>
                                    <option value="Rujuk Rawat Inap (Ranap)">Rujuk Rawat Inap (Ranap)</option>
                                    <option value="Rujuk Eksternal / RS Tipe Lebih Tinggi">Rujuk Eksternal RS Lain</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Save className="h-4 w-4" /> Simpan Anamnesis & Fisik
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
