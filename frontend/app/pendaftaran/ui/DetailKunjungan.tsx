import { useEffect, useState } from "react";
import { api } from "~/lib/api";
import { Calendar, Clock, HeartPulse, Loader2, MapPin, Phone, ShieldCheck, Stethoscope, User, X } from "lucide-react";
import { cn } from "~/lib/utils";
import type { Row } from "~/components/resource/types";

interface DetailKunjunganProps {
    row: Row;
    onClose: () => void;
    onStatusUpdated?: () => void;
}

interface DetailData {
    id: number;
    no: string;
    tanggal: string;
    status: string;
    poli: string;
    dokter: string;
    pasien: {
        nomor_rekam_medis: string;
        nama_pasien: string;
        nik: string;
        jenis_kelamin: string;
        tempat_lahir: string;
        tanggal_lahir: string;
        agama: string;
        status_pernikahan: string;
        alamat: string;
        kecamatan: string;
        kabupaten: string;
        provinsi: string;
        no_telepon: string;
        email: string;
        penjamin: string;
    } | null;
}

const statusStyle: Record<string, { badge: string; dot: string }> = {
    Menunggu: { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
    Diperiksa: { badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
    Selesai: { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
};

const penjaminStyle: Record<string, string> = {
    BPJS: "bg-emerald-100 text-emerald-700",
    Umum: "bg-slate-100 text-slate-700",
};

function Field({ label, value }: { label: string; value?: string | number | null }) {
    if (value == null || value === "") return null;
    return (
        <div className="rounded-lg bg-slate-50 px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-slate-800">{String(value)}</dd>
        </div>
    );
}

export default function DetailKunjungan({ row, onClose, onStatusUpdated }: DetailKunjunganProps) {
    const [data, setData] = useState<DetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const rowId = row.id ?? row.id_pendaftaran ?? row.id_kunjungan;

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError("");

        const fallbackData: DetailData = {
            id: Number(rowId || 0),
            no: String(row.no ?? "-"),
            tanggal: String(row.tanggal ?? "-"),
            status: String(row.status ?? "Menunggu"),
            poli: String(row.poli ?? "-"),
            dokter: String(row.dokter ?? "-"),
            pasien: {
                nomor_rekam_medis: String(row.rm ?? row.no_rekam_medis ?? row.nomor_rekam_medis ?? "-"),
                nama_pasien: String(row.name ?? row.nama_pasien ?? row.nama ?? "Tanpa Nama"),
                nik: String(row.nik ?? "-"),
                jenis_kelamin: String(row.jenis_kelamin ?? "L"),
                tempat_lahir: String(row.tempat_lahir ?? "-"),
                tanggal_lahir: String(row.tanggal_lahir ?? "-"),
                agama: String(row.agama ?? "-"),
                status_pernikahan: String(row.status_pernikahan ?? "-"),
                alamat: String(row.alamat ?? "-"),
                kecamatan: String(row.kecamatan ?? ""),
                kabupaten: String(row.kabupaten ?? ""),
                provinsi: String(row.provinsi ?? ""),
                no_telepon: String(row.no_telepon ?? "-"),
                email: String(row.email ?? ""),
                penjamin: String(row.penjamin ?? "Umum"),
            },
        };

        if (!rowId) {
            if (active) {
                setData(fallbackData);
                setLoading(false);
            }
            return;
        }

        api<{ data: DetailData }>(`/pendaftaran/${rowId}`)
            .then((res) => {
                if (active) setData(res.data || fallbackData);
            })
            .catch(() => {
                if (active) {
                    setData(fallbackData);
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [rowId]);

    const statusKey = (data?.status ?? row.status ?? "Menunggu").toString();
    const st = statusStyle[statusKey] ?? statusStyle.Menunggu!;
    const pj = data?.pasien?.penjamin ?? "";
    const penjaminClass = penjaminStyle[pj] ?? "bg-indigo-100 text-indigo-700";
    const sv = (v: unknown): string | undefined => (v == null ? undefined : String(v));

    async function handleUpdateStatus(newStatus: string) {
        setUpdatingStatus(true);
        try {
            if (rowId) {
                await api(`/pendaftaran/${rowId}`, {
                    method: "PUT",
                    body: JSON.stringify({ status: newStatus }),
                });
            }
            setData((prev) => (prev ? { ...prev, status: newStatus } : prev));
            row.status = newStatus;
            onStatusUpdated?.();
        } catch {
            setData((prev) => (prev ? { ...prev, status: newStatus } : prev));
            row.status = newStatus;
            onStatusUpdated?.();
        } finally {
            setUpdatingStatus(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-start gap-4 rounded-t-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/40">
                        <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold leading-tight line-clamp-2">
                            {sv(data?.pasien?.nama_pasien ?? row.name) ?? "Detail Kunjungan"}
                        </h2>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-white/90">
                            <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5">
                                <Calendar className="h-3 w-3" />
                                {sv(data?.tanggal ?? row.tanggal) ?? "-"}
                            </span>
                            <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold", st.badge)}>
                                <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} />
                                {statusKey}
                            </span>
                            {pj && (
                                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold", penjaminClass)}>
                                    <ShieldCheck className="h-3 w-3" />
                                    {pj}
                                </span>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="shrink-0 rounded-full p-1.5 hover:bg-white/20 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <p className="text-sm">Memuat detail kunjungan...</p>
                        </div>
                    ) : error ? (
                        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
                    ) : (
                        <div className="space-y-5">
                            {/* Update Status Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 shadow-2xs">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-indigo-600" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Status Alur Pasien Saat Ini</p>
                                        <p className="text-[11px] text-slate-400">Ubah status untuk melanjutkan proses pelayanan</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <button
                                        type="button"
                                        disabled={updatingStatus}
                                        onClick={() => handleUpdateStatus("Menunggu")}
                                        className={cn(
                                            "rounded-xl px-3 py-1.5 text-xs font-bold transition-all",
                                            statusKey === "Menunggu"
                                                ? "bg-amber-500 text-white shadow-xs"
                                                : "bg-white text-slate-600 border border-slate-200 hover:bg-amber-50 hover:text-amber-700"
                                        )}
                                    >
                                        ⏳ Registrasi (Menunggu)
                                    </button>
                                    <button
                                        type="button"
                                        disabled={updatingStatus}
                                        onClick={() => handleUpdateStatus("Diperiksa")}
                                        className={cn(
                                            "rounded-xl px-3 py-1.5 text-xs font-bold transition-all",
                                            statusKey === "Diperiksa"
                                                ? "bg-blue-600 text-white shadow-xs"
                                                : "bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-700"
                                        )}
                                    >
                                        🩺 Pemeriksaan (Diperiksa)
                                    </button>
                                    <button
                                        type="button"
                                        disabled={updatingStatus}
                                        onClick={() => handleUpdateStatus("Selesai")}
                                        className={cn(
                                            "rounded-xl px-3 py-1.5 text-xs font-bold transition-all",
                                            statusKey === "Selesai"
                                                ? "bg-emerald-600 text-white shadow-xs"
                                                : "bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700"
                                        )}
                                    >
                                        ✅ Selesai
                                    </button>
                                </div>
                            </div>

                            {/* Kunjungan */}
                            <section>
                                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-500">
                                    <Stethoscope className="h-3.5 w-3.5" /> Info Kunjungan
                                </h3>
                                <dl className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                                    <Field label="No. Kunjungan" value={sv(data?.no ?? row.no)} />
                                    <Field label="Poliklinik" value={sv(data?.poli ?? row.poli)} />
                                    <Field label="Dokter" value={sv(data?.dokter ?? row.dokter)} />
                                </dl>
                            </section>

                            {/* Identitas */}
                            <section>
                                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-500">
                                    <User className="h-3.5 w-3.5" /> Identitas Pasien
                                </h3>
                                <dl className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                                    <Field label="No. Rekam Medis" value={sv(data?.pasien?.nomor_rekam_medis ?? row.rm)} />
                                    <Field label="NIK" value={data?.pasien?.nik} />
                                    <Field label="Jenis Kelamin" value={data?.pasien?.jenis_kelamin === "L" ? "Laki-laki" : data?.pasien?.jenis_kelamin === "P" ? "Perempuan" : data?.pasien?.jenis_kelamin} />
                                    <Field label="Tempat / Tgl Lahir" value={[data?.pasien?.tempat_lahir, data?.pasien?.tanggal_lahir].filter(Boolean).join(", ")} />
                                    <Field label="Agama" value={data?.pasien?.agama} />
                                    <Field label="Status Pernikahan" value={data?.pasien?.status_pernikahan} />
                                </dl>
                            </section>

                            {/* Kontak & Alamat */}
                            <section>
                                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-500">
                                    <MapPin className="h-3.5 w-3.5" /> Kontak & Alamat
                                </h3>
                                <dl className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                                    <Field label="No. Telepon" value={data?.pasien?.no_telepon} />
                                    <Field label="Email" value={data?.pasien?.email} />
                                    <Field
                                        label="Alamat"
                                        value={[data?.pasien?.alamat, data?.pasien?.kecamatan, data?.pasien?.kabupaten, data?.pasien?.provinsi]
                                            .filter(Boolean)
                                            .join(", ")}
                                    />
                                </dl>
                            </section>

                            {/* Penjamin */}
                            <section>
                                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-500">
                                    <HeartPulse className="h-3.5 w-3.5" /> Penjamin
                                </h3>
                                <dl className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                    <Field label="Jenis Penjamin" value={pj || "-"} />
                                </dl>
                            </section>

                            <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                                <Clock className="h-4 w-4" />
                                Ditambahkan pada {data?.tanggal ?? "-"} · No. Kunjungan {data?.no ?? "-"}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
