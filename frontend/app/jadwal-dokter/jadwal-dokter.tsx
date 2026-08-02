import ResourcePage, {
    type ResourceColumn,
} from "~/components/resource/ResourcePage";
import { StatusBadge } from "~/components/ui/StatusBadge";

const columns: ResourceColumn[] = [
    { key: "nik_pegawai", label: "NIK" },
    { key: "nama_pegawai", label: "Nama Dokter" },
    { key: "jenis_kelamin_pegawai", label: "L/P" },
    { key: "no_sip_pegawai", label: "No. SIP" },
    {
        key: "pegawai_keluar",
        label: "Status",
        render: (row) => (
            <StatusBadge value={String(row.pegawai_keluar ?? "Aktif")} />
        ),
    },
];

export default function JadwalDokterPage() {
    return (
        <ResourcePage
            title="Jadwal Dokter"
            subtitle="Daftar dokter dan tenaga medis aktif"
            endpoint="/master-data/pegawai"
            searchPlaceholder="Cari nama dokter..."
            columns={columns}
        />
    );
}
