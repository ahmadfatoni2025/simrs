import React, { useState } from "react";
import {
    XCircle,
    HeartPulse,
    AlertTriangle,
    RotateCcw,
    CheckCircle2,
    Calendar,
    ArrowRightLeft,
    Clock,
    FileText,
    Search,
    ShieldAlert
} from "lucide-react";
import type { FarmasiTab } from "../farmasi";

interface TabReturPIOProps {
    activeTab: FarmasiTab;
}

interface ItemKadaluarsa {
    id: string;
    kodeObat: string;
    namaObat: string;
    batchNo: string;
    depo: string;
    stok: number;
    satuan: string;
    expiredDate: string;
    sisaHari: number;
    status: "Kadaluarsa" | "Mendekati ED (< 30 Hari)" | "Waspada (< 90 Hari)";
}

interface ItemReturFarmasi {
    id: string;
    noRetur: string;
    pasien: string;
    norm: string;
    resepAsal: string;
    namaObat: string;
    jumlahRetur: number;
    satuan: string;
    alasan: string;
    tanggal: string;
    status: "Menunggu Persetujuan" | "Disetujui & Masuk Karantina" | "Batal";
}

const MOCK_ED_ITEMS: ItemKadaluarsa[] = [
    {
        id: "ed-1",
        kodeObat: "FAR-004",
        namaObat: "Cefadroxil 500mg Kapsul",
        batchNo: "CFD-SNB-26",
        depo: "Depo IGD",
        stok: 45,
        satuan: "Kapsul",
        expiredDate: "2026-10-30",
        sisaHari: 19,
        status: "Mendekati ED (< 30 Hari)"
    },
    {
        id: "ed-2",
        kodeObat: "FAR-002",
        namaObat: "Amoxicillin 500mg Kapsul",
        batchNo: "BATCH-AMX-2604",
        depo: "Depo Central",
        stok: 80,
        satuan: "Kapsul",
        expiredDate: "2026-11-15",
        sisaHari: 35,
        status: "Waspada (< 90 Hari)"
    },
    {
        id: "ed-3",
        kodeObat: "FAR-009",
        namaObat: "Ampicillin 1g Injeksi",
        batchNo: "AMP-2026-OLD",
        depo: "Depo Rawat Inap",
        stok: 12,
        satuan: "Vial",
        expiredDate: "2026-10-01",
        sisaHari: -10,
        status: "Kadaluarsa"
    }
];

const MOCK_RETUR: ItemReturFarmasi[] = [
    {
        id: "ret-1",
        noRetur: "RET-2026-0041",
        pasien: "Dewi Lestari",
        norm: "RM-2026-0038",
        resepAsal: "RSP-2026-0889",
        namaObat: "Cetirizine 10mg Tablet",
        jumlahRetur: 5,
        satuan: "Tablet",
        alasan: "Perubahan regimen terapi oleh DPJP",
        tanggal: "05 Okt 2026",
        status: "Disetujui & Masuk Karantina"
    },
    {
        id: "ret-2",
        noRetur: "RET-2026-0042",
        pasien: "Ahmad Fauzi",
        norm: "RM-2026-0044",
        resepAsal: "RSP-2026-0885",
        namaObat: "Cefotaxime 1g Injeksi",
        jumlahRetur: 1,
        satuan: "Vial",
        alasan: "Pasien KRS (Pulang Sembuh)",
        tanggal: "05 Okt 2026",
        status: "Menunggu Persetujuan"
    }
];

