<?php

namespace App\Http\Controllers\Api\MasterData;

use App\Http\Controllers\Controller;
use App\Models\MasterDiagnosaKeperawatan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MasterDiagnosaKeperawatanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $diagnosas = MasterDiagnosaKeperawatan::query()
            ->when($request->input('search'), fn ($query, string $search) => $query->whereRaw('(kode_diagnosa LIKE ? OR deskripsi_diagnosa LIKE ?)', ["%{$search}%", "%{$search}%"]))
            ->paginate($request->integer('per_page', 10));

        return JsonResource::collection($diagnosas)->response();
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kode_diagnosa' => 'required|string|max:30|unique:master_diagnosa_keperawatan,kode_diagnosa',
            'deskripsi_diagnosa' => 'required|string',
        ]);

        $diagnosa = MasterDiagnosaKeperawatan::create($validated);

        return JsonResource::make($diagnosa)->response()->setStatusCode(201);
    }

    public function show(MasterDiagnosaKeperawatan $diagnosa_keperawatan): JsonResponse
    {
        return JsonResource::make($diagnosa_keperawatan)->response();
    }

    public function update(Request $request, MasterDiagnosaKeperawatan $diagnosa_keperawatan): JsonResponse
    {
        $validated = $request->validate([
            'kode_diagnosa' => 'required|string|max:30|unique:master_diagnosa_keperawatan,kode_diagnosa,'.$diagnosa_keperawatan->id,
            'deskripsi_diagnosa' => 'required|string',
        ]);

        $diagnosa_keperawatan->update($validated);

        return JsonResource::make($diagnosa_keperawatan)->response();
    }

    public function destroy(MasterDiagnosaKeperawatan $diagnosa_keperawatan): JsonResponse
    {
        $diagnosa_keperawatan->delete();

        return response()->json(null, 204);
    }
}
