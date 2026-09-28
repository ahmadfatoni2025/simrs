# Product Requirement Document (PRD)

**Nama Fitur/Modul:** SIMRS – Modul Laporan & Analitik Rumah Sakit

**Versi:** 1.0

**Tanggal:** 28 September 2026

**Status:** Draft / Planned Revamp

**File Kode Terkait:** `frontend/app/laporan/laporan.tsx`

---

## 1. Ringkasan Eksekutif & Tujuan

Modul **Laporan & Analitik** adalah pusat pelaporan seluruh operasional rumah sakit yang mengagregasi data dari semua modul SIMRS ke dalam format laporan yang terstruktur, visual, dan siap cetak/export. Modul ini melayani kebutuhan pelaporan internal manajemen, pelaporan wajib ke pemerintah (RL/Rekapitulasi Laporan), serta analisis kinerja rumah sakit.

**Tujuan Utama:**
- Menyediakan dashboard **Pusat Laporan** dengan visualisasi data interaktif (grafik, chart, tabel pivot).
- Menghadirkan **generator laporan** otomatis untuk RL (RL 1.1 s/d RL 5.4), laporan keuangan, dan laporan klinis.
- Mengelola **custom report builder** agar pengguna bisa membuat laporan sesuai kebutuhan.
- Mengimplementasikan **export multi-format** (PDF, Excel, CSV) dan fitur cetak.
- Menyediakan **analitik tren** kunjungan, pendapatan, BOR, dan indikator mutu.

---

## 2. Target Pengguna (User Personas)

| Persona | Deskripsi | Kebutuhan Utama |
|:---|:---|:---|
| **Direktur / Manajemen RS** | Pengambil keputusan strategis | Dashboard eksekutif, tren pendapatan, KPI rumah sakit |
| **Kepala Bidang / Kabag** | Penanggung jawab unit | Laporan per unit/bidang, performa staf, utilisasi layanan |
| **Admin Rekam Medis** | Petugas RM & pelaporan | RL wajib, statistik kunjungan, indeks penyakit |
| **Bendahara / Keuangan** | Petugas keuangan RS | Laporan pendapatan, piutang, pembayaran, rekapitulasi |
| **Komite Medik / PMKP** | Penanggung jawab mutu | Indikator mutu klinis, keselamatan pasien, infeksi |

---

## 3. Fitur Utama & Spesifikasi Fungsional

### 3.1. Dashboard Pusat Laporan (Halaman Utama)

* **Deskripsi:** Halaman utama yang menjadi portal akses ke semua kategori laporan, mengikuti UX **Manajemen Pasien**.
* **Komponen Wajib:**
  * **Banner Header Gradient:** `from-blue-600 via-indigo-600 to-blue-700`, judul "Pusat Laporan & Analitik SIMRS", deskripsi, tombol "Generate Laporan Baru".
  * **Statistik Bar (4 kartu):**
    1. Total Kunjungan Bulan Ini (Slate)
    2. Pendapatan Bulan Ini (Emerald/Hijau)
    3. BOR Rata-rata (Biru)
    4. Indeks Kepuasan Pasien (Amber)
  * **Filter Toolbar:** Periode waktu (Hari Ini, Minggu Ini, Bulan Ini, Kuartal, Tahun, Custom), filter Unit/Bidang, filter Jenis Laporan.
  * **View Mode Toggle:** Dashboard Grafik / Tabel Laporan / Kategori Grid.

### 3.2. Kategori Laporan (Grid Navigasi)

* **Deskripsi:** Pengelompokan laporan dalam kategori kartu, mirip halaman index Pendaftaran.
* **Kategori:**

#### A. Laporan Kunjungan & Pelayanan
| Sub-laporan | Deskripsi |
|:---|:---|
| Kunjungan Rawat Jalan | Jumlah kunjungan per poli, per dokter, per hari |
| Kunjungan IGD | Statistik kunjungan IGD per tingkat kegawatan |
| Kunjungan Rawat Inap | Jumlah admisi, pulang, transfer per hari/bulan |
| 10 Penyakit Terbanyak | Indeks penyakit berdasarkan kode ICD-10 |
| Rujukan Masuk/Keluar | Statistik rujukan dari/ke faskes lain |

#### B. Laporan Keuangan & Pendapatan
| Sub-laporan | Deskripsi |
|:---|:---|
| Pendapatan Harian/Bulanan | Total pendapatan per unit, per penjamin |
| Rekapitulasi Pembayaran | Detail pembayaran per jenis (tunai, BPJS, asuransi) |
| Piutang & Tagihan | Daftar piutang belum terbayar per pasien/penjamin |
| Pendapatan per Dokter | Revenue per dokter dari tindakan, konsultasi |
| Pendapatan per Poli | Revenue per poliklinik |

