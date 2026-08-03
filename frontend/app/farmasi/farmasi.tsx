import ResourcePage, {
    type ResourceColumn,
} from "~/components/resource/ResourcePage";
import ObatPriceList from "./ui/ObatPriceList";

const money = (value: unknown) =>
    "Rp " + Number(value ?? 0).toLocaleString("id-ID");

const columns: ResourceColumn[] = [
    { key: "nama_tarif", label: "Obat / Item Farmasi" },
    {
        key: "nominal",
        label: "Tarif",
        render: (row) => <span className="font-medium">{money(row.nominal)}</span>,
    },
    { key: "keterangan", label: "Keterangan" },
];

export default function FarmasiPage() {
    return (
        <ResourcePage
            title="Farmasi & Obat"
            subtitle="Daftar tarif obat dan item farmasi"
            endpoint="/master-data/tarif"
            searchPlaceholder="Cari nama obat..."
            columns={columns}
            layout={(rows, onOpen) => <ObatPriceList rows={rows} columns={columns} onOpen={onOpen} />}
        />
    );
}
