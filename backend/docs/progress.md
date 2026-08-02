# Catatan Progress — SIMRSMB Backend

Ringkasan pekerjaan yang telah dilakukan pada proyek `/home/tony/SIMRS/backend`.

---

## 1. Inisialisasi & Setup

- Kloning referensi code `simrsmb26/SIMRSMB` (Laravel) sebagai acuan controller, model, migrasi, trait `HasAuditTrail`, middleware `CheckRole`, dan seeder.
- Setup backend Laravel baru (PHP 8.5, Laravel 13, Sanctum, Pest 5).
- Data master API dibangun ulang di dalam backend ini, **bukan** meng-copy mentah repo referensi.

## 2. Database

- Awalnya memakai SQLite (default), kemudian **dialihkan ke MySQL/MariaDB** atas permintaan pengguna.
- Database: `simrsmb`, host lokal.
- Migrasi + seeder dijalankan, data awal terisi.

## 3. Struktur Kode

### Migrasi (tabel-tabel)
- `users` (ditambah kolom `role`)
- `audit_logs`
- `unit_pegawai`
- `sub_unit_pegawai`
- `master_kamar`
- `pegawai`
- `akun` (self-reference `parent_akun_id`)
- `master_tarif`
- `master_icd_x`
- `master_diagnosa_keperawatan`
- `data_jaminan`
- `master_penjamin`
- Foreign key antar tabel dibangun sesuai alur referensi.

### Model
- `User`, `AuditLog`, `UnitPegawai`, `SubUnitPegawai`, `MasterKamar`, `Pegawai`, `Akun`, `MasterTarif`, `MasterIcdX`, `MasterDiagnosaKeperawatan`, `DataJaminan`, `MasterPenjamin`.

### Controller API (`app/Http/Controllers/Api/MasterData`)
- `UnitPegawaiController`, `SubUnitPegawaiController`, `KamarController`, `PegawaiController`, `AkunController`, `TarifController`, `IcdXController`, `DiagnosaKeperawatanController`, `PenjaminController`.
- Support: `index` (paginasi + `?search=`), `show`, `store`, `update`, `destroy`.
- Resource `pegawai`: ada pengecualian record sendiri pada field unique saat `update`.

### Fitur pendukung
- Trait `HasAuditTrail` — mencatat aktivitas tulis ke `audit_logs`.
- Middleware `CheckRole` — akses tulis hanya `super`/`admin`, baca untuk semua role.
- `routes/api.php` — daftar 45 endpoint REST di bawah prefix `/api/master-data`.

## 4. Autentikasi & Role

- Sanctum token untuk autentikasi.
- Role user: `super`, `admin`, `user`.
- Akses tulis (POST/PUT/DELETE) dibatasi `super`/`admin`; tanpa token → 401; role `user` → 403.

## 5. Endpoint API

9 resource, masing-masing 5 method:

| Resource | Path |
|---|---|
| Unit Pegawai | `/api/master-data/unit-pegawai` |
| Sub-unit Pegawai | `/api/master-data/sub-unit-pegawai` |
| Kamar | `/api/master-data/kamar` |
| Pegawai | `/api/master-data/pegawai` |
| Akun | `/api/master-data/akun` |
| Tarif | `/api/master-data/tarif` |
| ICD X | `/api/master-data/icd-x` |
| Diagnosa Keperawatan | `/api/master-data/diagnosa-keperawatan` |
| Penjamin | `/api/master-data/penjamin` |

## 6. Dokumentasi

- Di `/resources/views/welcome.blade.php` dibangun halaman visual interaktif:
  - Diagram ERD dengan node-kartu tabel.
  - **Kabel FK → PK** yang tergambar otomatis.
  - Pan, zoom, drag tabel dengan posisi yang **live-update saat di-seret**.
  - Legend FK (oranye) dan PK (ungu).
  - Daftar semua link endpoint API berwarna per method, dapat diklik.
- Halaman di-`route` `/` → info skema DB + daftar route API.
- Snapshot statis disimpan di:
  - `docs/api-documentation.html`
  - `docs/api-documentation.md`

## 7. Konfigurasi linting

- Mengikuti standar **Laravel Pint** (`vendor/bin/pint --dirty --format agent`).

---

## Dokumentasi Terkait

| File | Isi |
|---|---|
| `docs/api-documentation.html` | Dokumentasi API (interaktif, snapshot halaman `/`) |
| `docs/api-documentation.md` | Dokumentasi API dalam format Markdown |
| `docs/progress.md` | File ini — ringkasan apa saja yang sudah dilakukan |

---

## Kemungkinan Langkah Berikutnya

- Membuat resource API tambahan (mis. pendaftaran, jadwal, layanan).
- Menambahkan lebih banyak test role/otorisasi.
- Hardening Security (rate limiting, validasi lebih ketat).