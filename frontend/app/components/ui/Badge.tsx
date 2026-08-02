import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export function Badge({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors",
                className
            )}
        >
            {children}
        </span>
    );
}