<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pasien;
use App\Models\Pendaftaran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_pasien' => 'required|string|max:125',
            'jenis_kelamin' => 'required|in:L,P',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'nullable|string|max:255',
            'no_telepon' => 'nullable|string|max:20',
            'id_poli' => 'required|integer',
            'id_dokter' => 'required|integer',
            'tanggal' => 'required|date',
            'status' => 'sometimes|in:Menunggu,Diperiksa,Selesai',
        ]);

        $pendaftaran = DB::transaction(function () use ($validated): Pendaftaran {
            $pasien = Pasien::create([
                'nomor_rekam_medis' => $this->nextRekamMedis(),
                'nama_pasien' => $validated['nama_pasien'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'alamat' => $validated['alamat'] ?? null,
                'no_telepon' => $validated['no_telepon'] ?? null,
            ]);

            return Pendaftaran::create([
                'nomor_pendaftaran' => $this->nextNomorPendaftaran(),
                'id_pasien' => $pasien->id,
                'id_poli' => $validated['id_poli'],
                'id_dokter' => $validated['id_dokter'],
                'status' => $validated['status'] ?? 'Menunggu',
                'tanggal' => $validated['tanggal'],
            ]);
        });

        return response()->json([
            'data' => [
                'no' => $pendaftaran->nomor_pendaftaran,
                'rm' => $pendaftaran->pasien?->nomor_rekam_medis,
                'name' => $pendaftaran->pasien?->nama_pasien,
                'poli' => $pendaftaran->poli?->nama_sub_unit_pegawai,
                'dokter' => $pendaftaran->dokter?->nama_pegawai,
                'status' => $pendaftaran->status,
                'tanggal' => optional($pendaftaran->tanggal)->format('d M Y'),
            ],
        ], 201);
    }

    private function nextRekamMedis(): string
    {
        $last = Pasien::query()->orderByDesc('id')->value('nomor_rekam_medis');

        $sequence = $last && preg_match('/\d+$/', (string) $last, $m) ? (int) $m[0] + 1 : 1;

        return sprintf('RM-%04d', $sequence);
    }

    private function nextNomorPendaftaran(): string
    {
        $last = Pendaftaran::query()->orderByDesc('id')->value('nomor_pendaftaran');

        $sequence = $last && preg_match('/\d+$/', (string) $last, $m) ? (int) $m[0] + 1 : 1;

        return sprintf('REG-%05d', $sequence);
    }
}
