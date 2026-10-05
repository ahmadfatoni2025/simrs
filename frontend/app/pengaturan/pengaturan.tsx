import { useState } from "react";
import {
    Settings,
    Building2,
    ShieldCheck,
    Users,
    Network,
    Database,
    CheckCircle2,
    Sparkles,
    Save,
    Key
} from "lucide-react";
import { AppShell } from "~/components/layout/AppShell";
import { cn } from "~/lib/utils";

export default function PengaturanPage() {
    const [namaRS, setNamaRS] = useState("RS Harapan Sehat SIMRS");
    const [kodeKemenkes, setKodeKemenkes] = useState("3529012");
    const [alamatRS, setAlamatRS] = useState("Jl. Jenderal Sudirman No. 102, Surabaya");
    const [telepon, setTelepon] = useState("031-8901234");
    const [emailRS, setEmailRS] = useState("admin@rsharapansehat.co.id");

    const [vclaimUserKey, setVclaimUserKey] = useState("89a0b12c34d56e");
    const [satusehatOrgId, setSatusehatOrgId] = useState("10002891002");

    const handleSave = () => {
        alert("Pengaturan Sistem RS berhasil disimpan ke konfigurasi utama SIMRS!");
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Pengaturan System SIMRS
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                                <Settings className="h-3.5 w-3.5" /> Core Configuration
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Konfigurasi Profil Rumah Sakit, Akses Pengguna, & Credentials Bridging Kemenkes / BPJS.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 cursor-pointer"
                    >
                        <Save className="h-4 w-4" /> Simpan Pengaturan
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left: RS Profile (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-slate-900">Profil & Identitas Rumah Sakit</h3>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Nama Rumah Sakit</label>
                                        <input
                                            type="text"
                                            value={namaRS}
                                            onChange={(e) => setNamaRS(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Kode Faskes Kemenkes</label>
                                        <input
                                            type="text"
                                            value={kodeKemenkes}
                                            onChange={(e) => setKodeKemenkes(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap RS</label>
                                    <input
                                        type="text"
                                        value={alamatRS}
                                        onChange={(e) => setAlamatRS(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2.5"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">No. Telepon / Hotline</label>
                                        <input
                                            type="text"
                                            value={telepon}
                                            onChange={(e) => setTelepon(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 p-2.5 font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Email Resmi RS</label>
                                        <input
                                            type="email"
                                            value={emailRS}
                                            onChange={(e) => setEmailRS(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 p-2.5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bridging Credentials */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                <Key className="h-4 w-4 text-purple-600" />
                                <h3 className="text-sm font-bold text-slate-900">API Credentials Bridging (BPJS & SATUSEHAT)</h3>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">BPJS V-Claim User Key / Cons ID</label>
                                    <input
                                        type="password"
                                        value={vclaimUserKey}
                                        onChange={(e) => setVclaimUserKey(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">SATUSEHAT Kemenkes Organization ID</label>
                                    <input
                                        type="text"
                                        value={satusehatOrgId}
                                        onChange={(e) => setSatusehatOrgId(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 font-mono font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Role & Backup */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-100 pb-2">Database Backup & Log</h4>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    <span className="text-slate-600">Database Engine:</span>
                                    <span className="font-bold text-slate-900">MySQL 8.0 / MariaDB</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    <span className="text-slate-600">Terakhir Di-backup:</span>
                                    <span className="font-mono text-emerald-600 font-bold">Hari ini, 03:00 WIB</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => alert("Proses Backup Database SIMRS telah berhasil diunduh!")}
                                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                Generate Backup Database (.sql)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