export function TabReturPIO({ activeTab }: TabReturPIOProps) {
    const [returList, setReturList] = useState<ItemReturFarmasi[]>(MOCK_RETUR);
    const [edList, setEdList] = useState<ItemKadaluarsa[]>(MOCK_ED_ITEMS);

    const handleApproveRetur = (id: string) => {
        setReturList(prev => prev.map(r => r.id === id ? { ...r, status: "Disetujui & Masuk Karantina" } : r));
        alert("Retur obat disetujui. Stok obat dikarantina dan nilai biaya dikurangi dari billing jika belum lunas.");
    };

    if (activeTab === "retur") {
        return (
            <div className="space-y-6">
                {/* Header Info */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                                <XCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Manajemen Retur Obat & Monitoring ED (Kadaluarsa)</h3>
                                <p className="text-xs text-slate-500">Pencatatan obat retur dari pasien rawat inap/jalan & penarikan obat expired (Recall/Karantina).</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                                {edList.filter(e => e.status === "Kadaluarsa" || e.sisaHari < 30).length} Item ED Kritis
                            </span>
                        </div>
                    </div>

                    {/* ED Section */}
                    <div className="mt-5 space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" /> Daftar Obat Kadaluarsa & Mendekati Expired Date
                        </h4>
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase">
                                    <tr>
                                        <th className="px-3 py-2.5">Kode & Nama Obat</th>
                                        <th className="px-3 py-2.5">Batch</th>
                                        <th className="px-3 py-2.5">Lokasi Depo</th>
                                        <th className="px-3 py-2.5">Sisa Stok</th>
                                        <th className="px-3 py-2.5">Tgl Kadaluarsa</th>
                                        <th className="px-3 py-2.5">Status ED</th>
                                        <th className="px-3 py-2.5 text-right">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {edList.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50/60">
                                            <td className="px-3 py-2.5">
                                                <span className="font-mono text-[10px] text-blue-600 font-bold block">{item.kodeObat}</span>
                                                <span className="font-bold text-slate-800">{item.namaObat}</span>
                                            </td>
                                            <td className="px-3 py-2.5 font-mono text-[11px] text-slate-600">{item.batchNo}</td>
                                            <td className="px-3 py-2.5 font-medium text-slate-700">{item.depo}</td>
                                            <td className="px-3 py-2.5 font-bold text-slate-900">{item.stok} {item.satuan}</td>
                                            <td className="px-3 py-2.5 font-semibold text-slate-700">{item.expiredDate}</td>
                                            <td className="px-3 py-2.5">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                    item.status === "Kadaluarsa"
                                                        ? "bg-rose-100 text-rose-700 border border-rose-200"
                                                        : item.status === "Mendekati ED (< 30 Hari)"
                                                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                                                        : "bg-blue-50 text-blue-700 border border-blue-200"
                                                }`}>
                                                    {item.status} ({item.sisaHari < 0 ? `${Math.abs(item.sisaHari)} hari lewat` : `${item.sisaHari} hari lagi`})
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-right">
                                                <button
                                                    onClick={() => alert(`Obat ${item.namaObat} batch ${item.batchNo} berhasil dipindahkan ke Gudang Karantina Pemusnahan.`)}
                                                    className="rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-rose-500 cursor-pointer"
                                                >
                                                    Tarik / Karantina
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Retur Section */}
                    <div className="mt-8 space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <RotateCcw className="h-4 w-4 text-blue-600" /> Permohonan Retur Obat Pasien
                        </h4>
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase">
                                    <tr>
                                        <th className="px-3 py-2.5">No Retur</th>
                                        <th className="px-3 py-2.5">Pasien & No RM</th>
                                        <th className="px-3 py-2.5">Nama Obat Retur</th>
                                        <th className="px-3 py-2.5">Jumlah</th>
                                        <th className="px-3 py-2.5">Alasan Retur</th>
                                        <th className="px-3 py-2.5">Status</th>
                                        <th className="px-3 py-2.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {returList.map(ret => (
                                        <tr key={ret.id} className="hover:bg-slate-50/60">
                                            <td className="px-3 py-2.5 font-mono font-bold text-blue-600">{ret.noRetur}</td>
                                            <td className="px-3 py-2.5">
                                                <span className="font-bold text-slate-900 block">{ret.pasien}</span>
                                                <span className="text-[10px] text-slate-500 font-mono">{ret.norm} • Ref: {ret.resepAsal}</span>
                                            </td>
                                            <td className="px-3 py-2.5 font-semibold text-slate-800">{ret.namaObat}</td>
                                            <td className="px-3 py-2.5 font-bold text-slate-900">{ret.jumlahRetur} {ret.satuan}</td>
                                            <td className="px-3 py-2.5 text-slate-600">{ret.alasan}</td>
                                            <td className="px-3 py-2.5">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                    ret.status === "Disetujui & Masuk Karantina"
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                        : "bg-amber-50 text-amber-700 border border-amber-200"
                                                }`}>
                                                    {ret.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-right">
                                                {ret.status === "Menunggu Persetujuan" ? (
                                                    <button
                                                        onClick={() => handleApproveRetur(ret.id)}
                                                        className="rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-emerald-500 cursor-pointer"
                                                    >
                                                        Setujui Retur
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                                                        <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // TAB PIO & REKONSILIASI
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 border border-teal-200">
                        <HeartPulse className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Pelayanan Informasi Obat (PIO) & Farmasi Klinis (Farklin)</h3>
                        <p className="text-xs text-slate-500">Pemberian KIE, rekonsiliasi obat saat admisi/transfer/discharge, dan konseling pasien poliklinik / bangsal.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-4 space-y-2">
                        <span className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                            <ShieldAlert className="h-4 w-4 text-teal-600" /> Rekonsiliasi Saat Admisi
                        </span>
                        <p className="text-xs text-slate-600">Pencatatan riwayat obat yang sedang dikonsumsi pasien di rumah sebelum dirawat di RS.</p>
                        <div className="pt-2">
                            <span className="text-lg font-black text-teal-700">14 Pasien</span>
                            <span className="text-[11px] text-slate-500 ml-1">telah direkonsiliasi hari ini</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 space-y-2">
                        <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                            <HeartPulse className="h-4 w-4 text-blue-600" /> Konseling Obat Kronis
                        </span>
                        <p className="text-xs text-slate-600">Edukasi cara penggunaan insulin pen, inhaler asma, dan obat antikoagulan risiko tinggi.</p>
                        <div className="pt-2">
                            <span className="text-lg font-black text-blue-700">8 Edukasi</span>
                            <span className="text-[11px] text-slate-500 ml-1">terdokumentasi di CPPT</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 space-y-2">
                        <span className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-purple-600" /> Formulir MESO (Efek Samping)
                        </span>
                        <p className="text-xs text-slate-600">Monitoring Efek Samping Obat & pelaporan insiden Adverse Drug Event (ADE) ke Komite Farmasi & Terapi.</p>
                        <div className="pt-2">
                            <span className="text-lg font-black text-purple-700">0 Insiden</span>
                            <span className="text-[11px] text-slate-500 ml-1">kejadian tidak diharapkan</span>
                        </div>
                    </div>
                </div>

                {/* Form Pencatatan Konseling Baru */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Pencatatan Rekonsiliasi Obat / Konseling Apoteker Baru
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                            <label className="block text-slate-600 font-semibold mb-1">Nama Pasien / No. RM</label>
                            <input type="text" placeholder="Cth: Budi Santoso (RM-2026-0041)" className="w-full rounded-xl border border-slate-200 bg-white p-2.5 focus:border-teal-600 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-600 font-semibold mb-1">Apoteker Konselor</label>
                            <input type="text" defaultValue="apt. Bambang S., S.Farm" className="w-full rounded-xl border border-slate-200 bg-white p-2.5 focus:border-teal-600 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-600 font-semibold mb-1">Topik Edukasi / KIE</label>
                            <input type="text" placeholder="Penggunaan Obat Kardiovaskular & Lambung" className="w-full rounded-xl border border-slate-200 bg-white p-2.5 focus:border-teal-600 focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-semibold mb-1">Catatan Instruksi Apoteker & Respon Pasien</label>
                        <textarea rows={2} placeholder="Pasien telah memahami jam minum obat omeprazole 30 menit sebelum makan dan paracetamol sesudah makan..." className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-teal-600 focus:outline-none" />
                    </div>
                    <button
                        type="button"
                        onClick={() => alert("Data Rekonsiliasi Obat & KIE Apoteker berhasil disimpan ke rekam medis CPPT pasien.")}
                        className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-teal-500 cursor-pointer"
                    >
                        Simpan Catatan Farklin & KIE
                    </button>
                </div>
            </div>
        </div>
    );
}
