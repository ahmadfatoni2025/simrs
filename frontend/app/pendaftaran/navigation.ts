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

export interface FeatureItem {
    label: string;
    to: string;
    icon: LucideIcon;
    group: string;
}

export const featureGroups: { name: string; items: FeatureItem[] }[] = [
    {
        name: "Umum",
        items: [
            { label: "Dashboard", to: "/pendaftaran", icon: LayoutDashboard, group: "Umum" },
        ],
    },
    {
        name: "Registrasi",
        items: [
            { label: "Registrasi Pasien Baru", to: "/pendaftaran/registrasi-baru", icon: UserPlus, group: "Registrasi" },
            { label: "Registrasi Pasien Lama", to: "/pendaftaran/registrasi-lama", icon: UserSearch, group: "Registrasi" },
            { label: "Registrasi Anjungan Mandiri", to: "/pendaftaran/anjungan-mandiri", icon: MonitorSmartphone, group: "Registrasi" },
            { label: "Jadwal Dokter", to: "/pendaftaran/jadwal-dokter", icon: CalendarClock, group: "Registrasi" },
            { label: "Pilih Poli", to: "/pendaftaran/pilih-poli", icon: Stethoscope, group: "Registrasi" },
        ],
    },
    {
        name: "Antrean & Booking",
        items: [
            { label: "Antrean", to: "/pendaftaran/antrean", icon: ClipboardList, group: "Antrean" },
            { label: "Booking Appointment", to: "/pendaftaran/booking", icon: CalendarClock, group: "Antrean" },
        ],
    },
    {
        name: "Penjamin & Bridging",
        items: [
            { label: "Validasi Penjamin", to: "/pendaftaran/validasi-penjamin", icon: ShieldCheck, group: "Bridging" },
            { label: "Bridging BPJS", to: "/pendaftaran/bridging-bpjs", icon: RefreshCw, group: "Bridging" },
            { label: "Bridging SATUSEHAT", to: "/pendaftaran/bridging-satusehat", icon: Network, group: "Bridging" },
        ],
    },
    {
        name: "Riwayat & Dokumen",
        items: [
            { label: "Riwayat Kunjungan", to: "/pendaftaran/riwayat", icon: History, group: "Dokumen" },
            { label: "Cetak Dokumen", to: "/pendaftaran/cetak-dokumen", icon: Printer, group: "Dokumen" },
            { label: "Upload Dokumen", to: "/pendaftaran/upload-dokumen", icon: FileUp, group: "Dokumen" },
        ],
    },
    {
        name: "Operasional",
        items: [
            { label: "Mutasi Registrasi", to: "/pendaftaran/mutasi", icon: ArrowLeftRight, group: "Operasional" },
            { label: "Pembatalan Registrasi", to: "/pendaftaran/pembatalan", icon: XCircle, group: "Operasional" },
            { label: "Monitoring Registrasi", to: "/pendaftaran/monitoring", icon: Activity, group: "Operasional" },
        ],
    },
    {
        name: "Audit & Pelaporan",
        items: [
            { label: "Audit Log", to: "/pendaftaran/audit-log", icon: FileText, group: "Audit" },
            { label: "Laporan", to: "/pendaftaran/laporan", icon: BarChart3, group: "Audit" },
            { label: "Pengaturan", to: "/pendaftaran/pengaturan", icon: Settings, group: "Audit" },
        ],
    },
];

export const allFeatures: FeatureItem[] = featureGroups.flatMap((g) => g.items);
