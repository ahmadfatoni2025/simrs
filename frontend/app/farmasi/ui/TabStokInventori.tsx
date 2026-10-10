import React from "react";
import { AlertTriangle, Search, Plus } from "lucide-react";
import type { StokObatItem } from "../farmasi";

interface TabStokInventoriProps {
    stokList: StokObatItem[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    filteredStok: StokObatItem[];
    onOpenTambahStok: () => void;
}

export function TabStokInventori({
    stokList,
    searchQuery,
    setSearchQuery,
    filteredStok,
    onOpenTambahStok
}: TabStokInventoriProps) {
    const kritisList = stokList.filter(s => s.stok <= s.minStok);

    return (
        <div className="space-y-6">
            {/* Alert Stok Kritis / Minimal Bar */}
            {kritisList.length > 0 && (
                <div className="rounded-2xl bg-amber-500 p-4 text-white shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 shrink-0" />
                        <div>
                            <h4 className="font-bold text-sm">Peringatan Stok Obat Kritis!</h4>
                            <p className="text-xs text-amber-100">
                                Terdapat {kritisList.length} item obat berada di bawah batas stok minimum. Segera buat Surat Pesanan (PO) Logistik.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama obat, kode, atau kategori..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-xs focus:border-blue-600 focus:outline-none"
                    />
                </div>

                <button
                    onClick={onOpenTambahStok}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-blue-500 cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> Tambah Item Stok Obat Baru
                </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                            <tr>
                                <th className="px-4 py-3">Kode Obat</th>
                                <th className="px-4 py-3">Nama Sediaan</th>
                                <th className="px-4 py-3">Kategori</th>
                                <th className="px-4 py-3">Depo Lokasi</th>
                                <th className="px-4 py-3">Sisa Stok</th>
                                <th className="px-4 py-3">Kadaluarsa (ED)</th>
                                <th className="px-4 py-3">Harga Satuan</th>
                                <th className="px-4 py-3 text-right">Status Stok</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStok.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50/80">
                                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{s.kodeObat}</td>
                                    <td className="px-4 py-3 font-bold text-slate-900">
                                        {s.namaObat}
                                        <span className="block text-[10px] font-normal text-slate-400">{s.produsen}</span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{s.kategori}</td>
                                    <td className="px-4 py-3 text-slate-600 font-medium">{s.lokasiDepo}</td>
                                    <td className="px-4 py-3 font-black text-blue-600">{s.stok} {s.satuan}</td>
                                    <td className="px-4 py-3 font-mono text-slate-600">{s.expiredDate}</td>
                                    <td className="px-4 py-3 font-semibold">Rp {s.hargaSatuan.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right">
                                        {s.stok <= s.minStok ? (
                                            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">Kritis ({s.stok})</span>
                                        ) : (
                                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">Aman</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
