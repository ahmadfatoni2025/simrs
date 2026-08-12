<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ubah kolom stok dari decimal menjadi integer (tanpa koma).
     */
    public function up(): void
    {
        Schema::table('master_barang_farmasi', function (Blueprint $table) {
            $table->unsignedInteger('stok_minimum')->nullable(false)->default(0)->change();
            $table->unsignedInteger('stok')->nullable(false)->default(0)->change();
        });

        Schema::table('master_barang_rumah_tangga', function (Blueprint $table) {
            $table->unsignedInteger('stok')->nullable(false)->default(0)->change();
        });

        Schema::table('master_barang_gizi', function (Blueprint $table) {
            $table->unsignedInteger('stok')->nullable(false)->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('master_barang_farmasi', function (Blueprint $table) {
            $table->decimal('stok_minimum', 12, 2)->nullable(false)->default(0)->change();
            $table->decimal('stok', 12, 2)->nullable(false)->default(0)->change();
        });

        Schema::table('master_barang_rumah_tangga', function (Blueprint $table) {
            $table->decimal('stok', 12, 2)->nullable(false)->default(0)->change();
        });

        Schema::table('master_barang_gizi', function (Blueprint $table) {
            $table->decimal('stok', 12, 2)->nullable(false)->default(0)->change();
        });
    }
};
