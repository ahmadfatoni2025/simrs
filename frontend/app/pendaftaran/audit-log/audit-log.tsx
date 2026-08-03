import { useState } from "react";
import { FileText } from "lucide-react";
import { cn } from "~/lib/utils";
import { EmptyState, FeatureShell } from "../ui/FeatureShell";

interface LogEntry {
    id: number;
    user: string;
    role: string;
    timestamp: string;
    ip: string;
    device: string;
    aktivitas: string;
    type: "Aktivitas" | "Registrasi" | "Edit" | "Delete" | "Cancel" | "Print";
}

const seed: LogEntry[] = [
    { id: 1, user: "admin", role: "Administrator", timestamp: "2026-08-03 15:20:11", ip: "192.168.1.10", device: "Chrome / Windows", aktivitas: "Registrasi pasien baru", type: "Registrasi" },
    { id: 2, user: "admin", role: "Administrator", timestamp: "2026-08-03 15:18:44", ip: "192.168.1.10", device: "Chrome / Windows", aktivitas: "Generate SEP BPJS", type: "Aktivitas" },
    { id: 3, user: "suster", role: "Perawat", timestamp: "2026-08-03 15:12:02", ip: "192.168.1.21", device: "Firefox / Windows", aktivitas: "Cetak bukti registrasi", type: "Print" },
    { id: 4, user: "admin", role: "Administrator", timestamp: "2026-08-03 14:58:30", ip: "192.168.1.10", device: "Chrome / Windows", aktivitas: "Pembatalan kunjungan REG-00003", type: "Cancel" },
];

const typeStyle: Record<LogEntry["type"], string> = {
    Aktivitas: "bg-slate-100 text-slate-600",
    Registrasi: "bg-emerald-50 text-emerald-600",
    Edit: "bg-amber-50 text-amber-600",
    Delete: "bg-red-50 text-red-600",
    Cancel: "bg-rose-50 text-rose-600",
    Print: "bg-blue-50 text-blue-600",
};

const filterTypes = ["Semua", "Registrasi", "Edit", "Delete", "Cancel", "Print"] as const;

export default function AuditLog() {
    const [filter, setFilter] = useState<(typeof filterTypes)[number]>("Semua");
    const [search, setSearch] = useState("");

    const filtered = seed.filter((l) => {
        const matchType = filter === "Semua" || l.type === filter;
        const matchSearch = !search || `${l.user} ${l.aktivitas}`.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    return (
        <FeatureShell
            title="Audit Log"
            subtitle="Catatan seluruh aktivitas: login, registrasi, edit, delete, cancel, dan print"
        >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    {filterTypes.map((f) => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setFilter(f)}
                            className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors", filter === f ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari user / aktivitas..."
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={<FileText className="h-8 w-8 text-slate-300" />} title="Tidak ada log" />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Aktivitas</th>
                                    <th className="px-4 py-3">Timestamps</th>
                                    <th className="px-4 py-3">IP Address</th>
                                    <th className="px-4 py-3">Device</th>
                                    <th className="px-4 py-3">Tipe</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((l) => (
                                    <tr key={l.id} className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3 font-semibold text-slate-800">{l.user}</td>
                                        <td className="px-4 py-3 text-slate-500">{l.role}</td>
                                        <td className="px-4 py-3 text-slate-600">{l.aktivitas}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{l.timestamp}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{l.ip}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{l.device}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", typeStyle[l.type])}>
                                                {l.type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </FeatureShell>
    );
}