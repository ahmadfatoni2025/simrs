import { useState } from "react";
import {
    FileText,
    Plus,
    Search,
    Clock,
    CheckCircle2,
    ChevronRight,
    User,
    Stethoscope,
    AlertCircle,
    X,
    Save,
    MessageCircle
} from "lucide-react";
import { cn } from "~/lib/utils";

interface CPPTEntry {
    id: string;
    waktu: string;
    tanggal: string;
    namaPasien: string;
    norm: string;
    kamar: string;
    bed: string;
    profesiPenulis: "Dokter" | "Perawat" | "Bidan" | "Apoteker" | "Gizi";
    namaPenulis: string;
    subjective: string;
    objective: string;
    assessment: string;
    planning: string;
    instruksiDPJP?: string;
    verified: boolean;
}

const MOCK_CPPT: CPPTEntry[] = [
    {
        id: "cppt-1",
        waktu: "07:30",
        tanggal: "05 Okt 2026",
        namaPasien: "Rina Kusuma",
        norm: "RM-2026-0039",
        kamar: "Kamar Mawar 01",
        bed: "Bed-01",
        profesiPenulis: "Perawat",
        namaPenulis: "Ns. Siti Aminah, S.Kep",
        subjective: "Pasien mengeluh nyeri pada kaki kanan skala 5/10, tidur terbangun 2x malam tadi.",
        objective: "TD: 130/80 mmHg, N: 88x/min, S: 36.8°C, RR: 20x/min, SpO2: 98%. Luka operasi hari ke-4, tampak kering, tidak ada tanda infeksi.",
        assessment: "Post op fraktur femur dextra hari ke-4, nyeri terkontrol, mobilisasi bertahap.",
        planning: "Lanjutkan terapi analgesik, fisioterapi ROM aktif, evaluasi nyeri tiap 4 jam.",
        instruksiDPJP: "Ketorolac 30mg IV/8 jam, latihan ROM progresif, cek Hb besok pagi.",
        verified: true,
    },
    {
        id: "cppt-2",
        waktu: "08:15",
        tanggal: "05 Okt 2026",
        namaPasien: "Ahmad Fauzi",
        norm: "RM-2026-0044",
        kamar: "Kamar Melati 01",
        bed: "Bed-02",
        profesiPenulis: "Dokter",
        namaPenulis: "Dr. Veronica Nguyen, Sp.N",
        subjective: "Pasien masih terasa lemah pada sisi kiri tubuh, bicara masih pelo.",
        objective: "GCS E4V4M6, defisit motorik hemiparesis sinistra grade 3, reflex Babinski (+) kiri. CT scan kontrol: lesi iskemik luas di MCA dextra.",
        assessment: "Stroke iskemik MCA dextra hari ke-3, hemiparesis sinistra progresif.",
        planning: "Lanjutkan Citicholine 500mg IV/12 jam, Clopidogrel 75mg PO/hari, konsul fisioterapi neuro, monitoring GCS/jam.",
        instruksiDPJP: "Jika GCS turun < E3V3M5 → pindah ICU segera. Cek PT/APTT hari ini.",
        verified: true,
    },
    {
        id: "cppt-3",
        waktu: "10:00",
        tanggal: "05 Okt 2026",
        namaPasien: "Hendra Wijaya",
        norm: "RM-2026-0028",
        kamar: "Kamar Anggrek 01",
        bed: "Bed-01",
        profesiPenulis: "Perawat",
        namaPenulis: "Ns. Rini Handayani, S.Kep",
        subjective: "Pasien merasa lebih baik, nafsu makan mulai membaik, demam sudah turun sejak semalam.",
        objective: "TD: 110/70 mmHg, N: 78x/min, S: 36.5°C, RR: 18x/min. Trombosit: 120.000 (naik dari 85.000). Intake cairan baik.",
        assessment: "DHF Grade II hari ke-4, fase recovery, trombosit meningkat.",
        planning: "Lanjutkan IVFD RL 20 tpm, pantau tanda-tanda syok, cek DL ulang besok pagi. Rencana discharge jika trombosit > 150.000.",
        verified: false,
    },
    {
        id: "cppt-4",
        waktu: "11:30",
        tanggal: "05 Okt 2026",
        namaPasien: "Maya Putri",
        norm: "RM-2026-0015",
        kamar: "Kamar Cempaka 02",
        bed: "Bed-03",
        profesiPenulis: "Dokter",
        namaPenulis: "Dr. Jennie Kim, Sp.A",
        subjective: "Anak masih batuk berdahak, sesak berkurang. Ibu pasien mengatakan anak sudah mau minum ASI dan makan bubur.",
        objective: "TD: --, N: 110x/min, S: 37.2°C, RR: 32x/min, SpO2: 96% (tanpa O2). Ronkhi (+/+) basah halus di basal. Foto thorax: perbaikan infiltrat.",
        assessment: "Bronkopneumonia hari ke-2, perbaikan klinis dan radiologis.",
        planning: "Lanjutkan antibiotik Ceftriaxone IV, nebulizer Salbutamol/8 jam, suction bila perlu.",
        instruksiDPJP: "Evaluasi ulang hari ke-3, jika stabil → switch oral Amoxicillin, rencana pulang H+5.",
        verified: true,
    },
];

