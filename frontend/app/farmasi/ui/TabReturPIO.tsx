import React from "react";
import { PillBottle } from "lucide-react";
import type { FarmasiTab } from "../farmasi";

interface TabReturPIOProps {
    activeTab: FarmasiTab;
}

export function TabReturPIO({ activeTab }: TabReturPIOProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs text-center space-y-4">
            <PillBottle className="h-12 w-12 text-blue-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">
                Modul {activeTab === "retur" ? "Retur Obat & Penanganan ED" : "PIO & Pelayanan Informasi Obat"} SIMRS
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
                Modul operasional depo terintegrasi penuh ke master data katalog obat dan sistem antrean farmasi.
            </p>
        </div>
    );
}
