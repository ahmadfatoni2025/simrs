<?php

namespace App\Models;

use App\Traits\HasAuditTrail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasterPenjamin extends Model
{
    use HasAuditTrail, HasFactory;

    protected $table = 'master_penjamin';

    protected $fillable = [
        'id_jaminan',
        'nama_penjamin_sistem',
        'kode_penjamin_bpjs',
        'status_aktif',
    ];

    public function dataJaminan(): BelongsTo
    {
        return $this->belongsTo(DataJaminan::class, 'id_jaminan', 'id_jaminan');
    }
}
