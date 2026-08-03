<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MasterData\AkunController;
use App\Http\Controllers\Api\MasterData\MasterDiagnosaKeperawatanController;
use App\Http\Controllers\Api\MasterData\MasterIcdXController;
use App\Http\Controllers\Api\MasterData\MasterKamarController;
use App\Http\Controllers\Api\MasterData\MasterPenjaminController;
use App\Http\Controllers\Api\MasterData\MasterTarifController;
use App\Http\Controllers\Api\MasterData\PegawaiController;
use App\Http\Controllers\Api\MasterData\SubUnitPegawaiController;
use App\Http\Controllers\Api\MasterData\UnitPegawaiController;
use App\Http\Controllers\Api\PendaftaranController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Auth Routes
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/pendaftaran', [PendaftaranController::class, 'index']);
    Route::post('/pendaftaran', [PendaftaranController::class, 'store']);
    Route::get('/pendaftaran/{id}', [PendaftaranController::class, 'show']);
});

Route::prefix('master-data')
    ->middleware('auth:sanctum')
    ->group(function () {
        Route::apiResource('unit-pegawai', UnitPegawaiController::class)->only(['index', 'show']);
        Route::apiResource('sub-unit-pegawai', SubUnitPegawaiController::class)->only(['index', 'show']);
        Route::apiResource('kamar', MasterKamarController::class)->only(['index', 'show']);
        Route::apiResource('pegawai', PegawaiController::class)->only(['index', 'show']);
        Route::apiResource('akun', AkunController::class)->only(['index', 'show']);
        Route::apiResource('tarif', MasterTarifController::class)->only(['index', 'show']);
        Route::apiResource('icd-x', MasterIcdXController::class)->only(['index', 'show']);
        Route::apiResource('diagnosa-keperawatan', MasterDiagnosaKeperawatanController::class)->only(['index', 'show']);
        Route::apiResource('penjamin', MasterPenjaminController::class)->only(['index', 'show']);
    });

Route::prefix('master-data')
    ->middleware(['auth:sanctum', 'role:super,admin'])
    ->group(function () {
        Route::apiResource('unit-pegawai', UnitPegawaiController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('sub-unit-pegawai', SubUnitPegawaiController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('kamar', MasterKamarController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('pegawai', PegawaiController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('akun', AkunController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('tarif', MasterTarifController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('icd-x', MasterIcdXController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('diagnosa-keperawatan', MasterDiagnosaKeperawatanController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('penjamin', MasterPenjaminController::class)->only(['store', 'update', 'destroy']);
    });
