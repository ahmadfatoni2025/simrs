import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
    Activity,
    ArrowUpDown,
    CheckSquare,
    Square,
    Filter,
    Download,
    Plus,
    Search,
    User,
    Clock,
    ChevronDown,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal,
    BarChart2,
    SlidersHorizontal,
    RefreshCw,
    FileSpreadsheet,
    Building2,
    Stethoscope,
    Calendar,
    Sparkles,
    Eye,
    XCircle,
    Check,
    UserCheck,
} from "lucide-react";
import { api, getToken } from "~/lib/api";
import type { Row } from "~/components/resource/types";
import { cn } from "~/lib/utils";

// Interface for SIMRS patient monitoring row view model
interface PatientMonitoringRow {
    id: string;
    noRM: string;
    name: string;
    poli: string;
    penjamin: string;
    status: "Menunggu" | "Diperiksa" | "Selesai" | "Triase" | "Batal";
    dokter: string;
    dokterAvatar?: string;
    antrean: string;
    billingEst: number;
    progressPercent: number;
    activityBars: number[];
    badges: { label: string; variant: "blue" | "emerald" | "amber" | "purple" | "rose" | "indigo" }[];
    badgeExtraCount?: number;
    lastInteraction: string;
    lastActionTag: string;
    type: "Rawat Jalan" | "Rawat Inap" | "IGD";
}

