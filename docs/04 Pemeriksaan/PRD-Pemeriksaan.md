# Product Requirement Document (PRD)

**Nama Fitur/Modul:** SIMRS – Modul Pemeriksaan & Tindakan Medis

**Versi:** 1.0

**Tanggal:** 28 September 2026

**Status:** Draft / Planned Revamp

**File Kode Terkait:** `frontend/app/pemeriksaan/pemeriksaan.tsx`

---

## 1. Ringkasan Eksekutif & Tujuan

Modul **Pemeriksaan & Tindakan Medis** merupakan pusat operasional klinik/poliklinik di mana dokter, perawat, dan tenaga medis melakukan asesmen klinis, mencatat temuan, membuat diagnosis, dan merencanakan tindakan medis. Modul ini adalah jantung dari siklus pelayanan pasien rawat jalan (dan terintegrasi dengan rawat inap).

**Tujuan Utama:**
- Menyediakan antarmuka **SOAP-based** (Subjective, Objective, Assessment, Plan) yang cepat dan minim klik.
- Menampilkan **daftar pasien yang sedang diperiksa** secara real-time (terintegrasi dengan modul antrean).
- Menghadirkan dashboard **Manajemen Pemeriksaan** gaya kanban dengan statistik live, filter multi-dimensi, dan aksi cepat.
- Mengelola tarif tindakan, prosedur medis, serta order penunjang (Lab & Radiologi) secara digital.

---

## 2. Target Pengguna (User Personas)

| Persona | Deskripsi | Kebutuhan Utama |
|:---|:---|:---|
| **Dokter (DPJP)** | Dokter penanggung jawab pasien | Input SOAP, diagnosis ICD-10, perencanaan tindakan, order lab/radiologi |
| **Perawat** | Perawat poliklinik/ruang periksa | Catat vital signs, asesmen awal, follow-up CPPT |
| **Petugas Penunjang** | Lab/Radiologi | Menerima order pemeriksaan, input hasil, kirim ke RME |
| **Admin Billing** | Petugas tarif & billing | Validasi tarif tindakan yang dikerjakan |

---

## 3. Fitur Utama & Spesifikasi Fungsional

### 3.1. Dashboard Manajemen Pemeriksaan (Halaman Utama)

* **Deskripsi:** Halaman utama modul yang menampilkan ringkasan seluruh pemeriksaan hari ini dengan pola UX mirip **Manajemen Pasien** (tab Antrean).
* **Komponen Wajib:**
  * **Banner Header Gradient:** Gradient biru (`from-blue-600 via-indigo-600 to-blue-700`) sesuai `DESAGIN.md`, dengan judul modul, deskripsi, dan tombol aksi utama.
  * **Statistik Bar:** 4 kartu: Total Pasien Diperiksa, Sedang Berlangsung (biru), Menunggu Hasil Lab (amber), Selesai Pemeriksaan (emerald).
  * **Filter Toolbar:** Pencarian nama/No RM, filter Poli, filter Status Pemeriksaan, filter Dokter DPJP.
  * **View Mode Toggle:** Grid Kartu / Tabel / Timeline.

### 3.2. Kanban Status Pemeriksaan

* **Deskripsi:** Tampilan 4 kolom status mirip antrean pasien:
  1. **Menunggu Periksa** (Abu-abu/Slate) — Pasien dari antrean yang siap diperiksa.
  2. **Sedang Diperiksa** (Biru) — Pasien yang sedang dalam proses asesmen/SOAP.
  3. **Menunggu Hasil** (Amber) — Pasien yang menunggu hasil lab/radiologi.
  4. **Selesai Periksa** (Hijau/Emerald) — Pemeriksaan selesai, siap billing/farmasi.
* **Urutan:** Pasien yang baru dipindahkan status berada di **urutan paling atas** (descending by timestamp).
* **Kartu Pasien berisi:** Nama, No RM, Poli, Dokter DPJP, waktu mulai periksa, badge penjamin, status badge warna.

### 3.3. Form Asesmen Klinis (SOAP)

* **Deskripsi:** Form input catatan medis dokter dengan struktur SOAP.
* **Kebutuhan Fungsional:**
  * **Subjective (S):** Textarea untuk keluhan utama pasien dan riwayat penyakit.
  * **Objective (O):** Form vital signs (TD, Nadi, Suhu, Respirasi, SpO2, BB, TB, BMI auto-calc), pemeriksaan fisik.
  * **Assessment (A):** Pencarian diagnosis dengan **autocomplete ICD-10** (minimal 3 diagnosis: Primer, Sekunder, Tambahan).
  * **Plan (P):** Rencana tindakan, resep (link ke E-Prescribing), order lab/radiologi, rujukan.
  * **Template SOAP Poli:** Template preset per poliklinik yang bisa di-load 1 klik.
  * **Copy Previous Visit:** Tombol salin data SOAP dari kunjungan sebelumnya.

### 3.4. Manajemen Tarif & Tindakan Medis

