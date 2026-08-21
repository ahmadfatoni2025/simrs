import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, FileText, Printer, Search, UserRoundCheck } from "lucide-react";
import { api } from "~/lib/api";
import { cn } from "~/lib/utils";
import { EmptyState, FeatureShell } from "../ui/FeatureShell";
import { FormulirRM01, type DataRM01 } from "../ui/FormulirRM01";

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
    agama?: string;
    status_pernikahan?: string;
    pekerjaan?: string;
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
    const [showRM01, setShowRM01] = useState(false);

    const [polis, setPolis] = useState<PoliOption[]>([]);
    const [dokters, setDokters] = useState<DokterOption[]>([]);
    const [idPoli, setIdPoli] = useState("");
    const [idDokter, setIdDokter] = useState("");
    const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
    const [submitting, setSubmitting] = useState(false);

    async function fetchPasienLama(searchKeyword: string = "") {
        setSearching(true);
        setMessage("");
        try {
            const params = new URLSearchParams({ per_page: "20" });
            if (searchKeyword.trim()) {
                params.set("search", searchKeyword.trim());
            }
            const res = await api<{ data?: PasienRM[] | { data: PasienRM[] } }>(`/rekam-medis?${params}`);
            
            let list: PasienRM[] = [];
            if (Array.isArray(res)) {
                list = res as PasienRM[];
            } else if (Array.isArray(res.data)) {
                list = res.data;
            } else if (res.data && typeof res.data === "object" && "data" in res.data && Array.isArray((res.data as { data: PasienRM[] }).data)) {
                list = (res.data as { data: PasienRM[] }).data;
            }
            setResults(list);
        } catch {
            setResults([]);
        } finally {
            setSearching(false);
        }
    }

    useEffect(() => {
        void fetchPasienLama();
        void Promise.all([
            api<{ data: PoliOption[] }>("/master-data/sub-unit-pegawai?per_page=100"),
            api<{ data: DokterOption[] }>("/master-data/pegawai?per_page=100"),
        ])
            .then(([p, d]) => {
                setPolis(Array.isArray(p.data) ? p.data : []);
                setDokters(Array.isArray(d.data) ? d.data : []);
            })
            .catch(() => undefined);
    }, []);

    const filteredDokters = idPoli
        ? dokters.filter((d) => d.id_sub_unit_pegawai === Number(idPoli))
        : dokters;

    const selectedPoliName = polis.find((p) => p.id_sub_unit_pegawai === Number(idPoli))?.nama_sub_unit_pegawai || "";
    const selectedDokterName = dokters.find((d) => d.id_pegawai === Number(idDokter))?.nama_pegawai || "";

    const selectedDataRM01: DataRM01 = selected
        ? {
            no_rekam_medis: String(selected.no_rekam_medis ?? selected.nomor_rekam_medis ?? "-"),
            nama_pasien: String(selected.nama ?? selected.nama_pasien ?? "-"),
            jenis_kelamin: String(selected.jenis_kelamin ?? "L"),
            tanggal_lahir: String(selected.tanggal_lahir ?? "-"),
            agama: String(selected.agama ?? "-"),
            status_pernikahan: String(selected.status_pernikahan ?? "-"),
            pekerjaan: String(selected.pekerjaan ?? "-"),
            alamat: String(selected.alamat ?? "-"),
            no_telepon: String(selected.no_telepon ?? "-"),
            diagnosa_masuk: selectedPoliName ? `Poliklinik ${selectedPoliName}` : "-",
            dokter_merawat: selectedDokterName,
            tanggal_mrs: tanggal,
        }
        : {};

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        void fetchPasienLama(query);
    }

    function selectPasien(p: PasienRM) {
        setSelected(p);
        setResults([]);
        setMessage("");
        setShowRM01(false);
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
                        onChange={(e) => {
                            const val = e.target.value;
                            setQuery(val);
                            if (val === "") {
                                void fetchPasienLama("");
                            }
                        }}
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
                    <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 max-h-96 overflow-y-auto">
                        {results.map((p, idx) => (
                            <button
                                key={String(p.id ?? p.no_rekam_medis ?? idx)}
                                type="button"
                                onClick={() => selectPasien(p)}
                                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-indigo-50/50 transition-colors"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {String(p.nama ?? p.nama_pasien ?? "Tanpa Nama")}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        No. RM: <span className="font-semibold font-mono text-slate-700">#{String(p.no_rekam_medis ?? p.nomor_rekam_medis ?? "-")}</span>
                                        {p.nik ? ` · NIK ${String(p.nik)}` : ""}
                                        {p.no_telepon ? ` · HP: ${String(p.no_telepon)}` : ""}
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-600 border border-sky-100 shadow-2xs">
                                    <UserRoundCheck className="h-3 w-3" /> Pilih Pasien
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
                <div className="space-y-4">
                    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                <span>Data pasien terverifikasi. Lanjutkan dengan pilihan poli & dokter.</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowRM01(!showRM01)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
                            >
                                <FileText className="h-3.5 w-3.5" />
                                {showRM01 ? "Sembunyikan Formulir RM-01" : "Lihat / Cetak Formulir RM-01"}
                            </button>
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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelected(null);
                                        setShowRM01(false);
                                    }}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Ganti Pasien
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRM01(true);
                                        setTimeout(() => window.print(), 100);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <Printer className="h-3.5 w-3.5" /> Cetak RM-01
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={cn("rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50")}
                            >
                                {submitting ? "Menyimpan..." : "Buat Kunjungan & Generate Antrean"}
                            </button>
                        </div>
                    </form>

                    {/* Preview RM-01 jika ditutup/dibuka */}
                    {showRM01 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <FormulirRM01 data={selectedDataRM01} />
                        </div>
                    )}
                </div>
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

