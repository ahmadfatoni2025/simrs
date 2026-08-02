<?php

namespace App\Models;

use App\Traits\HasAuditTrail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterTarif extends Model
{
    use HasAuditTrail, HasFactory;

    protected $table = 'master_tarif';

    protected $fillable = [
        'nama_tarif',
        'nominal',
        'keterangan',
    ];
}
