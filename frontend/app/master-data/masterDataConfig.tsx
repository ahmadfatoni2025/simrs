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
    category?: "farmasi" | "pelayanan" | "pendaftaran" | "sdm" | "keuangan" | "lainnya";
    endpoint: string;
    searchable?: string[];
    columns: MasterColumn[];
    fields: MasterField[];
}

export const money = (value: unknown): string =>
    "Rp " + Number(value ?? 0).toLocaleString("id-ID");

const catalog = (entity: string) => `/master-data/catalog/${entity}`;

export const masterEntities: MasterEntity[] = [
    // ── Farmasi & Logistik (Ref: Inventory.md, Back Office.md, materdata.md) ──
    {
        key: "barang-farmasi",
        title: "Barang Farmasi",
        subtitle: "Katalog obat, bahan dan alat kesehatan farmasi",
        category: "farmasi",
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
            { key: "golongan_id", label: "Golongan Obat", type: "select-entity", entity: "golongan-obat" },
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
        subtitle: "Barang habis pakai non medis & logistik umum",
        category: "farmasi",
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
        subtitle: "Bahan makanan & konsumsi untuk instalasi gizi",
        category: "farmasi",
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
        subtitle: "Pengelompokan jenis barang & komoditas",
        category: "farmasi",
        endpoint: catalog("kategori-barang"),
        searchable: ["Nama kategori"],
        columns: [{ key: "nama_kategori", label: "Nama Kategori" }],
        fields: [
            { key: "nama_kategori", label: "Nama Kategori", required: true },
            { key: "keterangan", label: "Keterangan", type: "textarea", full: true },
        ],
    },
    {
        key: "golongan-obat",
        title: "Golongan Obat",
        subtitle: "Klasifikasi obat (Generik, Fornas, Psikotropika, Narkotika, Katastropik)",
        category: "farmasi",
        endpoint: catalog("golongan-obat"),
        searchable: ["Nama golongan"],
        columns: [{ key: "nama_golongan", label: "Nama Golongan" }, { key: "kategori", label: "Kategori" }],
        fields: [
            { key: "nama_golongan", label: "Nama Golongan", required: true },
            { key: "kategori", label: "Kategori", type: "select", options: [{ label: "Generik", value: "Generik" }, { label: "Fornas", value: "Fornas" }, { label: "Psikotropika/Narkotika", value: "Psikotropika/Narkotika" }, { label: "Katastropik", value: "Katastropik" }, { label: "Bebas", value: "Bebas" }] },
            { key: "keterangan", label: "Keterangan", type: "textarea", full: true },
        ],
    },
    {
        key: "gudang",
        title: "Gudang & Depo",
        subtitle: "Master lokasi gudang farmasi, depo, dan gizi",
        category: "farmasi",
        endpoint: catalog("gudang"),
        searchable: ["Kode gudang", "Nama gudang"],
        columns: [{ key: "kode_gudang", label: "Kode" }, { key: "nama_gudang", label: "Nama Gudang" }, { key: "jenis", label: "Jenis Gudang" }],
        fields: [
            { key: "kode_gudang", label: "Kode Gudang", required: true },
            { key: "nama_gudang", label: "Nama Gudang", required: true },
            { key: "jenis", label: "Jenis Gudang", type: "select", options: [{ label: "Gudang Utama Farmasi", value: "Farmasi Utama" }, { label: "Depo Rawat Jalan", value: "Depo Rawat Jalan" }, { label: "Depo Rawat Inap", value: "Depo Rawat Inap" }, { label: "Depo IGD", value: "Depo IGD" }, { label: "Gudang Logistik", value: "Logistik" }, { label: "Gudang Gizi", value: "Gizi" }] },
            { key: "lokasi", label: "Lokasi / Gedung" },
            { key: "keterangan", label: "Keterangan", type: "textarea", full: true },
        ],
    },
    { key: "pabrik", title: "Pabrik / Produsen", subtitle: "Pabrik produsen obat dan alat kesehatan", category: "farmasi", endpoint: catalog("pabrik"), searchable: ["Nama pabrik", "Kota"], columns: [{ key: "nama_pabrik", label: "Nama Pabrik" }, { key: "kota", label: "Kota" }, { key: "telepon", label: "Telepon" }], fields: [{ key: "nama_pabrik", label: "Nama Pabrik", required: true }, { key: "alamat", label: "Alamat", type: "textarea" }, { key: "telepon", label: "Telepon" }, { key: "kota", label: "Kota" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "sediaan", title: "Sediaan Obat", subtitle: "Bentuk sediaan obat (Tablet, Sirup, Injeksi, Kapsul)", category: "farmasi", endpoint: catalog("sediaan"), searchable: ["Nama"], columns: [{ key: "nama", label: "Sediaan" }, { key: "keterangan", label: "Keterangan" }], fields: [{ key: "nama", label: "Sediaan", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "satuan", title: "Satuan Ukur", subtitle: "Satuan unit barang farmasi & logistik", category: "farmasi", endpoint: catalog("satuan"), searchable: ["Nama"], columns: [{ key: "nama", label: "Satuan" }], fields: [{ key: "nama", label: "Satuan", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "kelas-terapi", title: "Kelas Terapi", subtitle: "Pengelompokan kelas terapi farmakologi obat", category: "farmasi", endpoint: catalog("kelas-terapi"), searchable: ["Nama"], columns: [{ key: "nama", label: "Kelas Terapi" }], fields: [{ key: "nama", label: "Kelas Terapi", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "signa-obat", title: "Signa Obat", subtitle: "Master aturan pakai obat (3x1, 2x1 prn, dll)", category: "farmasi", endpoint: catalog("signa-obat"), searchable: ["Signa"], columns: [{ key: "signa", label: "Signa (Aturan Pakai)" }], fields: [{ key: "signa", label: "Signa", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "template-resep-racikan", title: "Template Resep Racikan", subtitle: "Template racikan obat standar dokter", category: "farmasi", endpoint: catalog("template-resep-racikan"), searchable: ["Nama template"], columns: [{ key: "nama_template", label: "Nama Template" }], fields: [{ key: "nama_template", label: "Nama Template", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },

    // ── Pelayanan, Medis & Penunjang (Ref: Pelayanan.md, Penunjang.md, materdata.md) ──
    { key: "instalasi", title: "Instalasi RS", subtitle: "Master instalasi pelayanan gedung rumah sakit", category: "pelayanan", endpoint: catalog("instalasi"), searchable: ["Kode", "Nama"], columns: [{ key: "kode", label: "Kode" }, { key: "nama_instalasi", label: "Nama Instalasi" }], fields: [{ key: "kode", label: "Kode" }, { key: "nama_instalasi", label: "Nama Instalasi", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "unit-pegawai", title: "Unit & Poliklinik", subtitle: "Unit kerja & poli pelayanan rawat jalan/inap", category: "pelayanan", endpoint: "/master-data/unit-pegawai", searchable: ["Nama unit"], columns: [{ key: "nama_unit_pegawai", label: "Nama Unit / Poliklinik" }], fields: [{ key: "nama_unit_pegawai", label: "Nama Unit / Poliklinik", required: true }] },
    { key: "kamar", title: "Kamar & Bangsal", subtitle: "Master kamar rawat inap dan bangsal perawatan", category: "pelayanan", endpoint: "/master-data/kamar", searchable: ["Nama kamar"], columns: [{ key: "nama_kamar", label: "Nama Kamar" }, { key: "kelas", label: "Kelas", render: (r) => <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">{String(r.kelas ?? "-")}</span> }, { key: "jumlah_tempat_tidur", label: "Jumlah Bed" }], fields: [{ key: "nama_kamar", label: "Nama Kamar", required: true }, { key: "kelas", label: "Kelas", type: "select", required: true, options: ["VIP", "VIP B", "I", "II", "III", "ISOLASI", "ICU", "NICU", "PICU"].map((v) => ({ label: v, value: v })) }, { key: "jumlah_tempat_tidur", label: "Jumlah Tempat Tidur", type: "number", required: true }, { key: "sub_unit_id", label: "Sub Unit", type: "select-entity", entity: "sub-unit-pegawai", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "bed", title: "Bed Perawatan", subtitle: "Tempat tidur pasien per kamar rawat inap", category: "pelayanan", endpoint: catalog("bed"), searchable: ["Nomor bed"], columns: [{ key: "kamar_id", label: "Kamar", optionsFor: "kamar" }, { key: "nomor_bed", label: "Nomor Bed" }, { key: "status", label: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${String(r.status) === "terisi" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{String(r.status ?? "-")}</span> }], fields: [{ key: "kamar_id", label: "Kamar", type: "select-entity", entity: "kamar", required: true }, { key: "nomor_bed", label: "Nomor Bed", required: true }, { key: "status", label: "Status", type: "select", required: true, options: [{ label: "Kosong", value: "kosong" }, { label: "Terisi", value: "terisi" }] }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "tarif", title: "Tarif Layanan", subtitle: "Master tarif tindakan medis & pelayanan RS", category: "pelayanan", endpoint: "/master-data/tarif", searchable: ["Nama tarif"], columns: [{ key: "nama_tarif", label: "Nama Tarif" }, { key: "nominal", label: "Tarif", render: (r) => <span className="font-medium">{money(r.nominal)}</span> }, { key: "keterangan", label: "Keterangan" }], fields: [{ key: "nama_tarif", label: "Nama Tarif", required: true }, { key: "nominal", label: "Nominal", type: "number", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "paket-mcu", title: "Paket MCU", subtitle: "Paket medical check up terpadu", category: "pelayanan", endpoint: catalog("paket-mcu"), searchable: ["Nama paket"], columns: [{ key: "nama_paket", label: "Nama Paket" }, { key: "nominal", label: "Tarif", render: (r) => <span className="font-medium">{money(r.nominal)}</span> }], fields: [{ key: "nama_paket", label: "Nama Paket", required: true }, { key: "nominal", label: "Tarif", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "paket-tindakan", title: "Paket Tindakan", subtitle: "Paket bundling tindakan operasi & medis", category: "pelayanan", endpoint: catalog("paket-tindakan"), searchable: ["Nama paket"], columns: [{ key: "nama_paket", label: "Nama Paket" }, { key: "nominal", label: "Tarif", render: (r) => <span className="font-medium">{money(r.nominal)}</span> }], fields: [{ key: "nama_paket", label: "Nama Paket", required: true }, { key: "nominal", label: "Tarif", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "item-laboratorium", title: "Item Laboratorium", subtitle: "Katalog pemeriksaan laboratorium & patologi", category: "pelayanan", endpoint: catalog("item-laboratorium"), searchable: ["Kode item", "Nama pemeriksaan"], columns: [{ key: "kode_item", label: "Kode" }, { key: "nama_pemeriksaan", label: "Nama Pemeriksaan" }, { key: "kategori_nilai_normal_id", label: "Kategori", optionsFor: "kategori-nilai-normal" }, { key: "satuan", label: "Satuan" }, { key: "harga", label: "Tarif", render: (r) => <span className="font-medium">{money(r.harga)}</span> }], fields: [{ key: "kode_item", label: "Kode Item", required: true }, { key: "nama_pemeriksaan", label: "Nama Pemeriksaan", required: true }, { key: "kategori_nilai_normal_id", label: "Kategori Nilai Normal", type: "select-entity", entity: "kategori-nilai-normal" }, { key: "satuan", label: "Satuan" }, { key: "nilai_normal_pria", label: "Nilai Normal Pria" }, { key: "nilai_normal_wanita", label: "Nilai Normal Wanita" }, { key: "harga", label: "Tarif", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "kategori-nilai-normal", title: "Nilai Normal Lab", subtitle: "Kategori rujukan nilai normal laboratorium", category: "pelayanan", endpoint: catalog("kategori-nilai-normal"), searchable: ["Nama"], columns: [{ key: "nama", label: "Nama" }, { key: "keterangan", label: "Keterangan" }], fields: [{ key: "nama", label: "Nama", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "master-radiologi", title: "Master Radiologi", subtitle: "Katalog pemeriksaan rontgen, USG, CT-Scan & MRI", category: "pelayanan", endpoint: catalog("master-radiologi"), searchable: ["Kode", "Nama"], columns: [{ key: "kode_radiologi", label: "Kode" }, { key: "nama_pemeriksaan", label: "Nama Pemeriksaan" }, { key: "harga", label: "Tarif", render: (r) => <span className="font-medium">{money(r.harga)}</span> }], fields: [{ key: "kode_radiologi", label: "Kode Radiologi", required: true }, { key: "nama_pemeriksaan", label: "Nama Pemeriksaan", required: true }, { key: "modilitas", label: "Modaliatasis (X-Ray/USG/CT)", type: "select", options: [{ label: "X-Ray / Rontgen", value: "X-Ray" }, { label: "USG", value: "USG" }, { label: "CT-Scan", value: "CT-Scan" }, { label: "MRI", value: "MRI" }, { label: "Mammografi", value: "Mammografi" }] }, { key: "harga", label: "Tarif", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "master-operasi", title: "Master Operasi", subtitle: "Katalog tindakan pembedahan & operasi IBS", category: "pelayanan", endpoint: catalog("master-operasi"), searchable: ["Kode", "Nama"], columns: [{ key: "kode_operasi", label: "Kode" }, { key: "nama_operasi", label: "Nama Operasi" }, { key: "kategori", label: "Kategori" }, { key: "harga", label: "Tarif", render: (r) => <span className="font-medium">{money(r.harga)}</span> }], fields: [{ key: "kode_operasi", label: "Kode Operasi", required: true }, { key: "nama_operasi", label: "Nama Operasi", required: true }, { key: "kategori", label: "Kategori Operasi", type: "select", options: [{ label: "Kecil", value: "Kecil" }, { label: "Sedang", value: "Sedang" }, { label: "Besar", value: "Besar" }, { label: "Khusus", value: "Khusus" }] }, { key: "harga", label: "Tarif Base", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "rehab-medik", title: "Rehabilitasi Medik", subtitle: "Katalog tindakan terapi fisik & rehabilitasi", category: "pelayanan", endpoint: catalog("rehab-medik"), searchable: ["Nama tindakan"], columns: [{ key: "nama_tindakan", label: "Nama Tindakan" }, { key: "harga", label: "Tarif", render: (r) => <span className="font-medium">{money(r.harga)}</span> }], fields: [{ key: "nama_tindakan", label: "Nama Tindakan", required: true }, { key: "harga", label: "Tarif", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "psikometri", title: "Pemeriksaan Psikometri", subtitle: "Master pengujian tes psikologi & kejiwaan", category: "pelayanan", endpoint: catalog("psikometri"), searchable: ["Nama tes"], columns: [{ key: "nama_tes", label: "Nama Tes Psikometri" }, { key: "harga", label: "Tarif", render: (r) => <span className="font-medium">{money(r.harga)}</span> }], fields: [{ key: "nama_tes", label: "Nama Tes Psikometri", required: true }, { key: "harga", label: "Tarif", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "triase-primer", title: "Triase Primer", subtitle: "Kategori tingkat kegawatan triase IGD", category: "pelayanan", endpoint: catalog("triase-primer"), searchable: ["Kode", "Nama"], columns: [{ key: "kode", label: "Kode" }, { key: "nama_triase", label: "Nama Triase" }, { key: "warna", label: "Warna", render: (r) => <span className="inline-flex h-4 w-4 rounded-full border" style={{ background: String(r.warna ?? "") }} /> }], fields: [{ key: "kode", label: "Kode" }, { key: "nama_triase", label: "Nama Triase", required: true }, { key: "warna", label: "Warna Kode Triase", type: "color" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "template-expertise", title: "Template Expertise", subtitle: "Template catatan hasil ekspertese radiologi/lab", category: "pelayanan", endpoint: catalog("template-expertise"), searchable: ["Nama template"], columns: [{ key: "nama_template", label: "Nama Template" }], fields: [{ key: "nama_template", label: "Nama Template", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },

    // ── Pendaftaran & Pasien (Ref: Pendaftaran.md, materdata.md) ──
    { key: "data-induk-pasien", title: "Data Induk Pasien", subtitle: "Master rekam medis & data pasien terdaftar", category: "pendaftaran", endpoint: catalog("data-induk-pasien"), searchable: ["No RM", "Nama Pasien", "NIK"], columns: [{ key: "no_rm", label: "No. RM" }, { key: "nama_pasien", label: "Nama Pasien" }, { key: "nik", label: "NIK" }, { key: "jenis_kelamin", label: "L/P" }, { key: "telepon", label: "No. HP" }], fields: [{ key: "no_rm", label: "No. Rekam Medis", required: true }, { key: "nama_pasien", label: "Nama Pasien", required: true }, { key: "nik", label: "NIK / No. KTP", required: true }, { key: "jenis_kelamin", label: "Jenis Kelamin", type: "select", required: true, options: [{ label: "Laki-laki", value: "L" }, { label: "Perempuan", value: "P" }] }, { key: "tanggal_lahir", label: "Tanggal Lahir", type: "date" }, { key: "alamat", label: "Alamat", type: "textarea", full: true }, { key: "telepon", label: "No. Telepon / HP" }] },
    { key: "penjamin", title: "Penjamin Pasien", subtitle: "Master penjamin bayar (BPJS, Umum, Asuransi)", category: "pendaftaran", endpoint: "/master-data/penjamin", searchable: ["Nama penjamin"], columns: [{ key: "nama_penjamin_sistem", label: "Nama Penjamin" }, { key: "kode_penjamin_bpjs", label: "Kode BPJS" }, { key: "status_aktif", label: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${String(r.status_aktif) === "1" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{String(r.status_aktif) === "1" ? "Aktif" : "Nonaktif"}</span> }], fields: [{ key: "nama_penjamin_sistem", label: "Nama Penjamin Sistem", required: true }, { key: "id_jaminan", label: "Data Jaminan", type: "select-entity", entity: "data-jaminan", required: true }, { key: "kode_penjamin_bpjs", label: "Kode BPJS" }, { key: "status_aktif", label: "Status", type: "select", required: true, options: [{ label: "Aktif", value: "1" }, { label: "Nonaktif", value: "0" }] }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "instansi", title: "Instansi Kerja Sama", subtitle: "Perusahaan & instansi penjamin mitra RS", category: "pendaftaran", endpoint: catalog("instansi"), searchable: ["Kode", "Nama"], columns: [{ key: "kode", label: "Kode" }, { key: "nama_instansi", label: "Nama Instansi" }, { key: "jenis", label: "Jenis", render: (r) => <span className="capitalize">{String(r.jenis ?? "-")}</span> }, { key: "telepon", label: "Telepon" }], fields: [{ key: "kode", label: "Kode" }, { key: "nama_instansi", label: "Nama Instansi", required: true }, { key: "jenis", label: "Jenis", type: "select", required: true, options: [{ label: "Asuransi Swasta", value: "asuransi" }, { label: "Perusahaan Mitra", value: "perusahaan" }, { label: "Instansi Pemerintah", value: "instansi" }] }, { key: "alamat", label: "Alamat", type: "textarea" }, { key: "telepon", label: "Telepon" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "jadwal-dokter", title: "Jadwal Dokter", subtitle: "Master jam praktik dokter poliklinik", category: "pendaftaran", endpoint: catalog("jadwal-dokter"), searchable: [], columns: [{ key: "pegawai_id", label: "Dokter", optionsFor: "pegawai" }, { key: "unit_id", label: "Unit", optionsFor: "unit-pegawai" }, { key: "hari", label: "Hari" }, { key: "jam_mulai", label: "Jam Mulai" }, { key: "jam_selesai", label: "Jam Selesai" }, { key: "kuota", label: "Kuota" }], fields: [{ key: "pegawai_id", label: "Dokter", type: "select-entity", entity: "pegawai", required: true }, { key: "unit_id", label: "Unit / Poliklinik", type: "select-entity", entity: "unit-pegawai", required: true }, { key: "hari", label: "Hari", type: "select", required: true, options: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((v) => ({ label: v, value: v })) }, { key: "jam_mulai", label: "Jam Mulai", type: "time" }, { key: "jam_selesai", label: "Jam Selesai", type: "time" }, { key: "kuota", label: "Kuota Pasien", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "kuota-poliklinik", title: "Kuota Poliklinik", subtitle: "Batas kuota harian pendaftaran poliklinik", category: "pendaftaran", endpoint: catalog("kuota-poliklinik"), searchable: [], columns: [{ key: "unit_id", label: "Unit", optionsFor: "unit-pegawai" }, { key: "hari", label: "Hari" }, { key: "waktu", label: "Waktu" }, { key: "kuota", label: "Kuota" }], fields: [{ key: "unit_id", label: "Unit / Poliklinik", type: "select-entity", entity: "unit-pegawai", required: true }, { key: "hari", label: "Hari", type: "select", required: true, options: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((v) => ({ label: v, value: v })) }, { key: "waktu", label: "Shift Waktu", type: "select", options: [{ label: "Pagi", value: "Pagi" }, { label: "Siang", value: "Siang" }, { label: "Sore", value: "Sore" }] }, { key: "kuota", label: "Batas Kuota", type: "number" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },

    // ── Klinis, Diagnosa & Wilayah (Ref: materdata.md) ──
    { key: "icd-x", title: "Diagnosa ICD-10", subtitle: "Klasifikasi standar internasional penyakit ICD-10", category: "lainnya", endpoint: "/master-data/icd-x", searchable: ["Kode", "Deskripsi"], columns: [{ key: "kode_icd", label: "Kode ICD" }, { key: "deskripsi", label: "Deskripsi Penyakit" }], fields: [{ key: "kode_icd", label: "Kode ICD-10", required: true }, { key: "deskripsi", label: "Deskripsi Penyakit", required: true }] },
    { key: "icd-o", title: "Diagnosa ICD-O", subtitle: "Klasifikasi internasional penyakit onkologi/kanker", category: "lainnya", endpoint: catalog("icd-o"), searchable: ["Kode", "Deskripsi"], columns: [{ key: "kode_icdo", label: "Kode ICD-O" }, { key: "deskripsi", label: "Deskripsi Onkologi" }], fields: [{ key: "kode_icdo", label: "Kode ICD-O", required: true }, { key: "deskripsi", label: "Deskripsi Onkologi", required: true }] },
    { key: "diagnosa-keperawatan", title: "Diagnosa Keperawatan", subtitle: "Standard SDKI / NANDA diagnosa keperawatan", category: "lainnya", endpoint: "/master-data/diagnosa-keperawatan", searchable: ["Kode", "Deskripsi"], columns: [{ key: "kode_diagnosa", label: "Kode" }, { key: "deskripsi_diagnosa", label: "Deskripsi Diagnosa" }], fields: [{ key: "kode_diagnosa", label: "Kode Diagnosa", required: true }, { key: "deskripsi_diagnosa", label: "Deskripsi Keperawatan", type: "textarea", required: true }] },
    { key: "wilayah", title: "Wilayah Wilayah RS", subtitle: "Data wilayah administratif (Provinsi, Kab, Kec, Kel)", category: "lainnya", endpoint: catalog("wilayah"), searchable: ["Kode", "Nama"], columns: [{ key: "kode", label: "Kode" }, { key: "nama", label: "Nama Wilayah" }, { key: "tingkat", label: "Tingkat", render: (r) => <span className="capitalize font-semibold">{String(r.tingkat ?? "-")}</span> }], fields: [{ key: "kode", label: "Kode Wilayah" }, { key: "nama", label: "Nama Wilayah", required: true }, { key: "tingkat", label: "Tingkat", type: "select", required: true, options: ["provinsi", "kabupaten", "kecamatan", "kelurahan"].map((v) => ({ label: v, value: v })) }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },

    // ── SDM & Organisasi (Ref: materdata.md) ──
    {
        key: "pegawai",
        title: "Pegawai & Tenaga Kesehatan",
        subtitle: "Data induk pegawai, dokter, perawat, dan staf RS",
        category: "sdm",
        endpoint: "/master-data/pegawai",
        searchable: ["Nama pegawai", "NIP"],
        columns: [
            { key: "nip", label: "NIP / NIK" },
            { key: "nama_pegawai", label: "Nama Pegawai" },
            { key: "id_unit_pegawai", label: "Unit / Poli", optionsFor: "unit-pegawai" },
            { key: "jenis_kelamin_pegawai", label: "L/P" },
            { key: "telepon", label: "Telepon" },
        ],
        fields: [
            { key: "nip", label: "NIP / NIK Pegawai", required: true },
            { key: "nama_pegawai", label: "Nama Lengkap Pegawai", required: true },
            { key: "gelar_depan", label: "Gelar Depan" },
            { key: "gelar_belakang", label: "Gelar Belakang" },
            { key: "jenis_kelamin_pegawai", label: "Jenis Kelamin", type: "select", required: true, options: [{ label: "Laki-laki", value: "L" }, { label: "Perempuan", value: "P" }] },
            { key: "id_unit_pegawai", label: "Unit / Poliklinik", type: "select-entity", entity: "unit-pegawai", required: true },
            { key: "profesi_id", label: "Profesi Nakes", type: "select-entity", entity: "profesi-nakes" },
            { key: "smf_id", label: "SMF", type: "select-entity", entity: "smf" },
            { key: "spesialisasi_id", label: "Spesialisasi Dokter", type: "select-entity", entity: "spesialisasi" },
            { key: "telepon", label: "No. Telepon / HP" },
            { key: "email", label: "Email" },
            { key: "status", label: "Status Pegawai", type: "select", options: [{ label: "Aktif", value: "Aktif" }, { label: "Nonaktif", value: "Nonaktif" }] },
        ],
    },
    { key: "profesi-nakes", title: "Profesi Nakes", subtitle: "Daftar kategori profesi tenaga kesehatan", category: "sdm", endpoint: catalog("profesi-nakes"), searchable: ["Nama profesi"], columns: [{ key: "nama_profesi", label: "Nama Profesi" }], fields: [{ key: "nama_profesi", label: "Nama Profesi", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "spesialisasi", title: "Spesialisasi Dokter", subtitle: "Sub-spesialisasi ilmu kedokteran", category: "sdm", endpoint: catalog("spesialisasi"), searchable: ["Nama"], columns: [{ key: "nama_spesialisasi", label: "Nama Spesialisasi" }], fields: [{ key: "nama_spesialisasi", label: "Nama Spesialisasi", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "smf", title: "SMF (Staf Medis)", subtitle: "Staf Medis Fungsional kelompok dokter", category: "sdm", endpoint: catalog("smf"), searchable: ["Kode", "Nama"], columns: [{ key: "kode_smf", label: "Kode" }, { key: "nama_smf", label: "Nama SMF" }], fields: [{ key: "kode_smf", label: "Kode SMF" }, { key: "nama_smf", label: "Nama SMF", required: true }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "supplier", title: "Supplier & PBF", subtitle: "Vendor / PBF penyedia barang farmasi & logistik", category: "sdm", endpoint: catalog("supplier"), searchable: ["Nama supplier", "Kota"], columns: [{ key: "nama_supplier", label: "Nama Supplier" }, { key: "kota", label: "Kota" }, { key: "telepon", label: "Telepon" }], fields: [{ key: "nama_supplier", label: "Nama Supplier", required: true }, { key: "alamat", label: "Alamat", type: "textarea" }, { key: "telepon", label: "Telepon" }, { key: "kota", label: "Kota" }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },

    // ── Keuangan & Akuntansi (Ref: Kasir.md, Akuntansi.md) ──
    { key: "akun", title: "Rekening / COA", subtitle: "Chart of Accounts (Bagan Akun Standar RS)", category: "keuangan", endpoint: "/master-data/akun", searchable: ["Kode", "Nama"], columns: [{ key: "kode_akun", label: "Kode" }, { key: "nama_akun", label: "Nama Akun" }, { key: "tipe_akun", label: "Tipe", render: (r) => <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 capitalize">{String(r.tipe_akun ?? "-")}</span> }], fields: [{ key: "kode_akun", label: "Kode Akun", required: true }, { key: "nama_akun", label: "Nama Akun", required: true }, { key: "tipe_akun", label: "Tipe Akun", type: "select", required: true, options: ["Aset", "Kewajiban", "Modal", "Pendapatan", "Beban"].map((v) => ({ label: v, value: v })) }, { key: "nama_jenis_akun", label: "Nama Jenis Akun", required: true }, { key: "nama_sub_akun", label: "Sub Akun", required: true }, { key: "kategori_laba_rugi", label: "Kategori Laba Rugi", type: "select", options: [{ label: "Operasional", value: "Operasional" }, { label: "Non Operasional", value: "Non Operasional" }] }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "rekening", title: "Bagan Rekening", subtitle: "Daftar rekening buku besar akuntansi", category: "keuangan", endpoint: catalog("rekening"), searchable: ["Kode", "Nama"], columns: [{ key: "kode_rekening", label: "Kode" }, { key: "nama_rekening", label: "Nama Rekening" }, { key: "jenis", label: "Jenis", render: (r) => <span className="capitalize font-medium">{String(r.jenis ?? "-")}</span> }], fields: [{ key: "kode_rekening", label: "Kode Rekening", required: true }, { key: "nama_rekening", label: "Nama Rekening", required: true }, { key: "jenis", label: "Jenis", type: "select", required: true, options: ["Aset", "Kewajiban", "Modal", "Pendapatan", "Beban"].map((v) => ({ label: v, value: v })) }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
    { key: "metode-pembayaran", title: "Metode Pembayaran", subtitle: "Kanal pembayaran kasir (Tunai, EDC, QRIS, Transfer)", category: "keuangan", endpoint: catalog("metode-pembayaran"), searchable: ["Nama metode"], columns: [{ key: "nama_metode", label: "Nama Metode" }, { key: "jenis", label: "Jenis" }], fields: [{ key: "nama_metode", label: "Nama Metode Pembayaran", required: true }, { key: "jenis", label: "Jenis", type: "select", required: true, options: [{ label: "Tunai", value: "Tunai" }, { label: "Debit / Kartu Kredit", value: "EDC" }, { label: "QRIS", value: "QRIS" }, { label: "Transfer Bank", value: "Transfer" }, { label: "Deposit Pasien", value: "Deposit" }] }, { key: "keterangan", label: "Keterangan", type: "textarea", full: true }] },
];

export function getMasterEntity(key: string): MasterEntity | undefined {
    return masterEntities.find((e) => e.key === key);
}