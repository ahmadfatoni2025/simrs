<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pasien', function (Blueprint $table) {
            $table->string('nik', 20)->nullable()->unique()->after('nomor_rekam_medis');
            $table->string('tempat_lahir', 125)->nullable()->after('nama_pasien');
            $table->string('agama', 40)->nullable()->after('tanggal_lahir');
            $table->enum('status_pernikahan', ['Belum Menikah', 'Menikah', 'Cerai', 'Janda', 'Duda'])->nullable()->after('agama');
            $table->string('email', 125)->nullable()->after('no_telepon');
            $table->string('kecamatan', 125)->nullable()->after('alamat');
            $table->string('kabupaten', 125)->nullable()->after('kecamatan');
            $table->string('provinsi', 125)->nullable()->after('kabupaten');
            $table->string('penjamin', 255)->nullable()->after('provinsi');
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