<?php

namespace Database\Seeders;

use App\Models\MasterKamar;
use App\Models\Pasien;
use App\Models\Pegawai;
use App\Models\Pembayaran;
use App\Models\Pendaftaran;
use App\Models\SubUnitPegawai;
use App\Models\UnitPegawai;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DashboardSeeder extends Seeder
{
    private const NOMINAL_POOL = [150000, 175000, 200000, 240000, 320000, 400000];

    private const WEEKLY_COUNTS = [9, 11, 15, 10, 18, 14, 17];

    private const POLI_NAMES = ['Poli Umum', 'Poli Anak', 'Poli Jantung', 'Poli Gigi', 'Poli Kulit', 'Poli Kandungan'];

    private int $registrationNumber = 1;

    public function run(): void
    {
        Pembayaran::query()->delete();
        Pendaftaran::query()->delete();
        MasterKamar::query()->delete();
        Pasien::query()->delete();

        $unit = UnitPegawai::firstOrCreate(
            ['nama_unit_pegawai' => 'Pelayanan Medik'],
            ['id_bidang_pegawai' => 1],
        );

        $poli = [];
        foreach (array_merge(self::POLI_NAMES, ['Rawat Inap']) as $name) {
            $poli[$name] = SubUnitPegawai::firstOrCreate(
                ['nama_sub_unit_pegawai' => $name],
                ['id_unit_pegawai' => $unit->id_unit_pegawai, 'point' => 10],
            );
        }

        $this->seedDoctors($unit, $poli);
        $patients = $this->seedPatients();
        $this->seedRooms($poli['Rawat Inap']);

        $today = Carbon::today();

        foreach (self::WEEKLY_COUNTS as $offset => $count) {
            $date = $today->copy()->subDays(6 - $offset);
            $this->registerBatch($patients, $poli, $date, $count, $offset === 6);
        }

        for ($i = 7; $i <= 20; $i++) {
            $date = $today->copy()->subDays($i);

            if ($date->month !== $today->month) {
                break;
            }

            $this->registerBatch($patients, $poli, $date, 12, false);
        }
    }

    private function seedDoctors(UnitPegawai $unit, array $poli): void
    {
        $doctors = [
            ['dr. Andi Prasetyo', 'L'],
            ['dr. Maya Kartika', 'P'],
            ['dr. Rian Ramadhan', 'L'],
            ['dr. Sari Dewanti', 'P'],
            ['dr. Yoga Pratama', 'L'],
            ['dr. Dina Lestari', 'P'],
            ['dr. Lina Marlina', 'P'],
            ['dr. Bagas Firmansyah', 'L'],
        ];
        $poliKeys = array_keys($poli);

        foreach ($doctors as $i => [$nama, $gender]) {
            $poliId = $poli[$poliKeys[$i % count($poliKeys)]];
            $idx = $i + 1;

            Pegawai::firstOrCreate(
                ['nik_pegawai' => sprintf('DK%06d', $idx)],
                [
                    'id_bidang_pegawai' => 1,
                    'id_unit_pegawai' => $unit->id_unit_pegawai,
                    'id_sub_unit_pegawai' => $poliId->id_sub_unit_pegawai,
                    'id_status_kontrak_pegawai' => 1,
                    'nama_pegawai' => $nama,
                    'no_ktp_pegawai' => '3529'.str_pad((string) (100000000 + $i), 9, '0', STR_PAD_LEFT),
                    'jenis_kelamin_pegawai' => $gender,
                    'pernikahan_pegawai' => 'Kawin',
                    'id_profesi_pegawai' => 1,
                    'tempat_lahir_pegawai' => 'Surabaya',
                    'tanggal_lahir_pegawai' => Carbon::create(1980 + $i, 5, 10)->toDateString(),
                    'no_str_pegawai' => 'STR-'.(20000000 + $i),
                    'no_sip_pegawai' => 'SIP-'.(15000000 + $i),
                    'pegawai_keluar' => 'Aktif',
                ],
            );
        }
    }

    private function seedPatients(): array
    {
        $names = [
            'Budi Santoso', 'Siti Rahayu', 'Agus Wijaya', 'Dewi Lestari', 'Joko Susilo',
            'Rina Marlina', 'Andika Permana', 'Sri Wahyuni', 'Hendra Gunawan', 'Lilis Suryani',
            'Fajar Nugroho', 'Nur Aini', 'Eko Prasetyo', 'Wulan Sari', 'Rendi Kurniawan',
            'Mega Puspita', 'Ahmad Fauzi', 'Sari Sulistyo', 'Rizky Ramadhani', 'Yuni Astuti',
            'Deny Setiawan', 'Ayu Wulandari', 'Taufik Hidayat', 'Ratna Dewi', 'Ivan Saputra', 'Melani Putri',
        ];

        return collect($names)->map(function (string $name, int $i) {
            return Pasien::create([
                'nomor_rekam_medis' => sprintf('RM-%04d', $i + 1),
                'nama_pasien' => $name,
                'jenis_kelamin' => $i % 2 === 0 ? 'L' : 'P',
                'tanggal_lahir' => Carbon::create(1970, 1, 1)->addDays($i * 30)->toDateString(),
                'alamat' => 'Jl. Kenanga No. '.($i + 1),
                'no_telepon' => '081234'.str_pad((string) ($i * 7), 6, '0', STR_PAD_LEFT),
            ]);
        })->all();
    }

    private function seedRooms(SubUnitPegawai $rawatInap): void
    {
        $rooms = [
            ['Kamar Melati 01', 'III', 'Perawatan', 4],
            ['Kamar Melati 02', 'III', 'Terisi', 4],
            ['Kamar Melati 03', 'III', 'Kosong', 4],
            ['Kamar Cempaka 01', 'II', 'Terisi', 3],
            ['Kamar Cempaka 02', 'II', 'Terisi', 3],
            ['Kamar Anggrek 01', 'I', 'Terisi', 2],
            ['Kamar Anggrek 02', 'I', 'Kosong', 2],
            ['Kamar Mawar 01', 'VIP B', 'Perawatan', 2],
            ['Kamar Mawar 02', 'VIP B', 'Terisi', 2],
            ['Kamar Mawar 03', 'VIP B', 'Terisi', 2],
            ['Kamar Lili 01', 'VIP', 'Terisi', 1],
            ['Kamar Lili 02', 'VIP', 'Kosong', 1],
            ['Kamar Teratai 01', 'ICU', 'Perawatan', 4],
            ['Kamar Teratai 02', 'ICU', 'Terisi', 4],
            ['Kamar Sedara 01', 'ISOLASI', 'Terisi', 2],
            ['Kamar Sedara 02', 'ISOLASI', 'Kosong', 2],
        ];

        foreach ($rooms as [$nama, $kelas, $status, $jumlahTempatTidur]) {
            MasterKamar::create([
                'nama_kamar' => $nama,
                'kelas' => $kelas,
                'status' => $status,
                'jumlah_tempat_tidur' => $jumlahTempatTidur,
                'sub_unit_id' => $rawatInap->id_sub_unit_pegawai,
            ]);
        }
    }

private function registerBatch(array $patients, array $poli, Carbon $date, int $count, bool $isToday): void
    {
        $poliIds = collect(array_slice($poli, 0, count(self::POLI_NAMES)))
            ->map(fn ($p) => $p->id_sub_unit_pegawai)
            ->values()
            ->all();

        $doctorPool = Pegawai::whereIn('id_sub_unit_pegawai', $poliIds)->get();

        for ($i = 0; $i < $count; $i++) {
            $status = $isToday
                ? ['Menunggu', 'Menunggu', 'Diperiksa', 'Selesai', 'Menunggu', 'Diperiksa'][$i % 6]
                : ['Selesai', 'Selesai', 'Diperiksa', 'Menunggu'][$i % 4];

            $poliName = self::POLI_NAMES[$i % count(self::POLI_NAMES)];
            $poliklinik = $poli[$poliName];

            $candidates = $doctorPool->where('id_sub_unit_pegawai', $poliklinik->id_sub_unit_pegawai);
            $dokter = $candidates->count() > 0
                ? $candidates->values()->first()
                : $doctorPool->first();

            $registration = Pendaftaran::create([
                'nomor_pendaftaran' => sprintf('REG-%05d', $this->registrationNumber++),
                'id_pasien' => $patients[array_rand($patients)]->id,
                'id_poli' => $poliklinik->id_sub_unit_pegawai,
                'id_dokter' => $dokter->id_pegawai,
                'status' => $status,
                'tanggal' => $date,
            ]);

            if ($status === 'Selesai' && $date->month === Carbon::today()->month) {
                Pembayaran::create([
                    'id_pendaftaran' => $registration->id,
                    'nominal' => self::NOMINAL_POOL[array_rand(self::NOMINAL_POOL)],
                    'metode' => ['Tunai', 'BPJS', 'Asuransi'][array_rand(['Tunai', 'BPJS', 'Asuransi'])],
                    'tanggal_bayar' => $date,
                ]);
            }
        }
    }
}