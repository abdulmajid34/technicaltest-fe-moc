# TaskFlow Manager

TaskFlow Manager adalah aplikasi manajemen tugas yang dibuat menggunakan React, Vite, dan TypeScript. Proyek ini menggunakan Tailwind CSS untuk styling, Zustand untuk manajemen state global, dan TanStack Query (React Query) untuk menangani fetching data dari API Mock.

## Teknologi yang Digunakan

- React + Vite + TypeScript
- Tailwind CSS v4 (dengan custom utilities dan variant)
- Zustand (Global State & Session)
- Axios + TanStack Query (React Query)
- LocalStorage (sebagai database offline mock)
- React Hook Form + Zod (validasi input)
- Lucide React (ikon)
- React Hot Toast (notifikasi)

## Cara Menjalankan Proyek

1. **Clone repository ini:**

   ```bash
   git clone <url-repo>
   cd technicaltest-fe-moc
   ```

2. **Install dependensi:**

   ```bash
   npm install
   ```

3. **Jalankan development server:**

   ```bash
   npm run dev
   ```

4. **Build untuk production:**

   ```bash
   npm run build
   ```

5. **Preview hasil build:**
   ```bash
   npm run preview
   ```

## 🔑 Demo Credentials

```
Email    : john@mail.com
Password : changeme
```

## Fitur UI/UX (Neobrutalism & Dark Mode)

Aplikasi ini telah diperbarui dengan sentuhan antarmuka yang sangat ekspresif:

1. **Desain Neobrutalism:**
   Antarmuka dibangun dengan pendekatan _Neobrutalism_ yang mencolok. Ciri khasnya meliputi palet warna-warni yang ngejreng, garis batas (border) hitam tebal, sudut-sudut yang tajam (tanpa rounded yang berlebihan), font yang tebal (_black font-weight_), serta bentuk bayangan yang solid tanpa blur (hard shadows).
2. **Dark / Light Mode Responsif:**
   Disediakan tombol pengalih (_toggle switch_) berupa ikon Matahari dan Bulan di _header_ halaman utama. Saat masuk ke _Dark Mode_, _background_ latar membaur jadi gelap (`zinc-900`) dan stiker/ornamen di belakang layar memancarkan opacity penuh menjadi cerah. Fitur ini menggunakan konfigurasi _custom variant_ di Tailwind v4 dengan _state_ disimpan memakai Zustand persist.
   _Catatan:_ Pada halaman Login, mode akan terkunci pada Light Mode secara otomatis untuk desain tata letak kolom yang optimal.
3. **Keterbacaan Optimal (Accessibility):**
   Kendati tema gelap dihidupkan, kartu tugas/ _Task Card_ diatur agar tetap kokoh dengan latar belakang putih dan teks hitam. Hal ini mencegah tulisan tertelan latar gelap dan mempertahankan prinsip kontras tinggi dari neobrutalism.

## Struktur Folder

```text
src/
├── api/                  # Konfigurasi Axios, Mock API, dan hooks React Query
│   ├── axiosInstance.ts
│   ├── mockApi.ts
│   └── taskQueries.ts
├── components/           # Komponen UI React
│   ├── BulkActionBar.tsx # Aksi massal (hapus/selesai)
│   ├── LoginForm.tsx     # Form login
│   ├── PrivateRoute.tsx  # HOC untuk proteksi rute
│   ├── SearchFilterBar.tsx# Filter pencarian dan status
│   ├── TaskForm.tsx      # Form pembuatan tugas
│   ├── TaskItem.tsx      # Komponen item list tugas
│   └── TaskList.tsx      # Daftar tugas
├── store/                # Zustand stores
│   ├── authStore.ts      # Store autentikasi (menyimpan sesi)
│   └── filterStore.ts    # Store untuk state filter/pencarian
├── types/                # Definisi TypeScript
│   └── index.ts          # Tipe Task dan User
├── utils/                # Fungsi utilitas
│   └── localStorageHelpers.ts # Helper read/write LocalStorage
├── App.tsx               # Halaman Dashboard Utama
├── index.css             # Konfigurasi Tailwind CSS
└── main.tsx              # Entry point aplikasi (Router & Provider setup)
```

## Asumsi yang Diambil

1. **Mock API dengan LocalStorage:** Karena backend tidak disediakan, simulasi operasi CRUD API menggunakan LocalStorage untuk mempertahankan state persisten. Kami mensimulasikan latensi jaringan selama 800 - 1000ms. Terdapat pula kemungkinan (probabilitas 5%) terjadinya _network error_ fiktif pada permintaan API yang akan di-_catch_ dan diinformasikan melalui _toast_.
2. **Optimistic Updates:** Saat melakukan pembuatan (create), perubahan (update), maupun penghapusan (delete) data, antarmuka berubah secara instan (_optimistic_). Apabila terjadi error simulasi (5% probabilitas), perubahan pada UI tersebut otomatis di-_rollback_ dan memberikan pemberitahuan gagal.
3. **Penyimpanan Token:** Setelah "login" berhasil menggunakan kredensial dummy (`user@example.com` / `password123`), dummy token di-_generate_ dan disimpan dalam state _authStore_ yang persisten terhadap LocalStorage. Interceptor Axios mengambil token ini untuk dilampirkan ke header setiap pengiriman request.
4. **Data Seed:** State awal `tasks` diinisialisasi sebagai array kosong, yang dikelola dan diperbarui sejalan dengan penambahan tugas oleh user.

## Tantangan dan Solusi

- **Tantangan:** Menerapkan _Optimistic Updates_ bersamaan dengan manajemen simulasi error acak yang terkontrol dapat menimbulkan inkonsistensi data jika gagal ditangani.
  **Solusi:** React Query `onMutate` dimanfaatkan secara presisi. State data terbaru disimpan sesaat sebelum mutasi disimulasikan. Apabila simulasi memicu respons error di blok `onError`, state query React Query di- _rollback_ ke salinan backup dari `context.previousTasks`. Semua perubahan disinkronkan (_invalidate_) saat promise _settled_ sebagai tambahan langkah pengamanan.
- **Tantangan:** Mengelola performa filter saat data membesar secara offline, sekaligus mendukung pencarian dan multi-kriteria tanpa re-render berlebihan.
  **Solusi:** Memisahkan filter state pada Zustand (`filterStore.ts`) terlepas dari komponen React dan mengimplementasi `useMemo` di dalam `TaskList.tsx`. Operasi filter yang cukup berat (jika dataset mencapai skala ribuan baris) akan di-cache secara memori.
