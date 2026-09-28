Berikut adalah draft **Product Requirement Document (PRD)** untuk **Modul Pelayanan Medis & Fitur Kedokteran (E-Prescribing & RME)** pada SIMRS yang sedang Anda kembangkan.

---

# Product Requirement Document (PRD)

**Nama Fitur/Modul:** SIMRS – Modul Pelayanan Medis & E-Prescribing

**Versi:** 1.0

**Tanggal:** 28 September 2026

**Status:** In Progress / Draft

---

## 1. Ringkasan Eksekutif & Tujuan

Modul ini bertujuan untuk menyediakan antarmuka rekam medis elektronik (RME) yang cepat, intuitif, dan aman bagi dokter serta tenaga medis. Fokus utamanya adalah mengurangi beban input data (*click fatigue*), mempercepat proses peresepan obat, serta meminimalisir risiko kesalahan medis (*medical error*) melalui sistem peringatan klinis yang terintegrasi.

---

## 2. Target Pengguna (User Personas)

1. **Dokter Spesialis / Dokter Umum (DPJP):** Mengisi rekam medis, membuat resep obat, membuat order laboratorium/radiologi, dan menyusun *discharge summary*.
2. **Perawat / Bidan:** Mencatat tanda-tanda vital (vital signs), mengisi asesmen awal, dan memantau status CPPT.
3. **Apoteker / Petugas Farmasi:** Menerima resep elektronik (*e-prescribing*), memverifikasi dosis, dan menyiapkan obat.

---

## 3. Fitur Utama & Spesifikasi Fungsional

### 3.1. Asesmen & RME Berbasis SOAP (Subjective, Objective, Assessment, Plan)

* **Deskripsi:** Antarmuka pengisian catatan medis dokter berbasis struktur SOAP.
* **Kebutuhan Fungsional:**
* **Template Dinamis:** Pilihan template SOAP sesuai poli/spesialisasi (misal: Anak, Bedah, Dalam).
* **Salin Rekam Medis Lalu (*Copy Previous Visit*):** Tombol 1-klik untuk menarik data SOAP dari kunjungan pasien sebelumnya ke dalam draft aktif.
* **Auto-complete Kode ICD:** Pencarian koding diagnosis (ICD-10) dan tindakan (ICD-9-CM) berdasarkan nama penyakit atau kode numerik.



### 3.2. Resep Elektronik (E-Prescribing) & Racikan

* **Deskripsi:** Modul pembuatan resep obat digital langsung dari ruang periksa ke unit farmasi.
* **Kebutuhan Fungsional:**
* **Real-Time Stock Check:** Menampilkan ketersediaan sisa stok obat di depo farmasi terkait saat dokter memilih obat.
* **Modul Obat Racikan:** Form khusus untuk kalkulasi dosis bahan aktif, jumlah puyer/kapsul, dan instruksi aturan pakai.
* **Paket Resep Favorit:** Dokumen/preset resep bawaan dokter (misal: "Paket Hipertensi A") yang dapat diimpor langsung dalam 1 klik.



### 3.3. Clinical Decision Support System (CDSS) & Safety Alerts

* **Deskripsi:** Sistem peringatan dini otomatis saat proses input instruksi medis.
* **Kebutuhan Fungsional:**
* **Peringatan Alergi:** Notifikasi warna merah jika obat yang dipilih sesuai dengan riwayat alergi yang tercatat pada profil pasien.
* **Interaksi Obat (Drug-Drug Interaction):** Pop-up peringatan jika terjadi interaksi berbahaya antara dua atau lebih obat yang diresepkan bersamaan.



### 3.4. Order Penunjang Medis & Viewer (LIS & PACS)

* **Deskripsi:** Pengiriman instruksi dan penerimaan hasil pemeriksaan laboratorium/radiologi secara digital.
* **Kebutuhan Fungsional:**
* **Order Laboratorium & Radiologi:** Checkbox daftar pemeriksaan penunjang yang langsung mengirim order ke SIMRS unit terkait.
* **Hasil Lab Direct-to-EMR:** Nilai tes lab otomatis muncul di RME pasien lengkap dengan *flag/highlight* untuk nilai abnormal.
* **Integrasi DICOM/PACS Viewer:** Tautan langsung pada rekam medis untuk membuka citra rontgen/CT-Scan di dalam aplikasi.



### 3.5. Ringkasan Pulang (*Discharge Summary*) Otomatis

* **Deskripsi:** Pembuatan dokumen ringkasan perawatan saat pasien rawat inap keluar/pulang.
* **Kebutuhan Fungsional:**
* **Auto-Populate Data:** Penarikan otomatis diagnosis akhir, riwayat tindakan, daftar obat pulang, dan resume kondisi dari lembar CPPT.



---

## 4. Persyaratan Non-Fungsional (Non-Functional Requirements)

### 4.1. Aksesibilitas & Performa UI/UX

* **Kecepatan Input:** Pengisian resep dan SOAP oleh dokter tidak boleh melebihi 3-4 kali klik utama.
* **Waktu Respons System:** *Loading time* pemanggilan riwayat RME atau pemrosesan pencarian obat $\le 1.5$ detik.
* **Dukungan Perangkat:** Antarmuka responsif untuk tablet/iPad (layar sentuh) saat ronde rawat inap.

### 4.2. Keamanan & Kepatuhan Data

* **Role-Based Access Control (RBAC):** Hak akses ketat; hanya dokter DPJP dan perawat berizin yang dapat mengubah catatan RME pasien terkait.
* **Tanda Tangan Digital (Digital Signature):** Verifikasi autentikasi dokter pada setiap dokumen resep dan resume medis.
* **Standar Interoperabilitas:** Struktur data klinis disesuaikan dengan standar FHIR / HL7 untuk kesiapan integrasi ke SATUSEHAT.

---

## 5. Indikator Keberhasilan (Key Performance Indicators)

1. **Kecepatan Input Dokter:** Waktu rata-rata pengisian resep dan SOAP turun menjadi $< 2$ menit per pasien.
2. **Adopsi Sistem:** $>90\%$ dokter menggunakan *e-prescribing* tanpa beralih ke kertas.
3. **Pengurangan Kesalahan:** Penurunan insiden kesalahan peresepan obat (*prescribing error*) akibat tulisan tidak terbaca atau interaksi obat hingga $0\%$.

---

## 6. Alur Kerja Utama (User Flow - Peresepan Dokter)

1. Dokter membuka antarmuka RME pasien $\rightarrow$ 2. Dokter mengisi diagnosa (ICD-10) $\rightarrow$ 3. Dokter memilih menu E-Prescribing $\rightarrow$ 4. Sistem mengecek *stock* & *alert* alergi/interaksi obat $\rightarrow$ 5. Dokter klik **Submit & Sign** $\rightarrow$ 6. Resep terkirim *real-time* ke sistem Kasir & Apotek.