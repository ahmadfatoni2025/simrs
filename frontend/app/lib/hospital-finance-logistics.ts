// Definisi Tipe dan Data Terintegrasi untuk Farmasi, Kasir/Billing, dan Logistik SIMRS

export type PenjaminType = "BPJS Kesehatan" | "Umum" | "Asuransi Swasta";

export interface ItemRincianBilling {
    id: string;
    kategori: "Tindakan / Konsultasi" | "Farmasi / Obat" | "Penunjang Lab/Rad" | "Akomodasi Kamar" | "Administrasi";
    namaItem: string;
    jumlah: number;
    satuan: string;
    tarifSatuan: number;
    subtotal: number;
    statusJurnal?: "Tercatat" | "Pending";
}

export interface TagihanBillingRS {
    id: string;
    noBilling: string;
    noNota?: string;
    noResepRef?: string;
    noRegistrasi: string;
    pasien: string;
    norm: string;
    jenisKelamin?: "L" | "P";
    umur?: string;
    layanan: string;
    kelasRawat?: string;
    dokterPemeriksa?: string;
    penjamin: PenjaminType;
    noSepBpjs?: string;
    totalBiaya: number;
    totalSudahBayar: number;
    sisaTagihan: number;
    status: "Belum Bayar" | "Lunas" | "Deposit" | "Klaim BPJS" | "Batal";
    tanggal: string;
    jam: string;
    items: ItemRincianBilling[];
    metodePembayaran?: "Tunai" | "QRIS" | "EDC / Debit" | "Virtual Account" | "BPJS Direct";
    kasirPetugas?: string;
    depositTerpakai?: number;
    catatan?: string;
}

export interface DepositPasienItem {
    id: string;
    norm: string;
    pasien: string;
    ruangan: string;
    saldoDeposit: number;
    riwayatDeposit: {
        id: string;
        tanggal: string;
        nominal: number;
        tipe: "Masuk" | "Dipakai Billing";
        keterangan: string;
        petugas: string;
    }[];
}

export interface ShiftKasir {
    id: string;
    namaKasir: string;
    shift: "Pagi (07:00 - 14:00)" | "Siang (14:00 - 21:00)" | "Malam (21:00 - 07:00)";
    status: "Buka" | "Tutup";
    modalAwal: number;
    totalTunaiMasuk: number;
    totalNonTunai: number;
    totalTransaksi: number;
    waktuBuka: string;
    waktuTutup?: string;
    selisihKas?: number;
}

export interface JurnalAkuntansiItem {
    id: string;
    noJurnal: string;
    tanggal: string;
    referensi: string;
    keterangan: string;
    debitAkun: string;
    kreditAkun: string;
    nominal: number;
    sumber: "Kasir Billing" | "Farmasi Penjualan" | "Logistik Pengadaan" | "Penerimaan Piutang BPJS";
}

// Logistik Types
export interface ItemLogistikStok {
    id: string;
    kodeBarang: string;
    namaBarang: string;
    kategori: "Obat & Farmasi" | "Alkes & BMHP" | "Logistik Umum / ATK" | "Reagen Laboratorium";
    stokGudangUtama: number;
    stokDepoFarmasi: number;
    satuan: string;
    minStok: number;
    maxStok: number;
    hargaBeliSatuan: number;
    hargaJualSatuan: number;
    batchNo: string;
    expiredDate: string;
    suplier: string;
}

export interface PurchaseOrderLogistik {
    id: string;
    noPO: string;
    tanggal: string;
    suplier: string;
    tipePengadaan: "Reguler Farmasi" | "Cito BMHP" | "Logistik Umum";
    status: "Draft" | "Diajukan" | "Disetujui Direktur" | "Diterima Sebagian" | "Selesai Diterima";
    estimasiTotal: number;
    items: {
        kodeBarang: string;
        namaBarang: string;
        jumlahOrder: number;
        satuan: string;
        hargaEst: number;
        subtotal: number;
    }[];
    catatan?: string;
}

