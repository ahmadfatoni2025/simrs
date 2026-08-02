import { Badge } from "./Badge";

const map: Record<string, string> = {
    Menunggu: "bg-amber-100 text-amber-700",
    Diperiksa: "bg-blue-100 text-blue-700",
    Selesai: "bg-green-100 text-green-700",
    Kosong: "bg-emerald-100 text-emerald-700",
    Terisi: "bg-indigo-100 text-indigo-700",
    Perawatan: "bg-violet-100 text-violet-700",
    Aktif: "bg-emerald-100 text-emerald-700",
};

export function StatusBadge({ value }: { value: string }) {
    return (
        <Badge className={map[value] ?? "bg-slate-100 text-slate-600"}>{value}</Badge>
    );
}