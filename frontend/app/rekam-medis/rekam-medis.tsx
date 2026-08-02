import ResourcePage, {
    type ResourceColumn,
} from "~/components/resource/ResourcePage";

const columns: ResourceColumn[] = [
    { key: "kode_icd", label: "Kode ICD-10" },
    { key: "deskripsi", label: "Diagnosa" },
];

export default function RekamMedisPage() {
    return (
        <ResourcePage
            title="Rekam Medis / Diagnosa"
            subtitle="Master kode ICD-10 untuk penegakan diagnosa"
            endpoint="/master-data/icd-x"
            searchPlaceholder="Cari kode / deskripsi diagnosa..."
            columns={columns}
        />
    );
}
