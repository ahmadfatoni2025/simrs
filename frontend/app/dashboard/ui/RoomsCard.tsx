import { DonutChart } from "./DonutChart";
import type { RoomsSummary } from "~/lib/api";
import { Card } from "~/components/ui/Card";

const COLORS = {
    terisi: "#6344f5",
    kosong: "#c0ed37",
    perawatan: "#8b5cf6",
};

const legend = [
    { label: "Terisi", value: "terisi", color: COLORS.terisi },
    { label: "Kosong", value: "kosong", color: COLORS.kosong },
    { label: "Perawatan", value: "perawatan", color: COLORS.perawatan },
] as const;

export function RoomsCard({ rooms }: { rooms: RoomsSummary }) {
    const segments = [
        { value: rooms.terisi, color: COLORS.terisi },
        { value: rooms.kosong, color: COLORS.kosong },
        { value: rooms.perawatan, color: COLORS.perawatan },
    ];

    return (
        <Card className="p-6">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Status Kamar</h2>
            <p className="text-xs font-medium text-slate-400">
                Kapasitas {rooms.kapasitas} tempat tidur
            </p>
            <div className="mt-6 flex justify-center">
                <div className="relative">
                    <DonutChart segments={segments} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-2xl font-black text-slate-900">{rooms.total}</p>
                        <p className="text-xs font-medium text-slate-400">Total Kamar</p>
                    </div>
                </div>
            </div>
            <div className="mt-6 space-y-2.5">
                {legend.map((r) => (
                    <div key={r.value} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-600 font-medium">
                            <span className="h-3 w-3 rounded-full shadow-2xs" style={{ backgroundColor: r.color }} />
                            {r.label}
                        </span>
                        <span className="font-bold text-slate-900">{rooms[r.value]}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}