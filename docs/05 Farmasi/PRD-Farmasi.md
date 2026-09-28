# Product Requirement Document (PRD)

**Nama Fitur/Modul:** SIMRS – Modul Farmasi & Manajemen Obat

**Versi:** 1.0

**Tanggal:** 28 September 2026

**Status:** Draft / Planned Revamp

**File Kode Terkait:** `frontend/app/farmasi/farmasi.tsx`

---

## 1. Ringkasan Eksekutif & Tujuan

Modul **Farmasi & Manajemen Obat** adalah pusat operasional apotek/depo farmasi rumah sakit yang mengelola seluruh siklus obat — mulai dari penerimaan resep elektronik (E-Prescribing), verifikasi dosis & interaksi obat, penyiapan obat, hingga penyerahan ke pasien. Modul ini juga mencakup manajemen stok obat, harga, dan pelaporan penggunaan obat.

**Tujuan Utama:**
- Menyediakan dashboard **Manajemen Farmasi** bergaya kanban dengan status tracking resep secara real-time.
- Menghadirkan fitur **E-Prescribing Receiver** yang menerima resep digital dari modul Pemeriksaan secara instan.
- Mengelola **stok obat** (masuk, keluar, retur, expired, stok opname) dengan alert stok minimum.
- Mengimplementasikan **Clinical Decision Support** untuk validasi alergi, interaksi obat, dan dosis berlebih.
- Menyediakan kalkulasi **obat racikan** (puyer, kapsul, sirup) dengan formulasi bahan aktif.

---

## 2. Target Pengguna (User Personas)

| Persona | Deskripsi | Kebutuhan Utama |
|:---|:---|:---|
| **Apoteker** | Penanggung jawab verifikasi & validasi resep | Verifikasi resep, cek interaksi obat, supervisi penyiapan |
| **Asisten Apoteker (TTK)** | Tenaga teknis kefarmasian | Penyiapan obat, labeling, penyerahan ke pasien |
| **Dokter (DPJP)** | Penulis resep dari modul Pemeriksaan | Mengirim resep, melihat ketersediaan stok obat |
| **Admin Gudang Farmasi** | Petugas inventori obat | Stok masuk, distribusi, retur, stok opname |
| **Kasir** | Petugas pembayaran | Kalkulasi total biaya obat, tagihan pasien |

---

## 3. Fitur Utama & Spesifikasi Fungsional

### 3.1. Dashboard Manajemen Farmasi (Halaman Utama)

* **Deskripsi:** Halaman utama modul farmasi yang menampilkan ringkasan operasional apotek, mengikuti UX **Manajemen Pasien**.
* **Komponen Wajib:**
  * **Banner Header Gradient:** `from-blue-600 via-indigo-600 to-blue-700` sesuai `DESAGIN.md`, dengan judul "Manajemen Farmasi & Depo Obat", deskripsi, dan tombol "Resep Masuk Baru".
  * **Statistik Bar (4 kartu):**
    1. Total Resep Masuk Hari Ini (Slate)
    2. Resep Menunggu Verifikasi (Amber/Kuning)
    3. Sedang Disiapkan (Biru)
    4. Selesai / Sudah Diserahkan (Emerald/Hijau)
  * **Filter Toolbar:** Pencarian nama pasien/obat, filter Depo (Rawat Jalan, Rawat Inap, IGD), filter Status, filter Penjamin.
  * **View Mode Toggle:** Grid Kartu / Tabel / Kanban.

### 3.2. Kanban Status Resep (Alur Kerja Apotek)

* **Deskripsi:** Tampilan kanban 4 kolom status resep:
  1. **Resep Masuk** (Abu-abu/Slate) — Resep baru diterima dari dokter/modul pemeriksaan.
  2. **Verifikasi Apoteker** (Biru) — Apoteker memeriksa dosis, interaksi, alergi.
  3. **Sedang Disiapkan** (Amber) — TTK menyiapkan obat, labeling, packaging.
  4. **Selesai / Diserahkan** (Hijau/Emerald) — Obat sudah diserahkan ke pasien/perawat.
