<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PendaftaranController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $list = Pendaftaran::query()
            ->with(['pasien', 'poli', 'dokter'])
            ->when($request->input('search'), function ($query, string $search) {
                $query->whereHas('pasien', fn ($p) => $p->where('nama_pasien', 'like', "%{$search}%")
                    ->orWhere('nomor_rekam_medis', 'like', "%{$search}%"));
            })
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->paginate($request->integer('per_page', 10));

        return response()->json([
            'data' => collect($list->items())->map(fn (Pendaftaran $p) => [
                'no' => $p->nomor_pendaftaran,
                'rm' => $p->pasien?->nomor_rekam_medis,
                'name' => $p->pasien?->nama_pasien,
                'poli' => $p->poli?->nama_sub_unit_pegawai,
                'dokter' => $p->dokter?->nama_pegawai,
                'status' => $p->status,
                'tanggal' => optional($p->tanggal)->format('d M Y'),
            ]),
            'meta' => [
                'current_page' => $list->currentPage(),
                'last_page' => $list->lastPage(),
                'per_page' => $list->perPage(),
                'total' => $list->total(),
            ],
        ]);
    }
}