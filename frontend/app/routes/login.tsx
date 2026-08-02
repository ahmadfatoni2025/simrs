import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { api, setToken, type LoginResponse } from "~/lib/api";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("test@example.com");
    const [password, setPassword] = useState("password");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await api<LoginResponse>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            setToken(res.token);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login gagal.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
                        S
                    </div>
                    <h1 className="mt-3 text-xl font-bold text-slate-900">SIMRS</h1>
                    <p className="text-sm text-slate-500">Rumah Sakit Sehat</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Demo: test@example.com / password
                </p>
            </div>
        </div>
    );
}