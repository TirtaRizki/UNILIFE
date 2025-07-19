import AboutContent from "./about-table";
// src/app/(app)/about/page.tsx
import { AboutClientWrapper } from "./about-client-wrapper"; // Mengimpor komponen klien yang baru
import type { About } from "@/lib/types"; // Memastikan tipe About diimpor

// Ini adalah Server Component, artinya ia berjalan di sisi server.
// Data yang diambil di sini akan menjadi bagian dari HTML awal yang dikirim ke peramban,
// mencegah konten menghilang saat refresh.
export default async function AboutPage() {
    let initialAbouts: About[] = []; // Variabel untuk menyimpan data About
    try {
        // Mengambil data langsung dari rute API Anda.
        // Di lingkungan produksi yang sebenarnya, Anda mungkin mengambil langsung dari database
        // atau layanan backend di sini, daripada memanggil rute API Anda sendiri.
        // Namun, untuk konsistensi dengan pengambilan data sisi klien yang ada,
        // memanggil rute API adalah pengganti langsung.
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/about`, {
            // Opsi 'cache: no-store' memastikan data selalu diambil baru pada setiap permintaan,
            // mirip dengan fungsi getServerSideProps di Pages Router.
            // Untuk konten statis atau yang jarang berubah, Anda bisa menggunakan 'force-cache'
            // atau opsi 'revalidate' untuk Incremental Static Regeneration (ISR).
            cache: 'no-store'
        });

        if (!response.ok) {
            // Log kesalahan jika pengambilan data gagal
            console.error("Failed to fetch about content:", response.status, response.statusText);
            // Secara opsional, tangani kode kesalahan tertentu (misalnya, 404, 500)
            // Untuk saat ini, kita akan melanjutkan dengan array kosong jika pengambilan gagal.
        } else {
            // Parsing respons JSON menjadi tipe About[]
            initialAbouts = await response.json();
        }
    } catch (error) {
        // Tangani kesalahan jaringan atau masalah lain selama pengambilan data
        console.error("Error fetching about content on server:", error);
    }

    return (
        // Meneruskan data yang diambil ke komponen klien
        <AboutClientWrapper initialAbouts={initialAbouts} />
    );
}
