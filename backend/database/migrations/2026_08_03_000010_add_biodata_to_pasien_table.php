<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pasien', function (Blueprint $table) {
            $table->string('nik', 20)->nullable()->unique();
            $table->string('tempat_lahir', 125)->nullable();
            $table->string('agama', 40)->nullable();
            $table->enum('status_pernikahan', ['Belum Menikah', 'Menikah', 'Cerai', 'Janda', 'Duda'])->nullable();
            $table->string('email', 125)->nullable();
            $table->string('kecamatan', 125)->nullable();
            $table->string('kabupaten', 125)->nullable();
            $table->string('provinsi', 125)->nullable();
            $table->string('penjamin', 255)->nullable();
            $table->string('upload_ktp', 255)->nullable();
            $table->string('upload_kk', 255)->nullable();
            $table->string('upload_bpjs', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('pasien', function (Blueprint $table) {
            $table->dropColumn([
                'nik',
                'tempat_lahir',
                'agama',
                'status_pernikahan',
                'email',
                'kecamatan',
                'kabupaten',
                'provinsi',
                'penjamin',
                'upload_ktp',
                'upload_kk',
                'upload_bpjs',
            ]);
        });
    }
};