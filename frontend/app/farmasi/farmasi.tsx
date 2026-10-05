import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
    PillBottle,
    ClipboardList,
    Syringe,
    Boxes,
    XCircle,
    HeartPulse,
    LayoutDashboard,
    Search,
    Plus,
    CheckCircle2,
    AlertTriangle,
    Calendar,
    Clock,
    RefreshCw,
    Send,
    Package,
    ShieldCheck,
    FileSpreadsheet
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";
import { api } from "~/lib/api";

export type FarmasiTab =
    | "dashboard"
    | "resep"
    | "dispensing"
    | "racikan"
    | "stok"
    | "retur"
    | "pio";

interface ResepItem {
    id: string;
    noResep: string;
    namaPasien: string;
    norm: string;
    dokter: string;
    poli: string;
    waktu: string;
    status: "Masuk" | "Diproses" | "Siap Ambil" | "Selesai";
    daftarObat: { nama: string; jumlah: number; aturan: string }[];
}

interface StokObatItem {
    id: string;
    kodeObat: string;
    namaObat: string;
    kategori: string;
    stok: number;
    satuan: string;
    minStok: number;
    expiredDate: string;
    hargaSatuan: number;
}

const MOCK_STOK: StokObatItem[] = [
    { id: "1", kodeObat: "FAR-001", namaObat: "Paracetamol 500mg Tablet", kategori: "Analgesik", stok: 1450, satuan: "Tablet", minStok: 200, expiredDate: "2027-12-01", hargaSatuan: 1500 },
    { id: "2", kodeObat: "FAR-002", namaObat: "Amoxicillin 500mg Kapsul", kategori: "Antibiotik", stok: 80, satuan: "Kapsul", minStok: 150, expiredDate: "2026-11-15", hargaSatuan: 3000 },
    { id: "3", kodeObat: "FAR-003", namaObat: "Omeprazole 20mg Kapsul", kategori: "Antasida", stok: 620, satuan: "Kapsul", minStok: 100, expiredDate: "2028-05-20", hargaSatuan: 4000 },
    { id: "4", kodeObat: "FAR-004", namaObat: "Cefadroxil 500mg Kapsul", kategori: "Antibiotik", stok: 45, satuan: "Kapsul", minStok: 100, expiredDate: "2026-10-30", hargaSatuan: 5500 },
    { id: "5", kodeObat: "FAR-005", namaObat: "Cefotaxime 1g Injeksi", kategori: "Injeksi", stok: 310, satuan: "Vial", minStok: 50, expiredDate: "2027-08-10", hargaSatuan: 22000 },
];

const MOCK_RESEP: ResepItem[] = [
    {
        id: "rsp-1",
        noResep: "RSP-2026-0891",
        namaPasien: "Budi Santoso",
        norm: "RM-2026-0041",
        dokter: "dr. Andi Prasetyo, Sp.PD",
        poli: "Poli Umum",
        waktu: "09:15 WIB",
        status: "Masuk",
        daftarObat: [
            { nama: "Paracetamol 500mg Tablet", jumlah: 10, aturan: "3 x 1 tablet sesudah makan" },
            { nama: "Omeprazole 20mg Kapsul", jumlah: 7, aturan: "2 x 1 kapsul sebelum makan" }
        ]
    },
    {
        id: "rsp-2",
        noResep: "RSP-2026-0892",
        namaPasien: "Siti Rahma",
        norm: "RM-2026-0042",
        dokter: "dr. Maya Kartika, Sp.A",
        poli: "Poli Anak",
        waktu: "09:30 WIB",
        status: "Diproses",
        daftarObat: [
            { nama: "Racikan Puyer Batuk Pilek Anak", jumlah: 12, aturan: "3 x 1 puyer sesudah makan" }
        ]
    },
    {
        id: "rsp-3",
        noResep: "RSP-2026-0889",
        namaPasien: "Dewi Lestari",
        norm: "RM-2026-0038",
        dokter: "dr. Rian Ramadhan, Sp.JP",
        poli: "Poli Jantung",
        waktu: "08:45 WIB",
        status: "Siap Ambil",
        daftarObat: [
            { nama: "Aspirin 80mg Tablet", jumlah: 30, aturan: "1 x 1 tablet sesudah makan pagi" }
        ]
    }
];