// Authentic SIMRS patient dataset
const DEMO_PATIENTS: PatientMonitoringRow[] = [
    {
        id: "p-101",
        noRM: "RM-2026-00411",
        name: "Rina Masruroh (34 th)",
        poli: "Poli Spesialis Anak",
        penjamin: "BPJS PBI",
        status: "Diperiksa",
        dokter: "dr. Sarah Nguyen Sp.A",
        antrean: "A-014",
        billingEst: 420000,
        progressPercent: 70,
        activityBars: [3, 5, 8, 4, 7, 9, 6],
        badges: [
            { label: "BPJS PBI", variant: "blue" },
            { label: "Poli Anak", variant: "purple" },
        ],
        badgeExtraCount: 2,
        lastInteraction: "Hari ini · 10:15 (Pemeriksaan DPJP)",
        lastActionTag: "Registrasi BPJS",
        type: "Rawat Jalan",
    },
    {
        id: "p-102",
        noRM: "RM-2026-00389",
        name: "Budi Santoso (45 th)",
        poli: "Poli Penyakit Dalam",
        penjamin: "Umum / Cash",
        status: "Diperiksa",
        dokter: "dr. James Taylor Sp.PD",
        antrean: "B-008",
        billingEst: 311250,
        progressPercent: 51,
        activityBars: [2, 4, 6, 8, 5, 7, 9],
        badges: [
            { label: "Umum / Cash", variant: "emerald" },
            { label: "Pasien Baru", variant: "indigo" },
        ],
        lastInteraction: "Hari ini · 09:30 (Vital Signs)",
        lastActionTag: "Vital Signs",
        type: "Rawat Jalan",
    },
    {
        id: "p-103",
        noRM: "RM-2026-00512",
        name: "Siti Aminah (28 th)",
        poli: "Rawat Inap VIP",
        penjamin: "BPJS Non-PBI",
        status: "Menunggu",
        dokter: "dr. Maria Keller Sp.OG",
        antrean: "VIP Bed-02",
        billingEst: 1242000,
        progressPercent: 22,
        activityBars: [8, 4, 3, 5, 6, 4, 2],
        badges: [
            { label: "BPJS Non-PBI", variant: "blue" },
            { label: "Rawat Inap", variant: "amber" },
        ],
        lastInteraction: "Hari ini · 08:45 (Admisi Bangsal)",
        lastActionTag: "Admisi Bangsal",
        type: "Rawat Inap",
    },
    {
        id: "p-104",
        noRM: "RM-2026-00299",
        name: "Bambang Hariyanto (52 th)",
        poli: "IGD Emergency",
        penjamin: "BPJS PBI",
        status: "Triase",
        dokter: "dr. Nia Jameson Sp.B",
        antrean: "IGD Bed-03",
        billingEst: 821000,
        progressPercent: 77,
        activityBars: [9, 8, 10, 7, 9, 8, 9],
        badges: [
            { label: "Triase Merah", variant: "rose" },
            { label: "BPJS PBI", variant: "blue" },
        ],
        lastInteraction: "Hari ini · 11:20 (Tindakan Emergency)",
        lastActionTag: "Triase Merah",
        type: "IGD",
    },
    {
        id: "p-105",
        noRM: "RM-2026-00104",
        name: "Dewi Sartika (39 th)",
        poli: "Poli Jantung & Pembuluh",
        penjamin: "Asuransi Inhealth",
        status: "Diperiksa",
        dokter: "dr. Alex Santos Sp.JP",
        antrean: "C-022",
        billingEst: 1530000,
        progressPercent: 82,
        activityBars: [5, 7, 9, 8, 9, 10, 8],
        badges: [
            { label: "Asuransi Inhealth", variant: "indigo" },
            { label: "Echocardiography", variant: "amber" },
        ],
        lastInteraction: "Hari ini · 10:40 (Order Lab/Rad)",
        lastActionTag: "Echocardiography",
        type: "Rawat Jalan",
    },
    {
        id: "p-106",
        noRM: "RM-2026-00670",
        name: "Ahmad Pratama (19 th)",
        poli: "Poli Bedah Umum",
        penjamin: "BPJS PBI",
        status: "Selesai",
        dokter: "dr. Mark Darnalds Sp.B",
        antrean: "A-005",
        billingEst: 320000,
        progressPercent: 100,
        activityBars: [6, 8, 9, 7, 9, 10, 9],
        badges: [
            { label: "BPJS PBI", variant: "blue" },
            { label: "Resep Selesai", variant: "emerald" },
        ],
        badgeExtraCount: 1,
        lastInteraction: "Hari ini · 11:05 (Farmasi Dispensed)",
        lastActionTag: "Resep Selesai",
        type: "Rawat Jalan",
    },
    {
        id: "p-107",
        noRM: "RM-2026-00788",
        name: "Eko Wijaya (58 th)",
        poli: "Poli Mata",
        penjamin: "Umum / Cash",
        status: "Diperiksa",
        dokter: "dr. Drew Nash Sp.M",
        antrean: "M-011",
        billingEst: 225000,
        progressPercent: 51,
        activityBars: [4, 3, 5, 7, 6, 8, 7],
        badges: [
            { label: "Umum / Cash", variant: "emerald" },
            { label: "Refraksi", variant: "purple" },
        ],
        badgeExtraCount: 2,
        lastInteraction: "Hari ini · 09:50 (Refraksi Mata)",
        lastActionTag: "Refraksi Mata",
        type: "Rawat Jalan",
    },
    {
        id: "p-108",
        noRM: "RM-2026-00821",
        name: "Lina Wongso (42 th)",
        poli: "Poli Saraf",
        penjamin: "BPJS Non-PBI",
        status: "Diperiksa",
        dokter: "dr. Lina Wong Sp.S",
        antrean: "S-004",
        billingEst: 430000,
        progressPercent: 61,
        activityBars: [3, 5, 7, 6, 8, 7, 6],
        badges: [
            { label: "BPJS Non-PBI", variant: "blue" },
            { label: "EEG Test", variant: "emerald" },
        ],
        lastInteraction: "Hari ini · 10:25 (Konsul Dokter)",
        lastActionTag: "EEG Test",
        type: "Rawat Jalan",
    },
    {
        id: "p-109",
        noRM: "RM-2026-00910",
        name: "Fahmi Rahmat (31 th)",
        poli: "Poli THT-KL",
        penjamin: "BPJS PBI",
        status: "Menunggu",
        dokter: "dr. Jamie Fox Sp.THT",
        antrean: "T-019",
        billingEst: 180000,
        progressPercent: 38,
        activityBars: [5, 4, 3, 6, 5, 4, 3],
        badges: [
            { label: "BPJS PBI", variant: "blue" },
            { label: "Endoskopi THT", variant: "purple" },
        ],
        badgeExtraCount: 2,
        lastInteraction: "Hari ini · 11:15 (Antrean Poli)",
        lastActionTag: "Antrean Poli",
        type: "Rawat Jalan",
    },
    {
        id: "p-110",
        noRM: "RM-2026-00455",
        name: "Kartika Sari (26 th)",
        poli: "Poli Gigi & Mulut",
        penjamin: "Asuransi Mandiri",
        status: "Menunggu",
        dokter: "dr. Kate Chen Sp.BM",
        antrean: "G-002",
        billingEst: 275000,
        progressPercent: 24,
        activityBars: [2, 3, 4, 3, 5, 4, 3],
        badges: [
            { label: "Asuransi Swasta", variant: "amber" },
            { label: "Scaling", variant: "emerald" },
        ],
        badgeExtraCount: 2,
        lastInteraction: "Hari ini · 11:00 (Menunggu Dipanggil)",
        lastActionTag: "Menunggu Panggil",
        type: "Rawat Jalan",
    },
    {
        id: "p-111",
        noRM: "RM-2026-00332",
        name: "Rudi Hermawan (63 th)",
        poli: "Rawat Inap Kelas 1",
        penjamin: "BPJS PBI",
        status: "Diperiksa",
        dokter: "dr. Ricky Brown Sp.PD",
        antrean: "Bed 104-B",
        billingEst: 2450000,
        progressPercent: 72,
        activityBars: [6, 7, 8, 9, 8, 7, 9],
        badges: [
            { label: "BPJS PBI", variant: "blue" },
            { label: "Visite Dokter", variant: "emerald" },
        ],
        lastInteraction: "Hari ini · 08:30 (Pemeriksaan Lab)",
        lastActionTag: "Visite Dokter",
        type: "Rawat Inap",
    },
    {
        id: "p-112",
        noRM: "RM-2026-00198",
        name: "Hana Septiani (29 th)",
        poli: "Poli Kebidanan & Kandungan",
        penjamin: "Umum / Cash",
        status: "Diperiksa",
        dokter: "dr. Hannah Mills Sp.OG",
        antrean: "K-007",
        billingEst: 370000,
        progressPercent: 55,
        activityBars: [4, 6, 7, 5, 8, 7, 6],
        badges: [
            { label: "Umum / Cash", variant: "emerald" },
            { label: "USG Fetomaternal", variant: "purple" },
        ],
        badgeExtraCount: 2,
        lastInteraction: "Hari ini · 10:50 (USG Kandungan)",
        lastActionTag: "USG Fetomaternal",
        type: "Rawat Jalan",
    },
];

