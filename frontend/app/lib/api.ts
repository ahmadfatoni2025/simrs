export interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

export interface StatItem {
    key: string;
    label: string;
    value: string | number;
    change: string;
}

export interface VisitPoint {
    date: string;
    label: string;
    value: number;
}

export interface RoomsSummary {
    total: number;
    kapasitas: number;
    terisi: number;
    kosong: number;
    perawatan: number;
}

export interface RegistrationRow {
    no: string;
    name: string;
    poli: string;
    dokter: string;
    status: string;
    jenis_kelamin: "L" | "P";
}

export interface DashboardData {
    stats: StatItem[];
    weekly_visits: VisitPoint[];
    rooms: RoomsSummary;
    recent_registrations: RegistrationRow[];
}

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const TOKEN_KEY = "simrs_token";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
    window.localStorage.removeItem(TOKEN_KEY);
}

export async function api<T = unknown>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const token = getToken();
    const body = init?.body;
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
            Accept: "application/json",
            ...(body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...init?.headers,
        },
    });

    if (!res.ok) {
        if (res.status === 401) clearToken();
        const payload = await res.json().catch(() => null);
        const message =
            payload?.message ??
            payload?.errors?.email?.[0] ??
            "Terjadi kesalahan pada server.";
        throw new Error(message);
    }

    return (await res.json()) as T;
}