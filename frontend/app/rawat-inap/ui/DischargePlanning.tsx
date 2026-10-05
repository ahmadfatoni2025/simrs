import { useState } from "react";
import {
    LogOut,
    CheckCircle2,
    Clock,
    FileText,
    User,
    ChevronRight,
    Plus,
    X,
    Save,
    Search,
    CalendarClock,
    AlertCircle,
    Printer,
    ClipboardList,
    Stethoscope,
    PillBottle,
    Heart
} from "lucide-react";
import { cn } from "~/lib/utils";

interface DischargeRecord {
    id: string;
    tanggal: string;
    waktu: string;
    namaPasien: string;
    norm: string;
    kamar: string;
    bed: string;
    kelas: string;
    dpjp: string;
    diagnosaMasuk: string;
    diagnosaPulang: string;
    tglMasuk: string;
    tglRencanaPulang: string;
    lamaRawat: number;
    kondisiPulang: "Membaik" | "Sembuh" | "Belum Sembuh" | "APS" | "Meninggal" | "Dirujuk";
    statusDischarge: "Rencana" | "Proses Resume" | "Menunggu Obat" | "Menunggu Kasir" | "Selesai";
    checklist: {
        resumeMedis: boolean;
        resepPulang: boolean;
        suratKontrol: boolean;
        edukasiPasien: boolean;
        billingCleared: boolean;
        suratIjinPulang: boolean;
    };
    catatan?: string;
}

const MOCK_DISCHARGES: DischargeRecord[] = [
    {
        id: "dc-1", tanggal: "05 Okt 2026", waktu: "10:00",
        namaPasien: "Hendra Wijaya", norm: "RM-2026-0028",
        kamar: "Kamar Anggrek 01", bed: "Bed-01", kelas: "I",
        dpjp: "Dr. Adam Hall, Sp.PD",
        diagnosaMasuk: "DHF Grade II", diagnosaPulang: "DHF Grade II (Recovered)",
        tglMasuk: "02 Okt 2026", tglRencanaPulang: "06 Okt 2026",
        lamaRawat: 4, kondisiPulang: "Membaik",
        statusDischarge: "Rencana",
        checklist: {
            resumeMedis: false,
            resepPulang: false,
            suratKontrol: false,
            edukasiPasien: false,
            billingCleared: false,
            suratIjinPulang: false,
        },
        catatan: "Trombosit naik 120.000 → target > 150.000 untuk pulang. Evaluasi besok pagi."
    },
    {
        id: "dc-2", tanggal: "05 Okt 2026", waktu: "08:30",
        namaPasien: "Budi Santoso", norm: "RM-2026-0041",
        kamar: "Kamar Melati 01", bed: "Bed-01", kelas: "III",
        dpjp: "dr. Andi Prasetyo, Sp.PD",
        diagnosaMasuk: "Gastritis Akut + Dehidrasi", diagnosaPulang: "Gastritis Akut (Perbaikan)",
        tglMasuk: "03 Okt 2026", tglRencanaPulang: "05 Okt 2026",
        lamaRawat: 2, kondisiPulang: "Membaik",
        statusDischarge: "Proses Resume",
        checklist: {
            resumeMedis: true,
            resepPulang: false,
            suratKontrol: false,
            edukasiPasien: false,
            billingCleared: false,
            suratIjinPulang: false,
        },
        catatan: "Resume medis sudah dibuat, menunggu resep pulang dari farmasi."
    },
    {
        id: "dc-3", tanggal: "04 Okt 2026", waktu: "14:00",
        namaPasien: "Dewi Lestari", norm: "RM-2026-0043",
        kamar: "Kamar Melati 02", bed: "Bed-01", kelas: "III",
        dpjp: "dr. Jennie Kim, Sp.A",
        diagnosaMasuk: "ISPA + OMA Bilateral", diagnosaPulang: "ISPA (Perbaikan)",
        tglMasuk: "01 Okt 2026", tglRencanaPulang: "04 Okt 2026",
        lamaRawat: 3, kondisiPulang: "Sembuh",
        statusDischarge: "Selesai",
        checklist: {
            resumeMedis: true,
            resepPulang: true,
            suratKontrol: true,
            edukasiPasien: true,
            billingCleared: true,
            suratIjinPulang: true,
        },
    },
    {
        id: "dc-4", tanggal: "05 Okt 2026", waktu: "11:00",
        namaPasien: "Siti Rahma", norm: "RM-2026-0042",
        kamar: "Kamar Melati 02", bed: "Bed-04", kelas: "III",
        dpjp: "Dr. Alexandra Boje, Sp.JP",
        diagnosaMasuk: "CHF NYHA II + Hipertensi", diagnosaPulang: "CHF NYHA II (Terkontrol)",
        tglMasuk: "30 Sep 2026", tglRencanaPulang: "05 Okt 2026",
        lamaRawat: 5, kondisiPulang: "Membaik",
        statusDischarge: "Menunggu Kasir",
        checklist: {
            resumeMedis: true,
            resepPulang: true,
            suratKontrol: true,
            edukasiPasien: true,
            billingCleared: false,
            suratIjinPulang: false,
        },
        catatan: "Semua dokumen medis sudah selesai, menunggu pembayaran billing di kasir."
    },
];