export interface SuratPenerimaanLogistik {
    id: string;
    noPenerimaan: string;
    noPORef: string;
    noFakturSuplier: string;
    tanggal: string;
    suplier: string;
    penerima: string;
    totalFaktur: number;
    statusJurnal: "Sudah Jurnal Hutang" | "Pending";
    items: {
        kodeBarang: string;
        namaBarang: string;
        batchNo: string;
        expiredDate: string;
        jumlahDiterima: number;
        satuan: string;
        hargaBeli: number;
        subtotal: number;
    }[];
}

export interface DistribusiUnitLogistik {
    id: string;
    noPermintaan: string;
    unitPeminta: "Depo Farmasi Rawat Jalan" | "Depo Farmasi Rawat Inap" | "Depo IGD" | "Poli Umum" | "Laboratorium";
    tanggal: string;
    status: "Permintaan Diajukan" | "Disetujui Gudang" | "Didistribusikan / Selesai";
    petugasGudang?: string;
    items: {
        kodeBarang: string;
        namaBarang: string;
        jumlahDiminta: number;
        jumlahDiserahkan: number;
        satuan: string;
    }[];
}

// STORAGE KEYS
export const STORAGE_KEYS = {
    BILLING_LIST: "simrs_billing_tagihan_list",
    DEPOSIT_LIST: "simrs_deposit_pasien_list",
    SHIFT_KASIR: "simrs_shift_kasir_active",
    JURNAL_LIST: "simrs_jurnal_akuntansi_list",
    LOGISTIK_STOK: "simrs_logistik_stok_list",
    LOGISTIK_PO: "simrs_logistik_po_list",
    LOGISTIK_PENERIMAAN: "simrs_logistik_penerimaan_list",
    LOGISTIK_DISTRIBUSI: "simrs_logistik_distribusi_list",
    FARMASI_RESEP: "simrs_farmasi_resep_list",
    FARMASI_STOK: "simrs_farmasi_stok_list",
};

// INITIAL SEED DATA