#### C. Laporan Farmasi & Inventori
| Sub-laporan | Deskripsi |
|:---|:---|
| Pemakaian Obat | Konsumsi obat per periode, per depo |
| Stok Obat | Sisa stok saat ini, stok minimum, obat expired |
| Laporan Stok Opname | Hasil stok opname periodik dengan selisih |
| Fast/Slow Moving | Analisis obat cepat/lambat habis |

#### D. Laporan Rawat Inap & Bangsal
| Sub-laporan | Deskripsi |
|:---|:---|
| BOR (Bed Occupancy Rate) | Persentase penggunaan bed per bangsal, per kelas |
| ALOS (Average Length of Stay) | Rata-rata lama rawat per diagnosis |
| TOI (Turn Over Interval) | Interval kosong bed sebelum diisi pasien berikutnya |
| BTO (Bed Turn Over) | Frekuensi penggunaan bed per periode |
| Sensus Harian | Jumlah pasien masuk, keluar, meninggal per hari |

#### E. Laporan Wajib Pemerintah (RL)
| Sub-laporan | Deskripsi |
|:---|:---|
| RL 1.1 | Data Dasar Rumah Sakit |
| RL 1.2 | Indikator Pelayanan RS |
| RL 1.3 | Tempat Tidur & BOR |
| RL 2 | Ketenagaan Rumah Sakit |
| RL 3.1 | Rawat Inap (10 Penyakit Terbanyak) |
| RL 3.2 | Rawat Jalan (10 Penyakit Terbanyak) |
| RL 3.3 | IGD (10 Penyakit Terbanyak) |
| RL 4a | Morbiditas Rawat Inap |
| RL 4b | Morbiditas Rawat Jalan |
| RL 5.1 | Pengunjung RS |
| RL 5.2 | Kunjungan Rawat Jalan |
| RL 5.3 | Kunjungan Rawat Inap |
| RL 5.4 | 10 Besar Penyakit & Tindakan |

#### F. Laporan Mutu & Keselamatan Pasien
| Sub-laporan | Deskripsi |
|:---|:---|
| Indikator Mutu Klinis | Capaian indikator mutu per unit |
| Insiden Keselamatan Pasien | Laporan IKP (KTD, KNC, KPC, Sentinel) |
| Infeksi Nosokomial (PPI) | Data surveilans infeksi RS |
| Kematian & Komplikasi | Statistik mortalitas dan komplikasi |

### 3.3. Viewer Laporan Detail

* **Deskripsi:** Halaman viewer untuk masing-masing jenis laporan.
* **Kebutuhan Fungsional:**
  * **Tabel Data:** Tabel lengkap dengan sortasi, paginasi, dan filter kolom.
  * **Grafik Visual:** Chart (bar, line, pie, donut) menggunakan library chart (Recharts/Chart.js).
  * **Periode Selector:** Dropdown atau date-range picker untuk memilih rentang waktu.
  * **Drill-down:** Klik pada kategori untuk melihat detail (misal: klik poli → daftar pasien).
  * **Export:** Tombol export ke PDF, Excel (XLSX), CSV.
  * **Cetak:** Tombol cetak langsung dari browser dengan layout yang rapi.

### 3.4. Dashboard Eksekutif (Ringkasan Manajemen)

* **Deskripsi:** Dashboard visual khusus untuk manajemen/direksi.
* **Kebutuhan Fungsional:**
  * **Trend Line:** Grafik tren kunjungan 12 bulan terakhir.
  * **Revenue Comparison:** Perbandingan pendapatan bulan ini vs bulan lalu.
  * **Top 5:** Poli terbanyak, dokter terbanyak, penyakit terbanyak.
  * **BOR Gauge:** Gauge chart BOR real-time.
  * **Heat Map:** Peta panas kunjungan per jam dalam seminggu.
  * **Alert KPI:** Indikator yang di bawah target ditandai merah.

### 3.5. Custom Report Builder

* **Deskripsi:** Fitur untuk membuat laporan kustom sesuai kebutuhan.
* **Kebutuhan Fungsional:**
  * **Pilih Sumber Data:** Dropdown sumber (Kunjungan, Pembayaran, Farmasi, Rawat Inap, dll).
  * **Pilih Kolom/Field:** Checkbox field yang ingin ditampilkan.
  * **Filter Data:** Kondisi filter (tanggal, poli, dokter, penjamin, dll).
  * **Grouping & Aggregasi:** Group by (per hari, per bulan, per poli, per dokter) dengan sum/count/avg.
  * **Simpan Template:** Simpan konfigurasi laporan sebagai template yang bisa di-load ulang.
  * **Jadwal Otomatis:** Opsi auto-generate laporan pada waktu tertentu (harian/mingguan/bulanan).

### 3.6. Rekap & Statistik Harian

