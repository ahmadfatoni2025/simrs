import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
    BedDouble,
    LayoutDashboard,
    UserPlus,
    FileText,
    Activity,
    ArrowLeftRight,
    LogOut,
    Sparkles
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

import DashboardRawatInap from "./ui/DashboardRawatInap";
import BedManagement from "./ui/BedManagement";
import AdmisiBookingBed from "./ui/AdmisiBookingBed";
import CPPTCatatanPerawat from "./ui/CPPTCatatanPerawat";
import VitalSignsMonitoring from "./ui/VitalSignsMonitoring";
import TransferMutasi from "./ui/TransferMutasi";
import DischargePlanning from "./ui/DischargePlanning";

export type RawatInapTab =
    | "dashboard"
    | "beds"
    | "admisi"
    | "cppt"
    | "vitals"
    | "mutasi"
    | "discharge";

interface TabItem {
    key: RawatInapTab;
    label: string;
    shortLabel: string;
    icon: typeof LayoutDashboard;
}

const TABS: TabItem[] = [
    { key: "dashboard", label: "Dashboard Rawat Inap", shortLabel: "Dashboard", icon: LayoutDashboard },
    { key: "beds", label: "Bed Management (Peta Kamar)", shortLabel: "Peta Kamar", icon: BedDouble },
    { key: "admisi", label: "Admisi & Booking Bed", shortLabel: "Admisi", icon: UserPlus },
    { key: "cppt", label: "CPPT & Catatan Perawat", shortLabel: "CPPT", icon: FileText },
    { key: "vitals", label: "Vital Signs & Monitoring", shortLabel: "Vitals", icon: Activity },
    { key: "mutasi", label: "Transfer & Mutasi Pasien", shortLabel: "Transfer", icon: ArrowLeftRight },
    { key: "discharge", label: "Discharge Planning & Resume", shortLabel: "Discharge", icon: LogOut },
];

export default function RawatInapPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get("tab") as RawatInapTab | null;
    const [activeTab, setActiveTab] = useState<RawatInapTab>(tabParam || "dashboard");

    useEffect(() => {
        if (tabParam && TABS.some((t) => t.key === tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleSelectTab = (tab: string) => {
        const validTab = tab as RawatInapTab;
        setActiveTab(validTab);
        setSearchParams(validTab === "dashboard" ? {} : { tab: validTab });
    };

    return (
        <AppShell>
            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === "dashboard" && <DashboardRawatInap onSelectTab={handleSelectTab} />}
                {activeTab === "beds" && <BedManagement onSelectAdmisi={() => handleSelectTab("admisi")} />}
                {activeTab === "admisi" && <AdmisiBookingBed />}
                {activeTab === "cppt" && <CPPTCatatanPerawat />}
                {activeTab === "vitals" && <VitalSignsMonitoring />}
                {activeTab === "mutasi" && <TransferMutasi />}
                {activeTab === "discharge" && <DischargePlanning />}
            </div>
        </AppShell>
    );
}