* **Deskripsi:** CRUD master tarif tindakan medis (dari endpoint `/master-data/tarif`).
* **Kebutuhan Fungsional:**
  * **Tabel Tarif:** Nama tindakan, kode, tarif (Rp), kategori (Medis/Non-Medis), keterangan.
  * **Tambah/Edit/Hapus Tarif:** Modal form sesuai `DESAGIN.md`.
  * **Filter & Search:** Pencarian nama tindakan, filter kategori.
  * **Kalkulasi Otomatis:** Total tarif tindakan per pasien dihitung otomatis saat diinput.

### 3.5. Order Penunjang Medis (Lab & Radiologi)

* **Deskripsi:** Pembuatan order pemeriksaan lab/radiologi langsung dari ruang periksa.
* **Kebutuhan Fungsional:**
  * **Checklist Pemeriksaan:** Daftar pemeriksaan lab (Darah Lengkap, Kimia Klinik, Urinalisis, dll) dan radiologi (Rontgen, USG, CT-Scan) dengan checkbox.
  * **Status Tracking:** Pending → Diproses → Hasil Tersedia → Sudah Dibaca Dokter.
  * **Notifikasi Hasil:** Badge/notifikasi ketika hasil lab/radiologi sudah tersedia.
  * **Flag Nilai Abnormal:** Nilai lab di luar range normal ditandai warna merah/amber.

### 3.6. Riwayat Pemeriksaan Pasien

* **Deskripsi:** Timeline kronologis seluruh kunjungan dan pemeriksaan pasien.
* **Kebutuhan Fungsional:**
  * **Timeline View:** Tampilan timeline vertikal per tanggal kunjungan.
  * **Detail Expand:** Klik untuk membuka detail SOAP, diagnosis, tindakan, dan hasil lab.
  * **Export PDF:** Cetak riwayat pemeriksaan dalam format PDF.

---

## 4. Persyaratan Non-Fungsional

### 4.1. UI/UX (sesuai `DESAGIN.md`)

| Aspek | Standar |
|:---|:---|
| **Banner Header** | `bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl` |
| **Status Warna** | Menunggu = Slate/Abu, Pemeriksaan = Blue, Menunggu Hasil = Amber, Selesai = Emerald |
| **Card Container** | `bg-white border border-slate-200/60 rounded-2xl shadow-2xs` |
| **Input Form** | `rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-100` |
| **Button Primary** | `bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-500` |

### 4.2. Performa

* Loading time data pemeriksaan ≤ 1.5 detik.
* Pencarian ICD-10 autocomplete ≤ 500ms.
* Sinkronisasi status real-time dengan modul antrean.

### 4.3. Keamanan

* **RBAC:** Hanya DPJP & perawat terassign yang bisa mengubah data SOAP.
* **Audit Trail:** Setiap perubahan SOAP tercatat di audit log.

---

## 5. Alur Kerja Utama (User Flow)

```
1. Pasien dipanggil dari Antrean → Status "Sedang Diperiksa"
2. Dokter membuka form SOAP → Input Subjective & Objective
3. Dokter mencari diagnosis ICD-10 → Input Assessment
4. Dokter membuat rencana (Plan):
   a. Order Lab/Radiologi → Status "Menunggu Hasil"
   b. Resep Obat → Link ke modul Farmasi/E-Prescribing
   c. Tindakan Medis → Input tarif tindakan
5. Hasil Lab masuk → Dokter review → Finalisasi diagnosis
6. Pemeriksaan selesai → Status "Selesai Periksa"
7. Data mengalir ke → Billing / Farmasi / Rekam Medis
```

---

## 6. Indikator Keberhasilan (KPI)

1. **Kecepatan SOAP:** Waktu rata-rata pengisian SOAP < 3 menit per pasien.
2. **Zero Paper:** 100% catatan medis digital, 0 formulir kertas.
3. **Akurasi Diagnosis:** 100% kunjungan memiliki kode ICD-10 yang valid.
4. **Throughput:** Minimal 20 pasien/dokter/hari dapat diproses dengan modul ini.

---

## 7. Integrasi dengan Modul Lain

| Modul | Jenis Integrasi |
|:---|:---|
| **Antrean / Pendaftaran** | Terima pasien dari antrean, update status otomatis |
| **Farmasi** | Kirim resep elektronik dari Plan → Depo Farmasi |
| **Rawat Inap** | Pasien yang perlu rawat inap diorder dari sini |
| **Laporan** | Data pemeriksaan mengalir ke laporan harian/bulanan |
| **Rekam Medis** | Semua data SOAP tersimpan permanen di RME pasien |
| **Billing / Kasir** | Tarif tindakan dikirim otomatis ke modul billing |

---

## 8. Referensi Kode Saat Ini (Sebelum Revamp)

**File:** `frontend/app/pemeriksaan/pemeriksaan.tsx`

**Status saat ini:** Halaman sederhana yang hanya menampilkan daftar tarif tindakan dari endpoint `/master-data/tarif` menggunakan komponen `ResourcePage` generik. Belum ada fitur SOAP, kanban status, dashboard statistik, atau form asesmen klinis.

**Rencana Revamp:** Revisi total menjadi halaman **Manajemen Pemeriksaan** dengan UX seperti tab Manajemen Pasien (banner, statistik, kanban, filter, modal CRUD).
