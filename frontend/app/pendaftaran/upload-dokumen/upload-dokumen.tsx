import { useState } from "react";
import { CheckCircle2, FileUp } from "lucide-react";
import { cn } from "~/lib/utils";
import { FeatureShell } from "../ui/FeatureShell";

const dokumen = [
    { key: "ktp", label: "KTP" },
    { key: "kk", label: "Kartu Keluarga (KK)" },
    { key: "bpjs", label: "Kartu BPJS" },
    { key: "rujukan", label: "Surat Rujukan" },
    { key: "kontrol", label: "Surat Kontrol" },
    { key: "jaminan", label: "Surat Jaminan" },
    { key: "pendukung", label: "Dokumen Pendukung" },
];

export default function UploadDokumen() {
    const [files, setFiles] = useState<Record<string, string>>({});

    return (
        <FeatureShell
            title="Upload Dokumen"
            subtitle="Unggah dokumen pasien seperti KTP, KK, BPJS, rujukan, dan surat jaminan"
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {dokumen.map((d) => {
                    const uploaded = files[d.key];
                    return (
                        <div
                            key={d.key}
                            className={cn(
                                "rounded-2xl border bg-white p-5 shadow-sm transition-colors",
                                uploaded ? "border-emerald-300" : "border-slate-200 border-dashed"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", uploaded ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                                    {uploaded ? <CheckCircle2 className="h-5 w-5" /> : <FileUp className="h-5 w-5" />}
                                </div>
                                <p className="text-sm font-semibold text-slate-800">{d.label}</p>
                            </div>
                            {uploaded && <p className="mt-2 truncate text-xs text-slate-400">{uploaded}</p>}
                            <label
                                className={cn(
                                    "mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors",
                                    uploaded ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-slate-800 text-white hover:bg-slate-700"
                                )}
                            >
                                <FileUp className="h-3.5 w-3.5" />
                                {uploaded ? "Ganti File" : "Upload"}
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    onChange={(e) => setFiles((f) => ({ ...f, [d.key]: e.target.files?.[0]?.name ?? "" }))}
                                />
                            </label>
                        </div>
                    );
                })}
            </div>
        </FeatureShell>
    );
}
