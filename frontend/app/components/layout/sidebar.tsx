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

export interface NavItem {
    label: string;
    to: string;
    icon: LucideIcon;
    badge?: string;
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

export interface NavGroup {
    title: string;
    items: NavItem[];
}

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
                    { label: "Dashboard Kedokteran", to: "/pemeriksaan", icon: LayoutDashboard },
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
            className={() =>
                cn(
                    "group flex items-center gap-2.5 rounded-xl transition-all duration-150 select-none",
                    depth === 0
                        ? "px-3.5 py-2 text-xs font-semibold"
                        : depth === 1
                            ? "pl-8 pr-3 py-1.5 text-xs font-medium"
                            : "pl-11 pr-3 py-1.5 text-[11px] font-medium",
                    collapsed ? "justify-center px-0 py-2.5" : "",
                    isActive
                        ? "bg-blue-600 text-white shadow-md font-bold"
                        : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                )
            }
            title={collapsed ? item.label : undefined}
        >
            <Icon
                className={cn(
                    "shrink-0 transition-colors",
                    depth === 0
                        ? "h-4 w-4"
                        : depth === 1
                            ? "h-3.5 w-3.5"
                            : "h-3 w-3",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-slate-800"
                )}
            />
            {!collapsed && <span className="truncate flex-1">{item.label}</span>}
            {!collapsed && item.badge && (
                <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-2xs">
                    {item.badge}
                </span>
            )}
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
    const childActive = hasChildren ? isNavActive(item, location.pathname, location.search) : false;

    const [open, setOpen] = useState(childActive);

    useEffect(() => {
        if (childActive) setOpen(true);
    }, [childActive, location.pathname, location.search]);

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
                    "group flex w-full items-center gap-2.5 rounded-xl transition-all duration-150 select-none",
                    depth === 0
                        ? "px-3.5 py-2 text-xs font-semibold"
                        : depth === 1
                            ? "pl-8 pr-3 py-1.5 text-xs font-semibold"
                            : "pl-11 pr-3 py-1 text-[11px] font-medium",
                    collapsed ? "justify-center px-0 py-2.5" : "",
                    childActive && depth === 0
                        ? "bg-slate-200/80 text-blue-700 font-bold"
                        : childActive
                            ? "bg-slate-200/60 text-slate-900 font-semibold"
                            : open
                                ? "bg-slate-200/30 text-slate-900"
                                : "text-slate-600 hover:bg-slate-200/40 hover:text-slate-900"
                )}
            >
                <item.icon
                    className={cn(
                        "shrink-0 transition-colors",
                        depth === 0 ? "h-4 w-4" : depth === 1 ? "h-3.5 w-3.5" : "h-3 w-3",
                        childActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-800"
                    )}
                />
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
                <div className="mt-0.5 space-y-0.5">
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
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="relative p-3.5 border-b border-slate-200/80 bg-white">
            <div className="flex items-center justify-between gap-2">
                {collapsed ? (
                    <button
                        type="button"
                        onClick={onToggle}
                        title="Buka menu sidebar"
                        className={cn(
                            "flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-slate-900 text-white shadow-md hover:bg-blue-600 transition-all",
                            isHovered && "scale-105"
                        )}
                    >
                        <PanelLeftOpen className="h-5 w-5" />
                    </button>
                ) : (
                    <>
                        <div
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            title="Menu Akun & Profil"
                            className="flex items-center gap-2.5 min-w-0 flex-1 rounded-xl border border-slate-200/80 bg-slate-50 p-2 shadow-2xs cursor-pointer hover:bg-slate-100 transition-all relative"
                        >
                            <img
                                src="/logo.jpg"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/public/logo.jpg"; }}
                                alt="RS"
                                className="h-9 w-9 rounded-xl object-cover border border-slate-200"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-extrabold text-slate-900 leading-tight">RSUD Sidoarjo</p>
                                <p className="truncate text-[10px] text-slate-400 font-medium">dr.rina@simrs.id</p>
                            </div>
                            <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200", dropdownOpen && "rotate-180 text-slate-700")} />
                        </div>

                        <button
                            type="button"
                            onClick={onToggle}
                            title="Ciutkan menu"
                            className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs hover:bg-slate-100 hover:text-slate-900 transition-all"
                        >
                            <PanelLeftClose className="h-4 w-4" />
                        </button>
                    </>
                )}
            </div>

            {/* Dropdown Menu untuk Pengaturan Akun & Logout */}
            {!collapsed && dropdownOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />

                    <div className="absolute left-3.5 right-3.5 top-[60px] z-20 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 space-y-0.5">
                        <button
                            type="button"
                            onClick={() => {
                                setDropdownOpen(false);
                                navigate("/pengaturan");
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
                        >
                            <User className="h-4 w-4 text-blue-600" />
                            Pengaturan Akun
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setDropdownOpen(false);
                                navigate("/login");
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all"
                        >
                            <LogOut className="h-4 w-4 text-rose-500" />
                            Keluar (Logout)
                        </button>
                    </div>
                </>
            )}

            {!collapsed && (
                <div className="mt-2.5">
                    <button
                        type="button"
                        onClick={() => navigate("/pendaftaran/registrasi-baru")}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 px-3 text-xs font-bold text-white shadow-md hover:bg-blue-500 active:scale-98 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Pendaftaran Baru
                    </button>
                </div>
            )}
        </div>
    );
}

function SidebarNav({ collapsed, onExpand }: { collapsed: boolean; onExpand?: () => void }) {
    return (
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-5 text-xs scrollbar-thin scrollbar-thumb-slate-200">
            {navGroups.map((group) => (
                <div key={group.title}>
                    <p className={cn("px-3 mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400", collapsed && "text-center px-0")}>
                        {collapsed ? "•••" : group.title}
                    </p>
                    <div className="space-y-0.5">
                        {group.items.map((item) => (
                            <SidebarNavItem key={item.to + item.label} item={item} collapsed={collapsed} onExpand={onExpand} />
                        ))}
                    </div>
                </div>
            ))}
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
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#F8FAFC] border-r border-slate-200/80 transition-all duration-300 select-none shadow-xs",
                    "lg:flex",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    collapsed ? "lg:w-[76px]" : "lg:w-64",
                    "w-64"
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