import React from "react";
import type { StokObatItem } from "../farmasi";

interface ModalTambahStokObatProps {
    isOpen: boolean;
    onClose: () => void;
    newStokForm: {
        kodeObat: string;
        namaObat: string;
        kategori: string;
        stok: number;
        satuan: string;
        minStok: number;
        expiredDate: string;
        hargaSatuan: number;
        lokasiDepo: string;
        produsen: string;
    };
    setNewStokForm: React.Dispatch<React.SetStateAction<{
        kodeObat: string;
        namaObat: string;
        kategori: string;
        stok: number;
        satuan: string;
        minStok: number;
        expiredDate: string;
        hargaSatuan: number;
        lokasiDepo: string;
        produsen: string;
    }>>;
    onSaveTambahStok: (e: React.FormEvent) => void;
}

export function ModalTambahStokObat({
    isOpen,
    onClose,
    newStokForm,
    setNewStokForm,
    onSaveTambahStok
}: ModalTambahStokObatProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">Tambah Item Stok Obat Baru</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={onSaveTambahStok} className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className="text-xs font-bold text-slate-700">Kode Obat</label>
                            <input
                                type="text"
                                required
                                placeholder="FAR-008"
                                value={newStokForm.kodeObat}
                                onChange={(e) => setNewStokForm({ ...newStokForm, kodeObat: e.target.value })}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700">Nama Obat Sediaan</label>
                            <input
                                type="text"
                                required
                                placeholder="Nama obat & dosis..."
                                value={newStokForm.namaObat}
                                onChange={(e) => setNewStokForm({ ...newStokForm, namaObat: e.target.value })}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className="text-xs font-bold text-slate-700">Kategori</label>
                            <input
                                type="text"
                                value={newStokForm.kategori}
                                onChange={(e) => setNewStokForm({ ...newStokForm, kategori: e.target.value })}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700">Lokasi Depo</label>
                            <select
                                value={newStokForm.lokasiDepo}
                                onChange={(e) => setNewStokForm({ ...newStokForm, lokasiDepo: e.target.value })}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                            >
                                <option value="Depo Rawat Jalan">Depo Rawat Jalan</option>
                                <option value="Depo Rawat Inap">Depo Rawat Inap</option>
                                <option value="Depo IGD">Depo IGD</option>
                                <option value="Depo Central">Depo Central (Gudang)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                            <label className="text-xs font-bold text-slate-700">Jumlah Stok</label>
                            <input
                                type="number"
                                required
                                value={newStokForm.stok}
                                onChange={(e) => setNewStokForm({ ...newStokForm, stok: parseInt(e.target.value) || 0 })}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700">Min Stok Alert</label>
                            <input
                                type="number"
                                required
                                value={newStokForm.minStok}
                                onChange={(e) => setNewStokForm({ ...newStokForm, minStok: parseInt(e.target.value) || 0 })}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700">Harga Satuan (Rp)</label>
                            <input
                                type="number"
                                required
                                value={newStokForm.hargaSatuan}
                                onChange={(e) => setNewStokForm({ ...newStokForm, hargaSatuan: parseInt(e.target.value) || 0 })}
                                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 cursor-pointer"
                        >
                            Simpan Item Stok
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
