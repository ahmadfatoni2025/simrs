<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $tables = [
        [
            'name' => 'users',
            'x' => 2, 'y' => 4,
            'cols' => [
                'id', 'name', 'email', 'email_verified_at', 'password', 'role', 'remember_token',
            ],
            'pks' => ['id'],
        ],
        [
            'name' => 'audit_logs',
            'x' => 2, 'y' => 37,
            'cols' => [
                'id', 'user_id', 'event', 'auditable_type', 'auditable_id', 'old_values', 'new_values', 'ip_address', 'user_agent', 'created_at',
            ],
            'pks' => ['id'],
            'fks' => ['user_id' => 'users.id'],
        ],
        [
            'name' => 'unit_pegawai',
            'x' => 25, 'y' => 4,
            'cols' => [
                'id_unit_pegawai', 'nama_unit_pegawai', 'id_bidang_pegawai',
            ],
            'pks' => ['id_unit_pegawai'],
        ],
        [
            'name' => 'sub_unit_pegawai',
            'x' => 25, 'y' => 36,
            'cols' => [
                'id_sub_unit_pegawai', 'id_unit_pegawai', 'nama_sub_unit_pegawai', 'point',
            ],
            'pks' => ['id_sub_unit_pegawai'],
            'fks' => ['id_unit_pegawai' => 'unit_pegawai.id_unit_pegawai'],
        ],
        [
            'name' => 'pegawai',
            'x' => 25, 'y' => 67,
            'cols' => [
                'id_pegawai', 'nik_pegawai', 'id_bidang_pegawai', 'id_unit_pegawai', 'id_sub_unit_pegawai',
                'id_status_kontrak_pegawai', 'nama_pegawai', 'no_ktp_pegawai', 'jenis_kelamin_pegawai',
                'id_profesi_pegawai', 'tempat_lahir_pegawai', 'tanggal_lahir_pegawai', 'alamat_pegawai',
                'no_str_pegawai', 'no_sip_pegawai', 'pegawai_keluar',
            ],
            'pks' => ['id_pegawai'],
            'fks' => ['id_sub_unit_pegawai' => 'sub_unit_pegawai.id_sub_unit_pegawai'],
        ],
        [
            'name' => 'master_kamar',
            'x' => 50, 'y' => 36,
            'cols' => [
                'id', 'nama_kamar', 'kelas', 'jumlah_tempat_tidur', 'sub_unit_id', 'keterangan',
            ],
            'pks' => ['id'],
            'fks' => ['sub_unit_id' => 'sub_unit_pegawai.id_sub_unit_pegawai'],
        ],
        [
            'name' => 'akun',
            'x' => 72, 'y' => 4,
            'cols' => [
                'id_akun', 'kode_akun', 'nama_akun', 'tipe_akun', 'parent_akun_id', 'level',
                'nama_jenis_akun', 'nama_sub_akun', 'kategori_laba_rugi',
            ],
            'pks' => ['id_akun'],
            'fks' => ['parent_akun_id' => 'akun.id_akun'],
        ],
        [
            'name' => 'master_tarif',
            'x' => 72, 'y' => 34,
            'cols' => [
                'id', 'nama_tarif', 'nominal', 'keterangan',
            ],
            'pks' => ['id'],
        ],
        [
            'name' => 'data_jaminan',
            'x' => 50, 'y' => 4,
            'cols' => [
                'id_jaminan', 'nama_jaminan',
            ],
            'pks' => ['id_jaminan'],
        ],
        [
            'name' => 'master_penjamin',
            'x' => 50, 'y' => 67,
            'cols' => [
                'id', 'id_jaminan', 'nama_penjamin_sistem', 'kode_penjamin_bpjs', 'status_aktif',
            ],
            'pks' => ['id'],
            'fks' => ['id_jaminan' => 'data_jaminan.id_jaminan'],
        ],
        [
            'name' => 'master_icd_x',
            'x' => 72, 'y' => 58,
            'cols' => [
                'id', 'kode_icd', 'deskripsi',
            ],
            'pks' => ['id'],
        ],
        [
            'name' => 'master_diagnosa_keperawatan',
            'x' => 72, 'y' => 80,
            'cols' => [
                'id', 'kode_diagnosa', 'deskripsi_diagnosa',
            ],
            'pks' => ['id'],
        ],
    ];

    $routes = collect(app('router')->getRoutes()->getRoutesByName())
        ->filter(fn ($route) => str_starts_with($route->uri(), 'api/master-data'))
        ->map(fn ($route) => [
            'method' => implode('+', $route->methods()),
            'uri' => '/'.$route->uri(),
        ])
        ->values()
        ->sortBy('uri');

    return view('welcome', compact('tables', 'routes'));
});
