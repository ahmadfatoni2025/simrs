import { useState } from "react";
import ResourcePage, {
    type ResourceColumn,
} from "~/components/resource/ResourcePage";
import { StatusBadge } from "~/components/ui/StatusBadge";
import PendaftaranForm from "~/components/pendaftaran/PendaftaranForm";

const columns: ResourceColumn[] = [
    { key: "no", label: "No. Pendaftaran" },
    { key: "rm", label: "No. RM" },
    { key: "name", label: "Nama Pasien" },
    { key: "poli", label: "Poli" },
    { key: "dokter", label: "Dokter" },
    { key: "tanggal", label: "Tanggal" },
    {
        key: "status",
        label: "Status",
        render: (row) => <StatusBadge value={String(row.status ?? "-")} />,
    },
];

export default function PendaftaranPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <>
            <ResourcePage
                title="Pendaftaran Pasien"
                subtitle="Daftar pasien yang terdaftar di rumah sakit"
                endpoint="/pendaftaran"
                searchPlaceholder="Cari nama pasien / No. RM..."
                columns={columns}
                refreshKey={refreshKey}
                action={
                    <button
                        onClick={() => setFormOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Daftar Pasien
                    </button>
                }
            />
            <PendaftaranForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSaved={() => {
                    setFormOpen(false);
                    setRefreshKey((k) => k + 1);
                }}
            />
        </>
    );
}
