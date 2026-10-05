import { useState } from "react";
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
    Ruler
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { PatientRecord } from "../pemeriksaan";

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

    // Form inputs
    const [keluhanUtama, setKeluhanUtama] = useState(currentPatient.chiefComplaint || "");
    const [riwayatSekarang, setRiwayatSekarang] = useState("Keluhan dirasakan sejak 3 hari lalu, bertambah berat jika aktivitas fisik.");
    const [riwayatAlergi, setRiwayatAlergi] = useState("Alergi Obat: Penicillin (Gatal/Ruam)");

    // Vitals
    const [bpSys, setBpSys] = useState("120");
    const [bpDia, setBpDia] = useState("80");
    const [hr, setHr] = useState("78");
    const [temp, setTemp] = useState("36.6");
    const [rr, setRr] = useState("20");
    const [spo2, setSpo2] = useState("98");
    const [height, setHeight] = useState("170");
    const [weight, setWeight] = useState("68");

    // ICD-10 Diagnosis
    const [icdCode, setIcdCode] = useState("I20.9");
    const [icdName, setIcdName] = useState("Angina Pectoris, unspecified");
    const [catatanMedis, setCatatanMedis] = useState("Keadaan umum baik, kesadaran compos mentis. Suara napas vesikuler.");

    // Calculated BMI
    const bmi = (Number(weight) / Math.pow(Number(height) / 100, 2)).toFixed(1);

    const handleSave = () => {
        alert(`Pemeriksaan Anamnesis & Fisik Pasien ${currentPatient.name} (${currentPatient.norm}) berhasil disimpan!`);
        if (onSaveSuccess) onSaveSuccess();
    };

    return (
        <div className="space-y-6">
            {/* Active Patient Selector Bar */}
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
                            {currentPatient.age} Tahun ({currentPatient.gender}) • Poli: <strong className="text-slate-800">{currentPatient.clinic}</strong> • DPJP: <strong className="text-slate-800">{currentPatient.doctorName}</strong>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={currentPatient.id}
                        onChange={(e) => {
                            const found = patients.find(p => p.id === e.target.value);
                            if (found) {
                                setCurrentPatient(found);
                                setKeluhanUtama(found.chiefComplaint);
                            }
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.queueNo} - {p.name} ({p.clinic})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Anamnesis & Clinical Forms */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Subjective & Objective Forms (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Subjective Anamnesis */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Stethoscope className="h-4 w-4 text-blue-600" />
                            <h3 className="text-sm font-bold text-slate-900">Anamnesis Pasien (S - Subjective)</h3>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Keluhan Utama</label>
                                <textarea
                                    rows={2}
                                    value={keluhanUtama}
                                    onChange={(e) => setKeluhanUtama(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Riwayat Penyakit Sekarang</label>
                                <textarea
                                    rows={2}
                                    value={riwayatSekarang}
                                    onChange={(e) => setRiwayatSekarang(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1 text-rose-600">Riwayat Alergi Obat / Makanan</label>
                                <input
                                    type="text"
                                    value={riwayatAlergi}
                                    onChange={(e) => setRiwayatAlergi(e.target.value)}
                                    className="w-full rounded-xl border border-rose-200 bg-rose-50/50 p-2.5 text-xs text-rose-900 font-medium focus:border-rose-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Assessment & Diagnosa ICD-10 */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <FileText className="h-4 w-4 text-purple-600" />
                            <h3 className="text-sm font-bold text-slate-900">Diagnosa & Assessment (A - Assessment)</h3>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Kode ICD-10</label>
                                    <input
                                        type="text"
                                        value={icdCode}
                                        onChange={(e) => setIcdCode(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono font-bold"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block font-bold text-slate-700 mb-1">Nama Diagnosa ICD-10</label>
                                    <input
                                        type="text"
                                        value={icdName}
                                        onChange={(e) => setIcdName(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Pemeriksaan Fisik & Catatan Klinis (Objective)</label>
                                <textarea
                                    rows={3}
                                    value={catatanMedis}
                                    onChange={(e) => setCatatanMedis(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 p-3 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Vital Signs & Action */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-slate-900">Vital Signs & Fisik</h3>
                            </div>
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">O - Objective</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                                <span className="text-slate-400 block text-[10px]">Tekanan Darah</span>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <input value={bpSys} onChange={(e) => setBpSys(e.target.value)} className="w-8 font-bold text-slate-900 bg-transparent text-center" />
                                    <span>/</span>
                                    <input value={bpDia} onChange={(e) => setBpDia(e.target.value)} className="w-8 font-bold text-slate-900 bg-transparent text-center" />
                                    <span className="text-[10px] text-slate-400">mmHg</span>
                                </div>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                                <span className="text-slate-400 block text-[10px]">Detak Nadi (HR)</span>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <input value={hr} onChange={(e) => setHr(e.target.value)} className="w-10 font-bold text-slate-900 bg-transparent text-center" />
                                    <span className="text-[10px] text-slate-400">bpm</span>
                                </div>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                                <span className="text-slate-400 block text-[10px]">Suhu Tubuh</span>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <input value={temp} onChange={(e) => setTemp(e.target.value)} className="w-10 font-bold text-slate-900 bg-transparent text-center" />
                                    <span className="text-[10px] text-slate-400">°C</span>
                                </div>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                                <span className="text-slate-400 block text-[10px]">Saturasi O2</span>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <input value={spo2} onChange={(e) => setSpo2(e.target.value)} className="w-10 font-bold text-slate-900 bg-transparent text-center" />
                                    <span className="text-[10px] text-slate-400">%</span>
                                </div>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                                <span className="text-slate-400 block text-[10px]">Tinggi Badan</span>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <input value={height} onChange={(e) => setHeight(e.target.value)} className="w-10 font-bold text-slate-900 bg-transparent text-center" />
                                    <span className="text-[10px] text-slate-400">cm</span>
                                </div>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                                <span className="text-slate-400 block text-[10px]">Berat Badan</span>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <input value={weight} onChange={(e) => setWeight(e.target.value)} className="w-10 font-bold text-slate-900 bg-transparent text-center" />
                                    <span className="text-[10px] text-slate-400">kg</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-blue-50 p-3 border border-blue-100 text-center text-xs">
                            <span className="text-blue-600 font-medium">Body Mass Index (BMI):</span>
                            <p className="text-lg font-black text-blue-900">{bmi} kg/m²</p>
                            <span className="text-[10px] text-blue-700 font-bold">Kategori: Normal Weight</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
                        >
                            Simpan Hasil Anamnesis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