export const SEED_BILLING_LIST: TagihanBillingRS[] = [
    {
        id: "bill-1",
        noBilling: "BILL-2026-0901",
        noNota: "KW-2026-0901",
        noResepRef: "RSP-2026-0891",
        noRegistrasi: "REG-RJ-2026-0129",
        pasien: "Budi Santoso",
        norm: "RM-2026-0041",
        jenisKelamin: "L",
        umur: "45 Thn",
        layanan: "Rawat Jalan - Poli Penyakit Dalam",
        dokterPemeriksa: "dr. Andi Prasetyo, Sp.PD",
        penjamin: "BPJS Kesehatan",
        noSepBpjs: "0192R0010926V000891",
        totalBiaya: 173000,
        totalSudahBayar: 173000,
        sisaTagihan: 0,
        status: "Lunas",
        tanggal: "05 Okt 2026",
        jam: "10:15 WIB",
        metodePembayaran: "BPJS Direct",
        kasirPetugas: "Nurul Aini, S.Ak",
        items: [
            { id: "itm-1", kategori: "Tindakan / Konsultasi", namaItem: "Konsultasi & Pemeriksaan Dokter Spesialis PD", jumlah: 1, satuan: "Kunjungan", tarifSatuan: 130000, subtotal: 130000, statusJurnal: "Tercatat" },
            { id: "itm-2", kategori: "Farmasi / Obat", namaItem: "Paracetamol 500mg Tablet (10 Tab)", jumlah: 10, satuan: "Tablet", tarifSatuan: 1500, subtotal: 15000, statusJurnal: "Tercatat" },
            { id: "itm-3", kategori: "Farmasi / Obat", namaItem: "Omeprazole 20mg Kapsul (7 Kap)", jumlah: 7, satuan: "Kapsul", tarifSatuan: 4000, subtotal: 28000, statusJurnal: "Tercatat" },
        ]
    },
    {
        id: "bill-2",
        noBilling: "BILL-2026-0902",
        noNota: "KW-2026-0902",
        noResepRef: "RSP-2026-0892",
        noRegistrasi: "REG-RJ-2026-0130",
        pasien: "Siti Rahma",
        norm: "RM-2026-0042",
        jenisKelamin: "P",
        umur: "6 Thn",
        layanan: "Rawat Jalan - Poli Anak",
        dokterPemeriksa: "dr. Maya Kartika, Sp.A",
        penjamin: "Umum",
        totalBiaya: 192000,
        totalSudahBayar: 0,
        sisaTagihan: 192000,
        status: "Belum Bayar",
        tanggal: "05 Okt 2026",
        jam: "10:45 WIB",
        items: [
            { id: "itm-4", kategori: "Tindakan / Konsultasi", namaItem: "Pemeriksaan Dokter Spesialis Anak", jumlah: 1, satuan: "Kunjungan", tarifSatuan: 150000, subtotal: 150000 },
            { id: "itm-5", kategori: "Farmasi / Obat", namaItem: "Racikan Puyer Batuk Pilek Anak (12 Bungkus)", jumlah: 12, satuan: "Bungkus", tarifSatuan: 3500, subtotal: 42000 },
        ]
    },
    {
        id: "bill-3",
        noBilling: "BILL-2026-0903",
        noNota: "KW-2026-0903",
        noResepRef: "RSP-2026-0889",
        noRegistrasi: "REG-RJ-2026-0125",
        pasien: "Dewi Lestari",
        norm: "RM-2026-0038",
        jenisKelamin: "P",
        umur: "52 Thn",
        layanan: "Rawat Jalan - Poli Jantung",
        dokterPemeriksa: "dr. Rian Ramadhan, Sp.JP",
        penjamin: "Asuransi Swasta",
        totalBiaya: 242000,
        totalSudahBayar: 0,
        sisaTagihan: 242000,
        status: "Belum Bayar",
        tanggal: "05 Okt 2026",
        jam: "09:20 WIB",
        items: [
            { id: "itm-6", kategori: "Tindakan / Konsultasi", namaItem: "Pemeriksaan EKG Rekam Jantung Dasar", jumlah: 1, satuan: "Tindakan", tarifSatuan: 120000, subtotal: 120000 },
            { id: "itm-7", kategori: "Tindakan / Konsultasi", namaItem: "Konsultasi Spesialis Jantung", jumlah: 1, satuan: "Kunjungan", tarifSatuan: 110000, subtotal: 110000 },
            { id: "itm-8", kategori: "Farmasi / Obat", namaItem: "Cetirizine 10mg Tablet (10 Tab)", jumlah: 10, satuan: "Tablet", tarifSatuan: 1200, subtotal: 12000 },
        ]
    },
    {
        id: "bill-4",
        noBilling: "BILL-2026-0904",
        noNota: "KW-2026-0904",
        noRegistrasi: "REG-RI-2026-0088",
        pasien: "Ahmad Fauzi",
        norm: "RM-2026-0044",
        jenisKelamin: "L",
        umur: "38 Thn",
        layanan: "Rawat Inap - Ruang Melati Kelas 1",
        kelasRawat: "Kelas 1 (Bed 01)",
        dokterPemeriksa: "dr. Hendra Kurniawan, Sp.B",
        penjamin: "Umum",
        totalBiaya: 2850000,
        totalSudahBayar: 1000000,
        sisaTagihan: 1850000,
        status: "Deposit",
        tanggal: "05 Okt 2026",
        jam: "08:30 WIB",
        depositTerpakai: 1000000,
        items: [
            { id: "itm-9", kategori: "Akomodasi Kamar", namaItem: "Kamar Perawatan Kelas 1 (2 Hari)", jumlah: 2, satuan: "Hari", tarifSatuan: 450000, subtotal: 900000 },
            { id: "itm-10", kategori: "Tindakan / Konsultasi", namaItem: "Visite Dokter Spesialis Bedah (2x)", jumlah: 2, satuan: "Visite", tarifSatuan: 200000, subtotal: 400000 },
            { id: "itm-11", kategori: "Penunjang Lab/Rad", namaItem: "Pemeriksaan Darah Rutin + Elektrolit", jumlah: 1, satuan: "Pemeriksaan", tarifSatuan: 350000, subtotal: 350000 },
            { id: "itm-12", kategori: "Farmasi / Obat", namaItem: "Infus RL, Ceftriaxone Injeksi & BMHP Bedah", jumlah: 1, satuan: "Paket", tarifSatuan: 1200000, subtotal: 1200000 },
        ]
    }
];

