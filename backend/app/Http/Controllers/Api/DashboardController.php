<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MasterKamar;
use App\Models\Pembayaran;
use App\Models\Pendaftaran;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $today = Carbon::today();
        $yesterday = $today->copy()->subDay();

        $registrationsToday = $this->countRegistrations($today);
        $registrationsYesterday = $this->countRegistrations($yesterday);

        $doctorsToday = Pendaftaran::whereDate('tanggal', $today)->distinct('id_dokter')->count('id_dokter');
        $doctorsYesterday = Pendaftaran::whereDate('tanggal', $yesterday)->distinct('id_dokter')->count('id_dokter');

        $appointmentsToday = $this->countRegistrations($today, 'Menunggu');
        $appointmentsYesterday = $this->countRegistrations($yesterday, 'Menunggu');

        $revenueThisMonth = Pembayaran::whereYear('tanggal_bayar', $today->year)
            ->whereMonth('tanggal_bayar', $today->month)
            ->sum('nominal');

        $startPrevMonth = $today->copy()->subMonthNoOverflow()->startOfMonth();
        $endPrevMonth = $today->copy()->subMonthNoOverflow()->endOfMonth();
        $revenueLastMonth = Pembayaran::whereBetween('tanggal_bayar', [$startPrevMonth, $endPrevMonth])->sum('nominal');

        $stats = [
            [
                'key' => 'pasien_hari_ini',
                'label' => 'Pasien Hari Ini',
                'value' => $registrationsToday,
                'change' => $this->percentChange($registrationsYesterday, $registrationsToday),
            ],
            [
                'key' => 'dokter_aktif',
                'label' => 'Dokter Aktif',
                'value' => $doctorsToday,
                'change' => sprintf('%+d', $doctorsToday - $doctorsYesterday),
            ],
            [
                'key' => 'janji_temu_hari_ini',
                'label' => 'Janji Temu Hari Ini',
                'value' => $appointmentsToday,
                'change' => $this->percentChange($appointmentsYesterday, $appointmentsToday),
            ],
            [
                'key' => 'pendapatan_bulan_ini',
                'label' => 'Pendapatan Bulan Ini',
                'value' => $this->formatRupiah($revenueThisMonth),
                'change' => $this->percentChange($revenueLastMonth, $revenueThisMonth),
            ],
        ];

        $weeklyVisits = collect(range(6, 0))
            ->map(function (int $daysAgo) use ($today) {
                $date = $today->copy()->subDays($daysAgo);

                return [
                    'date' => $date->toDateString(),
                    'label' => mb_substr($date->locale('id')->isoFormat('ddd'), 0, 3),
                    'value' => $this->countRegistrations($date),
                ];
            });

        $rooms = MasterKamar::all();
        $roomsByStatus = [
            'terisi' => $rooms->where('status', 'Terisi')->count(),
            'kosong' => $rooms->where('status', 'Kosong')->count(),
            'perawatan' => $rooms->where('status', 'Perawatan')->count(),
        ];
        $roomsPayload = [
            'total' => $rooms->count(),
            'kapasitas' => $rooms->sum('jumlah_tempat_tidur'),
            ...$roomsByStatus,
        ];

        $recentRegistrations = Pendaftaran::query()
            ->with(['pasien', 'poli', 'dokter'])
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(fn (Pendaftaran $p) => [
                'no' => $p->nomor_pendaftaran,
                'name' => $p->pasien?->nama_pasien,
                'poli' => $p->poli?->nama_sub_unit_pegawai,
                'dokter' => $p->dokter?->nama_pegawai,
                'status' => $p->status,
                'jenis_kelamin' => $p->pasien?->jenis_kelamin,
            ]);

        return response()->json([
            'data' => [
                'stats' => $stats,
                'weekly_visits' => $weeklyVisits,
                'rooms' => $roomsPayload,
                'recent_registrations' => $recentRegistrations,
            ],
        ]);
    }

    private function countRegistrations(Carbon $date, ?string $status = null): int
    {
        return Pendaftaran::query()
            ->whereDate('tanggal', $date)
            ->when($status, fn (Builder $query, string $value) => $query->where('status', $value))
            ->count();
    }

    private function percentChange(int|float $previous, int|float $current): string
    {
        if ($previous == 0) {
            return $current > 0 ? '+100%' : '0%';
        }

        $change = round(($current - $previous) / $previous * 100, 1);

        return sprintf('%+g%%', $change);
    }

    private function formatRupiah(int|float $amount): string
    {
        return 'Rp '.number_format($amount, 0, ',', '.');
    }
}