import React from "react";

export interface DataRM01 {
    kamar_kelas_tt?: string;
    no_rekam_medis?: string;
    dirawat_ke?: string;
    nama_pasien?: string;
    jenis_kelamin?: "L" | "P" | string;
    tanggal_lahir?: string;
    umur?: string;
    agama?: string;
    status_pernikahan?: string;
    pekerjaan?: string;
    pendidikan_terakhir?: string;
    alamat?: string;
    no_telepon?: string;
    cara_kb?: string;
    nama_keluarga_inti?: string; // Ayah/Ibu/Suami/Istri
    penanggung_biaya?: string;
    alamat_penanggung?: string;
    no_hp_penanggung?: string;
    nama_keluarga_terdekat?: string;
    alamat_keluarga_terdekat?: string;
    no_hp_keluarga_terdekat?: string;
    cara_mrs?: string;
    dokter_1?: string;
    dokter_2?: string;
    dokter_3?: string;
    dokter_4?: string;
    dokter_5?: string;
    dokter_6?: string;
    diagnosa_masuk?: string;
    riwayat_alergi?: "Tidak" | "Ya" | string;
    detail_alergi?: string;
    tanggal_mrs?: string;
    jam_mrs?: string;
    tanggal_krs?: string;
    jam_krs?: string;
    lama_dirawat?: string;
    diagnosa_utama?: string;
    kode_icd10?: string;
    komplikasi_1?: string;
    komplikasi_2?: string;
    diagnosa_sekunder_1?: string;
    diagnosa_sekunder_2?: string;
    penyebab_cedera?: string;
    operasi_tindakan?: string;
    golongan_operasi?: string;
    tgl_operasi?: string;
    jenis_anastesi?: string;
    kode_operasi?: string;
    infeksi_nosokomial?: "Tidak" | "Ya" | string;
    penyebab_infeksi?: string;
    imunisasi?: string[];
    pengobatan_radioterapi?: string;
    imunisasi_selama_dirawat?: string;
    transfusi_darah_cc?: string;
    keadaan_krs?: string;
    cara_krs?: string;
    dokter_merawat?: string;
}

interface FormulirRM01Props {
    data?: DataRM01;
    onPrint?: () => void;
}

