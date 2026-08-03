import { ChevronRight } from "lucide-react";
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
            layout={rows => (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {rows.map((row) => (
                        <div key={row.id} className="group relative flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">{String(row.nama_pegawai)}</h3>
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700">{String(row.jenis_kelamin_pegawai)}</span>
                            </div>
                            <div className="flex items-start justify-between gap-3 text-xs">
                                <span className="shrink-0 text-slate-400 capitalize">NIK</span>
                                <span className="truncate text-right font-medium text-slate-700">{String(row.nik_pegawai)}</span>
                            </div>
                            <div className="flex items-start justify-between gap-3 text-xs">
                                <span className="shrink-0 text-slate-400 capitalize">SIP</span>
                                <span className="truncate text-right font-medium text-slate-700">{String(row.no_sip_pegawai)}</span>
                            </div>
                            <div className="flex items-start justify-between gap-3 text-xs">
                                <span className="shrink-0 text-slate-400 capitalize">Status</span>
                                <span className="truncate text-right">
                                    <StatusBadge value={String(row.pegawai_keluar ?? "Aktif")} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        />
    );
}
