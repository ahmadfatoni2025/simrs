import { useState } from "react";
import {
    PillBottle,
    Plus,
    Trash2,
    CheckCircle2,
    Search,
    AlertTriangle,
    Syringe,
    Sparkles,
    Send
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { PatientRecord } from "../pemeriksaan";

interface EPrescribingProps {
    patients: PatientRecord[];
}

interface RecipeItem {
    id: string;
    namaObat: string;
    bentuk: string;
    dosis: string;
    aturanPakai: string;
    jumlah: number;
    satuan: string;
}

const FORMULARIUM_OBAT = [
    { name: "Paracetamol 500mg Tab", bentuk: "Tablet", harga: 1500 },
    { name: "Amoxicillin 500mg Cap", bentuk: "Kapsul", harga: 3000 },
    { name: "Ibuprofen 400mg Tab", bentuk: "Tablet", harga: 2500 },
    { name: "Omeprazole 20mg Cap", bentuk: "Kapsul", harga: 4000 },
    { name: "Metformin 500mg Tab", bentuk: "Tablet", harga: 2000 },
    { name: "Cefadroxil 500mg Cap", bentuk: "Kapsul", harga: 5000 },
    { name: "Cetirizine 10mg Tab", bentuk: "Tablet", harga: 2500 },
    { name: "Vitamin C 500mg Tab", bentuk: "Tablet", harga: 1000 },
];

export default function EPrescribing({ patients }: EPrescribingProps) {
    const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(
        patients[0] || {
            id: "1",
            queueNo: "A-012",
            norm: "RM-2026-0041",
            name: "Budi Santoso",
            age: 34,
            gender: "L",
            clinic: "Poli Umum",
            doctorName: "dr. Andi Prasetyo",
            arrivalTime: "08:15 WIB",
            guarantee: "BPJS",
            status: "Sedang Diperiksa",
            chiefComplaint: "Pemeriksaan medis rutin"
        }
    );

    const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([
        {
            id: "r-1",
            namaObat: "Paracetamol 500mg Tab",
            bentuk: "Tablet",
            dosis: "500 mg",
            aturanPakai: "3 x 1 tablet sesudah makan",
            jumlah: 10,
            satuan: "Tab"
        },
        {
            id: "r-2",
            namaObat: "Omeprazole 20mg Cap",
            bentuk: "Kapsul",
            dosis: "20 mg",
            aturanPakai: "2 x 1 kapsul sebelum makan",
            jumlah: 7,
            satuan: "Cap"
        }
    ]);

    const [searchObat, setSearchObat] = useState("");
    const [customObatName, setCustomObatName] = useState("");
    const [aturanInput, setAturanInput] = useState("3 x 1 tablet sesudah makan");
    const [jumlahInput, setJumlahInput] = useState("10");

    const handleAddObat = (nama: string) => {
        const newItem: RecipeItem = {
            id: `r-${Date.now()}`,
            namaObat: nama,
            bentuk: "Tablet",
            dosis: "1 dosis",
            aturanPakai: aturanInput || "3 x 1 tablet sesudah makan",
            jumlah: Number(jumlahInput) || 10,
            satuan: "Pcs"
        };
        setRecipeItems(prev => [...prev, newItem]);
        setSearchObat("");
        setCustomObatName("");
    };

    const handleRemoveItem = (id: string) => {
        setRecipeItems(prev => prev.filter(item => item.id !== id));
    };

    const handleSendToPharmacy = () => {
        alert(`Resep Elektronik untuk pasien ${selectedPatient.name} (${selectedPatient.norm}) berhasil dikirim ke Depo Farmasi SIMRS!`);
    };

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <PillBottle className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            E-Prescribing (Resep Elektronik Dokter)
                        </h3>
                        <p className="text-xs text-slate-500">
                            Penyusunan resep obat langsung terintegrasi dengan Stok Depo Farmasi.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={selectedPatient.id}
                        onChange={(e) => {
                            const found = patients.find(p => p.id === e.target.value);
                            if (found) setSelectedPatient(found);
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800"
                    >
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.queueNo} - {p.name} ({p.clinic})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Allergy Warning Chip */}
            <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
                <div>
                    <span className="font-bold">Peringatan Alergi Pasien:</span> Pasien memiliki catatan alergi terhadap <strong className="underline">Penicillin</strong>. Sistem akan memberikan alert jika ada obat kontrindikasi.
                </div>
            </div>

            {/* Prescribing Workspace */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Form Item Resep (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                            Pencarian Obat & Formularium RS
                        </h4>

                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Ketik nama obat (contoh: Paracetamol, Amoxicillin)..."
                                    value={searchObat}
                                    onChange={(e) => setSearchObat(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Search Suggestions */}
                            {searchObat && (
                                <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-lg space-y-1 max-h-48 overflow-y-auto">
                                    {FORMULARIUM_OBAT.filter(o => o.name.toLowerCase().includes(searchObat.toLowerCase())).map((o) => (
                                        <button
                                            key={o.name}
                                            type="button"
                                            onClick={() => handleAddObat(o.name)}
                                            className="flex w-full items-center justify-between rounded-lg p-2 text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                                        >
                                            <span className="font-semibold">{o.name}</span>
                                            <span className="text-[10px] text-slate-400">Rp {o.harga.toLocaleString()}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Quick Add Custom */}
                            <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Aturan Pakai</label>
                                    <input
                                        type="text"
                                        value={aturanInput}
                                        onChange={(e) => setAturanInput(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Jumlah</label>
                                    <input
                                        type="number"
                                        value={jumlahInput}
                                        onChange={(e) => setJumlahInput(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => handleAddObat(customObatName || "Obat Tambahan Dokter")}
                                        className="w-full rounded-xl bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                                    >
                                        + Tambah Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prescribed Item List Table */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h4 className="text-sm font-bold text-slate-900">
                                Daftar Rincian Resep Dokter ({recipeItems.length} Item)
                            </h4>
                            <span className="text-xs font-bold text-blue-600">Depo Farmasi Poliklinik</span>
                        </div>

                        <div className="space-y-3">
                            {recipeItems.map((item, idx) => (
                                <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <h5 className="text-xs font-bold text-slate-900">{item.namaObat}</h5>
                                            <p className="text-[11px] text-slate-500">Signa: <strong className="text-slate-800">{item.aturanPakai}</strong></p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                                            {item.jumlah} {item.satuan}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Prescription Summary */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                            Ringkasan Resep Pasien
                        </h4>

                        <div className="space-y-2 text-xs">
                            <p><span className="text-slate-400">Pasien:</span> <strong>{selectedPatient.name}</strong></p>
                            <p><span className="text-slate-400">No. RM:</span> <strong className="font-mono">{selectedPatient.norm}</strong></p>
                            <p><span className="text-slate-400">Poli / Klinik:</span> <strong>{selectedPatient.clinic}</strong></p>
                            <p><span className="text-slate-400">DPJP:</span> <strong>{selectedPatient.doctorName}</strong></p>
                            <p><span className="text-slate-400">Total Obat:</span> <strong>{recipeItems.length} Jenis</strong></p>
                        </div>

                        <button
                            type="button"
                            onClick={handleSendToPharmacy}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500 transition-all cursor-pointer"
                        >
                            <Send className="h-4 w-4" /> Kirim Resep ke Depo Farmasi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