* **Kartu Resep berisi:** No Resep, Nama Pasien, Dokter Penulis, Depo Tujuan, Jumlah Item, Penjamin, Waktu Masuk, Status.
* **Urutan:** Resep terbaru berada di posisi paling **atas**.

### 3.3. Detail Resep & Verifikasi Obat

* **Deskripsi:** Modal detail resep untuk verifikasi dan penyiapan oleh apoteker.
* **Kebutuhan Fungsional:**
  * **Daftar Item Obat:** Tabel nama obat, bentuk sediaan, dosis, signa (aturan pakai), jumlah, satuan, harga satuan, subtotal.
  * **Real-Time Stock Check:** Badge stok tersedia (hijau = cukup, merah = kurang/habis).
  * **Alert Safety:**
    - 🔴 **Alergi Pasien:** Warning jika obat sesuai riwayat alergi pasien.
    - 🟡 **Interaksi Obat:** Warning jika ada Drug-Drug Interaction antar item resep.
    - 🟠 **Dosis Berlebih:** Warning jika dosis melebihi batas standar.
  * **Substitusi Obat:** Saran obat generik alternatif jika obat paten tidak tersedia.
  * **Cetak Etiket/Label:** Tombol cetak label obat per item.

### 3.4. Obat Racikan (Compounding)

* **Deskripsi:** Form khusus untuk menghitung dan mencatat obat racikan.
* **Kebutuhan Fungsional:**
  * **Kalkulasi Bahan Aktif:** Input dosis per bahan, jumlah puyer/kapsul, hitung kebutuhan total bahan.
  * **Aturan Pakai Racikan:** Template signa untuk obat racikan (misal: "3x1 bungkus sehari").
  * **Harga Racikan:** Auto-kalkulasi berdasarkan bahan + jasa racik.

### 3.5. Manajemen Stok Obat & Inventori

* **Deskripsi:** Pengelolaan stok obat di depo/gudang farmasi.
* **Kebutuhan Fungsional:**
  * **Dashboard Stok:** Kartu ringkasan total item, stok minimum alert, obat mendekati expired.
  * **Stok Masuk/Keluar:** Pencatatan penerimaan dari supplier, distribusi antar depo, retur.
  * **Alert Stok Minimum:** Notifikasi otomatis ketika stok obat di bawah batas minimum.
  * **Alert Expired:** Daftar obat yang mendekati/sudah expired (30/60/90 hari).
  * **Stok Opname:** Form stok opname dengan selisih otomatis (stok sistem vs stok fisik).
  * **Kartu Stok:** History pergerakan stok per item obat (masuk, keluar, saldo).

### 3.6. Katalog & Harga Obat

* **Deskripsi:** Master data obat dan harga (dari endpoint `/master-data/tarif`).
* **Kebutuhan Fungsional:**
  * **Tabel Katalog:** Nama obat, kode, bentuk sediaan, satuan, harga beli, harga jual (per penjamin), stok saat ini.
  * **Tambah/Edit/Hapus Obat:** Modal form CRUD sesuai `DESAGIN.md`.
  * **Multi-Harga:** Harga berbeda per jenis penjamin (BPJS, Umum, Asuransi).
  * **Import/Export:** Import data obat dari file Excel/CSV.

### 3.7. Penjualan Bebas (OTC / Over-the-Counter)

* **Deskripsi:** Penjualan obat tanpa resep dokter langsung di apotek.
* **Kebutuhan Fungsional:**
  * **Form Penjualan Cepat:** Input nama obat (autocomplete), jumlah, kalkulasi total.
  * **Cetak Struk:** Cetak struk penjualan bebas.

---

## 4. Persyaratan Non-Fungsional

### 4.1. UI/UX (sesuai `DESAGIN.md`)

