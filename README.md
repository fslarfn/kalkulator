# Toto Bending Calculator

Web app PWA untuk menghitung harga aluminium bending dengan 3 metode perhitungan, manajemen produk, dan pembuatan quotation siap kirim ke WhatsApp.

## Fitur

- **3 Metode Perhitungan**
  1. Kurang dari setengah lingkaran: `L + T + 30 cm`
  2. Setengah lingkaran pas: `(L÷2) × 3,14 + 30 cm`
  3. Lebih dari setengah lingkaran: `(L÷2) × 3,14 + 2×(T − L÷2) + 30 cm` (auto +30cm jika > 6m)
- **Manajemen produk** — tambah/edit/hapus, harga per meter
- **Quotation multi-item** dengan format output gaya WhatsApp Anda
- **Tombol "Kirim via WA"** — langsung buka WhatsApp dengan teks ter-format
- **History quotation** — tersimpan permanen di device
- **PWA penuh** — install ke home screen, jalan offline
- **localStorage** — semua data tersimpan lokal di browser, tidak ada server

## Format Output WhatsApp

```
Danang w
4" hitam ad L.130 T.50 : 2,1 x 2pcs x 230.000 = 966.000
4" hitam ad L.100 T.50 : 1,9 x 2pcs x 230.000 = 874.000
Ornamen L.65 T.25 : 1,5 x 2pcs x 60.000 = 180.000
Ornamen D.50 : 1,3 x 2pcs x 60.000 = 156.000
Total keseluruhan : 2.176.000
```

Notasi `D.xx` otomatis dipakai jika Lebar = Tinggi.

## Setup Lokal

Butuh **Node.js 18+**.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build

```bash
npm run build
```

Output di folder `dist/`.

## Deploy ke Vercel

### Opsi 1: Via GitHub (recommended)

1. Push project ini ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "init"
   git remote add origin <URL_REPO_GITHUB>
   git push -u origin main
   ```
2. Buka [vercel.com/new](https://vercel.com/new), import repo
3. Vercel akan auto-detect Vite — klik **Deploy**
4. Selesai! URL akan diberikan otomatis

### Opsi 2: Via Vercel CLI

```bash
npm i -g vercel
vercel
```

Ikuti prompt-nya. Untuk production deploy:
```bash
vercel --prod
```

## Deploy ke Netlify

1. Push ke GitHub
2. Buka [app.netlify.com](https://app.netlify.com), klik **Add new site → Import existing project**
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Klik **Deploy**

## Install sebagai PWA

Setelah deploy:

**Android (Chrome):**
- Buka URL → menu (⋮) → "Add to Home screen" / "Install app"

**iOS (Safari):**
- Buka URL → tombol Share → "Add to Home Screen"

**Desktop (Chrome/Edge):**
- Klik icon install di address bar (kanan)

App akan jalan offline penuh setelah pertama kali dibuka.

## Struktur Project

```
toto-bending/
├── public/                  # Static assets, icons PWA
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Calculator.jsx   # Tab kalkulator
│   │   ├── Products.jsx     # Tab manajemen produk
│   │   ├── Quotation.jsx    # Tab quotation
│   │   └── History.jsx      # Tab history
│   ├── lib/
│   │   ├── formulas.js      # 3 metode perhitungan
│   │   ├── format.js        # Format Rupiah & gaya WA
│   │   └── useLocalStorage.js
│   ├── styles/index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js           # Konfigurasi Vite + PWA plugin
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── package.json
```

## Catatan Teknis

- **Storage**: Semua data (produk, quotation aktif, history) disimpan di `localStorage`. Tidak ada backend, tidak ada cloud sync.
- **Offline**: Service Worker meng-cache semua asset. Setelah pertama kali load, app jalan tanpa koneksi.
- **Update**: Setiap deploy baru akan auto-update saat user membuka app dengan koneksi.

## Tips Penggunaan

1. **Set up produk dulu** — tab Produk → tambahkan semua jenis aluminium yang Anda jual lengkap dengan harga per meter
2. **Label kustom** — saat menghitung, ada field "Label kustom" untuk override nama produk per item (mis. dari "4 inch hitam" jadi `4" hitam ad`)
3. **Multi-item** — hitung satu per satu, klik "Tambahkan ke Quotation" → akan ke-pull semua di tab Quotation
4. **Kirim ke customer** — tab Quotation → tombol hijau "Kirim via WA" akan membuka WhatsApp dengan teks otomatis

## Lisensi

Untuk penggunaan internal Toto Aluminium.
