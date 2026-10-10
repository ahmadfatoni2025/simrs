import React from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn } from "~/lib/utils";

export type AlertType = "success" | "warning" | "info" | "error";

export interface CustomAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: AlertType;
    confirmText?: string;
}

export function CustomAlertModal({
    isOpen,
    onClose,
    title,
    message,
    type = "success",
    confirmText = "Mengerti"
}: CustomAlertModalProps) {
    if (!isOpen) return null;

    const iconMap = {
        success: <CheckCircle2 className="h-10 w-10 text-emerald-500 animate-bounce" />,
        warning: <AlertTriangle className="h-10 w-10 text-amber-500 animate-pulse" />,
        info: <Info className="h-10 w-10 text-blue-500" />,
        error: <XCircle className="h-10 w-10 text-rose-500" />
    };

    const headerBgMap = {
        success: "bg-emerald-50 border-emerald-100",
        warning: "bg-amber-50 border-amber-100",
        info: "bg-blue-50 border-blue-100",
        error: "bg-rose-50 border-rose-100"
    };

    const buttonBgMap = {
        success: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20",
        warning: "bg-amber-600 hover:bg-amber-500 shadow-amber-500/20",
        info: "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20",
        error: "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
    };

    const defaultTitleMap = {
        success: "Berhasil Disimpan",
        warning: "Peringatan",
        info: "Informasi SIMRS",
        error: "Terjadi Kesalahan"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop Blur Overaly */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog Card centered in middle */}
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 transform transition-all animate-in zoom-in-95 duration-200 text-center space-y-4">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Icon Header Circle */}
                <div className={cn("mx-auto flex h-20 w-20 items-center justify-center rounded-full border shadow-inner", headerBgMap[type])}>
                    {iconMap[type]}
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                    <h3 className="text-lg font-black tracking-tight text-slate-900">
                        {title || defaultTitleMap[type]}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {message}
                    </p>
                </div>

                {/* Confirm Action Button */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className={cn(
                            "w-full rounded-2xl py-3 text-xs font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer",
                            buttonBgMap[type]
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
