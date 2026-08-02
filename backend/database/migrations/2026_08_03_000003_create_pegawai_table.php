<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pegawai', function (Blueprint $table) {
            $table->integer('id_pegawai')->autoIncrement();
            $table->string('nik_pegawai', 125)->unique();
            $table->integer('id_bidang_pegawai');
            $table->integer('id_unit_pegawai');
            $table->integer('id_sub_unit_pegawai');
            $table->integer('id_status_kontrak_pegawai');
            $table->string('nama_pegawai', 125);
            $table->string('no_ktp_pegawai', 125)->unique();
            $table->enum('jenis_kelamin_pegawai', ['L', 'P']);
            $table->string('pernikahan_pegawai', 125);
            $table->integer('id_profesi_pegawai');
            $table->integer('id_level_kompetensi')->nullable();
            $table->integer('id_ptkp')->nullable();
            $table->string('tempat_lahir_pegawai', 125);
            $table->date('tanggal_lahir_pegawai');
            $table->string('alamat_pegawai', 125)->nullable();
            $table->date('tgl_orientasi_pegawai')->nullable();
            $table->date('tgl_magang_pegawai')->nullable();
            $table->date('tgl_kontrak_pegawai')->nullable();
            $table->string('no_str_pegawai', 125)->nullable()->unique();
            $table->string('no_estr_pegawai', 125)->nullable()->unique();
            $table->string('no_sip_pegawai', 125)->nullable()->unique();
            $table->date('tgl_sip_pegawai')->nullable();
            $table->date('tgl_berakhir_sip_pegawai')->nullable();
            $table->enum('pegawai_keluar', ['Aktif', 'Pensiun', 'Mutasi', 'Resign', 'Selesai Kontrak', 'Diberhentikan'])->nullable();
            $table->bigInteger('id_spesialis')->unsigned()->nullable();
            $table->integer('is_ka_unit')->nullable();
            $table->integer('is_kabid')->nullable();
            $table->integer('is_direktur')->nullable();
            $table->integer('is_kasi')->nullable();
            $table->integer('non_point')->nullable();

            $table->foreign('id_sub_unit_pegawai')->references('id_sub_unit_pegawai')->on('sub_unit_pegawai');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pegawai');
    }
};
