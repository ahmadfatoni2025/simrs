<?php

namespace App\Models;

use App\Traits\HasAuditTrail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UnitPegawai extends Model
{
    use HasAuditTrail, HasFactory;

    protected $table = 'unit_pegawai';

    protected $primaryKey = 'id_unit_pegawai';

    public $timestamps = false;

    protected $fillable = [
        'nama_unit_pegawai',
        'id_bidang_pegawai',
    ];

    public function subUnitPegawai(): HasMany
    {
        return $this->hasMany(SubUnitPegawai::class, 'id_unit_pegawai', 'id_unit_pegawai');
    }
}
