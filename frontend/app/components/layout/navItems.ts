import {
    BarChart3,
    BedDouble,
    CalendarClock,
    FileText,
    LayoutDashboard,
    PillBottle,
    Settings,
    Stethoscope,
    Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
    label: string;
    to: string;
    icon: LucideIcon;
}

export const navItems: NavItem[] = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Pendaftaran Pasien", to: "/pendaftaran", icon: Users },
    { label: "Jadwal Dokter", to: "/jadwal-dokter", icon: CalendarClock },
    { label: "Rekam Medis", to: "/rekam-medis", icon: FileText },
    { label: "Pemeriksaan & Tindakan", to: "/pemeriksaan", icon: Stethoscope },
    { label: "Farmasi & Obat", to: "/farmasi", icon: PillBottle },
    { label: "Rawat Inap", to: "/rawat-inap", icon: BedDouble },
    { label: "Laporan", to: "/laporan", icon: BarChart3 },
    { label: "Pengaturan", to: "/pengaturan", icon: Settings },
];