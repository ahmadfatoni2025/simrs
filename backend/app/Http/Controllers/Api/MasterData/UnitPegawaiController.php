<?php

namespace App\Http\Controllers\Api\MasterData;

use App\Http\Controllers\Controller;
use App\Models\UnitPegawai;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnitPegawaiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $units = UnitPegawai::query()
            ->when($request->input('search'), function ($query, string $search) {
                $query->where('nama_unit_pegawai', 'like', "%{$search}%");
            })
            ->paginate($request->integer('per_page', 10));

        return JsonResource::collection($units)->response();
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_unit_pegawai' => 'required|string|max:125',
            'id_bidang_pegawai' => 'nullable|integer',
        ]);

        $unit = UnitPegawai::create($validated);

        return JsonResource::make($unit)->response()->setStatusCode(201);
    }

    public function show(UnitPegawai $unit_pegawai): JsonResponse
    {
        $unit_pegawai->load('subUnitPegawai');

        return JsonResource::make($unit_pegawai)->response();
    }

    public function update(Request $request, UnitPegawai $unit_pegawai): JsonResponse
    {
        $validated = $request->validate([
            'nama_unit_pegawai' => 'required|string|max:125',
            'id_bidang_pegawai' => 'nullable|integer',
        ]);

        $unit_pegawai->update($validated);

        return JsonResource::make($unit_pegawai)->response();
    }

    public function destroy(UnitPegawai $unit_pegawai): JsonResponse
    {
        $unit_pegawai->delete();

        return response()->json(null, 204);
    }
}
