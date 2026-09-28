import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    Bell,
    CheckCircle2,
    Clock,
    Filter,
    Phone,
    Plus,
    RotateCcw,
    Search,
    Stethoscope,
    Timer,
    UserX,
    Volume2,
    VolumeX,
    X,
    Sparkles,
    Calendar,
    Tag,
} from "lucide-react";
import { api, getToken } from "~/lib/api";
import type { Row } from "~/components/resource/types";
import { cn } from "~/lib/utils";
import { FeatureShell, StatCard } from "../ui/FeatureShell";

interface AntreanItem {
    id: string | number;
    no: string;
    name: string;
    poli: string;
    dokter: string;
    status: "Menunggu" | "Diperiksa" | "Selesai" | "Dilewati";
    loket: string;
    penjamin: "BPJS" | "Umum" | "Asuransi";
    waktu: string;
    callCount: number;
    lastCalledAt?: number;
}

const DEFAULT_ITEMS: AntreanItem[] = [
    {
        id: 1,
        no: "A-001",
        name: "Budi Santoso",
        poli: "Poli Umum",
        dokter: "dr. Hendra Wijaya",
        status: "Menunggu",
        loket: "Loket 1",
        penjamin: "BPJS",
        waktu: "08:15",
        callCount: 0,
    },
    {
        id: 2,
        no: "A-002",
        name: "Siti Aminah",
        poli: "Poli Umum",
        dokter: "dr. Hendra Wijaya",
        status: "Menunggu",
        loket: "Loket 1",
        penjamin: "Umum",
        waktu: "08:20",
        callCount: 0,
    },
    {
        id: 3,
        no: "B-001",
        name: "Rahmat Hidayat",
        poli: "Poli Gigi",
        dokter: "drg. Sarah Melati",
        status: "Diperiksa",
        loket: "Poli Gigi",
        penjamin: "BPJS",
        waktu: "08:05",
        callCount: 1,
        lastCalledAt: Date.now() - 60000,
    },
    {
        id: 4,
        no: "C-001",
        name: "Ananda Rizky",
        poli: "Poli Anak",
        dokter: "dr. Dewi Lestari, Sp.A",
        status: "Selesai",
        loket: "Poli Anak",
        penjamin: "Asuransi",
        waktu: "07:50",
        callCount: 1,
        lastCalledAt: Date.now() - 300000,
    },
    {
        id: 5,
        no: "A-003",
        name: "Dewi Kartika",
        poli: "Poli Penyakit Dalam",
        dokter: "dr. Bambang, Sp.PD",
        status: "Menunggu",
        loket: "Loket 2",
        penjamin: "BPJS",
        waktu: "08:30",
        callCount: 0,
    },
];

const POLI_OPTIONS = [
    "Semua Poli",
    "Poli Umum",
    "Poli Gigi",
    "Poli Anak",
    "Poli Penyakit Dalam",
    "Poli Kebidanan & Kandungan",
];

// Color palette mapping based on user request:
// - Menunggu: Abu-abu (Slate / Grey)
// - Pemeriksaan / Dipanggil: Biru (Blue)
// - Selesai: Hijau (Emerald / Green)
const COLUMNS: {
    key: "Menunggu" | "Diperiksa" | "Selesai";
    label: string;
    headerBg: string;
    badgeBg: string;
    badgeText: string;
    dotColor: string;
}[] = [
        {
            key: "Menunggu",
            label: "Menunggu",
            headerBg: "bg-slate-100/90 text-slate-800 border-slate-200",
            badgeBg: "bg-slate-200 text-slate-800",
            badgeText: "text-slate-700",
            dotColor: "bg-slate-500",
        },
        {
            key: "Diperiksa",
            label: "Pemeriksaan / Dipanggil",
            headerBg: "bg-blue-100/90 text-blue-900 border-blue-200",
            badgeBg: "bg-blue-200 text-blue-950 font-bold",
            badgeText: "text-blue-700",
            dotColor: "bg-blue-600",
        },
        {
            key: "Selesai",
            label: "Selesai Pelayanan",
            headerBg: "bg-emerald-100/90 text-emerald-900 border-emerald-200",
            badgeBg: "bg-emerald-200 text-emerald-950 font-bold",
            badgeText: "text-emerald-700",
            dotColor: "bg-emerald-600",
        },
    ];

