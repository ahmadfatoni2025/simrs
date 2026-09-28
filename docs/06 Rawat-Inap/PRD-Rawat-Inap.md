# Product Requirement Document (PRD)

**Nama Fitur/Modul:** SIMRS – Modul Rawat Inap & Manajemen Bangsal

**Versi:** 1.0

**Tanggal:** 28 September 2026

**Status:** Draft / Planned Revamp

**File Kode Terkait:** `frontend/app/rawat-inap/rawat-inap.tsx`

---

## 1. Ringkasan Eksekutif & Tujuan

Modul **Rawat Inap & Manajemen Bangsal** mengelola seluruh siklus perawatan pasien yang memerlukan penginapan di rumah sakit — mulai dari order rawat inap, booking kamar/bed, pemantauan harian (CPPT), instruksi medis, hingga proses pemulangan (*discharge*). Modul ini menjadi pusat koordinasi antara dokter, perawat bangsal, dan unit penunjang selama masa rawat inap pasien.

**Tujuan Utama:**
- Menyediakan dashboard **Manajemen Rawat Inap** bergaya visual dengan peta kamar/bed interaktif dan statistik BOR (Bed Occupancy Rate).
- Menghadirkan **Bed Management System** real-time dengan status kamar per kelas.
- Mengelola **CPPT harian** (Catatan Perkembangan Pasien Terintegrasi) dan instruksi medis.
- Mengimplementasikan proses **Discharge Planning** terstruktur dari awal rawat inap.
- Menyediakan **Transfer & Mutasi Pasien** antar bangsal/ruangan secara digital.

---

## 2. Target Pengguna (User Personas)

| Persona | Deskripsi | Kebutuhan Utama |
|:---|:---|:---|
| **Dokter (DPJP)** | Dokter penanggung jawab rawat inap | Visit/ronde harian, CPPT, instruksi medis, discharge summary |
| **Perawat Bangsal** | Perawat di ruang rawat inap | Catat vital signs per shift, implementasi instruksi, asesmen keperawatan |
| **Kepala Ruangan** | Penanggung jawab bangsal | Monitoring BOR, pengaturan bed, shift perawat |
| **Admission Officer** | Petugas admisi rawat inap | Booking bed, registrasi rawat inap, verifikasi penjamin |
| **Bidan** | Petugas persalinan | Catatan partograf, monitoring VK, catatan bayi baru lahir |

---

## 3. Fitur Utama & Spesifikasi Fungsional

### 3.1. Dashboard Manajemen Rawat Inap (Halaman Utama)

* **Deskripsi:** Halaman utama modul dengan overview seluruh bangsal, mengikuti UX **Manajemen Pasien**.
* **Komponen Wajib:**
  * **Banner Header Gradient:** `from-blue-600 via-indigo-600 to-blue-700`, judul "Manajemen Rawat Inap & Bangsal", deskripsi, tombol "Admisi Pasien Baru".
  * **Statistik Bar (4 kartu):**
    1. Total Tempat Tidur (Slate) — Kapasitas seluruh kamar.
    2. Terisi / Dipakai (Biru) — Bed yang sedang ditempati pasien.
    3. Tersedia / Kosong (Emerald/Hijau) — Bed yang bisa diisi.
    4. BOR Hari Ini (Amber) — Persentase Bed Occupancy Rate.
  * **Filter Toolbar:** Pencarian nama pasien/No RM, filter Bangsal/Ruangan, filter Kelas (VIP/I/II/III), filter Status Bed.
  * **View Mode Toggle:** Peta Bed / Grid Kartu / Tabel.

### 3.2. Bed Management (Peta Kamar Interaktif)

* **Deskripsi:** Visualisasi peta kamar/bed per bangsal dengan warna status.
* **Kebutuhan Fungsional:**
  * **Floor Plan View:** Layout visual kamar per lantai/bangsal dengan ikon bed.
  * **Status Warna Bed:**
    - 🟢 **Kosong** (Emerald) — Tersedia untuk ditempati.
    - 🔵 **Terisi** (Blue) — Sedang ditempati pasien.
    - 🟡 **Dipesan / Booking** (Amber) — Sudah di-booking belum masuk.
    - 🔴 **Maintenance** (Rose) — Sedang dibersihkan/diperbaiki.
    - ⚪ **Non-Aktif** (Slate) — Tidak digunakan.
  * **Klik Bed Detail:** Menampilkan info pasien, DPJP, tanggal masuk, diagnosa, rencana pulang.
  * **Drag-Drop Transfer:** Pindahkan pasien antar bed dengan drag-drop (atau modal transfer).

