import { useState } from "react";
import { useSearchParams } from "react-router";
import {
    Receipt,
    Wallet,
    Clock,
    Banknote,
    Scale,
    Calendar,
    Search,
    Printer,
    CheckCircle2,
    Sparkles,
    CreditCard,
    DollarSign,
    FileSpreadsheet
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

export type KasirTab =
    | "pembayaran"
    | "deposit"
    | "buka-tutup"
    | "bendahara"
    | "akuntansi";

interface TagihanItem {
    id: string;
    noNota: string;
    pasien: string;
    norm: string;
    layanan: string;
    penjamin: "BPJS" | "Umum" | "Asuransi";
    totalBiaya: number;
    status: "Belum Bayar" | "Lunas" | "Deposit";
    tanggal: string;
}

const MOCK_TAGIHAN: TagihanItem[] = [
    { id: "1", noNota: "KW-2026-0912", pasien: "Budi Santoso", norm: "RM-2026-0041", layanan: "Rawat Jalan - Poli Umum", penjamin: "BPJS", totalBiaya: 150000, status: "Lunas", tanggal: "05 Okt 2026" },
    { id: "2", noNota: "KW-2026-0913", pasien: "Siti Rahma", norm: "RM-2026-0042", layanan: "Rawat Jalan - Poli Anak", penjamin: "Umum", totalBiaya: 285000, status: "Belum Bayar", tanggal: "05 Okt 2026" },
    { id: "3", noNota: "KW-2026-0914", pasien: "Ahmad Fauzi", norm: "RM-2026-0044", layanan: "Rawat Inap - Kamar Melati 01", penjamin: "Umum", totalBiaya: 1450000, status: "Deposit", tanggal: "05 Okt 2026" },
];

export default function KasirPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") || "pembayaran") as KasirTab;

    const setTab = (tab: string) => {
        if (tab === "pembayaran") setSearchParams({});
        else setSearchParams({ tab });
    };

    const [selectedTagihan, setSelectedTagihan] = useState<TagihanItem | null>(MOCK_TAGIHAN[1]);
    const [metodeBayar, setMetodeBayar] = useState<"Tunai" | "QRIS" | "EDC / Debit">("Tunai");

    const handleProsesBayar = () => {
        if (!selectedTagihan) return;
        alert(`Pembayaran kuitansi ${selectedTagihan.noNota} atas nama ${selectedTagihan.pasien} sebesar Rp ${selectedTagihan.totalBiaya.toLocaleString("id-ID")} dengan metode ${metodeBayar} BERHASIL LUNAS!`);
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Kasir & Billing Pembayaran
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                <Receipt className="h-3.5 w-3.5" /> Billing Kasir SIMRS
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Penerimaan Kasir, Billing Pasien Rawat Jalan / Inap, Deposit Pasien, & Jurnal Akuntansi.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        <span>05 Oktober 2026</span>
                    </div>
                </div>

                {/* Sub-menu Tabs */}
                <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200/60 shadow-inner overflow-x-auto scrollbar-none">
                    {[
                        { id: "pembayaran", label: "Pembayaran & Billing Kasir", icon: Receipt },
                        { id: "deposit", label: "Deposit Pasien", icon: Wallet },
                        { id: "buka-tutup", label: "Buka / Tutup Kasir", icon: Clock },
                        { id: "bendahara", label: "Bendahara & Penerimaan Kas", icon: Banknote },
                        { id: "akuntansi", label: "Jurnal & Akuntansi", icon: Scale },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = activeTab === tab.id || (activeTab === ("" as any) && tab.id === "pembayaran");
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                                    isSelected
                                        ? "bg-white text-emerald-700 shadow-sm font-bold"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* TAB 1: PEMBAYARAN & BILLING KASIR */}
                {(activeTab === "pembayaran" || !searchParams.get("tab")) && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                                    Daftar Tagihan Pasien Hari Ini
                                </h3>

                                <div className="space-y-3">
                                    {MOCK_TAGIHAN.map((t) => (
                                        <div key={t.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-blue-600">{t.noNota}</span>
                                                    <span className={cn(
                                                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                                        t.status === "Lunas" ? "bg-emerald-50 text-emerald-700" :
                                                        t.status === "Deposit" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                                                    )}>
                                                        {t.status}
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-900 mt-1">{t.pasien} ({t.norm})</h4>
                                                <p className="text-xs text-slate-500">{t.layanan} • Penjamin: {t.penjamin}</p>
                                                <p className="text-xs font-extrabold text-emerald-600 mt-1">
                                                    Rp {t.totalBiaya.toLocaleString("id-ID")}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => setSelectedTagihan(t)}
                                                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-500 cursor-pointer"
                                            >
                                                {t.status === "Lunas" ? "Lihat Kuitansi" : "Bayar Kasir"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Billing Checkout Panel */}
                        <div className="space-y-4">
                            {selectedTagihan ? (
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Rincian Billing Pembayaran</h4>
                                        <button onClick={() => alert(`Mencetak Kuitansi ${selectedTagihan.noNota}`)} className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                            <Printer className="h-3.5 w-3.5" /> Cetak
                                        </button>
                                    </div>

                                    <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p><span className="text-slate-400">Nota:</span> <strong className="font-mono">{selectedTagihan.noNota}</strong></p>
                                        <p><span className="text-slate-400">Pasien:</span> <strong>{selectedTagihan.pasien}</strong></p>
                                        <p><span className="text-slate-400">Poli / Unit:</span> <strong>{selectedTagihan.layanan}</strong></p>
                                        <p><span className="text-slate-400">Penjamin:</span> <strong>{selectedTagihan.penjamin}</strong></p>
                                    </div>

                                    <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                                        <label className="block font-bold text-slate-700">Metode Pembayaran</label>
                                        <div className="grid grid-cols-3 gap-1.5">
                                            {(["Tunai", "QRIS", "EDC / Debit"] as const).map((m) => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    onClick={() => setMetodeBayar(m)}
                                                    className={cn(
                                                        "rounded-xl border py-2 text-[11px] font-bold transition-all cursor-pointer",
                                                        metodeBayar === m ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200"
                                                    )}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-semibold">Total Tagihan:</span>
                                        <span className="text-lg font-black text-emerald-600">Rp {selectedTagihan.totalBiaya.toLocaleString("id-ID")}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleProsesBayar}
                                        className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-all cursor-pointer"
                                    >
                                        Proses Bayar & Cetak Kuitansi
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* TAB 2, 3, 4, 5 OTHER VIEWS */}
                {activeTab !== "pembayaran" && searchParams.get("tab") && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs text-center space-y-3">
                        <Receipt className="h-10 w-10 text-emerald-600 mx-auto" />
                        <h3 className="text-base font-bold text-slate-900">
                            Modul {activeTab === "deposit" ? "Deposit Pasien Rawat Inap" : activeTab === "buka-tutup" ? "Buka / Tutup Kasir Shift" : activeTab === "bendahara" ? "Bendahara & Penerimaan Kas" : "Jurnal & Buku Besar Akuntansi"} SIMRS
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Fitur billing kasir dan keuangan rumah sakit terhubung ke jurnal akuntansi umum.
                        </p>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
