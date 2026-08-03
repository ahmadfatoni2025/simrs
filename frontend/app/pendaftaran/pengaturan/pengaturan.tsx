import { useState } from "react";
import { Save, Settings } from "lucide-react";
import { cn } from "~/lib/utils";
import { FeatureShell } from "../ui/FeatureShell";

const groups = [
    { key: "rm", label: "Format Nomor RM", desc: "Pola penomoran rekam medis", items: ["Prefix", "Panjang digit", "Suffix"] },
    { key: "antrean", label: "Format Antrean", desc: "Pola nomor antrean per loket" },
    { key: "jam", label: "Jam Operasional", desc: "Jam buka & tutup loket registrasi" },
    { key: "libur", label: "Hari Libur", desc: "Daftar hari libur & cuti bersama" },
    { key: "kuota", label: "Kuota Dokter", desc: "Batas kuota per dokter per hari" },
    { key: "loket", label: "Pengaturan Loket", desc: "Nama, kode, dan status loket registrasi" },
    { key: "kiosk", label: "Pengaturan Kiosk", desc: "Konfigurasi anjungan mandiri" },
    { key: "cetak", label: "Pengaturan Cetak", desc: "Printer bukti & kartu pasien" },
    { key: "bridging", label: "Pengaturan Bridging", desc: "Kredensial BPJS & SATUSEHAT" },
];

const inputClass = "rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

export default function Pengaturan() {
    const [openKey, setOpenKey] = useState<string | null>("rm");
    const [saved, setSaved] = useState("");

    return (
        <FeatureShell
            title="Pengaturan Modul"
            subtitle="Konfigurasi format nomor, antrean, jam operasional, dan bridging"
        >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {groups.map((g) => {
                    const open = openKey === g.key;
                    return (
                        <div key={g.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <button
                                type="button"
                                onClick={() => setOpenKey((o) => (o === g.key ? null : g.key))}
                                className="flex w-full items-center gap-3 text-left"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                    <Settings className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-800">{g.label}</p>
                                    <p className="text-xs text-slate-400">{g.desc}</p>
                                </div>
                            </button>

                            {open && (
                                <div className="mt-4 space-y-3">
                                    {(g.items ?? []).map((item) => (
                                        <div key={item}>
                                            <p className="text-[11px] font-medium text-slate-500">{item}</p>
                                            <input className={cn(inputClass, "mt-1 w-full")} placeholder={`Isi ${item.toLowerCase()}`} />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setSaved(`${g.label} berhasil disimpan.`)}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                                    >
                                        <Settings className="h-3.5 w-3.5" /> Simpan
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {saved && <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 max-w-md">{saved}</p>}
        </FeatureShell>
    );
}