export function FormulirRM01({ data = {}, onPrint }: FormulirRM01Props) {
    const d = data;

    const isLaki = d.jenis_kelamin === "L" || d.jenis_kelamin?.toLowerCase().startsWith("laki");
    const isPerempuan = d.jenis_kelamin === "P" || d.jenis_kelamin?.toLowerCase().startsWith("perempuan");

    const statusKawin = (d.status_pernikahan || "").toLowerCase();
    const isKawin = statusKawin.includes("kawin") && !statusKawin.includes("belum");
    const isBelumKawin = statusKawin.includes("belum");
    const isJanda = statusKawin.includes("janda");
    const isDuda = statusKawin.includes("duda");
    const isDibawahUmur = statusKawin.includes("umur") || statusKawin.includes("anak");

    return (
        <div className="printable-rm01-document mx-auto my-4 max-w-[850px] bg-white p-6 shadow-md border border-slate-300 text-slate-900 font-sans print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full print:text-black">
            {/* Action Bar (Hanya Tampil di Layar, Tersembunyi Saat Print) */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
                <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Preview Formulir RM-01 (Lembar Masuk & Keluar)
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        if (onPrint) onPrint();
                        else window.print();
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>Cetak Formulir RM-01</span>
                </button>
            </div>

            {/* Document Grid Frame (Berstandar Resmi RS) */}
            <div className="border-2 border-black p-3 text-[11px] leading-tight space-y-1 bg-white">
                {/* Header Kop RM-01 */}
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    {/* Logo & Nama RS */}
                    <div className="flex items-center gap-3 w-1/3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white font-extrabold text-lg border border-emerald-900">
                            +
                        </div>
                        <div>
                            <h2 className="font-extrabold text-sm uppercase leading-none tracking-tight">RUMAH SAKIT</h2>
                            <h1 className="font-black text-base text-emerald-800 uppercase tracking-tight leading-none">SEHAT UTAMA</h1>
                            <p className="text-[9px] text-slate-600 leading-tight mt-0.5">Sistem Manajemen Rumah Sakit Terpadu</p>
                        </div>
                    </div>

                    {/* Judul Dokumen Center */}
                    <div className="text-center flex-1 px-2">
                        <h2 className="font-black text-sm uppercase tracking-wide">FORMULIR REKAM MEDIS UMUM</h2>
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">(LEMBAR MASUK & KELUAR)</h3>
                    </div>

                    {/* Kode RM-01 & Status Rahasia Right */}
                    <div className="w-1/4 flex flex-col items-end gap-1">
                        <div className="border border-black px-3 py-0.5 text-center font-bold text-xs">
                            RM-01
                        </div>
                        <div className="border-2 border-black bg-black text-white px-3 py-0.5 font-black text-xs uppercase tracking-widest">
                            RAHASIA
                        </div>
                    </div>
                </div>

                {/* Baris 1: Kamar / Kelas / No.TT */}
                <div className="border border-black p-1 font-bold">
                    Kamar / Kelas / No.TT : <span className="font-mono">{d.kamar_kelas_tt || "-"}</span>
                </div>

                {/* Main Two-Column Table Grid */}
                <table className="w-full border-collapse border border-black text-[11px]">
                    <tbody>
                        {/* No RM & Dirawat Ke */}
                        <tr className="border-b border-black">
                            <td className="w-1/2 border-r border-black p-1 font-medium">
                                <span className="inline-block w-28">No. Rekam Medik</span>:{" "}
                                <span className="font-bold font-mono text-xs">{d.no_rekam_medis || "-"}</span>
                            </td>
                            <td className="w-1/2 p-1 font-medium">
                                <span className="inline-block w-28 font-bold">DIRAWAT KE</span>:{" "}
                                <span className="font-bold">{d.dirawat_ke || "1"}</span>
                            </td>
                        </tr>

                        {/* Nama Pasien & Sex */}
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-medium">
                                <span className="inline-block w-28">Nama Pasien</span>:{" "}
                                <span className="font-bold uppercase">{d.nama_pasien || "-"}</span>
                            </td>
                            <td className="p-1 font-medium">
                                <span className="mr-3">Sex :</span>
                                <label className="inline-flex items-center gap-1 mr-4 cursor-pointer">
                                    <span className={`inline-block h-3.5 w-3.5 border border-black text-center text-[10px] leading-none font-bold ${isLaki ? "bg-black text-white" : ""}`}>
                                        {isLaki ? "✓" : ""}
                                    </span>{" "}
                                    Laki-laki
                                </label>
                                <label className="inline-flex items-center gap-1 cursor-pointer">
                                    <span className={`inline-block h-3.5 w-3.5 border border-black text-center text-[10px] leading-none font-bold ${isPerempuan ? "bg-black text-white" : ""}`}>
                                        {isPerempuan ? "✓" : ""}
                                    </span>{" "}
                                    Perempuan
                                </label>
                            </td>
                        </tr>

                        {/* Tgl Lahir / Umur & Agama */}
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-medium">
                                <span className="inline-block w-28">Tanggal lahir</span>:{" "}
                                <span>{d.tanggal_lahir || "-"}</span>
                                <span className="ml-4">Umur : {d.umur || "-"}</span>
                            </td>
                            <td className="p-1 font-medium">
                                <span className="inline-block w-28">Agama</span>:{" "}
                                <span>{d.agama || "-"}</span>
                            </td>
                        </tr>

                        {/* Status Perkawinan */}
                        <tr className="border-b border-black">
                            <td colSpan={2} className="p-1 font-medium">
                                <span className="mr-2 font-semibold">Status Perkawinan :</span>
                                <span className="inline-flex items-center gap-1 mr-3">
                                    <span className={`inline-block h-3 w-3 border border-black text-center text-[9px] leading-none font-bold ${isKawin ? "bg-black text-white" : ""}`}>{isKawin ? "✓" : ""}</span> Kawin
                                </span>
                                <span className="inline-flex items-center gap-1 mr-3">
                                    <span className={`inline-block h-3 w-3 border border-black text-center text-[9px] leading-none font-bold ${isBelumKawin ? "bg-black text-white" : ""}`}>{isBelumKawin ? "✓" : ""}</span> Belum kawin
                                </span>
                                <span className="inline-flex items-center gap-1 mr-3">
                                    <span className={`inline-block h-3 w-3 border border-black text-center text-[9px] leading-none font-bold ${isJanda ? "bg-black text-white" : ""}`}>{isJanda ? "✓" : ""}</span> Janda
                                </span>
                                <span className="inline-flex items-center gap-1 mr-3">
                                    <span className={`inline-block h-3 w-3 border border-black text-center text-[9px] leading-none font-bold ${isDuda ? "bg-black text-white" : ""}`}>{isDuda ? "✓" : ""}</span> Duda
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <span className={`inline-block h-3 w-3 border border-black text-center text-[9px] leading-none font-bold ${isDibawahUmur ? "bg-black text-white" : ""}`}>{isDibawahUmur ? "✓" : ""}</span> Dibawah umur
                                </span>
                            </td>
                        </tr>

                        {/* Pekerjaan & Dokter 1 */}
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-medium">
                                <span className="inline-block w-28">Pekerjaan</span>: <span>{d.pekerjaan || "-"}</span>
                            </td>
                            <td className="p-1 font-medium">
                                <span>1. Dr. {d.dokter_1 || d.dokter_merawat || "......................................."}</span>
                                <span className="ml-4">Telp. ....................</span>
                            </td>
                        </tr>

                        {/* Pendidikan & Dokter 2 */}
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-medium">
                                <span className="inline-block w-28">Pendidikan terakhir</span>: <span>{d.pendidikan_terakhir || "-"}</span>
                            </td>
                            <td className="p-1 font-medium">
                                <span>2. Dr. {d.dokter_2 || "......................................."}</span>
                                <span className="ml-4">Telp. ....................</span>
                            </td>
                        </tr>

                        {/* Alamat & Dokter 3 */}
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-medium">
                                <span className="inline-block w-28">Alamat</span>: <span>{d.alamat || "-"}</span>
                            </td>
                            <td className="p-1 font-medium">
                                <span>3. Dr. {d.dokter_3 || "......................................."}</span>
                                <span className="ml-4">Telp. ....................</span>
                            </td>
                        </tr>

                        {/* No Telp & Dokter 4 */}
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-medium">
                                <span className="inline-block w-28">No.Telp/HP</span>: <span>{d.no_telepon || "-"}</span>
                            </td>
                            <td className="p-1 font-medium">
                                <span>4. Dr. {d.dokter_4 || "......................................."}</span>
                                <span className="ml-4">Telp. ....................</span>
                            </td>
                        </tr>

                        {/* Cara KB & Dokter 5 */}
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-medium">
                                <span className="inline-block w-28">Cara KB</span>: <span>{d.cara_kb || "IUD / Pil / Kondom / MOW / MOP / Lain"}</span>
                            </td>
                            <td className="p-1 font-medium">
                                <span>5. Dr. {d.dokter_5 || "......................................."}</span>
                                <span className="ml-4">Telp. ....................</span>
                            </td>
                        </tr>

                        {/* Nama Keluarga Inti & Dokter 6 */}
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-medium">
                                <span className="inline-block w-28">Nama Ayah / Ibu / Suami / Istri</span>: <span>{d.nama_keluarga_inti || "-"}</span>
                            </td>
                            <td className="p-1 font-medium">
                                <span>6. Dr. {d.dokter_6 || "......................................."}</span>
                                <span className="ml-4">Telp. ....................</span>
                            </td>
                        </tr>

                        {/* Penanggung Biaya & Cara MRS */}
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-medium">
                                <span className="inline-block w-28 font-semibold">Penanggung Biaya</span>: <span className="font-bold">{d.penanggung_biaya || "Umum"}</span>
                            </td>
                            <td className="p-1 font-medium">
                                <span className="font-bold mr-2">Cara MRS :</span>
                                <span className="inline-flex items-center gap-1 mr-2"><span className="inline-block h-3 w-3 border border-black" /> Admission</span>
                                <span className="inline-flex items-center gap-1 mr-2"><span className="inline-block h-3 w-3 border border-black" /> UGD</span>
                                <span className="inline-flex items-center gap-1 mr-2"><span className="inline-block h-3 w-3 border border-black" /> Klinik Spesialis</span>
                                <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 border border-black" /> RS Lain</span>
                            </td>
                        </tr>

                        {/* Alamat Penanggung & Diagnosa Masuk */}
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-medium">
                                <div><span className="inline-block w-28">Alamat Penanggung</span>: {d.alamat_penanggung || d.alamat || "-"}</div>
                                <div className="mt-0.5"><span className="inline-block w-28">No.Telp/HP</span>: {d.no_hp_penanggung || d.no_telepon || "-"}</div>
                            </td>
                            <td className="p-1 font-medium">
                                <span className="font-semibold block">Diagnosa masuk :</span>
                                <span className="italic text-slate-700">{d.diagnosa_masuk || "-"}</span>
                            </td>
                        </tr>

                        {/* Keluarga Terdekat & Riwayat Alergi */}
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-medium">
                                <div><span className="inline-block w-28">Nama Keluarga terdekat</span>: {d.nama_keluarga_terdekat || "-"}</div>
                                <div className="mt-0.5"><span className="inline-block w-28">Alamat</span>: {d.alamat_keluarga_terdekat || "-"}</div>
                                <div className="mt-0.5"><span className="inline-block w-28">No.Telp/HP</span>: {d.no_hp_keluarga_terdekat || "-"}</div>
                            </td>
                            <td className="p-1 font-medium align-top">
                                <span className="font-semibold mr-2">Riwayat alergi :</span>
                                <span className="inline-flex items-center gap-1 mr-3"><span className="inline-block h-3 w-3 border border-black" /> Tidak</span>
                                <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 border border-black" /> Ya : {d.detail_alergi || ".................."}</span>
                            </td>
                        </tr>

                        {/* Tanggal MRS, KRS, Lama Dirawat */}
                        <tr className="border-b border-black">
                            <td colSpan={2} className="p-1 font-medium">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div><span className="font-semibold">Tanggal MRS :</span> {d.tanggal_mrs || "-"} <span className="ml-3 font-semibold">Jam :</span> {d.jam_mrs || "-"}</div>
                                    <div><span className="font-semibold">Tanggal KRS :</span> {d.tanggal_krs || "-"} <span className="ml-3 font-semibold">Jam :</span> {d.jam_krs || "-"}</div>
                                    <div><span className="font-semibold">Lama dirawat :</span> {d.lama_dirawat || "...."} hari</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Section Diagnosa Utama & ICD X */}
                <table className="w-full border-collapse border border-black text-[11px]">
                    <tbody>
                        <tr className="border-b border-black">
                            <td className="w-3/4 border-r border-black p-1.5 align-top">
                                <div className="font-bold text-xs">Diagnosa Utama : <span className="font-normal uppercase">{d.diagnosa_utama || "-"}</span></div>
                            </td>
                            <td className="w-1/4 p-1.5 font-bold text-center align-top bg-slate-50">
                                ICD X
                                <div className="font-mono text-xs font-semibold mt-1">{d.kode_icd10 || "-"}</div>
                            </td>
                        </tr>
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1.5">
                                <div className="font-semibold">Komplikasi :</div>
                                <div className="pl-4">1. {d.komplikasi_1 || "...................................................."}</div>
                                <div className="pl-4">2. {d.komplikasi_2 || "...................................................."}</div>
                            </td>
                            <td className="p-1.5" />
                        </tr>
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1.5">
                                <div className="font-semibold">Diagnosa sekunder :</div>
                                <div className="pl-4">1. {d.diagnosa_sekunder_1 || "...................................................."}</div>
                                <div className="pl-4">2. {d.diagnosa_sekunder_2 || "...................................................."}</div>
                            </td>
                            <td className="p-1.5" />
                        </tr>
                        <tr>
                            <td colSpan={2} className="p-1.5">
                                <div className="font-semibold">Penyebab cedera & keracunan / Morfologi Neoplasma :</div>
                                <div className="pl-4">{d.penyebab_cedera || "...................................................................................................................."}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Table Operasi / Tindakan */}
                <table className="w-full border-collapse border border-black text-[11px] text-center">
                    <thead>
                        <tr className="bg-slate-100 border-b border-black font-bold">
                            <th className="border-r border-black p-1 text-left">Operasi / Tindakan</th>
                            <th className="border-r border-black p-1">Golongan Operasi</th>
                            <th className="border-r border-black p-1">Tgl. Operasi</th>
                            <th className="border-r border-black p-1">Jenis Anastesi</th>
                            <th className="p-1">Kode Operasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-black h-8">
                            <td className="border-r border-black p-1 text-left">{d.operasi_tindakan || "-"}</td>
                            <td className="border-r border-black p-1">{d.golongan_operasi || "-"}</td>
                            <td className="border-r border-black p-1">{d.tgl_operasi || "-"}</td>
                            <td className="border-r border-black p-1">{d.jenis_anastesi || "-"}</td>
                            <td className="p-1">{d.kode_operasi || "-"}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Infeksi Nosokomial & Imunisasi & KRS Details */}
                <table className="w-full border-collapse border border-black text-[11px]">
                    <tbody>
                        <tr className="border-b border-black">
                            <td colSpan={2} className="p-1.5 font-medium">
                                <span className="font-semibold mr-3">Infeksi Nosokomial :</span>
                                <span className="inline-flex items-center gap-1 mr-4"><span className="inline-block h-3 w-3 border border-black" /> Tidak</span>
                                <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 border border-black" /> Ya, penyebab infeksi : {d.penyebab_infeksi || ".........................................."}</span>
                            </td>
                        </tr>
                        <tr className="border-b border-black">
                            <td className="w-3/5 border-r border-black p-1.5 font-medium">
                                <span className="font-semibold block mb-1">Imunisasi :</span>
                                <div className="flex flex-wrap gap-x-3 gap-y-1">
                                    <span><span className="inline-block h-3 w-3 border border-black mr-1" /> BCG</span>
                                    <span><span className="inline-block h-3 w-3 border border-black mr-1" /> DPT</span>
                                    <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Polio</span>
                                    <span><span className="inline-block h-3 w-3 border border-black mr-1" /> TFT</span>
                                    <span><span className="inline-block h-3 w-3 border border-black mr-1" /> DT</span>
                                    <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Campak</span>
                                    <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Lain-lain</span>
                                </div>
                            </td>
                            <td className="w-2/5 p-1.5 font-medium align-top">
                                <span className="font-semibold block mb-1">Pengobatan Radioterapi / Kedokteran Nuklir :</span>
                                <span>{d.pengobatan_radioterapi || "..........................................................."}</span>
                            </td>
                        </tr>
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1.5 font-medium">
                                <div>Imunisasi yang diperoleh selama dirawat : {d.imunisasi_selama_dirawat || ".........................................."}</div>
                            </td>
                            <td className="p-1.5 font-medium">
                                <div>Transfusi darah : <span className="font-bold">{d.transfusi_darah_cc || "........"}</span> cc.</div>
                            </td>
                        </tr>
                        <tr className="border-b border-black">
                            <td className="border-r border-black p-1.5 font-medium">
                                <span className="font-semibold block mb-1">Keadaan KRS :</span>
                                <div className="space-y-1">
                                    <div className="flex gap-4">
                                        <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Sembuh</span>
                                        <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Meninggal &lt; 48 jam</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Membaik</span>
                                        <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Meninggal &gt; 48 jam</span>
                                    </div>
                                    <div>
                                        <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Belum sembuh</span>
                                    </div>
                                </div>
                            </td>
                            <td className="p-1.5 font-medium align-top">
                                <span className="font-semibold block mb-1">Cara KRS :</span>
                                <div className="space-y-1">
                                    <div className="flex gap-4">
                                        <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Di pulangkan</span>
                                        <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Lari</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Pulang paksa</span>
                                        <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Lain-lain : .........</span>
                                    </div>
                                    <div>
                                        <span><span className="inline-block h-3 w-3 border border-black mr-1" /> Pindah rumah sakit lain</span>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {/* Signatures Row */}
                        <tr className="h-24">
                            <td className="border-r border-black p-2 align-bottom">
                                <div className="font-semibold">Dokter yang merawat :</div>
                                <div className="mt-8 font-bold border-b border-dashed border-black inline-block min-w-48">
                                    {d.dokter_merawat || "( .................................................... )"}
                                </div>
                            </td>
                            <td className="p-2 align-bottom text-center">
                                <div className="font-semibold">Tanda tangan :</div>
                                <div className="mt-12 text-slate-400 text-[10px] italic">Cap & Tanda Tangan RS</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