### 3.3. Daftar Pasien Rawat Inap (Kanban Status)

* **Deskripsi:** Tampilan kanban status rawat inap mirip antrean pasien:
  1. **Admisi Baru** (Abu-abu/Slate) — Pasien baru order rawat inap, menunggu bed.
  2. **Dalam Perawatan** (Biru) — Pasien sedang dirawat, CPPT aktif.
  3. **Rencana Pulang** (Amber) — Discharge planning aktif, menunggu finalisasi.
  4. **Pulang / Keluar** (Hijau/Emerald) — Pasien sudah pulang/keluar hari ini.
* **Kartu Pasien berisi:** Nama, No RM, Kamar/Bed, Kelas, DPJP, Diagnosa Utama, Hari Rawat ke-N, Penjamin, Badge Status.

### 3.4. Profil Pasien Rawat Inap (Modal Detail)

* **Deskripsi:** Detail lengkap pasien rawat inap.
* **Komponen Tab:**
  * **Info Pasien:** Identitas, No RM, DPJP, diagnosa, kelas perawatan, penjamin, tanggal masuk, rencana pulang.
  * **CPPT:** Catatan perkembangan pasien terintegrasi per tanggal (SOAP multi-disiplin).
  * **Vital Signs:** Grafik tren vital signs (TD, Nadi, Suhu, SpO2) per shift.
  * **Instruksi Medis:** Daftar instruksi dokter aktif (diet, cairan infus, obat IV, tindakan).
  * **Order Lab/Radiologi:** Riwayat dan status order penunjang.
  * **Resep & Obat:** Daftar obat aktif dan riwayat resep rawat inap.
  * **Discharge Plan:** Checklist discharge (administrasi, resep pulang, surat kontrol, resume medis).

### 3.5. CPPT Harian (Catatan Perkembangan Pasien Terintegrasi)

* **Deskripsi:** Form catatan harian multi-disiplin (dokter, perawat, gizi, fisioterapi).
* **Kebutuhan Fungsional:**
  * **Multi-Disiplin:** Tab berbeda untuk catatan DPJP, perawat, dan tenaga kesehatan lainnya.
  * **Template per Disiplin:** Template SOAP untuk dokter, template asesmen keperawatan untuk perawat.
  * **Timeline View:** Kronologis catatan per tanggal, per shift (Pagi/Siang/Malam).
  * **Tanda Tangan Digital:** Verifikasi penulis catatan.

### 3.6. Proses Pemulangan (Discharge)

* **Deskripsi:** Alur kerja terstruktur untuk proses pulang pasien.
* **Kebutuhan Fungsional:**
  * **Discharge Checklist:**
    - ☐ Resume Medis (Discharge Summary) diisi DPJP.
    - ☐ Resep Pulang sudah dikirim ke Farmasi.
    - ☐ Surat Kontrol/Rujukan dicetak.
    - ☐ Edukasi pasien selesai.
    - ☐ Administrasi/Billing selesai.
    - ☐ Bed status diubah ke "Kosong/Maintenance".
  * **Auto-Generate Discharge Summary:** Penarikan otomatis dari CPPT, diagnosis, tindakan, obat pulang.
  * **Cetak Dokumen Pulang:** Resume medis, surat kontrol, surat keterangan sakit.

### 3.7. Transfer & Mutasi Antar Bangsal

* **Deskripsi:** Pemindahan pasien antar kamar/bangsal/kelas.
* **Kebutuhan Fungsional:**
  * **Form Transfer:** Pilih bed tujuan, alasan transfer, persetujuan kepala ruangan.
  * **Naik/Turun Kelas:** Otomatis update tarif akomodasi sesuai kelas baru.
  * **History Transfer:** Riwayat seluruh mutasi pasien selama rawat inap.

### 3.8. Monitoring Bangsal & Shift

* **Deskripsi:** Dashboard monitoring untuk kepala ruangan.
* **Kebutuhan Fungsional:**
  * **BOR Real-time:** Persentase penggunaan bed per bangsal, per kelas.
  * **ALOS (Average Length of Stay):** Rata-rata lama rawat inap.
  * **Sensus Harian:** Jumlah pasien masuk, keluar, pindah per hari.
  * **Handover Shift:** Catatan serah terima antar shift perawat.

---

## 4. Persyaratan Non-Fungsional

### 4.1. UI/UX (sesuai `DESAGIN.md`)

