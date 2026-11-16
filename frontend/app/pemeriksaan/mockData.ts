import type { Doctor, PatientRecord, ExamFormData } from "./types";

export const FEMALE_AVATARS = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1594824813566-78a9c5123d47?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&auto=format&fit=crop&q=80",
];

export const MALE_AVATARS = [
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80",
];

export const INITIAL_DOCTORS: Doctor[] = [
    {
        id: "doc-1",
        name: "dr. Andi Prasetyo",
        title: "Sp.PD",
        specialty: "Poli Umum & Penyakit Dalam",
        categoryId: "gp",
        avatar: MALE_AVATARS[0],
        experienceYears: 10,
        rating: 4.9,
        reviewCount: "5.4K",
        totalPatients: "8,920",
        fee: 200000,
        status: "Praktik",
        scheduleTime: "08.00 AM - 14.00 PM",
        room: "Poli Umum R.101",
        isFavorite: true,
        nextAvailableDate: "Hari Ini, 05 Okt 2026",
        about: "dr. Andi Prasetyo adalah dokter spesialis penyakit dalam berdedikasi tinggi di SIMRS."
    },
    {
        id: "doc-2",
        name: "dr. Maya Kartika",
        title: "Sp.A",
        specialty: "Poli Anak (Pediatri)",
        categoryId: "pediatri",
        avatar: FEMALE_AVATARS[0],
        experienceYears: 8,
        rating: 4.8,
        reviewCount: "4.2K",
        totalPatients: "6,120",
        fee: 250000,
        status: "Praktik",
        scheduleTime: "08.00 AM - 14.00 PM",
        room: "Poli Anak R.102",
        isFavorite: false,
        nextAvailableDate: "Hari Ini, 05 Okt 2026",
        about: "Spesialis kesehatan dan tumbuh kembang anak dengan pendekatan ramah keluarga."
    },
    {
        id: "doc-3",
        name: "dr. Budi Setiawan",
        title: "Sp.JP (K) FIHA",
        specialty: "Poli Jantung & Pembuluh Darah",
        categoryId: "jantung",
        avatar: MALE_AVATARS[1],
        experienceYears: 14,
        rating: 5.0,
        reviewCount: "6.8K",
        totalPatients: "12,400",
        fee: 300000,
        status: "Praktik",
        scheduleTime: "09.00 AM - 15.00 PM",
        room: "Poli Jantung R.201",
        isFavorite: true,
        nextAvailableDate: "Hari Ini, 05 Okt 2026",
        about: "Konsultan kardiologi intervensi dengan keahlian penanganan penyakit jantung koroner dan aritmia."
    }
];

