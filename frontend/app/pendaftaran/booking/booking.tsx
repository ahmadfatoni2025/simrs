import { useEffect, useState, type FormEvent } from "react";
import { CalendarClock, CheckCircle2, X } from "lucide-react";
import { api } from "~/lib/api";
import { EmptyState, FeatureShell } from "../ui/FeatureShell";

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

interface BookingItem {
    id: number;
    nama: string;
    poli: string;
    dokter: string;
    tanggal: string;
}

export default function BookingPage() {
    const [polis, setPolis] = useState<PoliOption[]>([]);
    const [dokters, setDokters] = useState<DokterOption[]>([]);
    const [bookings, setBookings] = useState<BookingItem[]>([]);

    const [nama, setNama] = useState("");
    const [idPoli, setIdPoli] = useState("");
    const [idDokter, setIdDokter] = useState("");
    const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
    const [message, setMessage] = useState("");

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

    const filteredDokters = idPoli ? dokters.filter((d) => d.id_sub_unit_pegawai === Number(idPoli)) : dokters;

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const poli = polis.find((p) => p.id_sub_unit_pegawai === Number(idPoli));
        const dokter = filteredDokters.find((d) => d.id_pegawai === Number(idDokter));
        const item: BookingItem = {
            id: Date.now(),
            nama,
            poli: poli?.nama_sub_unit_pegawai ?? "",
            dokter: dokter?.nama_pegawai ?? "",
            tanggal,
        };
        setBookings((b) => [item, ...b]);
        setNama("");
        setIdDokter("");
        setMessage("Appointment berhasil di-book. Notifikasi akan dikirimkan menjelang jadwal.");
    }

    return (
        <FeatureShell
            title="Booking Appointment"
            subtitle="Booking dokter/poli, reschedule, cancel, dan reminder appointment"
        >
            <div className="grid gap-5 lg:grid-cols-2">
                <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Buat Booking</h2>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className={labelClass}>Nama Pasien *</label>
                            <input className={inputClass} value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama pasien" required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Poliklinik *</label>
                                <select className={inputClass} value={idPoli} onChange={(e) => { setIdPoli(e.target.value); setIdDokter(""); }} required>
                                    <option value="">-- Pilih --</option>
                                    {polis.map((p) => (
                                        <option key={p.id_sub_unit_pegawai} value={p.id_sub_unit_pegawai}>{p.nama_sub_unit_pegawai}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Dokter *</label>
                                <select className={inputClass} value={idDokter} onChange={(e) => setIdDokter(e.target.value)} required disabled={!idPoli}>
                                    <option value="">-- Pilih --</option>
                                    {filteredDokters.map((d) => (
                                        <option key={d.id_pegawai} value={d.id_pegawai}>{d.nama_pegawai}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Tanggal *</label>
                            <input type="date" className={inputClass} value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
                        </div>
                        <button type="submit" className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-bold text-white hover:bg-indigo-500">
                            Simpan Booking
                        </button>
                    </div>
                    {message && (
                        <p className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {message}
                        </p>
                    )}
                </form>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Booking Aktif</h2>
                    {bookings.length === 0 ? (
                        <div className="mt-3">
                            <EmptyState icon={<CalendarClock className="h-8 w-8 text-slate-300" />} title="Belum ada booking" description="Booking yang dibuat akan muncul di sini." />
                        </div>
                    ) : (
                        <div className="mt-4 divide-y divide-slate-100">
                            {bookings.map((b) => (
                                <div key={b.id} className="flex items-center justify-between gap-3 py-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800">{b.nama}</p>
                                        <p className="text-xs text-slate-400">{b.poli} · {b.dokter}</p>
                                        <p className="text-xs text-slate-400">{b.tanggal}</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <button type="button" className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-200">
                                            Reschedule
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBookings((list) => list.filter((x) => x.id !== b.id))}
                                            className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-100"
                                        >
                                            <X className="h-3 w-3" /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </FeatureShell>
    );
}