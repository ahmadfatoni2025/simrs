<?php

namespace App\Models;

use App\Traits\HasAuditTrail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pegawai extends Model
{
    use HasAuditTrail, HasFactory;

    protected $table = 'pegawai';

    protected $primaryKey = 'id_pegawai';

    public $timestamps = false;

    protected $fillable = [
        'nik_pegawai',
        'id_bidang_pegawai',
        'id_unit_pegawai',
        'id_sub_unit_pegawai',
        'id_status_kontrak_pegawai',
        'nama_pegawai',
        'no_ktp_pegawai',
        'jenis_kelamin_pegawai',
        'pernikahan_pegawai',
        'id_profesi_pegawai',
        'id_level_kompetensi',
        'id_ptkp',
        'tempat_lahir_pegawai',
        'tanggal_lahir_pegawai',
        'alamat_pegawai',
        'tgl_orientasi_pegawai',
        'tgl_magang_pegawai',
        'tgl_kontrak_pegawai',
        'no_str_pegawai',
        'no_estr_pegawai',
        'no_sip_pegawai',
        'tgl_sip_pegawai',
        'tgl_berakhir_sip_pegawai',
        'pegawai_keluar',
        'id_spesialis',
        'is_ka_unit',
        'is_kabid',
        'is_direktur',
        'is_kasi',
        'non_point',
    ];

    public function subUnitPegawai(): BelongsTo
    {
        return $this->belongsTo(SubUnitPegawai::class, 'id_sub_unit_pegawai', 'id_sub_unit_pegawai');
    }
}
