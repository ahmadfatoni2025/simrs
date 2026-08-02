<?php

namespace App\Models;

use App\Traits\HasAuditTrail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterIcdX extends Model
{
    use HasAuditTrail, HasFactory;

    protected $table = 'master_icd_x';

    protected $fillable = [
        'kode_icd',
        'deskripsi',
    ];
}
