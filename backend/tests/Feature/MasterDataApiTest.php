<?php

use App\Models\MasterTarif;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function masterDataAdmin(): User
{
    return User::factory()->create(['role' => 'admin']);
}

it('requires authentication for master data listing', function () {
    $this->getJson('/api/master-data/tarif')->assertUnauthorized();
});

it('lists master data for authenticated users', function () {
    $this->actingAs(masterDataAdmin(), 'sanctum');

    MasterTarif::create(['nama_tarif' => 'Konsultasi', 'nominal' => 50000]);

    $this->getJson('/api/master-data/tarif')
        ->assertSuccessful()
        ->assertJsonStructure(['data', 'meta']);
});

it('stores a unit pegawai as an admin', function () {
    $this->actingAs(masterDataAdmin(), 'sanctum');

    $this->postJson('/api/master-data/unit-pegawai', [
        'nama_unit_pegawai' => 'Keperawatan',
    ])->assertCreated()
        ->assertJsonPath('data.nama_unit_pegawai', 'Keperawatan');

    $this->assertDatabaseHas('unit_pegawai', ['nama_unit_pegawai' => 'Keperawatan']);
});

it('blocks non-admin users from writing master data', function () {
    $user = User::factory()->create(['role' => 'user']);
    $this->actingAs($user, 'sanctum');

    $this->postJson('/api/master-data/unit-pegawai', [
        'nama_unit_pegawai' => 'Keperawatan',
    ])->assertForbidden();
});

it('validates required fields when creating a tarif', function () {
    $this->actingAs(masterDataAdmin(), 'sanctum');

    $this->postJson('/api/master-data/tarif', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['nama_tarif', 'nominal']);
});

it('updates and deletes a tarif', function () {
    $this->actingAs(masterDataAdmin(), 'sanctum');

    $tarif = MasterTarif::create(['nama_tarif' => 'Konsultasi', 'nominal' => 50000]);

    $this->putJson("/api/master-data/tarif/{$tarif->id}", [
        'nama_tarif' => 'Konsultasi Spesialis',
        'nominal' => 150000,
    ])->assertSuccessful()
        ->assertJsonPath('data.nama_tarif', 'Konsultasi Spesialis');

    $this->deleteJson("/api/master-data/tarif/{$tarif->id}")->assertNoContent();

    $this->assertDatabaseMissing('master_tarif', ['id' => $tarif->id]);
});
