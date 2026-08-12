<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterDataCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('master_kategori_nilai_normal')->insert([
            ['nama' => 'Darah Lengkap', 'keterangan' => 'Kategori nilai normal pemeriksaan darah lengkap', 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Kimia Klinik', 'keterangan' => 'Nilai normal pemeriksaan kimia klinik', 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_pabrik')->insert([
            ['nama_pabrik' => 'PT Kimia Farma Tbk', 'alamat' => 'Jl. Veteran No. 9, Jakarta', 'telepon' => '021-3847709', 'kota' => 'Jakarta', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama_pabrik' => 'PT Dexa Medica', 'alamat' => 'Jl. Raya Serang KM 20', 'telepon' => '021-5988900', 'kota' => 'Tangerang', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama_pabrik' => 'PT Kalbe Farma Tbk', 'alamat' => 'Jl. Jend. A. Yani Pulo Mas', 'telepon' => '021-47830000', 'kota' => 'Jakarta', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_sediaan')->insert([
            ['nama' => 'Tablet', 'keterangan' => 'Sediaan padat tablet', 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Kapsul', 'keterangan' => 'Sediaan padat kapsul', 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Sirup', 'keterangan' => 'Sediaan cair sirup', 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Salep', 'keterangan' => 'Sediaan semi padat', 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Injeksi', 'keterangan' => 'Sediaan cairan steril', 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_satuan')->insert([
            ['nama' => 'Botol', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Strip', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Tablet', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Kapsul', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Vial', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Ampul', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Pcs', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_kelas_terapi')->insert([
            ['nama' => 'Antibiotik', 'keterangan' => 'Kelas terapi antibiotik', 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Analgesik', 'keterangan' => 'Kelas terapi pereda nyeri', 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Antihipertensi', 'keterangan' => 'Kelas terapi tekanan darah', 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Antidiabetik', 'keterangan' => 'Kelas terapi diabetes', 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_kategori_barang')->insert([
            ['nama_kategori' => 'Alat Tulis Kantor', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama_kategori' => 'Kebersihan', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama_kategori' => 'Alat Kesehatan', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_barang_farmasi')->insert([
            [
                'kode_barang' => 'F0001', 'nama_barang' => 'Paracetamol 500 mg', 'jenis' => 'obat',
                'pabrik_id' => 1, 'sediaan_id' => 1, 'satuan_id' => 3, 'kelas_terapi_id' => 2,
                'harga_modal' => 15000, 'harga_jual' => 25000, 'stok_minimum' => 100, 'stok' => 1500,
                'keterangan' => null, 'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'kode_barang' => 'F0002', 'nama_barang' => 'Amoxicillin 500 mg', 'jenis' => 'obat',
                'pabrik_id' => 2, 'sediaan_id' => 1, 'satuan_id' => 3, 'kelas_terapi_id' => 1,
                'harga_modal' => 32000, 'harga_jual' => 45000, 'stok_minimum' => 50, 'stok' => 800,
                'keterangan' => 'Antibiotik spektrum luas', 'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'kode_barang' => 'F0003', 'nama_barang' => 'Amlodipin 10 mg', 'jenis' => 'obat',
                'pabrik_id' => 3, 'sediaan_id' => 1, 'satuan_id' => 3, 'kelas_terapi_id' => 3,
                'harga_modal' => 28000, 'harga_jual' => 40000, 'stok_minimum' => 50, 'stok' => 600,
                'keterangan' => null, 'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'kode_barang' => 'F0004', 'nama_barang' => 'Cairan Infus RL 500 ml', 'jenis' => 'bahan',
                'pabrik_id' => 1, 'sediaan_id' => 5, 'satuan_id' => 5, 'kelas_terapi_id' => null,
                'harga_modal' => 18000, 'harga_jual' => 30000, 'stok_minimum' => 200, 'stok' => 1200,
                'keterangan' => null, 'created_at' => $now, 'updated_at' => $now,
            ],
        ]);

        DB::table('master_barang_rumah_tangga')->insert([
            ['kode_barang' => 'RT001', 'nama_barang' => 'Handuk', 'kategori_barang_id' => 2, 'satuan_id' => 7, 'harga' => 35000, 'stok' => 50, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['kode_barang' => 'RT002', 'nama_barang' => 'Sarung Tangan Medis', 'kategori_barang_id' => 3, 'satuan_id' => 7, 'harga' => 25000, 'stok' => 200, 'keterangan' => 'Steril', 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_barang_gizi')->insert([
            ['kode_barang' => 'GZ001', 'nama_barang' => 'Beras', 'satuan_id' => 7, 'stok' => 300, 'keterangan' => 'Beras premium', 'created_at' => $now, 'updated_at' => $now],
            ['kode_barang' => 'GZ002', 'nama_barang' => 'Susu Full Cream', 'satuan_id' => 1, 'stok' => 80, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_signa_obat')->insert([
            ['signa' => '3x sehari 1 tablet', 'keterangan' => 'Sehabis makan', 'created_at' => $now, 'updated_at' => $now],
            ['signa' => '2x sehari 1 sendok', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['signa' => '1x sehari 1 tablet malam hari', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['signa' => 'Sesuai anjuran dokter', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        $kamarId = DB::table('master_kamar')->value('id');
        if ($kamarId) {
            DB::table('master_bed')->insert([
                ['kamar_id' => $kamarId, 'nomor_bed' => '01', 'status' => 'kosong', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
                ['kamar_id' => $kamarId, 'nomor_bed' => '02', 'status' => 'terisi', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ]);
        }

        DB::table('master_paket_mcu')->insert([
            ['nama_paket' => 'MCU Basic', 'nominal' => 350000, 'keterangan' => 'Pemeriksaan dasar MCU', 'created_at' => $now, 'updated_at' => $now],
            ['nama_paket' => 'MCU Standar', 'nominal' => 650000, 'keterangan' => 'Termasuk EKG & rontgen', 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_paket_tindakan')->insert([
            ['nama_paket' => 'Operasi Kecil', 'nominal' => 1200000, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama_paket' => 'Operasi Caesar', 'nominal' => 5500000, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_instalasi')->insert([
            ['kode' => 'IGD', 'nama_instalasi' => 'Instalasi Gawat Darurat', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['kode' => 'RJL', 'nama_instalasi' => 'Instalasi Rawat Jalan', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['kode' => 'RNA', 'nama_instalasi' => 'Instalasi Rawat Inap', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['kode' => 'IRJ', 'nama_instalasi' => 'Instalasi Radiologi', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_instansi')->insert([
            ['kode' => 'BPJS', 'nama_instansi' => 'BPJS Kesehatan', 'jenis' => 'asuransi', 'alamat' => 'Jl. Letjen Suprapto, Jakarta', 'telepon' => '021-4212938', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['kode' => 'PTK', 'nama_instansi' => 'PT Karyawan Indonesia', 'jenis' => 'perusahaan', 'alamat' => null, 'telepon' => null, 'keterangan' => 'Kerja sama perusahaan', 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_template_expertise')->insert([
            ['nama_template' => 'Konsultasi Umum', 'keterangan' => 'Template expertise dasar', 'created_at' => $now, 'updated_at' => $now],
            ['nama_template' => 'Pasien Diabetes', 'keterangan' => 'Template khusus DM', 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_template_resep_racikan')->insert([
            ['nama_template' => 'Antipiretik', 'keterangan' => 'Racikan penurun panas', 'created_at' => $now, 'updated_at' => $now],
            ['nama_template' => 'Antasida', 'keterangan' => 'Racikan maag', 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_profesi_nakes')->insert([
            ['nama_profesi' => 'Dokter Umum', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama_profesi' => 'Dokter Spesialis', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama_profesi' => 'Perawat', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama_profesi' => 'Bidan', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama_profesi' => 'Apoteker', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_smf')->insert([
            ['kode_smf' => 'SMF-01', 'nama_smf' => 'Ilmu Penyakit Dalam', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['kode_smf' => 'SMF-02', 'nama_smf' => 'Ilmu Bedah', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['kode_smf' => 'SMF-03', 'nama_smf' => 'Obstetri & Ginekologi', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_spesialisasi')->insert([
            ['nama_spesialisasi' => 'Spesialis Penyakit Dalam', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama_spesialisasi' => 'Spesialis Bedah Umum', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama_spesialisasi' => 'Spesialis Anak', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_supplier')->insert([
            ['nama_supplier' => 'PBF Anugrah Farma', 'alamat' => 'Jl. Sudirman 88', 'telepon' => '021-888123', 'kota' => 'Jakarta', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['nama_supplier' => 'PT Enseval Putera Megatrading', 'alamat' => 'Jl. Raya Kalimalang', 'telepon' => '021-8660592', 'kota' => 'Jakarta', 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_item_laboratorium')->insert([
            [
                'kode_item' => 'LAB001', 'nama_pemeriksaan' => 'Hemoglobin', 'kategori_nilai_normal_id' => 1,
                'satuan' => 'g/dL', 'nilai_normal_pria' => '13.0 - 17.0', 'nilai_normal_wanita' => '12.0 - 15.0',
                'harga' => 25000, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'kode_item' => 'LAB002', 'nama_pemeriksaan' => 'Gula Darah Puasa', 'kategori_nilai_normal_id' => 2,
                'satuan' => 'mg/dL', 'nilai_normal_pria' => '70 - 99', 'nilai_normal_wanita' => '70 - 99',
                'harga' => 30000, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now,
            ],
        ]);

        DB::table('master_wilayah')->insert([
            ['kode' => '32', 'nama' => 'Jawa Barat', 'tingkat' => 'provinsi', 'induk_id' => null, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['kode' => '3273', 'nama' => 'Kota Bandung', 'tingkat' => 'kabupaten', 'induk_id' => 1, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['kode' => '327301', 'nama' => 'Coblong', 'tingkat' => 'kecamatan', 'induk_id' => 2, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_rekening')->insert([
            ['kode_rekening' => '4.1.1', 'nama_rekening' => 'Pendapatan Layanan Medis', 'jenis' => 'Pendapatan', 'induk_id' => null, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ['kode_rekening' => '5.1.1', 'nama_rekening' => 'Beban Gaji & Tunjangan', 'jenis' => 'Beban', 'induk_id' => null, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('master_triase_primer')->insert([
            ['kode' => 'P1', 'nama_triase' => 'Emergensi', 'warna' => 'merah', 'keterangan' => 'Harus segera ditangani', 'created_at' => $now, 'updated_at' => $now],
            ['kode' => 'P2', 'nama_triase' => 'Urgen', 'warna' => 'kuning', 'keterangan' => 'Perlu penanganan cepat', 'created_at' => $now, 'updated_at' => $now],
            ['kode' => 'P3', 'nama_triase' => 'Non Urgen', 'warna' => 'hijau', 'keterangan' => 'Dapat menunggu', 'created_at' => $now, 'updated_at' => $now],
        ]);

        $unitId = DB::table('unit_pegawai')->value('id_unit_pegawai');
        if ($unitId) {
            DB::table('master_kuota_poliklinik')->insert([
                ['unit_id' => $unitId, 'hari' => 'Senin', 'waktu' => 'Pagi', 'kuota' => 25, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
                ['unit_id' => $unitId, 'hari' => 'Rabu', 'waktu' => 'Siang', 'kuota' => 20, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ]);
        }

        $pegawaiId = DB::table('pegawai')->value('id_pegawai');
        if ($pegawaiId && $unitId) {
            DB::table('master_jadwal_dokter')->insert([
                ['pegawai_id' => $pegawaiId, 'unit_id' => $unitId, 'hari' => 'Senin', 'jam_mulai' => '08:00', 'jam_selesai' => '14:00', 'kuota' => 20, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
                ['pegawai_id' => $pegawaiId, 'unit_id' => $unitId, 'hari' => 'Jumat', 'jam_mulai' => '13:00', 'jam_selesai' => '17:00', 'kuota' => 15, 'keterangan' => null, 'created_at' => $now, 'updated_at' => $now],
            ]);
        }
    }
}
