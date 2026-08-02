<?php

namespace Database\Seeders;

use App\Models\DataJaminan;
use App\Models\MasterDiagnosaKeperawatan;
use App\Models\MasterIcdX;
use App\Models\MasterKamar;
use App\Models\MasterPenjamin;
use App\Models\MasterTarif;
use App\Models\SubUnitPegawai;
use App\Models\UnitPegawai;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $unit = UnitPegawai::create([
            'nama_unit_pegawai' => 'Keperawatan',
            'id_bidang_pegawai' => 1,
        ]);

        $subUnit = SubUnitPegawai::create([
            'id_unit_pegawai' => $unit->id_unit_pegawai,
            'nama_sub_unit_pegawai' => 'Poli Umum',
            'point' => 10.00,
        ]);

        MasterKamar::create([
            'nama_kamar' => 'Kamar Melati 01',
            'kelas' => 'III',
            'jumlah_tempat_tidur' => 4,
            'sub_unit_id' => $subUnit->id_sub_unit_pegawai,
        ]);

        MasterTarif::create([
            'nama_tarif' => 'Konsultasi Dokter Spesialis',
            'nominal' => 150000.00,
        ]);

        MasterTarif::create([
            'nama_tarif' => 'Akomodasi Rawat Inap Kelas 3',
            'nominal' => 200000.00,
        ]);

        MasterIcdX::create([
            'kode_icd' => 'A01.0', 'deskripsi' => 'Typhoid fever',
        ]);
        MasterIcdX::create([
            'kode_icd' => 'J06.9', 'deskripsi' => 'Acute nasopharyngitis (common cold)',
        ]);

        MasterDiagnosaKeperawatan::create(['kode_diagnosa' => 'D.0001', 'deskripsi_diagnosa' => 'Bersihan Jalan Napas Tidak Efektif']);
        MasterDiagnosaKeperawatan::create(['kode_diagnosa' => 'D.0130', 'deskripsi_diagnosa' => 'Hipertermia']);

        $jaminan = DataJaminan::create(['nama_jaminan' => 'BPJS Kesehatan']);

        MasterPenjamin::create([
            'id_jaminan' => $jaminan->id_jaminan,
            'nama_penjamin_sistem' => 'BPJS Kesehatan',
            'kode_penjamin_bpjs' => 'BPJS',
            'status_aktif' => '1',
        ]);
    }
}
