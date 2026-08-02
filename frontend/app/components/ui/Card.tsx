import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export function Card({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                "rounded-[0.5rem] border border-slate-200/70 bg-white shadow-2s transition-shadow duration-200",
                className
            )}
        >
            {children}
        </div>
    );
}