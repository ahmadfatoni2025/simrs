<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pendaftaran extends Model
{
    use HasFactory;

    protected $table = 'pendaftaran';

    protected $fillable = [
        'nomor_pendaftaran',
        'id_pasien',
        'id_poli',
        'id_dokter',
        'status',
        'tanggal',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }

    public function pasien(): BelongsTo
    {
        return $this->belongsTo(Pasien::class, 'id_pasien');
    }

    public function poli(): BelongsTo
    {
        return $this->belongsTo(SubUnitPegawai::class, 'id_poli', 'id_sub_unit_pegawai');
    }

    public function dokter(): BelongsTo
    {
        return $this->belongsTo(Pegawai::class, 'id_dokter', 'id_pegawai');
    }

    public function pembayaran(): HasOne
    {
        return $this->hasOne(Pembayaran::class, 'id_pendaftaran');
    }
}