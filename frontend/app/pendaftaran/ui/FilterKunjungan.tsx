import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, Search } from "lucide-react";

export interface FilterValues {
    id_kunjungan: string;
    no_rekam_medis: string;
    nama_rekam_medis: string;
    tanggal_awal: string;
    tanggal_akhir: string;
    dokter: string;
}

const emptyFilter: FilterValues = {
    id_kunjungan: "",
    no_rekam_medis: "",
    nama_rekam_medis: "",
    tanggal_awal: "",
    tanggal_akhir: "",
    dokter: "",
};

interface FilterKunjunganProps {
    onSearch: (filter: FilterValues) => void;
    onReset: () => void;
}

export default function FilterKunjungan({ onSearch, onReset }: FilterKunjunganProps) {
    const [open, setOpen] = useState(true);
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [filter, setFilter] = useState<FilterValues>({ ...emptyFilter });

    function set<K extends keyof FilterValues>(key: K, value: string) {
        setFilter((f) => ({ ...f, [key]: value }));
    }

    function handleReset() {
        setFilter({ ...emptyFilter });
        onReset();
    }

    function handleSearch() {
        onSearch(filter);
    }

    const inputClass =
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors";

    const labelClass = "block text-xs font-medium text-slate-600 mb-1";

    return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    {open ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                    <span>Filter Kunjungan Rawat Jalan</span>
                </div>
            </button>

            {/* Body */}
            {open && (
                <div className="border-t border-slate-200 px-4 py-4 space-y-4">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className={labelClass}>ID Kunjungan</label>
                            <input
                                className={inputClass}
                                value={filter.id_kunjungan}
                                onChange={(e) => set("id_kunjungan", e.target.value)}
                                placeholder="ID Kunjungan"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>No. Rekam Medis</label>
                            <input
                                className={inputClass}
                                value={filter.no_rekam_medis}
                                onChange={(e) => set("no_rekam_medis", e.target.value)}
                                placeholder="No. Rekam Medis"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Nama Rekam Medis</label>
                            <input
                                className={inputClass}
                                value={filter.nama_rekam_medis}
                                onChange={(e) => set("nama_rekam_medis", e.target.value)}
                                placeholder="Nama Rekam Medis"
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className={labelClass}>Tanggal Awal</label>
                            <input
                                type="date"
                                className={inputClass}
                                value={filter.tanggal_awal}
                                onChange={(e) => set("tanggal_awal", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Tanggal Akhir</label>
                            <input
                                type="date"
                                className={inputClass}
                                value={filter.tanggal_akhir}
                                onChange={(e) => set("tanggal_akhir", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Dokter</label>
                            <input
                                className={inputClass}
                                value={filter.dokter}
                                onChange={(e) => set("dokter", e.target.value)}
                                placeholder="Dokter"
                            />
                        </div>
                    </div>

                    {/* Show Advance Filter */}
                    <button
                        type="button"
                        onClick={() => setAdvancedOpen(!advancedOpen)}
                        className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline transition-colors"
                    >
                        {advancedOpen ? "Hide" : "Show"} Advance Filter
                    </button>

                    {advancedOpen && (
                        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3">
                            <p className="text-xs text-slate-400 italic">Filter lanjutan tersedia di sini.</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center gap-1.5 rounded-md border border-sky-500 bg-white px-4 py-2 text-sm font-semibold text-sky-600 hover:bg-sky-50 transition-colors"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="inline-flex items-center gap-1.5 rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 shadow-sm transition-colors"
                        >
                            <Search className="h-3.5 w-3.5" />
                            Cari
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
