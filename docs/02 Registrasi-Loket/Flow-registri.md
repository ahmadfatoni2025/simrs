# Flow Registrasi Loket dan Anjungan Mandiri

Flow berikut menggambarkan alur komunikasi (flow chart) antar aktor dan sistem pada proses registrasi pasien di SIMRS.

---

# 1. Registrasi Pasien Baru Melalui Loket

```text
┌────────┐
│ Pasien │
└────┬───┘
     │
     │ Datang ke Rumah Sakit
     ▼
┌──────────────────────┐
│ Ambil Nomor Antrean  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Menunggu Dipanggil   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ Petugas Registrasi Memanggil │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Serahkan KTP / BPJS          │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ SIMRS Cek NIK                │
└──────────┬───────────────────┘
           │
     ┌─────┴──────┐
     │            │
     ▼            ▼
Data Ada      Data Tidak Ada
     │            │
     │            ▼
     │     Input Biodata
     │            │
     │            ▼
     │     Generate No RM
     │            │
     └──────┬─────┘
            ▼
┌──────────────────────────────┐
│ Pilih Penjamin               │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ BPJS ?                       │
└──────────┬───────────────────┘
           │
     ┌─────┴─────┐
     │           │
    Ya         Tidak
     │           │
     ▼           ▼
Validasi BPJS  Lewati
     │
     ▼
┌──────────────────────────────┐
│ Pilih Poli                   │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Pilih Dokter                 │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Cek Jadwal                   │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Generate Nomor Antrean       │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Cetak Bukti Registrasi       │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Data Masuk ke Poli           │
└──────────────────────────────┘
```

---

# 2. Registrasi Pasien Lama

```text
Pasien
   │
   ▼
Registrasi Loket
   │
   ▼
Input No RM / NIK / BPJS
   │
   ▼
Cari Data Pasien
   │
   ▼
Data Ditemukan
   │
   ▼
Verifikasi Identitas
   │
   ▼
Pilih Poli
   │
   ▼
Pilih Dokter
   │
   ▼
Generate Kunjungan
   │
   ▼
Generate Antrean
   │
   ▼
Cetak Bukti
   │
   ▼
Selesai
```

---

# 3. Registrasi Melalui Anjungan Mandiri

```text
Pasien
   │
   ▼
Datang
   │
   ▼
Anjungan Mandiri
   │
   ▼
Scan KTP
atau
Scan BPJS
atau
Scan Kartu Pasien
   │
   ▼
Sistem Membaca Identitas
   │
   ▼
Cari Database Pasien
   │
   ▼
Data Ditemukan?
   │
 ┌─┴─────────────┐
 │               │
Ya              Tidak
 │               │
 ▼               ▼
Tampilkan     Silakan
Biodata       ke Loket
 │
 ▼
Pilih Poli
 │
 ▼
Pilih Dokter
 │
 ▼
Pilih Jadwal
 │
 ▼
Validasi Penjamin
 │
 ▼
Generate Antrean
 │
 ▼
Cetak Tiket
 │
 ▼
Data Masuk Queue
 │
 ▼
Selesai
```

---

# 4. Flow Backend Registrasi

```text
User
 │
 ▼
Klik Daftar
 │
 ▼
Authentication
 │
 ▼
Authorization
 │
 ▼
Cari Data Pasien
 │
 ▼
Validasi Identitas
 │
 ▼
Validasi Penjamin
 │
 ▼
Validasi Jadwal Dokter
 │
 ▼
Validasi Kuota
 │
 ▼
Generate Visit ID
 │
 ▼
Generate Nomor Antrean
 │
 ▼
Insert Kunjungan
 │
 ▼
Insert Billing Awal
 │
 ▼
Update Dashboard
 │
 ▼
Publish Queue
 │
 ▼
Print Ticket
```

---

# 5. Flow Integrasi Antar Modul

```text
                  Registrasi
                       │
                       ▼
               Data Kunjungan
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
 Rekam Medis      Dashboard       Queue System
       │
       ├──────────────┐
       ▼              ▼
Laboratorium      Radiologi
       │              │
       └──────┬───────┘
              ▼
           Farmasi
              │
              ▼
            Billing
              │
              ▼
             Kasir
              │
              ▼
        SATUSEHAT / BPJS
```

---

# 6. Flow Error Handling

```text
Registrasi
     │
     ▼
Validasi
     │
     ▼
Ada Error?
     │
 ┌───┴──────────────┐
 │                  │
Tidak              Ya
 │                  │
 ▼                  ▼
Lanjut       Tampilkan Error
                     │
                     ▼
             Perbaiki Input
                     │
                     ▼
               Validasi Ulang
```

---

# 7. Flow Antrean Poli

```text
Registrasi Berhasil
        │
        ▼
Generate Nomor Antrean
        │
        ▼
Masuk Queue
        │
        ▼
Display TV
        │
        ▼
Perawat Memanggil
        │
        ▼
Pasien Masuk Ruangan
        │
        ▼
Dokter Memulai Pemeriksaan
        │
        ▼
Status = In Progress
        │
        ▼
Status = Finished
```

---

# 8. Flow Status Kunjungan

```text
Registered
      │
      ▼
Waiting
      │
      ▼
Called
      │
      ▼
Checked In
      │
      ▼
In Progress
      │
      ▼
Completed
      │
      ├──────────────► Pharmacy
      ├──────────────► Laboratory
      ├──────────────► Radiology
      ├──────────────► Billing
      └──────────────► Payment
```