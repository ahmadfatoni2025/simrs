import PemeriksaanDashboardPage from "./index";

export * from "./types";
export * from "./mockData";

export const SEEDED_DOCTORS = [
    {
        id: "doc-1",
        name: "dr. Andi Prasetyo",
        title: "Sp.PD",
        specialty: "Poli Umum",
        categoryId: "gp",
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
        experienceYears: 10,
        rating: 4.9,
        reviewCount: "5.4K",
        totalPatients: "8,920",
        fee: 200000,
        status: "Praktik" as const,
        scheduleTime: "08.00 AM - 14.00 PM",
        room: "Poli Umum R.101",
        isFavorite: true,
        nextAvailableDate: "Hari Ini, 05 Okt 2026",
        about: "dr. Andi Prasetyo adalah dokter umum senior berdedikasi tinggi di SIMRS."
    }
];

export const SEEDED_PATIENTS = [
    {
        id: "pat-1",
        queueNo: "A-012",
        norm: "RM-2026-0041",
        name: "Budi Santoso",
        age: 34,
        gender: "L" as const,
        clinic: "Poli Umum",
        doctorName: "dr. Andi Prasetyo",
        arrivalTime: "08:15 WIB",
        guarantee: "BPJS" as const,
        status: "Sedang Diperiksa" as const,
        chiefComplaint: "Pemeriksaan medis rutin dan kontrol kesehatan",
        vitals: { bp: "120/80", hr: "78 bpm", temp: "36.6 °C", spo2: "98%" }
    }
];

export interface HistoryItem {
    id: string;
    date: string;
    patientName: string;
    norm: string;
    doctorName: string;
    clinic: string;
    actionName: string;
    nominal: number;
    status: string;
    keterangan: string;
}

export default PemeriksaanDashboardPage;
