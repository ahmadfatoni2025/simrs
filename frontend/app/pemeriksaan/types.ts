export type KedokteranTabType =
    | "dashboard"
    | "antrean"
    | "anamnesis"
    | "pemeriksaan"
    | "resep"
    | "order"
    | "cppt";

export interface Doctor {
    id: string;
    name: string;
    title: string;
    specialty: string;
    categoryId: string;
    avatar: string;
    experienceYears: number;
    rating: number;
    reviewCount: string;
    totalPatients: string;
    fee: number;
    status: "Praktik" | "Istirahat" | "Dalam Pemeriksaan";
    scheduleTime: string;
    room: string;
    isFavorite?: boolean;
    nextAvailableDate: string;
    about: string;
}

export interface PatientRecord {
    id: string;
    queueNo: string;
    norm: string;
    name: string;
    age: number;
    gender: "L" | "P";
    clinic: string;
    doctorName: string;
    arrivalTime: string;
    guarantee: "BPJS" | "Umum" | "Asuransi Mandiri";
    status: "Menunggu" | "Sedang Diperiksa" | "Selesai" | "Batal";
    chiefComplaint: string;
    allergies?: string[];
    vitals?: {
        bp?: string;
        hr?: string;
        temp?: string;
        rr?: string;
        spo2?: string;
        height?: string;
        weight?: string;
        kesadaran?: string;
    };
    diagnosis?: string;
    icdCode?: string;
}

export interface RecipeItem {
    id: string;
    namaObat: string;
    bentuk: string;
    dosis: string;
    aturanPakai: string;
    jumlah: number;
    satuan: string;
    harga?: number;
    catatan?: string;
}

export interface OrderPenunjangItem {
    id: string;
    type: "LAB" | "RAD";
    namaPemeriksaan: string;
    kategori: string;
    isCito: boolean;
    tarif: number;
}

export interface CPPTEntry {
    id: string;
    tanggal: string;
    ppa: "Dokter (DPJP)" | "Perawat" | "Apoteker" | "Gizi";
    namaPPA: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    instruksi: string;
    isVerified: boolean;
}

export interface ExamFormData {
    patientId: string;
    keluhanUtama: string;
    riwayatSekarang: string;
    riwayatPenyakitDahulu: string;
    riwayatPenyakitKeluarga: string;
    riwayatAlergi: string;
    // Vitals
    bpSys: string;
    bpDia: string;
    hr: string;
    temp: string;
    rr: string;
    spo2: string;
    height: string;
    weight: string;
    kesadaran: string;
    // Physical Exam
    pemeriksaanKepala: string;
    pemeriksaanThorax: string;
    pemeriksaanAbdomen: string;
    pemeriksaanEkstremitas: string;
    statusLokalisLain: string;
    // Assessment
    icdCode: string;
    icdName: string;
    diagnosaSekunder: string;
    catatanMedis: string;
    // Plan
    tindakLanjut: string;
    edukasiPasien: string;
    lastSaved?: string;
}
