<?php

namespace App\Models;

use App\Traits\HasAuditTrail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterDiagnosaKeperawatan extends Model
{
    use HasAuditTrail, HasFactory;

    protected $table = 'master_diagnosa_keperawatan';

    protected $fillable = [
        'kode_diagnosa',
        'deskripsi_diagnosa',
    ];
}
