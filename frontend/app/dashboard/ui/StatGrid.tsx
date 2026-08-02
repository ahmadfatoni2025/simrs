import type { ReactNode } from "react";
import { StatCard } from "./StatCard";
import type { StatItem } from "~/lib/api";

interface StatStyle {
    iconClassName: string;
    icon: ReactNode;
}

const styleMap: Record<string, StatStyle> = {
    pasien_hari_ini: {
        iconClassName: "bg-purple-100/80 text-[#6344f5]",
        icon: <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z" />,
    },
    dokter_aktif: {
        iconClassName: "bg-emerald-100/80 text-emerald-600",
        icon: (
            <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </>
        ),
    },
    janji_temu_hari_ini: {
        iconClassName: "bg-sky-100/80 text-sky-600",
        icon: (
            <>
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
            </>
        ),
    },
    pendapatan_bulan_ini: {
        iconClassName: "bg-violet-100/80 text-violet-600",
        icon: (
            <>
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </>
        ),
    },
};

const fallbackStyle: StatStyle = {
    iconClassName: "bg-slate-100 text-slate-600",
    icon: <path d="M3 3h18v18H3V3Z" />,
};

export function StatGrid({ stats }: { stats: StatItem[] }) {
    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => {
                const style = styleMap[s.key] ?? fallbackStyle;

                return (
                    <StatCard
                        key={s.key}
                        label={s.label}
                        value={String(s.value)}
                        change={s.change}
                        up={!s.change.startsWith("-")}
                        icon={style.icon}
                        iconClassName={style.iconClassName}
                    />
                );
            })}
        </section>
    );
}