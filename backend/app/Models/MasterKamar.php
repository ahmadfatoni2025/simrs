<?php

namespace App\Models;

use App\Traits\HasAuditTrail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasterKamar extends Model
{
    use HasAuditTrail, HasFactory;

    protected $table = 'master_kamar';

    protected $fillable = [
        'nama_kamar',
        'kelas',
        'jumlah_tempat_tidur',
        'sub_unit_id',
        'keterangan',
    ];

    public function subUnitPegawai(): BelongsTo
    {
        return $this->belongsTo(SubUnitPegawai::class, 'sub_unit_id', 'id_sub_unit_pegawai');
    }
}
