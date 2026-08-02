import {
    type RouteConfig,
    index,
    route,
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/login", "routes/login.tsx"),
    route("/dashboard", "dashboard/dashboard.tsx"),
    route("/pendaftaran", "pendaftaran/pendaftaran.tsx"),
    route("/jadwal-dokter", "jadwal-dokter/jadwal-dokter.tsx"),
    route("/rekam-medis", "rekam-medis/rekam-medis.tsx"),
    route("/pemeriksaan", "pemeriksaan/pemeriksaan.tsx"),
    route("/farmasi", "farmasi/farmasi.tsx"),
    route("/rawat-inap", "rawat-inap/rawat-inap.tsx"),
    route("/laporan", "laporan/laporan.tsx"),
    route("/pengaturan", "pengaturan/pengaturan.tsx"),
] satisfies RouteConfig;