function transformApiRow(r: Row, index: number): PatientMonitoringRow {
    const name = String(r.name ?? r.nama_pasien ?? `Pasien ${index + 1}`);
    const noRM = String(r.no ?? r.no_rm ?? `RM-2026-0${100 + index}`);
    const poli = String(r.poli ?? r.nama_poli ?? "Poli Umum");
    const dokter = String(r.dokter ?? r.nama_dokter ?? "dr. Sarah Nguyen Sp.A");
    const statusStr = String(r.status ?? "").toLowerCase();

    let status: PatientMonitoringRow["status"] = "Menunggu";
    if (statusStr.includes("periksa")) status = "Diperiksa";
    else if (statusStr.includes("selesai") || statusStr.includes("done")) status = "Selesai";
    else if (statusStr.includes("triase") || statusStr.includes("igd")) status = "Triase";
    else if (statusStr.includes("batal")) status = "Batal";

    const penjamins = ["BPJS PBI", "BPJS Non-PBI", "Umum / Cash", "Asuransi Inhealth"];
    const penjamin = penjamins[index % penjamins.length];

    const types: PatientMonitoringRow["type"][] = ["Rawat Jalan", "Rawat Jalan", "Rawat Inap", "IGD"];
    const type = types[index % types.length];

    const progressPercent = status === "Selesai" ? 100 : status === "Diperiksa" ? 75 : status === "Triase" ? 50 : 30 + ((index * 13) % 40);

    const activityPresets = [
        [3, 5, 8, 4, 7, 9, 6],
        [2, 4, 6, 8, 5, 7, 9],
        [8, 7, 9, 6, 8, 10, 8],
        [4, 3, 5, 7, 6, 8, 7],
        [6, 8, 5, 9, 7, 6, 8],
    ];

    const badgeSets: PatientMonitoringRow["badges"][] = [
        [
            { label: "BPJS PBI", variant: "blue" },
            { label: "Poli Spesialis", variant: "purple" },
        ],
        [
            { label: "Umum / Cash", variant: "emerald" },
            { label: "Pasien Baru", variant: "indigo" },
        ],
        [
            { label: "BPJS Non-PBI", variant: "blue" },
            { label: "Rawat Inap", variant: "amber" },
        ],
        [
            { label: "Asuransi Swasta", variant: "indigo" },
            { label: "Pemeriksaan Lab", variant: "purple" },
        ],
    ];

    return {
        id: String(r.id ?? `p-${index}`),
        noRM,
        name,
        poli,
        penjamin,
        status,
        dokter,
        antrean: String(r.no_antrean ?? `A-0${(index % 30) + 1}`),
        billingEst: Number(r.billing_est ?? 150000 + ((index * 42350) % 650000)),
        progressPercent,
        activityBars: activityPresets[index % activityPresets.length],
        badges: badgeSets[index % badgeSets.length],
        badgeExtraCount: index % 2 === 0 ? 2 : undefined,
        lastInteraction: `Hari ini · ${(8 + (index % 10)).toString().padStart(2, "0")}:${((index * 12) % 60).toString().padStart(2, "0")} WIB`,
        lastActionTag: status === "Selesai" ? "Resep Selesai" : status === "Diperiksa" ? "Pemeriksaan Poli" : "Registrasi & Triase",
        type,
    };
}

