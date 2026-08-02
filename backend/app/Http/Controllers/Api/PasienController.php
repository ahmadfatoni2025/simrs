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
                    ->orWhere('nomor_rekam_medis', 'like', "%{$search}%");
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
}