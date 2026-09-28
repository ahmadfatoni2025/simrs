import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
    Award,
    Briefcase,
    Calendar,
    CalendarClock,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
    Edit3,
    Eye,
    FileText,
    Filter,
    GraduationCap,
    Hash,
    ListFilter,
    MapPin,
    Phone,
    Pill,
    Plus,
    Search,
    Shield,
    Stethoscope,
    Tag,
    Trash2,
    UserCheck,
    UserMinus,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { api, getToken } from "~/lib/api";
import { cn } from "~/lib/utils";

// ─────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────

type DokterStatus = "Praktik" | "Cuti" | "Izin" | "Non-Aktif";
type ViewMode = "grid" | "table" | "matrix";
type ModalMode = "view" | "add" | "edit" | null;

interface JadwalSlot {
    hari: string;
    jamMulai: string;
    jamSelesai: string;
    kuota: number;
    terisi: number;
}

interface Dokter {
    id: number | string;
    nama: string;
    gelar: string;
    spesialisasi: string;
    subSpesialisasi?: string;
    poli: string;
    ruang: string;
    sip: string;
    str: string;
    noTelepon: string;
    email: string;
    foto?: string;
    status: DokterStatus;
    jadwal: JadwalSlot[];
    penjamin: string[];
    catatan?: string;
    dokterPengganti?: string;
    joinDate: string;
    lastActive: string;
}

// ─────────────────────────────────────────────────────
// DEFAULT / SAMPLE DATA
// ─────────────────────────────────────────────────────