| Aspek | Standar |
|:---|:---|
| **Banner Header** | `bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl` |
| **Bed Kosong** | `bg-emerald-100 text-emerald-700 border-emerald-200` |
| **Bed Terisi** | `bg-blue-100 text-blue-700 border-blue-200` |
| **Bed Booking** | `bg-amber-100 text-amber-700 border-amber-200` |
| **Bed Maintenance** | `bg-rose-100 text-rose-700 border-rose-200` |
| **Card Container** | `bg-white border border-slate-200/60 rounded-2xl shadow-2xs` |

### 4.2. Performa

* Loading peta bed ≤ 2 detik untuk seluruh bangsal.
* Update status bed real-time (WebSocket atau polling 30 detik).
* Pencarian pasien ≤ 500ms.

### 4.3. Keamanan

* **RBAC:** Hanya DPJP yang bisa menulis CPPT dokter. Perawat hanya catatan keperawatan.
* **Audit Trail:** Seluruh perubahan status bed, transfer, dan CPPT tercatat.
* **Data Sensitivity:** Data rawat inap termasuk data sensitif level tinggi.

---

## 5. Alur Kerja Utama (User Flow)

### Flow 1: Admisi Rawat Inap
```
1. Dokter order rawat inap dari modul Pemeriksaan
2. Admission Officer → Cek ketersediaan bed → Booking bed
3. Pasien masuk → Status bed "Terisi"
4. Registrasi rawat inap → Verifikasi penjamin (BPJS/Asuransi)
5. Kartu pasien muncul di dashboard "Dalam Perawatan"
```

### Flow 2: Perawatan Harian
```
1. Perawat shift pagi → Input vital signs → Catatan asesmen keperawatan
2. Dokter DPJP ronde/visit → Input CPPT (SOAP) → Update instruksi medis
3. Order Lab/Radiologi → Hasil masuk ke CPPT
4. Resep harian → Dikirim ke Farmasi Rawat Inap
5. Serah terima shift (handover) → Perawat shift berikutnya
```

### Flow 3: Discharge
```
1. Dokter DPJP → Izinkan pulang → Isi discharge summary
2. Resep pulang → Dikirim ke Farmasi
3. Surat kontrol & edukasi → Dicetak
4. Billing → Finalisasi tagihan
5. Pasien keluar → Status bed "Maintenance" → Setelah bersih → "Kosong"
```

---

## 6. Indikator Keberhasilan (KPI)

1. **BOR Optimal:** Target BOR 75-85% (tidak terlalu rendah, tidak overcrowded).
2. **ALOS Efisien:** Rata-rata lama rawat sesuai standar per diagnosis.
3. **Discharge Time:** Waktu proses pulang ≤ 2 jam dari persetujuan DPJP.
4. **CPPT Compliance:** 100% kunjungan dokter tercatat di CPPT digital.
5. **Bed Turnover:** Waktu cleaning bed ≤ 1 jam setelah pasien pulang.

---

## 7. Integrasi dengan Modul Lain

| Modul | Jenis Integrasi |
|:---|:---|
| **Pemeriksaan** | Order rawat inap dari poliklinik/IGD |
| **Farmasi** | Resep rawat inap harian & resep pulang |
| **Pendaftaran** | Registrasi rawat inap, verifikasi penjamin |
| **Laporan** | Data BOR, ALOS, sensus harian, RL (Laporan RS) |
| **Billing / Kasir** | Tagihan akomodasi, tindakan, obat selama rawat inap |
| **Rekam Medis** | CPPT dan discharge summary tersimpan permanen |

---

## 8. Referensi Data & Backend

### Database (dari migrasi):
* `master_kamar` — Tabel master kamar rawat inap (nama_kamar, kelas, status, jumlah_tempat_tidur, keterangan).
* Endpoint API: `/master-data/kamar`

### Referensi Fitur di Master Data:
* **Booking Bed** — Proses reservasi tempat tidur sebelum pasien masuk.
* **List Order Rawat Inap** — Daftar order rawat inap dari poliklinik/IGD.

---

## 9. Referensi Kode Saat Ini (Sebelum Revamp)

**File:** `frontend/app/rawat-inap/rawat-inap.tsx`

**Status saat ini:** Halaman sederhana yang hanya menampilkan daftar kamar dari endpoint `/master-data/kamar` menggunakan komponen `ResourcePage` generik dengan layout `KamarTable`. Kolom: nama_kamar, kelas, status (badge), jumlah_tempat_tidur, keterangan. Belum ada fitur peta bed, kanban pasien, CPPT, discharge planning, atau dashboard BOR.

**Rencana Revamp:** Revisi total menjadi halaman **Manajemen Rawat Inap** dengan UX seperti tab Manajemen Pasien (banner, statistik, peta bed interaktif, kanban status pasien, modal detail multi-tab, filter, CPPT harian).
