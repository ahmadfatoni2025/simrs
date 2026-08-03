<?php

use App\Models\Pasien;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function pendaftaranUser(): User
{
    return User::factory()->create(['role' => 'admin']);
}

function seedPoliDokter(): array
{
    $unit = \App\Models\UnitPegawai::create(['nama_unit_pegawai' => 'Poliklinik']);
    $poli = \App\Models\SubUnitPegawai::create([
        'id_unit_pegawai' => $unit->id_unit_pegawai,
        'nama_sub_unit_pegawai' => 'Poli Umum',
        'point' => 1,
    ]);
    $dokter = \App\Models\Pegawai::create([
        'nik_pegawai' => 'PEG-001',
        'id_bidang_pegawai' => 1,
        'id_unit_pegawai' => $unit->id_unit_pegawai,
        'id_sub_unit_pegawai' => $poli->id_sub_unit_pegawai,
        'id_status_kontrak_pegawai' => 1,
        'nama_pegawai' => 'dr. Andi',
        'no_ktp_pegawai' => 'KTP0001',
        'jenis_kelamin_pegawai' => 'L',
        'pernikahan_pegawai' => 'Menikah',
        'id_profesi_pegawai' => 1,
        'tempat_lahir_pegawai' => 'Surabaya',
        'tanggal_lahir_pegawai' => '1980-01-01',
    ]);
    return ['id_poli' => $poli->id_sub_unit_pegawai, 'id_dokter' => $dokter->id_pegawai];
}

it('requires authentication for pendaftaran listing', function () {
    $this->getJson('/api/pendaftaran')->assertUnauthorized();
});

it('stores a new pasien registration with full biodata', function () {
    $this->actingAs(pendaftaranUser(), 'sanctum');
    $ids = seedPoliDokter();

    $this->postJson('/api/pendaftaran', [
        'nama_pasien' => 'Budi Santoso',
        'nik' => '3578011203950001',
        'tempat_lahir' => 'Surabaya',
        'jenis_kelamin' => 'L',
        'tanggal_lahir' => '1995-03-12',
        'agama' => 'Islam',
        'status_pernikahan' => 'Menikah',
        'alamat' => 'Jl. Kenanga No. 1',
        'kecamatan' => 'Sukolilo',
        'kabupaten' => 'Surabaya',
        'provinsi' => 'Jawa Timur',
        'no_telepon' => '081234567890',
        'email' => 'budi@example.com',
        'penjamin' => 'Umum',
        'id_poli' => $ids['id_poli'],
        'id_dokter' => $ids['id_dokter'],
        'tanggal' => '2026-08-03',
    ])->assertCreated()
        ->assertJsonPath('data.name', 'Budi Santoso');

    $this->assertDatabaseHas('pasien', [
        'nama_pasien' => 'Budi Santoso',
        'nik' => '3578011203950001',
        'email' => 'budi@example.com',
        'penjamin' => 'Umum',
    ]);

    $this->assertDatabaseHas('pendaftaran', [
        'status' => 'Menunggu',
    ]);
});

it('rejects a duplicate NIK with a 409 conflict', function () {
    $this->actingAs(pendaftaranUser(), 'sanctum');
    $ids = seedPoliDokter();

    Pasien::create([
        'nomor_rekam_medis' => 'RM-0001',
        'nama_pasien' => 'Budi Santoso',
        'jenis_kelamin' => 'L',
        'tanggal_lahir' => '1995-03-12',
        'nik' => '3578011203950001',
    ]);

    $this->postJson('/api/pendaftaran', [
        'nama_pasien' => 'Budi Santoso',
        'nik' => '3578011203950001',
        'jenis_kelamin' => 'L',
        'tanggal_lahir' => '1995-03-12',
        'id_poli' => $ids['id_poli'],
        'id_dokter' => $ids['id_dokter'],
        'tanggal' => '2026-08-03',
    ])->assertStatus(409)
        ->assertJsonPath('data.duplicate', true)
        ->assertJsonPath('data.rm', 'RM-0001');

    $this->assertDatabaseCount('pendaftaran', 0);
});

it('validates a malformed NIK', function () {
    $this->actingAs(pendaftaranUser(), 'sanctum');
    $ids = seedPoliDokter();

    $this->postJson('/api/pendaftaran', [
        'nama_pasien' => 'Siti Aminah',
        'nik' => '123',
        'jenis_kelamin' => 'P',
        'tanggal_lahir' => '1990-01-01',
        'id_poli' => $ids['id_poli'],
        'id_dokter' => $ids['id_dokter'],
        'tanggal' => '2026-08-03',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['nik']);
});

it('shows full detail of a pendaftaran with pasien biodata', function () {
    $this->actingAs(pendaftaranUser(), 'sanctum');
    $ids = seedPoliDokter();

    $this->postJson('/api/pendaftaran', [
        'nama_pasien' => 'Siti Aminah',
        'nik' => '3578012509900002',
        'tempat_lahir' => 'Surabaya',
        'jenis_kelamin' => 'P',
        'tanggal_lahir' => '1990-09-25',
        'agama' => 'Islam',
        'status_pernikahan' => 'Menikah',
        'alamat' => 'Jl. Melati No. 5',
        'kecamatan' => 'Rungkut',
        'kabupaten' => 'Surabaya',
        'provinsi' => 'Jawa Timur',
        'no_telepon' => '082112345678',
        'email' => 'siti@example.com',
        'penjamin' => 'BPJS',
        'id_poli' => $ids['id_poli'],
        'id_dokter' => $ids['id_dokter'],
        'tanggal' => '2026-08-03',
    ])->assertCreated();

    $pendaftaran = Pendaftaran::query()->first();

    $this->getJson("/api/pendaftaran/{$pendaftaran->id}")
        ->assertOk()
        ->assertJsonPath('data.no', $pendaftaran->nomor_pendaftaran)
        ->assertJsonPath('data.pasien.nama_pasien', 'Siti Aminah')
        ->assertJsonPath('data.pasien.nik', '3578012509900002')
        ->assertJsonPath('data.pasien.penjamin', 'BPJS')
        ->assertJsonPath('data.poli', 'Poli Umum');
});

it('returns 404 for a missing pendaftaran', function () {
    $this->actingAs(pendaftaranUser(), 'sanctum');
    $this->getJson('/api/pendaftaran/99999')->assertNotFound();
});

it('generates sequential nomor rekam medis', function () {
    $this->actingAs(pendaftaranUser(), 'sanctum');
    $ids = seedPoliDokter();

    $this->postJson('/api/pendaftaran', [
        'nama_pasien' => 'Andi',
        'jenis_kelamin' => 'L',
        'tanggal_lahir' => '1990-01-01',
        'id_poli' => $ids['id_poli'],
        'id_dokter' => $ids['id_dokter'],
        'tanggal' => '2026-08-03',
    ])->assertCreated();

    $this->assertSame('RM-0001', Pasien::query()->first()->nomor_rekam_medis);
    $this->assertSame('REG-00001', Pendaftaran::query()->first()->nomor_pendaftaran);
});
