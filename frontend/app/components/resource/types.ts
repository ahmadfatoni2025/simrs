import type { ReactNode } from "react";

export interface ResourceColumn {
    key: string;
    label: string;
    render?: (row: Record<string, unknown>) => ReactNode;
}

export interface ResourcePageProps {
    title: string;
    subtitle?: string;
    endpoint: string;
    columns: ResourceColumn[];
    searchPlaceholder?: string;
    action?: ReactNode;
    refreshKey?: number;
}

export interface Row {
    [key: string]: unknown;
    id?: string | number;
    no?: string | number;
    status?: string;
}

export interface PageMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}