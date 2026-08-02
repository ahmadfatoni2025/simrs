export function SidebarBrand() {
    return (
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
            <img className="w-12 h-auto shadow-xl shadow-blue-800/25 p-2 border-2 bg-white rounded-full" src="/img/logo.png" alt="Logo" />
            <div>
                <p className="text-lg font-black tracking-tight text-slate-900">SIMRS<span className="text-[#6344f5]">.</span></p>
                <p className="text-xs font-medium text-slate-400">Rumah Sakit Sehat</p>
            </div>
        </div>
    );
}