const profesiColors: Record<string, string> = {
    Dokter: "bg-blue-50 text-blue-700 border-blue-200",
    Perawat: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Bidan: "bg-pink-50 text-pink-700 border-pink-200",
    Apoteker: "bg-amber-50 text-amber-700 border-amber-200",
    Gizi: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function CPPTCatatanPerawat() {
    const [entries] = useState<CPPTEntry[]>(MOCK_CPPT);
    const [search, setSearch] = useState("");
    const [filterProfesi, setFilterProfesi] = useState("Semua");
    const [selectedEntry, setSelectedEntry] = useState<CPPTEntry | null>(null);
    const [showForm, setShowForm] = useState(false);

    const filtered = entries.filter((e) => {
        const matchSearch =
            e.namaPasien.toLowerCase().includes(search.toLowerCase()) ||
            e.norm.toLowerCase().includes(search.toLowerCase());
        const matchProfesi = filterProfesi === "Semua" || e.profesiPenulis === filterProfesi;
        return matchSearch && matchProfesi;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            CPPT & Catatan Perawat Bangsal
                        </h3>
                        <p className="text-xs text-slate-500">
                            Catatan Perkembangan Pasien Terintegrasi (Subjective, Objective, Assessment, Planning)
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> Buat Catatan CPPT Baru
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama pasien atau No. RM..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {["Semua", "Dokter", "Perawat", "Bidan", "Apoteker", "Gizi"].map((prof) => (
                        <button
                            key={prof}
                            type="button"
                            onClick={() => setFilterProfesi(prof)}
                            className={cn(
                                "rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                                filterProfesi === prof
                                    ? "bg-slate-900 text-white shadow-2xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            {prof}
                        </button>
                    ))}
                </div>
            </div>

            {/* CPPT Timeline */}
            <div className="space-y-4">
                {filtered.map((entry) => (
                    <div
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                    >
                        {/* Entry Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{entry.namaPasien}</p>
                                    <p className="text-[11px] text-slate-400 font-mono">{entry.norm} • {entry.kamar} ({entry.bed})</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        "rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                                        profesiColors[entry.profesiPenulis] ?? "bg-slate-50 text-slate-600 border-slate-200"
                                    )}
                                >
                                    {entry.profesiPenulis}
                                </span>
                                {entry.verified ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 className="h-3 w-3" /> Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                                        <AlertCircle className="h-3 w-3" /> Pending
                                    </span>
                                )}
                                <span className="text-[11px] text-slate-400 font-semibold">
                                    <Clock className="inline h-3 w-3 mr-0.5 -mt-0.5" />{entry.waktu} • {entry.tanggal}
                                </span>
                            </div>
                        </div>

                        {/* SOAP Preview */}
                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 text-xs">
                            <div className="space-y-1.5">
                                <div className="flex items-start gap-2">
                                    <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-md bg-blue-100 text-blue-700 font-black text-[10px]">S</span>
                                    <p className="text-slate-600 line-clamp-2">{entry.subjective}</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 font-black text-[10px]">O</span>
                                    <p className="text-slate-600 line-clamp-2">{entry.objective}</p>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-start gap-2">
                                    <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-md bg-amber-100 text-amber-700 font-black text-[10px]">A</span>
                                    <p className="text-slate-600 line-clamp-2">{entry.assessment}</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-md bg-purple-100 text-purple-700 font-black text-[10px]">P</span>
                                    <p className="text-slate-600 line-clamp-2">{entry.planning}</p>
                                </div>
                            </div>
                        </div>

                        {entry.instruksiDPJP && (
                            <div className="mt-3 flex items-start gap-2 rounded-xl bg-indigo-50/60 border border-indigo-100 p-3 text-xs">
                                <Stethoscope className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
                                <div>
                                    <p className="font-bold text-indigo-700">Instruksi DPJP</p>
                                    <p className="text-indigo-600 mt-0.5">{entry.instruksiDPJP}</p>
                                </div>
                            </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                            <p className="text-[11px] text-slate-400 font-medium">
                                Ditulis oleh: <span className="font-bold text-slate-600">{entry.namaPenulis}</span>
                            </p>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                        <MessageCircle className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-3 text-sm font-bold text-slate-500">Tidak ada catatan CPPT ditemukan</p>
                        <p className="text-xs text-slate-400 mt-1">Coba ubah filter atau buat catatan baru</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedEntry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Detail CPPT</h3>
                                <p className="text-xs text-slate-500">{selectedEntry.namaPasien} • {selectedEntry.norm}</p>
                            </div>
                            <button onClick={() => setSelectedEntry(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-50 rounded-xl p-3">
                                <p className="text-slate-400 font-semibold">Kamar & Bed</p>
                                <p className="font-bold text-slate-900">{selectedEntry.kamar} ({selectedEntry.bed})</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                                <p className="text-slate-400 font-semibold">Waktu Pencatatan</p>
                                <p className="font-bold text-slate-900">{selectedEntry.waktu} - {selectedEntry.tanggal}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                                <p className="text-slate-400 font-semibold">Penulis</p>
                                <p className="font-bold text-slate-900">{selectedEntry.namaPenulis}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                                <p className="text-slate-400 font-semibold">Profesi</p>
                                <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold", profesiColors[selectedEntry.profesiPenulis])}>
                                    {selectedEntry.profesiPenulis}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs">
                            {[
                                { label: "Subjective", code: "S", value: selectedEntry.subjective, color: "blue" },
                                { label: "Objective", code: "O", value: selectedEntry.objective, color: "emerald" },
                                { label: "Assessment", code: "A", value: selectedEntry.assessment, color: "amber" },
                                { label: "Planning", code: "P", value: selectedEntry.planning, color: "purple" },
                            ].map((item) => (
                                <div key={item.code} className={cn("rounded-xl border p-4", `bg-${item.color}-50/30 border-${item.color}-100`)}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-lg font-black text-xs", `bg-${item.color}-100 text-${item.color}-700`)}>
                                            {item.code}
                                        </span>
                                        <span className="font-bold text-slate-700">{item.label}</span>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">{item.value}</p>
                                </div>
                            ))}

                            {selectedEntry.instruksiDPJP && (
                                <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Stethoscope className="h-4 w-4 text-indigo-600" />
                                        <span className="font-bold text-indigo-700">Instruksi DPJP</span>
                                    </div>
                                    <p className="text-indigo-600 leading-relaxed">{selectedEntry.instruksiDPJP}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setSelectedEntry(null)}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New CPPT Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Buat Catatan CPPT Baru</h3>
                                <p className="text-xs text-slate-500">Isi data SOAP terintegrasi untuk pasien rawat inap</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                alert("Catatan CPPT berhasil disimpan!");
                                setShowForm(false);
                            }}
                            className="space-y-4 text-xs"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Nama Pasien</label>
                                    <select className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold">
                                        <option>Rina Kusuma (RM-2026-0039)</option>
                                        <option>Ahmad Fauzi (RM-2026-0044)</option>
                                        <option>Hendra Wijaya (RM-2026-0028)</option>
                                        <option>Maya Putri (RM-2026-0015)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Profesi Penulis</label>
                                    <select className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold">
                                        <option>Perawat</option>
                                        <option>Dokter</option>
                                        <option>Bidan</option>
                                        <option>Apoteker</option>
                                        <option>Gizi</option>
                                    </select>
                                </div>
                            </div>

                            {[
                                { code: "S", label: "Subjective (Keluhan Pasien)", placeholder: "Tuliskan keluhan subyektif pasien..." },
                                { code: "O", label: "Objective (Pemeriksaan Fisik & Data)", placeholder: "TD, Nadi, Suhu, RR, SpO2, hasil lab..." },
                                { code: "A", label: "Assessment (Diagnosis & Evaluasi)", placeholder: "Diagnosis kerja / evaluasi kondisi pasien..." },
                                { code: "P", label: "Planning (Rencana Tindak Lanjut)", placeholder: "Rencana terapi, pemeriksaan lanjutan, konsultasi..." },
                            ].map((item) => (
                                <div key={item.code}>
                                    <label className="block font-bold text-slate-700 mb-1">{item.label}</label>
                                    <textarea
                                        rows={3}
                                        placeholder={item.placeholder}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium resize-none focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Instruksi DPJP (Opsional)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Instruksi khusus dari Dokter Penanggung Jawab Pasien..."
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 cursor-pointer"
                                >
                                    <Save className="h-4 w-4" /> Simpan CPPT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
