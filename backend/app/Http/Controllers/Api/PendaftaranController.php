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
                'id' => $p->id,
                'no' => $p->nomor_pendaftaran,
                'rm' => $p->pasien?->nomor_rekam_medis,
                'name' => $p->pasien?->nama_pasien,
                'poli' => $p->poli?->nama_sub_unit_pegawai,
                'dokter' => $p->dokter?->nama_pegawai,
                'status' => $p->status,
                'penjamin' => $p->pasien?->penjamin,
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

    public function show(Request $request, int $id): JsonResponse
    {
        $pendaftaran = Pendaftaran::query()
            ->with(['pasien', 'poli', 'dokter'])
            ->find($id);

        if (!$pendaftaran) {
            return response()->json(['message' => 'Pendaftaran tidak ditemukan.'], 404);
        }

        return response()->json([
            'data' => [
                'id' => $pendaftaran->id,
                'no' => $pendaftaran->nomor_pendaftaran,
                'tanggal' => optional($pendaftaran->tanggal)->format('d M Y'),
                'status' => $pendaftaran->status,
                'id_poli' => $pendaftaran->id_poli,
                'id_dokter' => $pendaftaran->id_dokter,
                'poli' => $pendaftaran->poli?->nama_sub_unit_pegawai,
                'dokter' => $pendaftaran->dokter?->nama_pegawai,
                'pasien' => $pendaftaran->pasien ? [
                    'nomor_rekam_medis' => $pendaftaran->pasien->nomor_rekam_medis,
                    'nama_pasien' => $pendaftaran->pasien->nama_pasien,
                    'nik' => $pendaftaran->pasien->nik,
                    'jenis_kelamin' => $pendaftaran->pasien->jenis_kelamin,
                    'tempat_lahir' => $pendaftaran->pasien->tempat_lahir,
                    'tanggal_lahir' => optional($pendaftaran->pasien->tanggal_lahir)->format('d M Y'),
                    'agama' => $pendaftaran->pasien->agama,
                    'status_pernikahan' => $pendaftaran->pasien->status_pernikahan,
                    'alamat' => $pendaftaran->pasien->alamat,
                    'kecamatan' => $pendaftaran->pasien->kecamatan,
                    'kabupaten' => $pendaftaran->pasien->kabupaten,
                    'provinsi' => $pendaftaran->pasien->provinsi,
                    'no_telepon' => $pendaftaran->pasien->no_telepon,
                    'email' => $pendaftaran->pasien->email,
                    'penjamin' => $pendaftaran->pasien->penjamin,
                ] : null,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_pasien' => 'required|string|max:125',
            'nik' => 'nullable|string|digits:16',
            'tempat_lahir' => 'nullable|string|max:125',
            'jenis_kelamin' => 'required|in:L,P',
            'tanggal_lahir' => 'required|date',
            'agama' => 'nullable|string|max:40',
            'status_pernikahan' => 'nullable|string|max:40',
            'alamat' => 'nullable|string|max:255',
            'kecamatan' => 'nullable|string|max:125',
            'kabupaten' => 'nullable|string|max:125',
            'provinsi' => 'nullable|string|max:125',
            'penjamin' => 'nullable|string|max:255',
            'no_telepon' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:125',
            'upload_ktp' => 'nullable|string|max:255',
            'upload_kk' => 'nullable|string|max:255',
            'upload_bpjs' => 'nullable|string|max:255',
            'id_poli' => 'required|integer',
            'id_dokter' => 'required|integer',
            'tanggal' => 'required|date',
            'status' => 'sometimes|in:Menunggu,Diperiksa,Selesai',
        ]);

        if (!empty($validated['nik'])) {
            $existing = Pasien::query()->where('nik', $validated['nik'])->first();

            if ($existing) {
                return response()->json([
                    'data' => [
                        'duplicate' => true,
                        'rm' => $existing->nomor_rekam_medis,
                        'name' => $existing->nama_pasien,
                    ],
                ], 409);
            }
        }

        $pendaftaran = DB::transaction(function () use ($validated): Pendaftaran {
            $pasien = Pasien::create([
                'nomor_rekam_medis' => $this->nextRekamMedis(),
                'nik' => $validated['nik'] ?? null,
                'nama_pasien' => $validated['nama_pasien'],
                'tempat_lahir' => $validated['tempat_lahir'] ?? null,
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'agama' => $validated['agama'] ?? null,
                'status_pernikahan' => $validated['status_pernikahan'] ?? null,
                'alamat' => $validated['alamat'] ?? null,
                'kecamatan' => $validated['kecamatan'] ?? null,
                'kabupaten' => $validated['kabupaten'] ?? null,
                'provinsi' => $validated['provinsi'] ?? null,
                'penjamin' => $validated['penjamin'] ?? null,
                'no_telepon' => $validated['no_telepon'] ?? null,
                'email' => $validated['email'] ?? null,
                'upload_ktp' => $validated['upload_ktp'] ?? null,
                'upload_kk' => $validated['upload_kk'] ?? null,
                'upload_bpjs' => $validated['upload_bpjs'] ?? null,
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