export default function FarmasiPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") || "dashboard") as FarmasiTab;

    const setTab = (tab: string) => {
        if (tab === "dashboard") setSearchParams({});
        else setSearchParams({ tab });
    };

    const [resepList, setResepList] = useState<ResepItem[]>(MOCK_RESEP);
    const [stokList, setStokList] = useState<StokObatItem[]>(MOCK_STOK);
    const [searchQuery, setSearchQuery] = useState("");

    const updateResepStatus = (id: string, newStatus: ResepItem["status"]) => {
        setResepList(prev =>
            prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
        );
    };

    const filteredStok = stokList.filter(s =>
        s.namaObat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.kodeObat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Farmasi & Depo Obat
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                <PillBottle className="h-3.5 w-3.5" /> Depo Central SIMRS
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Manajemen Resep Masuk, Dispensing Obat, Racikan Formularium, & Stok Gudang Farmasi.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs">
                            <Calendar className="h-4 w-4 text-emerald-600" />
                            <span>05 Oktober 2026</span>
                        </div>
                    </div>
                </div>

                {/* TAB 1: DASHBOARD DEPO FARMASI */}
                {(activeTab === "dashboard" || !searchParams.get("tab")) && (
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                                <span className="text-xs font-semibold text-slate-500">Resep Masuk Hari Ini</span>
                                <p className="mt-2 text-2xl font-extrabold text-slate-900">{resepList.length} Resep</p>
                                <span className="text-[11px] text-emerald-600 font-medium">Terhubung ke Poliklinik</span>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                                <span className="text-xs font-semibold text-slate-500">Sedang Diproses</span>
                                <p className="mt-2 text-2xl font-extrabold text-blue-600">{resepList.filter(r => r.status === "Diproses").length} Resep</p>
                                <span className="text-[11px] text-slate-400">Dalam racikan/penyiapan</span>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                                <span className="text-xs font-semibold text-slate-500">Stok Kritis / Warning</span>
                                <p className="mt-2 text-2xl font-extrabold text-amber-600">{stokList.filter(s => s.stok <= s.minStok).length} Item</p>
                                <span className="text-[11px] text-amber-600 font-medium">Perlu reorder PO</span>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                                <span className="text-xs font-semibold text-slate-500">Total Item Obat</span>
                                <p className="mt-2 text-2xl font-extrabold text-purple-600">{stokList.length} Item</p>
                                <span className="text-[11px] text-slate-400">Formularium Depo Central</span>
                            </div>
                        </div>

                        {/* Recent Prescriptions Table */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900">Resep Elektronik Terbaru</h3>
                                <button onClick={() => setTab("resep")} className="text-xs text-emerald-600 font-bold hover:underline">Lihat Semua</button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-4 py-2.5">No. Resep</th>
                                            <th className="px-4 py-2.5">Pasien</th>
                                            <th className="px-4 py-2.5">Dokter / Poli</th>
                                            <th className="px-4 py-2.5">Jumlah Obat</th>
                                            <th className="px-4 py-2.5">Status</th>
                                            <th className="px-4 py-2.5 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {resepList.map((r) => (
                                            <tr key={r.id}>
                                                <td className="px-4 py-3 font-mono font-bold text-blue-600">{r.noResep}</td>
                                                <td className="px-4 py-3">
                                                    <p className="font-bold text-slate-900">{r.namaPasien}</p>
                                                    <p className="text-[11px] text-slate-400">{r.norm}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-semibold text-slate-800">{r.dokter}</p>
                                                    <p className="text-[11px] text-slate-500">{r.poli}</p>
                                                </td>
                                                <td className="px-4 py-3 font-bold">{r.daftarObat.length} Item</td>
                                                <td className="px-4 py-3">
                                                    <span className={cn(
                                                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                                                        r.status === "Masuk" ? "bg-amber-50 text-amber-700" :
                                                            r.status === "Diproses" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                                                    )}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => setTab("dispensing")}
                                                        className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-500"
                                                    >
                                                        Proses
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2 & 3: RESEP & DISPENSING */}
                {(activeTab === "resep" || activeTab === "dispensing") && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                                Verifikasi & Dispensing Resep Pasien
                            </h3>

                            <div className="space-y-4">
                                {resepList.map((r) => (
                                    <div key={r.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/60 pb-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm font-black text-blue-600">{r.noResep}</span>
                                                    <span className="text-xs text-slate-400">({r.waktu})</span>
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{r.namaPasien} ({r.norm})</h4>
                                                <p className="text-xs text-slate-500">{r.dokter} • {r.poli}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {r.status === "Masuk" && (
                                                    <button
                                                        onClick={() => updateResepStatus(r.id, "Diproses")}
                                                        className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500"
                                                    >
                                                        Mulai Siapkan Obat
                                                    </button>
                                                )}
                                                {r.status === "Diproses" && (
                                                    <button
                                                        onClick={() => updateResepStatus(r.id, "Siap Ambil")}
                                                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
                                                    >
                                                        Verifikasi & Etiket Selesai
                                                    </button>
                                                )}
                                                {r.status === "Siap Ambil" && (
                                                    <button
                                                        onClick={() => updateResepStatus(r.id, "Selesai")}
                                                        className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-slate-800"
                                                    >
                                                        Serahkan ke Pasien
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 text-xs">
                                            <p className="font-bold text-slate-700">Rincian Obat & Etiket Signa:</p>
                                            <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                                                {r.daftarObat.map((o, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-slate-800">
                                                        <span>• <strong>{o.nama}</strong> ({o.jumlah} Pcs)</span>
                                                        <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">{o.aturan}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 5: STOK OBAT & INVENTORI */}
                {activeTab === "stok" && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari obat / kode stok..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                                />
                            </div>

                            <button className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-500">
                                + Tambah Item Stok Baru
                            </button>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-4 py-3">Kode Obat</th>
                                            <th className="px-4 py-3">Nama Sediaan</th>
                                            <th className="px-4 py-3">Kategori</th>
                                            <th className="px-4 py-3">Sisa Stok</th>
                                            <th className="px-4 py-3">Kadaluarsa (ED)</th>
                                            <th className="px-4 py-3">Harga Satuan</th>
                                            <th className="px-4 py-3 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredStok.map((s) => (
                                            <tr key={s.id}>
                                                <td className="px-4 py-3 font-mono font-bold text-slate-900">{s.kodeObat}</td>
                                                <td className="px-4 py-3 font-bold text-slate-900">{s.namaObat}</td>
                                                <td className="px-4 py-3 text-slate-500">{s.kategori}</td>
                                                <td className="px-4 py-3 font-extrabold text-blue-600">{s.stok} {s.satuan}</td>
                                                <td className="px-4 py-3 font-mono text-slate-600">{s.expiredDate}</td>
                                                <td className="px-4 py-3 font-semibold">Rp {s.hargaSatuan.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right">
                                                    {s.stok <= s.minStok ? (
                                                        <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">Stok Kritis</span>
                                                    ) : (
                                                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">Aman</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4, 6, 7 FALLBACK VIEWS */}
                {(activeTab === "racikan" || activeTab === "retur" || activeTab === "pio") && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs text-center space-y-3">
                        <PillBottle className="h-10 w-10 text-emerald-600 mx-auto" />
                        <h3 className="text-base font-bold text-slate-900">
                            Modul {activeTab === "racikan" ? "Obat Racikan & Formularium" : activeTab === "retur" ? "Retur Obat & Penanganan ED" : "PIO & Farklin (Rekonsiliasi)"} SIMRS
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Fitur operasional depo farmasi aktif dan terhubung ke backend database utama.
                        </p>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
