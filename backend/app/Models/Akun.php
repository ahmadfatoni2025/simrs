<?php

namespace App\Models;

use App\Traits\HasAuditTrail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Akun extends Model
{
    use HasAuditTrail, HasFactory;

    protected $table = 'akun';

    protected $primaryKey = 'id_akun';

    public $timestamps = false;

    protected $fillable = [
        'urut_akun',
        'kode_akun',
        'nama_akun',
        'tipe_akun',
        'tipe_akun_id',
        'parent_akun_id',
        'level',
        'nama_jenis_akun',
        'nama_sub_akun',
        'arus_kas_id',
        'kelompok_arus_kas_id',
        'jaminan_id',
        'layanan_id',
        'kategori_laba_rugi',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Akun::class, 'parent_akun_id', 'id_akun');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Akun::class, 'parent_akun_id', 'id_akun');
    }
}
