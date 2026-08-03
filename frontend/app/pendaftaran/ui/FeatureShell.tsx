import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface FeatureShellProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
}

export function FeatureShell({ title, subtitle, actions, children }: FeatureShellProps) {
    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900">{title}</h1>
                    {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
                </div>
                {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>
            {children}
        </div>
    );
}

export function EmptyState({
    icon,
    title,
    description,
}: {
    icon?: ReactNode;
    title: string;
    description?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            {icon}
            <p className="text-sm font-semibold text-slate-700">{title}</p>
            {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
    );
}

export function StatCard({
    label,
    value,
    hint,
    accent = "bg-indigo-500",
    icon,
}: {
    label: string;
    value: string | number;
    hint?: string;
    accent?: string;
    icon?: ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white", accent)}>
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-500">{label}</p>
                    <p className="text-2xl font-extrabold leading-tight text-slate-900">{value}</p>
                </div>
            </div>
            {hint && <p className="mt-2 text-[11px] text-slate-400">{hint}</p>}
        </div>
    );
}