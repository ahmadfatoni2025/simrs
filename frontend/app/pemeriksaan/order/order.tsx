import { useState } from "react";
import { useSearchParams } from "react-router";
import {
    FlaskConical,
    FileText,
    CheckCircle2,
    Plus,
    Clock,
    Sparkles,
    Send,
    Activity,
    ShieldCheck,
    AlertCircle,
    Printer,
    Trash2
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { PatientRecord, OrderPenunjangItem } from "../types";
import { getSavedPatients, getPatientById, setActivePatientId } from "../mockData";
import { CustomAlertModal, type AlertType } from "~/components/ui/CustomAlertModal";

const MASTER_PENUNJANG: OrderPenunjangItem[] = [
    { id: "p-1", type: "LAB", namaPemeriksaan: "Darah Lengkap (DL / CBC + Diff)", kategori: "Hematologi", isCito: false, tarif: 120000 },
    { id: "p-2", type: "LAB", namaPemeriksaan: "Gula Darah Sewaktu (GDS)", kategori: "Kimia Darah", isCito: false, tarif: 45000 },
    { id: "p-3", type: "LAB", namaPemeriksaan: "Fungsi Ginjal (Ureum & Kreatinin)", kategori: "Kimia Darah", isCito: false, tarif: 150000 },
    { id: "p-4", type: "LAB", namaPemeriksaan: "Fungsi Hati (SGOT & SGPT)", kategori: "Kimia Darah", isCito: false, tarif: 160000 },
    { id: "p-5", type: "LAB", namaPemeriksaan: "Profil Lipid (Kolesterol, HDL, LDL, Trigliserida)", kategori: "Kimia Darah", isCito: false, tarif: 250000 },
    { id: "p-6", type: "LAB", namaPemeriksaan: "Urinalisis Lengkap Otomatis", kategori: "Urinalisis", isCito: false, tarif: 75000 },
    { id: "p-7", type: "RAD", namaPemeriksaan: "Rontgen Thorax PA Digital", kategori: "Radiologi X-Ray", isCito: false, tarif: 220000 },
    { id: "p-8", type: "RAD", namaPemeriksaan: "USG Abdomen Whole (Upper & Lower)", kategori: "Radiologi USG", isCito: false, tarif: 350000 },
    { id: "p-9", type: "RAD", namaPemeriksaan: "CT-Scan Kepala Non-Kontras", kategori: "CT-Scan", isCito: false, tarif: 1100000 },
    { id: "p-10", type: "RAD", namaPemeriksaan: "Elektrokardiogram (EKG 12-Lead)", kategori: "Diagnostik Jantung", isCito: false, tarif: 100000 },
];

export default function OrderPenunjangPage() {
    const [searchParams] = useSearchParams();
    const patientIdParam = searchParams.get("patientId");

    const [patients] = useState<PatientRecord[]>(() => getSavedPatients());
    const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(() => {
        return getPatientById(patientIdParam);
    });

    const [filterType, setFilterType] = useState<"ALL" | "LAB" | "RAD">("ALL");
    const [indikasiKlinis, setIndikasiKlinis] = useState(
        `Observasi dan evaluasi klinis lanjutan untuk ${selectedPatient.name} - keluhan: ${selectedPatient.chiefComplaint}`
    );
    const [isCitoGlobal, setIsCitoGlobal] = useState(false);

    // Selected order list
    const [orderedItems, setOrderedItems] = useState<OrderPenunjangItem[]>([
        { ...MASTER_PENUNJANG[0], isCito: false },
        { ...MASTER_PENUNJANG[6], isCito: false }
    ]);

    // Alert Modal
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

    const handleToggleItem = (item: OrderPenunjangItem) => {
        if (orderedItems.some(o => o.id === item.id)) {
            setOrderedItems(prev => prev.filter(o => o.id !== item.id));
        } else {
            setOrderedItems(prev => [...prev, { ...item, isCito: isCitoGlobal }]);
        }
    };

    const handleSendOrder = () => {
        if (orderedItems.length === 0) {
            showAlert("Pilih minimal satu jenis pemeriksaan laboratorium atau radiologi!", "Pemeriksaan Belum Dipilih", "warning");
            return;
        }

        showAlert(
            `Order ${orderedItems.length} pemeriksaan penunjang untuk pasien ${selectedPatient.name} (${selectedPatient.norm}) berhasil dikirim ke Unit Laboratorium & Radiologi! Nomor Order Penunjang: ORD-${Date.now().toString().slice(-6)}`,
            "Order Penunjang Berhasil Dikirim",
            "success"
        );
    };

    const filteredCatalog = MASTER_PENUNJANG.filter(p => {
        if (filterType === "ALL") return true;
        return p.type === filterType;
    });

    const totalTarif = orderedItems.reduce((acc, curr) => acc + curr.tarif, 0);

    return (
        <div className="space-y-6">
            <CustomAlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            {/* Patient Header Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 font-black text-lg shadow-2xs">
                            <FlaskConical className="h-6 w-6" />
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
                                {selectedPatient.clinic} • DPJP Pengirim: {selectedPatient.doctorName} • Penjamin: <strong className="text-emerald-700">{selectedPatient.guarantee}</strong>
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
                                    setIndikasiKlinis(`Observasi klinis untuk ${found.name} - keluhan: ${found.chiefComplaint}`);
                                }
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-purple-600 focus:outline-none"
                        >
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.queueNo} - {p.name} ({p.clinic})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Layout Grid: Catalog vs Order Summary */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Catalog (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <FlaskConical className="h-4 w-4 text-purple-600" />
                                <h3 className="text-sm font-black text-slate-900">
                                    Katalog Pemeriksaan Penunjang (Lab & Radiologi)
                                </h3>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setFilterType("ALL")}
                                    className={cn(
                                        "rounded-xl px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors",
                                        filterType === "ALL" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    Semua
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterType("LAB")}
                                    className={cn(
                                        "rounded-xl px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors",
                                        filterType === "LAB" ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                                    )}
                                >
                                    🧪 Laboratorium
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterType("RAD")}
                                    className={cn(
                                        "rounded-xl px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors",
                                        filterType === "RAD" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                    )}
                                >
                                    🩻 Radiologi
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {filteredCatalog.map((item) => {
                                const isChecked = orderedItems.some(o => o.id === item.id);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleToggleItem(item)}
                                        className={cn(
                                            "flex items-start justify-between rounded-2xl border p-3.5 cursor-pointer transition-all select-none",
                                            isChecked
                                                ? "border-purple-500 bg-purple-50/60 shadow-2xs"
                                                : "border-slate-200/80 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className={cn(
                                                    "rounded-md px-1.5 py-0.2 text-[9px] font-black uppercase",
                                                    item.type === "LAB" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                                                )}>
                                                    {item.type}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-semibold">{item.kategori}</span>
                                            </div>
                                            <h4 className="text-xs font-black text-slate-900 leading-snug">{item.namaPemeriksaan}</h4>
                                            <p className="text-[11px] font-bold text-slate-500">
                                                Rp {item.tarif.toLocaleString("id-ID")}
                                            </p>
                                        </div>

                                        <div className={cn(
                                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border mt-1",
                                            isChecked ? "bg-purple-600 border-purple-600 text-white" : "border-slate-300 bg-white"
                                        )}>
                                            {isChecked && <CheckCircle2 className="h-3.5 w-3.5" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Form Indikasi & Order Submission (1 col) */}
                <div className="space-y-4">
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4 sticky top-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-black text-slate-900">
                                Ringkasan Order ({orderedItems.length} Pemeriksaan)
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsCitoGlobal(!isCitoGlobal)}
                                className={cn(
                                    "flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-extrabold cursor-pointer border transition-all",
                                    isCitoGlobal
                                        ? "bg-rose-600 text-white border-rose-600 animate-pulse"
                                        : "bg-slate-100 text-slate-600 border-slate-200"
                                )}
                            >
                                <span>CITO (Segera)</span>
                            </button>
                        </div>

                        {/* Indikasi Klinis */}
                        <div className="space-y-1 text-xs">
                            <label className="block font-bold text-slate-700">Indikasi Klinis / Catatan Dokter</label>
                            <textarea
                                rows={3}
                                value={indikasiKlinis}
                                onChange={(e) => setIndikasiKlinis(e.target.value)}
                                placeholder="Indikasi klinis, kecurigaan diagnosa, lokasi nyeri..."
                                className="w-full rounded-2xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                            />
                        </div>

                        {/* Ordered Items List */}
                        <div className="space-y-2 text-xs">
                            <span className="font-bold text-slate-500 block text-[11px]">Daftar Pemeriksaan Terpilih:</span>
                            {orderedItems.length === 0 ? (
                                <p className="text-slate-400 italic text-[11px]">Belum ada item pemeriksaan dipilih.</p>
                            ) : (
                                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                    {orderedItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-2 border border-slate-100">
                                            <div className="truncate mr-2">
                                                <div className="font-bold text-slate-800 truncate text-[11px]">{item.namaPemeriksaan}</div>
                                                <div className="text-[10px] text-slate-400">Rp {item.tarif.toLocaleString("id-ID")}</div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleItem(item)}
                                                className="text-slate-400 hover:text-rose-600 p-1"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Estimated Total Tarif */}
                        <div className="rounded-2xl bg-purple-50 p-3.5 border border-purple-100 space-y-0.5">
                            <span className="text-[10px] font-bold uppercase text-purple-700">Estimasi Total Tarif Penunjang:</span>
                            <p className="text-lg font-black text-purple-950">Rp {totalTarif.toLocaleString("id-ID")}</p>
                            <span className="text-[10px] text-purple-700 font-semibold">Ditanggung oleh {selectedPatient.guarantee}</span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSendOrder}
                            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3 text-xs font-black text-white shadow-md shadow-purple-500/20 hover:bg-purple-700 transition-all cursor-pointer"
                        >
                            <Send className="h-4 w-4" />
                            <span>Kirim Permintaan Penunjang (SPK)</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
