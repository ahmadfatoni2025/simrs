<?php

namespace App\Models;

use App\Traits\HasAuditTrail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubUnitPegawai extends Model
{
    use HasAuditTrail, HasFactory;

    protected $table = 'sub_unit_pegawai';

    protected $primaryKey = 'id_sub_unit_pegawai';

    public $timestamps = false;

    protected $fillable = [
        'id_unit_pegawai',
        'nama_sub_unit_pegawai',
        'point',
    ];

    public function unitPegawai(): BelongsTo
    {
        return $this->belongsTo(UnitPegawai::class, 'id_unit_pegawai', 'id_unit_pegawai');
    }

    public function masterKamar(): HasMany
    {
        return $this->hasMany(MasterKamar::class, 'sub_unit_id', 'id_sub_unit_pegawai');
    }

    public function pegawai(): HasMany
    {
        return $this->hasMany(Pegawai::class, 'id_sub_unit_pegawai', 'id_sub_unit_pegawai');
    }
}
