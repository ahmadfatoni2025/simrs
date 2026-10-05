import { useState } from "react";
import {
    ArrowLeftRight,
    BedDouble,
    CheckCircle2,
    Clock,
    AlertTriangle,
    User,
    ChevronRight,
    Plus,
    X,
    Save,
    Search,
    Building2
} from "lucide-react";
import { cn } from "~/lib/utils";

interface TransferRecord {
    id: string;
    tanggal: string;
    waktu: string;
    namaPasien: string;
    norm: string;
    asalKamar: string;
    asalBed: string;
    asalKelas: string;
    tujuanKamar: string;
    tujuanBed: string;
    tujuanKelas: string;
    alasan: string;
    dpjp: string;
    status: "Menunggu" | "Disetujui" | "Ditolak" | "Selesai";
    jenisMutasi: "Pindah Kamar" | "Naik Kelas" | "Turun Kelas" | "Pindah ICU" | "Pindah Bangsal";
}

const MOCK_TRANSFERS: TransferRecord[] = [
    {
        id: "tf-1", tanggal: "05 Okt 2026", waktu: "09:30",
        namaPasien: "Ahmad Fauzi", norm: "RM-2026-0044",
        asalKamar: "Kamar Melati 01", asalBed: "Bed-02", asalKelas: "III",
        tujuanKamar: "Kamar Teratai ICU", tujuanBed: "Bed-02", tujuanKelas: "ICU",
        alasan: "Penurunan GCS dari E4V4M6 menjadi E3V3M5, perlu monitoring intensif dan kemungkinan intubasi",
        dpjp: "Dr. Veronica Nguyen, Sp.N",
        status: "Menunggu", jenisMutasi: "Pindah ICU"
    },
    {
        id: "tf-2", tanggal: "04 Okt 2026", waktu: "14:00",
        namaPasien: "Hendra Wijaya", norm: "RM-2026-0028",
        asalKamar: "Kamar Melati 02", asalBed: "Bed-01", asalKelas: "III",
        tujuanKamar: "Kamar Anggrek 01", tujuanBed: "Bed-01", tujuanKelas: "I",
        alasan: "Permintaan keluarga naik kelas dari kelas III ke kelas I (penjamin Asuransi cover)",
        dpjp: "Dr. Adam Hall, Sp.PD",
        status: "Selesai", jenisMutasi: "Naik Kelas"
    },
    {
        id: "tf-3", tanggal: "03 Okt 2026", waktu: "11:15",
        namaPasien: "Siti Rahma", norm: "RM-2026-0042",
        asalKamar: "Kamar Anggrek 01", asalBed: "Bed-02", asalKelas: "I",
        tujuanKamar: "Kamar Melati 02", tujuanBed: "Bed-04", tujuanKelas: "III",
        alasan: "Turun kelas atas permintaan pasien karena keterbatasan biaya (BPJS hak kelas III)",
        dpjp: "Dr. Alexandra Boje, Sp.JP",
        status: "Selesai", jenisMutasi: "Turun Kelas"
    },
    {
        id: "tf-4", tanggal: "05 Okt 2026", waktu: "08:00",
        namaPasien: "Ivan Saputra", norm: "RM-2026-0012",
        asalKamar: "Kamar Teratai ICU", asalBed: "Bed-01", asalKelas: "ICU",
        tujuanKamar: "Kamar Mawar 01", tujuanBed: "Bed-02", tujuanKelas: "VIP",
        alasan: "Kondisi pasien stabil, pindah ke bangsal VIP untuk pemulihan lanjutan",
        dpjp: "Dr. Alexandra Boje, Sp.JP",
        status: "Ditolak", jenisMutasi: "Pindah Bangsal"
    },
];

