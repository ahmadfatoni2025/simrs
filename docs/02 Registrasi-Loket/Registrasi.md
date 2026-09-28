# Fitur: Registrasi Loket dan Anjungan Mandiri

## Deskripsi

Modul Registrasi merupakan pintu masuk seluruh pelayanan pasien pada SIMRS. Modul ini memungkinkan pasien melakukan pendaftaran melalui petugas loket maupun secara mandiri menggunakan Anjungan Mandiri (Self Service Kiosk). Setelah registrasi berhasil, data kunjungan akan langsung diteruskan ke modul Rekam Medis, Poli, Farmasi, Laboratorium, Radiologi, Billing, dan Dashboard Antrean.

---

# Tujuan

- Mempercepat proses registrasi pasien.
- Mengurangi antrean di loket.
- Mengurangi kesalahan input data.
- Mendukung registrasi pasien BPJS, Umum, Asuransi, maupun Corporate.
- Mengintegrasikan seluruh proses pelayanan sejak pasien datang hingga selesai.

---

# User

- Petugas Registrasi
- Administrator
- Supervisor Pendaftaran
- Pasien
- Petugas Informasi

---

# Daftar Fitur

## 1. Registrasi Pasien Baru

### Deskripsi

Digunakan untuk membuat data pasien yang belum pernah terdaftar.

### Input

- NIK
- Nama Lengkap
- Tempat Lahir
- Tanggal Lahir
- Jenis Kelamin
- Agama
- Status Pernikahan
- Alamat
- Kecamatan
- Kabupaten
- Provinsi
- Nomor HP
- Email
- Penjamin
- Nomor BPJS (Opsional)

### Proses

- Validasi NIK
- Cek pasien duplikat
- Generate Nomor Rekam Medis
- Simpan data pasien
- Cetak Kartu Pasien (Opsional)

### Output

- Nomor Rekam Medis
- Data Pasien
- Status Registrasi

---

## 2. Registrasi Pasien Lama

### Deskripsi

Mendaftarkan pasien yang sudah memiliki Nomor Rekam Medis.

### Pencarian Pasien

- Nomor RM
- NIK
- Nomor BPJS
- Nama
- Barcode
- QR Code

### Proses

- Ambil data pasien
- Verifikasi identitas
- Pilih poli
- Pilih dokter
- Buat kunjungan

---

## 3. Registrasi Melalui Anjungan Mandiri

### Deskripsi

Pasien melakukan registrasi sendiri tanpa bantuan petugas.

### Identifikasi

- Scan KTP
- Scan BPJS
- Scan Kartu Pasien
- QR Code Mobile

### Langkah

1. Identifikasi pasien
2. Validasi data
3. Pilih Poli
4. Pilih Dokter
5. Pilih Jadwal
6. Cetak Nomor Antrean

---

## 4. Manajemen Kunjungan

### Fungsi

Mencatat seluruh kunjungan pasien.

Data yang disimpan

- Nomor RM
- Poli
- Dokter
- Penjamin
- Jenis Kunjungan
- Tanggal
- Jam
- Status

Status

- Registered
- Waiting
- Called
- In Progress
- Finished
- Cancelled

---

## 5. Manajemen Antrean

### Generate Antrean

Format

POLI-HARI-NOMOR

Contoh

```
INT-001
OBG-014
MAT-008
```

Fitur

- Generate otomatis
- Reset harian
- Prioritas Lansia
- Prioritas Disabilitas
- Prioritas Emergency

---

## 6. Jadwal Dokter

Menampilkan

- Dokter
- Poli
- Hari
- Jam Mulai
- Jam Selesai
- Kuota
- Sisa Kuota

Validasi

- Dokter aktif
- Jadwal tersedia
- Kuota belum penuh

---

## 7. Pemilihan Penjamin

Jenis Penjamin

- Umum
- BPJS
- Asuransi
- Corporate
- Jaminan Perusahaan

Fungsi

