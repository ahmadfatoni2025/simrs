import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { AppShell } from "~/components/layout/AppShell";
import { Card } from "~/components/ui/Card";
import { api, clearToken, getToken } from "~/lib/api";

interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function PengaturanPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        api<UserProfile>("/user")
            .then(setUser)
            .catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat profil."));
    }, [navigate]);

    async function logout() {
        await api("/auth/logout", { method: "POST" }).catch(() => null);
        clearToken();
        navigate("/login", { replace: true });
    }

    return (
        <AppShell>
            <Card className="max-w-xl p-6">
                <h1 className="text-lg font-bold text-slate-900">Pengaturan</h1>
                <p className="text-xs text-slate-500">Profil akun yang sedang masuk</p>

                {error ? (
                    <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
                ) : user ? (
                    <div className="mt-6 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                            <span className="mt-1 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold capitalize text-indigo-700">
                                {user.role}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="mt-6 text-sm text-slate-500">Memuat profil...</p>
                )}

                <button
                    onClick={() => void logout()}
                    className="mt-8 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                    <LogOut className="h-4 w-4" />
                    Keluar
                </button>
            </Card>
        </AppShell>
    );
}
