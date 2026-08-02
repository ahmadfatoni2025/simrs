import ResourcePage, {
    type ResourceColumn,
} from "~/components/resource/ResourcePage";

function money(value: unknown) {
    return "Rp " + Number(value ?? 0).toLocaleString("id-ID");
}

const columns: ResourceColumn[] = [
    { key: "nama_tarif", label: "Tindakan / Layanan" },
    {
        key: "nominal",
        label: "Tarif",
        render: (row) => <span className="font-medium">{money(row.nominal)}</span>,
    },
    { key: "keterangan", label: "Keterangan" },
];

export default function PemeriksaanPage() {
    return (
        <ResourcePage
            title="Pemeriksaan & Tindakan"
            subtitle="Daftar tarif tindakan dan layanan medis"
            endpoint="/master-data/tarif"
            searchPlaceholder="Cari tindakan/layanan..."
            columns={columns}
        />
    );
}
