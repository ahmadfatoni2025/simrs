import React, { useState } from "react";
import {
    ClipboardList,
    Clock,
    Package,
    CheckCircle2,
    Send,
    ShieldCheck,
    PillBottle,
    Search,
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    GripVertical
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { ResepItem } from "../farmasi";

interface TabDashboardFarmasiProps {
    resepList: ResepItem[];
    stokCountKritis: number;
    stokTotalCount: number;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    selectedDepo: string;
    setSelectedDepo: (d: string) => void;
    selectedStatus: string;
    setSelectedStatus: (s: string) => void;
    filteredResepList: ResepItem[];
    onOpenVerifikasi: (resep: ResepItem) => void;
    onUpdateResepStatus: (id: string, newStatus: ResepItem["status"], catatan?: string) => void;
}

const KANBAN_STAGES: { status: ResepItem["status"]; title: string; prevStatus?: ResepItem["status"]; nextStatus?: ResepItem["status"] }[] = [
    { status: "Masuk", title: "1. Resep Masuk", nextStatus: "Verifikasi" },
    { status: "Verifikasi", title: "2. Verifikasi Apoteker", prevStatus: "Masuk", nextStatus: "Diproses" },
    { status: "Diproses", title: "3. Sedang Disiapkan", prevStatus: "Verifikasi", nextStatus: "Siap Ambil" },
    { status: "Siap Ambil", title: "4. Siap / Diserahkan", prevStatus: "Diproses", nextStatus: "Selesai" }
];

export function TabDashboardFarmasi({
    resepList,
    stokCountKritis,
    stokTotalCount,
    searchQuery,
    setSearchQuery,
    selectedDepo,
    setSelectedDepo,
    selectedStatus,
    setSelectedStatus,
    filteredResepList,
    onOpenVerifikasi,
    onUpdateResepStatus
}: TabDashboardFarmasiProps) {
    const [draggedResepId, setDraggedResepId] = useState<string | null>(null);
    const [dragOverStage, setDragOverStage] = useState<ResepItem["status"] | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("text/plain", id);
        e.dataTransfer.effectAllowed = "move";
        setDraggedResepId(id);
    };

    const handleDragOver = (e: React.DragEvent, stageStatus: ResepItem["status"]) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragOverStage !== stageStatus) {
            setDragOverStage(stageStatus);
        }
    };

    const handleDragLeave = (e: React.DragEvent, stageStatus: ResepItem["status"]) => {
        e.preventDefault();
        if (dragOverStage === stageStatus) {
            setDragOverStage(null);
        }
    };

    const handleDrop = (e: React.DragEvent, targetStatus: ResepItem["status"]) => {
        e.preventDefault();
        setDragOverStage(null);
        const resepId = e.dataTransfer.getData("text/plain") || draggedResepId;
        if (resepId) {
            onUpdateResepStatus(resepId, targetStatus);
            setDraggedResepId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Statistik Bar 4 Kartu */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-2xs transition-all hover:border-slate-300">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-semibold">Total Resep Masuk</span>
                        <ClipboardList className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-slate-900">{resepList.length} <span className="text-xs font-normal text-slate-500">Resep</span></p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Synchronized with Poliklinik
                    </div>
                </div>

                <div className="rounded-2xl border border-amber-200/60 bg-amber-50/30 p-5 shadow-2xs transition-all hover:border-amber-300">
                    <div className="flex items-center justify-between text-amber-700">
                        <span className="text-xs font-semibold">Menunggu Verifikasi</span>
                        <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-amber-700">
                        {resepList.filter(r => r.status === "Masuk" || r.status === "Verifikasi").length} <span className="text-xs font-normal text-amber-600">Resep</span>
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-amber-700">
                        <ShieldCheck className="h-3.5 w-3.5" /> Perlu validasi Apoteker
                    </div>
                </div>

                <div className="rounded-2xl border border-blue-200/60 bg-blue-50/30 p-5 shadow-2xs transition-all hover:border-blue-300">
                    <div className="flex items-center justify-between text-blue-700">
                        <span className="text-xs font-semibold">Sedang Disiapkan</span>
                        <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-blue-700">
                        {resepList.filter(r => r.status === "Diproses").length} <span className="text-xs font-normal text-blue-600">Resep</span>
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-blue-600">
                        <PillBottle className="h-3.5 w-3.5" /> Penyiapan TTK / Etiket
                    </div>
                </div>

                <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/30 p-5 shadow-2xs transition-all hover:border-emerald-300">
                    <div className="flex items-center justify-between text-emerald-700">
                        <span className="text-xs font-semibold">Selesai / Diserahkan</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="mt-2 text-2xl font-black text-emerald-700">
                        {resepList.filter(r => r.status === "Selesai" || r.status === "Siap Ambil").length} <span className="text-xs font-normal text-emerald-600">Resep</span>
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                        <Send className="h-3.5 w-3.5" /> Siap di Loket Pengambilan
                    </div>
                </div>
            </div>

            {/* Filter Toolbar & Drag-and-Drop Instruction */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari Pasien, No. RM, No. Resep..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                        <GripVertical className="h-3.5 w-3.5" /> Drag & Drop / Panah Alur Aktif
                    </span>

                    <select
                        value={selectedDepo}
                        onChange={(e) => setSelectedDepo(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:outline-none"
                    >
                        <option value="Semua Depo">Semua Depo Unit</option>
                        <option value="Depo Rawat Jalan">Depo Rawat Jalan</option>
                        <option value="Depo Rawat Inap">Depo Rawat Inap</option>
                        <option value="Depo IGD">Depo IGD</option>
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:outline-none"
                    >
                        <option value="Semua Status">Semua Status Workflow</option>
                        <option value="Masuk">1. Resep Masuk</option>
                        <option value="Verifikasi">2. Verifikasi Apoteker</option>
                        <option value="Diproses">3. Sedang Disiapkan</option>
                        <option value="Siap Ambil">4. Siap Penyerahan</option>
                        <option value="Selesai">5. Selesai (Diserahkan)</option>
                    </select>
                </div>
            </div>

            {/* Interactive Drag & Drop Kanban 4 Kolom */}
            <div className="grid gap-4 md:grid-cols-4">
                {KANBAN_STAGES.map((stage) => {
                    const itemsInStage = filteredResepList.filter(r =>
                        stage.status === "Siap Ambil"
                            ? (r.status === "Siap Ambil" || r.status === "Selesai")
                            : r.status === stage.status
                    );

                    const isOver = dragOverStage === stage.status;

                    return (
                        <div
                            key={stage.status}
                            onDragOver={(e) => handleDragOver(e, stage.status)}
                            onDragLeave={(e) => handleDragLeave(e, stage.status)}
                            onDrop={(e) => handleDrop(e, stage.status)}
                            className={cn(
                                "space-y-3 rounded-2xl border p-3.5 transition-all min-h-[380px]",
                                isOver
                                    ? "border-blue-500 bg-blue-100/70 ring-2 ring-blue-400 scale-[1.01]"
                                    : stage.status === "Masuk"
                                        ? "border-slate-200/80 bg-slate-100/60"
                                        : stage.status === "Verifikasi"
                                            ? "border-blue-200/80 bg-blue-50/30"
                                            : stage.status === "Diproses"
                                                ? "border-amber-200/80 bg-amber-50/30"
                                                : "border-emerald-200/80 bg-emerald-50/30"
                            )}
                        >
                            <div className="flex items-center justify-between px-1 border-b border-slate-200/60 pb-2">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "h-2.5 w-2.5 rounded-full",
                                        stage.status === "Masuk" ? "bg-slate-500" :
                                            stage.status === "Verifikasi" ? "bg-blue-600" :
                                                stage.status === "Diproses" ? "bg-amber-500" : "bg-emerald-600"
                                    )} />
                                    <h3 className="text-xs font-bold text-slate-900">{stage.title}</h3>
                                </div>
                                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-extrabold text-slate-800">
                                    {itemsInStage.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {itemsInStage.map((resep) => (
                                    <div
                                        key={resep.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, resep.id)}
                                        onDragEnd={() => { setDraggedResepId(null); setDragOverStage(null); }}
                                        className={cn(
                                            "rounded-xl border bg-white p-3.5 shadow-2xs transition-all space-y-2.5 cursor-grab active:cursor-grabbing hover:shadow-md",
                                            draggedResepId === resep.id ? "opacity-50 border-blue-400 border-dashed" : "border-slate-200/80"
                                        )}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-1.5">
                                                <GripVertical className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500" />
                                                <span className="font-mono text-[11px] font-black text-blue-600">{resep.noResep}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-medium">{resep.waktu}</span>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">{resep.namaPasien} ({resep.norm})</h4>
                                            <p className="text-[11px] text-slate-500">{resep.dokter} • {resep.poli}</p>
                                            <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">{resep.penjamin}</span>
                                        </div>

                                        {resep.alergiPasien && resep.alergiPasien.length > 0 && (
                                            <div className="rounded-lg bg-rose-500 px-2.5 py-1 text-[10px] font-bold text-white flex items-center gap-1">
                                                <AlertTriangle className="h-3 w-3" /> Alergi: {resep.alergiPasien.join(", ")}
                                            </div>
                                        )}

                                        {/* Action controls (Maju / Mundur Alur) */}
                                        <div className="border-t border-slate-100 pt-2 flex items-center justify-between gap-1 text-[11px]">
                                            {/* Button Mundur */}
                                            {stage.prevStatus ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onUpdateResepStatus(resep.id, stage.prevStatus!)}
                                                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                                                    title={`Mundur ke alur: ${stage.prevStatus}`}
                                                >
                                                    <ArrowLeft className="h-3 w-3" /> Mundur
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 italic">Awal</span>
                                            )}

                                            <span className="font-semibold text-slate-500 text-[10px]">{resep.daftarObat.length} Item</span>

                                            {/* Button Maju / Action */}
                                            {stage.nextStatus ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (stage.status === "Masuk") {
                                                            onOpenVerifikasi(resep);
                                                        } else {
                                                            onUpdateResepStatus(resep.id, stage.nextStatus!);
                                                        }
                                                    }}
                                                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs hover:bg-blue-500 cursor-pointer transition-colors"
                                                    title={`Maju ke alur: ${stage.nextStatus}`}
                                                >
                                                    <span>Maju</span> <ArrowRight className="h-3 w-3" />
                                                </button>
                                            ) : (
                                                resep.status === "Siap Ambil" ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => onUpdateResepStatus(resep.id, "Selesai")}
                                                        className="rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-500 cursor-pointer"
                                                    >
                                                        Selesai
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Diserahkan</span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {itemsInStage.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400 italic">
                                        Geser resep ke sini (Drop Area)
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
