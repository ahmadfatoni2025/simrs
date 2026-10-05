import { useState } from "react";
import { useSearchParams } from "react-router";
import {
    Boxes,
    Truck,
    ClipboardList,
    ArrowLeftRight,
    FileSpreadsheet,
    Calendar,
    Search,
    Plus,
    CheckCircle2,
    Sparkles,
    Package
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

export type InventoryTab =
    | "stok"
    | "pemesanan"
    | "penerimaan"
    | "distribusi"
    | "opname";

export default function InventoryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") || "stok") as InventoryTab;

    const setTab = (tab: string) => {
        if (tab === "stok") setSearchParams({});
        else setSearchParams({ tab });
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Inventory & Logistik RS
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                                <Boxes className="h-3.5 w-3.5" /> Gudang Logistik Utama
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Manajemen Barang Medis & Umum, Pemesanan PO, Penerimaan SP, Distribusi Unit, & Stok Opname.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>05 Oktober 2026</span>
                    </div>
                </div>

                {/* Sub-menu Tabs */}
                <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200/60 shadow-inner overflow-x-auto scrollbar-none">
                    {[
                        { id: "stok", label: "Katalog & Stok Logistik", icon: Boxes },
                        { id: "pemesanan", label: "Pemesanan Barang (PO)", icon: Truck },
                        { id: "penerimaan", label: "Penerimaan & SP", icon: ClipboardList },
                        { id: "distribusi", label: "Permintaan & Distribusi", icon: ArrowLeftRight },
                        { id: "opname", label: "Stok Opname & Kartu Stok", icon: FileSpreadsheet },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = activeTab === tab.id || (activeTab === ("" as any) && tab.id === "stok");
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                                    isSelected
                                        ? "bg-white text-blue-700 shadow-sm font-bold"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* TAB CONTENT */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs text-center space-y-3">
                    <Boxes className="h-10 w-10 text-blue-600 mx-auto" />
                    <h3 className="text-base font-bold text-slate-900">
                        Modul Logistik SIMRS — {activeTab.toUpperCase()}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Sistem manajemen gudang logistik umum, Bahan Habis Pakai (BHP), dan distribusi ke poliklinik/rawat inap.
                    </p>
                </div>
            </div>
        </AppShell>
    );
}
