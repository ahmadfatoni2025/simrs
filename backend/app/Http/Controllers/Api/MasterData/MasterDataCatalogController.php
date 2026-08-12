<?php

namespace App\Http\Controllers\Api\MasterData;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Controller CRUD generik untuk seluruh entitas katalog Master Data.
 * Definisi tiap entitas (tabel, label, kolom pencarian, aturan validasi)
 * diatur satu tempat pada metode `definitions()`.
 */
class MasterDataCatalogController extends Controller
{
    public function definitions(): array
    {
        return [
            'kategori-nilai-normal' => [
                'label' => 'Kategori Nilai Normal',
                'table' => 'master_kategori_nilai_normal',
                'labelColumn' => 'nama',
                'searchable' => ['nama', 'keterangan'],
                'rules' => [
                    'nama' => 'required|string|max:255',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'barang-farmasi' => [
                'label' => 'Barang Farmasi',
                'table' => 'master_barang_farmasi',
                'labelColumn' => 'nama_barang',
                'searchable' => ['kode_barang', 'nama_barang', 'keterangan'],
                'rules' => [
                    'kode_barang' => 'required|string|max:50',
                    'nama_barang' => 'required|string|max:255',
                    'jenis' => 'required|in:obat,bahan,alkes',
                    'pabrik_id' => 'nullable|integer',
                    'sediaan_id' => 'nullable|integer',
                    'satuan_id' => 'nullable|integer',
                    'kelas_terapi_id' => 'nullable|integer',
                    'harga_modal' => 'nullable|numeric|min:0',
                    'harga_jual' => 'nullable|numeric|min:0',
                    'stok_minimum' => 'nullable|integer|min:0',
                    'stok' => 'nullable|integer|min:0',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'barang-rumah-tangga' => [
                'label' => 'Barang Rumah Tangga',
                'table' => 'master_barang_rumah_tangga',
                'labelColumn' => 'nama_barang',
                'searchable' => ['kode_barang', 'nama_barang', 'keterangan'],
                'rules' => [
                    'kode_barang' => 'required|string|max:50',
                    'nama_barang' => 'required|string|max:255',
                    'kategori_barang_id' => 'nullable|integer',
                    'satuan_id' => 'nullable|integer',
                    'harga' => 'nullable|numeric|min:0',
                    'stok' => 'nullable|integer|min:0',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'barang-gizi' => [
                'label' => 'Barang Gizi',
                'table' => 'master_barang_gizi',
                'labelColumn' => 'nama_barang',
                'searchable' => ['kode_barang', 'nama_barang', 'keterangan'],
                'rules' => [
                    'kode_barang' => 'required|string|max:50',
                    'nama_barang' => 'required|string|max:255',
                    'satuan_id' => 'nullable|integer',
                    'stok' => 'nullable|integer|min:0',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'pabrik' => [
                'label' => 'Pabrik',
                'table' => 'master_pabrik',
                'labelColumn' => 'nama_pabrik',
                'searchable' => ['nama_pabrik', 'kota', 'alamat'],
                'rules' => [
                    'nama_pabrik' => 'required|string|max:255',
                    'alamat' => 'nullable|string|max:255',
                    'telepon' => 'nullable|string|max:50',
                    'kota' => 'nullable|string|max:100',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'sediaan' => [
                'label' => 'Sediaan',
                'table' => 'master_sediaan',
                'labelColumn' => 'nama',
                'searchable' => ['nama'],
                'rules' => [
                    'nama' => 'required|string|max:255',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'satuan' => [
                'label' => 'Satuan',
                'table' => 'master_satuan',
                'labelColumn' => 'nama',
                'searchable' => ['nama'],
                'rules' => [
                    'nama' => 'required|string|max:100',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'kelas-terapi' => [
                'label' => 'Kelas Terapi',
                'table' => 'master_kelas_terapi',
                'labelColumn' => 'nama',
                'searchable' => ['nama'],
                'rules' => [
                    'nama' => 'required|string|max:255',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'bed' => [
                'label' => 'Bangsal & Bed',
                'table' => 'master_bed',
                'labelColumn' => 'nomor_bed',
                'searchable' => ['nomor_bed', 'keterangan'],
                'rules' => [
                    'kamar_id' => 'required|integer',
                    'nomor_bed' => 'required|string|max:50',
                    'status' => 'required|in:kosong,terisi',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'signa-obat' => [
                'label' => 'Signa Obat',
                'table' => 'master_signa_obat',
                'labelColumn' => 'signa',
                'searchable' => ['signa'],
                'rules' => [
                    'signa' => 'required|string|max:255',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'paket-mcu' => [
                'label' => 'Paket MCU',
                'table' => 'master_paket_mcu',
                'labelColumn' => 'nama_paket',
                'searchable' => ['nama_paket', 'keterangan'],
                'rules' => [
                    'nama_paket' => 'required|string|max:255',
                    'nominal' => 'nullable|numeric|min:0',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'paket-tindakan' => [
                'label' => 'Paket Tindakan',
                'table' => 'master_paket_tindakan',
                'labelColumn' => 'nama_paket',
                'searchable' => ['nama_paket', 'keterangan'],
                'rules' => [
                    'nama_paket' => 'required|string|max:255',
                    'nominal' => 'nullable|numeric|min:0',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'instalasi' => [
                'label' => 'Instalasi',
                'table' => 'master_instalasi',
                'labelColumn' => 'nama_instalasi',
                'searchable' => ['kode', 'nama_instalasi'],
                'rules' => [
                    'kode' => 'nullable|string|max:30',
                    'nama_instalasi' => 'required|string|max:255',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'instansi' => [
                'label' => 'Instansi',
                'table' => 'master_instansi',
                'labelColumn' => 'nama_instansi',
                'searchable' => ['kode', 'nama_instansi'],
                'rules' => [
                    'kode' => 'nullable|string|max:30',
                    'nama_instansi' => 'required|string|max:255',
                    'jenis' => 'required|in:asuransi,perusahaan,instansi,pribadi',
                    'alamat' => 'nullable|string|max:255',
                    'telepon' => 'nullable|string|max:50',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'template-expertise' => [
                'label' => 'Template Expertise',
                'table' => 'master_template_expertise',
                'labelColumn' => 'nama_template',
                'searchable' => ['nama_template', 'keterangan'],
                'rules' => [
                    'nama_template' => 'required|string|max:255',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'template-resep-racikan' => [
                'label' => 'Template Resep Racikan',
                'table' => 'master_template_resep_racikan',
                'labelColumn' => 'nama_template',
                'searchable' => ['nama_template', 'keterangan'],
                'rules' => [
                    'nama_template' => 'required|string|max:255',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'profesi-nakes' => [
                'label' => 'Profesi Tenaga Kesehatan',
                'table' => 'master_profesi_nakes',
                'labelColumn' => 'nama_profesi',
                'searchable' => ['nama_profesi'],
                'rules' => [
                    'nama_profesi' => 'required|string|max:255',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'smf' => [
                'label' => 'SMF',
                'table' => 'master_smf',
                'labelColumn' => 'nama_smf',
                'searchable' => ['kode_smf', 'nama_smf'],
                'rules' => [
                    'kode_smf' => 'nullable|string|max:30',
                    'nama_smf' => 'required|string|max:255',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'spesialisasi' => [
                'label' => 'Spesialisasi',
                'table' => 'master_spesialisasi',
                'labelColumn' => 'nama_spesialisasi',
                'searchable' => ['nama_spesialisasi'],
                'rules' => [
                    'nama_spesialisasi' => 'required|string|max:255',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'supplier' => [
                'label' => 'Supplier',
                'table' => 'master_supplier',
                'labelColumn' => 'nama_supplier',
                'searchable' => ['nama_supplier', 'kota'],
                'rules' => [
                    'nama_supplier' => 'required|string|max:255',
                    'alamat' => 'nullable|string|max:255',
                    'telepon' => 'nullable|string|max:50',
                    'kota' => 'nullable|string|max:100',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'item-laboratorium' => [
                'label' => 'Item Laboratorium',
                'table' => 'master_item_laboratorium',
                'labelColumn' => 'nama_pemeriksaan',
                'searchable' => ['kode_item', 'nama_pemeriksaan'],
                'rules' => [
                    'kode_item' => 'required|string|max:50',
                    'nama_pemeriksaan' => 'required|string|max:255',
                    'kategori_nilai_normal_id' => 'nullable|integer',
                    'satuan' => 'nullable|string|max:100',
                    'nilai_normal_pria' => 'nullable|string|max:100',
                    'nilai_normal_wanita' => 'nullable|string|max:100',
                    'harga' => 'nullable|numeric|min:0',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'wilayah' => [
                'label' => 'Wilayah',
                'table' => 'master_wilayah',
                'labelColumn' => 'nama',
                'searchable' => ['kode', 'nama'],
                'rules' => [
                    'kode' => 'nullable|string|max:30',
                    'nama' => 'required|string|max:255',
                    'tingkat' => 'required|in:provinsi,kabupaten,kecamatan,kelurahan',
                    'induk_id' => 'nullable|integer',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'rekening' => [
                'label' => 'Rekening',
                'table' => 'master_rekening',
                'labelColumn' => 'nama_rekening',
                'searchable' => ['kode_rekening', 'nama_rekening'],
                'rules' => [
                    'kode_rekening' => 'required|string|max:50',
                    'nama_rekening' => 'required|string|max:255',
                    'jenis' => 'required|in:Aset,Kewajiban,Modal,Pendapatan,Beban',
                    'induk_id' => 'nullable|integer',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'kategori-barang' => [
                'label' => 'Kategori Barang',
                'table' => 'master_kategori_barang',
                'labelColumn' => 'nama_kategori',
                'searchable' => ['nama_kategori'],
                'rules' => [
                    'nama_kategori' => 'required|string|max:255',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'triase-primer' => [
                'label' => 'Triase Primer',
                'table' => 'master_triase_primer',
                'labelColumn' => 'nama_triase',
                'searchable' => ['kode', 'nama_triase'],
                'rules' => [
                    'kode' => 'nullable|string|max:30',
                    'nama_triase' => 'required|string|max:255',
                    'warna' => 'nullable|string|max:20',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'kuota-poliklinik' => [
                'label' => 'Kuota Poliklinik',
                'table' => 'master_kuota_poliklinik',
                'labelColumn' => 'hari',
                'searchable' => ['keterangan'],
                'rules' => [
                    'unit_id' => 'required|integer',
                    'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
                    'waktu' => 'nullable|in:Pagi,Siang,Sore',
                    'kuota' => 'nullable|integer|min:0',
                    'keterangan' => 'nullable|string',
                ],
            ],
            'jadwal-dokter' => [
                'label' => 'Jadwal Dokter',
                'table' => 'master_jadwal_dokter',
                'labelColumn' => 'hari',
                'searchable' => ['keterangan'],
                'rules' => [
                    'pegawai_id' => 'required|integer',
                    'unit_id' => 'required|integer',
                    'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
                    'jam_mulai' => 'nullable|date_format:H:i',
                    'jam_selesai' => 'nullable|date_format:H:i',
                    'kuota' => 'nullable|integer|min:0',
                    'keterangan' => 'nullable|string',
                ],
            ],
        ];
    }

    public function references(): array
    {
        return [
            'kamar' => ['table' => 'master_kamar', 'value' => 'id', 'label' => 'nama_kamar'],
            'unit-pegawai' => ['table' => 'unit_pegawai', 'value' => 'id_unit_pegawai', 'label' => 'nama_unit_pegawai'],
            'sub-unit-pegawai' => ['table' => 'sub_unit_pegawai', 'value' => 'id_sub_unit_pegawai', 'label' => 'nama_sub_unit_pegawai'],
            'data-jaminan' => ['table' => 'data_jaminan', 'value' => 'id_jaminan', 'label' => 'nama_jaminan'],
            'pegawai' => ['table' => 'pegawai', 'value' => 'id_pegawai', 'label' => 'nama_pegawai'],
            'pabrik' => ['table' => 'master_pabrik', 'value' => 'id', 'label' => 'nama_pabrik'],
            'sediaan' => ['table' => 'master_sediaan', 'value' => 'id', 'label' => 'nama'],
            'satuan' => ['table' => 'master_satuan', 'value' => 'id', 'label' => 'nama'],
            'kelas-terapi' => ['table' => 'master_kelas_terapi', 'value' => 'id', 'label' => 'nama'],
            'kategori-barang' => ['table' => 'master_kategori_barang', 'value' => 'id', 'label' => 'nama_kategori'],
            'kategori-nilai-normal' => ['table' => 'master_kategori_nilai_normal', 'value' => 'id', 'label' => 'nama'],
        ];
    }

    protected function definition(string $entity): array
    {
        $def = $this->definitions()[$entity] ?? null;

        if ($def === null) {
            throw new NotFoundHttpException("Entitas master data '{$entity}' tidak ditemukan.");
        }

        return $def;
    }

    public function index(Request $request, string $entity): JsonResponse
    {
        $def = $this->definition($entity);
        $query = DB::table($def['table']);

        $search = $request->input('search');
        if ($search && ! empty($def['searchable'])) {
            $like = "%{$search}%";
            $query->where(function ($q) use ($def, $like) {
                foreach ($def['searchable'] as $index => $column) {
                    $method = $index === 0 ? 'where' : 'orWhere';
                    $q->{$method}($column, 'like', $like);
                }
            });
        }

        $orderBy = $request->input('order_by', $def['labelColumn'] ?? 'id');
        $query->orderBy($orderBy, $request->input('order_dir', 'asc'));

        $rows = $query->paginate($request->integer('per_page', 10));

        return response()->json($rows);
    }

    public function store(Request $request, string $entity): JsonResponse
    {
        $def = $this->definition($entity);
        $validated = $request->validate($def['rules']);

        $id = DB::table($def['table'])->insertGetId([
            ...$validated,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(DB::table($def['table'])->where('id', $id)->first(), 201);
    }

    public function show(Request $request, string $entity, int $id): JsonResponse
    {
        $def = $this->definition($entity);
        $row = DB::table($def['table'])->where('id', $id)->first();

        if ($row === null) {
            throw new NotFoundHttpException('Data tidak ditemukan.');
        }

        return response()->json($row);
    }

    public function update(Request $request, string $entity, int $id): JsonResponse
    {
        $def = $this->definition($entity);
        $validated = $request->validate($def['rules']);

        $exists = DB::table($def['table'])->where('id', $id)->exists();
        if (! $exists) {
            throw new NotFoundHttpException('Data tidak ditemukan.');
        }

        DB::table($def['table'])->where('id', $id)->update([
            ...$validated,
            'updated_at' => now(),
        ]);

        return response()->json(DB::table($def['table'])->where('id', $id)->first());
    }

    public function destroy(Request $request, string $entity, int $id): JsonResponse
    {
        $def = $this->definition($entity);

        DB::table($def['table'])->where('id', $id)->delete();

        return response()->json(null, 204);
    }

    public function options(Request $request, string $entity): JsonResponse
    {
        $references = $this->references();
        $definitions = $this->definitions();

        if (isset($references[$entity])) {
            $ref = $references[$entity];

            return response()->json(
                DB::table($ref['table'])->limit(500)->get()->map(fn ($row) => [
                    'value' => (int) $row->{$ref['value']},
                    'label' => (string) $row->{$ref['label']},
                ])->values()
            );
        }

        $def = $definitions[$entity] ?? throw new NotFoundHttpException("Referensi '{$entity}' tidak ditemukan.");

        return response()->json(
            DB::table($def['table'])->limit(500)->get()->map(fn ($row) => [
                'value' => (int) $row->id,
                'label' => (string) $row->{$def['labelColumn']},
            ])->values()
        );
    }
}
