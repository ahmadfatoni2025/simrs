import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { Card } from "~/components/ui/Card";

export interface StatCardProps {
    label: string;
    value: string;
    change: string;
    up: boolean;
    icon: ReactNode;
    iconClassName: string;
}

export function StatCard({
    label,
    value,
    change,
    up,
    icon,
    iconClassName,
}: StatCardProps) {
    return (
        <Card className="p-5 hover:border-purple-200/60 transition-all">
            <div className="flex items-start justify-between">
                <div className={cn("rounded-2xl p-3 shadow-2xs", iconClassName)}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {icon}
                    </svg>
                </div>
                <span
                    className={cn(
                        "inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-bold",
                        up ? "bg-emerald-100/70 text-emerald-700" : "bg-rose-100/70 text-rose-700"
                    )}
                >
                    {change}
                </span>
            </div>
            <div className="mt-4">
                <p className="text-2xl font-extrabold tracking-tight text-slate-900">{value}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
            </div>
        </Card>
    );
}