const DEFAULT_DOKTER: Dokter[] = [
    {
        id: 1,
        nama: "Hendra Wijaya",
        gelar: "dr. Hendra Wijaya, Sp.PD",
        spesialisasi: "Spesialis Penyakit Dalam",
        subSpesialisasi: "Gastroenterologi-Hepatologi",
        poli: "Poli Penyakit Dalam",
        ruang: "Poliklinik Lt. 2 (Ruang 204)",
        sip: "SIP.449/102/IDI/2024",
        str: "STR.31.2.1.0034.2024",
        noTelepon: "0812-3456-7890",
        email: "hendra.wijaya@simrs.id",
        status: "Praktik",
        jadwal: [
            { hari: "Senin", jamMulai: "08:00", jamSelesai: "12:00", kuota: 25, terisi: 18 },
            { hari: "Rabu", jamMulai: "08:00", jamSelesai: "12:00", kuota: 25, terisi: 22 },
            { hari: "Jumat", jamMulai: "08:00", jamSelesai: "12:00", kuota: 25, terisi: 15 },
        ],
        penjamin: ["BPJS", "Umum", "Asuransi"],
        joinDate: "2020-03-15",
        lastActive: "2026-09-28",
    },
    {
        id: 2,
        nama: "Sarah Melati",
        gelar: "drg. Sarah Melati, Sp.KGA",
        spesialisasi: "Spesialis Kedokteran Gigi Anak",
        poli: "Poli Gigi",
        ruang: "Poliklinik Lt. 1 (Ruang 105)",
        sip: "SIP.512/088/PDGI/2023",
        str: "STR.31.2.2.0112.2023",
        noTelepon: "0813-9876-5432",
        email: "sarah.melati@simrs.id",
        status: "Praktik",
        jadwal: [
            { hari: "Selasa", jamMulai: "13:00", jamSelesai: "16:30", kuota: 15, terisi: 12 },
            { hari: "Kamis", jamMulai: "13:00", jamSelesai: "16:30", kuota: 15, terisi: 9 },
            { hari: "Sabtu", jamMulai: "09:00", jamSelesai: "12:00", kuota: 10, terisi: 8 },
        ],
        penjamin: ["BPJS", "Umum"],
        joinDate: "2021-06-01",
        lastActive: "2026-09-27",
    },
    {
        id: 3,
        nama: "Dewi Lestari",
        gelar: "dr. Dewi Lestari, Sp.A",
        spesialisasi: "Spesialis Anak",
        subSpesialisasi: "Neonatologi",
        poli: "Poli Anak",
        ruang: "Poliklinik Lt. 1 (Ruang 102)",
        sip: "SIP.331/094/IDAI/2024",
        str: "STR.31.2.3.0078.2024",
        noTelepon: "0811-2233-4455",
        email: "dewi.lestari@simrs.id",
        status: "Praktik",
        jadwal: [
            { hari: "Senin", jamMulai: "09:00", jamSelesai: "14:00", kuota: 30, terisi: 28 },
            { hari: "Selasa", jamMulai: "09:00", jamSelesai: "14:00", kuota: 30, terisi: 25 },
            { hari: "Rabu", jamMulai: "09:00", jamSelesai: "14:00", kuota: 30, terisi: 20 },
            { hari: "Kamis", jamMulai: "09:00", jamSelesai: "14:00", kuota: 30, terisi: 27 },
            { hari: "Jumat", jamMulai: "09:00", jamSelesai: "14:00", kuota: 30, terisi: 18 },
        ],
        penjamin: ["BPJS", "Umum", "Asuransi"],
        joinDate: "2019-01-10",
        lastActive: "2026-09-28",
    },
    {
        id: 4,
        nama: "Ahmad Ridwan",
        gelar: "dr. Ahmad Ridwan, Sp.B",
        spesialisasi: "Spesialis Bedah Umum",
        poli: "Poli Bedah",
        ruang: "Poliklinik Lt. 2 (Ruang 208)",
        sip: "SIP.219/042/IKABI/2022",
        str: "STR.31.2.4.0045.2022",
        noTelepon: "0815-5566-7788",
        email: "ahmad.ridwan@simrs.id",
        status: "Cuti",
        dokterPengganti: "dr. Budi Raharjo, Sp.B",
        jadwal: [
            { hari: "Senin", jamMulai: "10:00", jamSelesai: "13:00", kuota: 15, terisi: 5 },
            { hari: "Kamis", jamMulai: "10:00", jamSelesai: "13:00", kuota: 15, terisi: 3 },
        ],
        penjamin: ["BPJS", "Umum"],
        catatan: "Cuti hingga 15 Oktober 2026. Digantikan oleh dr. Budi Raharjo, Sp.B.",
        joinDate: "2018-08-20",
        lastActive: "2026-09-20",
    },
    {
        id: 5,
        nama: "Rina Suryani",
        gelar: "dr. Rina Suryani, Sp.OG",
        spesialisasi: "Spesialis Kebidanan & Kandungan",
        subSpesialisasi: "Fetomaternal",
        poli: "Poli Kebidanan & Kandungan",
        ruang: "Poliklinik Lt. 1 (Ruang 108)",
        sip: "SIP.604/119/POGI/2025",
        str: "STR.31.2.5.0091.2025",
        noTelepon: "0817-8899-0011",
        email: "rina.suryani@simrs.id",
        status: "Praktik",
        jadwal: [
            { hari: "Rabu", jamMulai: "08:30", jamSelesai: "12:30", kuota: 20, terisi: 10 },
            { hari: "Jumat", jamMulai: "08:30", jamSelesai: "12:30", kuota: 20, terisi: 16 },
            { hari: "Sabtu", jamMulai: "09:00", jamSelesai: "12:00", kuota: 15, terisi: 7 },
        ],
        penjamin: ["BPJS", "Umum", "Asuransi"],
        joinDate: "2022-02-14",
        lastActive: "2026-09-28",
    },
    {
        id: 6,
        nama: "Budi Raharjo",
        gelar: "dr. Budi Raharjo, Sp.B",
        spesialisasi: "Spesialis Bedah Umum",
        poli: "Poli Bedah",
        ruang: "Poliklinik Lt. 2 (Ruang 208)",
        sip: "SIP.720/055/IKABI/2025",
        str: "STR.31.2.6.0103.2025",
        noTelepon: "0818-1122-3344",
        email: "budi.raharjo@simrs.id",
        status: "Praktik",
        jadwal: [
            { hari: "Selasa", jamMulai: "10:00", jamSelesai: "14:00", kuota: 20, terisi: 11 },
            { hari: "Jumat", jamMulai: "10:00", jamSelesai: "14:00", kuota: 20, terisi: 8 },
        ],
        penjamin: ["BPJS", "Umum"],
        catatan: "Pengganti dr. Ahmad Ridwan (Cuti) untuk hari Senin & Kamis.",
        joinDate: "2023-07-01",
        lastActive: "2026-09-28",
    },
    {
        id: 7,
        nama: "Fitri Handayani",
        gelar: "dr. Fitri Handayani, M.Kes",
        spesialisasi: "Dokter Umum",
        poli: "Poli Umum",
        ruang: "Poliklinik Lt. 1 (Ruang 101)",
        sip: "SIP.888/201/IDI/2025",
        str: "STR.31.1.7.0201.2025",
        noTelepon: "0819-5566-7788",
        email: "fitri.handayani@simrs.id",
        status: "Izin",
        jadwal: [
            { hari: "Senin", jamMulai: "08:00", jamSelesai: "14:00", kuota: 40, terisi: 0 },
            { hari: "Selasa", jamMulai: "08:00", jamSelesai: "14:00", kuota: 40, terisi: 0 },
            { hari: "Rabu", jamMulai: "08:00", jamSelesai: "14:00", kuota: 40, terisi: 0 },
            { hari: "Kamis", jamMulai: "08:00", jamSelesai: "14:00", kuota: 40, terisi: 0 },
            { hari: "Jumat", jamMulai: "08:00", jamSelesai: "14:00", kuota: 40, terisi: 0 },
        ],
        penjamin: ["BPJS", "Umum"],
        catatan: "Izin dinas luar kota (seminar) 28-30 September 2026",
        joinDate: "2024-01-15",
        lastActive: "2026-09-27",
    },
];

const HARI_ALL = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const HARI_FILTER = ["Semua Hari", ...HARI_ALL];
const POLI_FILTER = [
    "Semua Poli",
    "Poli Umum",
    "Poli Penyakit Dalam",
    "Poli Gigi",
    "Poli Anak",
    "Poli Bedah",
    "Poli Kebidanan & Kandungan",
];
const STATUS_FILTER = ["Semua Status", "Praktik", "Cuti", "Izin", "Non-Aktif"];
const PENJAMIN_OPTIONS = ["BPJS", "Umum", "Asuransi"];

// ─────────────────────────────────────────────────────
// STATUS COLOR MAP (sesuai DESAGIN.md palette)
// ─────────────────────────────────────────────────────

const STATUS_COLORS: Record<DokterStatus, {
    bg: string;
    text: string;
    border: string;
    dot: string;
    banner: string;
}> = {
    Praktik: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        banner: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    Cuti: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
        banner: "bg-amber-100 text-amber-700 border-amber-200",
    },
    Izin: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        dot: "bg-blue-500",
        banner: "bg-blue-100 text-blue-700 border-blue-200",
    },
    "Non-Aktif": {
        bg: "bg-slate-50",
        text: "text-slate-500",
        border: "border-slate-200",
        dot: "bg-slate-400",
        banner: "bg-slate-100 text-slate-500 border-slate-200",
    },
};

