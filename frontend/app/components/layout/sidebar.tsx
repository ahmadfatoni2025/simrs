import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
    Activity,
    ArrowLeftRight,
    Banknote,
    BarChart3,
    BedDouble,
    Boxes,
    Building2,
    CalendarClock,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Clock,
    CreditCard,
    Database,
    FileSpreadsheet,
    FileText,
    FileUp,
    FlaskConical,
    HeartPulse,
    History,
    Inbox,
    Layers,
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
    Plus,
    Printer,
    Receipt,
    RefreshCw,
    Scale,
    Search,
    Settings,
    ShieldCheck,
    Stethoscope,
    Store,
    Syringe,
    Truck,
    User,
    UserCheck,
    UserPlus,
    UserSearch,
    Users,
    Wallet,
    X,
    XCircle,
    type LucideIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { masterEntities } from "~/master-data/masterDataConfig";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface NavItem {
    label: string;
    to: string;
    icon: LucideIcon;
    badge?: string;
    children?: NavItem[];
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export const DEFAULT_SIDEBAR_WIDTH = 256;
export const MIN_SIDEBAR_WIDTH = 180;
export const MAX_SIDEBAR_WIDTH = 480;
export const COLLAPSED_SIDEBAR_WIDTH = 64;

export interface SidebarProps {
    collapsed?: boolean;
    mobileOpen?: boolean;
    onToggle?: () => void;
    onCloseMobile?: () => void;
    width?: number;
    onWidthChange?: (width: number) => void;
    minWidth?: number;
    maxWidth?: number;
}

/* -------------------------------------------------------------------------- */
/*                                MASTER DATA                                 */
/* -------------------------------------------------------------------------- */

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

const masterDataNavItems: NavItem[] = [
    { label: "Semua Catalog Master", to: "/master-data", icon: Database },
    {
        label: "Farmasi & Logistik",
        to: "/master-data?category=farmasi",
        icon: PillBottle,
        children: masterEntities
            .filter((e) => e.category === "farmasi")
            .map((e) => ({
                label: e.title,
                to: `/master-data/${e.key}`,
                icon: masterDataIcon[e.key] ?? Database,
            })),
    },
    {
        label: "Pelayanan Medis",
        to: "/master-data?category=pelayanan",
        icon: Stethoscope,
        children: masterEntities
            .filter((e) => e.category === "pelayanan")
            .map((e) => ({
                label: e.title,
                to: `/master-data/${e.key}`,
                icon: masterDataIcon[e.key] ?? Database,
            })),
    },
    {
        label: "SDM & Nakes",
        to: "/master-data?category=sdm",
        icon: Users,
        children: masterEntities
            .filter((e) => e.category === "sdm")
            .map((e) => ({
                label: e.title,
                to: `/master-data/${e.key}`,
                icon: masterDataIcon[e.key] ?? Database,
            })),
    },
    {
        label: "Keuangan & Billing",
        to: "/master-data?category=keuangan",
        icon: Banknote,
        children: masterEntities
            .filter((e) => e.category === "keuangan")
            .map((e) => ({
                label: e.title,
                to: `/master-data/${e.key}`,
                icon: masterDataIcon[e.key] ?? Database,
            })),
    },
];

export const navGroups: NavGroup[] = [
    {
        title: "Utama & Master",
        items: [
            { label: "Dashboard RS", to: "/dashboard", icon: LayoutDashboard },
            {
                label: "Master Data System",
                to: "/master-data",
                icon: Database,
                children: masterDataNavItems,
            },
        ],
    },
    {
        title: "Pelayanan Pasien",
        items: [
            {
                label: "Manajemen Pasien & Loket",
                to: "/pendaftaran",
                icon: Users,
                children: [
                    {
                        label: "Registrasi Pasien",
                        to: "/pendaftaran/registrasi-baru",
                        icon: UserPlus,
                        children: [
                            { label: "Registrasi Pasien Baru", to: "/pendaftaran/registrasi-baru", icon: UserPlus },
                            { label: "Registrasi Pasien Lama", to: "/pendaftaran/registrasi-lama", icon: UserSearch },
                            { label: "Anjungan Mandiri", to: "/pendaftaran/anjungan-mandiri", icon: MonitorSmartphone },
                            { label: "Jadwal Dokter", to: "/pendaftaran/jadwal-dokter", icon: CalendarClock },
                            { label: "Pilih Poli", to: "/pendaftaran/pilih-poli", icon: Stethoscope },
                        ],
                    },
                    {
                        label: "Antrean & Booking",
                        to: "/pendaftaran/antrean",
                        icon: ClipboardList,
                        children: [
                            { label: "Antrean Loket & Poli", to: "/pendaftaran/antrean", icon: ClipboardList },
                            { label: "Booking Appointment", to: "/pendaftaran/booking", icon: CalendarClock },
                        ],
                    },
                    {
                        label: "Penjamin & Bridging",
                        to: "/pendaftaran/validasi-penjamin",
                        icon: ShieldCheck,
                        children: [
                            { label: "Validasi Penjamin", to: "/pendaftaran/validasi-penjamin", icon: ShieldCheck },
                            { label: "Bridging BPJS V-Claim", to: "/pendaftaran/bridging-bpjs", icon: RefreshCw },
                            { label: "Bridging SATUSEHAT", to: "/pendaftaran/bridging-satusehat", icon: Network },
                        ],
                    },
                    {
                        label: "Riwayat & Dokumen",
                        to: "/pendaftaran/riwayat",
                        icon: History,
                        children: [
                            { label: "Riwayat Kunjungan", to: "/pendaftaran/riwayat", icon: History },
                            { label: "Cetak Dokumen", to: "/pendaftaran/cetak-dokumen", icon: Printer },
                            { label: "Upload Dokumen Pasien", to: "/pendaftaran/upload-dokumen", icon: FileUp },
                        ],
                    },
                    {
                        label: "Operasional & Monitor",
                        to: "/pendaftaran/monitoring",
                        icon: Activity,
                        children: [
                            { label: "Monitoring Registrasi", to: "/pendaftaran/monitoring", icon: Activity },
                            { label: "Mutasi Registrasi", to: "/pendaftaran/mutasi", icon: ArrowLeftRight },
                            { label: "Pembatalan Registrasi", to: "/pendaftaran/pembatalan", icon: XCircle },
                        ],
                    },
                    {
                        label: "Audit & Pelaporan",
                        to: "/pendaftaran/laporan",
                        icon: BarChart3,
                        children: [
                            { label: "Audit Log Loket", to: "/pendaftaran/audit-log", icon: FileText },
                            { label: "Laporan Pendaftaran", to: "/pendaftaran/laporan", icon: BarChart3 },
                            { label: "Pengaturan Pendaftaran", to: "/pendaftaran/pengaturan", icon: Settings },
                        ],
                    },
                ],
            },
            {
                label: "Kedokteran & CPPT",
                to: "/pemeriksaan",
                icon: Stethoscope,
                children: [
                    { label: "Pemeriksaan Dokter", to: "/pemeriksaan", icon: LayoutDashboard },
                    { label: "Antrean Poliklinik", to: "/pemeriksaan?tab=antrean", icon: Clock },
                    { label: "Pemeriksaan & Anamnesis", to: "/pemeriksaan?tab=pemeriksaan", icon: Stethoscope },
                    { label: "E-Prescribing (Resep Elektronik)", to: "/pemeriksaan?tab=resep", icon: PillBottle },
                    { label: "Order Penunjang Lab/Rad", to: "/pemeriksaan?tab=order", icon: FlaskConical },
                    { label: "CPPT & Resume Medis", to: "/pemeriksaan?tab=cppt", icon: FileText },
                ],
            },
            {
                label: "Rawat Inap & Bangsal",
                to: "/rawat-inap",
                icon: BedDouble,
                children: [
                    { label: "Dashboard Rawat Inap", to: "/rawat-inap", icon: LayoutDashboard },
                    { label: "Bed Management (Peta Kamar)", to: "/rawat-inap?tab=beds", icon: BedDouble },
                    { label: "Admisi & Booking Bed", to: "/rawat-inap?tab=admisi", icon: UserPlus },
                    { label: "CPPT & Catatan Perawat", to: "/rawat-inap?tab=cppt", icon: FileText },
                    { label: "Vital Signs & Monitoring", to: "/rawat-inap?tab=vitals", icon: Activity },
                    { label: "Transfer & Mutasi Pasien", to: "/rawat-inap?tab=mutasi", icon: ArrowLeftRight },
                    { label: "Discharge Planning & Resume", to: "/rawat-inap?tab=discharge", icon: LogOut },
                ],
            },
        ],
    },
    {
        title: "Farmasi & Penunjang",
        items: [
            {
                label: "Farmasi & Depo Obat",
                to: "/farmasi",
                icon: PillBottle,
                children: [
                    { label: "Dashboard Depo Farmasi", to: "/farmasi", icon: LayoutDashboard },
                    { label: "Resep Masuk & Verifikasi", to: "/farmasi?tab=resep", icon: ClipboardList },
                    { label: "Penyiapan & Dispensing", to: "/farmasi?tab=dispensing", icon: PillBottle },
                    { label: "Obat Racikan & Formularium", to: "/farmasi?tab=racikan", icon: Syringe },
                    { label: "Stok Obat & Inventori", to: "/farmasi?tab=stok", icon: Boxes },
                    { label: "Retur & Kadaluarsa", to: "/farmasi?tab=retur", icon: XCircle },
                    { label: "PIO & Farklin (Rekonsiliasi)", to: "/farmasi?tab=pio", icon: HeartPulse },
                ],
            },
            {
                label: "Penunjang Medis",
                to: "/penunjang",
                icon: FlaskConical,
                children: [
                    { label: "Laboratorium Patologi & Darah", to: "/penunjang?tab=laboratorium", icon: FlaskConical },
                    { label: "Radiologi (X-Ray, CT, USG)", to: "/penunjang?tab=radiologi", icon: FileText },
                    { label: "Rehab Medik & FISIO", to: "/penunjang?tab=rehab-medik", icon: Activity },
                    { label: "Paket MCU (Check Up)", to: "/penunjang?tab=mcu", icon: Stethoscope },
                    { label: "Jadwal & Order Operasi (OK)", to: "/penunjang?tab=operasi", icon: Syringe },
                ],
            },
        ],
    },
    {
        title: "Finansial & Logistik",
        items: [
            {
                label: "Kasir & Billing",
                to: "/kasir",
                icon: Receipt,
                children: [
                    { label: "Pembayaran & Billing Kasir", to: "/kasir?tab=pembayaran", icon: Receipt },
                    { label: "Deposit Pasien", to: "/kasir?tab=deposit", icon: Wallet },
                    { label: "Buka / Tutup Kasir", to: "/kasir?tab=buka-tutup", icon: Clock },
                    { label: "Bendahara & Penerimaan Kas", to: "/kasir?tab=bendahara", icon: Banknote },
                    { label: "Jurnal & Buku Besar Akuntansi", to: "/kasir?tab=akuntansi", icon: Scale },
                ],
            },
            {
                label: "Inventory & Logistik",
                to: "/inventory",
                icon: Boxes,
                children: [
                    { label: "Katalog & Stok Logistik", to: "/inventory?tab=stok", icon: Boxes },
                    { label: "Pemesanan Barang (PO)", to: "/inventory?tab=pemesanan", icon: Truck },
                    { label: "Penerimaan & SP", to: "/inventory?tab=penerimaan", icon: ClipboardList },
                    { label: "Permintaan & Distribusi Unit", to: "/inventory?tab=distribusi", icon: ArrowLeftRight },
                    { label: "Stok Opname & Kartu Stok", to: "/inventory?tab=opname", icon: FileSpreadsheet },
                ],
            },
        ],
    },
    {
        title: "Integrasi & Dokumen",
        items: [
            {
                label: "Integrasi & Bridging",
                to: "/integrasi",
                icon: Network,
                children: [
                    { label: "BPJS V-Claim & HFIS", to: "/integrasi?tab=bpjs", icon: ShieldCheck },
                    { label: "SATUSEHAT Kemenkes", to: "/integrasi?tab=satusehat", icon: Network },
                    { label: "SITB (Tuberkulosis)", to: "/integrasi?tab=sitb", icon: Activity },
                    { label: "RS Online & Apotek Online", to: "/integrasi?tab=rs-online", icon: Building2 },
                ],
            },
            {
                label: "Surat Digital Medis",
                to: "/surat-digital",
                icon: FileText,
                children: [
                    { label: "Surat Keterangan Sakit", to: "/surat-digital?tab=sakit", icon: FileText },
                    { label: "Surat Keterangan Dirawat", to: "/surat-digital?tab=dirawat", icon: HeartPulse },
                    { label: "Surat Kontrol Rawat Inap/Poli", to: "/surat-digital?tab=kontrol", icon: CalendarClock },
                    { label: "Surat Kematian", to: "/surat-digital?tab=kematian", icon: FileText },
                    { label: "Surat Keterangan Sehat", to: "/surat-digital?tab=sehat", icon: UserCheck },
                ],
            },
            {
                label: "Rekam Medis (RME)",
                to: "/rekam-medis",
                icon: FileText,
            },
        ],
    },
    {
        title: "Laporan & System",
        items: [
            {
                label: "Laporan & Analitik RS",
                to: "/laporan",
                icon: BarChart3,
                children: [
                    { label: "Pusat Laporan & Dashboard", to: "/laporan", icon: LayoutDashboard },
                    { label: "Laporan Wajib RL (1.1 - 5.4)", to: "/laporan?tab=rl", icon: FileText },
                    { label: "Laporan Keuangan & Kasir", to: "/laporan?tab=keuangan", icon: Banknote },
                    { label: "Laporan Kunjungan Pelayanan", to: "/laporan?tab=pelayanan", icon: Activity },
                    { label: "Laporan Farmasi & Inventori", to: "/laporan?tab=farmasi", icon: Boxes },
                ],
            },
            {
                label: "Pengaturan System",
                to: "/pengaturan",
                icon: Settings,
            },
        ],
    },
];

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

function isNavActive(item: NavItem, currentPath: string, currentSearch: string = ""): boolean {
    const fullUrl = currentPath + currentSearch;
    if (item.to === fullUrl) return true;
    if (item.to === currentPath && !currentSearch) return true;
    if (item.to.includes("?") && fullUrl.startsWith(item.to)) return true;
    if (item.to !== "/" && !item.to.includes("?") && currentPath.startsWith(item.to)) return true;
    if (item.children && item.children.length > 0) {
        return item.children.some((child) => isNavActive(child, currentPath, currentSearch));
    }
    return false;
}

/* -------------------------------------------------------------------------- */
/*                              SIDEBAR LINK                                  */
/* -------------------------------------------------------------------------- */

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
    const location = useLocation();
    const isActive = isNavActive(item, location.pathname, location.search);

    return (
        <NavLink
            to={to}
            title={collapsed ? item.label : undefined}
            className={cn(
                "group relative flex items-center rounded-lg select-none transition-all duration-150 py-1.5 px-2 text-xs font-medium",
                collapsed ? "justify-center px-0 py-2" : "",
                isActive
                    ? "bg-slate-100 text-slate-900 font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900"
            )}
            style={!collapsed && depth > 0 ? { paddingLeft: `${depth * 16 + 8}px` } : undefined}
        >
            <Icon
                className={cn(
                    "shrink-0 transition-colors stroke-[1.8]",
                    depth === 0 ? "h-4 w-4" : "h-3.5 w-3.5",
                    isActive ? "text-black" : "text-slate-500 group-hover:text-slate-800"
                )}
            />
            {!collapsed && <span className="truncate flex-1 ml-2">{item.label}</span>}
            {!collapsed && item.badge && (
                <span
                    className={cn(
                        "rounded-full px-1.5 py-0.2 text-[9px] font-bold",
                        isActive ? "bg-white text-slate-900" : "bg-slate-200 text-slate-700"
                    )}
                >
                    {item.badge}
                </span>
            )}
        </NavLink>
    );
}