const statusDischargeColors: Record<string, string> = {
    Rencana: "bg-blue-50 text-blue-700 border-blue-200",
    "Proses Resume": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Menunggu Obat": "bg-amber-50 text-amber-700 border-amber-200",
    "Menunggu Kasir": "bg-orange-50 text-orange-700 border-orange-200",
    Selesai: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const kondisiColors: Record<string, string> = {
    Membaik: "bg-emerald-100 text-emerald-700",
    Sembuh: "bg-emerald-100 text-emerald-700",
    "Belum Sembuh": "bg-amber-100 text-amber-700",
    APS: "bg-rose-100 text-rose-700",
    Meninggal: "bg-slate-800 text-white",
    Dirujuk: "bg-blue-100 text-blue-700",
};

export default function DischargePlanning() {
    const [records] = useState<DischargeRecord[]>(MOCK_DISCHARGES);
    const [search, setSearch] = useState("");
    const [selectedRecord, setSelectedRecord] = useState<DischargeRecord | null>(null);

    const filtered = records.filter((r) =>
        r.namaPasien.toLowerCase().includes(search.toLowerCase()) ||
        r.norm.toLowerCase().includes(search.toLowerCase())
    );

    const checklistLabels: { key: keyof DischargeRecord["checklist"]; label: string; icon: typeof FileText }[] = [
        { key: "resumeMedis", label: "Resume Medis / Discharge Summary", icon: FileText },
        { key: "resepPulang", label: "Resep Pulang (E-Prescribing)", icon: PillBottle },
        { key: "suratKontrol", label: "Surat Kontrol / Jadwal Follow-up", icon: CalendarClock },
        { key: "edukasiPasien", label: "Edukasi Pasien & Keluarga", icon: Heart },
        { key: "billingCleared", label: "Billing & Kasir Selesai", icon: ClipboardList },
        { key: "suratIjinPulang", label: "Surat Ijin Pulang / KRS", icon: Printer },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                        <LogOut className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Discharge Planning & Resume Medis</h3>
                        <p className="text-xs text-slate-500">
                            Rencana pemulangan pasien rawat inap, checklist dokumen, dan resume medis
                        </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama pasien atau No. RM..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    />
                </div>
            </div>

            {/* Summary */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
                {[
                    { label: "Rencana", count: records.filter(r => r.statusDischarge === "Rencana").length, color: "blue" },
                    { label: "Proses Resume", count: records.filter(r => r.statusDischarge === "Proses Resume").length, color: "indigo" },
                    { label: "Menunggu Obat", count: records.filter(r => r.statusDischarge === "Menunggu Obat").length, color: "amber" },
                    { label: "Menunggu Kasir", count: records.filter(r => r.statusDischarge === "Menunggu Kasir").length, color: "orange" },
                    { label: "Selesai", count: records.filter(r => r.statusDischarge === "Selesai").length, color: "emerald" },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                        <span className="text-[11px] font-semibold text-slate-500">{stat.label}</span>
                        <p className={cn("mt-1 text-2xl font-extrabold", `text-${stat.color}-600`)}>{stat.count}</p>
                    </div>
                ))}
            </div>

            {/* Discharge List */}
            <div className="space-y-3">
                {filtered.map((rec) => {
                    const totalChecklist = Object.keys(rec.checklist).length;
                    const doneChecklist = Object.values(rec.checklist).filter(Boolean).length;
                    const progress = Math.round((doneChecklist / totalChecklist) * 100);

                    return (
                        <div
                            key={rec.id}
                            onClick={() => setSelectedRecord(rec)}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{rec.namaPasien}</p>
                                        <p className="text-[11px] text-slate-400 font-mono">{rec.norm} • {rec.kamar} ({rec.bed})</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold", kondisiColors[rec.kondisiPulang])}>
                                        {rec.kondisiPulang}
                                    </span>
                                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold", statusDischargeColors[rec.statusDischarge])}>
                                        {rec.statusDischarge}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div>
                                    <p className="text-slate-400 font-semibold">DPJP</p>
                                    <p className="font-bold text-slate-700">{rec.dpjp}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-semibold">Diagnosa Pulang</p>
                                    <p className="font-bold text-slate-700">{rec.diagnosaPulang}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-semibold">Lama Rawat</p>
                                    <p className="font-bold text-slate-700">{rec.lamaRawat} Hari</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-semibold">Rencana Pulang</p>
                                    <p className="font-bold text-slate-700">{rec.tglRencanaPulang}</p>
                                </div>
                            </div>

                            {/* Checklist Progress */}
                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all",
                                            progress === 100 ? "bg-emerald-500" : progress > 50 ? "bg-blue-500" : "bg-amber-500"
                                        )}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-[11px] font-bold text-slate-500">{doneChecklist}/{totalChecklist} Checklist</span>
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detail Modal */}
            {selectedRecord && (() => {
                const totalChecklist = Object.keys(selectedRecord.checklist).length;
                const doneChecklist = Object.values(selectedRecord.checklist).filter(Boolean).length;
                const progress = Math.round((doneChecklist / totalChecklist) * 100);

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Discharge Planning Detail</h3>
                                    <p className="text-xs text-slate-500">{selectedRecord.namaPasien} • {selectedRecord.norm}</p>
                                </div>
                                <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-slate-400 font-semibold">Kamar & Bed</p>
                                    <p className="font-bold text-slate-900">{selectedRecord.kamar} ({selectedRecord.bed}) • Kelas {selectedRecord.kelas}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-slate-400 font-semibold">DPJP</p>
                                    <p className="font-bold text-slate-900">{selectedRecord.dpjp}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-slate-400 font-semibold">Diagnosa Masuk</p>
                                    <p className="font-bold text-slate-900">{selectedRecord.diagnosaMasuk}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-slate-400 font-semibold">Diagnosa Pulang</p>
                                    <p className="font-bold text-slate-900">{selectedRecord.diagnosaPulang}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-slate-400 font-semibold">Tgl Masuk → Rencana Pulang</p>
                                    <p className="font-bold text-slate-900">{selectedRecord.tglMasuk} → {selectedRecord.tglRencanaPulang}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-slate-400 font-semibold">Lama Rawat & Kondisi</p>
                                    <p className="font-bold text-slate-900">
                                        {selectedRecord.lamaRawat} Hari •{" "}
                                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", kondisiColors[selectedRecord.kondisiPulang])}>
                                            {selectedRecord.kondisiPulang}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Discharge Checklist */}
                            <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-slate-900">Checklist Discharge</h4>
                                    <span className={cn(
                                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                                        statusDischargeColors[selectedRecord.statusDischarge]
                                    )}>
                                        {selectedRecord.statusDischarge}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all",
                                                progress === 100 ? "bg-emerald-500" : progress > 50 ? "bg-blue-500" : "bg-amber-500"
                                            )}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500">{progress}%</span>
                                </div>

                                <div className="space-y-2">
                                    {checklistLabels.map((item) => (
                                        <div key={item.key} className="flex items-center gap-3 text-xs">
                                            {selectedRecord.checklist[item.key] ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4 text-slate-300" />
                                            )}
                                            <item.icon className={cn("h-3.5 w-3.5", selectedRecord.checklist[item.key] ? "text-emerald-500" : "text-slate-400")} />
                                            <span className={cn("font-medium", selectedRecord.checklist[item.key] ? "text-slate-900 line-through opacity-60" : "text-slate-700")}>
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedRecord.catatan && (
                                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs">
                                    <p className="text-slate-400 font-semibold">Catatan:</p>
                                    <p className="text-slate-700 font-medium mt-1">{selectedRecord.catatan}</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                {selectedRecord.statusDischarge !== "Selesai" && (
                                    <button className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-500 cursor-pointer">
                                        <Printer className="h-4 w-4" /> Cetak Resume Medis
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedRecord(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
