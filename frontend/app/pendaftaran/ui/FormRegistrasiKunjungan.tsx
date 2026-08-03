import { useEffect, useState, type FormEvent } from "react";
import { api } from "~/lib/api";
import { AlertTriangle, CheckCircle2, FileUp, Printer, User } from "lucide-react";
import { cn } from "~/lib/utils";

interface PoliOption {
    id_sub_unit_pegawai: number;
    nama_sub_unit_pegawai: string;
}

interface DokterOption {
    id_pegawai: number;
    nama_pegawai: string;
    id_sub_unit_pegawai: number;
}

interface PenjaminOption {
    id_penjamin?: number;
    nama_penjamin_sistem: string;
}

interface PendaftaranFormProps {
    onSaved: () => void;
}

const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none";

const labelClass = "block text-xs font-semibold text-slate-500 mb-1";

const agamaOptions = ["Islam", "Kristen", "Katolik", "Hindu", "Budha", "Konghucu"];
const statusOptions = ["Belum Menikah", "Menikah", "Cerai", "Janda", "Duda"];

interface DocumentUploadProps {
    label: string;
    value: string;
    onChange: (name: string) => void;
}

function DocumentUpload({ label, value, onChange }: DocumentUploadProps) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5">
            <FileUp className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-600">{label}</p>
                {value && <p className="truncate text-[11px] text-slate-400">{value}</p>}
            </div>
            <label className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Pilih File
                <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
                />
            </label>
        </div>
    );
}

