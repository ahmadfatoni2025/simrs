import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import {
    PillBottle,
    Plus,
    Trash2,
    CheckCircle2,
    Search,
    AlertTriangle,
    Syringe,
    Sparkles,
    Send,
    User,
    ShieldAlert,
    Clock,
    Printer,
    FileText,
    ArrowRight
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { PatientRecord, RecipeItem } from "../types";
import { getSavedPatients, getPatientById, setActivePatientId } from "../mockData";
import { CustomAlertModal, type AlertType } from "~/components/ui/CustomAlertModal";

const FORMULARIUM_OBAT = [
    { name: "Paracetamol 500mg Tab", bentuk: "Tablet", harga: 1500, kategori: "Analgetik / Antipiretik" },
    { name: "Amoxicillin 500mg Cap", bentuk: "Kapsul", harga: 3000, kategori: "Antibiotik" },
    { name: "Ibuprofen 400mg Tab", bentuk: "Tablet", harga: 2500, kategori: "NSAID" },
    { name: "Omeprazole 20mg Cap", bentuk: "Kapsul", harga: 4000, kategori: "Antasida & PPI" },
    { name: "Metformin 500mg Tab", bentuk: "Tablet", harga: 2000, kategori: "Antidiabetes" },
    { name: "Amlodipine 5mg Tab", bentuk: "Tablet", harga: 2500, kategori: "Antihipertensi" },
    { name: "Captopril 25mg Tab", bentuk: "Tablet", harga: 1800, kategori: "Antihipertensi" },
    { name: "Cefadroxil 500mg Cap", bentuk: "Kapsul", harga: 5000, kategori: "Antibiotik" },
    { name: "Cetirizine 10mg Tab", bentuk: "Tablet", harga: 2500, kategori: "Antihistamin" },
    { name: "Vitamin C 500mg Tab", bentuk: "Tablet", harga: 1000, kategori: "Suplemen" },
];

const SIGNA_PRESETS = [
    "3 x 1 tablet sesudah makan",
    "2 x 1 tablet sesudah makan",
    "1 x 1 tablet malam hari",
    "1 x 1 tablet pagi hari sebelum makan",
    "3 x 1 kapsul bila demam/nyeri (prn)",
    "2 x 1 sendok takar sesudah makan"
];

export default function EPrescribingPage() {
    const [searchParams] = useSearchParams();
    const patientIdParam = searchParams.get("patientId");

    const [patients] = useState<PatientRecord[]>(() => getSavedPatients());
    const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(() => {
        return getPatientById(patientIdParam);
    });

    // Alert Modal State
    const [alertState, setAlertState] = useState<{
        isOpen: boolean;
        title?: string;
        message: string;
        type?: AlertType;
    }>({
        isOpen: false,
        message: ""
    });

    const showAlert = (message: string, title?: string, type: AlertType = "success") => {
        setAlertState({ isOpen: true, message, title, type });
    };

    // Recipe Items
    const [recipeList, setRecipeList] = useState<RecipeItem[]>([
        {
            id: "rec-1",
            namaObat: "Paracetamol 500mg Tab",
            bentuk: "Tablet",
            dosis: "500 mg",
            aturanPakai: "3 x 1 tablet sesudah makan",
            jumlah: 10,
            satuan: "Tablet",
            harga: 1500
        },
        {
            id: "rec-2",
            namaObat: "Omeprazole 20mg Cap",
            bentuk: "Kapsul",
            dosis: "20 mg",
            aturanPakai: "1 x 1 kapsul pagi hari sebelum makan",
            jumlah: 7,
            satuan: "Kapsul",
            harga: 4000
        }
    ]);

    // Form inputs for new medicine
    const [namaObat, setNamaObat] = useState(FORMULARIUM_OBAT[0].name);
    const [bentuk, setBentuk] = useState(FORMULARIUM_OBAT[0].bentuk);
    const [dosis, setDosis] = useState("500 mg");
    const [aturanPakai, setAturanPakai] = useState(SIGNA_PRESETS[0]);
    const [jumlah, setJumlah] = useState(10);
    const [satuan, setSatuan] = useState("Tablet");
    const [searchFormularium, setSearchFormularium] = useState("");
    const [isDispatched, setIsDispatched] = useState(false);

    // Filtered Formularium
    const filteredFormularium = FORMULARIUM_OBAT.filter(f =>
        f.name.toLowerCase().includes(searchFormularium.toLowerCase()) ||
        f.kategori.toLowerCase().includes(searchFormularium.toLowerCase())
    );

    const handleSelectDrug = (drug: typeof FORMULARIUM_OBAT[0]) => {
        setNamaObat(drug.name);
        setBentuk(drug.bentuk);
        setSatuan(drug.bentuk);

        // Allergy safety warning
        if (selectedPatient.allergies?.some(a => drug.name.toLowerCase().includes(a.toLowerCase()))) {
            showAlert(
                `Peringatan: Pasien ${selectedPatient.name} memiliki riwayat alergi terhadap obat yang mirip dengan "${drug.name}". Mohon verifikasi kembali!`,
                "Peringatan Alergi Obat!",
                "warning"
            );
        }
    };

    const handleAddDrug = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const selectedDrugObj = FORMULARIUM_OBAT.find(f => f.name === namaObat);
        const newItem: RecipeItem = {
            id: `rec-${Date.now()}`,
            namaObat,
            bentuk,
            dosis,
            aturanPakai,
            jumlah: Number(jumlah) || 1,
            satuan,
            harga: selectedDrugObj?.harga || 2000
        };

        setRecipeList(prev => [...prev, newItem]);
        showAlert(`Obat "${namaObat}" berhasil ditambahkan ke resep R/`, "Obat Ditambahkan", "info");
    };

    const handleRemoveDrug = (id: string) => {
        setRecipeList(prev => prev.filter(r => r.id !== id));
    };

    const totalBiaya = recipeList.reduce((acc, curr) => acc + (curr.jumlah * (curr.harga || 2000)), 0);

    const handleDispatchToPharmacy = () => {
        setIsDispatched(true);
        showAlert(
            `Resep elektronik pasien ${selectedPatient.name} (${selectedPatient.norm}) berisi ${recipeList.length} item obat berhasil dikirim ke Depo Farmasi Rawat Jalan SIMRS! Petugas farmasi segera menyiapkan dispensing.`,
            "Resep Terkirim ke Depo Farmasi",
            "success"
        );
    };

    return (
        <div className="space-y-6">
            <CustomAlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            {/* Patient Header Bar */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-black text-lg shadow-2xs">
                            <PillBottle className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-black text-slate-900">{selectedPatient.name}</h2>
                                <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                                    {selectedPatient.norm}
                                </span>
                                <span className="text-xs text-slate-400">({selectedPatient.queueNo})</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {selectedPatient.clinic} • DPJP: {selectedPatient.doctorName} • Penjamin: <strong className="text-emerald-700">{selectedPatient.guarantee}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Pilih Pasien:</span>
                        <select
                            value={selectedPatient.id}
                            onChange={(e) => {
                                const found = patients.find(p => p.id === e.target.value);
                                if (found) {
                                    setSelectedPatient(found);
                                    setActivePatientId(found.id);
                                }
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-none"
                        >
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.queueNo} - {p.name} ({p.clinic})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Allergy warning if any */}
                {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                    <div className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800 font-semibold">
                        <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                        <span>Riwayat Alergi Pasien: <strong>{selectedPatient.allergies.join(", ")}</strong>. Pastikan tidak meresepkan golongan obat terkait!</span>
                    </div>
                )}
            </div>

            {/* Prescribing Layout Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Form Input Tambah Resep (1 col) */}
                <div className="space-y-4">
                    <form onSubmit={handleAddDrug} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4 text-emerald-600" />
                                <h3 className="text-sm font-black text-slate-900">Form Lembar Resep (R/)</h3>
                            </div>
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                                Formularium
                            </span>
                        </div>

                        <div className="space-y-3 text-xs">
                            {/* Search drug in formulary */}
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Cari Formularium Obat</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchFormularium}
                                        onChange={(e) => setSearchFormularium(e.target.value)}
                                        placeholder="Ketik nama obat..."
                                        className="w-full rounded-xl border border-slate-200 py-2 pl-8 pr-3 text-xs focus:border-emerald-600 focus:outline-none"
                                    />
                                </div>

                                <div className="mt-1.5 max-h-32 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-1 space-y-1">
                                    {filteredFormularium.map((drug) => (
                                        <button
                                            key={drug.name}
                                            type="button"
                                            onClick={() => handleSelectDrug(drug)}
                                            className={cn(
                                                "w-full text-left rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors flex items-center justify-between",
                                                namaObat === drug.name
                                                    ? "bg-emerald-600 text-white font-bold"
                                                    : "hover:bg-white text-slate-700"
                                            )}
                                        >
                                            <span className="truncate">{drug.name}</span>
                                            <span className="text-[10px] opacity-75 shrink-0">Rp {drug.harga.toLocaleString("id-ID")}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Dosis</label>
                                    <input
                                        type="text"
                                        value={dosis}
                                        onChange={(e) => setDosis(e.target.value)}
                                        placeholder="Cth: 500 mg"
                                        className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-emerald-600 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Jumlah</label>
                                    <input
                                        type="number"
                                        value={jumlah}
                                        onChange={(e) => setJumlah(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-center focus:border-emerald-600 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Signa Aturan Pakai */}
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Aturan Pakai (Signa)</label>
                                <input
                                    type="text"
                                    value={aturanPakai}
                                    onChange={(e) => setAturanPakai(e.target.value)}
                                    placeholder="Cth: 3 x 1 tablet sesudah makan"
                                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                                />

                                <div className="flex flex-wrap gap-1 mt-1.5">
                                    {SIGNA_PRESETS.slice(0, 3).map((sig) => (
                                        <button
                                            key={sig}
                                            type="button"
                                            onClick={() => setAturanPakai(sig)}
                                            className="rounded-lg bg-slate-100 hover:bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-slate-600 cursor-pointer"
                                        >
                                            {sig}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-2xl bg-slate-900 py-2.5 text-xs font-black text-white hover:bg-emerald-600 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Tambah ke Lembar R/</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Lembar Resep Digital R/ (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <h3 className="text-sm font-black text-slate-900">
                                    Lembar Resep Elektronik Pasien ({recipeList.length} Item)
                                </h3>
                            </div>
                            <span className="font-mono text-xs font-bold text-slate-500">
                                DPJP: {selectedPatient.doctorName}
                            </span>
                        </div>

                        {recipeList.length === 0 ? (
                            <div className="py-12 text-center text-xs text-slate-400">
                                Belum ada obat yang ditambahkan ke resep ini.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recipeList.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between rounded-2xl border border-slate-200/80 p-3.5 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="font-serif italic font-bold text-lg text-blue-600">
                                                R/{idx + 1}
                                            </span>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-xs font-black text-slate-900">{item.namaObat}</h4>
                                                    <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-600">
                                                        No. {item.jumlah} {item.satuan}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-emerald-700 font-bold mt-0.5">
                                                    ∫ {item.aturanPakai}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    Est. Rp {((item.harga || 2000) * item.jumlah).toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDrug(item.id)}
                                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}

                                {/* Total Summary & Dispatch Action */}
                                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <span className="text-xs text-slate-500">Estimasi Total Biaya Obat:</span>
                                        <p className="text-lg font-black text-slate-900">
                                            Rp {totalBiaya.toLocaleString("id-ID")}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleDispatchToPharmacy}
                                            className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                                        >
                                            <Send className="h-4 w-4" />
                                            <span>Kirim ke Depo Farmasi</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
