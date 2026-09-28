# SIAKAD SMK — Sistem Informasi Akademik Sekolah Vokasi Terpadu

> **Sistem Informasi Akademik SMK Generasi Baru** dengan desain antarmuka berstandar **Tier-1 SaaS (Vercel / Linear / Aceternity Quality)**, arsitektur full-stack clean, dukungan penuh **Mode Terang & Gelap (*Zero-Flash Light/Dark Mode*)**, serta pembagian hak akses terperinci (*Role-Based Access Control*) untuk **Admin**, **Guru**, dan **Siswa**.

---

## ✨ Fitur Unggulan

### 1. 🌟 Landing Page Tier-1 SaaS Aesthetic
- **Floating Island Capsule Navbar**: Glassmorphic capsule navbar melayang (`rounded-full`, backdrop-blur-xl), adaptif terhadap scroll, navigasi anchor halus, dan menu drawer responsif.
- **Atmospheric Hero Section**: Radial spotlight beam, dot matrix mesh, announcement capsule Kurikulum Merdeka, split gradient typography, serta **glassmorphic interactive dashboard mockup** dengan live counters dan floating micro-cards.
- **Proof & Trust Bar**: Indikator metrik sosial terverifikasi (50+ SMK Mitra, 99.8% Uptime, 15.000+ Siswa & Guru Aktif, 100% Kompatibel Kurikulum Merdeka).
- **Asymmetric Bento Grid**:
  - *Card 1 (Span 2 Cols)*: Manajemen PKL & Kemitraan Industri (BKK) dengan interactive mini-timeline status penempatan DUDI.
  - *Card 2 (Span 1 Col)*: Presensi RFID & Geolocation dengan widget verifikasi biometrik mobile.
  - *Card 3 (Span 1 Col)*: Raport Otomatis Kurikulum Merdeka dengan chart capaian bobot 30-30-40.
  - *Card 4 (Span 2 Cols)*: Portal SPP Multi-Payment dengan simulasi WhatsApp auto-notification & settlement status.
  - *Card 5 (Full Width)*: Engine Penjadwalan Otomatis Bebas Bentrok 3 Arah dengan visualisasi slot jadwal harian.
  - *Dynamic Mouse Spotlight*: Setiap kartu bento merespons pergerakan kursor dengan efek radial glow border interaktif.
- **Interactive Financial-Grade ROI Calculator**: Slider ganda dinamis (Jumlah Siswa 200–3.000 & Biaya Kertas/Cetak per Siswa), proyeksi langsung penghematan dana BOS dalam Rupiah, jam kerja staf terpangkas, dan rim kertas terselamatkan.
- **Deep-Dive Feature Tabs**: Antarmuka tab alur kerja spesifik untuk Kepala Sekolah, Guru & Wali Kelas, serta Siswa & Wali Murid dengan visual frame realistis.
- **Modern Pricing Section**: Toggle tagihan Bulanan vs Tahunan (Hemat 20%), 3 tier (Starter, Pro Kejuruan, Enterprise Yayasan), gradient border menyala pada paket Pro, dan checklist fitur transparan.
- **Social Proof & Verified Testimonials**: Review autentik dari berbagai persona SMK (Kepsek, Wakasek Kurikulum, Koordinator BKK, Guru Produktif, Bendahara, Siswa).
- **Animated FAQ Accordion**: Animasi collapsible halus via `framer-motion` seputar integrasi Dapodik/EMIS, validasi jadwal, keamanan data, dan onboarding.
- **High-Impact Closing CTA Banner & Compliance Footer**: Form booking instan, info kepatuhan standar Kemendikbud & UU PDP, dan tombol kembali ke atas.

---

### 2. ⚡ Sistem Inti Akademik & Portal Aplikasi

- **Multi-Role RBAC (Admin, Guru, Siswa)**:
  - **Admin**: Master Data (Jurusan, Kelas, Siswa, Guru, Mapel), Manajemen Jadwal, Kunci Tahun Ajaran & Semester Aktif, Audit Rekapitulasi Nilai Seluruh Rombel.
  - **Guru**: Jadwal Mengajar Interaktif Hari Ini, Rombel yang Diampu, Input Nilai Massal (30% Tugas + 30% UTS + 40% UAS), Auto-Kalkulasi Predikat (A/B/C/D).
  - **Siswa**: Jadwal Pelajaran Harian Real-time, Transkrip Akademik Lengkap, Lembar E-Raport Resmi Siap Cetak PDF (Format A4).
- **Deteksi Bentrok Jadwal 3 Arah (*Conflict Prevention*)**:
  - Mencegah guru mengajar di 2 kelas berbeda pada waktu bersamaan.
  - Mencegah kelas menerima 2 mata pelajaran pada jam yang sama.
  - Mencegah ruangan/lab kejuruan digunakan bersamaan oleh rombel lain.
