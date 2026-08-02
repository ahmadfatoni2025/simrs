<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_jaminan', function (Blueprint $table) {
            $table->bigIncrements('id_jaminan');
            $table->string('nama_jaminan', 255)->nullable();
            $table->timestamps();
        });

        Schema::create('master_penjamin', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('id_jaminan');
            $table->string('nama_penjamin_sistem', 255);
            $table->string('kode_penjamin_bpjs', 50)->nullable();
            $table->enum('status_aktif', ['1', '0'])->default('1');
            $table->timestamps();

            $table->foreign('id_jaminan')->references('id_jaminan')->on('data_jaminan')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_penjamin');
        Schema::dropIfExists('data_jaminan');
    }
};
