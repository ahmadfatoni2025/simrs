<?php

namespace App\Http\Controllers\Api\MasterData;

use App\Http\Controllers\Controller;
use App\Models\MasterPenjamin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MasterPenjaminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $penjamins = MasterPenjamin::query()
            ->with('dataJaminan')
            ->when($request->input('search'), fn ($query, string $search) => $query->where('nama_penjamin_sistem', 'like', "%{$search}%"))
            ->paginate($request->integer('per_page', 10));

        return JsonResource::collection($penjamins)->response();
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_jaminan' => 'required|exists:data_jaminan,id_jaminan',
            'nama_penjamin_sistem' => 'required|string|max:255',
            'kode_penjamin_bpjs' => 'nullable|string|max:50',
            'status_aktif' => 'required|in:1,0',
        ]);

        $penjamin = MasterPenjamin::create($validated);

        return JsonResource::make($penjamin)->response()->setStatusCode(201);
    }

    public function show(MasterPenjamin $penjamin): JsonResponse
    {
        $penjamin->load('dataJaminan');

        return JsonResource::make($penjamin)->response();
    }

    public function update(Request $request, MasterPenjamin $penjamin): JsonResponse
    {
        $validated = $request->validate([
            'id_jaminan' => 'required|exists:data_jaminan,id_jaminan',
            'nama_penjamin_sistem' => 'required|string|max:255',
            'kode_penjamin_bpjs' => 'nullable|string|max:50',
            'status_aktif' => 'required|in:1,0',
        ]);

        $penjamin->update($validated);

        return JsonResource::make($penjamin)->response();
    }

    public function destroy(MasterPenjamin $penjamin): JsonResponse
    {
        $penjamin->delete();

        return response()->json(null, 204);
    }
}
