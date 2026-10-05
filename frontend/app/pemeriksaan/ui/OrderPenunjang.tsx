import { useState } from "react";
import {
    FlaskConical,
    FileText,
    CheckCircle2,
    Plus,
    Clock,
    Sparkles,
    Send,
    Activity,
    ShieldCheck
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { PatientRecord } from "../pemeriksaan";

interface OrderPenunjangProps {
    patients: PatientRecord[];
}

interface OrderItem {
    id: string;
    type: "LAB" | "RAD";
    namaPemeriksaan: string;
    kategori: string;
    isCito: boolean;
    tarif: number;
}

const MASTER_PENUNJANG: OrderItem[] = [
    { id: "p-1", type: "LAB", namaPemeriksaan: "Darah Lengkap (DL / CBC)", kategori: "Hematologi", isCito: false, tarif: 120000 },
    { id: "p-2", type: "LAB", namaPemeriksaan: "Gula Darah Sewaktu (GDS)", kategori: "Kimia Darah", isCito: false, tarif: 45000 },
    { id: "p-3", type: "LAB", namaPemeriksaan: "Fungsi Ginjal (Ureum / Kreatinin)", kategori: "Kimia Darah", isCito: false, tarif: 150000 },
    { id: "p-4", type: "LAB", namaPemeriksaan: "Fungsi Hati (SGOT / SGPT)", kategori: "Kimia Darah", isCito: false, tarif: 160000 },
    { id: "p-5", type: "RAD", namaPemeriksaan: "Rontgen Thorax PA", kategori: "Radiologi X-Ray", isCito: false, tarif: 220000 },
    { id: "p-6", type: "RAD", namaPemeriksaan: "USG Abdomen Whole", kategori: "Radiologi USG", isCito: false, tarif: 350000 },
    { id: "p-7", type: "RAD", namaPemeriksaan: "CT-Scan Kepala Non-Kontras", kategori: "CT-Scan", isCito: false, tarif: 1100000 },
];

export default function OrderPenunjang({ patients }: OrderPenunjangProps) {
    const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(patients[0] || {
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
    });

    const [selectedOrders, setSelectedOrders] = useState<OrderItem[]>([MASTER_PENUNJANG[0], MASTER_PENUNJANG[4]]);
    const [catatanKlinis, setCatatanKlinis] = useState("Evaluasi batuk lama dan kecurigaan efusi pleura.");

    const toggleOrder = (item: OrderItem) => {
        setSelectedOrders(prev =>
            prev.some(o => o.id === item.id) ? prev.filter(o => o.id !== item.id) : [...prev, item]
        );
    };

    const toggleCito = (id: string) => {
        setSelectedOrders(prev =>
            prev.map(o => o.id === id ? { ...o, isCito: !o.isCito } : o)
        );
    };

    const handleSendOrder = () => {
        alert(`Order Penunjang (${selectedOrders.length} Pemeriksaan) untuk pasien ${selectedPatient.name} (${selectedPatient.norm}) berhasil dikirim ke Unit Lab/Rad!`);
    };

    const totalTarif = selectedOrders.reduce((sum, item) => sum + item.tarif, 0);

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                        <FlaskConical className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Order Penunjang Medis (Laboratorium & Radiologi)
                        </h3>
                        <p className="text-xs text-slate-500">
                            Permintaan order pemeriksaan laboratorium & foto radiologi ke unit penunjang SIMRS.
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

            {/* Order Selection Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Catalog (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                            Katalog Pemeriksaan Penunjang Tersedia
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {MASTER_PENUNJANG.map((item) => {
                                const isChecked = selectedOrders.some(o => o.id === item.id);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleOrder(item)}
                                        className={cn(
                                            "flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all",
                                            isChecked
                                                ? "border-purple-500 bg-purple-50/60 ring-2 ring-purple-100 shadow-2xs"
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                        )}
                                    >
                                        <div>
                                            <span className={cn(
                                                "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase",
                                                item.type === "LAB" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                                            )}>
                                                {item.type} • {item.kategori}
                                            </span>
                                            <h5 className="text-xs font-bold text-slate-900 mt-1">{item.namaPemeriksaan}</h5>
                                            <p className="text-[11px] font-extrabold text-purple-600 mt-0.5">
                                                Rp {item.tarif.toLocaleString("id-ID")}
                                            </p>
                                        </div>

                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            readOnly
                                            className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                        <h4 className="text-sm font-bold text-slate-900">Catatan Indikasi Klinis Dokter</h4>
                        <textarea
                            rows={3}
                            value={catatanKlinis}
                            onChange={(e) => setCatatanKlinis(e.target.value)}
                            placeholder="Tuliskan indikasi klinis untuk analisis laboratorium / radiologi..."
                            className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-purple-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Right Sidebar: Selected Orders & Checkout */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h4 className="text-sm font-bold text-slate-900">Summary Order Penunjang</h4>
                            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                                {selectedOrders.length} Item
                            </span>
                        </div>

                        <div className="space-y-2.5">
                            {selectedOrders.map((o) => (
                                <div key={o.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-900 truncate">{o.namaPemeriksaan}</p>
                                        <p className="text-[10px] text-purple-600 font-bold">Rp {o.tarif.toLocaleString("id-ID")}</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => toggleCito(o.id)}
                                        className={cn(
                                            "rounded-md px-2 py-0.5 text-[10px] font-bold cursor-pointer transition-colors",
                                            o.isCito ? "bg-rose-600 text-white" : "bg-slate-200 text-slate-600 hover:bg-rose-100 hover:text-rose-700"
                                        )}
                                    >
                                        {o.isCito ? "CITO !" : "Biasa"}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                            <div className="flex justify-between text-slate-500">
                                <span>Estimasi Total Tarif:</span>
                                <strong className="text-slate-900 text-sm">Rp {totalTarif.toLocaleString("id-ID")}</strong>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSendOrder}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:bg-purple-500 transition-all cursor-pointer"
                        >
                            <Send className="h-4 w-4" /> Kirim Order Lab / Radiologi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
