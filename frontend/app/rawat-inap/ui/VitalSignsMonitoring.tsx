import { useState } from "react";
import {
    Activity,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Clock,
    Heart,
    Thermometer,
    Wind,
    Droplets,
    ChevronRight,
    Plus,
    X,
    Save,
    Eye
} from "lucide-react";
import { cn } from "~/lib/utils";

interface VitalRecord {
    id: string;
    waktu: string;
    tanggal: string;
    namaPasien: string;
    norm: string;
    kamar: string;
    bed: string;
    td: string;         // Tekanan Darah
    nadi: number;        // Nadi
    suhu: number;        // Suhu
    rr: number;          // Respiratory Rate
    spo2: number;        // SpO2
    gcs: string;         // Glasgow Coma Scale
    ewsScore: number;    // Early Warning Score
    ewsLevel: "Hijau" | "Kuning" | "Oranye" | "Merah";
    catatan?: string;
    perawat: string;
}

const MOCK_VITALS: VitalRecord[] = [
    {
        id: "vs-1", waktu: "06:00", tanggal: "05 Okt 2026",
        namaPasien: "Rina Kusuma", norm: "RM-2026-0039",
        kamar: "Kamar Mawar 01", bed: "Bed-01",
        td: "130/80", nadi: 88, suhu: 36.8, rr: 20, spo2: 98, gcs: "E4V5M6",
        ewsScore: 2, ewsLevel: "Hijau",
        catatan: "Nyeri skala 5/10 pada kaki kanan post-op",
        perawat: "Ns. Siti Aminah, S.Kep"
    },
    {
        id: "vs-2", waktu: "06:15", tanggal: "05 Okt 2026",
        namaPasien: "Ahmad Fauzi", norm: "RM-2026-0044",
        kamar: "Kamar Melati 01", bed: "Bed-02",
        td: "160/95", nadi: 102, suhu: 37.5, rr: 24, spo2: 94, gcs: "E4V4M6",
        ewsScore: 7, ewsLevel: "Oranye",
        catatan: "Hemiparesis sinistra, monitoring GCS ketat tiap jam",
        perawat: "Ns. Rini Handayani, S.Kep"
    },
    {
        id: "vs-3", waktu: "06:30", tanggal: "05 Okt 2026",
        namaPasien: "Hendra Wijaya", norm: "RM-2026-0028",
        kamar: "Kamar Anggrek 01", bed: "Bed-01",
        td: "110/70", nadi: 78, suhu: 36.5, rr: 18, spo2: 99, gcs: "E4V5M6",
        ewsScore: 0, ewsLevel: "Hijau",
        catatan: "Kondisi membaik, trombosit naik 120.000",
        perawat: "Ns. Dewi Sari, S.Kep"
    },
    {
        id: "vs-4", waktu: "06:45", tanggal: "05 Okt 2026",
        namaPasien: "Maya Putri", norm: "RM-2026-0015",
        kamar: "Kamar Cempaka 02", bed: "Bed-03",
        td: "90/60", nadi: 110, suhu: 37.2, rr: 32, spo2: 96, gcs: "E4V5M6",
        ewsScore: 4, ewsLevel: "Kuning",
        catatan: "Sesak berkurang, ronkhi basah halus (+/+)",
        perawat: "Ns. Rini Handayani, S.Kep"
    },
    {
        id: "vs-5", waktu: "12:00", tanggal: "05 Okt 2026",
        namaPasien: "Ivan Saputra", norm: "RM-2026-0012",
        kamar: "Kamar Teratai ICU", bed: "Bed-01",
        td: "85/55", nadi: 120, suhu: 38.9, rr: 28, spo2: 90, gcs: "E2V2M4",
        ewsScore: 12, ewsLevel: "Merah",
        catatan: "KRITIS - pasien dengan sepsis, on ventilator, vasopressor running",
        perawat: "Ns. Rina Agustina, S.Kep"
    },
];

const ewsColors: Record<string, string> = {
    Hijau: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Kuning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Oranye: "bg-orange-50 text-orange-700 border-orange-200",
    Merah: "bg-rose-50 text-rose-700 border-rose-200",
};

