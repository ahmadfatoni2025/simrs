import ResourcePage, {
    type ResourceColumn,
} from "~/components/resource/ResourcePage";
import { StatusBadge } from "~/components/ui/StatusBadge";

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
    return (
        <ResourcePage
            title="Pendaftaran Pasien"
            subtitle="Daftar pasien yang terdaftar di rumah sakit"
            endpoint="/pendaftaran"
            searchPlaceholder="Cari nama pasien / No. RM..."
            columns={columns}
        />
    );
}
