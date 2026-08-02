import { useEffect, useState, type FormEvent } from "react";
import { api } from "~/lib/api";

interface PoliOption {
    id_sub_unit_pegawai: number;
    nama_sub_unit_pegawai: string;
}

interface DokterOption {
    id_pegawai: number;
    nama_pegawai: string;
    id_sub_unit_pegawai: number;
}

interface PendaftaranFormProps {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}

const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none";

const labelClass = "block text-xs font-semibold text-slate-500 mb-1";

export default function PendaftaranForm({ open, onClose, onSaved }: PendaftaranFormProps) {
    const [polis, setPolis] = useState<PoliOption[]>([]);
    const [dokters, setDokters] = useState<DokterOption[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        nama_pasien: "",
        jenis_kelamin: "L",
        tanggal_lahir: "",
        alamat: "",
        no_telepon: "",
        id_poli: "",
        id_dokter: "",
        tanggal: new Date().toISOString().slice(0, 10),
    });

    const filteredDokters = form.id_poli
        ? dokters.filter((d) => d.id_sub_unit_pegawai === Number(form.id_poli))
        : dokters;

    useEffect(() => {
        if (!open) return;

        setError("");
        setForm({
            nama_pasien: "",
            jenis_kelamin: "L",
            tanggal_lahir: "",
            alamat: "",
            no_telepon: "",
            id_poli: "",
            id_dokter: "",
            tanggal: new Date().toISOString().slice(0, 10),
        });

        void Promise.all([
            api<{ data: PoliOption[] }>("/master-data/sub-unit-pegawai?per_page=100"),
            api<{ data: DokterOption[] }>("/master-data/pegawai?per_page=100"),
        ])
            .then(([poliRes, dokterRes]) => {
                setPolis(poliRes.data);
                setDokters(dokterRes.data);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Gagal memuat data poli/dokter.");
            });
    }, [open]);

    if (!open) return null;

    function set<K extends keyof typeof form>(key: K, value: string) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            await api("/pendaftaran", {
                method: "POST",
                body: JSON.stringify(form),
            });
            onSaved();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal menyimpan pendaftaran.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div>
                        <h2 className="text-base font-extrabold text-slate-900">Daftarkan Pasien Baru</h2>
                        <p className="text-xs font-medium text-slate-400">Isi data pasien dan poliklinik tujuan</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
                    <fieldset>
                        <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-500">
                            Data Pasien
                        </legend>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Nama Lengkap Pasien *</label>
                                <input
                                    className={inputClass}
                                    value={form.nama_pasien}
                                    onChange={(e) => set("nama_pasien", e.target.value)}
                                    placeholder="cth: Budi Santoso"
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Jenis Kelamin *</label>
                                <select
                                    className={inputClass}
                                    value={form.jenis_kelamin}
                                    onChange={(e) => set("jenis_kelamin", e.target.value)}
                                    required
                                >
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Tanggal Lahir *</label>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={form.tanggal_lahir}
                                    onChange={(e) => set("tanggal_lahir", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>No. Telepon</label>
                                <input
                                    className={inputClass}
                                    value={form.no_telepon}
                                    onChange={(e) => set("no_telepon", e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Alamat</label>
                                <input
                                    className={inputClass}
                                    value={form.alamat}
                                    onChange={(e) => set("alamat", e.target.value)}
                                    placeholder="Jl. Kenanga No. 1"
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-500">
                            Data Pendaftaran
                        </legend>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>Poliklinik *</label>
                                <select
                                    className={inputClass}
                                    value={form.id_poli}
                                    onChange={(e) => {
                                        set("id_poli", e.target.value);
                                        set("id_dokter", "");
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
                                    value={form.id_dokter}
                                    onChange={(e) => set("id_dokter", e.target.value)}
                                    required
                                    disabled={!form.id_poli}
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
                                <label className={labelClass}>Tanggal Pendaftaran *</label>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={form.tanggal}
                                    onChange={(e) => set("tanggal", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </fieldset>

                    {error && (
                        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
                    )}

                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {submitting ? "Menyimpan..." : "Simpan Pendaftaran"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