const ewsBgColors: Record<string, string> = {
    Hijau: "bg-emerald-500",
    Kuning: "bg-yellow-500",
    Oranye: "bg-orange-500",
    Merah: "bg-rose-500 animate-pulse",
};

export default function VitalSignsMonitoring() {
    const [records] = useState<VitalRecord[]>(MOCK_VITALS);
    const [selectedRecord, setSelectedRecord] = useState<VitalRecord | null>(null);
    const [showForm, setShowForm] = useState(false);

    const ewsSummary = {
        hijau: records.filter((r) => r.ewsLevel === "Hijau").length,
        kuning: records.filter((r) => r.ewsLevel === "Kuning").length,
        oranye: records.filter((r) => r.ewsLevel === "Oranye").length,
        merah: records.filter((r) => r.ewsLevel === "Merah").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Vital Signs & Monitoring EWS</h3>
                        <p className="text-xs text-slate-500">
                            Pantau tanda vital pasien rawat inap & Early Warning Score (EWS) secara realtime
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-500 transition-all cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> Input Vital Signs
                </button>
            </div>

            {/* EWS Summary Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                    { label: "EWS Hijau (Normal)", count: ewsSummary.hijau, color: "emerald", icon: Heart },
                    { label: "EWS Kuning (Waspada)", count: ewsSummary.kuning, color: "yellow", icon: AlertTriangle },
                    { label: "EWS Oranye (Risiko)", count: ewsSummary.oranye, color: "orange", icon: TrendingUp },
                    { label: "EWS Merah (KRITIS)", count: ewsSummary.merah, color: "rose", icon: AlertTriangle },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-500">{stat.label}</span>
                            <stat.icon className={cn("h-4 w-4", `text-${stat.color}-600`)} />
                        </div>
                        <p className={cn("mt-2 text-2xl font-extrabold", `text-${stat.color}-600`)}>{stat.count}</p>
                        <span className="text-[11px] text-slate-400 font-medium">Pasien</span>
                    </div>
                ))}
            </div>

            {/* Vital Signs Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Monitoring Tanda Vital Terkini</h3>
                    <span className="text-xs text-slate-400 font-medium">
                        <Clock className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                        Update terakhir: 05 Okt 2026 - 12:00 WIB
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px]">
                            <tr>
                                <th className="px-4 py-3">Pasien & Lokasi</th>
                                <th className="px-4 py-3 text-center">TD (mmHg)</th>
                                <th className="px-4 py-3 text-center">Nadi</th>
                                <th className="px-4 py-3 text-center">Suhu (°C)</th>
                                <th className="px-4 py-3 text-center">RR</th>
                                <th className="px-4 py-3 text-center">SpO₂</th>
                                <th className="px-4 py-3 text-center">GCS</th>
                                <th className="px-4 py-3 text-center">EWS</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {records.map((rec) => (
                                <tr
                                    key={rec.id}
                                    className={cn(
                                        "hover:bg-slate-50/80 transition-colors",
                                        rec.ewsLevel === "Merah" && "bg-rose-50/30"
                                    )}
                                >
                                    <td className="px-4 py-3.5">
                                        <p className="font-bold text-slate-900">{rec.namaPasien}</p>
                                        <p className="text-[11px] text-slate-400">{rec.kamar} ({rec.bed})</p>
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-bold text-slate-800">{rec.td}</td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className={cn("font-bold", rec.nadi > 100 ? "text-rose-600" : "text-slate-800")}>
                                            {rec.nadi}x/min
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className={cn("font-bold", rec.suhu >= 38 ? "text-rose-600" : "text-slate-800")}>
                                            {rec.suhu}°C
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className={cn("font-bold", rec.rr > 24 ? "text-rose-600" : "text-slate-800")}>
                                            {rec.rr}x/min
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className={cn("font-bold", rec.spo2 < 95 ? "text-rose-600" : "text-emerald-600")}>
                                            {rec.spo2}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-700">{rec.gcs}</td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className={cn(
                                            "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                                            ewsColors[rec.ewsLevel]
                                        )}>
                                            <span className={cn("h-2 w-2 rounded-full", ewsBgColors[rec.ewsLevel])} />
                                            {rec.ewsScore} ({rec.ewsLevel})
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedRecord(rec)}
                                            className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800"
                                        >
                                            <Eye className="inline h-3 w-3 mr-1 -mt-0.5" /> Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Detail Vital Signs</h3>
                                <p className="text-xs text-slate-500">{selectedRecord.namaPasien} • {selectedRecord.norm}</p>
                            </div>
                            <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-xs">
                            {[
                                { label: "Tekanan Darah", value: selectedRecord.td + " mmHg", icon: Heart },
                                { label: "Denyut Nadi", value: selectedRecord.nadi + "x/min", icon: Activity },
                                { label: "Suhu Tubuh", value: selectedRecord.suhu + "°C", icon: Thermometer },
                                { label: "Respirasi (RR)", value: selectedRecord.rr + "x/min", icon: Wind },
                                { label: "SpO₂", value: selectedRecord.spo2 + "%", icon: Droplets },
                                { label: "GCS", value: selectedRecord.gcs, icon: Eye },
                            ].map((item) => (
                                <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center">
                                    <item.icon className="h-4 w-4 mx-auto text-slate-400 mb-1" />
                                    <p className="text-[11px] text-slate-400 font-semibold">{item.label}</p>
                                    <p className="font-bold text-slate-900 text-sm">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-xl border p-4 text-xs space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 font-semibold">EWS Score:</span>
                                <span className={cn("rounded-full border px-2.5 py-0.5 font-bold", ewsColors[selectedRecord.ewsLevel])}>
                                    {selectedRecord.ewsScore} ({selectedRecord.ewsLevel})
                                </span>
                            </div>
                            {selectedRecord.catatan && (
                                <div>
                                    <p className="text-slate-400 font-semibold">Catatan:</p>
                                    <p className="text-slate-700 font-medium">{selectedRecord.catatan}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-slate-400 font-semibold">Perawat:</p>
                                <p className="text-slate-700 font-bold">{selectedRecord.perawat}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-semibold">Waktu Pengukuran:</p>
                                <p className="text-slate-700 font-medium">{selectedRecord.waktu} - {selectedRecord.tanggal}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setSelectedRecord(null)}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Input Vital Signs Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Input Vital Signs</h3>
                                <p className="text-xs text-slate-500">Catat tanda vital pasien rawat inap</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                alert("Data vital signs berhasil disimpan!");
                                setShowForm(false);
                            }}
                            className="space-y-4 text-xs"
                        >
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Pilih Pasien</label>
                                <select className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold">
                                    <option>Rina Kusuma - Kamar Mawar 01 (Bed-01)</option>
                                    <option>Ahmad Fauzi - Kamar Melati 01 (Bed-02)</option>
                                    <option>Hendra Wijaya - Kamar Anggrek 01 (Bed-01)</option>
                                    <option>Maya Putri - Kamar Cempaka 02 (Bed-03)</option>
                                    <option>Ivan Saputra - Kamar Teratai ICU (Bed-01)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { label: "Tekanan Darah (mmHg)", placeholder: "120/80" },
                                    { label: "Nadi (x/min)", placeholder: "80", type: "number" },
                                    { label: "Suhu (°C)", placeholder: "36.5", type: "number" },
                                    { label: "RR (x/min)", placeholder: "18", type: "number" },
                                    { label: "SpO₂ (%)", placeholder: "98", type: "number" },
                                    { label: "GCS (E/V/M)", placeholder: "E4V5M6" },
                                ].map((field) => (
                                    <div key={field.label}>
                                        <label className="block font-bold text-slate-700 mb-1">{field.label}</label>
                                        <input
                                            type={field.type ?? "text"}
                                            placeholder={field.placeholder}
                                            className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan</label>
                                <textarea
                                    rows={2}
                                    placeholder="Catatan observasi perawat..."
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-500 cursor-pointer"
                                >
                                    <Save className="h-4 w-4" /> Simpan Vital Signs
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
