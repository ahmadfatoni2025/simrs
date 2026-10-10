import React from "react";
import { AlertTriangle } from "lucide-react";
import type { ResepItem } from "../farmasi";

interface ModalVerifikasiApotekerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedResep: ResepItem | null;
    catatanApotekerInput: string;
    setCatatanApotekerInput: (val: string) => void;
    onUpdateResepStatus: (id: string, newStatus: ResepItem["status"], catatan?: string) => void;
}

export function ModalVerifikasiApoteker({
    isOpen,
    onClose,
    selectedResep,
    catatanApotekerInput,
    setCatatanApotekerInput,
    onUpdateResepStatus
}: ModalVerifikasiApotekerProps) {
    if (!isOpen || !selectedResep) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <span className="font-mono text-xs font-black text-blue-600">{selectedResep.noResep}</span>
                        <h3 className="text-base font-bold text-slate-900">Verifikasi Resep Apoteker</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Ringkasan Pasien */}
                <div className="rounded-2xl bg-slate-50 p-4 text-xs space-y-1 border border-slate-200/60">
                    <p className="font-bold text-slate-900">{selectedResep.namaPasien} ({selectedResep.norm}) • {selectedResep.umur}</p>
                    <p className="text-slate-600">Dokter: {selectedResep.dokter} ({selectedResep.poli})</p>
                    <p className="text-slate-600">Penjamin: <strong>{selectedResep.penjamin}</strong></p>
                </div>

                {/* Safety Alerts */}
                {selectedResep.alergiPasien && selectedResep.alergiPasien.length > 0 && (
                    <div className="rounded-xl bg-rose-500 p-3 text-xs text-white font-bold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>PERINGATAN ALERGI PASIEN: {selectedResep.alergiPasien.join(", ")}</span>
                    </div>
                )}

                {/* Item Obat & Verifikasi Dosis */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-800">Cek Dosis & Ketersediaan Stok:</h4>
                    <div className="space-y-2">
                        {selectedResep.daftarObat.map((o, idx) => (
                            <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-xs">
                                <div>
                                    <strong className="block text-slate-900">{o.nama}</strong>
                                    <span className="text-slate-500">Signa: {o.aturan}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-slate-900">{o.jumlah} {o.satuan}</span>
                                    <span className="text-[10px] font-bold text-emerald-600">Stok: {o.stokTersedia}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Catatan Apoteker */}
                <div>
                    <label className="text-xs font-bold text-slate-700">Catatan Telaah Apoteker (Opsional)</label>
                    <textarea
                        value={catatanApotekerInput}
                        onChange={(e) => setCatatanApotekerInput(e.target.value)}
                        placeholder="Masukkan catatan telaah keabsahan resep / konfirmasi dokter..."
                        className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-blue-600 focus:outline-none"
                        rows={2}
                    />
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            onUpdateResepStatus(selectedResep.id, "Verifikasi", catatanApotekerInput);
                            onClose();
                        }}
                        className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 cursor-pointer"
                    >
                        Setujui & Lanjutkan Resep
                    </button>
                </div>
            </div>
        </div>
    );
}
