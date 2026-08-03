import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
    Activity,
    ArrowLeftRight,
    BarChart3,
    BedDouble,
    CalendarClock,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    FileText,
    FileUp,
    History,
    LayoutDashboard,
    LogOut,
    MonitorSmartphone,
    Network,
    PanelLeftClose,
    PanelLeftOpen,
    PillBottle,
    Printer,
    RefreshCw,
    Settings,
    ShieldCheck,
    Stethoscope,
    UserPlus,
    UserSearch,
    Users,
    X,
    XCircle,
    type LucideIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";

/* ── Tipe data navigasi (mendukung sub-tab / child items) ── */

export interface NavItem {
    label: string;
    to: string;
    icon: LucideIcon;
    children?: NavItem[];
}

const navItems: NavItem[] = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    {
        label: "Pendaftaran Pasien",
        to: "/pendaftaran",
        icon: Users,
        children: [
            { label: "Registrasi Pasien Baru", to: "/pendaftaran/registrasi-baru", icon: UserPlus },
            { label: "Registrasi Pasien Lama", to: "/pendaftaran/registrasi-lama", icon: UserSearch },
            { label: "Anjungan Mandiri", to: "/pendaftaran/anjungan-mandiri", icon: MonitorSmartphone },
            { label: "Jadwal Dokter", to: "/pendaftaran/jadwal-dokter", icon: CalendarClock },
            { label: "Pilih Poli", to: "/pendaftaran/pilih-poli", icon: Stethoscope },
            { label: "Antrean", to: "/pendaftaran/antrean", icon: ClipboardList },
            { label: "Booking Appointment", to: "/pendaftaran/booking", icon: CalendarClock },
            { label: "Validasi Penjamin", to: "/pendaftaran/validasi-penjamin", icon: ShieldCheck },
            { label: "Bridging BPJS", to: "/pendaftaran/bridging-bpjs", icon: RefreshCw },
            { label: "Bridging SATUSEHAT", to: "/pendaftaran/bridging-satusehat", icon: Network },
            { label: "Riwayat Kunjungan", to: "/pendaftaran/riwayat", icon: History },
            { label: "Cetak Dokumen", to: "/pendaftaran/cetak-dokumen", icon: Printer },
            { label: "Upload Dokumen", to: "/pendaftaran/upload-dokumen", icon: FileUp },
            { label: "Mutasi Registrasi", to: "/pendaftaran/mutasi", icon: ArrowLeftRight },
            { label: "Pembatalan Registrasi", to: "/pendaftaran/pembatalan", icon: XCircle },
            { label: "Monitoring Registrasi", to: "/pendaftaran/monitoring", icon: Activity },
            { label: "Audit Log", to: "/pendaftaran/audit-log", icon: FileText },
            { label: "Laporan", to: "/pendaftaran/laporan", icon: BarChart3 },
            { label: "Pengaturan", to: "/pendaftaran/pengaturan", icon: Settings },
        ],
    },
    { label: "Jadwal Dokter", to: "/jadwal-dokter", icon: CalendarClock },
    { label: "Rekam Medis", to: "/rekam-medis", icon: FileText },
    { label: "Pemeriksaan & Tindakan", to: "/pemeriksaan", icon: Stethoscope },
    { label: "Farmasi & Obat", to: "/farmasi", icon: PillBottle },
    { label: "Rawat Inap", to: "/rawat-inap", icon: BedDouble },
    { label: "Laporan", to: "/laporan", icon: BarChart3 },
    { label: "Pengaturan", to: "/pengaturan", icon: Settings },
];

/* ── Item menu tunggal (sub-item) ── */

function SidebarLink({
    item,
    to,
    icon: Icon,
    depth,
    collapsed,
}: {
    item: NavItem;
    to: string;
    icon: LucideIcon;
    depth: number;
    collapsed?: boolean;
}) {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                cn(
                    "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                    collapsed ? "justify-center px-0" : depth > 0 && "pl-11",
                    isActive
                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm border border-indigo-100/50"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                )
            }
            title={collapsed ? item.label : undefined}
        >
            <Icon className={cn(
                "h-[18px] w-[18px] shrink-0 transition-colors duration-200",
                depth > 0 && !collapsed && "h-4 w-4"
            )} />
            {!collapsed && (
                <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {depth > 0 && (
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 opacity-0 group-[.active]:opacity-100 transition-opacity" />
                    )}
                </>
            )}
        </NavLink>
    );
}

/* ── Item menu dengan / tanpa sub-tab ── */