| Aspek | Standar |
|:---|:---|
| **Banner Header** | `bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl` |
| **Status Warna** | Resep Masuk = Slate, Verifikasi = Blue, Disiapkan = Amber, Diserahkan = Emerald |
| **Alert Alergi** | `bg-rose-500 text-white` |
| **Alert Interaksi** | `bg-amber-100 text-amber-700 border-amber-200` |
| **Stok Cukup** | `bg-emerald-100 text-emerald-700` |
| **Stok Habis** | `bg-rose-100 text-rose-700` |
| **Card Container** | `bg-white border border-slate-200/60 rounded-2xl shadow-2xs` |

### 4.2. Performa

* Waktu muat daftar resep ≤ 1 detik.
* Pencarian obat autocomplete ≤ 300ms.
* Kalkulasi harga racikan real-time tanpa delay.
* Sinkronisasi stok real-time antar depo.

### 4.3. Keamanan

* **RBAC:** Hanya Apoteker yang bisa memverifikasi resep. TTK hanya bisa menyiapkan.
* **Audit Trail:** Setiap perubahan stok dan verifikasi resep tercatat.
* **Digital Signature:** Verifikasi apoteker pada setiap resep yang diserahkan.

---

## 5. Alur Kerja Utama (User Flow)

### Flow 1: Resep dari Dokter (E-Prescribing)
```
1. Dokter submit resep dari modul Pemeriksaan
2. Resep masuk → Kolom "Resep Masuk" di dashboard Farmasi
3. Apoteker klik "Verifikasi" → Cek dosis, interaksi, alergi, stok
4. Jika OK → Pindah ke "Sedang Disiapkan"
5. TTK siapkan obat → Labeling → Klik "Selesai"
6. Pasien/perawat menerima obat → Status "Diserahkan"
7. Data mengalir ke → Billing / Kasir
```

### Flow 2: Manajemen Stok
```
1. Penerimaan barang dari supplier → Input stok masuk
2. Distribusi ke depo unit → Input stok keluar
3. Cek stok minimum → Auto-alert jika di bawah batas
4. Stok opname periodik → Selisih otomatis
5. Retur barang → Pencatatan retur ke gudang/supplier
```

---

## 6. Indikator Keberhasilan (KPI)

1. **Waktu Layanan Resep:** Rata-rata waktu dari resep masuk → obat diserahkan ≤ 15 menit (rawat jalan).
2. **Zero Dispensing Error:** 0% kesalahan penyerahan obat berkat verifikasi digital.
3. **Akurasi Stok:** Selisih stok opname ≤ 1% dari total item.
4. **Adopsi Digital:** 100% resep diproses via E-Prescribing (0 resep kertas).
5. **Alert Response:** 100% alert alergi/interaksi ditangani sebelum penyerahan.

---

## 7. Integrasi dengan Modul Lain

| Modul | Jenis Integrasi |
|:---|:---|
| **Pemeriksaan** | Menerima resep E-Prescribing dari SOAP (Plan) |
| **Rawat Inap** | Resep rawat inap & distribusi obat ke bangsal |
| **Antrean / Pendaftaran** | Antrean pengambilan obat di loket farmasi |
| **Billing / Kasir** | Total biaya obat dikirim ke tagihan pasien |
| **Laporan** | Data penggunaan obat, stok, expired untuk laporan |
| **Master Data** | Katalog obat, supplier, depo farmasi |

---

## 8. Referensi Kode Saat Ini (Sebelum Revamp)

**File:** `frontend/app/farmasi/farmasi.tsx`

**Status saat ini:** Halaman sederhana yang hanya menampilkan daftar tarif obat dari endpoint `/master-data/tarif` menggunakan komponen `ResourcePage` generik dengan layout `ObatPriceList`. Belum ada fitur kanban resep, verifikasi apoteker, stok management, alert keselamatan, atau dashboard statistik.

**Rencana Revamp:** Revisi total menjadi halaman **Manajemen Farmasi** dengan UX seperti tab Manajemen Pasien (banner, statistik, kanban alur resep, filter, modal CRUD, stok dashboard).
