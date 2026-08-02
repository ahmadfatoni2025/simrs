export function HeaderActions() {
    return (
        <div className="flex items-center gap-3">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 transition-all border border-slate-200/50">
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6344f5] text-xs font-black text-white shadow-xs ring-2 ring-purple-100">
                RM
            </div>
        </div>
    );
}