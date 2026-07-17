# Catatan Proyek & Pengguna

File ini dibaca otomatis oleh Claude di setiap sesi baru. Berisi konteks proyek,
keputusan penting, pekerjaan yang belum selesai, dan cara berkomunikasi dengan pemilik repo.

## Tentang pengguna

- **Nama bisnis**: CV. Toto Aluminium Manufacture (fabrikasi aluminium bending, Indonesia).
- **Bahasa**: Selalu balas dalam **Bahasa Indonesia**. Pengguna berbahasa Indonesia santai/akrab
  (mis. "okee", "mantap", "claude, tolong…", "ya", "sesi ini dicukupkan").
- **Gaya bicara**: langsung, ringkas, sering menggabungkan beberapa permintaan dalam satu pesan,
  selalu sopan ("tolong"). Memberi umpan balik lewat screenshot dan menyempurnakan desain
  secara bertahap.
- **Yang dia hargai**: langsung dieksekusi lalu **push & merge ke git** tanpa banyak bertanya;
  kejujuran soal keterbatasan (mis. situs referensi/APK tak bisa diakses dari lingkungan ini);
  verifikasi visual (screenshot) sebelum menyatakan selesai.
- **Konteks kerja**: quotation dikirim **manual ke klien** lewat WhatsApp; nomor WA sengaja
  tidak ditaruh di app.

## Preferensi kerja untuk Claude

1. Balas dalam Bahasa Indonesia, ringkas, dan langsung bertindak.
2. Kerjakan perubahan → `npm run build` untuk verifikasi → biasanya diminta **push & merge PR**.
   Pakai squash merge. Selalu verifikasi tampilan dengan screenshot (Playwright + Chromium di
   `/opt/pw-browsers`) untuk perubahan visual.
3. Branch pengembangan: `claude/kalkulator-redesign-mobile-49q1qm`. Jika PR-nya sudah merged,
   restart branch dari `origin/main` lalu taruh perubahan baru di atasnya (force-with-lease OK).

## Tentang aplikasi

Kalkulator harga **aluminium bending** — web app PWA (React + Vite + Tailwind) + proyek
**Capacitor Android** untuk build APK. Tampilan meniru website
`totoaluminiummanufacture.com/kalkulator` (tema **coklat/krem**, `brand.*` di Tailwind).

### Fitur & keputusan penting
- **3 metode bending** (lihat `src/lib/formulas.js`):
  1. Kurang dari ½ lingkaran: `Lebar + Tinggi + 30`
  2. Setengah lingkaran pas: `(Lebar÷2) × 3,14 + 30`
  3. Lebih dari ½ lingkaran: `(Lebar÷2) × 3,14 + 2×(T − L÷2) + 30` (+30 lagi jika > 6 m)
- **Aturan khusus Metode 2**: lebar **60–75 cm → material minimum 1,5 m (150 cm)**.
  Konstanta: `STANDAR_LEBAR_MIN/MAX`, `STANDAR_MATERIAL_CM` di `formulas.js`.
- **Tanpa fitur/daftar produk** (dihapus atas permintaan). Input pakai **Nama item + Harga per
  meter manual**; nilai terakhir diingat via localStorage.
- **Tanpa tombol kontak WhatsApp** (header/floating/CTA dihapus). Tapi tombol **"Kirim via WA"**
  di tab Quotation **tetap ada** — itu cara kirim quotation ke klien.
- **Logo**: logo asli di `public/logo.png` (dipakai header + ikon PWA). Komponen `Shapes.jsx`
  berisi `Logo` (img) dan `ArchIcon` (diagram bentuk tiap metode).
- Tab: **Hitung** (kalkulator + bagian "Cara Kerja Perhitungannya"/`Guide.jsx`), **Quotation**,
  **History**. Semua data di localStorage, tanpa backend.

### Struktur singkat
- `src/App.jsx` — layout, header, bottom nav, tab.
- `src/components/` — `Calculator.jsx`, `Quotation.jsx`, `History.jsx`, `Guide.jsx`, `Shapes.jsx`.
- `src/lib/` — `formulas.js` (perhitungan), `format.js` (Rupiah & teks gaya WA), `useLocalStorage.js`.
- `android/` — proyek Capacitor (appId `com.totoaluminium.kalkulator`, nama "Toto Kalkulator").

## Pekerjaan yang belum selesai / lanjutan

- **Build APK Android** — ditunda sampai komputer pengguna menyala. Lingkungan sesi ini
  memblokir host Google (`dl.google.com`), jadi Android SDK & Google Maven tak bisa diunduh →
  APK tak bisa di-build dari sini. Di komputer pengguna: `npm install` lalu `npm run android:open`
  (butuh Android Studio), Build → Build APK(s). Atau `npm run android:apk` bila Android SDK
  sudah terpasang.
- **Ikon launcher Android** masih default Capacitor. Saat build APK, ganti pakai
  `@capacitor/assets` dengan sumber `public/logo.png`.
- **Nomor WhatsApp** sengaja dikosongkan (pengguna kirim manual).
