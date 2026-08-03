import type { ReactNode } from "react";
import type { ResourceColumn, Row } from "./types";

// --- Helper: gaya className dinamis ---
export const cn = (...classes: (string | boolean | undefined | null)[]) =>
    classes.filter(Boolean).join(" ");

// --- Helper: warna badge berdasarkan kata kunci status ---
export const getPriorityColor = (text: any) => {
    const str = String(text || "").toLowerCase();
    if (str.includes("urgent") || str.includes("darurat")) return "bg-red-100 text-red-700";
    if (str.includes("high") || str.includes("tinggi")) return "bg-orange-100 text-orange-700";
    if (str.includes("medium") || str.includes("sedang")) return "bg-yellow-100 text-yellow-700";
    if (str.includes("low") || str.includes("rendah")) return "bg-green-100 text-green-700";
    if (str.includes("tetap") || str.includes("aktif")) return "bg-emerald-100 text-emerald-700";
    return "bg-slate-100 text-slate-600";
};

// --- Helper: ambil nilai sel sebuah kolom ---
export const cellOf = (col: ResourceColumn, row: Row): ReactNode =>
    col.render ? col.render(row) : String(row[col.key] ?? "-");

export const isStatus = (key: string) =>
    key.toLowerCase().includes("status") || key.toLowerCase().includes("keluar");

export const isDate = (key: string) =>
    key.toLowerCase().includes("tanggal") ||
    key.toLowerCase().includes("date") ||
    key.toLowerCase().includes("created_at");

export const isMoney = (key: string) =>
    key.toLowerCase() === "nominal" ||
    key.toLowerCase().includes("tarif") ||
    key.toLowerCase().includes("harga");

// Cari nama, tanggal, dan status dari kolom yang tersedia
export const resolveMeta = (columns: ResourceColumn[]): {
    nameColumn: ResourceColumn;
    statusColumn: ResourceColumn | undefined;
    dateColumn: ResourceColumn | undefined;
    moneyColumn: ResourceColumn | undefined;
    detailColumns: ResourceColumn[];
} => {
    const nameColumn: ResourceColumn =
        (columns.find((c) => c.key.toLowerCase().includes("nama") || c.key.toLowerCase().includes("name") || c.key.toLowerCase().includes("pasien")) ||
        columns.find((c) => c.key.toLowerCase().includes("rm")) ||
        columns[0]) as ResourceColumn;
    const statusColumn = columns.find((c) => isStatus(c.key));
    const dateColumn = columns.find((c) => isDate(c.key));
    const moneyColumn = columns.find((c) => isMoney(c.key));
    const detailColumns = columns.filter((c) => c.key !== nameColumn.key && !isStatus(c.key) && !isDate(c.key));
    return { nameColumn, statusColumn, dateColumn, moneyColumn, detailColumns };
};

export const nameOf = (row: Row, nameColumn: ResourceColumn) =>
    String(cellOf(nameColumn, row)) === "-" ? "Tanpa Nama" : cellOf(nameColumn, row);
