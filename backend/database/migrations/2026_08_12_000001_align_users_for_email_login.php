<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Align the legacy `users` table (username-based) with the
     * current email/password/role authentication used by the app,
     * while preserving existing rows.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'name')) {
                $table->string('name')->nullable()->after('username');
            }
            if (! Schema::hasColumn('users', 'email')) {
                $table->string('email')->nullable()->unique()->after('name');
            }
            if (! Schema::hasColumn('users', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable()->after('email');
            }
            if (! Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['super', 'admin', 'user'])->default('user')->after('password');
            }
        });

        $rows = DB::table('users')->get();

        foreach ($rows as $row) {
            $email = match ($row->username) {
                'admin', 'superadmin' => $row->username.'@test.com',
                'user1' => 'test@example.com',
                default => $row->username.'@simrs.local',
            };

            DB::table('users')->where('id', $row->id)->update([
                'name' => $row->name ?? $row->username,
                'email' => $row->email ?? $email,
                'role' => match ($row->username) {
                    'superadmin' => 'super',
                    'admin' => 'admin',
                    default => 'user',
                },
                'password' => Hash::make('password'),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            foreach (['name', 'email', 'email_verified_at', 'role'] as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
