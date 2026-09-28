<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pasien;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PasienController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $list = Pasien::query()
            ->when($request->input('search'), function ($query, string $search) {
                $query->where('nama_pasien', 'like', "%{$search}%")
                    ->orWhere('nomor_rekam_medis', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%");
            })
            ->orderByDesc('id')
            ->paginate($request->integer('per_page', 10));

        return response()->json([
            'data' => $list->items(),
            'meta' => [
                'current_page' => $list->currentPage(),
                'last_page' => $list->lastPage(),
                'per_page' => $list->perPage(),
                'total' => $list->total(),
            ],
        ]);
    }

    public function registrations(int $id): JsonResponse
    {
        $pasien = Pasien::with(['registrations.poli', 'registrations.dokter'])->findOrFail($id);
        return response()->json([
            'data' => $pasien->registrations->map(fn ($r) => [
                'no' => $r->nomor_pendaftaran,
                'poli' => $r->poli?->nama_sub_unit_pegawai,
                'dokter' => $r->dokter?->nama_pegawai,
                'status' => $r->status,
                'tanggal' => optional($r->tanggal)->format('d M Y'),
            ]),
        ]);
    }
}