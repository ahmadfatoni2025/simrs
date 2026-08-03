<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pasien extends Model
{
    use HasFactory;

    protected $table = 'pasien';

    protected $fillable = [
        'nomor_rekam_medis',
        'nik',
        'nama_pasien',
        'tempat_lahir',
        'jenis_kelamin',
        'tanggal_lahir',
        'agama',
        'status_pernikahan',
        'alamat',
        'kecamatan',
        'kabupaten',
        'provinsi',
        'penjamin',
        'no_telepon',
        'email',
        'upload_ktp',
        'upload_kk',
        'upload_bpjs',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
        ];
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Pendaftaran::class, 'id_pasien');
    }
}