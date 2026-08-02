<?php

namespace App\Http\Controllers\Api\MasterData;

use App\Http\Controllers\Controller;
use App\Models\MasterIcdX;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MasterIcdXController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $icds = MasterIcdX::query()
            ->when($request->input('search'), fn ($query, string $search) => $query->whereRaw('(kode_icd LIKE ? OR deskripsi LIKE ?)', ["%{$search}%", "%{$search}%"]))
            ->paginate($request->integer('per_page', 10));

        return JsonResource::collection($icds)->response();
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kode_icd' => 'required|string|max:20|unique:master_icd_x,kode_icd',
            'deskripsi' => 'required|string|max:255',
        ]);

        $icd = MasterIcdX::create($validated);

        return JsonResource::make($icd)->response()->setStatusCode(201);
    }

    public function show(MasterIcdX $icd_x): JsonResponse
    {
        return JsonResource::make($icd_x)->response();
    }

    public function update(Request $request, MasterIcdX $icd_x): JsonResponse
    {
        $validated = $request->validate([
            'kode_icd' => 'required|string|max:20|unique:master_icd_x,kode_icd,'.$icd_x->id,
            'deskripsi' => 'required|string|max:255',
        ]);

        $icd_x->update($validated);

        return JsonResource::make($icd_x)->response();
    }

    public function destroy(MasterIcdX $icd_x): JsonResponse
    {
        $icd_x->delete();

        return response()->json(null, 204);
    }
}