const statusColors: Record<string, string> = {
    Menunggu: "bg-amber-50 text-amber-700 border-amber-200",
    Disetujui: "bg-blue-50 text-blue-700 border-blue-200",
    Ditolak: "bg-rose-50 text-rose-700 border-rose-200",
    Selesai: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const mutasiColors: Record<string, string> = {
    "Pindah Kamar": "bg-slate-100 text-slate-700",
    "Naik Kelas": "bg-blue-100 text-blue-700",
    "Turun Kelas": "bg-amber-100 text-amber-700",
    "Pindah ICU": "bg-rose-100 text-rose-700",
    "Pindah Bangsal": "bg-emerald-100 text-emerald-700",
};

export default function TransferMutasi() {
    const [records] = useState<TransferRecord[]>(MOCK_TRANSFERS);
    const [search, setSearch] = useState("");
    const [selectedRecord, setSelectedRecord] = useState<TransferRecord | null>(null);
    const [showForm, setShowForm] = useState(false);

    const filtered = records.filter((r) =>
        r.namaPasien.toLowerCase().includes(search.toLowerCase()) ||
        r.norm.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                        <ArrowLeftRight className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Transfer & Mutasi Pasien</h3>
                        <p className="text-xs text-slate-500">
                            Kelola pemindahan bed, naik/turun kelas, dan mutasi antar bangsal/ICU
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-violet-500 transition-all cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> Buat Permintaan Transfer
                </button>
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
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                    />
                </div>
            </div>

            {/* Summary */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                    { label: "Menunggu Persetujuan", count: records.filter(r => r.status === "Menunggu").length, color: "amber" },
                    { label: "Disetujui", count: records.filter(r => r.status === "Disetujui").length, color: "blue" },
                    { label: "Selesai", count: records.filter(r => r.status === "Selesai").length, color: "emerald" },
                    { label: "Ditolak", count: records.filter(r => r.status === "Ditolak").length, color: "rose" },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                        <span className="text-[11px] font-semibold text-slate-500">{stat.label}</span>
                        <p className={cn("mt-1 text-2xl font-extrabold", `text-${stat.color}-600`)}>{stat.count}</p>
                    </div>
                ))}
            </div>

            {/* Transfer List */}
            <div className="space-y-3">
                {filtered.map((rec) => (
                    <div
                        key={rec.id}
                        onClick={() => setSelectedRecord(rec)}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{rec.namaPasien}</p>
                                    <p className="text-[11px] text-slate-400 font-mono">{rec.norm}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold", mutasiColors[rec.jenisMutasi])}>
                                    {rec.jenisMutasi}
                                </span>
                                <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold", statusColors[rec.status])}>
                                    {rec.status}
                                </span>
                                <span className="text-[11px] text-slate-400 font-semibold">
                                    <Clock className="inline h-3 w-3 mr-0.5 -mt-0.5" />{rec.waktu} • {rec.tanggal}
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-col sm:flex-row items-center gap-3 text-xs">
                            <div className="flex-1 rounded-xl bg-slate-50 p-3 border border-slate-100">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Dari (Asal)</p>
                                <p className="font-bold text-slate-900">{rec.asalKamar} ({rec.asalBed})</p>
                                <p className="text-slate-500 font-semibold">Kelas {rec.asalKelas}</p>
                            </div>
                            <ArrowLeftRight className="h-5 w-5 text-violet-500 shrink-0" />
                            <div className="flex-1 rounded-xl bg-violet-50/50 p-3 border border-violet-100">
                                <p className="text-[10px] uppercase font-bold text-violet-400 mb-1">Ke (Tujuan)</p>
                                <p className="font-bold text-violet-900">{rec.tujuanKamar} ({rec.tujuanBed})</p>
                                <p className="text-violet-600 font-semibold">Kelas {rec.tujuanKelas}</p>
                            </div>
                        </div>

                        <div className="mt-3 text-xs text-slate-500">
                            <span className="font-bold text-slate-700">Alasan: </span>{rec.alasan}
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-[11px] text-slate-400 font-medium">
                                DPJP: <span className="font-bold text-slate-600">{rec.dpjp}</span>
                            </p>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-violet-500 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Detail Transfer</h3>
                                <p className="text-xs text-slate-500">{selectedRecord.namaPasien} • {selectedRecord.norm}</p>
                            </div>
                            <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex-1 rounded-xl bg-slate-50 p-3 border border-slate-100">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Dari (Asal)</p>
                                <p className="font-bold text-slate-900">{selectedRecord.asalKamar}</p>
                                <p className="text-slate-500">{selectedRecord.asalBed} • Kelas {selectedRecord.asalKelas}</p>
                            </div>
                            <ArrowLeftRight className="h-5 w-5 text-violet-500 shrink-0" />
                            <div className="flex-1 rounded-xl bg-violet-50/50 p-3 border border-violet-100">
                                <p className="text-[10px] uppercase font-bold text-violet-400 mb-1">Ke (Tujuan)</p>
                                <p className="font-bold text-violet-900">{selectedRecord.tujuanKamar}</p>
                                <p className="text-violet-600">{selectedRecord.tujuanBed} • Kelas {selectedRecord.tujuanKelas}</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p><span className="text-slate-400 font-semibold">Jenis Mutasi:</span> <span className={cn("rounded-full px-2 py-0.5 font-bold", mutasiColors[selectedRecord.jenisMutasi])}>{selectedRecord.jenisMutasi}</span></p>
                            <p><span className="text-slate-400 font-semibold">Status:</span> <span className={cn("rounded-full border px-2 py-0.5 font-bold", statusColors[selectedRecord.status])}>{selectedRecord.status}</span></p>
                            <p><span className="text-slate-400 font-semibold">DPJP:</span> <strong>{selectedRecord.dpjp}</strong></p>
                            <p><span className="text-slate-400 font-semibold">Alasan:</span> {selectedRecord.alasan}</p>
                            <p><span className="text-slate-400 font-semibold">Waktu:</span> {selectedRecord.waktu} - {selectedRecord.tanggal}</p>
                        </div>

                        {selectedRecord.status === "Menunggu" && (
                            <div className="flex gap-2 pt-2">
                                <button className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500">
                                    <CheckCircle2 className="inline h-4 w-4 mr-1 -mt-0.5" /> Setujui Transfer
                                </button>
                                <button className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-500">
                                    <AlertTriangle className="inline h-4 w-4 mr-1 -mt-0.5" /> Tolak
                                </button>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-1">
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

            {/* Form New Transfer Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Permintaan Transfer / Mutasi Pasien</h3>
                                <p className="text-xs text-slate-500">Ajukan pemindahan kamar / kelas / bangsal</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                alert("Permintaan transfer berhasil diajukan!");
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
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Jenis Mutasi</label>
                                    <select className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold">
                                        <option>Pindah Kamar</option>
                                        <option>Naik Kelas</option>
                                        <option>Turun Kelas</option>
                                        <option>Pindah ICU</option>
                                        <option>Pindah Bangsal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Tujuan Kamar & Bed</label>
                                    <select className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold">
                                        <option>Kamar Melati 01 (Bed-03) - Kelas III</option>
                                        <option>Kamar Melati 02 (Bed-02) - Kelas III</option>
                                        <option>Kamar Anggrek 01 (Bed-02) - Kelas I</option>
                                        <option>Kamar Teratai ICU (Bed-02) - ICU</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Alasan Transfer / Mutasi</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Jelaskan alasan medis atau administratif transfer..."
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
                                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-violet-500 cursor-pointer"
                                >
                                    <Save className="h-4 w-4" /> Ajukan Transfer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
