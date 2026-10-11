import { useState, useEffect } from "react";
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
    AlertTriangle,
    PillBottle,
    X,
    FileText,
    ArrowUpRight,
    Send
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";
import {
    type ItemLogistikStok,
    type PurchaseOrderLogistik,
    type SuratPenerimaanLogistik,
    type DistribusiUnitLogistik,
    STORAGE_KEYS,
    SEED_LOGISTIK_STOK,
    SEED_LOGISTIK_PO,
    SEED_LOGISTIK_PENERIMAAN,
    SEED_LOGISTIK_DISTRIBUSI
} from "~/lib/hospital-finance-logistics";

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

    // State Stok Logistik
    const [stokLogistik, setStokLogistik] = useState<ItemLogistikStok[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(STORAGE_KEYS.LOGISTIK_STOK);
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { /* ignore */ }
            }
        }
        return SEED_LOGISTIK_STOK;
    });

    // State PO Logistik
    const [poList, setPoList] = useState<PurchaseOrderLogistik[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(STORAGE_KEYS.LOGISTIK_PO);
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { /* ignore */ }
            }
        }
        return SEED_LOGISTIK_PO;
    });

    // State Penerimaan Logistik
    const [penerimaanList, setPenerimaanList] = useState<SuratPenerimaanLogistik[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(STORAGE_KEYS.LOGISTIK_PENERIMAAN);
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { /* ignore */ }
            }
        }
        return SEED_LOGISTIK_PENERIMAAN;
    });

    // State Distribusi Unit
    const [distribusiList, setDistribusiList] = useState<DistribusiUnitLogistik[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(STORAGE_KEYS.LOGISTIK_DISTRIBUSI);
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { /* ignore */ }
            }
        }
        return SEED_LOGISTIK_DISTRIBUSI;
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEYS.LOGISTIK_STOK, JSON.stringify(stokLogistik));
        }
    }, [stokLogistik]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEYS.LOGISTIK_PO, JSON.stringify(poList));
        }
    }, [poList]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEYS.LOGISTIK_PENERIMAAN, JSON.stringify(penerimaanList));
        }
    }, [penerimaanList]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEYS.LOGISTIK_DISTRIBUSI, JSON.stringify(distribusiList));
        }
    }, [distribusiList]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterKategori, setFilterKategori] = useState<string>("Semua");

    // Modal Permintaan Distribusi Baru dari Depo Farmasi
    const [isDistribusiModalOpen, setIsDistribusiModalOpen] = useState(false);
    const [distribusiForm, setDistribusiForm] = useState({
        unitPeminta: "Depo Farmasi Rawat Jalan" as const,
        kodeBarang: "FAR-002",
        jumlahDiminta: 200
    });

    // Modal Buat PO Baru
    const [isPOModalOpen, setIsPOModalOpen] = useState(false);
    const [poForm, setPoForm] = useState({
        suplier: "PT Kimia Farma Trading",
        tipePengadaan: "Reguler Farmasi" as const,
        namaBarang: "Amoxicillin 500mg Kapsul",
        kodeBarang: "FAR-002",
        jumlahOrder: 1000,
        hargaEst: 2200,
        catatan: "Penambahan stok minimum farmasi"
    });

    // Handle Distribusi Gudang ke Depo Farmasi
    const handleSetujuiDistribusi = (dist: DistribusiUnitLogistik) => {
        // Kurangi stok Gudang Utama dan Tambah Stok Depo Farmasi
        setStokLogistik(prev => prev.map(item => {
            const itemInDist = dist.items.find(d => d.kodeBarang === item.kodeBarang);
            if (itemInDist) {
                return {
                    ...item,
                    stokGudangUtama: Math.max(0, item.stokGudangUtama - itemInDist.jumlahDiminta),
                    stokDepoFarmasi: item.stokDepoFarmasi + itemInDist.jumlahDiminta
                };
            }
            return item;
        }));

        // Sinkronkan ke modul farmasi localstorage
        try {
            const rawFarmasiStok = localStorage.getItem(STORAGE_KEYS.FARMASI_STOK);
            if (rawFarmasiStok) {
                let farmasiList: any[] = JSON.parse(rawFarmasiStok);
                dist.items.forEach(d => {
                    const found = farmasiList.find(f => f.kodeObat === d.kodeBarang);
                    if (found) {
                        found.stok = (found.stok || 0) + d.jumlahDiminta;
                    }
                });
                localStorage.setItem(STORAGE_KEYS.FARMASI_STOK, JSON.stringify(farmasiList));
            }
        } catch (e) {
            console.error("Gagal sync farmasi stok:", e);
        }

        // Tandai distribusi selesai
        setDistribusiList(prev => prev.map(d => d.id === dist.id ? {
            ...d,
            status: "Didistribusikan / Selesai",
            petugasGudang: "Ahmad Zainuri (Gudang Medis)",
            items: d.items.map(it => ({ ...it, jumlahDiserahkan: it.jumlahDiminta }))
        } : d));

        alert(`Distribusi barang ke ${dist.unitPeminta} BERHASIL DISETUJUI! Stok telah dipindahkan dari Gudang Utama ke Depo Farmasi.`);
    };

    const handleSaveDistribusiBaru = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedItem = stokLogistik.find(s => s.kodeBarang === distribusiForm.kodeBarang);
        const newDist: DistribusiUnitLogistik = {
            id: `dist-${Date.now()}`,
            noPermintaan: `SP-UNIT-2026-${Math.floor(100 + Math.random() * 900)}`,
            unitPeminta: distribusiForm.unitPeminta,
            tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
            status: "Permintaan Diajukan",
            petugasGudang: "Menunggu Approval Gudang",
            items: [
                {
                    kodeBarang: distribusiForm.kodeBarang,
                    namaBarang: selectedItem?.namaBarang || "Barang Farmasi",
                    jumlahDiminta: Number(distribusiForm.jumlahDiminta),
                    jumlahDiserahkan: 0,
                    satuan: selectedItem?.satuan || "Pcs"
                }
            ]
        };

        setDistribusiList(prev => [newDist, ...prev]);
        setIsDistribusiModalOpen(false);
        alert(`Permintaan distribusi stok dari ${distribusiForm.unitPeminta} berhasil dikirim ke Gudang Logistik!`);
    };

    const handleSavePOBaru = (e: React.FormEvent) => {
        e.preventDefault();
        const subtotal = poForm.jumlahOrder * poForm.hargaEst;
        const newPO: PurchaseOrderLogistik = {
            id: `po-${Date.now()}`,
            noPO: `PO-RS-2026-${Math.floor(300 + Math.random() * 700)}`,
            tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
            suplier: poForm.suplier,
            tipePengadaan: poForm.tipePengadaan,
            status: "Diajukan",
            estimasiTotal: subtotal,
            items: [
                {
                    kodeBarang: poForm.kodeBarang,
                    namaBarang: poForm.namaBarang,
                    jumlahOrder: Number(poForm.jumlahOrder),
                    satuan: "Unit",
                    hargaEst: Number(poForm.hargaEst),
                    subtotal: subtotal
                }
            ],
            catatan: poForm.catatan
        };
        setPoList(prev => [newPO, ...prev]);
        setIsPOModalOpen(false);
        alert(`Surat Pesanan ${newPO.noPO} berhasil diajukan ke Direktur / Bagian Pengadaan!`);
    };

    // Filtered Stok
    const filteredStok = stokLogistik.filter(s => {
        const matchesSearch =
            s.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.kodeBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.suplier.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesKat = filterKategori === "Semua" || s.kategori === filterKategori;
        return matchesSearch && matchesKat;
    });

    const stokKritisCount = stokLogistik.filter(s => (s.stokGudangUtama + s.stokDepoFarmasi) <= s.minStok).length;

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Banner Gradient Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 text-white shadow-lg">
                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                                    <Boxes className="h-3.5 w-3.5" /> Gudang Logistik Utama & Farmasi Sentral
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-bold text-emerald-200 border border-emerald-300/30">
                                    <Sparkles className="h-3 w-3" /> Sinkron Depo Farmasi & Billing
                                </span>
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                Inventory & Logistik Medis Rumah Sakit
                            </h1>
                            <p className="max-w-2xl text-xs text-blue-100 sm:text-sm">
                                Pengelolaan stok gudang utama medis & non-medis, penerimaan barang dari suplier, Surat Pesanan (PO), distribusi stok ke depo farmasi/unit, dan stok opname.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setIsDistribusiModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-md hover:bg-blue-50 transition-all cursor-pointer"
                            >
                                <ArrowLeftRight className="h-4 w-4" /> Permintaan Distribusi Unit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sub-menu Tabs */}
                <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200/60 shadow-inner overflow-x-auto scrollbar-none">
                    {[
                        { id: "stok", label: "Katalog & Stok Logistik", icon: Boxes },
                        { id: "pemesanan", label: "Pemesanan Barang (PO)", icon: Truck },
                        { id: "penerimaan", label: "Penerimaan & SPB", icon: ClipboardList },
                        { id: "distribusi", label: "Permintaan & Distribusi Unit", icon: ArrowLeftRight },
                        { id: "opname", label: "Stok Opname & Kartu Stok", icon: FileSpreadsheet },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = activeTab === tab.id || (!searchParams.get("tab") && tab.id === "stok");
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                                    isSelected
                                        ? "bg-white text-blue-700 shadow-xs font-bold"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                                {tab.id === "stok" && stokKritisCount > 0 && (
                                    <span className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                                        {stokKritisCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* TAB 1: KATALOG & STOK LOGISTIK */}
                {(activeTab === "stok" || !searchParams.get("tab")) && (
                    <div className="space-y-6">
                        {/* Kritis Alert */}
                        {stokKritisCount > 0 && (
                            <div className="rounded-2xl bg-amber-500 p-4 text-white shadow-md flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="h-6 w-6 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm">Peringatan: {stokKritisCount} Item Logistik / Farmasi Mencapai Batas Minimum!</h4>
                                        <p className="text-xs text-amber-100">
                                            Segera buat Surat Pesanan (PO) ke Suplier / PBF agar ketersediaan obat dan BMHP tetap aman.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setTab("pemesanan")}
                                    className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-amber-700 shadow-2xs hover:bg-amber-50 cursor-pointer"
                                >
                                    Buat PO Pengadaan
                                </button>
                            </div>
                        )}

                        {/* Search & Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari kode barang, nama, atau suplier..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-xs focus:border-blue-600 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={filterKategori}
                                    onChange={(e) => setFilterKategori(e.target.value)}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-600 focus:outline-none"
                                >
                                    <option value="Semua">Semua Kategori</option>
                                    <option value="Obat & Farmasi">Obat & Farmasi</option>
                                    <option value="Alkes & BMHP">Alkes & BMHP</option>
                                    <option value="Logistik Umum / ATK">Logistik Umum / ATK</option>
                                </select>
                            </div>
                        </div>

                        {/* Tabel Stok Terpadu Gudang Utama & Depo Farmasi */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Data Persediaan Barang Medis & Gudang Utama ({filteredStok.length})
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Menampilkan perbandingan posisi stok di Gudang Utama vs Depo Farmasi aktif.
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase">
                                        <tr>
                                            <th className="px-3 py-2.5">Kode & Nama Barang</th>
                                            <th className="px-3 py-2.5">Kategori</th>
                                            <th className="px-3 py-2.5 text-center">Gudang Utama</th>
                                            <th className="px-3 py-2.5 text-center">Depo Farmasi</th>
                                            <th className="px-3 py-2.5 text-center">Total Stok</th>
                                            <th className="px-3 py-2.5">Batch & ED</th>
                                            <th className="px-3 py-2.5 text-right">Harga Beli / Jual</th>
                                            <th className="px-3 py-2.5">Suplier / PBF</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredStok.map((item) => {
                                            const total = item.stokGudangUtama + item.stokDepoFarmasi;
                                            const isLow = total <= item.minStok;
                                            return (
                                                <tr key={item.id} className="hover:bg-slate-50/60">
                                                    <td className="px-3 py-2.5">
                                                        <span className="font-mono text-[10px] text-blue-600 font-bold block">{item.kodeBarang}</span>
                                                        <span className="font-bold text-slate-900">{item.namaBarang}</span>
                                                    </td>
                                                    <td className="px-3 py-2.5">
                                                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                                                            {item.kategori}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center font-bold text-slate-800">
                                                        {item.stokGudangUtama} {item.satuan}
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center font-bold text-blue-700">
                                                        {item.stokDepoFarmasi} {item.satuan}
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center">
                                                        <span className={cn(
                                                            "font-black px-2 py-0.5 rounded-full text-xs",
                                                            isLow ? "bg-rose-100 text-rose-700" : "bg-emerald-50 text-emerald-700"
                                                        )}>
                                                            {total} {item.satuan}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2.5">
                                                        <span className="font-mono text-[10px] text-slate-500 block">{item.batchNo}</span>
                                                        <span className="text-[11px] font-semibold text-slate-700">ED: {item.expiredDate}</span>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-right">
                                                        <span className="text-[11px] text-slate-500 block">Beli: Rp {item.hargaBeliSatuan.toLocaleString("id-ID")}</span>
                                                        <span className="font-bold text-slate-900">Jual: Rp {item.hargaJualSatuan.toLocaleString("id-ID")}</span>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-slate-600 font-medium">{item.suplier}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: PEMESANAN BARANG (PO) */}
                {activeTab === "pemesanan" && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Pemesanan Barang & Surat Pesanan (PO)</h3>
                                    <p className="text-xs text-slate-500">Order pembelian obat, infus, dan BMHP ke Pedagang Besar Farmasi (PBF) resmi.</p>
                                </div>
                                <button
                                    onClick={() => setIsPOModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-500 cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" /> Buat PO Pengadaan Baru
                                </button>
                            </div>

                            <div className="space-y-3">
                                {poList.map((po) => (
                                    <div key={po.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-blue-700">{po.noPO}</span>
                                                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                                                        {po.tipePengadaan}
                                                    </span>
                                                    <span className={cn(
                                                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                                                        po.status === "Disetujui Direktur" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                                    )}>
                                                        {po.status}
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-900 mt-1">Suplier: {po.suplier}</h4>
                                                <p className="text-xs text-slate-500">{po.tanggal} • {po.catatan}</p>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <span className="text-[10px] text-slate-400 block">Total Estimasi PO</span>
                                                <span className="text-base font-black text-blue-700">
                                                    Rp {po.estimasiTotal.toLocaleString("id-ID")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 text-xs">
                                            <span className="font-bold text-slate-700 block text-[11px]">Daftar Item Pesanan:</span>
                                            {po.items.map((it, idx) => (
                                                <div key={idx} className="flex justify-between text-slate-600">
                                                    <span>{it.namaBarang} ({it.jumlahOrder} {it.satuan})</span>
                                                    <span className="font-semibold">Rp {it.subtotal.toLocaleString("id-ID")}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: PENERIMAAN BARANG & SPB */}
                {activeTab === "penerimaan" && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                                    <ClipboardList className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Surat Penerimaan Barang (SPB) & Faktur Suplier</h3>
                                    <p className="text-xs text-slate-500">Penerimaan fisik barang datang, verifikasi nomor batch, tanggal expired, dan posting otomatis hutang usaha.</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase">
                                        <tr>
                                            <th className="px-3 py-2.5">No SPB & Tanggal</th>
                                            <th className="px-3 py-2.5">Ref PO & Faktur</th>
                                            <th className="px-3 py-2.5">Suplier / PBF</th>
                                            <th className="px-3 py-2.5">Penerima Gudang</th>
                                            <th className="px-3 py-2.5">Status Akuntansi</th>
                                            <th className="px-3 py-2.5 text-right">Total Faktur</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {penerimaanList.map((rcv) => (
                                            <tr key={rcv.id} className="hover:bg-slate-50/60">
                                                <td className="px-3 py-2.5">
                                                    <span className="font-mono text-xs font-bold text-emerald-700 block">{rcv.noPenerimaan}</span>
                                                    <span className="text-slate-500 text-[11px]">{rcv.tanggal}</span>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <span className="font-mono text-slate-800 font-semibold block">{rcv.noPORef}</span>
                                                    <span className="text-[10px] text-slate-400">Fak: {rcv.noFakturSuplier}</span>
                                                </td>
                                                <td className="px-3 py-2.5 font-bold text-slate-800">{rcv.suplier}</td>
                                                <td className="px-3 py-2.5 text-slate-600">{rcv.penerima}</td>
                                                <td className="px-3 py-2.5">
                                                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                                        {rcv.statusJurnal}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2.5 text-right font-black text-slate-900">
                                                    Rp {rcv.totalFaktur.toLocaleString("id-ID")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: PERMINTAAN & DISTRIBUSI UNIT (TERHUBUNG KE DEPO FARMASI) */}
                {activeTab === "distribusi" && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                                        <ArrowLeftRight className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Permintaan & Distribusi Stok ke Depo Farmasi & Bangsal</h3>
                                        <p className="text-xs text-slate-500">Alur mutasi obat internal dari Gudang Logistik Utama ke Depo Rawat Jalan, Depo Rawat Inap & IGD.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsDistribusiModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-500 cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" /> Ajukan Permintaan Depo
                                </button>
                            </div>

                            <div className="space-y-3">
                                {distribusiList.map((dist) => (
                                    <div key={dist.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-indigo-700">{dist.noPermintaan}</span>
                                                    <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                                                        {dist.unitPeminta}
                                                    </span>
                                                    <span className={cn(
                                                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                                                        dist.status === "Didistribusikan / Selesai" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                                    )}>
                                                        {dist.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">{dist.tanggal} • Petugas: {dist.petugasGudang}</p>
                                            </div>

                                            {dist.status !== "Didistribusikan / Selesai" && (
                                                <button
                                                    onClick={() => handleSetujuiDistribusi(dist)}
                                                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-500 cursor-pointer flex items-center gap-1.5"
                                                >
                                                    <Send className="h-3.5 w-3.5" /> Setujui & Transfer Stok ke Depo
                                                </button>
                                            )}
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 text-xs">
                                            <span className="font-bold text-slate-700 block text-[11px]">Item yang Diminta:</span>
                                            {dist.items.map((it, idx) => (
                                                <div key={idx} className="flex justify-between text-slate-600">
                                                    <span>{it.namaBarang} (Kode: {it.kodeBarang})</span>
                                                    <span className="font-bold text-slate-900">
                                                        Diminta: {it.jumlahDiminta} {it.satuan} • Diserahkan: {it.jumlahDiserahkan} {it.satuan}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 5: STOK OPNAME & KARTU STOK */}
                {activeTab === "opname" && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 border border-teal-200">
                                        <FileSpreadsheet className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Stok Opname Fisik & Rekonsiliasi Kartu Stok</h3>
                                        <p className="text-xs text-slate-500">Pencocokan saldo sistem dengan fisik obat di rak gudang logistik dan depo farmasi.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => alert("Memulai sesi Stok Opname Bulanan Logistik...")}
                                    className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-teal-500 cursor-pointer"
                                >
                                    Mulai Sesi Opname Baru
                                </button>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-600 space-y-2">
                                <p className="font-bold text-slate-800">Ringkasan Audit Stok Opname Terakhir:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                                        <span className="text-slate-400 block text-[11px]">Tanggal Opname</span>
                                        <strong className="text-slate-900">30 September 2026</strong>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                                        <span className="text-slate-400 block text-[11px]">Tingkat Akurasi Fisik vs SIMRS</span>
                                        <strong className="text-emerald-600">99.8% Match</strong>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                                        <span className="text-slate-400 block text-[11px]">Selisih Nominal Obat</span>
                                        <strong className="text-slate-900">Rp 0 (Toleransi Tercapai)</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL PERMINTAAN DISTRIBUSI BARU */}
            {isDistribusiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">Form Permintaan Mutasi Stok Depo Farmasi</h3>
                            <button onClick={() => setIsDistribusiModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveDistribusiBaru} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Unit / Depo Peminta</label>
                                <select
                                    value={distribusiForm.unitPeminta}
                                    onChange={(e: any) => setDistribusiForm({ ...distribusiForm, unitPeminta: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-600 focus:outline-none"
                                >
                                    <option value="Depo Farmasi Rawat Jalan">Depo Farmasi Rawat Jalan</option>
                                    <option value="Depo Farmasi Rawat Inap">Depo Farmasi Rawat Inap</option>
                                    <option value="Depo IGD">Depo IGD</option>
                                    <option value="Laboratorium">Laboratorium</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Pilih Item Obat / BMHP</label>
                                <select
                                    value={distribusiForm.kodeBarang}
                                    onChange={(e) => setDistribusiForm({ ...distribusiForm, kodeBarang: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-600 focus:outline-none"
                                >
                                    {stokLogistik.map((s) => (
                                        <option key={s.id} value={s.kodeBarang}>
                                            {s.namaBarang} (Stok Gudang: {s.stokGudangUtama} {s.satuan})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Jumlah yang Diminta</label>
                                <input
                                    type="number"
                                    min={1}
                                    required
                                    value={distribusiForm.jumlahDiminta}
                                    onChange={(e) => setDistribusiForm({ ...distribusiForm, jumlahDiminta: Number(e.target.value) })}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 font-bold focus:border-indigo-600 focus:outline-none"
                                />
                            </div>

                            <div className="pt-2 flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-500 cursor-pointer"
                                >
                                    Kirim Permintaan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsDistribusiModalOpen(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL BUAT PO BARU */}
            {isPOModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">Buat Surat Pesanan (PO) Baru</h3>
                            <button onClick={() => setIsPOModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSavePOBaru} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Suplier / PBF</label>
                                <input
                                    type="text"
                                    required
                                    value={poForm.suplier}
                                    onChange={(e) => setPoForm({ ...poForm, suplier: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-600 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Tipe Pengadaan</label>
                                <select
                                    value={poForm.tipePengadaan}
                                    onChange={(e: any) => setPoForm({ ...poForm, tipePengadaan: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-600 focus:outline-none"
                                >
                                    <option value="Reguler Farmasi">Reguler Farmasi</option>
                                    <option value="Cito BMHP">Cito BMHP</option>
                                    <option value="Logistik Umum">Logistik Umum</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nama Barang yang Dipesan</label>
                                <input
                                    type="text"
                                    required
                                    value={poForm.namaBarang}
                                    onChange={(e) => setPoForm({ ...poForm, namaBarang: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-600 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Jumlah Order</label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        value={poForm.jumlahOrder}
                                        onChange={(e) => setPoForm({ ...poForm, jumlahOrder: Number(e.target.value) })}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-600 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Harga Satuan (Est)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        value={poForm.hargaEst}
                                        onChange={(e) => setPoForm({ ...poForm, hargaEst: Number(e.target.value) })}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-600 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Catatan</label>
                                <input
                                    type="text"
                                    value={poForm.catatan}
                                    onChange={(e) => setPoForm({ ...poForm, catatan: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-blue-600 focus:outline-none"
                                />
                            </div>

                            <div className="pt-2 flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 cursor-pointer"
                                >
                                    Ajukan Surat Pesanan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsPOModalOpen(false)}
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