export const SEED_DEPOSIT_LIST: DepositPasienItem[] = [
    {
        id: "dep-1",
        norm: "RM-2026-0044",
        pasien: "Ahmad Fauzi",
        ruangan: "Ruang Melati Bed 01",
        saldoDeposit: 1500000,
        riwayatDeposit: [
            { id: "rd-1", tanggal: "03 Okt 2026 14:00", nominal: 2500000, tipe: "Masuk", keterangan: "Deposit awal admisi Rawat Inap", petugas: "Nurul Aini" },
            { id: "rd-2", tanggal: "05 Okt 2026 09:00", nominal: 1000000, tipe: "Dipakai Billing", keterangan: "Pemotongan biaya sebagian kamar & obat", petugas: "Nurul Aini" }
        ]
    },
    {
        id: "dep-2",
        norm: "RM-2026-0045",
        pasien: "Ibu Hartatik",
        ruangan: "Ruang Mawar VIP Bed 02",
        saldoDeposit: 5000000,
        riwayatDeposit: [
            { id: "rd-3", tanggal: "04 Okt 2026 10:15", nominal: 5000000, tipe: "Masuk", keterangan: "Deposit Uang Muka Operasi Laparoskopi", petugas: "Nurul Aini" }
        ]
    }
];

export const SEED_SHIFT_KASIR: ShiftKasir = {
    id: "shift-20261005-01",
    namaKasir: "Nurul Aini, S.Ak (Kasir Loket 1)",
    shift: "Pagi (07:00 - 14:00)",
    status: "Buka",
    modalAwal: 500000,
    totalTunaiMasuk: 3500000,
    totalNonTunai: 4820000,
    totalTransaksi: 18,
    waktuBuka: "05 Okt 2026, 06:45 WIB"
};

export const SEED_JURNAL_LIST: JurnalAkuntansiItem[] = [
    {
        id: "jr-01",
        noJurnal: "JU-2026-00101",
        tanggal: "05 Okt 2026",
        referensi: "KW-2026-0901",
        keterangan: "Penerimaan Billing Pasien BPJS Budi Santoso (RM-2026-0041)",
        debitAkun: "1-10200 Piutang Pelayanan BPJS",
        kreditAkun: "4-10100 Pendapatan Rawat Jalan & Farmasi",
        nominal: 173000,
        sumber: "Kasir Billing"
    },
    {
        id: "jr-02",
        noJurnal: "JU-2026-00102",
        tanggal: "05 Okt 2026",
        referensi: "FKT-KF-2026-88",
        keterangan: "Penerimaan Faktur Kimia Farma (Amoxicillin & Cefotaxime)",
        debitAkun: "1-10500 Persediaan Obat & BMHP",
        kreditAkun: "2-10100 Hutang Usaha Suplier Farmasi",
        nominal: 4500000,
        sumber: "Logistik Pengadaan"
    },
    {
        id: "jr-03",
        noJurnal: "JU-2026-00103",
        tanggal: "05 Okt 2026",
        referensi: "DEP-2026-0044",
        keterangan: "Penerimaan Deposit Pasien Rawat Inap Ahmad Fauzi",
        debitAkun: "1-10100 Kas Kasir Loket 1",
        kreditAkun: "2-10300 Titipan Uang Muka / Deposit Pasien",
        nominal: 2500000,
        sumber: "Kasir Billing"
    }
];

