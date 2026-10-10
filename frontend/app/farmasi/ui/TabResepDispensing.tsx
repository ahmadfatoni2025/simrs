import React from "react";
import { Eye, AlertTriangle, AlertCircle, Printer } from "lucide-react";
import type { ResepItem } from "../farmasi";

interface TabResepDispensingProps {
    filteredResepList: ResepItem[];
    setSearchQuery: (q: string) => void;
    onOpenVerifikasi: (resep: ResepItem) => void;
    onUpdateResepStatus: (id: string, newStatus: ResepItem["status"], catatan?: string) => void;
    onShowAlert: (msg: string, title?: string, type?: "success" | "warning" | "info" | "error") => void;
}

export function TabResepDispensing({
    filteredResepList,
    setSearchQuery,
    onOpenVerifikasi,
    onUpdateResepStatus,
    onShowAlert
}: TabResepDispensingProps) {
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            E-Prescribing Receiver & Detail Verifikasi Obat
                        </h3>
                        <p className="text-xs text-slate-500">
                            Pemeriksaan Clinical Decision Support (Alergi, Dosis, Interaksi Obat) & Pencetakan Etiket Pasien.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSearchQuery("")}
                            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                            Reset Filter
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredResepList.map((resep) => (
                        <div key={resep.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/60 pb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm font-black text-blue-600">{resep.noResep}</span>
                                        <span className="text-xs text-slate-400">({resep.waktu})</span>
                                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">{resep.depoTujuan}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                                        {resep.namaPasien} <span className="text-xs font-normal text-slate-500">({resep.norm} • {resep.umur})</span>
                                    </h4>
                                    <p className="text-xs text-slate-500">Dokter DPJP: <strong>{resep.dokter}</strong> • {resep.poli} • Penjamin: <strong className="text-slate-700">{resep.penjamin}</strong></p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => onOpenVerifikasi(resep)}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 shadow-2xs hover:bg-blue-50 cursor-pointer"
                                    >
                                        <Eye className="h-3.5 w-3.5" /> Detail & Cek Safety
                                    </button>

                                    {resep.status === "Masuk" && (
                                        <button
                                            onClick={() => onUpdateResepStatus(resep.id, "Verifikasi")}
                                            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 cursor-pointer"
                                        >
                                            Setujui Verifikasi
                                        </button>
                                    )}
                                    {resep.status === "Verifikasi" && (
                                        <button
                                            onClick={() => onUpdateResepStatus(resep.id, "Diproses")}
                                            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500 cursor-pointer"
                                        >
                                            Mulai Racik / Siapkan
                                        </button>
                                    )}
                                    {resep.status === "Diproses" && (
                                        <button
                                            onClick={() => onUpdateResepStatus(resep.id, "Siap Ambil")}
                                            className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-500 cursor-pointer"
                                        >
                                            Verifikasi & Etiket Selesai
                                        </button>
                                    )}
                                    {resep.status === "Siap Ambil" && (
                                        <button
                                            onClick={() => onUpdateResepStatus(resep.id, "Selesai")}
                                            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500 cursor-pointer"
                                        >
                                            Serahkan Obat ke Pasien
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Safety Warnings */}
                            {(resep.alergiPasien?.length || resep.peringatanInteraksi?.length) ? (
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {resep.alergiPasien && resep.alergiPasien.length > 0 && (
                                        <div className="rounded-xl bg-rose-500 p-3 text-xs text-white shadow-2xs flex items-start gap-2">
                                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                            <div>
                                                <strong className="block font-bold">PERINGATAN ALERGI PASIEN!</strong>
                                                <span>Pasien alergi terhadap: {resep.alergiPasien.join(", ")}</span>
                                            </div>
                                        </div>
                                    )}
                                    {resep.peringatanInteraksi && resep.peringatanInteraksi.length > 0 && (
                                        <div className="rounded-xl bg-amber-100 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                                            <div>
                                                <strong className="block font-bold text-amber-800">INTERAKSI OBAT (DRUG-DRUG)</strong>
                                                <span>{resep.peringatanInteraksi.join(" ")}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            {/* Tabel Item Obat dalam Resep */}
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                                        <tr>
                                            <th className="px-3 py-2">Nama Obat / Sediaan</th>
                                            <th className="px-3 py-2">Jumlah</th>
                                            <th className="px-3 py-2">Signa (Aturan Pakai)</th>
                                            <th className="px-3 py-2">Stok Depo</th>
                                            <th className="px-3 py-2 text-right">Harga Satuan</th>
                                            <th className="px-3 py-2 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {resep.daftarObat.map((o, idx) => (
                                            <tr key={idx}>
                                                <td className="px-3 py-2.5 font-bold text-slate-900">{o.nama}</td>
                                                <td className="px-3 py-2.5 font-semibold">{o.jumlah} {o.satuan}</td>
                                                <td className="px-3 py-2.5 font-mono text-blue-700 font-bold bg-blue-50/50 rounded">{o.aturan}</td>
                                                <td className="px-3 py-2.5">
                                                    {o.stokTersedia >= o.jumlah ? (
                                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Cukup ({o.stokTersedia})</span>
                                                    ) : (
                                                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">Stok Kurang ({o.stokTersedia})</span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2.5 text-right font-mono font-semibold">Rp {o.hargaSatuan.toLocaleString()}</td>
                                                <td className="px-3 py-2.5 text-right">
                                                    <button
                                                        onClick={() => onShowAlert(`Mencetak etiket obat: ${o.nama} untuk pasien ${resep.namaPasien}`, "Cetak Etiket", "info")}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                                                    >
                                                        <Printer className="h-3 w-3" /> Cetak Etiket
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
