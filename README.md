# SIMRS — Sistem Informasi Manajemen Rumah Sakit

SIMRS adalah aplikasi **Sistem Informasi Manajemen Rumah Sakit** berbasis web yang dikembangkan untuk membantu proses pengelolaan data dan pelayanan rumah sakit secara terintegrasi.

Project ini dikembangkan dengan pendekatan **full-stack application**, yang terdiri dari backend sebagai penyedia layanan API dan pengelolaan database serta frontend sebagai antarmuka pengguna.

Repository ini ditujukan sebagai dasar pengembangan sistem informasi rumah sakit yang modular, terstruktur, dan dapat dikembangkan sesuai kebutuhan fasilitas pelayanan kesehatan.

## Repository

Repository utama:

https://github.com/ahmadfatoni2025/SIMRS

## Struktur Project

```text
SIMRS/
├── backend/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── docs/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── tests/
│   ├── .env.example
│   ├── artisan
│   ├── composer.json
│   ├── package.json
│   └── vite.config.js
│
├── frontend/
│   ├── app/
│   ├── public/
│   │   └── img/
│   ├── Dockerfile
│   ├── package.json
│   ├── react-router.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docs/
│   ├── 01 Master-data/
│   └── 01 Registrasi-Loket/
│
└── README.md
```

Struktur repository memisahkan backend, frontend, dan dokumentasi sehingga pengembangan masing-masing bagian dapat dilakukan secara lebih terorganisir.

## Teknologi

### Backend

Backend dibangun menggunakan:

* PHP
* Laravel
* Composer
* Vite
* PHPUnit

Backend menggunakan struktur standar Laravel dengan komponen utama seperti:

* `app/` — logic aplikasi
* `config/` — konfigurasi aplikasi
* `database/` — migration, seeder, dan database-related files
* `routes/` — routing aplikasi
* `resources/` — resource aplikasi
* `storage/` — file dan log aplikasi
* `tests/` — pengujian aplikasi

### Frontend

Frontend menggunakan:

* React
* React Router
* TypeScript
* Vite
* Tailwind CSS
* Node.js / npm

Frontend dirancang sebagai aplikasi web modern dengan dukungan routing, component-based development, dan styling menggunakan Tailwind CSS.

## Modul SIMRS

SIMRS dirancang untuk mendukung pengembangan berbagai modul pelayanan dan administrasi rumah sakit.

Beberapa area yang menjadi bagian dari pengembangan antara lain:

* Master Data
* Registrasi / Loket
* Data Pasien
* Pelayanan Pasien
* Rekam Medis
* Rawat Jalan
* Rawat Inap
* Instalasi Gawat Darurat
* Farmasi
* Laboratorium
* Radiologi
* Manajemen
* Pelaporan
* Integrasi sistem eksternal

> Daftar modul akan terus dikembangkan mengikuti kebutuhan sistem.

## Dokumentasi

Dokumentasi sistem berada pada folder:

```text
docs/
```

Dokumentasi yang tersedia saat ini mencakup beberapa bagian seperti:

```text
docs/
├── 01 Master-data/
└── 01 Registrasi-Loket/
```

Dokumentasi digunakan sebagai referensi dalam memahami alur bisnis, master data, dan proses pelayanan yang terdapat dalam SIMRS.

## Persyaratan Sistem

Sebelum menjalankan project, pastikan environment pengembangan sudah memiliki:

* PHP
* Composer
* Node.js
* npm
* Database yang digunakan oleh aplikasi
* Git

Versi dependency sebaiknya mengikuti konfigurasi yang terdapat pada `composer.json` dan `package.json`.

## Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/ahmadfatoni2025/SIMRS.git
cd SIMRS
```

Project terdiri dari dua bagian utama, yaitu backend dan frontend.

---

## Setup Backend

Masuk ke direktori backend:

```bash
cd backend
```

Install dependency PHP:

```bash
composer install
```

Install dependency JavaScript:

```bash
npm install
```

Buat file environment:

```bash
cp .env.example .env
```

Kemudian generate application key:

```bash
php artisan key:generate
```

Atur konfigurasi database pada file:

```text
backend/.env
```

Contoh konfigurasi:

```env
APP_NAME=SIMRS
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simrs
DB_USERNAME=root
DB_PASSWORD=
```

Sesuaikan konfigurasi database dengan environment masing-masing.

Jalankan migration:

```bash
php artisan migrate
```

Jika project memiliki seeder, jalankan:

```bash
php artisan db:seed
```

---

## Menjalankan Backend

Untuk menjalankan server Laravel:

```bash
php artisan serve
```

Secara default aplikasi dapat diakses melalui:

```text
http://127.0.0.1:8000
```

Untuk menjalankan Vite pada backend jika diperlukan:

```bash
npm run dev
```

---

## Setup Frontend

Buka terminal baru kemudian masuk ke direktori frontend:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Frontend secara default dapat diakses melalui:

```text
http://localhost:5173
```

## Build Frontend

Untuk membuat production build:

```bash
npm run build
```

Hasil build akan digunakan untuk proses deployment sesuai konfigurasi aplikasi.

## Development Workflow

Alur pengembangan yang disarankan:

```text
Developer
   │
   ├── Frontend
   │     ├── React
   │     ├── TypeScript
   │     └── React Router
   │
   └── Backend
         ├── Laravel
         ├── API
         ├── Database
         └── Business Logic
```

Secara umum:

1. Frontend menangani tampilan dan interaksi pengguna.
2. Frontend berkomunikasi dengan backend melalui API.
3. Backend menangani business logic dan validasi.
4. Backend berkomunikasi dengan database.
5. Data dikembalikan kepada frontend untuk ditampilkan kepada pengguna.

## Database

Konfigurasi database dilakukan melalui file:

```text
backend/.env
```

Jangan menyimpan credential database, API key, password, token, atau secret lainnya ke dalam repository.

Gunakan `.env` untuk konfigurasi lokal dan `.env.example` sebagai template konfigurasi.

## Environment Variables

Contoh konfigurasi environment:

```env
APP_NAME=SIMRS
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simrs
DB_USERNAME=root
DB_PASSWORD=
```

Nilai environment harus disesuaikan dengan konfigurasi server masing-masing.

## Testing

Backend menyediakan struktur testing Laravel/PHPUnit.

Untuk menjalankan test:

```bash
cd backend
php artisan test
```

Atau:

```bash
./vendor/bin/phpunit
```

Testing digunakan untuk membantu memastikan perubahan kode tidak merusak fungsi yang sudah tersedia.

## Code Quality

Sebelum melakukan commit, pastikan:

* Tidak terdapat error pada aplikasi.
* Migration dapat dijalankan.
* API dapat digunakan dengan normal.
* Frontend dapat melakukan build.
* Tidak ada credential atau secret yang ikut ter-commit.
* Perubahan sudah diuji secara lokal.

## Git Workflow

Gunakan branch terpisah untuk pengembangan fitur.

Contoh:

```bash
git checkout -b feature/registrasi-pasien
```

Setelah selesai melakukan perubahan:

```bash
git status
git add .
git commit -m "feat: menambahkan modul registrasi pasien"
git push origin feature/registrasi-pasien
```

Untuk perbaikan bug:

```bash
git checkout -b fix/perbaikan-registrasi
```

Gunakan commit message yang jelas agar histori project mudah dipahami.

Contoh prefix commit:

```text
feat: fitur baru
fix: perbaikan bug
refactor: perubahan struktur kode
docs: perubahan dokumentasi
style: perubahan format/style
test: penambahan atau perubahan test
chore: maintenance project
```

## Keamanan

SIMRS menangani data yang berpotensi bersifat sensitif. Oleh karena itu, keamanan harus menjadi bagian penting dalam pengembangan.

Jangan pernah melakukan commit terhadap:

```text
.env
database credentials
API keys
access tokens
private keys
password
secret configuration
```

Gunakan environment variable untuk menyimpan informasi rahasia.

Selain itu, implementasikan:

* Authentication
* Authorization / Role Based Access Control
* Input validation
* Output sanitization
* Secure password hashing
* Session security
* API authentication
* Audit logging
* Database backup
* HTTPS pada production

## Deployment

Untuk production, konfigurasi environment harus menggunakan:

```env
APP_ENV=production
APP_DEBUG=false
```

Jangan menjalankan production menggunakan konfigurasi development.

Sebelum deployment:

```bash
cd backend

