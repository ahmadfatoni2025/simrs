<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DataJaminan extends Model
{
    use HasFactory;

    protected $table = 'data_jaminan';

    protected $primaryKey = 'id_jaminan';

    protected $fillable = [
        'nama_jaminan',
    ];

    public function masterPenjamin(): HasMany
    {
        return $this->hasMany(MasterPenjamin::class, 'id_jaminan', 'id_jaminan');
    }
}
