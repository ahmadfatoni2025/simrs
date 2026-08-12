import type { ReactNode } from "react";

export type FieldType =
    | "text"
    | "textarea"
    | "number"
    | "date"
    | "time"
    | "color"
    | "select"
    | "select-entity";

export interface MasterField {
    key: string;
    label: string;
    type?: FieldType;
    required?: boolean;
    placeholder?: string;
    full?: boolean;
    options?: { label: string; value: string | number }[];
    entity?: string;
}

export interface MasterColumn {
    key: string;
    label: string;
    render?: (row: Record<string, unknown>) => ReactNode;
    optionsFor?: string;
}

export interface MasterEntity {
    key: string;
    title: string;
    subtitle?: string;
    endpoint: string;
    searchable?: string[];
    columns: MasterColumn[];
    fields: MasterField[];
}

export const money = (value: unknown): string =>
    "Rp " + Number(value ?? 0).toLocaleString("id-ID");

const catalog = (entity: string) => `/master-data/catalog/${entity}`;

export const masterEntities: MasterEntity[] = [
    // ── Farmasi & Barang ──
    {
        key: "barang-farmasi",
        title: "Barang Farmasi",
        subtitle: "Katalog obat, bahan dan alat kesehatan farmasi",
        endpoint: catalog("barang-farmasi"),
        searchable: ["Kode barang", "Nama barang"],
        columns: [
            { key: "kode_barang", label: "Kode" },
            { key: "nama_barang", label: "Nama Barang" },
            {
                key: "jenis",
                label: "Jenis",
                render: (r) => (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${String(r.jenis) === "obat" ? "bg-sky-100 text-sky-700" : String(r.jenis) === "bahan" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"}`}>
                        {String(r.jenis ?? "-")}
                    </span>
                ),
            },
            { key: "sediaan_id", label: "Sediaan", optionsFor: "sediaan" },
            { key: "satuan_id", label: "Satuan", optionsFor: "satuan" },
            {
                key: "harga_jual",
                label: "Harga Jual",
                render: (r) => <span className="font-medium">{money(r.harga_jual)}</span>,
            },
            { key: "stok", label: "Stok" },
        ],
        fields: [
            { key: "kode_barang", label: "Kode Barang", required: true },
            { key: "nama_barang", label: "Nama Barang", required: true },
            { key: "jenis", label: "Jenis", type: "select", required: true, options: [{ label: "Obat", value: "obat" }, { label: "Bahan", value: "bahan" }, { label: "Alkes", value: "alkes" }] },
            { key: "pabrik_id", label: "Pabrik", type: "select-entity", entity: "pabrik" },
            { key: "sediaan_id", label: "Sediaan", type: "select-entity", entity: "sediaan" },
            { key: "satuan_id", label: "Satuan", type: "select-entity", entity: "satuan" },
            { key: "kelas_terapi_id", label: "Kelas Terapi", type: "select-entity", entity: "kelas-terapi" },
            { key: "harga_modal", label: "Harga Modal", type: "number" },
            { key: "harga_jual", label: "Harga Jual", type: "number" },
            { key: "stok_minimum", label: "Stok Minimum", type: "number" },
            { key: "stok", label: "Stok", type: "number" },
            { key: "keterangan", label: "Keterangan", type: "textarea", full: true },
        ],
    },
    {
        key: "barang-rumah-tangga",
        title: "Barang Rumah Tangga",
        subtitle: "Barang habis pakai non medis",
        endpoint: catalog("barang-rumah-tangga"),
        searchable: ["Kode barang", "Nama barang"],
        columns: [
            { key: "kode_barang", label: "Kode" },
            { key: "nama_barang", label: "Nama Barang" },
            { key: "kategori_barang_id", label: "Kategori", optionsFor: "kategori-barang" },
            { key: "satuan_id", label: "Satuan", optionsFor: "satuan" },
            { key: "harga", label: "Harga", render: (r) => <span className="font-medium">{money(r.harga)}</span> },
            { key: "stok", label: "Stok" },
        ],
        fields: [
            { key: "kode_barang", label: "Kode Barang", required: true },
            { key: "nama_barang", label: "Nama Barang", required: true },
            { key: "kategori_barang_id", label: "Kategori", type: "select-entity", entity: "kategori-barang" },
            { key: "satuan_id", label: "Satuan", type: "select-entity", entity: "satuan" },
            { key: "harga", label: "Harga", type: "number" },
            { key: "stok", label: "Stok", type: "number" },
            { key: "keterangan", label: "Keterangan", type: "textarea", full: true },
        ],
    },
    {
        key: "barang-gizi",
        title: "Barang Gizi",
        subtitle: "Bahan makanan untuk instalasi gizi",
        endpoint: catalog("barang-gizi"),
        searchable: ["Kode barang", "Nama barang"],
        columns: [
            { key: "kode_barang", label: "Kode" },
            { key: "nama_barang", label: "Nama Barang" },
            { key: "satuan_id", label: "Satuan", optionsFor: "satuan" },
            { key: "stok", label: "Stok" },
        ],
        fields: [
            { key: "kode_barang", label: "Kode Barang", required: true },
            { key: "nama_barang", label: "Nama Barang", required: true },
            { key: "satuan_id", label: "Satuan", type: "select-entity", entity: "satuan" },
            { key: "stok", label: "Stok", type: "number" },
            { key: "keterangan", label: "Keterangan", type: "textarea", full: true },
        ],
    },
    {
        key: "kategori-barang",
        title: "Kategori Barang",
        subtitle: "Pengelompokan jenis barang",
        endpoint: catalog("kategori-barang"),
        searchable: ["Nama kategori"],
        columns: [{ key: "nama_kategori", label: "Nama Kategori" }],
        fields: [
            { key: "nama_kategori", label: "Nama Kategori", required: true },
            { key: "keterangan", label: "Keterangan", type: "textarea", full: true },
        ],
    },
    { key: "pabrik", title: "Pabrik", subtitle: "Pabrik / produsen obat dan barang", endpoint: catalog("pabrik"), searchable: ["Nama pabrik", "Kota"], columns: [{ key: "nama_pabrik", label: "Nama Pabrik" }, { key: "kota", label: "Kota" }, { key: "telepon", label: "Telepon" }], fields: [{ key: "nama_pabrik", label: "Nama Pabrik", required: true }, { key: "alamat", label: "Alamat", type: "textarea" }, { key: "telepon", label: "Telepon" }, { key: "kota", label: "Kota" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "sediaan", title: "Sediaan", subtitle: "Bentuk sediaan sediaan obat", endpoint: catalog("sediaan"), searchable: ["Nama"], columns: [{ key: "nama", label: "Sediaan" }, { key: "keterangan", label: "Keterangan" }], fields: [{ key: "nama", label: "Sediaan", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "satuan", title: "Satuan", subtitle: "Satuan unit barang farmasi", endpoint: catalog("satuan"), searchable: ["Nama"], columns: [{ key: "nama", label: "Satuan" }], fields: [{ key: "nama", label: "Satuan", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "kelas-terapi", title: "Kelas Terapi", subtitle: "Pengelompokan kelas terapi obat", endpoint: catalog("kelas-terapi"), searchable: ["Nama"], columns: [{ key: "nama", label: "Kelas Terapi" }], fields: [{ key: "nama", label: "Kelas Terapi", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "signa-obat", title: "Signa Obat", subtitle: "Aturan pakai obat", endpoint: catalog("signa-obat"), searchable: ["Signa"], columns: [{ key: "signa", label: "Signa (Aturan Pakai)" }], fields: [{ key: "signa", label: "Signa", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "template-resep-racikan", title: "Template Resep Racikan", subtitle: "Template racikan obat yang sering diresepkan", endpoint: catalog("template-resep-racikan"), searchable: ["Nama template"], columns: [{ key: "nama_template", label: "Nama Template" }], fields: [{ key: "nama_template", label: "Nama Template", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },

    // ── Pelayanan & Penunjang ──
    { key: "instalasi", title: "Instalasi", subtitle: "Instalasi pelayanan di rumah sakit", endpoint: catalog("instalasi"), searchable: ["Kode", "Nama"], columns: [{ key: "kode", label: "Kode" }, { key: "nama_instalasi", label: "Nama Instalasi" }], fields: [{ key: "kode", label: "Kode" }, { key: "nama_instalasi", label: "Nama Instalasi", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "instansi", title: "Instansi", subtitle: "Instansi eksternal kerja sama", endpoint: catalog("instansi"), searchable: ["Kode", "Nama"], columns: [{ key: "kode", label: "Kode" }, { key: "nama_instansi", label: "Nama Instansi" }, { key: "jenis", label: "Jenis", render: (r) => <span className="capitalize">{String(r.jenis ?? "-")}</span> }, { key: "telepon", label: "Telepon" }], fields: [{ key: "kode", label: "Kode" }, { key: "nama_instansi", label: "Nama Instansi", required: true }, { key: "jenis", label: "Jenis", type: "select", required: true, options: [{ label: "Asuransi", value: "asuransi" }, { label: "Perusahaan", value: "perusahaan" }, { label: "Instansi", value: "instansi" }, { label: "Pribadi", value: "pribadi" }] }, { key: "alamat", label: "Alamat", type: "textarea" }, { key: "telepon", label: "Telepon" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "unit-pegawai", title: "Unit", subtitle: "Unit kerja / poliklinik rumah sakit", endpoint: "/master-data/unit-pegawai", searchable: ["Nama unit"], columns: [{ key: "nama_unit_pegawai", label: "Nama Unit / Poliklinik" }], fields: [{ key: "nama_unit_pegawai", label: "Nama Unit / Poliklinik", required: true }] },
    { key: "kamar", title: "Kamar & Bangsal", subtitle: "Master kamar dan bangsal perawatan", endpoint: "/master-data/kamar", searchable: ["Nama kamar"], columns: [{ key: "nama_kamar", label: "Nama Kamar" }, { key: "kelas", label: "Kelas", render: (r) => <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">{String(r.kelas ?? "-")}</span> }, { key: "jumlah_tempat_tidur", label: "Jumlah Bed" }], fields: [{ key: "nama_kamar", label: "Nama Kamar", required: true }, { key: "kelas", label: "Kelas", type: "select", required: true, options: ["VIP", "VIP B", "I", "II", "III", "ISOLASI", "ICU"].map((v) => ({ label: v, value: v })) }, { key: "jumlah_tempat_tidur", label: "Jumlah Tempat Tidur", type: "number", required: true }, { key: "sub_unit_id", label: "Sub Unit", type: "select-entity", entity: "sub-unit-pegawai", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "bed", title: "Bed", subtitle: "Tempat tidur per kamar", endpoint: catalog("bed"), searchable: ["Nomor bed"], columns: [{ key: "kamar_id", label: "Kamar", optionsFor: "kamar" }, { key: "nomor_bed", label: "Nomor Bed" }, { key: "status", label: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${String(r.status) === "terisi" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{String(r.status ?? "-")}</span> }], fields: [{ key: "kamar_id", label: "Kamar", type: "select-entity", entity: "kamar", required: true }, { key: "nomor_bed", label: "Nomor Bed", required: true }, { key: "status", label: "Status", type: "select", required: true, options: [{ label: "Kosong", value: "kosong" }, { label: "Terisi", value: "terisi" }] }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "paket-mcu", title: "Paket MCU", subtitle: "Paket medical check up", endpoint: catalog("paket-mcu"), searchable: ["Nama paket"], columns: [{ key: "nama_paket", label: "Nama Paket" }, { key: "nominal", label: "Tarif", render: (r) => <span className="font-medium">{money(r.nominal)}</span> }], fields: [{ key: "nama_paket", label: "Nama Paket", required: true }, { key: "nominal", label: "Tarif", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "paket-tindakan", title: "Paket Tindakan", subtitle: "Paket tarif tindakan medis", endpoint: catalog("paket-tindakan"), searchable: ["Nama paket"], columns: [{ key: "nama_paket", label: "Nama Paket" }, { key: "nominal", label: "Tarif", render: (r) => <span className="font-medium">{money(r.nominal)}</span> }], fields: [{ key: "nama_paket", label: "Nama Paket", required: true }, { key: "nominal", label: "Tarif", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "tarif", title: "Tarif", subtitle: "Tarif layanan dan tindakan", endpoint: "/master-data/tarif", searchable: ["Nama tarif"], columns: [{ key: "nama_tarif", label: "Nama Tarif" }, { key: "nominal", label: "Tarif", render: (r) => <span className="font-medium">{money(r.nominal)}</span> }, { key: "keterangan", label: "Keterangan" }], fields: [{ key: "nama_tarif", label: "Nama Tarif", required: true }, { key: "nominal", label: "Nominal", type: "number", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "item-laboratorium", title: "Item Laboratorium", subtitle: "Katalog pemeriksaan laboratorium", endpoint: catalog("item-laboratorium"), searchable: ["Kode item", "Nama pemeriksaan"], columns: [{ key: "kode_item", label: "Kode" }, { key: "nama_pemeriksaan", label: "Nama Pemeriksaan" }, { key: "kategori_nilai_normal_id", label: "Kategori", optionsFor: "kategori-nilai-normal" }, { key: "satuan", label: "Satuan" }, { key: "harga", label: "Tarif", render: (r) => <span className="font-medium">{money(r.harga)}</span> }], fields: [{ key: "kode_item", label: "Kode Item", required: true }, { key: "nama_pemeriksaan", label: "Nama Pemeriksaan", required: true }, { key: "kategori_nilai_normal_id", label: "Kategori Nilai Normal", type: "select-entity", entity: "kategori-nilai-normal" }, { key: "satuan", label: "Satuan" }, { key: "nilai_normal_pria", label: "Nilai Normal Pria" }, { key: "nilai_normal_wanita", label: "Nilai Normal Wanita" }, { key: "harga", label: "Tarif", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "kategori-nilai-normal", title: "Kategori Nilai Normal", subtitle: "Kategori nilai normal pemeriksaan", endpoint: catalog("kategori-nilai-normal"), searchable: ["Nama"], columns: [{ key: "nama", label: "Nama" }, { key: "keterangan", label: "Keterangan" }], fields: [{ key: "nama", label: "Nama", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "icd-x", title: "Diagnosa ICD X", subtitle: "Klasifikasi penyakit ICD-10", endpoint: "/master-data/icd-x", searchable: ["Kode", "Deskripsi"], columns: [{ key: "kode_icd", label: "Kode ICD" }, { key: "deskripsi", label: "Deskripsi" }], fields: [{ key: "kode_icd", label: "Kode ICD", required: true }, { key: "deskripsi", label: "Deskripsi", required: true }] },
    { key: "diagnosa-keperawatan", title: "Diagnosa Keperawatan", subtitle: "Kode dan deskripsi diagnosa keperawatan", endpoint: "/master-data/diagnosa-keperawatan", searchable: ["Kode", "Deskripsi"], columns: [{ key: "kode_diagnosa", label: "Kode" }, { key: "deskripsi_diagnosa", label: "Deskripsi" }], fields: [{ key: "kode_diagnosa", label: "Kode Diagnosa", required: true }, { key: "deskripsi_diagnosa", label: "Deskripsi", type: "textarea", required: true }] },
    { key: "triase-primer", title: "Triase Primer", subtitle: "Kategori triase IGD", endpoint: catalog("triase-primer"), searchable: ["Kode", "Nama"], columns: [{ key: "kode", label: "Kode" }, { key: "nama_triase", label: "Nama Triase" }, { key: "warna", label: "Warna", render: (r) => <span className="inline-flex h-4 w-4 rounded-full border" style={{ background: String(r.warna ?? "") }} /> }], fields: [{ key: "kode", label: "Kode" }, { key: "nama_triase", label: "Nama Triase", required: true }, { key: "warna", label: "Warna", type: "color" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "jadwal-dokter", title: "Jadwal Dokter", subtitle: "Jadwal praktik dokter per poliklinik", endpoint: catalog("jadwal-dokter"), searchable: [], columns: [{ key: "pegawai_id", label: "Dokter", optionsFor: "pegawai" }, { key: "unit_id", label: "Unit", optionsFor: "unit-pegawai" }, { key: "hari", label: "Hari" }, { key: "jam_mulai", label: "Jam Mulai" }, { key: "jam_selesai", label: "Jam Selesai" }, { key: "kuota", label: "Kuota" }], fields: [{ key: "pegawai_id", label: "Dokter", type: "select-entity", entity: "pegawai", required: true }, { key: "unit_id", label: "Unit / Poliklinik", type: "select-entity", entity: "unit-pegawai", required: true }, { key: "hari", label: "Hari", type: "select", required: true, options: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((v) => ({ label: v, value: v })) }, { key: "jam_mulai", label: "Jam Mulai", type: "time" }, { key: "jam_selesai", label: "Jam Selesai", type: "time" }, { key: "kuota", label: "Kuota", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "kuota-poliklinik", title: "Kuota Poliklinik", subtitle: "Kuota pasien per hari poliklinik", endpoint: catalog("kuota-poliklinik"), searchable: [], columns: [{ key: "unit_id", label: "Unit", optionsFor: "unit-pegawai" }, { key: "hari", label: "Hari" }, { key: "waktu", label: "Waktu" }, { key: "kuota", label: "Kuota" }], fields: [{ key: "unit_id", label: "Unit / Poliklinik", type: "select-entity", entity: "unit-pegawai", required: true }, { key: "hari", label: "Hari", type: "select", required: true, options: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((v) => ({ label: v, value: v })) }, { key: "waktu", label: "Waktu", type: "select", options: [{ label: "Pagi", value: "Pagi" }, { label: "Siang", value: "Siang" }, { label: "Sore", value: "Sore" }] }, { key: "kuota", label: "Kuota", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "penjamin", title: "Penjamin", subtitle: "Master penjamin pasien", endpoint: "/master-data/penjamin", searchable: ["Nama penjamin"], columns: [{ key: "nama_penjamin_sistem", label: "Nama Penjamin" }, { key: "kode_penjamin_bpjs", label: "Kode BPJS" }, { key: "status_aktif", label: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${String(r.status_aktif) === "1" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{String(r.status_aktif) === "1" ? "Aktif" : "Nonaktif"}</span> }], fields: [{ key: "nama_penjamin_sistem", label: "Nama Penjamin Sistem", required: true }, { key: "id_jaminan", label: "Data Jaminan", type: "select-entity", entity: "data-jaminan", required: true }, { key: "kode_penjamin_bpjs", label: "Kode BPJS" }, { key: "status_aktif", label: "Status", type: "select", required: true, options: [{ label: "Aktif", value: "1" }, { label: "Nonaktif", value: "0" }] }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },

    // ── Organisasi & SDM ──
    { key: "pegawai", title: "Pegawai", subtitle: "Data pegawai rumah sakit", endpoint: "/master-data/pegawai", searchable: ["Nama pegawai"], columns: [{ key: "nama_pegawai", label: "Nama Pegawai" }, { key: "id_unit_pegawai", label: "Unit", optionsFor: "unit-pegawai" }, { key: "id_sub_unit_pegawai", label: "Sub Unit", optionsFor: "sub-unit-pegawai" }, { key: "jenis_kelamin_pegawai", label: "L/P" }], fields: [] },
    { key: "profesi-nakes", title: "Profesi Tenaga Kesehatan", subtitle: "Daftar profesi tenaga kesehatan", endpoint: catalog("profesi-nakes"), searchable: ["Nama profesi"], columns: [{ key: "nama_profesi", label: "Nama Profesi" }], fields: [{ key: "nama_profesi", label: "Nama Profesi", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "spesialisasi", title: "Spesialisasi", subtitle: "Spesialisasi dokter", endpoint: catalog("spesialisasi"), searchable: ["Nama"], columns: [{ key: "nama_spesialisasi", label: "Nama Spesialisasi" }], fields: [{ key: "nama_spesialisasi", label: "Nama Spesialisasi", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "smf", title: "SMF", subtitle: "Staf Medis Fungsional (SMF)", endpoint: catalog("smf"), searchable: ["Kode", "Nama"], columns: [{ key: "kode_smf", label: "Kode" }, { key: "nama_smf", label: "Nama SMF" }], fields: [{ key: "kode_smf", label: "Kode SMF" }, { key: "nama_smf", label: "Nama SMF", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "supplier", title: "Supplier", subtitle: "Supplier / PBF pengadaan barang", endpoint: catalog("supplier"), searchable: ["Nama supplier", "Kota"], columns: [{ key: "nama_supplier", label: "Nama Supplier" }, { key: "kota", label: "Kota" }, { key: "telepon", label: "Telepon" }], fields: [{ key: "nama_supplier", label: "Nama Supplier", required: true }, { key: "alamat", label: "Alamat", type: "textarea" }, { key: "telepon", label: "Telepon" }, { key: "kota", label: "Kota" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },

    // ── Lainnya ──
    { key: "akun", title: "Rekening / Akun", subtitle: "Master akun (chart of account)", endpoint: "/master-data/akun", searchable: ["Kode", "Nama"], columns: [{ key: "kode_akun", label: "Kode" }, { key: "nama_akun", label: "Nama Akun" }, { key: "tipe_akun", label: "Tipe", render: (r) => <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 capitalize">{String(r.tipe_akun ?? "-")}</span> }], fields: [{ key: "kode_akun", label: "Kode Akun", required: true }, { key: "nama_akun", label: "Nama Akun", required: true }, { key: "tipe_akun", label: "Tipe Akun", type: "select", required: true, options: ["Aset", "Kewajiban", "Modal", "Pendapatan", "Beban"].map((v) => ({ label: v, value: v })) }, { key: "nama_jenis_akun", label: "Nama Jenis Akun", required: true }, { key: "nama_sub_akun", label: "Sub Akun", required: true }, { key: "kategori_laba_rugi", label: "Kategori Laba Rugi", type: "select", options: [{ label: "Operasional", value: "Operasional" }, { label: "Non Operasional", value: "Non Operasional" }] }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "rekening", title: "Rekening", subtitle: "Bagan rekening akuntansi", endpoint: catalog("rekening"), searchable: ["Kode", "Nama"], columns: [{ key: "kode_rekening", label: "Kode" }, { key: "nama_rekening", label: "Nama Rekening" }, { key: "jenis", label: "Jenis", render: (r) => <span className="capitalize">{String(r.jenis ?? "-")}</span> }], fields: [{ key: "kode_rekening", label: "Kode Rekening", required: true }, { key: "nama_rekening", label: "Nama Rekening", required: true }, { key: "jenis", label: "Jenis", type: "select", required: true, options: ["Aset", "Kewajiban", "Modal", "Pendapatan", "Beban"].map((v) => ({ label: v, value: v })) }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "wilayah", title: "Wilayah", subtitle: "Data wilayah administratif", endpoint: catalog("wilayah"), searchable: ["Kode", "Nama"], columns: [{ key: "kode", label: "Kode" }, { key: "nama", label: "Nama Wilayah" }, { key: "tingkat", label: "Tingkat", render: (r) => <span className="capitalize">{String(r.tingkat ?? "-")}</span> }], fields: [{ key: "kode", label: "Kode" }, { key: "nama", label: "Nama Wilayah", required: true }, { key: "tingkat", label: "Tingkat", type: "select", required: true, options: ["provinsi", "kabupaten", "kecamatan", "kelurahan"].map((v) => ({ label: v, value: v })) }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "template-expertise", title: "Template Expertise", subtitle: "Template catatan expertise", endpoint: catalog("template-expertise"), searchable: ["Nama template"], columns: [{ key: "nama_template", label: "Nama Template" }], fields: [{ key: "nama_template", label: "Nama Template", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
];

export function getMasterEntity(key: string): MasterEntity | undefined {
    return masterEntities.find((e) => e.key === key);
}