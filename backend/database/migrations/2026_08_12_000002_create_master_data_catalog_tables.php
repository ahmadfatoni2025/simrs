<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Katalog master data (modul Master Data) — entitas tambahan selain
     * master_tarif, master_icd_x, master_diagnosa_keperawatan, penjamin,
     * kamar, akun, unit_pegawai, sub_unit_pegawai & pegawai yang sudah ada.
     */
    public function up(): void
    {
        // 1. Kategori Nilai Normal
        Schema::create('master_kategori_nilai_normal', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama', 255);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 2. Pabrik
        Schema::create('master_pabrik', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama_pabrik', 255);
            $table->string('alamat', 255)->nullable();
            $table->string('telepon', 50)->nullable();
            $table->string('kota', 100)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 3. Sediaan (bentuk sediaan obat)
        Schema::create('master_sediaan', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama', 255);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 4. Satuan
        Schema::create('master_satuan', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama', 100);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 5. Kelas Terapi
        Schema::create('master_kelas_terapi', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama', 255);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 6. Barang Farmasi
        Schema::create('master_barang_farmasi', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('kode_barang', 50)->unique();
            $table->string('nama_barang', 255);
            $table->enum('jenis', ['obat', 'bahan', 'alkes'])->default('obat');
            $table->unsignedBigInteger('pabrik_id')->nullable();
            $table->unsignedBigInteger('sediaan_id')->nullable();
            $table->unsignedBigInteger('satuan_id')->nullable();
            $table->unsignedBigInteger('kelas_terapi_id')->nullable();
            $table->decimal('harga_modal', 15, 2)->default(0);
            $table->decimal('harga_jual', 15, 2)->default(0);
            $table->decimal('stok_minimum', 12, 2)->default(0);
            $table->decimal('stok', 12, 2)->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 7. Kategori Barang
        Schema::create('master_kategori_barang', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama_kategori', 255);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 8. Barang Rumah Tangga
        Schema::create('master_barang_rumah_tangga', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('kode_barang', 50)->unique();
            $table->string('nama_barang', 255);
            $table->unsignedBigInteger('kategori_barang_id')->nullable();
            $table->unsignedBigInteger('satuan_id')->nullable();
            $table->decimal('harga', 15, 2)->default(0);
            $table->decimal('stok', 12, 2)->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 9. Barang Gizi
        Schema::create('master_barang_gizi', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('kode_barang', 50)->unique();
            $table->string('nama_barang', 255);
            $table->unsignedBigInteger('satuan_id')->nullable();
            $table->decimal('stok', 12, 2)->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 10. Signa Obat
        Schema::create('master_signa_obat', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('signa', 255);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 11. Kelas Kamar / Bed
        Schema::create('master_bed', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('kamar_id');
            $table->string('nomor_bed', 50);
            $table->enum('status', ['kosong', 'terisi'])->default('kosong');
            $table->text('keterangan')->nullable();
            $table->timestamps();
            $table->unique(['kamar_id', 'nomor_bed']);
        });

        // 12. Paket MCU
        Schema::create('master_paket_mcu', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama_paket', 255);
            $table->decimal('nominal', 15, 2)->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 13. Paket Tindakan
        Schema::create('master_paket_tindakan', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama_paket', 255);
            $table->decimal('nominal', 15, 2)->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 14. Instalasi
        Schema::create('master_instalasi', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('kode', 30)->nullable();
            $table->string('nama_instalasi', 255);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 15. Instansi
        Schema::create('master_instansi', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('kode', 30)->nullable();
            $table->string('nama_instansi', 255);
            $table->enum('jenis', ['asuransi', 'perusahaan', 'instansi', 'pribadi'])->default('instansi');
            $table->string('alamat', 255)->nullable();
            $table->string('telepon', 50)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 16. Template Expertise
        Schema::create('master_template_expertise', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama_template', 255);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 17. Template Resep Racikan
        Schema::create('master_template_resep_racikan', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama_template', 255);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 18. Profesi Tenaga Kesehatan
        Schema::create('master_profesi_nakes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama_profesi', 255);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 19. SMF
        Schema::create('master_smf', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('kode_smf', 30)->nullable();
            $table->string('nama_smf', 255);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 20. Spesialisasi
        Schema::create('master_spesialisasi', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama_spesialisasi', 255);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 21. Supplier / PBF
        Schema::create('master_supplier', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama_supplier', 255);
            $table->string('alamat', 255)->nullable();
            $table->string('telepon', 50)->nullable();
            $table->string('kota', 100)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 22. Item Laboratorium
        Schema::create('master_item_laboratorium', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('kode_item', 50)->unique();
            $table->string('nama_pemeriksaan', 255);
            $table->unsignedBigInteger('kategori_nilai_normal_id')->nullable();
            $table->string('satuan', 100)->nullable();
            $table->string('nilai_normal_pria', 100)->nullable();
            $table->string('nilai_normal_wanita', 100)->nullable();
            $table->decimal('harga', 15, 2)->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 23. Wilayah
        Schema::create('master_wilayah', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('kode', 30)->nullable();
            $table->string('nama', 255);
            $table->enum('tingkat', ['provinsi', 'kabupaten', 'kecamatan', 'kelurahan'])->default('kecamatan');
            $table->unsignedBigInteger('induk_id')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 24. Rekening
        Schema::create('master_rekening', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('kode_rekening', 50);
            $table->string('nama_rekening', 255);
            $table->enum('jenis', ['Aset', 'Kewajiban', 'Modal', 'Pendapatan', 'Beban'])->default('Beban');
            $table->unsignedBigInteger('induk_id')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 25. Triase Primer
        Schema::create('master_triase_primer', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('kode', 30)->nullable();
            $table->string('nama_triase', 255);
            $table->string('warna', 20)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 26. Kuota Poliklinik
        Schema::create('master_kuota_poliklinik', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('unit_id');
            $table->enum('hari', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']);
            $table->enum('waktu', ['Pagi', 'Siang', 'Sore'])->nullable();
            $table->integer('kuota')->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 27. Jadwal Dokter
        Schema::create('master_jadwal_dokter', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('pegawai_id');
            $table->unsignedBigInteger('unit_id');
            $table->enum('hari', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']);
            $table->time('jam_mulai')->nullable();
            $table->time('jam_selesai')->nullable();
            $table->integer('kuota')->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        $tables = [
            'master_jadwal_dokter',
            'master_kuota_poliklinik',
            'master_triase_primer',
            'master_rekening',
            'master_wilayah',
            'master_item_laboratorium',
            'master_supplier',
            'master_spesialisasi',
            'master_smf',
            'master_profesi_nakes',
            'master_template_resep_racikan',
            'master_template_expertise',
            'master_instansi',
            'master_instalasi',
            'master_paket_tindakan',
            'master_paket_mcu',
            'master_bed',
            'master_signa_obat',
            'master_barang_gizi',
            'master_barang_rumah_tangga',
            'master_kategori_barang',
            'master_barang_farmasi',
            'master_kelas_terapi',
            'master_satuan',
            'master_sediaan',
            'master_pabrik',
            'master_kategori_nilai_normal',
        ];

        foreach ($tables as $table) {
            Schema::dropIfExists($table);
        }
    }
};