export default function FormRegistrasiKunjungan({ onSaved }: PendaftaranFormProps) {
    const [polis, setPolis] = useState<PoliOption[]>([]);
    const [dokters, setDokters] = useState<DokterOption[]>([]);
    const [penjamins, setPenjamins] = useState<PenjaminOption[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [duplicate, setDuplicate] = useState<{ rm: string; name: string } | null>(null);

    const [form, setForm] = useState({
        nama_pasien: "",
        nik: "",
        tempat_lahir: "",
        jenis_kelamin: "L",
        tanggal_lahir: "",
        agama: "",
        status_pernikahan: "",
        alamat: "",
        kecamatan: "",
        kabupaten: "",
        provinsi: "",
        no_telepon: "",
        email: "",
        penjamin: "",
        id_poli: "",
        id_dokter: "",
        tanggal: new Date().toISOString().slice(0, 10),
        upload_ktp: "",
        upload_kk: "",
        upload_bpjs: "",
    });

    const filteredDokters = form.id_poli
        ? dokters.filter((d) => d.id_sub_unit_pegawai === Number(form.id_poli))
        : dokters;

    useEffect(() => {
        setError("");
        void Promise.all([
            api<{ data: PoliOption[] }>("/master-data/sub-unit-pegawai?per_page=100"),
            api<{ data: DokterOption[] }>("/master-data/pegawai?per_page=100"),
            api<{ data: PenjaminOption[] }>("/master-data/penjamin?per_page=100"),
        ])
            .then(([poliRes, dokterRes, penjaminRes]) => {
                setPolis(poliRes.data);
                setDokters(dokterRes.data);
                setPenjamins(penjaminRes.data);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Gagal memuat data poli/dokter/penjamin.");
            });
    }, []);

    function set<K extends keyof typeof form>(key: K, value: string) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    function previewRM(): string {
        const seq = String(1000 + Math.floor(Math.random() * 9000));
        return `RM-${seq}`;
    }

    function reset() {
        setForm({
            nama_pasien: "",
            nik: "",
            tempat_lahir: "",
            jenis_kelamin: "L",
            tanggal_lahir: "",
            agama: "",
            status_pernikahan: "",
            alamat: "",
            kecamatan: "",
            kabupaten: "",
            provinsi: "",
            no_telepon: "",
            email: "",
            penjamin: "",
            id_poli: "",
            id_dokter: "",
            tanggal: new Date().toISOString().slice(0, 10),
            upload_ktp: "",
            upload_kk: "",
            upload_bpjs: "",
        });
        setError("");
        setDuplicate(null);
    }

    const nikValid = form.nik.length === 0 || /^\d{16}$/.test(form.nik);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setDuplicate(null);

        try {
            const res = await api<{
                data?: { duplicate?: boolean; rm?: string; name?: string };
            }>("/pendaftaran", {
                method: "POST",
                body: JSON.stringify(form),
            });
            if (res.data?.duplicate) {
                setDuplicate({
                    rm: res.data.rm ?? "-",
                    name: res.data.name ?? "-",
                });
                return;
            }
            reset();
            onSaved();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Gagal menyimpan pendaftaran.";
            if (/nik.*(sudah|unique|already)/i.test(msg)) {
                setDuplicate({ rm: "-", name: "" });
            }
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
        >
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
                <div>
                    <h2 className="text-base font-extrabold text-slate-900">Registrasi Pasien Baru</h2>
                    <p className="text-xs font-medium text-slate-400">Lengkapi biodata, pilih penjamin dan poliklinik tujuan</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600">
                        <User className="h-3 w-3" />
                        No. RM: <span className="font-mono">{previewRM()}</span>
                    </span>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        title="Cetak kartu pasien"
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <Printer className="h-3.5 w-3.5" /> Cetak
                    </button>
                </div>
            </div>

            <fieldset>
                <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-500">
                    Biodata Pasien
                </legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="sm:col-span-2 lg:col-span-3">
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
                        <label className={labelClass}>NIK *</label>
                        <input
                            className={cn(inputClass, form.nik && !nikValid && "border-red-400 focus:border-red-500")}
                            value={form.nik}
                            onChange={(e) => {
                                set("nik", e.target.value.replace(/\D/g, "").slice(0, 16));
                                setDuplicate(null);
                            }}
                            placeholder="16 digit NIK"
                            required
                        />
                        {form.nik && !nikValid && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
                                <AlertTriangle className="h-3 w-3" /> NIK harus 16 digit angka
                            </p>
                        )}
                        {nikValid && form.nik.length === 16 && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-500">
                                <CheckCircle2 className="h-3 w-3" /> Format NIK valid
                            </p>
                        )}
                    </div>
                    <div>
                        <label className={labelClass}>Tempat Lahir</label>
                        <input className={inputClass} value={form.tempat_lahir} onChange={(e) => set("tempat_lahir", e.target.value)} placeholder="cth: Surabaya" />
                    </div>
                    <div>
                        <label className={labelClass}>Tanggal Lahir *</label>
                        <input type="date" className={inputClass} value={form.tanggal_lahir} onChange={(e) => set("tanggal_lahir", e.target.value)} required />
                    </div>
                    <div>
                        <label className={labelClass}>Jenis Kelamin *</label>
                        <select className={inputClass} value={form.jenis_kelamin} onChange={(e) => set("jenis_kelamin", e.target.value)} required>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Agama</label>
                        <select className={inputClass} value={form.agama} onChange={(e) => set("agama", e.target.value)}>
                            <option value="">-- Pilih Agama --</option>
                            {agamaOptions.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Status Pernikahan</label>
                        <select className={inputClass} value={form.status_pernikahan} onChange={(e) => set("status_pernikahan", e.target.value)}>
                            <option value="">-- Pilih Status --</option>
                            {statusOptions.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>No. Telepon *</label>
                        <input className={inputClass} value={form.no_telepon} onChange={(e) => set("no_telepon", e.target.value)} placeholder="08xxxxxxxxxx" required />
                    </div>
                    <div>
                        <label className={labelClass}>Email</label>
                        <input type="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@contoh.com" />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                        <label className={labelClass}>Alamat</label>
                        <input className={inputClass} value={form.alamat} onChange={(e) => set("alamat", e.target.value)} placeholder="Jl. Kenanga No. 1" />
                    </div>
                    <div>
                        <label className={labelClass}>Kecamatan</label>
                        <input className={inputClass} value={form.kecamatan} onChange={(e) => set("kecamatan", e.target.value)} placeholder="Kecamatan" />
                    </div>
                    <div>
                        <label className={labelClass}>Kabupaten/Kota</label>
                        <input className={inputClass} value={form.kabupaten} onChange={(e) => set("kabupaten", e.target.value)} placeholder="Kabupaten" />
                    </div>
                    <div>
                        <label className={labelClass}>Provinsi</label>
                        <input className={inputClass} value={form.provinsi} onChange={(e) => set("provinsi", e.target.value)} placeholder="Provinsi" />
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-500">
                    Dokumen Pendukung
                </legend>
                <DocumentUpload label="KTP" value={form.upload_ktp} onChange={(v) => set("upload_ktp", v)} />
                <DocumentUpload label="Kartu Keluarga (KK)" value={form.upload_kk} onChange={(v) => set("upload_kk", v)} />
                <DocumentUpload label="Kartu BPJS" value={form.upload_bpjs} onChange={(v) => set("upload_bpjs", v)} />
            </fieldset>

            <fieldset>
                <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-500">
                    Data Penjamin & Pendaftaran
                </legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <label className={labelClass}>Penjamin *</label>
                        <select className={inputClass} value={form.penjamin} onChange={(e) => set("penjamin", e.target.value)} required>
                            <option value="">-- Pilih Penjamin --</option>
                            {penjamins.length > 0 ? (
                                penjamins.map((p) => (
                                    <option key={p.id_penjamin ?? p.nama_penjamin_sistem} value={p.nama_penjamin_sistem}>
                                        {p.nama_penjamin_sistem}
                                    </option>
                                ))
                            ) : (
                                <option value="Umum">Umum</option>
                            )}
                        </select>
                    </div>
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
                        <select className={inputClass} value={form.id_dokter} onChange={(e) => set("id_dokter", e.target.value)} required disabled={!form.id_poli}>
                            <option value="">-- Pilih Dokter --</option>
                            {filteredDokters.map((d) => (
                                <option key={d.id_pegawai} value={d.id_pegawai}>
                                    {d.nama_pegawai}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end sm:col-span-2 lg:col-span-3 mt-3">
                        <button type="submit" disabled={submitting || !nikValid}
                            className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                            {submitting ? "Menyimpan..." : "Simpan & Generate No. RM"}
                        </button>
                    </div>
                </div>
            </fieldset>

            {duplicate && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Pasien kemungkinan duplikat ditemukan.</p>
                        <p>
                            Nama: <span className="font-medium">{duplicate.name || "-"}</span> · No. RM:{" "}
                            <span className="font-mono">{duplicate.rm}</span>. Gunakan Registrasi Pasien Lama untuk pasien yang sudah terdaftar.
                        </p>
                    </div>
                </div>
            )}

            {!duplicate && error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">{error}</div>
            )}
        </form>
    );
}