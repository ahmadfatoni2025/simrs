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
        'nama_pasien',
        'jenis_kelamin',
        'tanggal_lahir',
        'alamat',
        'no_telepon',
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