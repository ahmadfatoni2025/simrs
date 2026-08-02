<?php

namespace App\Http\Controllers\Api\MasterData;

use App\Http\Controllers\Controller;
use App\Models\MasterTarif;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MasterTarifController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tarifs = MasterTarif::query()
            ->when($request->input('search'), fn ($query, string $search) => $query->whereRaw('(nama_tarif LIKE ? OR keterangan LIKE ?)', ["%{$search}%", "%{$search}%"]))
            ->paginate($request->integer('per_page', 10));

        return JsonResource::collection($tarifs)->response();
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_tarif' => 'required|string|max:255',
            'nominal' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $tarif = MasterTarif::create($validated);

        return JsonResource::make($tarif)->response()->setStatusCode(201);
    }

    public function show(MasterTarif $tarif): JsonResponse
    {
        return JsonResource::make($tarif)->response();
    }

    public function update(Request $request, MasterTarif $tarif): JsonResponse
    {
        $validated = $request->validate([
            'nama_tarif' => 'required|string|max:255',
            'nominal' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $tarif->update($validated);

        return JsonResource::make($tarif)->response();
    }

    public function destroy(MasterTarif $tarif): JsonResponse
    {
        $tarif->delete();

        return response()->json(null, 204);
    }
}