- Validasi Penjamin
- Tarif otomatis
- Hak kelas
- Mapping Billing

---

## 8. Bridging BPJS

Fitur

- Validasi Kepesertaan
- Generate SEP
- Cek Rujukan
- Finger Print
- Update SEP
- Cancel SEP

Response

- Status aktif
- FKTP
- Kelas
- Hak Rawat
- Nomor SEP

---

## 9. Validasi Dokumen

Dokumen

- KTP
- KK
- BPJS
- Surat Rujukan
- Surat Kontrol
- Surat Jaminan

Validasi

- Lengkap
- Berlaku
- Tidak Kadaluarsa

---

## 10. Generate Nomor Rekam Medis

Format

```
RM00000001
RM00000002
```

Karakteristik

- Auto Increment
- Tidak boleh duplikat
- Berlaku seumur hidup

---

## 11. Cetak Bukti Registrasi

Informasi

- Nama
- Nomor RM
- Nomor Antrean
- Dokter
- Poli
- Jadwal
- Barcode
- QR Code

---

## 12. Dashboard Registrasi

Informasi

- Jumlah pasien hari ini
- Pasien Baru
- Pasien Lama
- Jumlah BPJS
- Jumlah Umum
- Total Antrean
- Poli Terpadat

Update

Realtime

---

## 13. Monitoring Antrean

Status

- Waiting
- Called
- Skip
- Finished

Fitur

- Display TV
- Voice Calling
- Monitor Loket
- Monitor Poli

---

## 14. Riwayat Kunjungan

Menampilkan

- Semua kunjungan pasien
- Dokter
- Diagnosis
- Tindakan
- Obat
- Billing

Filter

- Tanggal
- Poli
- Dokter

---

## 15. Pembatalan Registrasi

Alasan

- Salah Poli
- Salah Dokter
- Pasien Tidak Datang
- Duplicate

Efek

- Antrean dihapus
- Billing dibatalkan
- Audit Log dibuat

---

## 16. Audit Trail

Mencatat

- Login
- Logout
- Registrasi
- Edit
- Delete
- Cancel
- Print

Data

- User
- Waktu
- IP Address
- Device
- Aktivitas

---

## 17. Hak Akses (RBAC)

### Administrator

- Full Access

### Petugas Loket

- Registrasi
- Edit
- Cetak

### Supervisor

- Monitoring
- Approval
- Laporan

### Pasien

- Registrasi Mandiri
- Cetak Tiket

---

## 18. Notifikasi

Jenis

- Nomor Antrean
- Jadwal Dokter
- Kuota Habis
- Registrasi Berhasil
- Registrasi Gagal

Media

- Display
- SMS
- WhatsApp
- Email
- Push Notification

---

## 19. Laporan Registrasi

Laporan

- Registrasi Harian
- Registrasi Bulanan
- Pasien Baru
- Pasien Lama
- BPJS
- Umum
- Kunjungan per Poli
- Kunjungan per Dokter
- Statistik Antrean

Export

- PDF
- Excel
- CSV

---

## 20. Integrasi Antar Modul

Setelah registrasi selesai, sistem akan mengirim data ke:

- Rekam Medis
- Rawat Jalan
- Rawat Inap
- IGD
- Laboratorium
- Radiologi
- Farmasi
- Billing
- Kasir
- Dashboard Manajemen
- SATUSEHAT
- BPJS
- Sistem Antrean

---

# Flow Integrasi

```
Registrasi
      │
      ▼
Validasi Pasien
      │
      ▼
Generate RM
      │
      ▼
Generate Kunjungan
      │
      ▼
Generate Antrean
      │
      ▼
Kirim ke Poli
      │
      ├────────► Rekam Medis
      ├────────► Farmasi
      ├────────► Laboratorium
      ├────────► Radiologi
      ├────────► Billing
      ├────────► Dashboard
      ├────────► BPJS
      └────────► SATUSEHAT
```