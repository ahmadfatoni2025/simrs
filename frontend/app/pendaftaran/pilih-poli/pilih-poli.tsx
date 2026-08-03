import { useEffect, useState } from "react";
import { Building2, Search } from "lucide-react";
import { api } from "~/lib/api";
import { EmptyState, FeatureShell } from "../ui/FeatureShell";

interface PoliOption {
    id_sub_unit_pegawai: number;
    nama_sub_unit_pegawai: string;
    id_unit_pegawai?: number;
}

const poliTypes = [
    { key: "Semua", label: "Semua Poli", desc: "Menampilkan seluruh poliklinik yang tersedia" },
    { key: "Spesialis", label: "Spesialis", desc: "Poli dengan layanan dokter spesialis" },
    { key: "Umum", label: "Umum", desc: "Poli layanan umum" },
    { key: "Gigi", label: "Gigi", desc: "Poli kesehatan gigi & mulut" },
    { key: "MCU", label: "MCU", desc: "Medical Check Up" },
];

export default function PilihPoli() {
    const [polis, setPolis] = useState<PoliOption[]>([]);
    const [filter, setFilter] = useState("Semua");
    const [search, setSearch] = useState("");

    useEffect(() => {
        api<{ data: PoliOption[] }>("/master-data/sub-unit-pegawai?per_page=100")
            .then((res) => setPolis(Array.isArray(res.data) ? res.data : []))
            .catch(() => setPolis([]));
    }, []);

    const filtered = polis.filter((p) => {
        const nama = String(p.nama_sub_unit_pegawai ?? "").toLowerCase();
        const matchSearch = !search || nama.includes(search.toLowerCase());
        const lower = nama;
        const matchFilter =
            filter === "Semua" ||
            lower.includes(filter.toLowerCase()) ||
            (filter === "Umum" && lower.includes("umum"));
        return matchSearch && matchFilter;
    });

    return (
        <FeatureShell
            title="Pilih Poliklinik"
            subtitle="Daftar poliklinik tujuan pendaftaran pasien"
        >
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                        {poliTypes.map((t) => (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => setFilter(t.key)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    filter === t.key
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari poli..."
                            className="w-52 rounded-lg border border-slate-300 py-1.5 pl-8 pr-3 text-xs focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="mt-4 text-xs text-slate-400">{filtered.length} poliklinik ditemukan</div>
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={<Building2 className="h-8 w-8 text-slate-300" />} title="Tidak ada poliklinik" />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((p) => (
                        <div
                            key={p.id_sub_unit_pegawai}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-300"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-800">{p.nama_sub_unit_pegawai}</p>
                                <p className="text-xs text-slate-400">Rawat Jalan</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </FeatureShell>
    );
}
