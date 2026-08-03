import ResourcePage, {
    type ResourceColumn,
} from "~/components/resource/ResourcePage";
import { StatusBadge } from "~/components/ui/StatusBadge";
import KamarTable from "./ui/KamarTable";

const columns: ResourceColumn[] = [
    { key: "nama_kamar", label: "Nama Kamar" },
    { key: "kelas", label: "Kelas" },
    {
        key: "status",
        label: "Status",
        render: (row) => <StatusBadge value={String(row.status ?? "-")} />,
    },
    { key: "jumlah_tempat_tidur", label: "Tempat Tidur" },
    { key: "keterangan", label: "Keterangan" },
];

export default function RawatInapPage() {
    return (
        <ResourcePage
            title="Rawat Inap"
            subtitle="Daftar kamar dan ketersediaan tempat tidur"
            endpoint="/master-data/kamar"
            searchPlaceholder="Cari nama kamar..."
            columns={columns}
            layout={(rows, onOpen) => <KamarTable rows={rows} columns={columns} onOpen={onOpen} />}
        />
    );
}