* **Deskripsi:** Ringkasan operasional harian untuk closing shift.
* **Kebutuhan Fungsional:**
  * **Rekap Pendaftaran:** Total registrasi hari ini, breakdown per poli.
  * **Rekap Pendapatan:** Total pembayaran hari ini, breakdown per metode bayar.
  * **Rekap Rawat Inap:** Pasien masuk, pulang, meninggal hari ini.
  * **Rekap Farmasi:** Jumlah resep dilayani, obat habis/kritis.
  * **Cetak Rekap:** Tombol cetak rekap harian.

---

## 4. Persyaratan Non-Fungsional

### 4.1. UI/UX (sesuai `DESAGIN.md`)

| Aspek | Standar |
|:---|:---|
| **Banner Header** | `bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl` |
| **Grafik Warna** | Palette: Blue-600, Emerald-500, Amber-500, Rose-500, Indigo-500, Slate-400 |
| **Card Container** | `bg-white border border-slate-200/60 rounded-2xl shadow-2xs` |
| **Tabel Header** | `bg-slate-50 text-slate-700 font-extrabold text-xs` |
| **Export Button** | `bg-blue-600 text-white rounded-xl` dengan ikon download |
| **Print Button** | `border border-slate-200 bg-white text-slate-700 rounded-xl` |

### 4.2. Performa

* Dashboard utama loading ≤ 2 detik (dengan caching data agregat).
* Laporan dengan data besar (>10.000 row) menggunakan server-side pagination.
* Grafik render ≤ 1 detik.
* Export PDF/Excel: proses background, notifikasi ketika selesai.

### 4.3. Keamanan

* **RBAC:** Laporan keuangan hanya untuk level Bendahara/Manajemen. Laporan klinis untuk Komite Medik.
* **Data Masking:** Data sensitif pasien di-mask pada laporan yang di-export (opsional).
* **Audit Trail:** Log siapa yang mengakses/download laporan apa.

---

## 5. Alur Kerja Utama (User Flow)

### Flow 1: Melihat Laporan Standar
```
1. User masuk ke Pusat Laporan
2. Pilih kategori laporan (misal: "Kunjungan Rawat Jalan")
3. Pilih periode waktu (misal: "September 2026")
4. Sistem generate data → Tampilkan tabel & grafik
5. User bisa drill-down, filter, atau export/cetak
```

### Flow 2: Membuat Custom Report
```
1. Klik "Generate Laporan Baru" / "Custom Report"
2. Pilih sumber data → Pilih kolom
3. Set filter & grouping
4. Preview hasil laporan
5. Simpan sebagai template (opsional)
6. Export ke PDF/Excel
```

### Flow 3: Dashboard Eksekutif
```
1. Manajemen/Direksi buka tab "Dashboard Eksekutif"
2. Otomatis tampil ringkasan KPI bulan berjalan
3. Grafik tren, top-5, gauge BOR
4. Klik angka → Drill-down ke detail
5. Cetak/export untuk meeting
```

---

## 6. Indikator Keberhasilan (KPI)

1. **Ketersediaan Laporan:** 100% laporan RL wajib tersedia tepat waktu.
2. **Akurasi Data:** Selisih data laporan vs sumber data ≤ 0.1%.
3. **Adopsi:** >90% pengguna laporan mengakses via digital (0 laporan manual).
4. **Waktu Generate:** Laporan standar ≤ 5 detik, laporan besar ≤ 30 detik.
5. **User Satisfaction:** Kepuasan pengguna terhadap kualitas laporan ≥ 4.0/5.0.

---

## 7. Integrasi dengan Modul Lain

| Modul | Jenis Integrasi |
|:---|:---|
| **Pendaftaran** | Data kunjungan, registrasi, antrean |
| **Pemeriksaan** | Data tindakan, diagnosis ICD-10, SOAP |
| **Farmasi** | Data resep, pemakaian obat, stok |
| **Rawat Inap** | Data BOR, ALOS, sensus harian, discharge |
| **Billing / Kasir** | Data pendapatan, pembayaran, piutang |
| **Master Data** | Referensi poli, dokter, kamar, tarif |
| **Rekam Medis** | Data statistik morbiditas, mortalitas |

---

## 8. Referensi Kode Saat Ini (Sebelum Revamp)

**File:** `frontend/app/laporan/laporan.tsx`

**Status saat ini:** Halaman sederhana yang menampilkan data dari endpoint `/dashboard` menggunakan komponen reusable (`StatGrid`, `RoomsCard`, `RecentPatientsTable`) dari folder dashboard. Hanya menampilkan statistik dasar, ringkasan kamar, dan tabel registrasi terkini. Belum ada fitur kategori laporan, grafik interaktif, export PDF/Excel, custom report builder, RL pemerintah, atau dashboard eksekutif.

**Rencana Revamp:** Revisi total menjadi halaman **Pusat Laporan & Analitik** dengan UX seperti tab Manajemen Pasien (banner, statistik, grid kategori laporan, viewer detail, grafik interaktif, export multi-format, dashboard eksekutif).
