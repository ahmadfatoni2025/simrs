# 🎨 SIMRS UI/UX Design System & Rule Standards
> **Referensi Desain Utama**: Inspired by *Invoicer.ai* Modern Web & Dashboard Case Study.

Panduan standar desain UI/UX ini berlaku untuk seluruh modul aplikasi **SIMRS (Sistem Informasi Manajemen Rumah Sakit)**. Semua komponen, halaman dashboard, form pendaftaran, dan layout dokumen wajib mengikuti aturan estetika ini.

---

## 💎 1. Core Design Philosophy
- **Clean, Modern & Premium**: Menggunakan latar belakang terang *soft off-white slate*, kartu putih bersih ber-sudut membulat (*rounded-2xl*), dan aksen warna *Electric Royal Blue*.
- **Split-Panel & Live Preview**: Membagi layout menjadi panel navigasi kiri, panel form input di tengah, dan panel *live preview* dokumen / cetakan di kanan.
- **High Visual Contrast & Hierarchy**: Judul dibuat tebal dan kontras (*slate-900 font-extrabold*), elemen aksi utama menggunakan tombol biru solid dengan efek *subtle drop shadow*.

---

## 🎨 2. Color Palette & Token Rules (Tailwind CSS)

| Token Key | Tailwind Class | Hex / Usage |
| :--- | :--- | :--- |
| **Primary Brand Accent** | `bg-blue-600` / `text-blue-600` | `#2563EB` (Royal Blue untuk tombol utama & active link) |
| **Primary Hover Accent** | `hover:bg-blue-500` | `#3B82F6` (Hover state tombol & elemen interaktif) |
| **Gradient Accent** | `from-blue-600 via-indigo-600 to-blue-700` | Header Banner & Card Promosi |
| **App Background** | `bg-slate-50` / `bg-[#F8FAFC]` | Latar belakang halaman aplikasi |
| **Card Container** | `bg-white` | Kartu putih bersih dengan `border border-slate-200/60` |
| **Primary Text** | `text-slate-900` | Heading, judul kartu, dan nilai data |
| **Secondary Text** | `text-slate-500` / `text-slate-400` | Subtitle, label form, dan deskripsi |
| **Success Badge** | `bg-emerald-100 text-emerald-700` | Status Selesai / Terverifikasi |
| **Warning Badge** | `bg-amber-100 text-amber-700` | Status Menunggu / Pending |
| **Danger / Alert Badge** | `bg-rose-500 text-white` | Indicator Badge "New" atau Peringatan |

---

## 🧱 3. Component Specification Rules

### A. Sidebar Navigation Panel
- **Active Nav Item**: Pill rounded solid blue (`bg-blue-600 text-white rounded-xl shadow-md font-semibold px-4 py-2.5 flex items-center gap-2`).
- **Inactive Nav Item**: Slate text dengan hover effect (`text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-xl px-4 py-2.5`).
- **Sidebar Promo Card**: Kartu biru gradien di bagian bawah sidebar (`bg-gradient-to-b from-blue-500 to-indigo-600 text-white rounded-2xl p-4 shadow-md`).

### B. Header Banner Card
- **Style**: `bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden`.
- **Dekorasi**: Lingkaran blur semi-transparan di pojok banner (`bg-white/10 blur-2xl rounded-full`).

### C. Drag & Drop Upload Zone
- **Style**: `border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl p-6 text-center hover:bg-blue-50/60 hover:border-blue-400 transition-all cursor-pointer`.
- **Icon**: Ikon `lucide-react` berwarna biru di tengah.

### D. Input Form & Field Control
- **Input / Select Class**:
  ```tsx
  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
  ```
- **Form Label**: `block text-xs font-bold text-slate-700 mb-1`

### E. Buttons Standard
- **Primary Button**: `bg-blue-600 text-white hover:bg-blue-500 active:scale-98 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all`
- **Secondary Button**: `border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-98 font-semibold text-xs px-4 py-2.5 rounded-xl shadow-2xs transition-all`

### F. Live Preview Canvas (Document Sheet)
- **Style**: Floating card putih `bg-white rounded-2xl p-6 shadow-xl border border-slate-200` yang mensimulasikan lembar fisik dokumen (SEP, Rekam Medis, Invoice, Kunjungan).

---

## 📏 4. Corner Radius & Spacing Standard
- **Containers & Cards**: `rounded-2xl` (16px) atau `rounded-3xl` (24px).
- **Buttons & Inputs**: `rounded-xl` (12px).
- **Badges & Pills**: `rounded-full` (9999px).
- **Container Padding**: `p-5` atau `p-6` (20px - 24px).
- **Grid Gap**: `gap-4` atau `gap-6` (16px - 24px).
