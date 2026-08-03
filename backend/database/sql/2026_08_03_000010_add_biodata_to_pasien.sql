-- ============================================================
-- SIMRS :: Menambahkan kolom biodata pada tabel `pasien`
-- DB target: MySQL / MariaDB
-- Aman dijalankan ulang (idempotent) pada database yang sudah
-- pernah dijalankan: kolom yang sudah ada akan dilewati.
-- ============================================================

USE `simrsmb`;

-- 1) Kolom baru
ALTER TABLE `pasien`
    ADD COLUMN IF NOT EXISTS `nik` varchar(20) NULL UNIQUE AFTER `nomor_rekam_medis`,
    ADD COLUMN IF NOT EXISTS `tempat_lahir` varchar(125) NULL AFTER `nama_pasien`,
    ADD COLUMN IF NOT EXISTS `agama` varchar(40) NULL AFTER `tanggal_lahir`,
    ADD COLUMN IF NOT EXISTS `status_pernikahan` enum('Belum Menikah','Menikah','Cerai','Janda','Duda') NULL AFTER `agama`,
    ADD COLUMN IF NOT EXISTS `email` varchar(125) NULL AFTER `no_telepon`,
    ADD COLUMN IF NOT EXISTS `kecamatan` varchar(125) NULL AFTER `alamat`,
    ADD COLUMN IF NOT EXISTS `kabupaten` varchar(125) NULL AFTER `kecamatan`,
    ADD COLUMN IF NOT EXISTS `provinsi` varchar(125) NULL AFTER `kabupaten`,
    ADD COLUMN IF NOT EXISTS `penjamin` varchar(255) NULL AFTER `provinsi`,
    ADD COLUMN IF NOT EXISTS `upload_ktp` varchar(255) NULL AFTER `penjamin`,
    ADD COLUMN IF NOT EXISTS `upload_kk` varchar(255) NULL AFTER `upload_ktp`,
    ADD COLUMN IF NOT EXISTS `upload_bpjs` varchar(255) NULL AFTER `upload_kk`;

-- ============================================================
-- CATATAN:
--  * `ADD COLUMN IF NOT EXISTS` didukung MySQL >= 8.0.29 dan
--    MariaDB >= 10.x. Untuk MySQL versi lama gunakan file
--    `..._legacy.sql` (tanpa IF NOT EXISTS) atau jalankan hanya
--    kolom yang belum ada.
--  * Index unik NIK dibuat otomatis oleh `UNIQUE` di atas.
--    Jika perlu index eksplisit:
--      ALTER TABLE `pasien` ADD UNIQUE INDEX `pasien_nik_unique` (`nik`);
-- ============================================================
