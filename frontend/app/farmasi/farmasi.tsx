import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
    PillBottle,
    ClipboardList,
    Syringe,
    Boxes,
    LayoutDashboard,
    Sparkles
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";
import { CustomAlertModal, type AlertType } from "~/components/ui/CustomAlertModal";

import { TabDashboardFarmasi } from "./ui/TabDashboardFarmasi";
import { TabResepDispensing } from "./ui/TabResepDispensing";
import { TabRacikanFormularium } from "./ui/TabRacikanFormularium";
import { TabStokInventori } from "./ui/TabStokInventori";
import { TabReturPIO } from "./ui/TabReturPIO";
import { ModalVerifikasiApoteker } from "./ui/ModalVerifikasiApoteker";
import { ModalTambahStokObat } from "./ui/ModalTambahStokObat";

export type FarmasiTab =
    | "dashboard"
    | "resep"
    | "dispensing"
    | "racikan"
    | "stok"
    | "retur"
    | "pio";

export interface ObatItemResep {
    nama: string;
    jumlah: number;
    satuan: string;
    dosis: string;
    aturan: string;
    stokTersedia: number;
    hargaSatuan: number;
}

export interface ResepItem {
    id: string;
    noResep: string;
    namaPasien: string;
    norm: string;
    umur: string;
    penjamin: "BPJS Kesehatan" | "Umum" | "Asuransi Swasta";
    dokter: string;
    poli: string;
    depoTujuan: "Depo Rawat Jalan" | "Depo Rawat Inap" | "Depo IGD";
    waktu: string;
    status: "Masuk" | "Verifikasi" | "Diproses" | "Siap Ambil" | "Selesai";
    alergiPasien?: string[];
    peringatanInteraksi?: string[];
    daftarObat: ObatItemResep[];
    catatanApoteker?: string;
    apotekerVerifikator?: string;
}

export interface StokObatItem {
    id: string;
    kodeObat: string;
    namaObat: string;
    kategori: string;
    stok: number;
    satuan: string;
    minStok: number;
    expiredDate: string;
    hargaSatuan: number;
    lokasiDepo: string;
    produsen: string;
}

export interface RacikanBahan {
    namaObat: string;
    dosisTarget: string;
    jumlahBahan: number;
    satuan: string;
}

export interface FormulaRacikan {
    id: string;
    namaRacikan: string;
    jenisRacikan: "Puyer" | "Kapsul" | "Sirup / Suspension" | "Salep / Cream";
    jumlahBungkus: number;
    aturanPakai: string;
    bahanList: RacikanBahan[];
    jasaRacik: number;
}

const INITIAL_STOK: StokObatItem[] = [
    { id: "1", kodeObat: "FAR-001", namaObat: "Paracetamol 500mg Tablet", kategori: "Analgesik & Antipiretik", stok: 1450, satuan: "Tablet", minStok: 200, expiredDate: "2027-12-01", hargaSatuan: 1500, lokasiDepo: "Depo Rawat Jalan", produsen: "Kalbe Farma" },
    { id: "2", kodeObat: "FAR-002", namaObat: "Amoxicillin 500mg Kapsul", kategori: "Antibiotik", stok: 80, satuan: "Kapsul", minStok: 150, expiredDate: "2026-11-15", hargaSatuan: 3000, lokasiDepo: "Depo Central", produsen: "Kimia Farma" },
    { id: "3", kodeObat: "FAR-003", namaObat: "Omeprazole 20mg Kapsul", kategori: "Antasida & Antiulkus", stok: 620, satuan: "Kapsul", minStok: 100, expiredDate: "2028-05-20", hargaSatuan: 4000, lokasiDepo: "Depo Rawat Jalan", produsen: "Dexa Medica" },
    { id: "4", kodeObat: "FAR-004", namaObat: "Cefadroxil 500mg Kapsul", kategori: "Antibiotik", stok: 45, satuan: "Kapsul", minStok: 100, expiredDate: "2026-10-30", hargaSatuan: 5500, lokasiDepo: "Depo IGD", produsen: "Sanbe" },
    { id: "5", kodeObat: "FAR-005", namaObat: "Cefotaxime 1g Injeksi", kategori: "Injeksi / Parenteral", stok: 310, satuan: "Vial", minStok: 50, expiredDate: "2027-08-10", hargaSatuan: 22000, lokasiDepo: "Depo Rawat Inap", produsen: "Phapros" },
    { id: "6", kodeObat: "FAR-006", namaObat: "Cetirizine 10mg Tablet", kategori: "Antihistamin", stok: 890, satuan: "Tablet", minStok: 150, expiredDate: "2027-04-12", hargaSatuan: 1200, lokasiDepo: "Depo Rawat Jalan", produsen: "Indofarma" },
    { id: "7", kodeObat: "FAR-007", namaObat: "Metformin 500mg Tablet", kategori: "Antidiabetes", stok: 1200, satuan: "Tablet", minStok: 300, expiredDate: "2028-01-15", hargaSatuan: 800, lokasiDepo: "Depo Rawat Jalan", produsen: "Kalbe Farma" }
];