export const SEED_LOGISTIK_STOK: ItemLogistikStok[] = [
    {
        id: "log-1",
        kodeBarang: "FAR-001",
        namaBarang: "Paracetamol 500mg Tablet",
        kategori: "Obat & Farmasi",
        stokGudangUtama: 5000,
        stokDepoFarmasi: 1450,
        satuan: "Tablet",
        minStok: 1000,
        maxStok: 10000,
        hargaBeliSatuan: 1100,
        hargaJualSatuan: 1500,
        batchNo: "BATCH-PCT-2601",
        expiredDate: "2027-12-01",
        suplier: "PT Kalbe Farma Tbk"
    },
    {
        id: "log-2",
        kodeBarang: "FAR-002",
        namaBarang: "Amoxicillin 500mg Kapsul",
        kategori: "Obat & Farmasi",
        stokGudangUtama: 200,
        stokDepoFarmasi: 80,
        satuan: "Kapsul",
        minStok: 500,
        maxStok: 5000,
        hargaBeliSatuan: 2200,
        hargaJualSatuan: 3000,
        batchNo: "BATCH-AMX-2604",
        expiredDate: "2026-11-15",
        suplier: "PT Kimia Farma Trading"
    },
    {
        id: "log-3",
        kodeBarang: "FAR-003",
        namaBarang: "Omeprazole 20mg Kapsul",
        kategori: "Obat & Farmasi",
        stokGudangUtama: 2400,
        stokDepoFarmasi: 620,
        satuan: "Kapsul",
        minStok: 400,
        maxStok: 4000,
        hargaBeliSatuan: 3100,
        hargaJualSatuan: 4000,
        batchNo: "BATCH-OMZ-2602",
        expiredDate: "2028-05-20",
        suplier: "PT Dexa Medica"
    },
    {
        id: "log-4",
        kodeBarang: "BMHP-001",
        namaBarang: "Spuit 3cc Terumo with Needle",
        kategori: "Alkes & BMHP",
        stokGudangUtama: 1500,
        stokDepoFarmasi: 320,
        satuan: "Pcs",
        minStok: 500,
        maxStok: 3000,
        hargaBeliSatuan: 2500,
        hargaJualSatuan: 3500,
        batchNo: "SP-TRM-88",
        expiredDate: "2029-01-01",
        suplier: "PT Terumo Indonesia"
    },
    {
        id: "log-5",
        kodeBarang: "BMHP-002",
        namaBarang: "Infus Ringer Lactat (RL) 500ml Otsuka",
        kategori: "Alkes & BMHP",
        stokGudangUtama: 850,
        stokDepoFarmasi: 140,
        satuan: "Kolf / Botol",
        minStok: 300,
        maxStok: 2000,
        hargaBeliSatuan: 12500,
        hargaJualSatuan: 16000,
        batchNo: "RL-OTSU-26A",
        expiredDate: "2028-08-10",
        suplier: "PT Otsuka Indonesia"
    },
    {
        id: "log-6",
        kodeBarang: "FAR-004",
        namaBarang: "Cefadroxil 500mg Kapsul",
        kategori: "Obat & Farmasi",
        stokGudangUtama: 150,
        stokDepoFarmasi: 45,
        satuan: "Kapsul",
        minStok: 300,
        maxStok: 3000,
        hargaBeliSatuan: 4200,
        hargaJualSatuan: 5500,
        batchNo: "CFD-SNB-26",
        expiredDate: "2026-10-30",
        suplier: "PT Sanbe Farma"
    }
];

