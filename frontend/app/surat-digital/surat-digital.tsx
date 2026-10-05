import { useState } from "react";
import { useSearchParams } from "react-router";
import {
    FileText,
    HeartPulse,
    CalendarClock,
    UserCheck,
    Calendar,
    Printer,
    Download,
    CheckCircle2,
    Sparkles,
    QrCode,
    Search
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

export type SuratTab =
    | "sakit"
    | "dirawat"
    | "kontrol"
    | "kematian"
    | "sehat";

export default function SuratDigitalPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") || "sakit") as SuratTab;

    const setTab = (tab: string) => {
        if (tab === "sakit") setSearchParams({});
        else setSearchParams({ tab });
    };

    const [namaPasien, setNamaPasien] = useState("Budi Santoso");
    const [norm, setNorm] = useState("RM-2026-0041");
    const [lamaIstirahat, setLamaIstirahat] = useState("3");
    const [tanggalMulai, setTanggalMulai] = useState("2026-10-05");
    const [dokter, setDokter] = useState("dr. Andi Prasetyo, Sp.PD");

    const handlePrintSurat = () => {
        alert(`Surat Digital atas nama ${namaPasien} (${norm}) telah berhasil terbit dengan QR Code Verifikasi SIMRS!`);
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Surat Digital Medis SIMRS
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                                <FileText className="h-3.5 w-3.5" /> E-Surat QR Verifikasi
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Penerbitan Surat Sakit, Surat Dirawat, Surat Rencana Kontrol, Surat Sehat & Sertifikat Medis.
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
                        { id: "sakit", label: "Surat Keterangan Sakit", icon: FileText },
                        { id: "dirawat", label: "Surat Keterangan Dirawat", icon: HeartPulse },
                        { id: "kontrol", label: "Surat Kontrol Rawat Inap/Poli", icon: CalendarClock },
                        { id: "kematian", label: "Surat Kematian", icon: FileText },
                        { id: "sehat", label: "Surat Keterangan Sehat", icon: UserCheck },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = activeTab === tab.id || (activeTab === ("" as any) && tab.id === "sakit");
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

                {/* TAB CONTENT: FORM SURAT DIGITAL */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                                Form Penerbitan {activeTab === "sakit" ? "Surat Keterangan Sakit" : activeTab === "dirawat" ? "Surat Keterangan Dirawat" : activeTab === "kontrol" ? "Surat Rencana Kontrol (SKDP)" : "Surat Keterangan Medis"}
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Nama Pasien</label>
                                        <input
                                            type="text"
                                            value={namaPasien}
                                            onChange={(e) => setNamaPasien(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">No. Rekam Medis</label>
                                        <input
                                            type="text"
                                            value={norm}
                                            onChange={(e) => setNorm(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Lama Istirahat (Hari)</label>
                                        <input
                                            type="number"
                                            value={lamaIstirahat}
                                            onChange={(e) => setLamaIstirahat(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Terhitung Mulai Tanggal</label>
                                        <input
                                            type="date"
                                            value={tanggalMulai}
                                            onChange={(e) => setTanggalMulai(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 p-2.5"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Dokter Penanggung Jawab (DPJP)</label>
                                    <input
                                        type="text"
                                        value={dokter}
                                        onChange={(e) => setDokter(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handlePrintSurat}
                                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-500 cursor-pointer"
                                >
                                    Terbitkan & Cetak Surat Digital
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4 text-center">
                            <h4 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-100 pb-2">Preview QR Code Verifikasi</h4>
                            <div className="flex h-32 w-32 mx-auto items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400">
                                <QrCode className="h-20 w-20 text-slate-800" />
                            </div>
                            <p className="text-[11px] text-slate-500">QR Code ini dapat dipindai oleh instansi/kantor untuk verifikasi keabsahan surat digital RS.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
