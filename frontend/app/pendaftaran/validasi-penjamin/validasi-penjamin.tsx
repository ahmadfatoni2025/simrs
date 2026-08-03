import { useEffect, useState } from "react";
import { Building2, ShieldCheck } from "lucide-react";
import { api } from "~/lib/api";
import { cn } from "~/lib/utils";
import { EmptyState, FeatureShell } from "../ui/FeatureShell";

interface Penjamin {
    id_penjamin?: number;
    nama_penjamin_sistem: string;
    kode_penjamin_bpjs?: string;
    status_aktif?: string | number;
}

const penjaminFitur: Record<string, { hakKelas: string; hakPelayanan: string }> = {
    Umum: { hakKelas: "Kelas 3", hakPelayanan: "Penuh" },
    BPJS: { hakKelas: "Sesuai SEP", hakPelayanan: "Terbatas" },
    Asuransi: { hakKelas: "Kelas 1", hakPelayanan: "Penuh" },
    Corporate: { hakKelas: "Kelas 1", hakPelayanan: "Penuh" },
    Perusahaan: { hakKelas: "Kelas 2", hakPelayanan: "Terbatas" },
};

export default function ValidasiPenjamin() {
    const [penjamins, setPenjamins] = useState<Penjamin[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        api<{ data: Penjamin[] }>("/master-data/penjamin?per_page=100")
            .then((res) => setPenjamins(Array.isArray(res.data) ? res.data : []))
            .catch(() => setPenjamins([]));
    }, []);

    const list = penjamins.length > 0 ? penjamins : [
        { nama_penjamin_sistem: "Umum" },
        { nama_penjamin_sistem: "BPJS" },
        { nama_penjamin_sistem: "Asuransi" },
        { nama_penjamin_sistem: "Corporate" },
        { nama_penjamin_sistem: "Perusahaan" },
    ];

    const filtered = list.filter((p) => !search || p.nama_penjamin_sistem.toLowerCase().includes(search.toLowerCase()));

    return (
        <FeatureShell
            title="Validasi Penjamin"
            subtitle="Validasi kepesertaan, mapping tarif, hak kelas, dan hak pelayanan"
        >
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari penjamin..."
                className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />

            {filtered.length === 0 ? (
                <EmptyState icon={<ShieldCheck className="h-8 w-8 text-slate-300" />} title="Penjamin tidak ditemukan" />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((p, i) => {
                        const fitur = penjaminFitur[p.nama_penjamin_sistem] ?? { hakKelas: "-", hakPelayanan: "-" };
                        const aktif = String(p.status_aktif ?? "1") !== "0";
                        return (
                            <div key={p.id_penjamin ?? i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{p.nama_penjamin_sistem}</p>
                                            {p.kode_penjamin_bpjs && (
                                                <p className="text-[11px] text-slate-400">Kode BPJS: {p.kode_penjamin_bpjs}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", aktif ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                                        {aktif ? "Aktif" : "Nonaktif"}
                                    </span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                                        <p className="text-slate-400">Hak Kelas</p>
                                        <p className="font-bold text-slate-700">{fitur.hakKelas}</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                                        <p className="text-slate-400">Hak Pelayanan</p>
                                        <p className="font-bold text-slate-700">{fitur.hakPelayanan}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </FeatureShell>
    );
}
