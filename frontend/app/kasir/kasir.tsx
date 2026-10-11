import { useState, useEffect } from "react";
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
    FileSpreadsheet,
    AlertCircle,
    User,
    ArrowUpRight,
    ArrowDownLeft,
    ShieldCheck,
    Plus,
    X,
    Filter,
    PillBottle
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";
import {
    type TagihanBillingRS,
    type DepositPasienItem,
    type ShiftKasir,
    type JurnalAkuntansiItem,
    STORAGE_KEYS,
    SEED_BILLING_LIST,
    SEED_DEPOSIT_LIST,
    SEED_SHIFT_KASIR,
    SEED_JURNAL_LIST
} from "~/lib/hospital-finance-logistics";

export type KasirTab =
    | "pembayaran"
    | "deposit"
    | "buka-tutup"
    | "bendahara"
    | "akuntansi";

export default function KasirPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") || "pembayaran") as KasirTab;

    const setTab = (tab: string) => {
        if (tab === "pembayaran") setSearchParams({});
        else setSearchParams({ tab });
    };

    // State Billing Tagihan
    const [tagihanList, setTagihanList] = useState<TagihanBillingRS[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(STORAGE_KEYS.BILLING_LIST);
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { /* ignore */ }
            }
        }
        return SEED_BILLING_LIST;
    });

    // State Deposit
    const [depositList, setDepositList] = useState<DepositPasienItem[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(STORAGE_KEYS.DEPOSIT_LIST);
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { /* ignore */ }
            }
        }
        return SEED_DEPOSIT_LIST;
    });

    // State Shift Kasir
    const [shiftKasir, setShiftKasir] = useState<ShiftKasir>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(STORAGE_KEYS.SHIFT_KASIR);
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { /* ignore */ }
            }
        }
        return SEED_SHIFT_KASIR;
    });

    // State Jurnal Akuntansi
    const [jurnalList, setJurnalList] = useState<JurnalAkuntansiItem[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(STORAGE_KEYS.JURNAL_LIST);
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { /* ignore */ }
            }
        }
        return SEED_JURNAL_LIST;
    });

    // Persistent storage
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEYS.BILLING_LIST, JSON.stringify(tagihanList));
        }
    }, [tagihanList]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEYS.DEPOSIT_LIST, JSON.stringify(depositList));
        }
    }, [depositList]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEYS.SHIFT_KASIR, JSON.stringify(shiftKasir));
        }
    }, [shiftKasir]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEYS.JURNAL_LIST, JSON.stringify(jurnalList));
        }
    }, [jurnalList]);

    const [selectedTagihan, setSelectedTagihan] = useState<TagihanBillingRS | null>(tagihanList[1] || tagihanList[0]);
    const [metodeBayar, setMetodeBayar] = useState<"Tunai" | "QRIS" | "EDC / Debit" | "Virtual Account" | "BPJS Direct">("Tunai");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPenjamin, setFilterPenjamin] = useState<string>("Semua");
    const [filterStatus, setFilterStatus] = useState<string>("Semua");

    // Modal Tambah Deposit Baru
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [depositForm, setDepositForm] = useState({ norm: "", pasien: "", nominal: 1000000, keterangan: "Uang muka perawatan rawat inap" });

    // Print Receipt State
    const [isPrintingModal, setIsPrintingModal] = useState(false);

    // Filtered Billing
    const filteredTagihan = tagihanList.filter(t => {
        const matchesSearch =
            t.pasien.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.norm.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.noBilling.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPenjamin = filterPenjamin === "Semua" || t.penjamin === filterPenjamin;
        const matchesStatus = filterStatus === "Semua" || t.status === filterStatus;
        return matchesSearch && matchesPenjamin && matchesStatus;
    });

    // Proses Bayar Kasir
    const handleProsesBayar = () => {
        if (!selectedTagihan) return;

        const nominalBayar = selectedTagihan.sisaTagihan;
        const updatedBilling: TagihanBillingRS = {
            ...selectedTagihan,
            status: "Lunas",
            totalSudahBayar: selectedTagihan.totalBiaya,
            sisaTagihan: 0,
            metodePembayaran: metodeBayar,
            kasirPetugas: shiftKasir.namaKasir,
            jam: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
        };

        // Update list
        setTagihanList(prev => prev.map(item => item.id === selectedTagihan.id ? updatedBilling : item));
        setSelectedTagihan(updatedBilling);

        // Update Kas Kasir Shift
        if (shiftKasir.status === "Buka") {
            setShiftKasir(prev => ({
                ...prev,
                totalTunaiMasuk: metodeBayar === "Tunai" ? prev.totalTunaiMasuk + nominalBayar : prev.totalTunaiMasuk,
                totalNonTunai: metodeBayar !== "Tunai" ? prev.totalNonTunai + nominalBayar : prev.totalNonTunai,
                totalTransaksi: prev.totalTransaksi + 1
            }));
        }

        // Post ke Jurnal Akuntansi otomatis
        const newJurnal: JurnalAkuntansiItem = {
            id: `jr-${Date.now()}`,
            noJurnal: `JU-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
            tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
            referensi: updatedBilling.noNota || updatedBilling.noBilling,
            keterangan: `Pelunasan Kasir ${updatedBilling.pasien} (${updatedBilling.norm}) - ${updatedBilling.layanan}`,
            debitAkun: metodeBayar === "Tunai" ? "1-10100 Kas Kasir Loket 1" : "1-10120 Bank Operasional RS",
            kreditAkun: "4-10100 Pendapatan Pelayanan Medis & Farmasi RS",
            nominal: nominalBayar,
            sumber: "Kasir Billing"
        };
        setJurnalList(prev => [newJurnal, ...prev]);

        setIsPrintingModal(true);
    };

    // Bayar Memotong Saldo Deposit
    const handleBayarDenganDeposit = () => {
        if (!selectedTagihan) return;
        const depPasien = depositList.find(d => d.norm === selectedTagihan.norm);
        if (!depPasien || depPasien.saldoDeposit <= 0) {
            alert("Pasien tidak memiliki saldo deposit yang mencukupi!");
            return;
        }

        const potongNominal = Math.min(selectedTagihan.sisaTagihan, depPasien.saldoDeposit);
        const sisaTagihanBaru = selectedTagihan.sisaTagihan - potongNominal;

        const updatedBilling: TagihanBillingRS = {
            ...selectedTagihan,
            totalSudahBayar: (selectedTagihan.totalSudahBayar || 0) + potongNominal,
            sisaTagihan: sisaTagihanBaru,
            depositTerpakai: (selectedTagihan.depositTerpakai || 0) + potongNominal,
            status: sisaTagihanBaru === 0 ? "Lunas" : "Deposit",
            metodePembayaran: "Tunai"
        };

        setTagihanList(prev => prev.map(t => t.id === selectedTagihan.id ? updatedBilling : t));
        setSelectedTagihan(updatedBilling);

        // Potong saldo di modul deposit
        setDepositList(prev => prev.map(d => {
            if (d.norm === selectedTagihan.norm) {
                return {
                    ...d,
                    saldoDeposit: d.saldoDeposit - potongNominal,
                    riwayatDeposit: [
                        {
                            id: `rd-${Date.now()}`,
                            tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) + " " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                            nominal: potongNominal,
                            tipe: "Dipakai Billing",
                            keterangan: `Potong tagihan ${selectedTagihan.noBilling}`,
                            petugas: shiftKasir.namaKasir
                        },
                        ...d.riwayatDeposit
                    ]
                };
            }
            return d;
        }));

        alert(`Saldo deposit sebesar Rp ${potongNominal.toLocaleString("id-ID")} berhasil dipotong untuk tagihan ${selectedTagihan.noBilling}!`);
    };

    const handleSaveDepositBaru = (e: React.FormEvent) => {
        e.preventDefault();
        const existing = depositList.find(d => d.norm === depositForm.norm);
        if (existing) {
            setDepositList(prev => prev.map(d => {
                if (d.norm === depositForm.norm) {
                    return {
                        ...d,
                        saldoDeposit: d.saldoDeposit + Number(depositForm.nominal),
                        riwayatDeposit: [
                            {
                                id: `rd-${Date.now()}`,
                                tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) + " " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                                nominal: Number(depositForm.nominal),
                                tipe: "Masuk",
                                keterangan: depositForm.keterangan,
                                petugas: shiftKasir.namaKasir
                            },
                            ...d.riwayatDeposit
                        ]
                    };
                }
                return d;
            }));
        } else {
            const newItem: DepositPasienItem = {
                id: `dep-${Date.now()}`,
                norm: depositForm.norm,
                pasien: depositForm.pasien,
                ruangan: "Rawat Inap",
                saldoDeposit: Number(depositForm.nominal),
                riwayatDeposit: [
                    {
                        id: `rd-${Date.now()}`,
                        tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) + " " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                        nominal: Number(depositForm.nominal),
                        tipe: "Masuk",
                        keterangan: depositForm.keterangan,
                        petugas: shiftKasir.namaKasir
                    }
                ]
            };
            setDepositList(prev => [newItem, ...prev]);
        }
        setIsDepositModalOpen(false);
        alert(`Deposit atas nama ${depositForm.pasien} sebesar Rp ${Number(depositForm.nominal).toLocaleString("id-ID")} berhasil dicatat!`);
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white shadow-lg">
                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                                    <Receipt className="h-3.5 w-3.5" /> Billing Kasir & Keuangan Terintegrasi
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-bold text-emerald-200 border border-emerald-300/30">
                                    <Sparkles className="h-3 w-3" /> Live Farmasi & Poli Sync
                                </span>
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                Kasir & Billing Pasien Rumah Sakit
                            </h1>
                            <p className="max-w-2xl text-xs text-emerald-100 sm:text-sm">
                                Pembayaran kasir rawat jalan, IGD & rawat inap, sinkronisasi obat farmasi otomatis, manajemen deposit pasien, buka/tutup kasir, dan jurnal akuntansi buku besar.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-xs font-semibold backdrop-blur-md border border-white/20">
                                <Clock className="h-4 w-4 text-emerald-200" />
                                <span>Shift Kasir: {shiftKasir.status === "Buka" ? "AKTIF" : "TUTUP"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200/80 pb-2 text-xs font-semibold">
                    {[
                        { id: "pembayaran", label: "Pembayaran & Billing Kasir", icon: Receipt },
                        { id: "deposit", label: "Deposit Pasien Rawat Inap", icon: Wallet },
                        { id: "buka-tutup", label: "Buka / Tutup Kasir Shift", icon: Clock },
                        { id: "bendahara", label: "Bendahara & Penerimaan Kas", icon: Banknote },
                        { id: "akuntansi", label: "Jurnal & Buku Besar Akuntansi", icon: Scale },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = activeTab === tab.id || (!searchParams.get("tab") && tab.id === "pembayaran");
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer",
                                    isSelected
                                        ? "bg-emerald-600 text-white shadow-xs font-bold"
                                        : "text-slate-600 hover:bg-slate-100"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                                {tab.id === "pembayaran" && (
                                    <span className={cn(
                                        "ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-black",
                                        isSelected ? "bg-white text-emerald-700" : "bg-amber-100 text-amber-800"
                                    )}>
                                        {tagihanList.filter(t => t.status === "Belum Bayar").length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* TAB 1: PEMBAYARAN & BILLING KASIR */}
                {(activeTab === "pembayaran" || !searchParams.get("tab")) && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Left: Tagihan Pasien List */}
                        <div className="lg:col-span-7 space-y-4">
                            {/* Filter bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari pasien, no RM, no billing..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={filterPenjamin}
                                        onChange={(e) => setFilterPenjamin(e.target.value)}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-600 focus:outline-none"
                                    >
                                        <option value="Semua">Semua Penjamin</option>
                                        <option value="BPJS Kesehatan">BPJS</option>
                                        <option value="Umum">Umum</option>
                                        <option value="Asuransi Swasta">Asuransi</option>
                                    </select>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-600 focus:outline-none"
                                    >
                                        <option value="Semua">Semua Status</option>
                                        <option value="Belum Bayar">Belum Bayar</option>
                                        <option value="Lunas">Lunas</option>
                                        <option value="Deposit">Deposit</option>
                                    </select>
                                </div>
                            </div>

                            {/* Daftar Tagihan */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Antrean Tagihan & Billing Kasir ({filteredTagihan.length})
                                    </h3>
                                    <span className="text-xs text-slate-500 font-medium">Terintegrasi E-Prescribing Farmasi</span>
                                </div>

                                <div className="space-y-2.5">
                                    {filteredTagihan.length === 0 ? (
                                        <div className="py-8 text-center text-xs text-slate-400">
                                            Tidak ada data tagihan yang sesuai kriteria pencarian.
                                        </div>
                                    ) : (
                                        filteredTagihan.map((t) => {
                                            const isSelected = selectedTagihan?.id === t.id;
                                            return (
                                                <div
                                                    key={t.id}
                                                    onClick={() => setSelectedTagihan(t)}
                                                    className={cn(
                                                        "group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl p-4 border transition-all cursor-pointer gap-3",
                                                        isSelected
                                                            ? "border-emerald-500 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/30"
                                                            : "border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200"
                                                    )}
                                                >
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-mono text-xs font-bold text-emerald-700">{t.noBilling}</span>
                                                            {t.noResepRef && (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                                                                    <PillBottle className="h-3 w-3" /> Resep: {t.noResepRef}
                                                                </span>
                                                            )}
                                                            <span className={cn(
                                                                "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                                                t.status === "Lunas" ? "bg-emerald-100 text-emerald-800" :
                                                                    t.status === "Deposit" ? "bg-blue-100 text-blue-800" :
                                                                        "bg-amber-100 text-amber-800"
                                                            )}>
                                                                {t.status}
                                                            </span>
                                                        </div>

                                                        <h4 className="text-sm font-bold text-slate-900">
                                                            {t.pasien} <span className="font-mono text-xs font-semibold text-slate-500">({t.norm})</span>
                                                        </h4>
                                                        <p className="text-xs text-slate-500">
                                                            {t.layanan} • Penjamin: <strong className="text-slate-700">{t.penjamin}</strong>
                                                        </p>
                                                    </div>

                                                    <div className="text-left sm:text-right space-y-1">
                                                        <span className="text-[10px] text-slate-400 block">{t.tanggal} • {t.jam}</span>
                                                        <span className="text-sm font-black text-emerald-700 block">
                                                            Rp {t.totalBiaya.toLocaleString("id-ID")}
                                                        </span>
                                                        {t.sisaTagihan > 0 ? (
                                                            <span className="text-[11px] font-bold text-rose-600 block">
                                                                Sisa: Rp {t.sisaTagihan.toLocaleString("id-ID")}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[11px] font-bold text-emerald-600 flex items-center sm:justify-end gap-1">
                                                                <CheckCircle2 className="h-3.5 w-3.5" /> Lunas
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Rincian Billing & Payment Checkout Panel */}
                        <div className="lg:col-span-5 space-y-4">
                            {selectedTagihan ? (
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                                Rincian Tagihan Billing Pasien
                                            </h4>
                                            <span className="font-mono text-[11px] text-slate-500">{selectedTagihan.noBilling}</span>
                                        </div>
                                        <button
                                            onClick={() => setIsPrintingModal(true)}
                                            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                                        >
                                            <Printer className="h-3.5 w-3.5 text-emerald-600" /> Cetak Nota
                                        </button>
                                    </div>

                                    {/* Info Pasien */}
                                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs space-y-1.5">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Nama Pasien:</span>
                                            <strong className="text-slate-900">{selectedTagihan.pasien} ({selectedTagihan.norm})</strong>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Layanan / Poli:</span>
                                            <strong className="text-slate-800">{selectedTagihan.layanan}</strong>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">DPJP / Dokter:</span>
                                            <span className="text-slate-700 font-medium">{selectedTagihan.dokterPemeriksa || "-"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Penjamin:</span>
                                            <span className="font-bold text-emerald-700">{selectedTagihan.penjamin}</span>
                                        </div>
                                        {selectedTagihan.noSepBpjs && (
                                            <div className="flex justify-between text-blue-700 font-mono text-[11px]">
                                                <span>No. SEP BPJS:</span>
                                                <strong>{selectedTagihan.noSepBpjs}</strong>
                                            </div>
                                        )}
                                    </div>

                                    {/* Breakdown Item Rincian Billing */}
                                    <div className="space-y-2">
                                        <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Item Layanan & Farmasi</h5>
                                        <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-100 divide-y divide-slate-100 text-xs">
                                            {selectedTagihan.items.map((item) => (
                                                <div key={item.id} className="p-2.5 flex items-center justify-between hover:bg-slate-50/50">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-400 block">{item.kategori}</span>
                                                        <span className="font-semibold text-slate-800">{item.namaItem}</span>
                                                        <span className="text-[11px] text-slate-500 block">
                                                            {item.jumlah} {item.satuan} x Rp {item.tarifSatuan.toLocaleString("id-ID")}
                                                        </span>
                                                    </div>
                                                    <span className="font-bold text-slate-900">
                                                        Rp {item.subtotal.toLocaleString("id-ID")}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ringkasan Biaya */}
                                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs space-y-1.5">
                                        <div className="flex justify-between text-slate-600">
                                            <span>Subtotal Layanan:</span>
                                            <span>Rp {selectedTagihan.totalBiaya.toLocaleString("id-ID")}</span>
                                        </div>
                                        {selectedTagihan.totalSudahBayar > 0 && (
                                            <div className="flex justify-between text-emerald-700 font-semibold">
                                                <span>Sudah Dibayar / Deposit:</span>
                                                <span>- Rp {selectedTagihan.totalSudahBayar.toLocaleString("id-ID")}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-slate-200/80 pt-2 flex justify-between items-center">
                                            <span className="font-bold text-slate-900">Sisa Tagihan Kasir:</span>
                                            <span className="text-base font-black text-emerald-700">
                                                Rp {selectedTagihan.sisaTagihan.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Checkout / Metode Bayar Panel jika belum lunas */}
                                    {selectedTagihan.sisaTagihan > 0 ? (
                                        <div className="space-y-3 pt-2">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-800 mb-2">Pilih Cara Pembayaran:</label>
                                                <div className="grid grid-cols-3 gap-1.5">
                                                    {(["Tunai", "QRIS", "EDC / Debit"] as const).map((m) => (
                                                        <button
                                                            key={m}
                                                            type="button"
                                                            onClick={() => setMetodeBayar(m)}
                                                            className={cn(
                                                                "rounded-xl border py-2 text-[11px] font-bold transition-all cursor-pointer",
                                                                metodeBayar === m
                                                                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                                                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                                            )}
                                                        >
                                                            {m}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Opsi Bayar dengan Deposit jika pasien punya deposit */}
                                            {depositList.some(d => d.norm === selectedTagihan.norm && d.saldoDeposit > 0) && (
                                                <button
                                                    type="button"
                                                    onClick={handleBayarDenganDeposit}
                                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-50 border border-blue-200 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
                                                >
                                                    <Wallet className="h-4 w-4" /> Gunakan Saldo Deposit Pasien
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleProsesBayar}
                                                className="w-full rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-all cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 className="h-4 w-4" /> Proses Pelunasan (Rp {selectedTagihan.sisaTagihan.toLocaleString("id-ID")})
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-1">
                                            <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
                                            <p className="text-xs font-bold text-emerald-800">Tagihan Ini Telah Lunas</p>
                                            <p className="text-[11px] text-emerald-600">
                                                Metode: {selectedTagihan.metodePembayaran || "Terbayar"} • Petugas: {selectedTagihan.kasirPetugas || "Kasir"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* TAB 2: DEPOSIT PASIEN RAWAT INAP */}
                {activeTab === "deposit" && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Deposit Pasien Rawat Inap & Tindakan</h3>
                                    <p className="text-xs text-slate-500">Penerimaan uang muka (panjar), tracking saldo deposit pasien, dan alokasi ke billing tagihan.</p>
                                </div>
                                <button
                                    onClick={() => setIsDepositModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-500 cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" /> Tambah Deposit Pasien
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {depositList.map((dep) => (
                                    <div key={dep.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">{dep.pasien}</h4>
                                                <p className="text-xs text-slate-500">{dep.norm} • {dep.ruangan}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] text-slate-400 block">Sisa Saldo</span>
                                                <span className="text-base font-black text-emerald-700">
                                                    Rp {dep.saldoDeposit.toLocaleString("id-ID")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-200/80 pt-3 space-y-2">
                                            <span className="text-[11px] font-bold text-slate-700 block">Riwayat Transaksi Deposit</span>
                                            <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs">
                                                {dep.riwayatDeposit.map((rd) => (
                                                    <div key={rd.id} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-100">
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={cn(
                                                                    "rounded-md px-1.5 py-0.5 text-[9px] font-bold",
                                                                    rd.tipe === "Masuk" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                                                                )}>
                                                                    {rd.tipe}
                                                                </span>
                                                                <span className="font-semibold text-slate-800">{rd.keterangan}</span>
                                                            </div>
                                                            <span className="text-[10px] text-slate-400">{rd.tanggal} • Oleh: {rd.petugas}</span>
                                                        </div>
                                                        <span className={cn("font-bold", rd.tipe === "Masuk" ? "text-emerald-600" : "text-blue-600")}>
                                                            {rd.tipe === "Masuk" ? "+" : "-"} Rp {rd.nominal.toLocaleString("id-ID")}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: BUKA / TUTUP KASIR SHIFT */}
                {activeTab === "buka-tutup" && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Manajemen Shift & Rekonsiliasi Kas Kasir</h3>
                                        <p className="text-xs text-slate-500">Pencatatan kas modal awal, penerimaan real-time loket, dan serah terima shift.</p>
                                    </div>
                                </div>
                                <span className={cn(
                                    "rounded-full px-3 py-1 text-xs font-bold",
                                    shiftKasir.status === "Buka" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"
                                )}>
                                    Status: {shiftKasir.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                                    <span className="text-xs text-slate-500 block">Modal Awal Kas:</span>
                                    <span className="text-lg font-black text-slate-800">
                                        Rp {shiftKasir.modalAwal.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="rounded-2xl bg-emerald-50/60 p-4 border border-emerald-100">
                                    <span className="text-xs text-emerald-700 block">Penerimaan Tunai:</span>
                                    <span className="text-lg font-black text-emerald-700">
                                        Rp {shiftKasir.totalTunaiMasuk.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100">
                                    <span className="text-xs text-blue-700 block">Non-Tunai (QRIS/EDC):</span>
                                    <span className="text-lg font-black text-blue-700">
                                        Rp {shiftKasir.totalNonTunai.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                                    <span className="text-xs text-slate-400 block">Total Uang Fisik di Brankas:</span>
                                    <span className="text-lg font-black text-emerald-400">
                                        Rp {(shiftKasir.modalAwal + shiftKasir.totalTunaiMasuk).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 text-xs">
                                <h4 className="font-bold text-slate-900 uppercase tracking-wider">Informasi Petugas Kasir</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
                                    <p>Petugas: <strong className="text-slate-900">{shiftKasir.namaKasir}</strong></p>
                                    <p>Shift: <strong className="text-slate-900">{shiftKasir.shift}</strong></p>
                                    <p>Waktu Buka: <strong className="text-slate-900">{shiftKasir.waktuBuka}</strong></p>
                                </div>
                                <div className="pt-3 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            alert("Laporan Tutup Kasir dicetak dan data diarsipkan ke modul Bendahara Penerimaan.");
                                        }}
                                        className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white shadow-2xs hover:bg-slate-800 cursor-pointer"
                                    >
                                        Tutup Kasir & Cetak Rekap Shift
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: BENDAHARA & PENERIMAAN KAS */}
                {activeTab === "bendahara" && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                                    <Banknote className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Bendahara Penerimaan & Kas Rumah Sakit</h3>
                                    <p className="text-xs text-slate-500">Rekonsiliasi setoran kasir loket, rekening koran bank operasional, dan klaim piutang BPJS.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                                    <span className="text-xs text-slate-500">Kas Fisik Siap Disetor ke Bank</span>
                                    <p className="text-xl font-black text-slate-900">Rp 12.850.000</p>
                                    <span className="text-[10px] text-emerald-600 font-bold">Terverifikasi 3 Loket Kasir</span>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-blue-50/50 p-4 space-y-1">
                                    <span className="text-xs text-blue-700">Total Settlement EDC & QRIS Hari Ini</span>
                                    <p className="text-xl font-black text-blue-700">Rp 18.420.000</p>
                                    <span className="text-[10px] text-slate-500">Bank Mandiri & BCA RS</span>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-emerald-50/50 p-4 space-y-1">
                                    <span className="text-xs text-emerald-700">Klaim BPJS Terverifikasi Siap Tagih</span>
                                    <p className="text-xl font-black text-emerald-700">Rp 148.600.000</p>
                                    <span className="text-[10px] text-emerald-600">Bulan Berjalan (Klaim INA-CBG)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 5: JURNAL & BUKU BESAR AKUNTANSI */}
                {activeTab === "akuntansi" && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                                        <Scale className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Jurnal Umum & Buku Besar Otomatis SIMRS</h3>
                                        <p className="text-xs text-slate-500">Pencatatan otomatis debit-kredit dari billing pasien, farmasi, dan pengadaan logistik RS.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => alert("Mengekspor jurnal akuntansi ke format Excel (XLSX).")}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Excel
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase">
                                        <tr>
                                            <th className="px-3 py-2.5">No Jurnal & Tanggal</th>
                                            <th className="px-3 py-2.5">Referensi</th>
                                            <th className="px-3 py-2.5">Keterangan Transaksi</th>
                                            <th className="px-3 py-2.5">Akun Debit</th>
                                            <th className="px-3 py-2.5">Akun Kredit</th>
                                            <th className="px-3 py-2.5 text-right">Nominal (Rp)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {jurnalList.map((j) => (
                                            <tr key={j.id} className="hover:bg-slate-50/60">
                                                <td className="px-3 py-2.5">
                                                    <span className="font-mono text-[10px] text-blue-600 font-bold block">{j.noJurnal}</span>
                                                    <span className="text-[11px] text-slate-500">{j.tanggal}</span>
                                                </td>
                                                <td className="px-3 py-2.5 font-mono text-[11px] font-semibold text-slate-700">{j.referensi}</td>
                                                <td className="px-3 py-2.5 font-medium text-slate-800">{j.keterangan}</td>
                                                <td className="px-3 py-2.5 font-medium text-emerald-700">{j.debitAkun}</td>
                                                <td className="px-3 py-2.5 font-medium text-blue-700">{j.kreditAkun}</td>
                                                <td className="px-3 py-2.5 text-right font-black text-slate-900">
                                                    Rp {j.nominal.toLocaleString("id-ID")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL PRINT KUITANSI */}
            {isPrintingModal && selectedTagihan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">Kuitansi Pembayaran Resmi SIMRS</h3>
                            <button onClick={() => setIsPrintingModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Struk Content */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 text-xs font-mono">
                            <div className="text-center border-b border-dashed border-slate-300 pb-3">
                                <h4 className="text-sm font-black text-slate-900">RUMAH SAKIT UTAMA SEHAT</h4>
                                <p className="text-[10px] text-slate-500">Jl. Pelayanan Kesehatan No. 1 • Telp (021) 7788-9900</p>
                                <p className="text-[11px] font-bold text-emerald-700 mt-1">BUKTI PEMBAYARAN KASIR</p>
                            </div>

                            <div className="space-y-1 text-[11px]">
                                <div className="flex justify-between"><span>No. Kuitansi:</span><strong>{selectedTagihan.noNota || selectedTagihan.noBilling}</strong></div>
                                <div className="flex justify-between"><span>Tgl / Jam:</span><span>{selectedTagihan.tanggal} {selectedTagihan.jam}</span></div>
                                <div className="flex justify-between"><span>Pasien / RM:</span><strong>{selectedTagihan.pasien} ({selectedTagihan.norm})</strong></div>
                                <div className="flex justify-between"><span>Layanan / Poli:</span><span>{selectedTagihan.layanan}</span></div>
                                <div className="flex justify-between"><span>Penjamin:</span><span>{selectedTagihan.penjamin}</span></div>
                                <div className="flex justify-between"><span>Kasir:</span><span>{selectedTagihan.kasirPetugas || shiftKasir.namaKasir}</span></div>
                            </div>

                            <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1">
                                {selectedTagihan.items.map((it) => (
                                    <div key={it.id} className="flex justify-between text-[11px]">
                                        <span>{it.namaItem}</span>
                                        <span>Rp {it.subtotal.toLocaleString("id-ID")}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1 font-bold text-xs pt-1">
                                <div className="flex justify-between"><span>TOTAL TAGIHAN:</span><span>Rp {selectedTagihan.totalBiaya.toLocaleString("id-ID")}</span></div>
                                <div className="flex justify-between text-emerald-700"><span>JUMLAH DIBAYAR:</span><span>Rp {selectedTagihan.totalSudahBayar.toLocaleString("id-ID")}</span></div>
                                <div className="flex justify-between text-slate-600"><span>METODE:</span><span>{selectedTagihan.metodePembayaran || "Lunas"}</span></div>
                            </div>

                            <div className="text-center pt-3 text-[10px] text-slate-400 border-t border-dashed border-slate-300">
                                Terima kasih atas kunjungan Anda di RS Utama Sehat. Semoga lekas sembuh!
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    alert("Mencetak kuitansi ke printer thermal kasir...");
                                    setIsPrintingModal(false);
                                }}
                                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                                <Printer className="h-4 w-4" /> Cetak Sekarang
                            </button>
                            <button
                                onClick={() => setIsPrintingModal(false)}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL TAMBAH DEPOSIT BARU */}
            {isDepositModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">Tambah Deposit Pasien Rawat Inap</h3>
                            <button onClick={() => setIsDepositModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveDepositBaru} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">No. Rekam Medis (RM)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Cth: RM-2026-0044"
                                    value={depositForm.norm}
                                    onChange={(e) => setDepositForm({ ...depositForm, norm: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-emerald-600 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nama Pasien</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Cth: Ahmad Fauzi"
                                    value={depositForm.pasien}
                                    onChange={(e) => setDepositForm({ ...depositForm, pasien: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-emerald-600 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nominal Deposit (Rp)</label>
                                <input
                                    type="number"
                                    required
                                    min={50000}
                                    value={depositForm.nominal}
                                    onChange={(e) => setDepositForm({ ...depositForm, nominal: Number(e.target.value) })}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 font-bold focus:border-emerald-600 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Tujuan</label>
                                <input
                                    type="text"
                                    required
                                    value={depositForm.keterangan}
                                    onChange={(e) => setDepositForm({ ...depositForm, keterangan: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-emerald-600 focus:outline-none"
                                />
                            </div>

                            <div className="pt-2 flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-emerald-600 py-2.5 font-bold text-white hover:bg-emerald-500 cursor-pointer"
                                >
                                    Simpan Deposit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsDepositModalOpen(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppShell>
    );
}