- **Integritas Semester Aktif**: Sistem memberlakukan aturan ketat hanya satu semester berstatus Aktif pada satu waktu.
- **Zero-Flash Light & Dark Mode**: Skrip inisialisasi pada `<head>` HTML memastikan render instan tanpa kedipan putih saat reload.

---

## 🚀 Demo Akun & Kredensial Instan

Halaman beranda dan halaman login dilengkapi modal **1-Click Demo Login** tanpa registrasi:

| Peran | Identitas Login | Kata Sandi | Cakupan Hak Akses |
|---|---|---|---|
| **ADMIN** | `admin@example.com` | `admin123` | Akses penuh Master Data, Jadwal, Kurikulum, Audit Nilai, Akun Pengguna |
| **GURU** | `guru@example.com` | `guru123` | Jadwal Mengajar, Rombel Binaan, Input Nilai Massal, Kalkulasi Nilai Akhir |
| **SISWA** | `siswa@example.com` | `siswa123` | Jadwal Pelajaran, Transkrip Nilai, Lembar E-Raport Siap Cetak PDF |

*(Pengguna juga dapat masuk menggunakan Nomor Induk Siswa (NIS) atau NIP Guru).*

---

## 🏛️ Model Data Relasional & Skema Prisma

Model database dirancang menggunakan **Prisma ORM & MariaDB / MySQL**:

1. **Jurusan (`jurusan`)**: `id_jurusan` (PK), `kode_jurusan` (Unique), `nama_jurusan`
2. **Kelas (`kelas`)**: `id_kelas` (PK), `id_jurusan` (FK), `tingkat` (X, XI, XII), `nama_kelas`
3. **Siswa (`siswa`)**: `nis` (PK), `id_kelas` (FK), `nama_siswa`, `jenis_kelamin`, `tanggal_lahir`, `alamat`
4. **Guru (`guru`)**: `id_guru` (PK), `nip` (Unique), `nama_guru`, `email` (Unique), `no_hp`
5. **Mata Pelajaran (`mata_pelajaran`)**: `id_mapel` (PK), `kode_mapel` (Unique), `nama_mapel`, `kelompok`
6. **Jadwal (`jadwal`)**: `id_jadwal` (PK), `id_guru` (FK), `id_kelas` (FK), `id_mapel` (FK), `hari`, `jam_mulai`, `jam_selesai`, `ruang`
7. **Tahun Ajaran (`tahun_ajaran`)**: `id_tahun_ajaran` (PK), `tahun_ajaran`, `semester` ('Ganjil'/'Genap'), `status` ('Aktif'/'Tidak Aktif')
8. **Nilai (`nilai`)**: `id_nilai` (PK), `nis` (FK), `id_tahun_ajaran` (FK), `id_guru` (FK), `id_mapel` (FK), `nilai_tugas`, `nilai_uts`, `nilai_uas`, `nilai_akhir`
9. **Pengguna (`users`)**: `id` (PK), `email`, `password` (bcrypt hash), `role` (ADMIN, GURU, SISWA), `id_guru` (opsional), `nis` (opsional)

---

## 💻 Tech Stack

### Frontend:
- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v3 + Tailwind Merge + CLSX
- **Animations**: Framer Motion v13
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Typography**: Plus Jakarta Sans

### Backend:
- **Runtime**: Node.js + Express 4 + TypeScript
- **Database & ORM**: MariaDB / MySQL + Prisma ORM v6
- **Authentication**: JWT (JSON Web Tokens) + Bcrypt Password Hashing
- **Validation**: Zod Schemas

---

## 🛠️ Panduan Instalasi & Menjalankan Aplikasi

### Prasyarat Sistem:
- Node.js v18+ (Rekomendasi v20/v22/v24)
- PNPM v9+ (`npm install -g pnpm`)
- MariaDB atau MySQL berjalan di port `3306`

### 1. Clone Repository & Install Dependensi
```bash
git clone https://github.com/RajaYappingg/siakad-smk.git
cd siakad-smk
pnpm install
```

### 2. Konfigurasi Environment (`.env`)
Salin file `.env.example` ke `server/.env`:
```env
PORT=5000
DATABASE_URL="mysql://siakad:siakad123@localhost:3306/siakad_db"
JWT_SECRET="siakad_super_secure_jwt_secret_key_2026_modern_blue"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

### 3. Sinkronisasi Database & Seeding
```bash
# Push schema Prisma ke database MySQL/MariaDB
pnpm --filter server exec prisma db push

# Jalankan database seeding data awal realistis
pnpm db:seed
```

### 4. Jalankan Aplikasi (Fullstack Concurrent)
```bash
pnpm dev
```

- **Frontend Landing Page & Portal**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000`

---

## 📄 Lisensi
Hak Cipta © 2026 **SIAKAD SMK Indonesia**. Dilindungi oleh lisensi MIT.