composer install --no-dev --optimize-autoloader

php artisan migrate --force

php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Untuk frontend:

```bash
cd frontend

npm install
npm run build
```

Deployment dapat disesuaikan dengan infrastruktur yang digunakan, seperti VPS, Docker, cloud server, atau platform hosting lainnya.

## Docker

Frontend repository saat ini memiliki `Dockerfile`, sehingga deployment berbasis container dapat dikembangkan sesuai kebutuhan project.

Contoh proses build:

```bash
cd frontend

docker build -t simrs-frontend .
```

Kemudian jalankan container sesuai konfigurasi port dan environment yang digunakan.

## Kontribusi

Kontribusi terhadap project sangat terbuka.

Sebelum membuat perubahan besar, disarankan untuk:

1. Membuat branch baru.
2. Menjelaskan tujuan perubahan.
3. Mengikuti struktur project yang sudah ada.
4. Melakukan testing.
5. Membuat commit yang jelas.
6. Membuat Pull Request jika workflow project menggunakannya.

Contoh:

```bash
git checkout -b feature/nama-fitur
```

Setelah selesai:

```bash
git add .
git commit -m "feat: menambahkan nama fitur"
git push origin feature/nama-fitur
```

## Status Project

Project SIMRS masih dalam tahap pengembangan.

Beberapa modul dan fungsi dapat mengalami perubahan seiring perkembangan kebutuhan sistem.

Struktur aplikasi juga dapat berubah untuk meningkatkan maintainability, scalability, security, dan usability.

## Roadmap

Pengembangan selanjutnya dapat mencakup:

* [ ] Master Data Rumah Sakit
* [ ] Manajemen Data Pasien
* [ ] Registrasi Pasien
* [ ] Sistem Antrian
* [ ] Rawat Jalan
* [ ] Rawat Inap
* [ ] IGD
* [ ] Rekam Medis
* [ ] Farmasi
* [ ] Laboratorium
* [ ] Radiologi
* [ ] Billing
* [ ] Pelaporan
* [ ] Manajemen User dan Role
* [ ] Audit Log
* [ ] Dashboard
* [ ] API Integration
* [ ] Integrasi BPJS
* [ ] Integrasi SATUSEHAT
* [ ] Backup dan Restore
* [ ] Monitoring dan Logging
* [ ] Automated Testing
* [ ] CI/CD

## Disclaimer

SIMRS ini merupakan project perangkat lunak yang masih dalam tahap pengembangan.

Penggunaan pada lingkungan rumah sakit nyata harus memperhatikan aspek keamanan, privasi data, regulasi pelayanan kesehatan, validasi proses bisnis, serta standar dan ketentuan yang berlaku.

Jangan menggunakan data pasien asli pada environment development atau testing tanpa mekanisme perlindungan dan otorisasi yang sesuai.

## Lisensi

Lisensi project mengikuti ketentuan yang ditetapkan oleh pemilik repository.

Jika belum terdapat file `LICENSE`, tentukan lisensi project sebelum distribusi atau penggunaan oleh pihak lain.

## Developer

Developed by **Ahmad Fatoni**

GitHub:

https://github.com/ahmadfatoni2025

Repository:

https://github.com/ahmadfatoni2025/SIMRS

---

## SIMRS

**Sistem Informasi Manajemen Rumah Sakit**

Built for better healthcare information management.
