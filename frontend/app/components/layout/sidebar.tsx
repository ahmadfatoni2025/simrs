import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
    Activity,
    ArrowLeftRight,
    BarChart3,
    Banknote,
    BedDouble,
    Boxes,
    Building2,
    CalendarClock,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Database,
    FileText,
    FileUp,
    FlaskConical,
    HeartPulse,
    History,
    LayoutDashboard,
    ListTree,
    LogOut,
    MapPin,
    MonitorSmartphone,
    Network,
    Package,
    PanelLeftClose,
    PanelLeftOpen,
    PillBottle,
    Printer,
    RefreshCw,
    Settings,
    ShieldCheck,
    Stethoscope,
    Store,
    Syringe,
    UserPlus,
    UserSearch,
    Users,
    Wallet,
    X,
    XCircle,
    Search,
    Inbox,
    Plus,
    Clock,
    Layers,
    type LucideIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { masterEntities } from "~/master-data/masterDataConfig";

export interface NavItem {
    label: string;
    to: string;
    icon: LucideIcon;
    children?: NavItem[];
}

const masterDataIcon: Record<string, LucideIcon> = {
    "barang-farmasi": PillBottle,
    "barang-rumah-tangga": Boxes,
    "barang-gizi": Package,
    pabrik: Building2,
    sediaan: PillBottle,
    satuan: ListTree,
    "kelas-terapi": HeartPulse,
    bed: BedDouble,
    "signa-obat": ClipboardList,
    "paket-mcu": FlaskConical,
    "paket-tindakan": Syringe,
    instalasi: Building2,
    instansi: Store,
    "template-expertise": FileText,
    "template-resep-racikan": ClipboardList,
    pegawai: UserSearch,
    "profesi-nakes": Users,
    smf: Stethoscope,
    spesialisasi: Stethoscope,
    supplier: Store,
    "item-laboratorium": FlaskConical,
    wilayah: MapPin,
    rekening: Wallet,
    "kategori-barang": Boxes,
    "triase-primer": Activity,
    "kuota-poliklinik": CalendarClock,
    "jadwal-dokter": CalendarClock,
    tarif: Banknote,
    "icd-x": FileText,
    "diagnosa-keperawatan": FileText,
    penjamin: ShieldCheck,
    akun: Wallet,
    kamar: BedDouble,
    "unit-pegawai": Building2,
    "kategori-nilai-normal": FlaskConical,
};

const masterDataNavItems: NavItem[] = masterEntities.map((e) => ({
    label: e.title,
    to: `/master-data/${e.key}`,
    icon: masterDataIcon[e.key] ?? Database,
}));

const navItems: NavItem[] = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    {
        label: "Master Data",
        to: "/master-data",
        icon: Database,
        children: masterDataNavItems,
    },
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
                    "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150",
                    collapsed ? "justify-center px-0" : depth > 0 && "pl-9 text-slate-500",
                    isActive
                        ? "bg-slate-200/70 text-slate-900 font-semibold"
                        : "text-slate-600 hover:bg-slate-200/40 hover:text-slate-900"
                )
            }
            title={collapsed ? item.label : undefined}
        >
            <Icon className={cn("h-4 w-4 shrink-0 transition-colors", depth > 0 && !collapsed && "h-3.5 w-3.5 text-slate-400")} />
            {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
    );
}

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

    const childActive = hasChildren
        ? item.children!.some(
            (c) =>
                c.to === location.pathname ||
                (c.to !== "/" && location.pathname.startsWith(c.to))
        )
        : false;

    const [open, setOpen] = useState(childActive);

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
                    "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150",
                    collapsed ? "justify-center px-0" : "",
                    childActive
                        ? "bg-slate-200/80 text-slate-900 font-semibold"
                        : open
                            ? "bg-slate-200/40 text-slate-900"
                            : "text-slate-600 hover:bg-slate-200/40 hover:text-slate-900"
                )}
            >
                <item.icon className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-slate-800" />
                {!collapsed && (
                    <>
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        <ChevronRight
                            className={cn(
                                "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                                open && "rotate-90 text-slate-600"
                            )}
                        />
                    </>
                )}
            </button>

            {!collapsed && open && (
                <div className="mt-0.5 space-y-0.5 pl-1">
                    {item.children!.map((child) => (
                        <SidebarNavItem key={child.to} item={child} depth={depth + 1} collapsed={collapsed} onExpand={onExpand} />
                    ))}
                </div>
            )}
        </div>
    );
}