/* -------------------------------------------------------------------------- */
/*                            SIDEBAR NAV ITEM                                */
/* -------------------------------------------------------------------------- */

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
    const hasChildren = !!item.children?.length;
    const childActive = hasChildren
        ? isNavActive(item, location.pathname, location.search)
        : false;

    const [open, setOpen] = useState(childActive);

    useEffect(() => {
        if (childActive) setOpen(true);
    }, [childActive, location.pathname, location.search]);

    if (!hasChildren) {
        return (
            <SidebarLink
                item={item}
                to={item.to}
                icon={item.icon}
                depth={depth}
                collapsed={collapsed}
            />
        );
    }

    return (
        <div className="relative">
            <button
                type="button"
                title={collapsed ? item.label : undefined}
                onClick={() => {
                    if (collapsed) {
                        onExpand?.();
                        setOpen(true);
                        return;
                    }
                    setOpen((o) => !o);
                }}
                className={cn(
                    "group relative flex w-full items-center rounded-lg select-none py-1.5 px-2 text-xs font-semibold transition-all duration-150",
                    collapsed ? "justify-center px-0 py-2" : "",
                    childActive && !open
                        ? "bg-slate-200/80 text-slate-950 font-bold border border-slate-300"
                        : open
                            ? "text-slate-900 font-bold bg-slate-200/40"
                            : "text-slate-700 hover:bg-slate-200/50 hover:text-slate-900"
                )}
                style={
                    !collapsed && depth > 0
                        ? { paddingLeft: `${depth * 16 + 8}px` }
                        : undefined
                }
            >
                {!collapsed && (
                    <ChevronRight
                        className={cn(
                            "h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-150 stroke-[2] mr-1",
                            open && "rotate-90 text-slate-700"
                        )}
                    />
                )}

                <item.icon
                    className={cn(
                        "shrink-0 transition-colors stroke-[1.8]",
                        depth === 0 ? "h-4 w-4" : "h-3.5 w-3.5",
                        childActive ? "text-slate-950" : "text-slate-500 group-hover:text-slate-800"
                    )}
                />

                {!collapsed && (
                    <span className="flex-1 truncate text-left ml-2">{item.label}</span>
                )}
            </button>

            {!collapsed && open && (
                <div className="relative mt-0.5 ml-[15px] space-y-0.5 border-l border-slate-300 pl-1">
                    {item.children!.map((child) => (
                        <SidebarNavItem
                            key={child.to + child.label}
                            item={child}
                            depth={depth + 1}
                            collapsed={collapsed}
                            onExpand={onExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                              HEADER MENU ITEM                              */
/* -------------------------------------------------------------------------- */

function HeaderMenuItem({
    icon: Icon,
    label,
    onClick,
    variant = "default",
}: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    variant?: "default" | "danger";
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                variant === "danger"
                    ? "text-rose-600 hover:bg-rose-50"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )}
        >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            {label}
        </button>
    );
}

/* -------------------------------------------------------------------------- */
/*                              SIDEBAR HEADER                                */
/* -------------------------------------------------------------------------- */

function SidebarHeader({
    collapsed,
    onToggle,
}: {
    collapsed?: boolean;
    onToggle?: () => void;
}) {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="border-b border-slate-200/80 p-3">
            {collapsed ? (
                <button
                    type="button"
                    onClick={onToggle}
                    title="Buka menu"
                    className="mx-auto flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                    <PanelLeftOpen className="h-4 w-4" />
                </button>
            ) : (
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen((p) => !p)}
                        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-slate-100"
                    >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white">
                            <Activity className="h-3.5 w-3.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            {/* Baris 1: Nama Dokter/User + Arrow Down */}
                            <div className="flex items-center gap-1">
                                <p className="truncate text-[13px] font-semibold leading-tight text-slate-900">
                                    {User?.name || "dr. Alex Sp.A"} {/* <-- Tampilkan Nama di sini */}
                                </p>
                                <ChevronDown
                                    className={cn(
                                        "h-3 w-3 shrink-0 text-slate-400 transition-transform duration-150",
                                        dropdownOpen && "rotate-180"
                                    )}
                                />
                            </div>

                            {/* Baris 2: Spesialis/Peran */}
                            <p className="truncate text-[11px] leading-tight text-slate-500">
                                {User?.name || "Spesialis Anak"} {/* <-- Tampilkan Spesialisasi di sini */}
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={onToggle}
                        title="Ciutkan menu"
                        className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:flex"
                    >
                        <PanelLeftClose className="h-4 w-4" />
                    </button>
                </div>
            )}

            {!collapsed && dropdownOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute left-3 right-3 top-[52px] z-20 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                        <div className="border-b border-slate-100 px-3 py-2">
                            <p className="text-[12px] font-semibold text-slate-900">
                                dr. Rina Masruroh
                            </p>
                            <p className="truncate text-[11px] text-slate-500">
                                dr.rina@simrs.id
                            </p>
                        </div>
                        <div className="mt-1 space-y-0.5">
                            <HeaderMenuItem
                                icon={User}
                                label="Pengaturan Akun"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    navigate("/pengaturan");
                                }}
                            />
                            <HeaderMenuItem
                                icon={Plus}
                                label="Pendaftaran Pasien Baru"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    navigate("/pendaftaran/registrasi-baru");
                                }}
                            />
                            <HeaderMenuItem
                                icon={LogOut}
                                label="Keluar"
                                variant="danger"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    navigate("/login");
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                SIDEBAR NAV                                 */
/* -------------------------------------------------------------------------- */

function SidebarNav({
    collapsed,
    onExpand,
}: {
    collapsed: boolean;
    onExpand?: () => void;
}) {
    return (
        <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-3 scrollbar-thin scrollbar-thumb-slate-200">
            {navGroups.map((group) => (
                <div key={group.title}>
                    {collapsed ? (
                        <div className="mx-2 mb-2 h-px bg-slate-200" />
                    ) : (
                        <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {group.title}
                        </p>
                    )}
                    <div className="space-y-0.5">
                        {group.items.map((item) => (
                            <SidebarNavItem
                                key={item.to + item.label}
                                item={item}
                                collapsed={collapsed}
                                onExpand={onExpand}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    );
}

/* -------------------------------------------------------------------------- */
/*                                  SIDEBAR                                   */
/* -------------------------------------------------------------------------- */

export function Sidebar({
    collapsed = false,
    mobileOpen = false,
    onToggle,
    onCloseMobile,
    width,
    onWidthChange,
    minWidth = MIN_SIDEBAR_WIDTH,
    maxWidth = MAX_SIDEBAR_WIDTH,
}: SidebarProps) {
    const [isResizing, setIsResizing] = useState(false);
    const [internalWidth, setInternalWidth] = useState<number>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("simrs_sidebar_width");
            if (saved) {
                const parsed = parseInt(saved, 10);
                if (!isNaN(parsed) && parsed >= minWidth && parsed <= maxWidth) {
                    return parsed;
                }
            }
        }
        return DEFAULT_SIDEBAR_WIDTH;
    });

    const currentWidth = width ?? internalWidth;

    const updateWidth = (newWidth: number) => {
        const clamped = Math.min(Math.max(newWidth, minWidth), maxWidth);
        if (onWidthChange) {
            onWidthChange(clamped);
        } else {
            setInternalWidth(clamped);
        }
        if (typeof window !== "undefined") {
            localStorage.setItem("simrs_sidebar_width", clamped.toString());
        }
    };

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            updateWidth(e.clientX);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) {
                updateWidth(e.touches[0].clientX);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleMouseUp);

        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleMouseUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isResizing, minWidth, maxWidth]);

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] lg:hidden"
                    onClick={onCloseMobile}
                />
            )}

            <aside
                style={
                    {
                        "--sidebar-width": collapsed ? `${COLLAPSED_SIDEBAR_WIDTH}px` : `${currentWidth}px`,
                    } as React.CSSProperties
                }
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col select-none",
                    "border-r border-slate-200/80 bg-white",
                    !isResizing && "transition-[width,transform] duration-200 ease-out",
                    "lg:translate-x-0 lg:w-[var(--sidebar-width)]",
                    mobileOpen ? "translate-x-0" : "-translate-x-full",
                    "w-[var(--sidebar-width)]"
                )}
            >
                {/* Drag / Resize Handle */}
                {!collapsed && (
                    <div
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setIsResizing(true);
                        }}
                        onTouchStart={() => {
                            setIsResizing(true);
                        }}
                        onDoubleClick={() => {
                            updateWidth(DEFAULT_SIDEBAR_WIDTH);
                        }}
                        title="Geser untuk mengubah lebar sidebar (klik 2x untuk reset)"
                        className={cn(
                            "absolute top-0 right-0 bottom-0 z-50 w-2.5 cursor-col-resize group flex items-center justify-center -mr-1",
                            "hover:bg-indigo-500/20 transition-colors select-none touch-none",
                            isResizing && "bg-indigo-500/30"
                        )}
                    >
                        <div
                            className={cn(
                                "w-0.5 h-8 rounded-full bg-slate-300 group-hover:bg-indigo-600 transition-all",
                                isResizing && "bg-indigo-600 h-12 w-1 shadow-sm"
                            )}
                        />
                    </div>
                )}

                {onCloseMobile && (
                    <div className="absolute right-2 top-2 z-10 lg:hidden">
                        <button
                            type="button"
                            onClick={onCloseMobile}
                            title="Tutup menu"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <SidebarHeader collapsed={collapsed} onToggle={onToggle} />
                <SidebarNav collapsed={collapsed} onExpand={() => onToggle?.()} />
            </aside>
        </>
    );
}