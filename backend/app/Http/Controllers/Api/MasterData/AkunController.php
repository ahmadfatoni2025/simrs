<?php

namespace App\Http\Controllers\Api\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Akun;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AkunController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $akuns = Akun::query()
            ->with('parent')
            ->when($request->input('search'), fn ($query, string $search) => $query->where('nama_akun', 'like', "%{$search}%"))
            ->when($request->input('tipe_akun'), fn ($query, string $tipe) => $query->where('tipe_akun', $tipe))
            ->paginate($request->integer('per_page', 10));

        return JsonResource::collection($akuns)->response();
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'urut_akun' => 'nullable|integer',
            'kode_akun' => 'required|string|max:100',
            'nama_akun' => 'required|string|max:255',
            'tipe_akun' => 'required|in:Aset,Kewajiban,Modal,Pendapatan,Beban',
            'tipe_akun_id' => 'nullable|integer',
            'parent_akun_id' => 'nullable|exists:akun,id_akun',
            'level' => 'nullable|integer',
            'nama_jenis_akun' => 'required|string|max:100',
            'nama_sub_akun' => 'required|string|max:500',
            'arus_kas_id' => 'nullable|integer',
            'kelompok_arus_kas_id' => 'nullable|integer',
            'jaminan_id' => 'nullable|integer',
            'layanan_id' => 'nullable|integer',
            'kategori_laba_rugi' => 'nullable|in:Operasional,Non Operasional',
        ]);

        $akun = Akun::create($validated);

        return JsonResource::make($akun)->response()->setStatusCode(201);
    }

    public function show(Akun $akun): JsonResponse
    {
        $akun->load(['parent', 'children']);

        return JsonResource::make($akun)->response();
    }

    public function update(Request $request, Akun $akun): JsonResponse
    {
        $validated = $request->validate([
            'urut_akun' => 'nullable|integer',
            'kode_akun' => 'required|string|max:100',
            'nama_akun' => 'required|string|max:255',
            'tipe_akun' => 'required|in:Aset,Kewajiban,Modal,Pendapatan,Beban',
            'tipe_akun_id' => 'nullable|integer',
            'parent_akun_id' => 'nullable|exists:akun,id_akun',
            'level' => 'nullable|integer',
            'nama_jenis_akun' => 'required|string|max:100',
            'nama_sub_akun' => 'required|string|max:500',
            'arus_kas_id' => 'nullable|integer',
            'kelompok_arus_kas_id' => 'nullable|integer',
            'jaminan_id' => 'nullable|integer',
            'layanan_id' => 'nullable|integer',
            'kategori_laba_rugi' => 'nullable|in:Operasional,Non Operasional',
        ]);

        $akun->update($validated);

        return JsonResource::make($akun)->response();
    }

    public function destroy(Akun $akun): JsonResponse
    {
        $akun->delete();

        return response()->json(null, 204);
    }
}