const INITIAL_RESEP: ResepItem[] = [
    {
        id: "rsp-1",
        noResep: "RSP-2026-0891",
        namaPasien: "Budi Santoso",
        norm: "RM-2026-0041",
        umur: "45 Thn",
        penjamin: "BPJS Kesehatan",
        dokter: "dr. Andi Prasetyo, Sp.PD",
        poli: "Poli Penyakit Dalam",
        depoTujuan: "Depo Rawat Jalan",
        waktu: "09:15 WIB",
        status: "Masuk",
        alergiPasien: ["Penisilin"],
        peringatanInteraksi: ["Pantau efek samping lambung dari penggunaan bersamaan."],
        daftarObat: [
            { nama: "Paracetamol 500mg Tablet", jumlah: 10, satuan: "Tablet", dosis: "500mg", aturan: "3 x 1 tablet sesudah makan", stokTersedia: 1450, hargaSatuan: 1500 },
            { nama: "Omeprazole 20mg Kapsul", jumlah: 7, satuan: "Kapsul", dosis: "20mg", aturan: "2 x 1 kapsul sebelum makan", stokTersedia: 620, hargaSatuan: 4000 }
        ]
    },
    {
        id: "rsp-2",
        noResep: "RSP-2026-0892",
        namaPasien: "Siti Rahma",
        norm: "RM-2026-0042",
        umur: "6 Thn",
        penjamin: "Umum",
        dokter: "dr. Maya Kartika, Sp.A",
        poli: "Poli Anak",
        depoTujuan: "Depo Rawat Jalan",
        waktu: "09:30 WIB",
        status: "Verifikasi",
        daftarObat: [
            { nama: "Racikan Puyer Batuk Pilek Anak (Paracetamol + CTM)", jumlah: 12, satuan: "Bungkus", dosis: "1 Puyer", aturan: "3 x 1 puyer sesudah makan", stokTersedia: 50, hargaSatuan: 3500 }
        ]
    },
    {
        id: "rsp-3",
        noResep: "RSP-2026-0889",
        namaPasien: "Dewi Lestari",
        norm: "RM-2026-0038",
        umur: "52 Thn",
        penjamin: "Asuransi Swasta",
        dokter: "dr. Rian Ramadhan, Sp.JP",
        poli: "Poli Jantung",
        depoTujuan: "Depo Rawat Jalan",
        waktu: "08:45 WIB",
        status: "Diproses",
        daftarObat: [
            { nama: "Cetirizine 10mg Tablet", jumlah: 10, satuan: "Tablet", dosis: "10mg", aturan: "1 x 1 tablet malam hari", stokTersedia: 890, hargaSatuan: 1200 }
        ]
    },
    {
        id: "rsp-4",
        noResep: "RSP-2026-0885",
        namaPasien: "Ahmad Dahlan",
        norm: "RM-2026-0029",
        umur: "60 Thn",
        penjamin: "BPJS Kesehatan",
        dokter: "dr. Hendra Kurniawan, Sp.B",
        poli: "Poli Bedah",
        depoTujuan: "Depo IGD",
        waktu: "08:10 WIB",
        status: "Siap Ambil",
        daftarObat: [
            { nama: "Cefotaxime 1g Injeksi", jumlah: 2, satuan: "Vial", dosis: "1g", aturan: "2 x 1 vial i.v", stokTersedia: 310, hargaSatuan: 22000 }
        ]
    }
];

