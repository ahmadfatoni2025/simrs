<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unit_pegawai', function (Blueprint $table) {
            $table->integer('id_unit_pegawai')->autoIncrement();
            $table->string('nama_unit_pegawai', 125);
            $table->integer('id_bidang_pegawai')->nullable();
        });

        Schema::create('sub_unit_pegawai', function (Blueprint $table) {
            $table->integer('id_sub_unit_pegawai')->autoIncrement();
            $table->integer('id_unit_pegawai');
            $table->string('nama_sub_unit_pegawai', 125);
            $table->decimal('point', 10, 2);

            $table->foreign('id_unit_pegawai')->references('id_unit_pegawai')->on('unit_pegawai')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sub_unit_pegawai');
        Schema::dropIfExists('unit_pegawai');
    }
};
