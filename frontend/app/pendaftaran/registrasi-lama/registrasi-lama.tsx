import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Search, UserRoundCheck } from "lucide-react";
import { api } from "~/lib/api";
import { cn } from "~/lib/utils";
import { EmptyState, FeatureShell } from "../ui/FeatureShell";

interface PasienRM {
    id: number;
    no_rekam_medis?: string;
    nomor_rekam_medis?: string;
    nama?: string;
    nama_pasien?: string;
    jenis_kelamin?: string;
    tanggal_lahir?: string;
    no_telepon?: string;
    alamat?: string;
    nik?: string;
    [key: string]: unknown;
}

interface PoliOption {
    id_sub_unit_pegawai: number;
    nama_sub_unit_pegawai: string;
}

interface DokterOption {
    id_pegawai: number;
    nama_pegawai: string;
    id_sub_unit_pegawai: number;
}

const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none";
const labelClass = "block text-xs font-semibold text-slate-500 mb-1";

export default function RegistrasiLama() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<PasienRM[]>([]);
    const [selected, setSelected] = useState<PasienRM | null>(null);
    const [searching, setSearching] = useState(false);
    const [message, setMessage] = useState("");

    const [polis, setPolis] = useState<PoliOption[]>([]);
    const [dokters, setDokters] = useState<DokterOption[]>([]);
    const [idPoli, setIdPoli] = useState("");
    const [idDokter, setIdDokter] = useState("");
    const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        void Promise.all([
            api<{ data: PoliOption[] }>("/master-data/sub-unit-pegawai?per_page=100"),
            api<{ data: DokterOption[] }>("/master-data/pegawai?per_page=100"),
        ])
            .then(([p, d]) => {
                setPolis(p.data);
                setDokters(d.data);
            })
            .catch(() => undefined);
    }, []);

    const filteredDokters = idPoli
        ? dokters.filter((d) => d.id_sub_unit_pegawai === Number(idPoli))
        : dokters;

    async function handleSearch(e: FormEvent) {
        e.preventDefault();
        if (!query.trim()) return;
        setSearching(true);
        setMessage("");
        try {
            const params = new URLSearchParams({ per_page: "20" });
            params.set("search", query.trim());
            const res = await api<{ data: PasienRM[] }>(`/rekam-medis?${params}`);
            setResults(Array.isArray(res.data) ? res.data : []);
        } catch {
            setResults([]);
        } finally {
            setSearching(false);
        }
    }

    function selectPasien(p: PasienRM) {
        setSelected(p);
        setResults([]);
        setMessage("");
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!selected) return;
        setSubmitting(true);
        setMessage("");
        try {
            await api("/pendaftaran", {
                method: "POST",
                body: JSON.stringify({
                    nama_pasien: selected.nama ?? selected.nama_pasien ?? "",
                    nik: selected.nik ?? null,
                    jenis_kelamin: selected.jenis_kelamin ?? "L",
                    tanggal_lahir: selected.tanggal_lahir ?? "",
                    alamat: selected.alamat ?? null,
                    no_telepon: selected.no_telepon ?? null,
                    id_poli: Number(idPoli),
                    id_dokter: Number(idDokter),
                    tanggal,
                }),
            });
            setMessage("Kunjungan berhasil dibuat dan nomor antrean telah digenerate.");
            setIdPoli("");
            setIdDokter("");
            setSelected(null);
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Gagal membuat kunjungan.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <FeatureShell
            title="Registrasi Pasien Lama"
            subtitle="Cari pasien yang sudah terdaftar, verifikasi data, dan buat kunjungan baru"
        >
            {/* Pencarian */}
            <form onSubmit={handleSearch} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <label className={labelClass}>Cari Pasien (No. RM / NIK / Nama)</label>
                <div className="mt-1 flex gap-2">
                    <input
                        className={inputClass}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="cth: Budi Santoso / RM-0001 / 357801..."
                    />
                    <button
                        type="submit"
                        disabled={searching}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                    >
                        <Search className="h-4 w-4" />
                        {searching ? "Mencari..." : "Cari"}
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
                        {results.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => selectPasien(p)}
                                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-indigo-50/50"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {String(p.nama ?? p.nama_pasien ?? "Tanpa Nama")}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        #{String(p.no_rekam_medis ?? p.nomor_rekam_medis ?? "-")}
                                        {p.nik ? ` · NIK ${String(p.nik)}` : ""}
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-600">
                                    <UserRoundCheck className="h-3 w-3" /> Pilih
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {!searching && query && results.length === 0 && !selected && (
                    <p className="mt-3 text-sm text-slate-400">Pasien tidak ditemukan. Coba cek lagi atau daftarkan sebagai pasien baru.</p>
                )}
            </form>

            {/* Verifikasi + data kunjungan */}
            {selected && (
                <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Data pasien terverifikasi. Lanjutkan dengan pilihan poli & dokter.
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
                        <p className="text-base font-bold text-slate-800">
                            {String(selected.nama ?? selected.nama_pasien ?? "-")}
                        </p>
                        <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-1 text-xs text-slate-500 sm:grid-cols-2">
                            <span>No. RM: #{String(selected.no_rekam_medis ?? selected.nomor_rekam_medis ?? "-")}</span>
                            <span>JK: {String(selected.jenis_kelamin ?? "-") === "L" ? "Laki-laki" : String(selected.jenis_kelamin ?? "-") === "P" ? "Perempuan" : "-"}</span>
                            <span>Tanggal Lahir: {String(selected.tanggal_lahir ?? "-")}</span>
                            <span>No. HP: {String(selected.no_telepon ?? "-")}</span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className={labelClass}>Poliklinik *</label>
                            <select
                                className={inputClass}
                                value={idPoli}
                                onChange={(e) => {
                                    setIdPoli(e.target.value);
                                    setIdDokter("");
                                }}
                                required
                            >
                                <option value="">-- Pilih Poliklinik --</option>
                                {polis.map((p) => (
                                    <option key={p.id_sub_unit_pegawai} value={p.id_sub_unit_pegawai}>
                                        {p.nama_sub_unit_pegawai}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Dokter *</label>
                            <select
                                className={inputClass}
                                value={idDokter}
                                onChange={(e) => setIdDokter(e.target.value)}
                                required
                                disabled={!idPoli}
                            >
                                <option value="">-- Pilih Dokter --</option>
                                {filteredDokters.map((d) => (
                                    <option key={d.id_pegawai} value={d.id_pegawai}>
                                        {d.nama_pegawai}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Tanggal Kunjungan *</label>
                            <input type="date" className={inputClass} value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => setSelected(null)}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Ganti Pasien
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={cn("rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50")}
                        >
                            {submitting ? "Menyimpan..." : "Buat Kunjungan & Generate Antrean"}
                        </button>
                    </div>
                </form>
            )}

            {message && (
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">{message}</div>
            )}

            {!selected && !message && results.length === 0 && !searching && (
                <EmptyState
                    icon={<Search className="h-8 w-8 text-slate-300" />}
                    title="Belum ada hasil pencarian"
                    description="Gunakan nomor rekam medis, NIK, atau nama pasien untuk mencari."
                />
            )}
        </FeatureShell>
    );
}
