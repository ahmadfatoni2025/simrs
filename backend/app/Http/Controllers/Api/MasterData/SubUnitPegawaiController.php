<?php

namespace App\Http\Controllers\Api\MasterData;

use App\Http\Controllers\Controller;
use App\Models\SubUnitPegawai;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubUnitPegawaiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $subUnits = SubUnitPegawai::query()
            ->with('unitPegawai')
            ->withCount('pegawai')
            ->when($request->input('search'), fn ($query, string $search) => $query->where('nama_sub_unit_pegawai', 'like', "%{$search}%"))
            ->paginate($request->integer('per_page', 10));

        return JsonResource::collection($subUnits)->response();
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_unit_pegawai' => 'required|exists:unit_pegawai,id_unit_pegawai',
            'nama_sub_unit_pegawai' => 'required|string|max:125',
            'point' => 'required|numeric|min:0',
        ]);

        $subUnit = SubUnitPegawai::create($validated);

        return JsonResource::make($subUnit)->response()->setStatusCode(201);
    }

    public function show(SubUnitPegawai $sub_unit_pegawai): JsonResponse
    {
        $sub_unit_pegawai->load('unitPegawai', 'masterKamar');

        return JsonResource::make($sub_unit_pegawai)->response();
    }

    public function update(Request $request, SubUnitPegawai $sub_unit_pegawai): JsonResponse
    {
        $validated = $request->validate([
            'id_unit_pegawai' => 'required|exists:unit_pegawai,id_unit_pegawai',
            'nama_sub_unit_pegawai' => 'required|string|max:125',
            'point' => 'required|numeric|min:0',
        ]);

        $sub_unit_pegawai->update($validated);

        return JsonResource::make($sub_unit_pegawai)->response();
    }

    public function destroy(SubUnitPegawai $sub_unit_pegawai): JsonResponse
    {
        $sub_unit_pegawai->delete();

        return response()->json(null, 204);
    }
}
