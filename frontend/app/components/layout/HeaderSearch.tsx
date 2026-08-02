export function HeaderSearch() {
    return (
        <div className="hidden items-center gap-2.5 rounded-full bg-slate-100/80 px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 transition-all border border-slate-200/50 md:flex">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="font-normal">Cari pasien, dokter, obat...</span>
        </div>
    );
}