function SidebarHeader({
    collapsed,
    isHovered,
    onToggle,
}: {
    collapsed?: boolean;
    isHovered?: boolean;
    onToggle?: () => void;
}) {
    const navigate = useNavigate();

    return (
        <div className="p-3 border-b border-slate-200/60">
            {/* Top Workspace Selector & Toggle Button */}
            <div className="flex items-center justify-between gap-2">
                {collapsed ? (
                    /* Saat collapsed: Tampilkan tombol Buka Menu yang menggantikan logo RS */
                    <button
                        type="button"
                        onClick={onToggle}
                        title="Buka menu sidebar"
                        className={cn(
                            "flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-white border border-slate-200/80 text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-slate-900 transition-all",
                            isHovered && "ring-2 ring-slate-900/10 bg-slate-100 scale-105"
                        )}
                    >
                        <PanelLeftOpen className="h-5 w-5 text-slate-700" />
                    </button>
                ) : (
                    /* Saat terbuka: Tampilkan logo RS & info akun beserta tombol tutup */
                    <>
                        <div
                            onClick={() => navigate("/pengaturan")}
                            title="Buka Pengaturan Profil"
                            className="flex items-center gap-2.5 min-w-0 flex-1 rounded-xl border border-slate-200/80 bg-white p-2 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs shadow-2xs">
                                RS
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-bold text-slate-900 leading-tight">Rumah Sakit Sehat</p>
                                <p className="truncate text-[10px] text-slate-400">dr.rina@simrs.id</p>
                            </div>
                            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        </div>

                        <button
                            type="button"
                            onClick={onToggle}
                            title="Ciutkan menu"
                            className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-500 shadow-2xs hover:bg-slate-100 hover:text-slate-900 transition-all"
                        >
                            <PanelLeftClose className="h-4 w-4" />
                        </button>
                    </>
                )}
            </div>

            {/* Quick Action Button saat terbuka */}
            {!collapsed && (
                <div className="mt-2.5">
                    <button
                        type="button"
                        onClick={() => navigate("/pendaftaran/registrasi-baru")}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 active:scale-98 transition-all"
                    >
                        <Plus className="h-3.5 w-3.5 text-slate-500" />
                        Pendaftaran Baru
                    </button>
                </div>
            )}

            {/* Search & Utility quick links saat terbuka */}
            {!collapsed && (
                <div className="mt-2.5 space-y-0.5 text-slate-600">
                    <button
                        type="button"
                        onClick={() => navigate("/pendaftaran/registrasi-lama")}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium hover:bg-slate-200/50 hover:text-slate-900 transition-colors"
                    >
                        <Search className="h-3.5 w-3.5 text-slate-400" />
                        <span>Cari Pasien / Poli</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/pendaftaran/antrean")}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium hover:bg-slate-200/50 hover:text-slate-900 transition-colors"
                    >
                        <Inbox className="h-3.5 w-3.5 text-slate-400" />
                        <span className="flex-1 text-left">Pesan & Notif</span>
                    </button>
                </div>
            )}
        </div>
    );
}

function SidebarNav({ collapsed, onExpand }: { collapsed: boolean; onExpand?: () => void }) {
    return (
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-200">
            <div>
                <p className={cn("px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400", collapsed && "text-center px-0")}>
                    {collapsed ? "•••" : "Menu Utama"}
                </p>
                <div className="space-y-0.5">
                    {navItems.slice(0, 2).map((item) => (
                        <SidebarNavItem key={item.to} item={item} collapsed={collapsed} onExpand={onExpand} />
                    ))}
                </div>
            </div>

            <div>
                <p className={cn("px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400", collapsed && "text-center px-0")}>
                    {collapsed ? "•••" : "Layanan Medical"}
                </p>
                <div className="space-y-0.5">
                    {navItems.slice(2, -1).map((item) => (
                        <SidebarNavItem key={item.to} item={item} collapsed={collapsed} onExpand={onExpand} />
                    ))}
                </div>
            </div>

            <div>
                <p className={cn("px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400", collapsed && "text-center px-0")}>
                    {collapsed ? "•••" : "Pengaturan"}
                </p>
                <div className="space-y-0.5">
                    {navItems.slice(-1).map((item) => (
                        <SidebarNavItem key={item.to} item={item} collapsed={collapsed} onExpand={onExpand} />
                    ))}
                </div>
            </div>
        </nav>
    );
}

interface SidebarProps {
    collapsed?: boolean;
    mobileOpen?: boolean;
    onToggle?: () => void;
    onCloseMobile?: () => void;
}

export function Sidebar({ collapsed = false, mobileOpen = false, onToggle, onCloseMobile }: SidebarProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
                    onClick={onCloseMobile}
                />
            )}

            <aside
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#f4f5f7] border-r border-slate-200/80 transition-all duration-300 select-none shadow-xs",
                    "lg:flex",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    collapsed ? "lg:w-[72px]" : "lg:w-60",
                    "w-60"
                )}
            >
                {/* Mobile Close Button */}
                <div className="absolute top-3.5 right-3 z-10 lg:hidden">
                    <button
                        type="button"
                        onClick={onCloseMobile}
                        title="Tutup menu"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <SidebarHeader collapsed={collapsed} isHovered={isHovered} onToggle={onToggle} />
                <SidebarNav collapsed={collapsed} onExpand={() => onToggle?.()} />
            </aside>
        </>
    );
}