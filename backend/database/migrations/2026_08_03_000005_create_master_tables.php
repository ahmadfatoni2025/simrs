<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_tarif', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama_tarif', 255);
            $table->decimal('nominal', 15, 2);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        Schema::create('master_icd_x', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('kode_icd', 20)->unique();
            $table->string('deskripsi', 255);
            $table->timestamps();
        });

        Schema::create('master_diagnosa_keperawatan', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('kode_diagnosa', 30)->unique();
            $table->text('deskripsi_diagnosa');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_diagnosa_keperawatan');
        Schema::dropIfExists('master_icd_x');
        Schema::dropIfExists('master_tarif');
    }
};
