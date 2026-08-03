import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    LogIn,
    ArrowRight,
    Heart
} from "lucide-react";
import { api, setToken, type LoginResponse } from "~/lib/api";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("test@example.com");
    const [password, setPassword] = useState("password");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

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
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 p-4 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Decorative Circles */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5" />

                {/* Dots Pattern */}
                <div className="absolute top-20 left-20 w-32 h-32">
                    <div className="grid grid-cols-6 gap-2">
                        {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-300/20" />
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-20 right-20 w-32 h-32">
                    <div className="grid grid-cols-6 gap-2">
                        {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-300/20" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative w-full max-w-[440px]">
                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/10 border border-white/50 overflow-hidden">
                    {/* Card Header */}
                    <div className="px-8 pt-8 pb-6">

                        {/* Title */}
                        <div className="text-center">
                            <img src="img/logo.png" className="w-22 mx-auto mb-4" alt="Logo" />
                            <p className="text-sm text-gray-500 mt-1">Sistem Informasi Manajemen Rumah Sakit</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="px-8 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Alamat Email
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nama@email.com"
                                        required
                                        className="w-full rounded-xl border border-gray-200 bg-white/50 pl-10 pr-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Kata Sandi
                                    </label>
                                    <button
                                        type="button"
                                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                                        onClick={() => alert('Fitur masih pengembanagn.')}>
                                        Lupa password?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Masukkan kata sandi"
                                        required
                                        className="w-full rounded-xl border border-gray-200 bg-white/50 pl-10 pr-12 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                                    Ingat saya
                                </label>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 animate-shake">
                                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                        <span className="text-red-600 font-bold text-sm">!</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-red-800">Login Gagal</p>
                                        <p className="text-xs text-red-600 mt-0.5">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-full group"
                            >
                                <div className="absolute" />
                                <div className="relative flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50 transition-all duration-200">
                                    {loading ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="h-4 w-4" />
                                            Masuk ke Dashboard
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}