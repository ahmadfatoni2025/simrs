import { useEffect, useState } from "react";
import { CalendarClock, Search, Stethoscope } from "lucide-react";
import { api } from "~/lib/api";
import { cn } from "~/lib/utils";
import { EmptyState, FeatureShell } from "../ui/FeatureShell";

interface Dokter {
    id_pegawai: number;
    nama_pegawai: string;
    id_sub_unit_pegawai: number;
    sub_unit_pegawai?: { nama_sub_unit_pegawai: string };
}

interface PoliOption {
    id_sub_unit_pegawai: number;
    nama_sub_unit_pegawai: string;
}

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const jadwalSeed: { [key: string]: { hari: string[]; jam: string; kuota: number; sisa: number } } = {
    "dr. Budi Santoso": { hari: ["Senin", "Rabu", "Jumat"], jam: "08:00 - 12:00", kuota: 20, sisa: 7 },
    "dr. Siti Aminah": { hari: ["Selasa", "Kamis"], jam: "13:00 - 16:00", kuota: 15, sisa: 3 },
    "dr. Andi Wijaya": { hari: ["Senin", "Kamis"], jam: "09:00 - 12:00", kuota: 18, sisa: 12 },
};

export default function JadwalDokter() {
    const [dokters, setDokters] = useState<Dokter[]>([]);
    const [polis, setPolis] = useState<PoliOption[]>([]);
    const [filterPoli, setFilterPoli] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        void Promise.all([
            api<{ data: Dokter[] }>("/master-data/pegawai?per_page=100"),
            api<{ data: PoliOption[] }>("/master-data/sub-unit-pegawai?per_page=100"),
        ])
            .then(([d, p]) => {
                setDokters(d.data);
                setPolis(p.data);
            })
            .catch(() => undefined);
    }, []);

    const filtered = dokters.filter((d) => {
        const nama = String(d.nama_pegawai ?? "").toLowerCase();
        const poli = String(d.sub_unit_pegawai?.nama_sub_unit_pegawai ?? "").toLowerCase();
        return (
            (filterPoli === "" || d.id_sub_unit_pegawai === Number(filterPoli)) &&
            (!search || nama.includes(search.toLowerCase()) || poli.includes(search.toLowerCase()))
        );
    });

    return (
        <FeatureShell
            title="Jadwal Dokter"
            subtitle="Hari, jam praktik, kuota, dan sisa kuota per dokter"
            actions={
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari dokter..."
                            className="w-44 rounded-lg border border-slate-300 py-1.5 pl-8 pr-3 text-xs focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <select
                        value={filterPoli}
                        onChange={(e) => setFilterPoli(e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                    >
                        <option value="">Semua Poli</option>
                        {polis.map((p) => (
                            <option key={p.id_sub_unit_pegawai} value={p.id_sub_unit_pegawai}>
                                {p.nama_sub_unit_pegawai}
                            </option>
                        ))}
                    </select>
                </div>
            }
        >
            {filtered.length === 0 ? (
                <EmptyState icon={<CalendarClock className="h-8 w-8 text-slate-300" />} title="Tidak ada jadwal dokter" />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((d) => {
                        const j = jadwalSeed[d.nama_pegawai] ?? {
                            hari: days.slice(0, 3),
                            jam: "08:00 - 12:00",
                            kuota: 20,
                            sisa: 15,
                        };
                        const pct = Math.round((j.sisa / j.kuota) * 100);
                        return (
                            <div key={d.id_pegawai} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Stethoscope className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-slate-800">{d.nama_pegawai}</p>
                                        <p className="text-xs text-slate-400">
                                            {d.sub_unit_pegawai?.nama_sub_unit_pegawai ?? "Poli Umum"}
                                        </p>
                                    </div>
                                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", pct > 20 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                                        {pct > 20 ? "Aktif" : "Hampir Penuh"}
                                    </span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {j.hari.map((h) => (
                                        <span key={h} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                                            {h}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                    <span className="font-mono">{j.jam}</span>
                                    <span>Kuota {j.sisa}/{j.kuota}</span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                    <div className={cn("h-full rounded-full", pct > 20 ? "bg-emerald-500" : "bg-red-500")} style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </FeatureShell>
    );
}
