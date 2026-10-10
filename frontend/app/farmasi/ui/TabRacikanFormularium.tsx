import React from "react";
import type { FormulaRacikan } from "../farmasi";

interface TabRacikanFormulariumProps {
    racikanForm: FormulaRacikan;
    setRacikanForm: React.Dispatch<React.SetStateAction<FormulaRacikan>>;
    onShowAlert: (msg: string, title?: string, type?: "success" | "warning" | "info" | "error") => void;
}

export function TabRacikanFormularium({
    racikanForm,
    setRacikanForm,
    onShowAlert
}: TabRacikanFormulariumProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <div className="border-b border-slate-100 pb-3">
                        <h3 className="text-base font-bold text-slate-900">
                            Kalkulator Formulasi Obat Racikan (Compounding)
                        </h3>
                        <p className="text-xs text-slate-500">
                            Perhitungan otomatis bahan aktif puyer, kapsul, sirup dan penentuan tarif racik.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-xs font-bold text-slate-700">Nama Racikan</label>
                            <input
                                type="text"
                                value={racikanForm.namaRacikan}
                                onChange={(e) => setRacikanForm({ ...racikanForm, namaRacikan: e.target.value })}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700">Bentuk Sediaan Racik</label>
                            <select
                                value={racikanForm.jenisRacikan}
                                onChange={(e) => setRacikanForm({ ...racikanForm, jenisRacikan: e.target.value as FormulaRacikan["jenisRacikan"] })}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                            >
                                <option value="Puyer">Puyer / Pulveres</option>
                                <option value="Kapsul">Kapsul</option>
                                <option value="Sirup / Suspension">Sirup / Suspensi</option>
                                <option value="Salep / Cream">Salep / Krèm</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700">Jumlah Dibuat (Bungkus / Kapsul)</label>
                            <input
                                type="number"
                                value={racikanForm.jumlahBungkus}
                                onChange={(e) => setRacikanForm({ ...racikanForm, jumlahBungkus: parseInt(e.target.value) || 1 })}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700">Signa / Aturan Pakai</label>
                            <input
                                type="text"
                                value={racikanForm.aturanPakai}
                                onChange={(e) => setRacikanForm({ ...racikanForm, aturanPakai: e.target.value })}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-100 pt-4">
                        <h4 className="text-xs font-bold text-slate-900">Bahan Obat Aktif:</h4>
                        <div className="space-y-2">
                            {racikanForm.bahanList.map((b, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                                    <div>
                                        <strong className="block text-slate-900">{b.namaObat}</strong>
                                        <span className="text-[11px] text-slate-500">Dosis per bungkus: {b.dosisTarget}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-mono font-bold text-blue-600">Total Kebutuhan: {b.jumlahBahan} {b.satuan}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                        Ringkasan Biaya Racikan
                    </h3>

                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Harga Total Bahan Obat:</span>
                            <span className="font-semibold">Rp 12.500</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Jasa Racik / Embalase:</span>
                            <span className="font-semibold">Rp {racikanForm.jasaRacik.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-extrabold text-slate-900">
                            <span>Total Tagihan Racikan:</span>
                            <span className="text-emerald-600">Rp 17.500</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onShowAlert("Formulasi racikan berhasil disimpan ke resep pasien!", "Racikan Disimpan", "success")}
                        className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 cursor-pointer"
                    >
                        Simpan Formulasi Racikan
                    </button>
                </div>
            </div>
        </div>
    );
}
