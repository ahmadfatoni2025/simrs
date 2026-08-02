<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pasien', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_rekam_medis', 20)->unique();
            $table->string('nama_pasien', 125);
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->date('tanggal_lahir');
            $table->string('alamat', 255)->nullable();
            $table->string('no_telepon', 20)->nullable();
            $table->timestamps();
        });

        Schema::create('pendaftaran', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_pendaftaran', 20)->unique();
            $table->foreignId('id_pasien')->constrained('pasien')->cascadeOnDelete();
            $table->integer('id_poli');
            $table->integer('id_dokter');
            $table->enum('status', ['Menunggu', 'Diperiksa', 'Selesai'])->default('Menunggu');
            $table->date('tanggal')->index();
            $table->timestamps();

            $table->foreign('id_poli')->references('id_sub_unit_pegawai')->on('sub_unit_pegawai');
            $table->foreign('id_dokter')->references('id_pegawai')->on('pegawai');
        });

        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pendaftaran')->constrained('pendaftaran')->cascadeOnDelete();
            $table->decimal('nominal', 15, 2);
            $table->enum('metode', ['Tunai', 'BPJS', 'Asuransi'])->default('Tunai');
            $table->date('tanggal_bayar')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
        Schema::dropIfExists('pendaftaran');
        Schema::dropIfExists('pasien');
    }
};