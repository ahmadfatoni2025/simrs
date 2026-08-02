export function SidebarProfile() {
    return (
        <div className="m-4 rounded-[0.5rem] bg-[#f8f6ff] border border-purple-100/80 p-4 shadow-2xs">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6344f5] text-xs font-bold text-white shadow-xs">
                    RM
                </div>
                <div className="overflow-hidden">
                    <p className="truncate text-sm font-bold text-slate-900">Dr. Rina Marlina</p>
                    <p className="truncate text-xs font-medium text-purple-600/80">Administrator</p>
                </div>
            </div>
        </div>
    );
}