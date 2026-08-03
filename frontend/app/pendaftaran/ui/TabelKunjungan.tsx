import { useState } from "react";
import {
    CalendarClock,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileSpreadsheet,
    HeartHandshake,
    List,
    Stethoscope,
    User,
} from "lucide-react";
import type { Row } from "~/components/resource/types";

interface TabelKunjunganProps {
    rows: Row[];
    loading: boolean;
    page: number;
    perPage: number;
    totalRows: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    onRowClick?: (row: Row) => void;
}

const channelTabs = [
    { key: "Onsite", icon: User, dot: "bg-amber-500", tab: "text-amber-700", badge: "bg-amber-100 text-amber-700", card: "border-amber-200" },
    { key: "Booking", icon: CalendarClock, dot: "bg-blue-500", tab: "text-blue-700", badge: "bg-blue-100 text-blue-700", card: "border-blue-200" },
    { key: "BPJS", icon: HeartHandshake, dot: "bg-emerald-500", tab: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700", card: "border-emerald-200" },
];

const activeClass: Record<string, string> = {
    "Onsite": "bg-amber-50 text-amber-700",
    "Booking": "bg-blue-50 text-blue-700",
    "BPJS": "bg-emerald-50 text-emerald-700",
};

const statusStyle: Record<string, { icon: typeof Clock; badge: string }> = {
    "Menunggu": { icon: Clock, badge: "bg-amber-100 text-amber-700" },
    "Diperiksa": { icon: Stethoscope, badge: "bg-blue-100 text-blue-700" },
    "Selesai": { icon: Check, badge: "bg-emerald-100 text-emerald-700" },
};

function statusToken(s: unknown): string {
    const str = String(s ?? "").toLowerCase();
    if (str.includes("periksa")) return "Diperiksa";
    if (str.includes("selesai") || str.includes("done") || str.includes("aktif")) return "Selesai";
    if (str.includes("menunggu") || str.includes("wait")) return "Menunggu";
    return String(s ?? "Menunggu");
}

function channelToken(row: Row): string {
    const src = String(
        row.sumber_pendaftaran ??
            row.sumber ??
            row.channel ??
            row.jenis_pendaftaran ??
            row.cara_daftar ??
            row.kategori ??
            row.penjamin ??
            ""
    ).toLowerCase();
    if (src.includes("booking") || src.includes("reservasi") || src.includes("online")) return "Booking";
    if (src.includes("bpjs")) return "BPJS";
    return "Onsite";
}

function StatusPill({ status }: { status: unknown }) {
    const key = statusStyle[statusToken(status)] ?? statusStyle.Menunggu!;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${key.badge}`}>
            <key.icon className="h-3 w-3" />
            {String(status ?? "-")}
        </span>
    );
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0] ?? "")
        .join("")
        .toUpperCase();
}

const avatarColors = [
    "bg-sky-100 text-sky-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-teal-100 text-teal-700",
];

export default function TabelKunjungan({
    rows,
    loading,
    page,
    perPage,
    totalRows,
    totalPages,
    onPageChange,
    onPerPageChange,
    onRowClick,
}: TabelKunjunganProps) {
    const [activeTab, setActiveTab] = useState<string>("Onsite");
    const [goToPage, setGoToPage] = useState(String(page));
    const [exporting, setExporting] = useState<"list" | "excel" | null>(null);

    const grouped = channelTabs.reduce<Record<string, Row[]>>((acc, t) => {
        acc[t.key] = rows.filter((r) => channelToken(r) === t.key);
        return acc;
    }, {});

    function handleGoTo() {
        const p = Math.max(1, Math.min(totalPages, Number(goToPage) || 1));
        onPageChange(p);
        setGoToPage(String(p));
    }

    function downloadFile(content: string, mime: string, filename: string) {
        const blob = new Blob(["\uFEFF" + content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function handleExport(kind: "list" | "excel") {
        if (rows.length === 0) return;
        setExporting(kind);
        setTimeout(() => {
            const headersStatus = ["No. Kunjungan", "No. RM", "Nama Pasien", "Poliklinik", "Dokter", "Tanggal", "Status"];
            const lines = rows.map((row) =>
                headersStatus.map((_, i) =>
                    `"${String(
                        [row.no, row.rm, row.name ?? row.nama_pasien, row.poli, row.dokter, row.tanggal, row.status][i] ?? "-"
                    ).replace(/"/g, '""')}"`
                )
            );
            const csv = [headersStatus.join(","), ...lines.map((l) => l.join(","))].join("\n");
            const dateStr = new Date().toISOString().slice(0, 10);
            if (kind === "excel") {
                downloadFile(
                    `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table>${[
                        `<tr>${headersStatus.map((h) => `<th>${h}</th>`).join("")}</tr>`,
                        ...lines.map((l) => `<tr>${l.map((c) => `<td>${c.replace(/^"|"$/g, "").replace(/""/g, '"')}</td>`).join("")}</tr>`),
                    ].join("")}</table></body></html>`,
                    "application/vnd.ms-excel",
                    `daftar-kunjungan-${dateStr}.xls`
                );
            } else {
                downloadFile(csv, "text/csv;charset=utf-8", `daftar-kunjungan-${dateStr}.csv`);
            }
            setExporting(null);
        }, 0);
    }

    const startItem = (page - 1) * perPage + 1;
    const endItem = Math.min(page * perPage, totalRows);
    const shown = grouped[activeTab] ?? [];

    return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden ">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">
                        Daftar Kunjungan Rawat Jalan
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Total kunjungan: {totalRows}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleExport("list")}
                        disabled={rows.length === 0 || !!exporting}
                        className="inline-flex items-center gap-1.5 rounded-md bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-600 disabled:opacity-50 shadow-sm transition-colors"
                        title="Unduh sebagai CSV"
                    >
                        {exporting === "list" ? <Check className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
                        {exporting === "list" ? "Mengekspor..." : "Export List"}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleExport("excel")}
                        disabled={rows.length === 0 || !!exporting}
                        className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 shadow-sm transition-colors"
                        title="Unduh sebagai Excel"
                    >
                        {exporting === "excel" ? <Check className="h-3.5 w-3.5" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
                        {exporting === "excel" ? "Mengekspor..." : "Export Excel"}
                    </button>
                </div>
            </div>

            {/* Channel tabs */}
            <div className="flex gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2">
                {channelTabs.map((t) => {
                    const isActive = t.key === activeTab;
                    const count = grouped[t.key]?.length ?? 0;
                    return (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setActiveTab(t.key)}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${isActive ? activeClass[t.key] : "text-slate-500 hover:bg-white hover:text-slate-700"
                                }`}
                        >
                            <span className={`${isActive ? activeClass[t.key] : ""} inline-flex h-1.5 w-1.5 rounded-full ${t.dot}`} />
                            {t.key}
                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${t.badge}`}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Kanban cards */}
            <div className="max-h-[460px] overflow-y-auto">
                {loading ? (
                    <div className="space-y-3 p-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-24 rounded-lg bg-slate-50 animate-pulse" />
                        ))}
                    </div>
                ) : shown.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
                        <Clock className="h-6 w-6 text-slate-300" />
                        <p className="text-sm text-slate-400">Tidak ada kunjungan lewat pendaftaran "{activeTab}".</p>
                    </div>
                ) : (
                    <div className="space-y-2.5 p-3">
                        {shown.map((row, idx) => (
                            <button
                                key={String(row.id ?? idx)}
                                type="button"
                                onClick={() => onRowClick?.(row)}
                                className="group w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColors[idx % avatarColors.length]!}`}>
                                        {getInitials(String(row.name ?? row.nama_pasien ?? "?"))}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-sky-700 transition-colors">
                                                {String(row.name ?? row.nama_pasien ?? "Tanpa Nama")}
                                            </p>
                                            <StatusPill status={row.status} />
                                        </div>
                                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
                                            <span className="font-mono">#{row.no ?? "-"}</span>
                                            <span className="flex items-center gap-0.5">
                                                <User className="h-3 w-3 text-slate-400" />
                                                {String(row.rm ?? "-")}
                                            </span>
                                            <span>{String(row.poli ?? "-")}</span>
                                            <span>{String(row.dokter ?? "")}</span>
                                            <span className="text-slate-400">{String(row.tanggal ?? row.tgl_kunjungan ?? "")}</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm">
                <p className="text-xs text-slate-500">
                    Menampilkan {totalRows > 0 ? startItem : 0} - {totalRows > 0 ? endItem : 0} dari {totalRows} data
                </p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        disabled={page <= 1}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />

                    </button>
                    <span className="text-xs text-slate-500">Hal {page} / {totalPages || 1}</span>
                    <button
                        type="button"
                        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                        disabled={page >= totalPages}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >

                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                    <span className="text-xs text-slate-400">|</span>
                    <span className="text-xs text-slate-500">Hal:</span>
                    <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={goToPage}
                        onChange={(e) => setGoToPage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleGoTo()}
                        onBlur={handleGoTo}
                        className="w-14 rounded-md border border-slate-300 px-2 py-1 text-center text-xs focus:border-sky-500 focus:outline-none"
                    />

                    <span className="text-xs text-slate-400">|</span>
                    <select
                        value={perPage}
                        onChange={(e) => onPerPageChange(Number(e.target.value))}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-sky-500 focus:outline-none"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
        </div>
    );
}