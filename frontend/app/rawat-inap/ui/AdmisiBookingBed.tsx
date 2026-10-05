import { useState } from "react";
import {
    UserPlus,
    BedDouble,
    ShieldCheck,
    CheckCircle2,
    Calendar,
    Stethoscope,
    Sparkles
} from "lucide-react";
import { cn } from "~/lib/utils";

export default function AdmisiBookingBed() {
    const [namaPasien, setNamaPasien] = useState("");
    const [norm, setNorm] = useState("");
    const [kelas, setKelas] = useState("III");
    const [kamar, setKamar] = useState("Kamar Melati 01 (Bed-03)");
    const [dpjp, setDpjp] = useState("dr. Andi Prasetyo, Sp.PD");
    const [penjamin, setPenjamin] = useState("BPJS");
    const [diagnosaMasuk, setDiagnosaMasuk] = useState("");

    const handleSubmitAdmisi = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Admisi Pasien ${namaPasien || 'Baru'} (${norm || 'RM Auto'}) ke ${kamar} BERHASIL DIPROSES!`);
        setNamaPasien("");
        setNorm("");
        setDiagnosaMasuk("");
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold">
                        <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Form Admisi & Booking Bed Rawat Inap</h3>
                        <p className="text-xs text-slate-500">Pendaftaran admisi pasien rawat inap dari Poliklinik atau Instalasi Gawat Darurat (IGD).</p>
                    </div>
                </div>

                <form onSubmit={handleSubmitAdmisi} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Nama Pasien</label>
                            <input
                                type="text"
                                required
                                placeholder="Masukkan nama lengkap pasien"
                                value={namaPasien}
                                onChange={(e) => setNamaPasien(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">No. Rekam Medis (RM)</label>
                            <input
                                type="text"
                                placeholder="Contoh: RM-2026-0099"
                                value={norm}
                                onChange={(e) => setNorm(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Kelas Rawat Inap</label>
                            <select
                                value={kelas}
                                onChange={(e) => setKelas(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-800"
                            >
                                <option value="VIP">VIP</option>
                                <option value="I">Kelas I</option>
                                <option value="II">Kelas II</option>
                                <option value="III">Kelas III</option>
                                <option value="ICU">ICU</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Pilih Kamar & Bed Kosong</label>
                            <select
                                value={kamar}
                                onChange={(e) => setKamar(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-slate-800"
                            >
                                <option value="Kamar Melati 01 (Bed-03)">Kamar Melati 01 (Bed-03) - Kelas III</option>
                                <option value="Kamar Melati 02 (Bed-02)">Kamar Melati 02 (Bed-02) - Kelas III</option>
                                <option value="Kamar Anggrek 01 (Bed-02)">Kamar Anggrek 01 (Bed-02) - Kelas I</option>
                                <option value="Kamar Mawar 02 (Bed-01)">Kamar Mawar 02 (Bed-01) - VIP</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Jenis Penjamin</label>
                            <select
                                value={penjamin}
                                onChange={(e) => setPenjamin(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-800"
                            >
                                <option value="BPJS">BPJS Kesehatan</option>
                                <option value="Umum">Umum / Cash</option>
                                <option value="Asuransi">Asuransi Swasta</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">DPJP Dokter Penanggung Jawab</label>
                            <input
                                type="text"
                                value={dpjp}
                                onChange={(e) => setDpjp(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Diagnosa Masuk Inap</label>
                            <input
                                type="text"
                                placeholder="Contoh: DHF Grade II / Typhoid fever"
                                value={diagnosaMasuk}
                                onChange={(e) => setDiagnosaMasuk(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 p-2.5 font-medium"
                            />
                        </div>
                    </div>

                    <div className="pt-2 text-right">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-500 cursor-pointer"
                        >
                            <CheckCircle2 className="h-4 w-4" /> Proses Admisi Rawat Inap
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