export const SEED_LOGISTIK_PO: PurchaseOrderLogistik[] = [
    {
        id: "po-1",
        noPO: "PO-RS-2026-0312",
        tanggal: "04 Okt 2026",
        suplier: "PT Kimia Farma Trading",
        tipePengadaan: "Reguler Farmasi",
        status: "Disetujui Direktur",
        estimasiTotal: 12500000,
        items: [
            { kodeBarang: "FAR-002", namaBarang: "Amoxicillin 500mg Kapsul", jumlahOrder: 2000, satuan: "Kapsul", hargaEst: 2200, subtotal: 4400000 },
            { kodeBarang: "FAR-004", namaBarang: "Cefadroxil 500mg Kapsul", jumlahOrder: 1500, satuan: "Kapsul", hargaEst: 4200, subtotal: 6300000 },
            { kodeBarang: "FAR-005", namaBarang: "Cefotaxime 1g Injeksi", jumlahOrder: 100, satuan: "Vial", hargaEst: 18000, subtotal: 1800000 }
        ],
        catatan: "Pengadaan rutin antibiotik untuk mengantisipasi stok kritis depo farmasi."
    },
    {
        id: "po-2",
        noPO: "PO-RS-2026-0315",
        tanggal: "05 Okt 2026",
        suplier: "PT Otsuka Indonesia",
        tipePengadaan: "Cito BMHP",
        status: "Diajukan",
        estimasiTotal: 8750000,
        items: [
            { kodeBarang: "BMHP-002", namaBarang: "Infus Ringer Lactat (RL) 500ml Otsuka", jumlahOrder: 700, satuan: "Kolf", hargaEst: 12500, subtotal: 8750000 }
        ],
        catatan: "Kebutuhan mendesak ruang rawat inap dan IGD."
    }
];

export const SEED_LOGISTIK_PENERIMAAN: SuratPenerimaanLogistik[] = [
    {
        id: "rcv-1",
        noPenerimaan: "BPB-2026-0288",
        noPORef: "PO-RS-2026-0298",
        noFakturSuplier: "FK-KALBE-99120",
        tanggal: "03 Okt 2026",
        suplier: "PT Kalbe Farma Tbk",
        penerima: "Ahmad Zainuri, S.Farm (Gudang Medis)",
        totalFaktur: 5500000,
        statusJurnal: "Sudah Jurnal Hutang",
        items: [
            { kodeBarang: "FAR-001", namaBarang: "Paracetamol 500mg Tablet", batchNo: "BATCH-PCT-2601", expiredDate: "2027-12-01", jumlahDiterima: 5000, satuan: "Tablet", hargaBeli: 1100, subtotal: 5500000 }
        ]
    }
];

export const SEED_LOGISTIK_DISTRIBUSI: DistribusiUnitLogistik[] = [
    {
        id: "dist-1",
        noPermintaan: "SP-UNIT-2026-081",
        unitPeminta: "Depo Farmasi Rawat Jalan",
        tanggal: "05 Okt 2026",
        status: "Didistribusikan / Selesai",
        petugasGudang: "Ahmad Zainuri",
        items: [
            { kodeBarang: "FAR-001", namaBarang: "Paracetamol 500mg Tablet", jumlahDiminta: 500, jumlahDiserahkan: 500, satuan: "Tablet" },
            { kodeBarang: "FAR-003", namaBarang: "Omeprazole 20mg Kapsul", jumlahDiminta: 200, jumlahDiserahkan: 200, satuan: "Kapsul" }
        ]
    },
    {
        id: "dist-2",
        noPermintaan: "SP-UNIT-2026-082",
        unitPeminta: "Depo IGD",
        tanggal: "05 Okt 2026",
        status: "Permintaan Diajukan",
        petugasGudang: "Menunggu Approval",
        items: [
            { kodeBarang: "BMHP-001", namaBarang: "Spuit 3cc Terumo with Needle", jumlahDiminta: 200, jumlahDiserahkan: 0, satuan: "Pcs" },
            { kodeBarang: "BMHP-002", namaBarang: "Infus Ringer Lactat (RL) 500ml Otsuka", jumlahDiminta: 100, jumlahDiserahkan: 0, satuan: "Kolf" }
        ]
    }
];
