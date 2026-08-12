import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, RefreshCw, Search, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router";
import { AppShell } from "~/components/layout/AppShell";
import { api, getToken } from "~/lib/api";
import type { MasterEntity, MasterField } from "~/master-data/masterDataConfig";

interface OptionItem {
    value: string | number;
    label: string;
}

type OptionMap = Record<string, OptionItem[]>;

interface PageMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export default function MasterDataPage({ entity }: { entity: MasterEntity }) {
    const navigate = useNavigate();
    const [rows, setRows] = useState<Record<string, unknown>[]>([]);
    const [meta, setMeta] = useState<PageMeta | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [options, setOptions] = useState<OptionMap>({});
    const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const optionSlugs = useMemo(() => {
        const slugs = new Set<string>();
        entity.fields.filter((f) => f.type === "select-entity" && f.entity).forEach((f) => slugs.add(f.entity!));
        entity.columns.filter((c) => c.optionsFor).forEach((c) => slugs.add(c.optionsFor!));
        return [...slugs];
    }, [entity]);

    async function load() {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({ page: String(page), per_page: "10" });
        if (search) params.set("search", search);
        try {
            const payload = await api<{ data: Record<string, unknown>[]; meta?: PageMeta }>(`${entity.endpoint}?${params}`);
            setRows(payload.data ?? []);
            if (payload.meta) setMeta(payload.meta);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat data.");
            setRows([]);
        } finally {
            setLoading(false);
        }
    }

    async function loadOptions() {
        const map: OptionMap = {};
        await Promise.all(
            optionSlugs.map(async (slug) => {
                try {
                    const data = await api<OptionItem[]>(`/master-data/catalog/options/${slug}`);
                    map[slug] = data;
                } catch {
                    map[slug] = [];
                }
            })
        );
        setOptions(map);
    }

    useEffect(() => {
        void load();
    }, [entity.endpoint, search, page, navigate]);

    useEffect(() => {
        void loadOptions();
    }, [optionSlugs]);

    function openCreate() {
        setEditing(null);
        setShowModal(true);
        setError(null);
    }

    function openEdit(row: Record<string, unknown>) {
        setEditing(row);
        setShowModal(true);
        setError(null);
    }

    async function handleDelete(row: Record<string, unknown>) {
        if (!window.confirm(`Yakin hapus data "${row[entity.columns[0]?.key ?? "id"] ?? row.id}"?`)) return;
        setError(null);
        try {
            await api(`${entity.endpoint}/${row.id}`, { method: "DELETE" });
            void load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal menghapus data.");
        }
    }

