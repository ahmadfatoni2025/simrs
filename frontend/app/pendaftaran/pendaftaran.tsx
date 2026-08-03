import { useState } from "react";
import ResourcePage, {
    type ResourceColumn,
} from "~/components/resource/ResourcePage";
import { StatusBadge } from "~/components/ui/StatusBadge";
import PendaftaranForm from "./ui/PendaftaranForm";
import PasienKanban from "./ui/PasienKanban";

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
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <ResourcePage
            title="Pendaftaran Pasien"
            subtitle="Daftar pasien yang terdaftar di rumah sakit"
            endpoint="/pendaftaran"
            searchPlaceholder="Cari nama pasien / No. RM..."
            columns={columns}
            refreshKey={refreshKey}
            layout={(rows, onOpen) => (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                    <PendaftaranForm
                        onSaved={() => setRefreshKey((k) => k + 1)}
                    />
                    <PasienKanban rows={rows} columns={columns} onOpen={onOpen} />
                </div>
            )}
        />
    );
}