export default function Antrean() {
    const navigate = useNavigate();
    const [items, setItems] = useState<AntreanItem[]>(DEFAULT_ITEMS);
    const [loading, setLoading] = useState(true);
    const [activeCalledItem, setActiveCalledItem] = useState<AntreanItem | null>(null);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [selectedPoli, setSelectedPoli] = useState("Semua Poli");
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form state for adding new ticket
    const [newNama, setNewNama] = useState("");
    const [newPoli, setNewPoli] = useState("Poli Umum");
    const [newDokter, setNewDokter] = useState("dr. Hendra Wijaya");
    const [newPenjamin, setNewPenjamin] = useState<"BPJS" | "Umum" | "Asuransi">("BPJS");

    // Fetch data from backend API with fallback
    const fetchQueue = async () => {
        try {
            const response = await api<{ data?: Row[] }>("/pendaftaran?per_page=100");
            if (Array.isArray(response.data) && response.data.length > 0) {
                const mapped: AntreanItem[] = response.data.map((r, idx) => {
                    const statusStr = String(r.status ?? "").toLowerCase();
                    let st: "Menunggu" | "Diperiksa" | "Selesai" | "Dilewati" = "Menunggu";
                    if (statusStr.includes("periksa") || statusStr.includes("panggil")) st = "Diperiksa";
                    else if (statusStr.includes("selesai") || statusStr.includes("done")) st = "Selesai";
                    else if (statusStr.includes("batal") || statusStr.includes("lewati")) st = "Dilewati";

                    return {
                        id: (r.id as string | number) ?? (r.id_pendaftaran as string | number) ?? (idx + 10),
                        no: String(r.no ?? `A-00${idx + 1}`),
                        name: String(r.name ?? r.nama_pasien ?? "Pasien"),
                        poli: String(r.poli ?? "Poli Umum"),
                        dokter: String(r.dokter ?? "dr. Jaga"),
                        status: st,
                        loket: String(r.loket ?? "Loket 1"),
                        penjamin: (r.penjamin as "BPJS" | "Umum" | "Asuransi") || "BPJS",
                        waktu: String(r.waktu ?? "08:00"),
                        callCount: Number(r.call_count ?? 0),
                        lastCalledAt: r.last_called_at ? Number(r.last_called_at) : undefined,
                    };
                });
                setItems(mapped);
            }
        } catch {
            // Keep default items if API offline
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        void fetchQueue();
    }, [navigate]);

    // TTS Voice synthesis player
    const playVoiceAnnouncement = (no: string, name: string, destination: string) => {
        if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
        try {
            window.speechSynthesis.cancel();
            const text = `Nomor antrean ${no}, atas nama ${name}, silakan menuju ${destination}`;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "id-ID";
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch {
            // Browser TTS unsupported
        }
    };

    // Handler: Trigger Call (Panggil) -> Updates timestamp so NEWEST called item appears AT THE TOP!
    const handlePanggil = async (item: AntreanItem) => {
        const now = Date.now();
        const updatedItem: AntreanItem = {
            ...item,
            status: "Diperiksa",
            callCount: (item.callCount || 0) + 1,
            lastCalledAt: now,
        };

        // Update state array
        setItems((prev) =>
            prev.map((i) => (i.id === item.id ? updatedItem : i))
        );

        // Update display banner automatically
        setActiveCalledItem(updatedItem);

        // Play audio voice announcement
        playVoiceAnnouncement(updatedItem.no, updatedItem.name, updatedItem.loket || updatedItem.poli);

        // Update backend API asynchronously
        try {
            await api(`/pendaftaran/${item.id}`, {
                method: "PUT",
                body: JSON.stringify({ status: "Diperiksa", call_count: updatedItem.callCount, last_called_at: now }),
            });
        } catch {
            // Local state updated
        }
    };

    // Handler: Change Status
    const handleUpdateStatus = async (id: string | number, newStatus: "Menunggu" | "Diperiksa" | "Selesai" | "Dilewati") => {
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );

        if (activeCalledItem && activeCalledItem.id === id) {
            if (newStatus === "Selesai" || newStatus === "Dilewati") {
                setActiveCalledItem(null);
            } else {
                setActiveCalledItem((prev) => (prev ? { ...prev, status: newStatus } : null));
            }
        }

        try {
            await api(`/pendaftaran/${id}`, {
                method: "PUT",
                body: JSON.stringify({ status: newStatus }),
            });
        } catch {
            // Ignored
        }
    };

    // Handler: Add New Ticket
    const handleAddTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNama.trim()) return;

        const prefix = newPoli.includes("Gigi") ? "B" : newPoli.includes("Anak") ? "C" : newPoli.includes("Penyakit") ? "D" : "A";
        const count = items.filter((i) => i.no.startsWith(prefix)).length + 1;
        const autoNo = `${prefix}-${String(count).padStart(3, "0")}`;

        const newItem: AntreanItem = {
            id: Date.now(),
            no: autoNo,
            name: newNama.trim(),
            poli: newPoli,
            dokter: newDokter,
            status: "Menunggu",
            loket: newPoli.includes("Umum") ? "Loket 1" : newPoli,
            penjamin: newPenjamin,
            waktu: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            callCount: 0,
        };

        setItems((prev) => [newItem, ...prev]);
        setNewNama("");
        setIsAddModalOpen(false);

        try {
            await api("/pendaftaran", {
                method: "POST",
                body: JSON.stringify({
                    no: autoNo,
                    name: newItem.name,
                    poli: newItem.poli,
                    dokter: newItem.dokter,
                    status: "Menunggu",
                    penjamin: newItem.penjamin,
                }),
            });
        } catch {
            // Local state handled
        }
    };

    // Handler: Reset Harian
    const handleReset = () => {
        if (window.confirm("Apakah Anda yakin ingin mereset antrean hari ini?")) {
            setItems([]);
            setActiveCalledItem(null);
        }
    };

    // Filter items
    const filteredItems = items.filter((item) => {
        const matchesPoli = selectedPoli === "Semua Poli" || item.poli.toLowerCase() === selectedPoli.toLowerCase();
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.no.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPoli && matchesSearch;
    });

    const totalCount = items.length;
    const waitingCount = items.filter((i) => i.status === "Menunggu").length;
    const activeCount = items.filter((i) => i.status === "Diperiksa").length;
    const doneCount = items.filter((i) => i.status === "Selesai").length;

    return (
        <FeatureShell
            title="Manajemen Antrean Pasien"
            subtitle="Display panggil antrean live, pemanggilan suara TTS, & kontrol status admisi SIMRS"
            actions={
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 active:scale-98 transition-all"
                    >
                        <Plus className="h-4 w-4" /> Ambil Antrean Baru
                    </button>
                    <button
                        type="button"
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all shadow-2xs",
                            voiceEnabled
                                ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                : "border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                    >
                        {voiceEnabled ? <Volume2 className="h-4 w-4 text-blue-600" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
                        Suara TTS: {voiceEnabled ? "Aktif" : "Mati"}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all"
                    >
                        <RotateCcw className="h-3.5 w-3.5 text-slate-500" /> Reset Harian
                    </button>
                </div>
            }
        >
            {/* DISPLAY ANTREAN UTAMA (SCREEN BANNER ELEGANT CARD STYLE) */}
            {activeCalledItem ? (
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl border border-slate-800">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                            </span>
                            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5" /> DISPLAY DIPANGGIL SAAT INI (URUTAN TERATAS)
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                            <span className="rounded-full bg-slate-800 px-3 py-1 font-bold border border-slate-700 text-blue-300">
                                Pemanggilan ke-{activeCalledItem.callCount || 1}
                            </span>
                            <button
                                type="button"
                                onClick={() => setActiveCalledItem(null)}
                                className="rounded-lg bg-slate-800 p-1 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                                title="Tutup Display"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="relative z-10 mt-5 grid items-center gap-6 lg:grid-cols-12">
                        {/* Big Queue Number */}
                        <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-2xl bg-slate-800/90 border border-slate-700 p-5 text-center shadow-inner">
                            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">NOMOR ANTREAN</p>
                            <p className="font-mono text-5xl font-black tracking-tight text-amber-300 my-1 drop-shadow-md">
                                {activeCalledItem.no}
                            </p>
                            <span className="rounded-full bg-blue-500/20 px-3.5 py-0.5 text-xs font-bold text-blue-300 border border-blue-500/30">
                                {activeCalledItem.loket || activeCalledItem.poli}
                            </span>
                        </div>

                        {/* Patient & Doctor Info */}
                        <div className="lg:col-span-5 space-y-2">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Pasien</p>
                            <h2 className="text-2xl font-extrabold text-white">{activeCalledItem.name}</h2>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 pt-1">
                                <span>Poli: <strong className="text-white">{activeCalledItem.poli}</strong></span>
                                <span>•</span>
                                <span>Dokter: <strong className="text-white">{activeCalledItem.dokter}</strong></span>
                                <span>•</span>
                                <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-blue-300 border border-slate-700">{activeCalledItem.penjamin}</span>
                            </div>
                        </div>

                        {/* Direct Control Buttons */}
                        <div className="lg:col-span-3 flex flex-col gap-2.5">
                            <button
                                type="button"
                                onClick={() => handlePanggil(activeCalledItem)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 active:scale-98 transition-all"
                            >
                                <Volume2 className="h-4 w-4" /> Panggil Ulang (Voice)
                            </button>
                            <button
                                type="button"
                                onClick={() => handleUpdateStatus(activeCalledItem.id, "Selesai")}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 active:scale-98 transition-all"
                            >
                                <CheckCircle2 className="h-4 w-4" /> Selesai Periksa
                            </button>
                            <button
                                type="button"
                                onClick={() => handleUpdateStatus(activeCalledItem.id, "Dilewati")}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                            >
                                <UserX className="h-3.5 w-3.5" /> Lewati Pasien
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-left">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            <Bell className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-white">Layar Display Antrean Standby</h3>
                            <p className="text-xs text-slate-400">Klik <strong>"Panggil"</strong> pada daftar antrean untuk memanggil suara & menaruh pasien baru di posisi paling atas.</p>
                        </div>
                    </div>
                    {waitingCount > 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                const firstWaiting = items.find((i) => i.status === "Menunggu");
                                if (firstWaiting) handlePanggil(firstWaiting);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 active:scale-98 transition-all shadow-md shrink-0"
                        >
                            <Phone className="h-4 w-4" /> Panggil Antrean Berikutnya
                        </button>
                    )}
                </div>
            )}

            {/* RINGKASAN STATISTIK: MENUNGGU (SLATE/GREY), PEMERIKSAAN (BLUE), SELESAI (EMERALD/GREEN) */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Tiket Antrean"
                    value={totalCount}
                    hint="Pendaftaran hari ini"
                    accent="bg-slate-900"
                    icon={<Clock className="h-5 w-5" />}
                />
                <StatCard
                    label="Sedang Menunggu"
                    value={waitingCount}
                    hint="Belum dipanggil"
                    accent="bg-slate-600"
                    icon={<Timer className="h-5 w-5" />}
                />
                <StatCard
                    label="Sedang Dipanggil / Periksa"
                    value={activeCount}
                    hint="Terbaru dipanggil berada di ATAS"
                    accent="bg-blue-600"
                    icon={<Stethoscope className="h-5 w-5" />}
                />
                <StatCard
                    label="Selesai Pelayanan"
                    value={doneCount}
                    hint="Telah dilayani"
                    accent="bg-emerald-600"
                    icon={<CheckCircle2 className="h-5 w-5" />}
                />
            </div>

            {/* FILTER & PENCARIAN */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    <div className="relative min-w-[200px] flex-1 max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama / no antrean..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:bg-white focus:outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="h-3.5 w-3.5 text-slate-400" />
                        <select
                            value={selectedPoli}
                            onChange={(e) => setSelectedPoli(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-slate-800 focus:bg-white focus:outline-none transition-all"
                        >
                            {POLI_OPTIONS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="text-xs font-semibold text-slate-500">
                    Menampilkan <strong>{filteredItems.length}</strong> dari {items.length} antrean
                </div>
            </div>

            {/* KANBAN BOARDS (3 KOLOM: MENUNGGU [ABU-ABU], PEMERIKSAAN [BIRU], SELESAI [HIJAU]) */}
            {loading ? (
                <div className="grid gap-4 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-3">
                    {COLUMNS.map((col) => {
                        // LOGIKA PENGURUTAN:
                        // Pasien yang BARU DIPANGGIL (lastCalledAt terbaru) BERADA DI URUTAN PALING ATAS!
                        const colItems = filteredItems
                            .filter((i) => i.status === col.key)
                            .sort((a, b) => {
                                const timeA = a.lastCalledAt || 0;
                                const timeB = b.lastCalledAt || 0;
                                if (timeA !== timeB) {
                                    return timeB - timeA; // Descending -> Baru dipanggil di ATAS!
                                }
                                return 0;
                            });

                        return (
                            <div key={col.key} className="flex flex-col rounded-3xl border border-slate-200/70 bg-slate-50/60 p-3 shadow-2xs">
                                {/* COLUMN HEADER */}
                                <div className="mb-3.5 flex items-center justify-between px-1">
                                    <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold border", col.headerBg)}>
                                        <span className={cn("h-2 w-2 rounded-full", col.dotColor)} />
                                        <span>{col.label}</span>
                                        <span className={cn("ml-1 rounded-full px-2 py-0.5 text-[11px]", col.badgeBg)}>
                                            {colItems.length}
                                        </span>
                                    </div>
                                </div>

                                {/* CARDS LIST */}
                                <div className="space-y-3 flex-1">
                                    {colItems.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-3 py-10 text-center text-xs font-medium text-slate-400">
                                            Kosong
                                        </div>
                                    ) : (
                                        colItems.map((item, index) => {
                                            const isTopNewCall = col.key === "Diperiksa" && index === 0;

                                            return (
                                                <div
                                                    key={String(item.id)}
                                                    className={cn(
                                                        "group relative rounded-2xl bg-white p-4 shadow-2xs border transition-all hover:shadow-md",
                                                        activeCalledItem?.id === item.id
                                                            ? "border-blue-400 ring-2 ring-blue-200"
                                                            : isTopNewCall
                                                                ? "border-blue-300 bg-blue-50/20"
                                                                : "border-slate-200/80"
                                                    )}
                                                >

                                                    {/* CARD HEADER: QUEUE NO & PENJAMIN TAG */}
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                                                            #{item.no}
                                                        </span>

                                                        <span
                                                            className={cn(
                                                                "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border",
                                                                item.penjamin === "BPJS"
                                                                    ? "bg-blue-50 text-blue-700 border-blue-200/80"
                                                                    : item.penjamin === "Umum"
                                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                                                                        : "bg-slate-100 text-slate-700 border-slate-200/80"
                                                            )}
                                                        >
                                                            <Tag className="h-3 w-3" /> {item.penjamin}
                                                        </span>
                                                    </div>

                                                    {/* PATIENT NAME & DETAILS */}
                                                    <h4 className="mt-2.5 text-sm font-extrabold text-slate-900 truncate">
                                                        {item.name}
                                                    </h4>
                                                    <p className="truncate text-xs font-semibold text-slate-500 mt-0.5">
                                                        {item.poli} · <span className="text-slate-400 font-medium">{item.dokter}</span>
                                                    </p>

                                                    {/* TIME & CALL COUNT */}
                                                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200/60">
                                                            <Calendar className="h-3 w-3 text-slate-400" /> {item.waktu}
                                                        </span>
                                                        {item.callCount > 0 && (
                                                            <span className="text-blue-600 font-bold text-[10px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                                                Dipanggil {item.callCount}x
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* ACTION BUTTONS */}
                                                    <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                                                        {/* PANGGIL BUTTON */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handlePanggil(item)}
                                                            className={cn(
                                                                "flex-1 inline-flex items-center justify-center gap-1 rounded-xl py-1.5 text-[11px] font-bold transition-all shadow-2xs active:scale-98",
                                                                activeCalledItem?.id === item.id
                                                                    ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                                                                    : "bg-slate-900 text-white hover:bg-slate-800"
                                                            )}
                                                        >
                                                            <Phone className="h-3 w-3" />
                                                            {activeCalledItem?.id === item.id ? "Panggil Ulang" : "Panggil"}
                                                        </button>

                                                        {/* MENUNGGU -> PERIKSA */}
                                                        {col.key === "Menunggu" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUpdateStatus(item.id, "Diperiksa")}
                                                                className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                                                                title="Langsung ke Periksa"
                                                            >
                                                                <Stethoscope className="h-3 w-3" /> Periksa
                                                            </button>
                                                        )}

                                                        {/* DIPERIKSA -> SELESAI */}
                                                        {col.key === "Diperiksa" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUpdateStatus(item.id, "Selesai")}
                                                                className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-1.5 px-3 text-[11px] font-bold text-white hover:bg-emerald-500 transition-colors"
                                                            >
                                                                <CheckCircle2 className="h-3 w-3" /> Selesai
                                                            </button>
                                                        )}

                                                        {/* LEWATI BUTTON */}
                                                        {col.key !== "Selesai" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUpdateStatus(item.id, "Dilewati")}
                                                                className="rounded-xl border border-slate-200 p-1.5 text-slate-400 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                                                                title="Lewati Pasien"
                                                            >
                                                                <UserX className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL TAMBAH ANTREAN BARU */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-extrabold text-slate-900">Ambil Tiket Antrean Baru</h3>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddTicket} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pasien</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Masukkan nama lengkap pasien"
                                    value={newNama}
                                    onChange={(e) => setNewNama(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Poliklinik Tujuan</label>
                                <select
                                    value={newPoli}
                                    onChange={(e) => setNewPoli(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-slate-800 focus:outline-none transition-all"
                                >
                                    <option value="Poli Umum">Poli Umum</option>
                                    <option value="Poli Gigi">Poli Gigi</option>
                                    <option value="Poli Anak">Poli Anak</option>
                                    <option value="Poli Penyakit Dalam">Poli Penyakit Dalam</option>
                                    <option value="Poli Kebidanan & Kandungan">Poli Kebidanan & Kandungan</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Dokter Pemeriksa</label>
                                <input
                                    type="text"
                                    value={newDokter}
                                    onChange={(e) => setNewDokter(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Penjamin</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(["BPJS", "Umum", "Asuransi"] as const).map((p) => (
                                        <button
                                            type="button"
                                            key={p}
                                            onClick={() => setNewPenjamin(p)}
                                            className={cn(
                                                "rounded-xl border py-2 text-xs font-bold transition-all",
                                                newPenjamin === p
                                                    ? "border-slate-900 bg-slate-900 text-white"
                                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-sm transition-all"
                                >
                                    Cetak Tiket & Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </FeatureShell>
    );
}