export default function FarmasiPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") || "dashboard") as FarmasiTab;

    const setTab = (tab: string) => {
        if (tab === "dashboard") setSearchParams({});
        else setSearchParams({ tab });
    };

    const [resepList, setResepList] = useState<ResepItem[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("simrs_farmasi_resep_list");
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { /* ignore fallback */ }
            }
        }
        return INITIAL_RESEP;
    });

    const [stokList, setStokList] = useState<StokObatItem[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("simrs_farmasi_stok_list");
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { /* ignore fallback */ }
            }
        }
        return INITIAL_STOK;
    });

    // Custom Alert State
    const [alertState, setAlertState] = useState<{ isOpen: boolean; title?: string; message: string; type?: AlertType }>({
        isOpen: false,
        message: ""
    });

    const showAlert = (message: string, title?: string, type: AlertType = "success") => {
        setAlertState({ isOpen: true, message, title, type });
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("simrs_farmasi_resep_list", JSON.stringify(resepList));
        }
    }, [resepList]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("simrs_farmasi_stok_list", JSON.stringify(stokList));
        }
    }, [stokList]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepo, setSelectedDepo] = useState<string>("Semua Depo");
    const [selectedStatus, setSelectedStatus] = useState<string>("Semua Status");
    const [selectedResep, setSelectedResep] = useState<ResepItem | null>(null);
    const [isVerifikasiModalOpen, setIsVerifikasiModalOpen] = useState(false);
    const [catatanApotekerInput, setCatatanApotekerInput] = useState("");

    // State Modal Tambah Stok Baru
    const [isTambahStokOpen, setIsTambahStokOpen] = useState(false);
    const [newStokForm, setNewStokForm] = useState({
        kodeObat: "",
        namaObat: "",
        kategori: "Analgesik & Antipiretik",
        stok: 100,
        satuan: "Tablet",
        minStok: 50,
        expiredDate: "2027-12-31",
        hargaSatuan: 2000,
        lokasiDepo: "Depo Rawat Jalan",
        produsen: "Kalbe Farma"
    });

    // State Kalkulator Racikan
    const [racikanForm, setRacikanForm] = useState<FormulaRacikan>({
        id: "racik-1",
        namaRacikan: "Puyer Batuk Pilek Anak",
        jenisRacikan: "Puyer",
        jumlahBungkus: 10,
        aturanPakai: "3 x 1 bungkus sesudah makan",
        jasaRacik: 5000,
        bahanList: [
            { namaObat: "Paracetamol 500mg Tablet", dosisTarget: "125 mg", jumlahBahan: 2.5, satuan: "Tablet" },
            { namaObat: "Cetirizine 10mg Tablet", dosisTarget: "2.5 mg", jumlahBahan: 2.5, satuan: "Tablet" }
        ]
    });

    // Filtering Resep
    const filteredResepList = resepList.filter(r => {
        const matchesSearch =
            r.namaPasien.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.noResep.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.norm.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepo = selectedDepo === "Semua Depo" || r.depoTujuan === selectedDepo;
        const matchesStatus = selectedStatus === "Semua Status" || r.status === selectedStatus;
        return matchesSearch && matchesDepo && matchesStatus;
    });

    // Filtering Stok
    const filteredStok = stokList.filter(s =>
        s.namaObat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.kodeObat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.kategori.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const syncResepToBillingAndStock = (resep: ResepItem) => {
        if (typeof window === "undefined") return;

        // 1. Kurangi stok obat di Farmasi & Logistik jika ada obat
        setStokList(prevStok => {
            const nextStok = prevStok.map(item => {
                const matchInResep = resep.daftarObat.find(o => o.nama.toLowerCase().includes(item.namaObat.toLowerCase()) || item.namaObat.toLowerCase().includes(o.nama.toLowerCase()));
                if (matchInResep) {
                    const newQty = Math.max(0, item.stok - matchInResep.jumlah);
                    return { ...item, stok: newQty };
                }
                return item;
            });
            return nextStok;
        });

        // 2. Generate / update Tagihan Billing Kasir
        try {
            const rawBilling = localStorage.getItem("simrs_billing_tagihan_list");
            let billingList: any[] = rawBilling ? JSON.parse(rawBilling) : [];
            const existingBill = billingList.find((b: any) => b.noResepRef === resep.noResep || b.norm === resep.norm);

            const obatItems = resep.daftarObat.map((o, idx) => ({
                id: `itm-far-${Date.now()}-${idx}`,
                kategori: "Farmasi / Obat",
                namaItem: `${o.nama} (${o.jumlah} ${o.satuan})`,
                jumlah: o.jumlah,
                satuan: o.satuan,
                tarifSatuan: o.hargaSatuan,
                subtotal: o.jumlah * o.hargaSatuan,
                statusJurnal: "Pending"
            }));

            const totalObat = obatItems.reduce((acc, curr) => acc + curr.subtotal, 0);

            if (existingBill) {
                // Tambahkan rincian obat jika belum ada
                const otherItems = existingBill.items.filter((it: any) => it.kategori !== "Farmasi / Obat");
                existingBill.items = [...otherItems, ...obatItems];
                existingBill.totalBiaya = existingBill.items.reduce((acc: number, it: any) => acc + it.subtotal, 0);
                existingBill.sisaTagihan = Math.max(0, existingBill.totalBiaya - (existingBill.totalSudahBayar || 0));
                existingBill.noResepRef = resep.noResep;
            } else {
                const newBill = {
                    id: `bill-${Date.now()}`,
                    noBilling: `BILL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                    noNota: `KW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                    noResepRef: resep.noResep,
                    noRegistrasi: `REG-${resep.norm}`,
                    pasien: resep.namaPasien,
                    norm: resep.norm,
                    umur: resep.umur,
                    layanan: resep.poli,
                    dokterPemeriksa: resep.dokter,
                    penjamin: resep.penjamin,
                    totalBiaya: totalObat + 50000, // Biaya obat + administrasi/konsultasi poli
                    totalSudahBayar: resep.penjamin === "BPJS Kesehatan" ? (totalObat + 50000) : 0,
                    sisaTagihan: resep.penjamin === "BPJS Kesehatan" ? 0 : (totalObat + 50000),
                    status: resep.penjamin === "BPJS Kesehatan" ? "Lunas" : "Belum Bayar",
                    tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
                    jam: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
                    metodePembayaran: resep.penjamin === "BPJS Kesehatan" ? "BPJS Direct" : undefined,
                    items: [
                        { id: `itm-adm-${Date.now()}`, kategori: "Tindakan / Konsultasi", namaItem: `Konsultasi & Pemeriksaan ${resep.poli}`, jumlah: 1, satuan: "Kunjungan", tarifSatuan: 50000, subtotal: 50000 },
                        ...obatItems
                    ]
                };
                billingList = [newBill, ...billingList];
            }
            localStorage.setItem("simrs_billing_tagihan_list", JSON.stringify(billingList));
        } catch (e) {
            console.error("Gagal sinkron billing kasir:", e);
        }
    };

    const updateResepStatus = (id: string, newStatus: ResepItem["status"], catatan?: string) => {
        setResepList(prev =>
            prev.map(r => {
                if (r.id === id) {
                    const updated = {
                        ...r,
                        status: newStatus,
                        catatanApoteker: catatan !== undefined ? catatan : r.catatanApoteker,
                        apotekerVerifikator: newStatus !== "Masuk" ? "apt. Bambang S., S.Farm" : r.apotekerVerifikator
                    };
                    if (newStatus === "Siap Ambil" || newStatus === "Selesai") {
                        syncResepToBillingAndStock(updated);
                    }
                    return updated;
                }
                return r;
            })
        );
    };

    const handleOpenVerifikasi = (resep: ResepItem) => {
        setSelectedResep(resep);
        setCatatanApotekerInput(resep.catatanApoteker || "");
        setIsVerifikasiModalOpen(true);
    };

    const handleSaveTambahStok = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem: StokObatItem = {
            id: `stk-${Date.now()}`,
            ...newStokForm
        };
        setStokList(prev => [newItem, ...prev]);
        setIsTambahStokOpen(false);
        setNewStokForm({
            kodeObat: "",
            namaObat: "",
            kategori: "Analgesik & Antipiretik",
            stok: 100,
            satuan: "Tablet",
            minStok: 50,
            expiredDate: "2027-12-31",
            hargaSatuan: 2000,
            lokasiDepo: "Depo Rawat Jalan",
            produsen: "Kalbe Farma"
        });
        showAlert("Stok obat baru berhasil ditambahkan!", "Stok Ditambahkan", "success");
    };

    return (
        <AppShell>
            <CustomAlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />
            <div className="space-y-6">
                {/* Banner Header Gradient */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white shadow-lg">
                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                                    <PillBottle className="h-3.5 w-3.5" /> Depo Farmasi Central & E-Prescribing
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-bold text-emerald-200 border border-emerald-300/30">
                                    <Sparkles className="h-3 w-3" /> Real-Time Live Sync
                                </span>
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                Manajemen Farmasi & Depo Obat
                            </h1>
                            <p className="max-w-2xl text-xs text-blue-100 sm:text-sm">
                                Pusat verifikasi E-Prescribing, kontrol keamanan obat (alergi & interaksi), dispensing etiket digital, dan manajemen persediaan stok rumah sakit.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setTab("resep")}
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-md transition-all hover:bg-blue-50 active:scale-95 cursor-pointer"
                            >
                                <ClipboardList className="h-4 w-4 text-blue-600" />
                                Lihat Resep Masuk ({resepList.filter(r => r.status === "Masuk").length})
                            </button>
                            <button
                                onClick={() => setTab("stok")}
                                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-900/40 px-4 py-2.5 text-xs font-bold text-white border border-white/20 backdrop-blur-sm transition-all hover:bg-indigo-900/60 active:scale-95 cursor-pointer"
                            >
                                <Boxes className="h-4 w-4" />
                                Inventori Stok
                            </button>
                        </div>
                    </div>

                    <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200/80 pb-2 text-xs font-semibold">
                    <button
                        onClick={() => setTab("dashboard")}
                        className={cn(
                            "flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer",
                            activeTab === "dashboard" || !searchParams.get("tab")
                                ? "bg-blue-600 text-white shadow-xs font-bold"
                                : "text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        <LayoutDashboard className="h-4 w-4" /> Ringkasan & Kanban Resep
                    </button>
                    <button
                        onClick={() => setTab("resep")}
                        className={cn(
                            "flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer",
                            activeTab === "resep"
                                ? "bg-blue-600 text-white shadow-xs font-bold"
                                : "text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        <ClipboardList className="h-4 w-4" /> E-Prescribing & Verifikasi
                        <span className="ml-1 rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-black text-slate-900">
                            {resepList.filter(r => r.status === "Masuk" || r.status === "Verifikasi").length}
                        </span>
                    </button>
                    <button
                        onClick={() => setTab("dispensing")}
                        className={cn(
                            "flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer",
                            activeTab === "dispensing"
                                ? "bg-blue-600 text-white shadow-xs font-bold"
                                : "text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        <PillBottle className="h-4 w-4" /> Penyiapan & Etiket
                    </button>
                    <button
                        onClick={() => setTab("racikan")}
                        className={cn(
                            "flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer",
                            activeTab === "racikan"
                                ? "bg-blue-600 text-white shadow-xs font-bold"
                                : "text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        <Syringe className="h-4 w-4" /> Formularium Racikan
                    </button>
                    <button
                        onClick={() => setTab("stok")}
                        className={cn(
                            "flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer",
                            activeTab === "stok"
                                ? "bg-blue-600 text-white shadow-xs font-bold"
                                : "text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        <Boxes className="h-4 w-4" /> Stok Obat & Depo
                        {stokList.filter(s => s.stok <= s.minStok).length > 0 && (
                            <span className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                                {stokList.filter(s => s.stok <= s.minStok).length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setTab("retur")}
                        className={cn(
                            "flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer",
                            activeTab === "retur"
                                ? "bg-blue-600 text-white shadow-xs font-bold"
                                : "text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        <Boxes className="h-4 w-4" /> Retur & Kadaluarsa
                    </button>
                    <button
                        onClick={() => setTab("pio")}
                        className={cn(
                            "flex items-center gap-2 rounded-xl px-4 py-2 transition-all whitespace-nowrap cursor-pointer",
                            activeTab === "pio"
                                ? "bg-blue-600 text-white shadow-xs font-bold"
                                : "text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        <PillBottle className="h-4 w-4" /> PIO & Rekonsiliasi
                    </button>
                </div>

                {/* TAB 1: DASHBOARD & KANBAN STATUS RESEP */}
                {(activeTab === "dashboard" || !searchParams.get("tab")) && (
                    <TabDashboardFarmasi
                        resepList={resepList}
                        stokCountKritis={stokList.filter(s => s.stok <= s.minStok).length}
                        stokTotalCount={stokList.length}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedDepo={selectedDepo}
                        setSelectedDepo={setSelectedDepo}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        filteredResepList={filteredResepList}
                        onOpenVerifikasi={handleOpenVerifikasi}
                        onUpdateResepStatus={updateResepStatus}
                    />
                )}

                {/* TAB 2 & 3: E-PRESCRIBING, VERIFIKASI & DISPENSING DETAIL */}
                {(activeTab === "resep" || activeTab === "dispensing") && (
                    <TabResepDispensing
                        filteredResepList={filteredResepList}
                        setSearchQuery={setSearchQuery}
                        onOpenVerifikasi={handleOpenVerifikasi}
                        onUpdateResepStatus={updateResepStatus}
                        onShowAlert={showAlert}
                    />
                )}

                {/* TAB 4: OBAT RACIKAN & FORMULARIUM */}
                {activeTab === "racikan" && (
                    <TabRacikanFormularium
                        racikanForm={racikanForm}
                        setRacikanForm={setRacikanForm}
                        onShowAlert={showAlert}
                    />
                )}

                {/* TAB 5: MANAJEMEN STOK OBAT & INVENTORI */}
                {activeTab === "stok" && (
                    <TabStokInventori
                        stokList={stokList}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filteredStok={filteredStok}
                        onOpenTambahStok={() => setIsTambahStokOpen(true)}
                    />
                )}

                {/* TAB 6 & 7: RETUR & PIO */}
                {(activeTab === "retur" || activeTab === "pio") && (
                    <TabReturPIO activeTab={activeTab} />
                )}
            </div>

            {/* MODAL VERIFIKASI APOTEKER */}
            <ModalVerifikasiApoteker
                isOpen={isVerifikasiModalOpen}
                onClose={() => setIsVerifikasiModalOpen(false)}
                selectedResep={selectedResep}
                catatanApotekerInput={catatanApotekerInput}
                setCatatanApotekerInput={setCatatanApotekerInput}
                onUpdateResepStatus={updateResepStatus}
            />

            {/* MODAL TAMBAH STOK OBAT BARU */}
            <ModalTambahStokObat
                isOpen={isTambahStokOpen}
                onClose={() => setIsTambahStokOpen(false)}
                newStokForm={newStokForm}
                setNewStokForm={setNewStokForm}
                onSaveTambahStok={handleSaveTambahStok}
            />
        </AppShell>
    );
}
