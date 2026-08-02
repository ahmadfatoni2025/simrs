<?php

namespace App\Http\Controllers\Api\MasterData;

use App\Http\Controllers\Controller;
use App\Models\MasterKamar;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MasterKamarController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $kamars = MasterKamar::query()
            ->with('subUnitPegawai')
            ->when($request->input('search'), fn ($query, string $search) => $query->where('nama_kamar', 'like', "%{$search}%"))
            ->paginate($request->integer('per_page', 10));

        return JsonResource::collection($kamars)->response();
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_kamar' => 'required|string|max:255',
            'kelas' => 'required|in:VIP,VIP B,I,II,III,ISOLASI,ICU',
            'jumlah_tempat_tidur' => 'required|integer|min:1',
            'sub_unit_id' => 'required|exists:sub_unit_pegawai,id_sub_unit_pegawai',
            'keterangan' => 'nullable|string',
        ]);

        $kamar = MasterKamar::create($validated);

        return JsonResource::make($kamar)->response()->setStatusCode(201);
    }

    public function show(MasterKamar $kamar): JsonResponse
    {
        $kamar->load('subUnitPegawai');

        return JsonResource::make($kamar)->response();
    }

    public function update(Request $request, MasterKamar $kamar): JsonResponse
    {
        $validated = $request->validate([
            'nama_kamar' => 'required|string|max:255',
            'kelas' => 'required|in:VIP,VIP B,I,II,III,ISOLASI,ICU',
            'jumlah_tempat_tidur' => 'required|integer|min:1',
            'sub_unit_id' => 'required|exists:sub_unit_pegawai,id_sub_unit_pegawai',
            'keterangan' => 'nullable|string',
        ]);

        $kamar->update($validated);

        return JsonResource::make($kamar)->response();
    }

    public function destroy(MasterKamar $kamar): JsonResponse
    {
        $kamar->delete();

        return response()->json(null, 204);
    }
}
