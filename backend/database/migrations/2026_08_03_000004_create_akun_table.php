<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('akun', function (Blueprint $table) {
            $table->integer('id_akun')->autoIncrement();
            $table->integer('urut_akun')->nullable();
            $table->string('kode_akun', 100);
            $table->string('nama_akun', 255);
            $table->enum('tipe_akun', ['Aset', 'Kewajiban', 'Modal', 'Pendapatan', 'Beban']);
            $table->unsignedTinyInteger('tipe_akun_id')->nullable();
            $table->integer('parent_akun_id')->nullable();
            $table->unsignedTinyInteger('level')->nullable();
            $table->string('nama_jenis_akun', 100);
            $table->string('nama_sub_akun', 500);
            $table->unsignedBigInteger('arus_kas_id')->nullable();
            $table->unsignedBigInteger('kelompok_arus_kas_id')->nullable();
            $table->unsignedBigInteger('jaminan_id')->nullable();
            $table->unsignedBigInteger('layanan_id')->nullable();
            $table->enum('kategori_laba_rugi', ['Operasional', 'Non Operasional'])->nullable();

            $table->foreign('parent_akun_id')->references('id_akun')->on('akun')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('akun');
    }
};