export const INITIAL_PATIENTS: PatientRecord[] = [
    {
        id: "pat-1",
        queueNo: "A-012",
        norm: "RM-2026-0041",
        name: "Budi Santoso",
        age: 34,
        gender: "L",
        clinic: "Poli Umum",
        doctorName: "dr. Andi Prasetyo",
        arrivalTime: "08:15 WIB",
        guarantee: "BPJS",
        status: "Sedang Diperiksa",
        chiefComplaint: "Keluhan nyeri dada ringan dan sesak napas saat naik tangga",
        allergies: ["Penicillin", "Sulfonamide"],
        vitals: {
            bp: "120/80",
            hr: "78",
            temp: "36.6",
            rr: "20",
            spo2: "98",
            height: "170",
            weight: "68",
            kesadaran: "Compos Mentis (GCS E4V5M6)"
        },
        diagnosis: "Angina Pectoris, unspecified",
        icdCode: "I20.9"
    },
    {
        id: "pat-2",
        queueNo: "A-013",
        norm: "RM-2026-0042",
        name: "Siti Rahma",
        age: 28,
        gender: "P",
        clinic: "Poli Umum",
        doctorName: "dr. Andi Prasetyo",
        arrivalTime: "08:30 WIB",
        guarantee: "Umum",
        status: "Menunggu",
        chiefComplaint: "Demam tinggi 2 hari disertai nyeri tenggorokan dan batuk kering",
        allergies: [],
        vitals: {
            bp: "110/70",
            hr: "88",
            temp: "38.5",
            rr: "20",
            spo2: "99",
            height: "158",
            weight: "52",
            kesadaran: "Compos Mentis (GCS E4V5M6)"
        },
        diagnosis: "Nasofaringitis Akut (ISPA)",
        icdCode: "J00"
    },
    {
        id: "pat-3",
        queueNo: "B-005",
        norm: "RM-2026-0038",
        name: "Ananda Kevin",
        age: 7,
        gender: "L",
        clinic: "Poli Anak",
        doctorName: "dr. Maya Kartika",
        arrivalTime: "08:45 WIB",
        guarantee: "BPJS",
        status: "Menunggu",
        chiefComplaint: "Batuk pilek dan nafsu makan menurun sejak 3 hari",
        allergies: ["Debu / Tungau"],
        vitals: {
            bp: "100/65",
            hr: "95",
            temp: "37.2",
            rr: "22",
            spo2: "99",
            height: "115",
            weight: "21",
            kesadaran: "Compos Mentis"
        },
        diagnosis: "Bronkitis Akut Anak",
        icdCode: "J20.9"
    },
    {
        id: "pat-4",
        queueNo: "C-002",
        norm: "RM-2026-0019",
        name: "H. Hendro Suyatno",
        age: 58,
        gender: "L",
        clinic: "Poli Jantung",
        doctorName: "dr. Budi Setiawan",
        arrivalTime: "08:00 WIB",
        guarantee: "BPJS",
        status: "Selesai",
        chiefComplaint: "Kontrol rutin Hipertensi dan evaluasi EKG berkala",
        allergies: ["Aspirin"],
        vitals: {
            bp: "135/85",
            hr: "72",
            temp: "36.5",
            rr: "18",
            spo2: "97",
            height: "165",
            weight: "74",
            kesadaran: "Compos Mentis"
        },
        diagnosis: "Essential (primary) hypertension",
        icdCode: "I10"
    },
    {
        id: "pat-5",
        queueNo: "A-014",
        norm: "RM-2026-0055",
        name: "Dewi Lestari",
        age: 42,
        gender: "P",
        clinic: "Poli Umum",
        doctorName: "dr. Andi Prasetyo",
        arrivalTime: "09:10 WIB",
        guarantee: "Asuransi Mandiri",
        status: "Menunggu",
        chiefComplaint: "Nyeri ulu hati terasa perih seperti terbakar, mual sesudah makan",
        allergies: [],
        vitals: {
            bp: "118/78",
            hr: "80",
            temp: "36.7",
            rr: "18",
            spo2: "99",
            height: "160",
            weight: "56",
            kesadaran: "Compos Mentis"
        },
        diagnosis: "Gastritis Akut & Dispepsia",
        icdCode: "K29.7"
    }
];

const PATIENTS_STORAGE_KEY = "simrs_patients_data_v2";
const ACTIVE_PATIENT_KEY = "simrs_active_patient_id_v2";

export function getSavedPatients(): PatientRecord[] {
    if (typeof window === "undefined") return INITIAL_PATIENTS;
    try {
        const raw = localStorage.getItem(PATIENTS_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch {
        // Fallback
    }
    return INITIAL_PATIENTS;
}

export function savePatients(patients: PatientRecord[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
    } catch {
        // Fallback
    }
}

export function getActivePatientId(): string {
    if (typeof window === "undefined") return INITIAL_PATIENTS[0].id;
    try {
        const val = localStorage.getItem(ACTIVE_PATIENT_KEY);
        if (val) return val;
    } catch {
        // Fallback
    }
    return INITIAL_PATIENTS[0].id;
}

export function setActivePatientId(id: string) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(ACTIVE_PATIENT_KEY, id);
    } catch {
        // Fallback
    }
}

export function getPatientById(id?: string | null): PatientRecord {
    const list = getSavedPatients();
    if (!id) {
        const activeId = getActivePatientId();
        return list.find(p => p.id === activeId) || list[0];
    }
    return list.find(p => p.id === id) || list[0];
}

export function updatePatientStatus(patientId: string, newStatus: PatientRecord["status"]) {
    const list = getSavedPatients();
    const updated = list.map(p => p.id === patientId ? { ...p, status: newStatus } : p);
    savePatients(updated);
    return updated;
}