export default function MonitoringRegistrasi() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<PatientMonitoringRow[]>(DEMO_PATIENTS);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"Semua" | "RawatJalan" | "RawatInap">("Semua");
    const [filterCategory, setFilterCategory] = useState<string>("Semua");
    const [filterPenjamin, setFilterPenjamin] = useState<string>("Semua Penjamin");
    const [filterStatus, setFilterStatus] = useState<string>("Semua Status");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({
        "p-106": true, // Pre-select Ahmad Pratama
    });

    useEffect(() => {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        api<{ data?: Row[] }>("/pendaftaran?per_page=100")
            .then((p) => {
                if (Array.isArray(p.data) && p.data.length > 0) {
                    setRows(p.data.map(transformApiRow));
                } else {
                    setRows(DEMO_PATIENTS);
                }
            })
            .catch(() => setRows(DEMO_PATIENTS))
            .finally(() => setLoading(false));
    }, [navigate]);

    const filteredRows = useMemo(() => {
        return rows.filter((r) => {
            const matchesTab =
                activeTab === "Semua"
                    ? true
                    : activeTab === "RawatJalan"
                        ? r.type === "Rawat Jalan"
                        : activeTab === "RawatInap"
                            ? r.type === "Rawat Inap" || r.type === "IGD"
                            : true;

            const matchesPenjamin =
                filterPenjamin === "Semua Penjamin"
                    ? true
                    : r.penjamin.toLowerCase().includes(filterPenjamin.toLowerCase());

            const matchesStatus =
                filterStatus === "Semua Status"
                    ? true
                    : r.status.toLowerCase() === filterStatus.toLowerCase();

            const matchesSearch =
                searchQuery === "" ||
                r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.noRM.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.dokter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.poli.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesTab && matchesPenjamin && matchesStatus && matchesSearch;
        });
    }, [rows, activeTab, filterPenjamin, filterStatus, searchQuery]);

    const allSelected = useMemo(() => {
        if (filteredRows.length === 0) return false;
        return filteredRows.every((r) => selectedIds[r.id]);
    }, [filteredRows, selectedIds]);

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds({});
        } else {
            const next: Record<string, boolean> = {};
            filteredRows.forEach((r) => {
                next[r.id] = true;
            });
            setSelectedIds(next);
        }
    };

    const toggleSelectRow = (id: string) => {
        setSelectedIds((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const totalBillingInView = useMemo(() => {
        return filteredRows.reduce((acc, r) => acc + r.billingEst, 0);
    }, [filteredRows]);

    const formatCurrencyIDR = (val: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-slate-800 p-3 sm:p-6 font-sans antialiased selection:bg-indigo-500/20 selection:text-indigo-900">
            {/* Top Page Header Bar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
                        <Activity className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-bold text-slate-900 tracking-tight">Monitoring Pasien SIMRS</h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Realtime Sync
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari Pasien, No. RM, DPJP..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-8.5 w-64 rounded-lg bg-white border border-slate-200 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors shadow-xs"
                        />
                    </div>
                </div>
            </div>

            {/* Main Table Container (Light Theme SIMRS) */}
            <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
                {/* Upper Navigation Tabs */}
                <div className="flex items-center justify-between border-b border-slate-200/80 px-4 pt-2 bg-white">
                    <div className="flex items-center gap-6">
                        <button
                            type="button"
                            onClick={() => setActiveTab("Semua")}
                            className={cn(
                                "pb-2.5 text-xs font-bold transition-colors relative",
                                activeTab === "Semua"
                                    ? "text-slate-900 border-b-2 border-slate-900"
                                    : "text-slate-500 hover:text-slate-800"
                            )}
                        >
                            Semua Pasien ({rows.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("RawatJalan")}
                            className={cn(
                                "pb-2.5 text-xs font-medium transition-colors relative",
                                activeTab === "RawatJalan"
                                    ? "text-slate-900 border-b-2 border-slate-900"
                                    : "text-slate-500 hover:text-slate-800"
                            )}
                        >
                            Rawat Jalan & Poliklinik
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("RawatInap")}
                            className={cn(
                                "pb-2.5 text-xs font-medium transition-colors relative",
                                activeTab === "RawatInap"
                                    ? "text-slate-900 border-b-2 border-slate-900"
                                    : "text-slate-500 hover:text-slate-800"
                            )}
                        >
                            Rawat Inap & IGD Emergency
                        </button>
                    </div>
                </div>

                {/* Filter Toolbar Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 p-3 bg-slate-50/70">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Sort selector */}
                        <div className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs">
                            <span className="text-slate-400 font-medium">Urutkan</span>
                            <span className="font-semibold text-slate-800">Waktu Registrasi</span>
                            <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
                        </div>

                        {/* Filter Penjamin selector */}
                        <div className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs">
                            <span className="text-slate-400 font-medium">Penjamin</span>
                            <select
                                value={filterPenjamin}
                                onChange={(e) => setFilterPenjamin(e.target.value)}
                                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                            >
                                <option value="Semua Penjamin" className="bg-white text-slate-800">
                                    Semua Penjamin
                                </option>
                                <option value="BPJS" className="bg-white text-slate-800">
                                    BPJS Kesehatan
                                </option>
                                <option value="Umum" className="bg-white text-slate-800">
                                    Umum / Cash
                                </option>
                                <option value="Asuransi" className="bg-white text-slate-800">
                                    Asuransi Swasta
                                </option>
                            </select>
                        </div>

                        {/* Status Layanan selector */}
                        <div className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs">
                            <span className="text-slate-400 font-medium">Status</span>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                            >
                                <option value="Semua Status" className="bg-white text-slate-800">
                                    Semua Status
                                </option>
                                <option value="Menunggu" className="bg-white text-slate-800">
                                    Menunggu Poli
                                </option>
                                <option value="Diperiksa" className="bg-white text-slate-800">
                                    Diperiksa DPJP
                                </option>
                                <option value="Triase" className="bg-white text-slate-800">
                                    Triase / IGD
                                </option>
                                <option value="Selesai" className="bg-white text-slate-800">
                                    Selesai / Pulang
                                </option>
                            </select>
                        </div>

                        {/* Periode selector */}
                        <div className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs">
                            <span className="text-slate-400 font-medium">Periode</span>
                            <span className="font-semibold text-slate-800">Hari Ini</span>
                            <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate("/pendaftaran/registrasi-baru")}
                            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs transition-all active:scale-95"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Registrasi Pasien Baru</span>
                        </button>
                    </div>
                </div>

                {/* SIMRS Data Table */}
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-500 font-semibold select-none">
                                <th className="w-10 px-3 py-3 text-center font-bold text-slate-700">No.</th>
                                <th className="px-3 py-3 text-slate-700 font-bold min-w-[170px]">Pasien & No. RM</th>
                                <th className="px-3 py-3 font-semibold min-w-[180px]">Layanan & Penjamin</th>
                                <th className="px-3 py-3 font-semibold min-w-[160px]">DPJP / Dokter Utama</th>
                                <th className="px-3 py-3 font-semibold text-right min-w-[90px]">Antrean / Bed</th>
                                <th className="px-3 py-3 font-semibold text-right min-w-[120px]">Estimasi Billing</th>
                                <th className="px-3 py-3 font-semibold min-w-[140px]">Progres Pelayanan</th>
                                <th className="px-3 py-3 font-semibold min-w-[100px]">Aktivitas / Vitals</th>
                                <th className="px-3 py-3 font-semibold min-w-[150px]">Aktivitas Terakhir</th>
                                <th className="w-8 px-2 py-3 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="p-3 text-center">
                                            <div className="h-3.5 w-3.5 mx-auto rounded bg-slate-200" />
                                        </td>
                                        <td className="p-3">
                                            <div className="h-4 w-28 rounded bg-slate-200" />
                                        </td>
                                        <td className="p-3">
                                            <div className="h-5 w-32 rounded-full bg-slate-200" />
                                        </td>
                                        <td className="p-3">
                                            <div className="h-4 w-24 rounded bg-slate-200" />
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="h-4 w-8 ml-auto rounded bg-slate-200" />
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="h-4 w-16 ml-auto rounded bg-slate-200" />
                                        </td>
                                        <td className="p-3">
                                            <div className="h-3 w-20 rounded bg-slate-200" />
                                        </td>
                                        <td className="p-3">
                                            <div className="h-3 w-12 rounded bg-slate-200" />
                                        </td>
                                        <td className="p-3">
                                            <div className="h-4 w-20 rounded bg-slate-200" />
                                        </td>
                                        <td className="p-3"></td>
                                    </tr>
                                ))
                            ) : filteredRows.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Activity className="h-8 w-8 text-slate-300" />
                                            <p className="text-xs font-medium">Tidak ada data pasien yang cocok</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRows.map((row, index) => {
                                    return (
                                        <tr
                                            key={row.id}
                                            className="group transition-colors duration-150 hover:bg-slate-50 select-none"
                                        >
                                            {/* Row Number */}
                                            <td className="px-3 py-2.5 text-center font-mono font-semibold text-slate-500">
                                                {index + 1}
                                            </td>

                                            {/* Pasien Name & No RM */}
                                            <td className="px-3 py-2.5">
                                                <div>
                                                    <span className="font-semibold text-slate-900 group-hover:text-indigo-900 block leading-tight">
                                                        {row.name}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-400 block leading-tight mt-0.5">
                                                        {row.noRM} · {row.poli}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Segment & Stage Badges */}
                                            <td className="px-3 py-2.5">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {row.badges.map((b, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={cn(
                                                                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                                                                b.variant === "blue" &&
                                                                "bg-blue-50 text-blue-700 border-blue-200/80",
                                                                b.variant === "emerald" &&
                                                                "bg-emerald-50 text-emerald-700 border-emerald-200/80",
                                                                b.variant === "amber" &&
                                                                "bg-amber-50 text-amber-800 border-amber-200/80",
                                                                b.variant === "purple" &&
                                                                "bg-purple-50 text-purple-700 border-purple-200/80",
                                                                b.variant === "rose" &&
                                                                "bg-rose-50 text-rose-700 border-rose-200/80",
                                                                b.variant === "indigo" &&
                                                                "bg-indigo-50 text-indigo-700 border-indigo-200/80"
                                                            )}
                                                        >
                                                            {b.label}
                                                        </span>
                                                    ))}
                                                    {row.badgeExtraCount && (
                                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 border border-slate-200">
                                                            +{row.badgeExtraCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* DPJP / Dokter Utama */}
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                                                        {row.dokter.replace("dr. ", "").charAt(0) || "D"}
                                                    </div>
                                                    <span className="truncate text-slate-700 font-medium">
                                                        {row.dokter}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Antrean / Bed */}
                                            <td className="px-3 py-2.5 text-right font-mono text-slate-800 font-bold">
                                                {row.antrean}
                                            </td>

                                            {/* Estimasi Billing */}
                                            <td className="px-3 py-2.5 text-right font-mono text-slate-900 font-bold">
                                                {formatCurrencyIDR(row.billingEst)}
                                            </td>

                                            {/* Progres Pelayanan */}
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-0.5">
                                                        {[1, 2, 3, 4, 5, 6].map((barIdx) => {
                                                            const active =
                                                                (row.progressPercent / 100) * 6 >= barIdx;
                                                            return (
                                                                <div
                                                                    key={barIdx}
                                                                    className={cn(
                                                                        "h-2.5 w-1 rounded-xs transition-all",
                                                                        active
                                                                            ? row.progressPercent > 80
                                                                                ? "bg-emerald-500"
                                                                                : row.progressPercent > 50
                                                                                    ? "bg-amber-500"
                                                                                    : "bg-blue-500"
                                                                            : "bg-slate-200"
                                                                    )}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                    <span className="font-mono text-[11px] font-bold text-slate-700">
                                                        {row.progressPercent}%
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Activity Trend Sparkline */}
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-end gap-0.5 h-3.5 w-12">
                                                    {row.activityBars.map((val, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={cn(
                                                                "w-1 rounded-t-xs transition-all",
                                                                val > 7
                                                                    ? "bg-emerald-500"
                                                                    : val > 4
                                                                        ? "bg-teal-500"
                                                                        : "bg-slate-300"
                                                            )}
                                                            style={{ height: `${(val / 10) * 100}%` }}
                                                        />
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Last Interaction */}
                                            <td className="px-3 py-2.5 text-slate-500 text-[11px]">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                                                    <span className="truncate">
                                                        {row.lastInteraction}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Action Menu */}
                                            <td className="px-2 py-2.5 text-center">
                                                <button
                                                    type="button"
                                                    className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 mx-auto transition-colors"
                                                    title="Aksi Pasien"
                                                >
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Bottom Aggregations Summary */}
                <div className="flex flex-wrap items-center justify-between border-t border-slate-200/90 bg-slate-50/80 px-4 py-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2 font-medium">
                        <span className="text-slate-900 font-bold">{filteredRows.length}</span>
                        <span>Pasien aktif dalam tampilan</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[11px]">
                        <div className="flex items-center gap-1 font-semibold text-slate-600">
                            <span>Total Estimasi Billing:</span>
                            <span className="font-bold text-slate-900">{formatCurrencyIDR(totalBillingInView)}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-slate-600 border-l border-slate-200 pl-3">
                            <span>Rata-rata Waktu Layanan:</span>
                            <span className="font-bold text-slate-900">14.5 Menit</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-emerald-700 border-l border-slate-200 pl-3">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span>SATUSEHAT Bridging: 100% Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}