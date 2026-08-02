<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_kamar', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama_kamar', 255);
            $table->enum('kelas', ['VIP', 'VIP B', 'I', 'II', 'III', 'ISOLASI', 'ICU']);
            $table->integer('jumlah_tempat_tidur')->default(1);
            $table->integer('sub_unit_id');
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->foreign('sub_unit_id')->references('id_sub_unit_pegawai')->on('sub_unit_pegawai')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_kamar');
    }
};
