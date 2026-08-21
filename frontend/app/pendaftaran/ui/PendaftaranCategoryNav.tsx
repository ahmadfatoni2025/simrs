import { NavLink, useLocation } from "react-router";
import {
    Activity,
    ArrowLeftRight,
    BarChart3,
    CalendarClock,
    ClipboardList,
    FileText,
    FileUp,
    History,
    LayoutDashboard,
    MonitorSmartphone,
    Network,
    Printer,
    RefreshCw,
    Settings,
    ShieldCheck,
    Stethoscope,
    UserPlus,
    UserSearch,
    Users,
    XCircle,
    type LucideIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";

export interface SubFeature {
    label: string;
    to: string;
    icon: LucideIcon;
}

export interface CategoryGroup {
    key: string;
    label: string;
    icon: LucideIcon;
    defaultTo: string;
    items: SubFeature[];
}

export const pendaftaranCategories: CategoryGroup[] = [
    {
        key: "portal",
        label: "Portal",
        icon: LayoutDashboard,
        defaultTo: "/pendaftaran",
        items: [],
    },
    {
        key: "registrasi",
        label: "Registrasi Pasien",
        icon: UserPlus,
        defaultTo: "/pendaftaran/registrasi-baru",
        items: [
            { label: "Pasien Baru", to: "/pendaftaran/registrasi-baru", icon: UserPlus },
            { label: "Pasien Lama", to: "/pendaftaran/registrasi-lama", icon: UserSearch },
            { label: "Anjungan Mandiri", to: "/pendaftaran/anjungan-mandiri", icon: MonitorSmartphone },
            { label: "Jadwal Dokter", to: "/pendaftaran/jadwal-dokter", icon: CalendarClock },
            { label: "Pilih Poli", to: "/pendaftaran/pilih-poli", icon: Stethoscope },
        ],
    },
    {
        key: "antrean",
        label: "Antrean & Booking",
        icon: ClipboardList,
        defaultTo: "/pendaftaran/antrean",
        items: [
            { label: "Antrean Loket", to: "/pendaftaran/antrean", icon: ClipboardList },
            { label: "Booking Appointment", to: "/pendaftaran/booking", icon: CalendarClock },
        ],
    },
    {
        key: "penjamin",
        label: "Penjamin & Bridging",
        icon: ShieldCheck,
        defaultTo: "/pendaftaran/validasi-penjamin",
        items: [
            { label: "Validasi Penjamin", to: "/pendaftaran/validasi-penjamin", icon: ShieldCheck },
            { label: "Bridging BPJS", to: "/pendaftaran/bridging-bpjs", icon: RefreshCw },
            { label: "Bridging SATUSEHAT", to: "/pendaftaran/bridging-satusehat", icon: Network },
        ],
    },
    {
        key: "dokumen",
        label: "Riwayat & Dokumen",
        icon: History,
        defaultTo: "/pendaftaran/riwayat",
        items: [
            { label: "Riwayat Kunjungan", to: "/pendaftaran/riwayat", icon: History },
            { label: "Cetak Dokumen", to: "/pendaftaran/cetak-dokumen", icon: Printer },
            { label: "Upload Dokumen", to: "/pendaftaran/upload-dokumen", icon: FileUp },
        ],
    },
    {
        key: "operasional",
        label: "Operasional & Monitor",
        icon: Activity,
        defaultTo: "/pendaftaran/monitoring",
        items: [
            { label: "Monitoring", to: "/pendaftaran/monitoring", icon: Activity },
            { label: "Mutasi Registrasi", to: "/pendaftaran/mutasi", icon: ArrowLeftRight },
            { label: "Pembatalan", to: "/pendaftaran/pembatalan", icon: XCircle },
        ],
    },
    {
        key: "pelaporan",
        label: "Audit & Pelaporan",
        icon: BarChart3,
        defaultTo: "/pendaftaran/laporan",
        items: [
            { label: "Audit Log", to: "/pendaftaran/audit-log", icon: FileText },
            { label: "Laporan", to: "/pendaftaran/laporan", icon: BarChart3 },
            { label: "Pengaturan", to: "/pendaftaran/pengaturan", icon: Settings },
        ],
    },
];

export function PendaftaranCategoryNav() {
    const location = useLocation();
    const pathname = location.pathname;

    // Determine current active category group
    const activeCategory = pendaftaranCategories.find((cat) => {
        if (cat.defaultTo === pathname && cat.key === "portal") return true;
        if (cat.key !== "portal") {
            return cat.items.some((sub) => sub.to === pathname);
        }
        return false;
    }) || pendaftaranCategories[0];

    return (
        <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
            {/* Header Title & Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 px-1">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100 shadow-2xs">
                        <Users className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="text-xs font-bold text-slate-800 tracking-tight">Kategori Fitur Pendaftaran Pasien</h2>
                        <p className="text-[11px] text-slate-400">Pilih kategori untuk memfilter fitur operasional</p>
                    </div>
                </div>
                {activeCategory && activeCategory.key !== "portal" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 border border-sky-200/60">
                        <activeCategory.icon className="h-3 w-3" />
                        {activeCategory.label} ({activeCategory.items.length} Fitur)
                    </span>
                )}
            </div>

            {/* Top Level Category Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {pendaftaranCategories.map((cat) => {
                    const isCatActive =
                        cat.key === "portal"
                            ? pathname === "/pendaftaran"
                            : cat.items.some((sub) => sub.to === pathname);

                    return (
                        <NavLink
                            key={cat.key}
                            to={cat.defaultTo}
                            className={cn(
                                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                                isCatActive
                                    ? "bg-slate-900 text-white shadow-xs"
                                    : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                            )}
                        >
                            <cat.icon className={cn("h-3.5 w-3.5", isCatActive ? "text-sky-300" : "text-slate-400")} />
                            <span>{cat.label}</span>
                        </NavLink>
                    );
                })}
            </div>

            {/* Sub-Feature Quick Pills (Tampil jika kategori memiliki sub-fitur) */}
            {activeCategory && activeCategory.items.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                        Sub-fitur {activeCategory.label}:
                    </span>
                    {activeCategory.items.map((sub) => {
                        const isSubActive = pathname === sub.to;
                        return (
                            <NavLink
                                key={sub.to}
                                to={sub.to}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
                                    isSubActive
                                        ? "bg-sky-500 text-white font-semibold shadow-2xs"
                                        : "bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                <sub.icon className={cn("h-3 w-3", isSubActive ? "text-white" : "text-slate-400")} />
                                <span>{sub.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