    function labelOf(slug: string, value: unknown): string {
        return options[slug]?.find((o) => String(o.value) === String(value))?.label ?? (value != null && value !== "" ? `#${value}` : "-");
    }

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{entity.title}</h1>
                        {entity.subtitle && <p className="text-sm text-slate-500">{entity.subtitle}</p>}
                        {entity.searchable && entity.searchable.length > 0 && (
                            <p className="mt-1 text-[11px] text-slate-400">
                                Pencarian: {entity.searchable.join(", ")}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {entity.fields.length > 0 && (
                            <button
                                onClick={openCreate}
                                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Data
                            </button>
                        )}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Cari..."
                                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            onClick={() => void load()}
                            className="flex items-center gap-2 rounded-lg bg-[#121212] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Muat Ulang
                        </button>
                    </div>
                </div>

                {error && <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

                {/* Tabel */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                                    {entity.columns.map((col) => (
                                        <th key={col.key} className="px-4 py-3 font-semibold">
                                            {col.label}
                                        </th>
                                    ))}
                                    {entity.fields.length > 0 && <th className="px-4 py-3 text-right font-semibold">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={entity.columns.length + 1} className="p-6">
                                            <div className="h-8 animate-pulse rounded bg-slate-100" />
                                        </td>
                                    </tr>
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={entity.columns.length + 1} className="px-4 py-12 text-center text-sm text-slate-400">
                                            Tidak ada data ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((row, i) => (
                                        <tr key={String(row.id ?? i)} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                                            {entity.columns.map((col) => (
                                                <td key={col.key} className="px-4 py-3 text-slate-700">
                                                    {col.optionsFor && !col.render
                                                        ? labelOf(col.optionsFor, row[col.key])
                                                        : col.render
                                                            ? col.render(row)
                                                            : String(row[col.key] ?? "-")}
                                                </td>
                                            ))}
                                            {entity.fields.length > 0 && (
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => openEdit(row)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                                            title="Ubah"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => void handleDelete(row)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {meta && meta.total > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm">
                            <p className="text-xs text-slate-500">
                                Menampilkan {Math.min(meta.total, (meta.current_page - 1) * meta.per_page + 1)} -{" "}
                                {Math.min(meta.current_page * meta.per_page, meta.total)} dari {meta.total} data
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-slate-50"
                                >
                                    Sebelumnya
                                </button>
                                <span className="px-2 text-xs font-medium">
                                    Hal {meta.current_page} / {meta.last_page}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                                    disabled={page >= meta.last_page}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-slate-50"
                                >
                                    Berikutnya
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Tambah / Ubah */}
            {showModal && (
                <EntityForm
                    entity={entity}
                    initial={editing}
                    options={options}
                    onClose={() => setShowModal(false)}
                    onSaved={() => {
                        setShowModal(false);
                        void load();
                    }}
                    onError={setError}
                />
            )}
        </AppShell>
    );

    function EntityForm({
        entity: ent,
        initial,
        options: opts,
        onClose,
        onSaved,
        onError,
    }: {
        entity: MasterEntity;
        initial: Record<string, unknown> | null;
        options: OptionMap;
        onClose: () => void;
        onSaved: () => void;
        onError: (message: string) => void;
    }) {
        const [form, setForm] = useState<Record<string, string>>(() => {
            const base: Record<string, string> = {};
            ent.fields.forEach((f) => {
                if (initial && initial[f.key] != null && initial[f.key] !== "") {
                    base[f.key] = String(initial[f.key]);
                } else if (f.type === "select" && f.options && f.options.length > 0) {
                    base[f.key] = String(f.options[0]!.value);
                } else {
                    base[f.key] = "";
                }
            });
            return base;
        });
        const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

        function set(key: string, value: string) {
            setForm((f) => ({ ...f, [key]: value }));
            setFieldErrors((e) => ({ ...e, [key]: "" }));
        }

        async function handleSubmit() {
            setSaving(true);
            onError("");
            setFieldErrors({});
            try {
                const body = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ""));
                if (initial) {
                    await api(`${ent.endpoint}/${initial.id}`, { method: "PUT", body: JSON.stringify(body) });
                } else {
                    await api(ent.endpoint, { method: "POST", body: JSON.stringify(body) });
                }
                setSaving(false);
                onSaved();
            } catch (err) {
                const message = err instanceof Error ? err.message : "Gagal menyimpan data.";
                const errors: Record<string, string> = {};
                if (err instanceof Error && "errors" in (err as object)) {
                    const anyErr = err as unknown as { errors?: Record<string, string[]> };
                    Object.entries(anyErr.errors ?? {}).forEach(([k, v]) => {
                        errors[k] = Array.isArray(v) ? v[0]! : String(v);
                    });
                }
                setFieldErrors(errors);
                onError(Object.keys(errors).length > 0 ? "" : message);
                setSaving(false);
            }
        }

        return (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
                <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {initial ? `Ubah ${ent.title}` : `Tambah ${ent.title}`}
                            </h2>
                            <p className="text-xs text-slate-500">Lengkapi formulir di bawah ini</p>
                        </div>
                        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {ent.fields.map((field) => (
                            <FieldControl
                                key={field.key}
                                field={field}
                                value={form[field.key] ?? ""}
                                options={opts[field.entity ?? ""] ?? []}
                                error={fieldErrors[field.key]}
                                onChange={(v) => set(field.key, v)}
                            />
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                            Batal
                        </button>
                        <button
                            onClick={() => void handleSubmit()}
                            disabled={saving}
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    function FieldControl({
        field,
        value,
        options: opts,
        error,
        onChange,
    }: {
        field: MasterField;
        value: string;
        options: OptionItem[];
        error?: string;
        onChange: (value: string) => void;
    }) {
        const type = field.type ?? "text";
        const className = `${inputClass} ${field.full ? "sm:col-span-2" : ""}`;
        const required = field.required ? " *" : "";

        return (
            <div className={field.full ? "sm:col-span-2" : ""}>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                    {field.label}
                    {required}
                </label>
                {type === "textarea" ? (
                    <textarea
                        rows={3}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        className={`${inputClass} resize-none`}
                    />
                ) : type === "select" ? (
                    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
                        <option value="">-- Pilih --</option>
                        {(field.options ?? []).map((o) => (
                            <option key={String(o.value)} value={String(o.value)}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                ) : type === "select-entity" ? (
                    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
                        <option value="">-- Pilih --</option>
                        {opts.map((o) => (
                            <option key={String(o.value)} value={String(o.value)}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                ) : type === "color" ? (
                    <input type="color" value={value || "#ef4444"} onChange={(e) => onChange(e.target.value)} className="h-10 w-full cursor-pointer rounded-lg border border-slate-200" />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        className={inputClass}
                    />
                )}
                {error && <p className="mt-1 text-[11px] font-medium text-red-600">{error}</p>}
            </div>
        );
    }
}