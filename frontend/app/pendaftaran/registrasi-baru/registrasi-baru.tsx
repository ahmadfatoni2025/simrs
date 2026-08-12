import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api, getToken } from "~/lib/api";
import type { Row } from "~/components/resource/types";
import FormRegistrasiKunjungan from "../ui/FormRegistrasiKunjungan";
import TabelKunjungan from "../ui/TabelKunjungan";
import DetailKunjungan from "../ui/DetailKunjungan";
import { FeatureShell } from "../ui/FeatureShell";

interface PageMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function RegistrasiBaru() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<Row[]>([]);
    const [meta, setMeta] = useState<PageMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Row | null>(null);

    async function load() {
        if (!getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
        try {
            const payload = await api<{ data?: Row; meta?: PageMeta }>(`/pendaftaran?${params}`);
            setRows(Array.isArray(payload.data) ? payload.data : []);
            if (payload.meta) setMeta(payload.meta);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat data.");
            setRows([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
    }, [page, perPage, navigate]);

    function handleSaved() {
        setPage(1);
        void load();
    }

    return (
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
            <div className="w-full min-w-0 flex-1">
                <FormRegistrasiKunjungan onSaved={handleSaved} />
            </div>
            <div className="w-full min-w-0 xl:w-95 xl:shrink-0 xl:self-stretch">
                <div className="sticky top-4">
                    {error && (
                        <div className="mb-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    <TabelKunjungan
                        rows={rows}
                        loading={loading}
                        page={page}
                        perPage={perPage}
                        totalRows={meta?.total ?? 0}
                        totalPages={meta?.last_page ?? 1}
                        onPageChange={setPage}
                        onPerPageChange={(p) => {
                            setPerPage(p);
                            setPage(1);
                        }}
                        onRowClick={setSelected}
                    />
                </div>
            </div>

            {selected && <DetailKunjungan row={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}