// ─────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────

function getInitials(name: string): string {
    return name
        .replace(/^(dr|drg|Prof)\.\s*/gi, "")
        .split(" ")
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");
}

function getTotalKuota(jadwal: JadwalSlot[]): number {
    return jadwal.reduce((a, j) => a + j.kuota, 0);
}

function getTotalTerisi(jadwal: JadwalSlot[]): number {
    return jadwal.reduce((a, j) => a + j.terisi, 0);
}

function getKuotaPercentage(jadwal: JadwalSlot[]): number {
    const total = getTotalKuota(jadwal);
    if (total === 0) return 0;
    return Math.round((getTotalTerisi(jadwal) / total) * 100);
}

// ─────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────

export default function ManajemenDokterPage() {
    const navigate = useNavigate();

    // Data & UI state
    const [dokterList, setDokterList] = useState<Dokter[]>(DEFAULT_DOKTER);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPoli, setSelectedPoli] = useState("Semua Poli");
    const [selectedHari, setSelectedHari] = useState("Semua Hari");
    const [selectedStatus, setSelectedStatus] = useState("Semua Status");

    // Modal state
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedDokter, setSelectedDokter] = useState<Dokter | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | number | null>(null);

    // Form state for add/edit
    const [formNama, setFormNama] = useState("");
    const [formGelar, setFormGelar] = useState("");
    const [formSpesialisasi, setFormSpesialisasi] = useState("");
    const [formSubSpesialisasi, setFormSubSpesialisasi] = useState("");
    const [formPoli, setFormPoli] = useState("Poli Umum");
    const [formRuang, setFormRuang] = useState("");
    const [formSip, setFormSip] = useState("");
    const [formStr, setFormStr] = useState("");
    const [formTelepon, setFormTelepon] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formStatus, setFormStatus] = useState<DokterStatus>("Praktik");
    const [formPenjamin, setFormPenjamin] = useState<string[]>(["BPJS", "Umum"]);
    const [formCatatan, setFormCatatan] = useState("");
    const [formDokterPengganti, setFormDokterPengganti] = useState("");
    const [formJadwal, setFormJadwal] = useState<JadwalSlot[]>([
        { hari: "Senin", jamMulai: "08:00", jamSelesai: "12:00", kuota: 20, terisi: 0 },
    ]);

    // ─── API FETCH ───
    useEffect(() => {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        api<{ data?: Record<string, unknown>[] }>("/master-data/dokter")
            .then((res) => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    // Map backend data if available
                }
            })
            .catch(() => undefined)
            .finally(() => setLoading(false));
    }, [navigate]);

    // ─── COMPUTED STATS ───
    const totalDokter = dokterList.length;
    const dokterPraktik = dokterList.filter((d) => d.status === "Praktik").length;
    const dokterCutiIzin = dokterList.filter((d) => d.status === "Cuti" || d.status === "Izin").length;
    const totalKuotaHarian = dokterList.reduce((a, d) => a + getTotalKuota(d.jadwal), 0);
    const totalTerisiHarian = dokterList.reduce((a, d) => a + getTotalTerisi(d.jadwal), 0);

    // ─── FILTER LOGIC ───
    const filteredDokter = useMemo(() => {
        return dokterList.filter((doc) => {
            const matchesPoli = selectedPoli === "Semua Poli" || doc.poli.toLowerCase() === selectedPoli.toLowerCase();
            const matchesHari = selectedHari === "Semua Hari" || doc.jadwal.some((j) => j.hari === selectedHari);
            const matchesStatus = selectedStatus === "Semua Status" || doc.status === selectedStatus;
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                doc.nama.toLowerCase().includes(q) ||
                doc.gelar.toLowerCase().includes(q) ||
                doc.spesialisasi.toLowerCase().includes(q) ||
                doc.poli.toLowerCase().includes(q) ||
                doc.sip.toLowerCase().includes(q);

            return matchesPoli && matchesHari && matchesStatus && matchesSearch;
        });
    }, [dokterList, selectedPoli, selectedHari, selectedStatus, searchQuery]);

    // ─── FORM HANDLERS ───
    const resetForm = () => {
        setFormNama("");
        setFormGelar("");
        setFormSpesialisasi("");
        setFormSubSpesialisasi("");
        setFormPoli("Poli Umum");
        setFormRuang("");
        setFormSip("");
        setFormStr("");
        setFormTelepon("");
        setFormEmail("");
        setFormStatus("Praktik");
        setFormPenjamin(["BPJS", "Umum"]);
        setFormCatatan("");
        setFormDokterPengganti("");
        setFormJadwal([{ hari: "Senin", jamMulai: "08:00", jamSelesai: "12:00", kuota: 20, terisi: 0 }]);
    };

    const openAddModal = () => {
        resetForm();
        setModalMode("add");
        setSelectedDokter(null);
    };

    const openEditModal = (doc: Dokter) => {
        setFormNama(doc.nama);
        setFormGelar(doc.gelar);
        setFormSpesialisasi(doc.spesialisasi);
        setFormSubSpesialisasi(doc.subSpesialisasi || "");
        setFormPoli(doc.poli);
        setFormRuang(doc.ruang);
        setFormSip(doc.sip);
        setFormStr(doc.str);
        setFormTelepon(doc.noTelepon);
        setFormEmail(doc.email);
        setFormStatus(doc.status);
        setFormPenjamin([...doc.penjamin]);
        setFormCatatan(doc.catatan || "");
        setFormDokterPengganti(doc.dokterPengganti || "");
        setFormJadwal(doc.jadwal.map((j) => ({ ...j })));
        setSelectedDokter(doc);
        setModalMode("edit");
    };

    const openViewModal = (doc: Dokter) => {
        setSelectedDokter(doc);
        setModalMode("view");
    };

    const closeModal = () => {
        setModalMode(null);
        setSelectedDokter(null);
    };

    const handleSaveDokter = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formNama.trim() || !formGelar.trim()) return;

        const today = new Date().toISOString().split("T")[0];

        if (modalMode === "add") {
            const newDoc: Dokter = {
                id: Date.now(),
                nama: formNama,
                gelar: formGelar,
                spesialisasi: formSpesialisasi || "Dokter Umum",
                subSpesialisasi: formSubSpesialisasi || undefined,
                poli: formPoli,
                ruang: formRuang || `${formPoli} (Ruang Utama)`,
                sip: formSip || `SIP.XXX/SIMRS/${new Date().getFullYear()}`,
                str: formStr || `STR.XX.X.X.XXXX.${new Date().getFullYear()}`,
                noTelepon: formTelepon,
                email: formEmail,
                status: formStatus,
                jadwal: formJadwal.filter((j) => j.hari),
                penjamin: formPenjamin,
                catatan: formCatatan || undefined,
                dokterPengganti: formDokterPengganti || undefined,
                joinDate: today,
                lastActive: today,
            };
            setDokterList((prev) => [newDoc, ...prev]);
        } else if (modalMode === "edit" && selectedDokter) {
            setDokterList((prev) =>
                prev.map((d) =>
                    d.id === selectedDokter.id
                        ? {
                            ...d,
                            nama: formNama,
                            gelar: formGelar,
                            spesialisasi: formSpesialisasi,
                            subSpesialisasi: formSubSpesialisasi || undefined,
                            poli: formPoli,
                            ruang: formRuang,
                            sip: formSip,
                            str: formStr,
                            noTelepon: formTelepon,
                            email: formEmail,
                            status: formStatus,
                            jadwal: formJadwal.filter((j) => j.hari),
                            penjamin: formPenjamin,
                            catatan: formCatatan || undefined,
                            dokterPengganti: formDokterPengganti || undefined,
                            lastActive: today,
                        }
                        : d
                )
            );
        }

        closeModal();
    };

    const handleDeleteDokter = (id: string | number) => {
        setDokterList((prev) => prev.filter((d) => d.id !== id));
        setConfirmDeleteId(null);
        if (selectedDokter?.id === id) closeModal();
    };

    const handleStatusChange = (id: string | number, newStatus: DokterStatus) => {
        setDokterList((prev) =>
            prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
        );
    };

    const togglePenjaminForm = (p: string) => {
        setFormPenjamin((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );
    };

    const addJadwalSlot = () => {
        setFormJadwal((prev) => [
            ...prev,
            { hari: "Senin", jamMulai: "08:00", jamSelesai: "12:00", kuota: 20, terisi: 0 },
        ]);
    };

    const removeJadwalSlot = (idx: number) => {
        setFormJadwal((prev) => prev.filter((_, i) => i !== idx));
    };

    const updateJadwalSlot = (idx: number, field: keyof JadwalSlot, value: string | number) => {
        setFormJadwal((prev) =>
            prev.map((j, i) => (i === idx ? { ...j, [field]: value } : j))
        );
    };

    // ─────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────

    return (
        <AppShell>
            <div className="space-y-6">

                {/* ═══════════════════════════════════════════════════════
                    BANNER HEADER (DESAGIN.md gradient style)
                ═══════════════════════════════════════════════════════ */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 md:p-8 text-white shadow-lg">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-16 h-64 w-64 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20 shadow-2xs">
                                <Stethoscope className="h-3.5 w-3.5 text-blue-100" />
                                <span>Modul Manajemen Dokter & Jadwal Praktik SIMRS</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                Manajemen Dokter & Tenaga Medis
                            </h1>
                            <p className="text-sm text-blue-100/90 leading-relaxed">
                                Kelola profil dokter, jadwal praktik, kuota pasien, status kehadiran, SIP/STR, dan penjamin layanan secara terpusat dalam satu dashboard.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-blue-700 hover:bg-blue-50 active:scale-98 shadow-md transition-all shrink-0"
                        >
                            <UserPlus className="h-4 w-4 text-blue-600" /> Tambah Dokter Baru
                        </button>
                    </div>

                    {/* ── STATS BAR ── */}
                    <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-white/20 pt-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white border border-white/20 shadow-2xs">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-blue-100">Total Dokter Terdaftar</p>
                                <p className="text-sm font-extrabold text-white">{totalDokter} Dokter</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 shadow-2xs">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-blue-100">Dokter Aktif Praktik</p>
                                <p className="text-sm font-extrabold text-emerald-300">{dokterPraktik} Aktif</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-amber-200 border border-amber-300/30 shadow-2xs">
                                <UserMinus className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-blue-100">Cuti / Izin</p>
                                <p className="text-sm font-extrabold text-amber-200">{dokterCutiIzin} Dokter</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white border border-white/20 shadow-2xs">
                                <CalendarClock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-blue-100">Kapasitas Kuota Minggu Ini</p>
                                <p className="text-sm font-extrabold text-white">{totalTerisiHarian}/{totalKuotaHarian} Pasien</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════
                    FILTER & TOOLBAR
                ═══════════════════════════════════════════════════════ */}
                <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                    {/* Status Quick Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Status:</span>
                        {STATUS_FILTER.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setSelectedStatus(s)}
                                className={cn(
                                    "rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0",
                                    selectedStatus === s
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-3 flex-1">
                            {/* Search */}
                            <div className="relative min-w-[220px] flex-1 max-w-xs">
                                <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama dokter, spesialisasi, SIP..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>

                            {/* Poli filter */}
                            <div className="flex items-center gap-2">
                                <Filter className="h-3.5 w-3.5 text-slate-400" />
                                <select
                                    value={selectedPoli}
                                    onChange={(e) => setSelectedPoli(e.target.value)}
                                    className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                >
                                    {POLI_FILTER.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Hari filter */}
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                <select
                                    value={selectedHari}
                                    onChange={(e) => setSelectedHari(e.target.value)}
                                    className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                >
                                    {HARI_FILTER.map((h) => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* View mode */}
                        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60">
                            {([
                                { key: "grid" as ViewMode, icon: Users, label: "Kartu" },
                                { key: "table" as ViewMode, icon: ListFilter, label: "Tabel" },
                                { key: "matrix" as ViewMode, icon: CalendarClock, label: "Matriks" },
                            ]).map((v) => (
                                <button
                                    key={v.key}
                                    type="button"
                                    onClick={() => setViewMode(v.key)}
                                    className={cn(
                                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                                        viewMode === v.key
                                            ? "bg-white text-blue-600 shadow-2xs"
                                            : "text-slate-500 hover:text-slate-800"
                                    )}
                                >
                                    <v.icon className="h-3.5 w-3.5" /> {v.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs font-semibold text-slate-500 pt-1">
                        Menampilkan <strong>{filteredDokter.length}</strong> dari {dokterList.length} dokter
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════
                    CONTENT AREA
                ═══════════════════════════════════════════════════════ */}
                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
                        ))}
                    </div>
                ) : viewMode === "grid" ? (
                    /* ────── GRID VIEW ────── */
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredDokter.length === 0 ? (
                            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
                                <Stethoscope className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                                <p className="text-sm font-bold text-slate-700">Tidak ada dokter ditemukan</p>
                                <p className="text-xs text-slate-400 mt-0.5">Coba sesuaikan kata kunci pencarian atau filter.</p>
                            </div>
                        ) : (
                            filteredDokter.map((doc) => {
                                const pct = getKuotaPercentage(doc.jadwal);
                                const totalK = getTotalKuota(doc.jadwal);
                                const totalT = getTotalTerisi(doc.jadwal);
                                const sc = STATUS_COLORS[doc.status];

                                return (
                                    <div
                                        key={doc.id}
                                        className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md transition-all hover:border-blue-300"
                                    >
                                        <div>
                                            {/* Card header */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white font-extrabold text-sm shadow-md">
                                                        {getInitials(doc.gelar)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-sm font-extrabold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                                            {doc.gelar}
                                                        </h3>
                                                        <p className="text-xs font-semibold text-blue-600 truncate">
                                                            {doc.spesialisasi}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border shrink-0", sc.banner)}>
                                                    {doc.status}
                                                </span>
                                            </div>

                                            {/* Poli & Ruang */}
                                            <div className="mt-3.5 rounded-xl bg-slate-50/80 p-2.5 border border-slate-200/60 space-y-1">
                                                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="h-3 w-3 text-slate-400" />
                                                        {doc.poli}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 font-normal">{doc.ruang}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                    <span>
                                                        Jadwal: <strong>{doc.jadwal.length} hari/minggu</strong>
                                                        {doc.jadwal.length > 0 && (
                                                            <span className="text-slate-400 ml-1">
                                                                ({doc.jadwal[0].jamMulai} - {doc.jadwal[0].jamSelesai})
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Hari Praktik */}
                                            <div className="mt-3">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hari Praktik:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {HARI_ALL.map((h) => {
                                                        const scheduled = doc.jadwal.some((j) => j.hari === h);
                                                        return (
                                                            <span
                                                                key={h}
                                                                className={cn(
                                                                    "rounded-md px-2 py-0.5 text-[10px] font-bold border",
                                                                    scheduled
                                                                        ? "bg-blue-600 text-white border-blue-600"
                                                                        : "bg-slate-50 text-slate-300 border-slate-100"
                                                                )}
                                                            >
                                                                {h.substring(0, 3)}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Kuota Progress */}
                                            <div className="mt-4 space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-semibold text-slate-600">Kuota Pasien</span>
                                                    <span className="font-extrabold text-slate-900">
                                                        {totalT}/{totalK}
                                                        <span className="text-slate-400 font-normal ml-1">({pct}%)</span>
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/50">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-300",
                                                            pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"
                                                        )}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Penjamin Tags */}
                                            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                                {doc.penjamin.map((p) => (
                                                    <span
                                                        key={p}
                                                        className={cn(
                                                            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border",
                                                            p === "BPJS"
                                                                ? "bg-blue-50 text-blue-700 border-blue-200/80"
                                                                : p === "Umum"
                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                                                                    : "bg-slate-100 text-slate-700 border-slate-200/80"
                                                        )}
                                                    >
                                                        <Tag className="h-2.5 w-2.5" /> {p}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Pengganti Info (if Cuti/Izin) */}
                                            {(doc.status === "Cuti" || doc.status === "Izin") && doc.dokterPengganti && (
                                                <p className="mt-2 text-[11px] font-semibold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                                                    ⚠️ Pengganti: {doc.dokterPengganti}
                                                </p>
                                            )}
                                        </div>

                                        {/* Card Footer */}
                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                                                {doc.sip}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => openViewModal(doc)}
                                                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
                                                >
                                                    <Eye className="h-3 w-3" /> Detail
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(doc)}
                                                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 active:scale-98 transition-all shadow-md"
                                                >
                                                    <Edit3 className="h-3 w-3" /> Edit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                ) : viewMode === "table" ? (
                    /* ────── TABLE VIEW ────── */
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="p-3.5 font-extrabold text-slate-700">#</th>
                                        <th className="p-3.5 font-extrabold text-slate-700 min-w-[200px]">Nama Dokter</th>
                                        <th className="p-3.5 font-extrabold text-slate-700">Spesialisasi</th>
                                        <th className="p-3.5 font-extrabold text-slate-700">Poliklinik</th>
                                        <th className="p-3.5 font-extrabold text-slate-700 text-center">Status</th>
                                        <th className="p-3.5 font-extrabold text-slate-700 text-center">Jadwal</th>
                                        <th className="p-3.5 font-extrabold text-slate-700 text-center">Kuota</th>
                                        <th className="p-3.5 font-extrabold text-slate-700">SIP</th>
                                        <th className="p-3.5 font-extrabold text-slate-700 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredDokter.map((doc, idx) => {
                                        const sc = STATUS_COLORS[doc.status];
                                        const totalK = getTotalKuota(doc.jadwal);
                                        const totalT = getTotalTerisi(doc.jadwal);

                                        return (
                                            <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="p-3.5 text-slate-500 font-medium">{idx + 1}</td>
                                                <td className="p-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-[10px]">
                                                            {getInitials(doc.gelar)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-extrabold text-slate-900 truncate">{doc.gelar}</p>
                                                            <p className="text-[10px] text-slate-400">{doc.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3.5 font-semibold text-blue-600">{doc.spesialisasi}</td>
                                                <td className="p-3.5 font-medium text-slate-700">{doc.poli}</td>
                                                <td className="p-3.5 text-center">
                                                    <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border", sc.banner)}>
                                                        {doc.status}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-center">
                                                    <span className="text-xs font-bold text-slate-700">{doc.jadwal.length} hari</span>
                                                </td>
                                                <td className="p-3.5 text-center">
                                                    <span className="text-xs font-extrabold text-slate-900">{totalT}/{totalK}</span>
                                                </td>
                                                <td className="p-3.5 font-mono text-[10px] text-slate-400">{doc.sip}</td>
                                                <td className="p-3.5">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button type="button" onClick={() => openViewModal(doc)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors" title="Lihat Detail">
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button type="button" onClick={() => openEditModal(doc)} className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Edit Dokter">
                                                            <Edit3 className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button type="button" onClick={() => setConfirmDeleteId(doc.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors" title="Hapus Dokter">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* ────── MATRIX VIEW (Weekly Schedule) ────── */
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-blue-700 text-white">
                                        <th className="p-3.5 font-extrabold min-w-[220px]">Nama Dokter & Poli</th>
                                        {HARI_ALL.map((h) => (
                                            <th key={h} className="p-3.5 font-bold text-center border-l border-blue-600 min-w-[130px]">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {filteredDokter.map((doc) => {
                                        const sc = STATUS_COLORS[doc.status];
                                        return (
                                            <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="p-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-[10px]">
                                                            {getInitials(doc.gelar)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-extrabold text-slate-900 truncate">{doc.gelar}</p>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <p className="text-[11px] font-medium text-slate-500">{doc.poli}</p>
                                                                <span className={cn("rounded-full px-1.5 py-0 text-[9px] font-bold border", sc.banner)}>
                                                                    {doc.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                {HARI_ALL.map((h) => {
                                                    const slot = doc.jadwal.find((j) => j.hari === h);
                                                    return (
                                                        <td key={h} className="p-2.5 text-center border-l border-slate-100">
                                                            {slot ? (
                                                                <div className="rounded-xl bg-blue-50 border border-blue-200/80 p-2 text-center">
                                                                    <p className="font-extrabold text-blue-800 text-[11px]">
                                                                        {slot.jamMulai} - {slot.jamSelesai}
                                                                    </p>
                                                                    <p className="text-[10px] font-semibold text-blue-600 mt-0.5">
                                                                        {slot.terisi}/{slot.kuota} Pasien
                                                                    </p>
                                                                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                                                                        <div
                                                                            className={cn(
                                                                                "h-full rounded-full",
                                                                                slot.kuota > 0 && (slot.terisi / slot.kuota) >= 0.9
                                                                                    ? "bg-rose-500"
                                                                                    : slot.kuota > 0 && (slot.terisi / slot.kuota) >= 0.7
                                                                                        ? "bg-amber-500"
                                                                                        : "bg-blue-600"
                                                                            )}
                                                                            style={{ width: `${slot.kuota > 0 ? Math.round((slot.terisi / slot.kuota) * 100) : 0}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[11px] text-slate-300 font-medium">—</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════
                    VIEW DETAIL MODAL
                ═══════════════════════════════════════════════════════ */}
                {modalMode === "view" && selectedDokter && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
                        <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 border border-slate-100 my-8">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white font-extrabold text-lg shadow-md">
                                        {getInitials(selectedDokter.gelar)}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-extrabold text-slate-900">{selectedDokter.gelar}</h2>
                                        <p className="text-sm font-semibold text-blue-600">{selectedDokter.spesialisasi}</p>
                                        {selectedDokter.subSpesialisasi && (
                                            <p className="text-xs text-slate-400 mt-0.5">Sub: {selectedDokter.subSpesialisasi}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn("rounded-full px-3 py-1 text-xs font-extrabold border", STATUS_COLORS[selectedDokter.status].banner)}>
                                        {selectedDokter.status}
                                    </span>
                                    <button type="button" onClick={closeModal} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="mt-5 grid grid-cols-2 gap-4">
                                <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Poliklinik" value={selectedDokter.poli} />
                                <InfoRow icon={<Briefcase className="h-3.5 w-3.5" />} label="Ruang Praktik" value={selectedDokter.ruang} />
                                <InfoRow icon={<Award className="h-3.5 w-3.5" />} label="SIP" value={selectedDokter.sip} />
                                <InfoRow icon={<Shield className="h-3.5 w-3.5" />} label="STR" value={selectedDokter.str} />
                                <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Telepon" value={selectedDokter.noTelepon} />
                                <InfoRow icon={<FileText className="h-3.5 w-3.5" />} label="Email" value={selectedDokter.email} />
                                <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="Bergabung" value={selectedDokter.joinDate} />
                                <InfoRow icon={<Clock className="h-3.5 w-3.5" />} label="Terakhir Aktif" value={selectedDokter.lastActive} />
                            </div>

                            {/* Penjamin */}
                            <div className="mt-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Penjamin Diterima:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedDokter.penjamin.map((p) => (
                                        <span key={p} className={cn("rounded-full px-3 py-1 text-xs font-bold border",
                                            p === "BPJS" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                p === "Umum" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                    "bg-slate-100 text-slate-700 border-slate-200"
                                        )}>
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Jadwal Detail */}
                            <div className="mt-5 border-t border-slate-100 pt-4">
                                <p className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-1.5">
                                    <CalendarClock className="h-4 w-4 text-blue-600" /> Jadwal Praktik Mingguan
                                </p>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {selectedDokter.jadwal.map((j) => {
                                        const pct = j.kuota > 0 ? Math.round((j.terisi / j.kuota) * 100) : 0;
                                        return (
                                            <div key={j.hari} className="rounded-xl bg-blue-50 border border-blue-200/60 p-3 text-center">
                                                <p className="text-xs font-extrabold text-blue-800">{j.hari}</p>
                                                <p className="text-[11px] font-bold text-blue-600 mt-0.5">{j.jamMulai} - {j.jamSelesai}</p>
                                                <p className="text-[10px] font-semibold text-slate-500 mt-1">Kuota: {j.terisi}/{j.kuota}</p>
                                                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                                                    <div
                                                        className={cn("h-full rounded-full", pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-blue-600")}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Catatan */}
                            {selectedDokter.catatan && (
                                <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-xs font-semibold text-amber-800">
                                    <span className="font-extrabold">📋 Catatan:</span> {selectedDokter.catatan}
                                </div>
                            )}

                            {/* Pengganti */}
                            {selectedDokter.dokterPengganti && (
                                <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-xs font-semibold text-amber-800">
                                    <span className="font-extrabold">🔄 Dokter Pengganti:</span> {selectedDokter.dokterPengganti}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { closeModal(); openEditModal(selectedDokter); }}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 active:scale-98 shadow-md transition-all"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" /> Edit Profil Dokter
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmDeleteId(selectedDokter.id)}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                                    </button>
                                </div>
                                <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════
                    ADD / EDIT MODAL
                ═══════════════════════════════════════════════════════ */}
                {(modalMode === "add" || modalMode === "edit") && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
                        <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 border border-slate-100 my-8">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-base font-extrabold text-slate-900">
                                    {modalMode === "add" ? "Tambah Dokter Baru" : `Edit: ${selectedDokter?.gelar}`}
                                </h3>
                                <button type="button" onClick={closeModal} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveDokter} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                                {/* Nama & Gelar */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama Dokter *</label>
                                        <input type="text" required placeholder="cth: Hendra Wijaya" value={formNama} onChange={(e) => setFormNama(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Gelar Lengkap *</label>
                                        <input type="text" required placeholder="cth: dr. Hendra Wijaya, Sp.PD" value={formGelar} onChange={(e) => setFormGelar(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                                    </div>
                                </div>

                                {/* Spesialisasi & Sub */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Spesialisasi</label>
                                        <input type="text" placeholder="cth: Spesialis Penyakit Dalam" value={formSpesialisasi} onChange={(e) => setFormSpesialisasi(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sub-Spesialisasi</label>
                                        <input type="text" placeholder="cth: Gastroenterologi" value={formSubSpesialisasi} onChange={(e) => setFormSubSpesialisasi(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                                    </div>
                                </div>

                                {/* Poli & Ruang */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Poliklinik</label>
                                        <select value={formPoli} onChange={(e) => setFormPoli(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all">
                                            {POLI_FILTER.filter((p) => p !== "Semua Poli").map((p) => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Ruang Praktik</label>
                                        <input type="text" placeholder="cth: Poliklinik Lt. 2 (Ruang 204)" value={formRuang} onChange={(e) => setFormRuang(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                                    </div>
                                </div>

                                {/* SIP & STR */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Nomor SIP</label>
                                        <input type="text" placeholder="SIP.XXX/XXX/IDI/2026" value={formSip} onChange={(e) => setFormSip(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Nomor STR</label>
                                        <input type="text" placeholder="STR.31.2.X.XXXX.2026" value={formStr} onChange={(e) => setFormStr(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Telepon</label>
                                        <input type="text" placeholder="0812-XXXX-XXXX" value={formTelepon} onChange={(e) => setFormTelepon(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                                        <input type="email" placeholder="dokter@simrs.id" value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Status Dokter</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(["Praktik", "Cuti", "Izin", "Non-Aktif"] as DokterStatus[]).map((s) => {
                                            const sc = STATUS_COLORS[s];
                                            return (
                                                <button type="button" key={s} onClick={() => setFormStatus(s)}
                                                    className={cn("rounded-xl border py-2 px-3.5 text-xs font-bold transition-all",
                                                        formStatus === s
                                                            ? `${sc.bg} ${sc.text} ${sc.border} ring-2 ring-offset-1`
                                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                    )}
                                                    style={formStatus === s ? { "--tw-ring-color": sc.dot.replace("bg-", "") } as React.CSSProperties : {}}
                                                >
                                                    {s}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Penjamin */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Penjamin Diterima</label>
                                    <div className="flex flex-wrap gap-2">
                                        {PENJAMIN_OPTIONS.map((p) => (
                                            <button type="button" key={p} onClick={() => togglePenjaminForm(p)}
                                                className={cn("rounded-xl border py-2 px-3 text-xs font-bold transition-all",
                                                    formPenjamin.includes(p)
                                                        ? "border-blue-600 bg-blue-600 text-white"
                                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                )}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dokter Pengganti */}
                                {(formStatus === "Cuti" || formStatus === "Izin") && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Dokter Pengganti</label>
                                        <input type="text" placeholder="cth: dr. Budi Raharjo, Sp.B" value={formDokterPengganti} onChange={(e) => setFormDokterPengganti(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                                    </div>
                                )}

                                {/* Jadwal Slots */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-700">Jadwal Praktik</label>
                                        <button type="button" onClick={addJadwalSlot}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">
                                            <Plus className="h-3 w-3" /> Tambah Slot
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formJadwal.map((slot, idx) => (
                                            <div key={idx} className="flex flex-wrap items-end gap-2 rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                                                <div className="flex-1 min-w-[100px]">
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Hari</label>
                                                    <select value={slot.hari} onChange={(e) => updateJadwalSlot(idx, "hari", e.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:outline-none transition-all">
                                                        {HARI_ALL.map((h) => <option key={h} value={h}>{h}</option>)}
                                                    </select>
                                                </div>
                                                <div className="w-24">
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Mulai</label>
                                                    <input type="time" value={slot.jamMulai} onChange={(e) => updateJadwalSlot(idx, "jamMulai", e.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none transition-all" />
                                                </div>
                                                <div className="w-24">
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Selesai</label>
                                                    <input type="time" value={slot.jamSelesai} onChange={(e) => updateJadwalSlot(idx, "jamSelesai", e.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none transition-all" />
                                                </div>
                                                <div className="w-20">
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Kuota</label>
                                                    <input type="number" min={1} value={slot.kuota} onChange={(e) => updateJadwalSlot(idx, "kuota", Number(e.target.value))}
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none transition-all" />
                                                </div>
                                                {formJadwal.length > 1 && (
                                                    <button type="button" onClick={() => removeJadwalSlot(idx)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors" title="Hapus slot">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Catatan */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Catatan</label>
                                    <textarea rows={2} placeholder="Catatan tambahan tentang dokter..." value={formCatatan} onChange={(e) => setFormCatatan(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
                                </div>

                                {/* Submit */}
                                <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button type="button" onClick={closeModal}
                                        className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                                        Batal
                                    </button>
                                    <button type="submit"
                                        className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-md transition-all">
                                        {modalMode === "add" ? "Simpan Dokter Baru" : "Perbarui Data Dokter"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════
                    CONFIRM DELETE MODAL
                ═══════════════════════════════════════════════════════ */}
                {confirmDeleteId !== null && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
                        <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 border border-slate-100 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
                                <Trash2 className="h-7 w-7" />
                            </div>
                            <h3 className="text-base font-extrabold text-slate-900">Hapus Data Dokter?</h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Tindakan ini akan menghapus data dokter secara permanen dari sistem. Data yang sudah dihapus tidak dapat dikembalikan.
                            </p>
                            <div className="mt-5 flex justify-center gap-3">
                                <button type="button" onClick={() => setConfirmDeleteId(null)}
                                    className="rounded-xl border border-slate-300 px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                                    Batal
                                </button>
                                <button type="button" onClick={() => handleDeleteDokter(confirmDeleteId)}
                                    className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-500 shadow-md transition-all">
                                    Ya, Hapus Dokter
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AppShell>
    );
}

// ─────────────────────────────────────────────────────
// INFO ROW HELPER COMPONENT
// ─────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-2.5 rounded-xl bg-slate-50/80 p-2.5 border border-slate-200/60">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-xs font-bold text-slate-800 truncate">{value || "—"}</p>
            </div>
        </div>
    );
}
