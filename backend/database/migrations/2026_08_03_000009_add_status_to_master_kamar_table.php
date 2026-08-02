<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('master_kamar', function (Blueprint $table) {
            $table->enum('status', ['Kosong', 'Terisi', 'Perawatan'])->default('Kosong')->after('kelas');
        });
    }

    public function down(): void
    {
        Schema::table('master_kamar', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};