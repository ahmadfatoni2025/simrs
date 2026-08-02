<?php

namespace App\Http\Controllers\Api\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Pegawai;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PegawaiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pegawais = Pegawai::query()
            ->with('subUnitPegawai')
            ->when($request->input('search'), fn ($query, string $search) => $query->where('nama_pegawai', 'like', "%{$search}%"))
            ->paginate($request->integer('per_page', 10));

        return JsonResource::collection($pegawais)->response();
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nik_pegawai' => 'required|string|max:125|unique:pegawai,nik_pegawai',
            'id_bidang_pegawai' => 'required|integer',
            'id_unit_pegawai' => 'required|integer',
            'id_sub_unit_pegawai' => 'required|exists:sub_unit_pegawai,id_sub_unit_pegawai',
            'id_status_kontrak_pegawai' => 'required|integer',
            'nama_pegawai' => 'required|string|max:125',
            'no_ktp_pegawai' => 'required|string|max:125|unique:pegawai,no_ktp_pegawai',
            'jenis_kelamin_pegawai' => 'required|in:L,P',
            'pernikahan_pegawai' => 'required|string|max:125',
            'id_profesi_pegawai' => 'required|integer',
            'id_level_kompetensi' => 'nullable|integer',
            'id_ptkp' => 'nullable|integer',
            'tempat_lahir_pegawai' => 'required|string|max:125',
            'tanggal_lahir_pegawai' => 'required|date',
            'alamat_pegawai' => 'nullable|string|max:125',
            'tgl_orientasi_pegawai' => 'nullable|date',
            'tgl_magang_pegawai' => 'nullable|date',
            'tgl_kontrak_pegawai' => 'nullable|date',
            'no_str_pegawai' => 'nullable|string|max:125|unique:pegawai,no_str_pegawai',
            'no_estr_pegawai' => 'nullable|string|max:125|unique:pegawai,no_estr_pegawai',
            'no_sip_pegawai' => 'nullable|string|max:125|unique:pegawai,no_sip_pegawai',
            'tgl_sip_pegawai' => 'nullable|date',
            'tgl_berakhir_sip_pegawai' => 'nullable|date',
            'pegawai_keluar' => 'nullable|in:Aktif,Pensiun,Mutasi,Resign,Selesai Kontrak,Diberhentikan',
            'id_spesialis' => 'nullable|integer',
            'is_ka_unit' => 'nullable|integer',
            'is_kabid' => 'nullable|integer',
            'is_direktur' => 'nullable|integer',
            'is_kasi' => 'nullable|integer',
            'non_point' => 'nullable|integer',
        ]);

        $pegawai = Pegawai::create($validated);

        return JsonResource::make($pegawai)->response()->setStatusCode(201);
    }

    public function show(Pegawai $pegawai): JsonResponse
    {
        $pegawai->load('subUnitPegawai');

        return JsonResource::make($pegawai)->response();
    }

    public function update(Request $request, Pegawai $pegawai): JsonResponse
    {
        $validated = $request->validate([
            'nik_pegawai' => 'required|string|max:125|unique:pegawai,nik_pegawai,'.$pegawai->id_pegawai.',id_pegawai',
            'id_bidang_pegawai' => 'required|integer',
            'id_unit_pegawai' => 'required|integer',
            'id_sub_unit_pegawai' => 'required|exists:sub_unit_pegawai,id_sub_unit_pegawai',
            'id_status_kontrak_pegawai' => 'required|integer',
            'nama_pegawai' => 'required|string|max:125',
            'no_ktp_pegawai' => 'required|string|max:125|unique:pegawai,no_ktp_pegawai,'.$pegawai->id_pegawai.',id_pegawai',
            'jenis_kelamin_pegawai' => 'required|in:L,P',
            'pernikahan_pegawai' => 'required|string|max:125',
            'id_profesi_pegawai' => 'required|integer',
            'id_level_kompetensi' => 'nullable|integer',
            'id_ptkp' => 'nullable|integer',
            'tempat_lahir_pegawai' => 'required|string|max:125',
            'tanggal_lahir_pegawai' => 'required|date',
            'alamat_pegawai' => 'nullable|string|max:125',
            'tgl_orientasi_pegawai' => 'nullable|date',
            'tgl_magang_pegawai' => 'nullable|date',
            'tgl_kontrak_pegawai' => 'nullable|date',
            'no_str_pegawai' => 'nullable|string|max:125|unique:pegawai,no_str_pegawai,'.$pegawai->id_pegawai.',id_pegawai',
            'no_estr_pegawai' => 'nullable|string|max:125|unique:pegawai,no_estr_pegawai,'.$pegawai->id_pegawai.',id_pegawai',
            'no_sip_pegawai' => 'nullable|string|max:125|unique:pegawai,no_sip_pegawai,'.$pegawai->id_pegawai.',id_pegawai',
            'tgl_sip_pegawai' => 'nullable|date',
            'tgl_berakhir_sip_pegawai' => 'nullable|date',
            'pegawai_keluar' => 'nullable|in:Aktif,Pensiun,Mutasi,Resign,Selesai Kontrak,Diberhentikan',
            'id_spesialis' => 'nullable|integer',
            'is_ka_unit' => 'nullable|integer',
            'is_kabid' => 'nullable|integer',
            'is_direktur' => 'nullable|integer',
            'is_kasi' => 'nullable|integer',
            'non_point' => 'nullable|integer',
        ]);

        $pegawai->update($validated);

        return JsonResource::make($pegawai)->response();
    }

    public function destroy(Pegawai $pegawai): JsonResponse
    {
        $pegawai->delete();

        return response()->json(null, 204);
    }
}