function SidebarNavItem({
    item,
    depth = 0,
    collapsed = false,
    onExpand,
}: {
    item: NavItem;
    depth?: number;
    collapsed?: boolean;
    onExpand?: () => void;
}) {
    const location = useLocation();
    const hasChildren = !!item.children && item.children.length > 0;

    // Menandai apakah ada sub-item yang sedang aktif
    const childActive = hasChildren
        ? item.children!.some(
            (c) =>
                c.to === location.pathname ||
                (c.to !== "/" && location.pathname.startsWith(c.to))
        )
        : false;

    const [open, setOpen] = useState(childActive);

    // Agar submenu tetap terbuka selama salah satu child-nya aktif
    useEffect(() => {
        if (childActive) setOpen(true);
    }, [childActive]);

    if (!hasChildren) {
        return <SidebarLink item={item} to={item.to} icon={item.icon} depth={depth} collapsed={collapsed} />;
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    if (collapsed) {
                        onExpand?.();
                        setOpen(true);
                        return;
                    }
                    setOpen((o) => !o);
                }}
                title={collapsed ? item.label : undefined}
                className={cn(
                    "group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                    collapsed ? "justify-center px-0" : "",
                    childActive
                        ? "bg-indigo-50/80 text-indigo-700 border border-indigo-100/60"
                        : open
                            ? "bg-indigo-50/40 text-indigo-600 border border-indigo-100/40"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                )}
            >
                <item.icon className="h-[18px] w-[18px] shrink-0 transition-colors duration-200" />
                {!collapsed && (
                    <>
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        <div className={cn(
                            "flex items-center justify-center h-5 w-5 rounded-full transition-all duration-200",
                            open || childActive ? "bg-indigo-100 text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                        )}>
                            {open ? (
                                <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                                <ChevronRight className="h-3.5 w-3.5" />
                            )}
                        </div>
                    </>
                )}
            </button>

            {!collapsed && (
                <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    open ? "max-h-[900px] opacity-100 mt-1" : "max-h-0 opacity-0"
                )}>
                    <div className="space-y-0.5 py-1">
                        {item.children!.map((child) => (
                            <SidebarNavItem key={child.to} item={child} depth={depth + 1} collapsed={collapsed} onExpand={onExpand} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Divider ── */

function SidebarDivider() {
    return (
        <div className="px-4 py-2">
            <div className="border-t border-gray-100" />
        </div>
    );
}

/* ── Navigasi utama ── */

function SidebarNav({ collapsed, onExpand }: { collapsed: boolean; onExpand?: () => void }) {
    return (
        <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <div className={cn("px-3.5 mb-3", collapsed && "px-0 text-center")}>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {collapsed ? "•••" : "Menu Utama"}
                </p>
            </div>
            {navItems.slice(0, 1).map((item) => (
                <SidebarNavItem key={item.to} item={item} collapsed={collapsed} onExpand={onExpand} />
            ))}

            <SidebarDivider />

            <div className={cn("px-3.5 mb-3 mt-4", collapsed && "px-0 text-center")}>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {collapsed ? "•••" : "Layanan"}
                </p>
            </div>
            {navItems.slice(1, -1).map((item) => (
                <SidebarNavItem key={item.to} item={item} collapsed={collapsed} onExpand={onExpand} />
            ))}

            <SidebarDivider />

            <div className={cn("px-3.5 mb-3 mt-4", collapsed && "px-0 text-center")}>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {collapsed ? "•••" : "Sistem"}
                </p>
            </div>
            {navItems.slice(-1).map((item) => (
                <SidebarNavItem key={item.to} item={item} collapsed={collapsed} onExpand={onExpand} />
            ))}
        </nav>
    );
}

/* ── Brand / logo ── */

function SidebarBrand({ collapsed, onExpand }: { collapsed?: boolean; onExpand?: () => void }) {
    return (
        <div className={cn("px-5 py-5 border-b border-gray-100", collapsed && "px-3")}>
            <div className={cn("flex items-center gap-3.5", collapsed && "justify-center")}>
                <div
                    className={cn("relative", collapsed && "cursor-pointer")}
                    onClick={() => {
                        if (collapsed) onExpand?.();
                    }}
                    title={collapsed ? "Klik logo untuk membuka menu" : undefined}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-20" />
                    <img
                        className="relative w-11 h-11 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-100"
                        src="/img/logo.png"
                        alt="Logo"
                    />
                </div>
                {!collapsed && (
                    <div className="select-none">
                        <p className="text-lg font-bold tracking-tight text-gray-900 leading-none">
                            SIMRS<span className="text-indigo-600">.</span>
                        </p>
                        <p className="text-[11px] font-medium text-gray-500 mt-1 tracking-wide">Rumah Sakit Sehat</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Profil pengguna ── */

function SidebarProfile({ collapsed }: { collapsed?: boolean }) {
    return (
        <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer group">
                <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-2 ring-white">
                        <span className="text-xs font-bold text-white">RM</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
                </div>
                {!collapsed && (
                    <>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">Dr. Rina Marlina</p>
                            <p className="text-xs text-gray-500 truncate">Administrator</p>
                        </div>
                        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

/* ── Komponen utama Sidebar ── */

interface SidebarProps {
    collapsed?: boolean;
    mobileOpen?: boolean;
    onToggle?: () => void;
    onCloseMobile?: () => void;
}

export function Sidebar({ collapsed = false, mobileOpen = false, onToggle, onCloseMobile }: SidebarProps) {
    return (
        <>
            {/* Backdrop untuk mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={onCloseMobile}
                />
            )}

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200/60 shadow-sm transition-all duration-300",
                    "lg:flex",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    collapsed ? "lg:w-[76px]" : "lg:w-64",
                    "w-64"
                )}
            >
                {/* Tombol toggle (desktop) */}
                <div className={cn("absolute top-5 right-3 z-10 hidden lg:block", collapsed && "right-2.5")}>
                    <button
                        type="button"
                        onClick={onToggle}
                        title={collapsed ? "Perluas menu" : "Ciutkan menu"}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
                    >
                        {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </button>
                </div>

                {/* Tombol tutup (mobile) */}
                <div className="absolute top-5 right-3 z-10 lg:hidden">
                    <button
                        type="button"
                        onClick={onCloseMobile}
                        title="Tutup menu"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <SidebarBrand collapsed={collapsed} onExpand={() => onToggle?.()} />
                <SidebarNav
                    collapsed={collapsed}
                    onExpand={() => {
                        onToggle?.();
                    }}
                />
                <SidebarProfile collapsed={collapsed} />
            </aside>
        </>
    );
}