# Studioworks

Portofolio statis (HTML, CSS, JavaScript murni) untuk GitHub Pages.
Tanpa framework, tanpa build, tanpa dependency.

## Isi folder

```text
studioworks/
├── index.html            halaman utama
├── 404.html              halaman "tidak ditemukan" (dipakai otomatis oleh GitHub Pages)
├── .nojekyll             menonaktifkan Jekyll, biarkan saja
├── README.md             panduan ini
└── assets/
    ├── css/style.css     seluruh tampilan
    ├── js/data.js        <-- FILE YANG PALING SERING ANDA EDIT (project, email, sosmed)
    ├── js/main.js        logika situs
    ├── images/           gambar project dan social preview
    └── icons/favicon.svg
```

---

## Bagian 1: Upload ke GitHub

### Cara A: lewat browser (paling mudah, tanpa install apa pun)

1. Login ke [github.com](https://github.com), klik **+** di kanan atas, lalu **New repository**.
2. Isi **Repository name**, misalnya `studioworks`.
3. Pilih **Public**. GitHub Pages gratis hanya untuk repository public.
4. Klik **Create repository**.
5. Di halaman repository yang kosong, klik **uploading an existing file**.
6. Ekstrak file zip Studioworks di komputer Anda. **GitHub tidak menerima file .zip**, jadi yang di-upload harus isinya.
7. Buka folder hasil ekstrak, pilih **semua isinya** (`index.html`, `404.html`, `assets`, dan seterusnya), lalu drag ke halaman GitHub.
   Pastikan folder `assets` ikut terunggah beserta subfolder-nya.
8. Tunggu upload selesai, isi pesan commit (misalnya `Initial commit`), lalu klik **Commit changes**.

> File `.nojekyll` berawalan titik sehingga tersembunyi di beberapa sistem. Kalau tidak ikut terunggah, tidak masalah:
> situs tetap jalan. Anda bisa menambahkannya lewat **Add file, Create new file**, beri nama `.nojekyll`, lalu commit.

### Cara B: lewat Git (kalau sudah terbiasa terminal)

```bash
cd studioworks
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/studioworks.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub Anda. Update berikutnya cukup:

```bash
git add .
git commit -m "Update konten"
git push
```

---

## Bagian 2: Aktifkan GitHub Pages

1. Di repository, buka **Settings**, lalu **Pages** (menu sebelah kiri).
2. Pada **Build and deployment**, **Source**: pilih **Deploy from a branch**.
3. **Branch**: pilih `main`, folder `/ (root)`, lalu klik **Save**.
4. Tunggu 1 sampai 3 menit. Refresh halaman Pages sampai muncul tulisan
   **Your site is live at ...**.
5. Buka alamat sementara `https://USERNAME.github.io/studioworks/` untuk mengecek.

> Di alamat sementara ini, halaman 404 dan gambar `og:image` belum tampil sempurna karena situs berada di subfolder.
> Itu normal dan akan beres setelah custom domain aktif (Bagian 3).

---

## Bagian 3: Pasang domain .my.id

Contoh di bawah memakai `studioworks.my.id`. Ganti dengan domain Anda kalau berbeda.

### 3.1 Isi custom domain di GitHub

1. **Settings, Pages, Custom domain**: ketik `studioworks.my.id`, lalu **Save**.
2. GitHub akan menampilkan pesan "DNS check in progress" atau "DNS check unsuccessful".
   Itu wajar karena DNS belum diatur. Lanjut ke 3.2.
3. GitHub otomatis menambahkan file `CNAME` ke repository Anda. Jangan dihapus.

### 3.2 Atur DNS di tempat Anda membeli domain

Login ke panel registrar (misalnya Niagahoster, Rumahweb, Domainesia, IDwebhost, dan sejenisnya).
Cari menu **DNS Management**, **Kelola DNS**, atau **DNS Zone**.

**Hapus dulu** record A, AAAA, atau CNAME lama untuk `@` (domain utama) dan `www` yang menunjuk ke
parkir domain atau hosting lain. Record yang bentrok bisa membuat verifikasi gagal.

Tambahkan record berikut:

| Type  | Name / Host | Value / Points to        |
|-------|-------------|--------------------------|
| A     | `@`         | `185.199.108.153`        |
| A     | `@`         | `185.199.109.153`        |
| A     | `@`         | `185.199.110.153`        |
| A     | `@`         | `185.199.111.153`        |
| CNAME | `www`       | `USERNAME.github.io`     |

Opsional untuk IPv6 (empat record **AAAA** pada `@`):

```text
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

Catatan penting:

- Isi `USERNAME.github.io` **tanpa** nama repository dan tanpa `https://`.
- Beberapa panel meminta Name diisi `@`, sebagian lagi minta dikosongkan atau diisi nama domain penuh. Ikuti petunjuk panel Anda.
- Alamat IP di atas adalah yang dipublikasikan GitHub saat panduan ini dibuat. Sebelum memasukkannya, cocokkan dengan
  dokumentasi resmi: cari **"Managing a custom domain for your GitHub Pages site"** di docs.github.com.
- Jika nameserver domain Anda sudah diarahkan ke **Cloudflare**, tambahkan record di Cloudflare dan set proxy ke
  **DNS only** (awan abu-abu), bukan proxied (awan oranye).
- Dengan dua pengaturan di atas, `www.studioworks.my.id` otomatis diarahkan ke `studioworks.my.id`.

### 3.3 Tunggu DNS, lalu aktifkan HTTPS

1. Propagasi DNS biasanya 5 menit sampai beberapa jam, kadang sampai 24 jam.
   Anda bisa memantau di [dnschecker.org](https://dnschecker.org) (pilih tipe A).
2. Kembali ke **Settings, Pages**. Jika DNS sudah benar, muncul tanda centang hijau "DNS check successful".
3. Centang **Enforce HTTPS**. Kalau kotaknya masih abu-abu, tunggu sertifikat selesai diterbitkan (bisa sampai 24 jam),
   lalu refresh dan coba lagi.
4. Buka `https://studioworks.my.id`. Selesai.

### 3.4 (Sangat disarankan) Verifikasi domain

Ini mencegah orang lain "mengambil alih" domain Anda lewat GitHub Pages.

1. Klik foto profil GitHub, lalu **Settings**, lalu **Pages** (di menu sebelah kiri, bagian Code, planning, and automation).
2. Klik **Add a domain**, masukkan domain Anda, lalu ikuti petunjuk untuk menambah **record TXT** di DNS.
3. Setelah TXT terpasang, klik **Verify**.

---

## Bagian 4: Mengisi konten Anda

Semua konten yang sering berubah ada di **`assets/js/data.js`**. Anda bisa mengeditnya langsung di GitHub:
buka file, klik ikon pensil, edit, lalu **Commit changes**. Situs terbarui otomatis dalam 1 sampai 2 menit.

### Mengganti project

Tiga project bawaan berstatus **"Contoh"**. Ganti dengan project asli:

```javascript
{
  id: 1,
  title: "Nama Project Anda",
  category: "web",               // "web", "uiux", atau "tools"
  description: "Satu sampai dua kalimat tentang project ini.",
  technologies: ["HTML", "CSS", "JavaScript"],
  image: "assets/images/nama-project.webp",   // 1200x675, upload ke folder assets/images
  demoUrl: "https://...",        // kosongkan "" jika belum ada
  repositoryUrl: "https://github.com/USERNAME/repo",
  featured: true,                // true = kartu lebar (cukup satu)
  status: "Selesai"
}
```

Menambah project: salin satu blok `{ ... }`, tambahkan koma di antara blok, lalu ubah isinya.
Jumlah project dan kategori di hero dihitung otomatis.

### Mengaktifkan bagian kontak

Selama `email` dan `formEndpoint` kosong, bagian kontak hanya menampilkan "Kontak akan segera tersedia."
Isi di bagian `SITE_CONFIG`:

```javascript
window.SITE_CONFIG = {
  email: "emailanda@gmail.com",
  formEndpoint: "",
  social: {
    github: "https://github.com/USERNAME",
    linkedin: "https://www.linkedin.com/in/username",
    instagram: "https://www.instagram.com/username"
  }
};
```

Ada dua mode form:

- **Hanya `email` diisi**: tombol "Kirim pesan" membuka aplikasi email pengunjung dengan pesan yang sudah terisi.
  Paling sederhana, tapi bergantung pada pengaturan email di perangkat pengunjung.
- **`formEndpoint` diisi**: pesan dikirim langsung ke email Anda. Cara mengisinya:
  1. Daftar di [formspree.io](https://formspree.io) dan buat form baru.
  2. Salin URL form (bentuknya `https://formspree.io/f/xxxxxxxx`).
  3. Tempel ke `formEndpoint`, lalu commit.
  4. Kirim satu pesan uji coba dan cek inbox Anda. Batas pesan per bulan mengikuti paket gratis Formspree.

Link sosial yang dikosongkan tidak akan ditampilkan.

### Mengubah teks lain

- Nama, hero, tentang, dan keahlian: edit langsung di `index.html`.
- Daftar keahlian ada di section `#keahlian`, berupa `<li>` sederhana. Ubah sesuai kemampuan Anda yang sebenarnya.

### Kalau domain Anda bukan `studioworks.my.id`

Cari dan ganti semua `studioworks.my.id` di `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, dan JSON-LD).
Di VS Code: **Ctrl+Shift+H**, isi kolom cari dengan `studioworks.my.id`, lalu ganti dengan domain Anda.
Gambar `assets/images/social-preview.png` juga memuat tulisan domain, jadi buat ulang kalau domain berbeda.

### Social preview

`assets/images/social-preview.png` (1200 x 630) adalah gambar yang muncul saat link Anda dibagikan di WhatsApp,
LinkedIn, dan sejenisnya. Beberapa platform menyimpan cache lama, jadi pratinjau baru mungkin butuh waktu untuk muncul.

---

## Bagian 5: Masalah umum

| Gejala | Kemungkinan penyebab dan solusi |
|---|---|
| Halaman GitHub 404 di alamat `github.io` | Pages belum aktif atau baru saja diaktifkan. Tunggu beberapa menit. Pastikan `index.html` ada di **root** repository, bukan di dalam folder lain. |
| Tampilan tanpa gaya (CSS tidak terbaca) | Folder `assets` tidak ikut terunggah atau strukturnya berubah. Cek isi repository. |
| "DNS check unsuccessful" | Record belum benar atau belum propagasi. Cek ulang tabel DNS, hapus record lama yang bentrok, tunggu, lalu klik **Check again**. |
| Kotak "Enforce HTTPS" abu-abu | Sertifikat belum selesai. Tunggu (maks. 24 jam). Bisa dicoba hapus lalu isi ulang custom domain untuk memicu ulang. |
| Domain hilang setelah deploy ulang | File `CNAME` terhapus. Buat file `CNAME` di root repository yang isinya hanya `studioworks.my.id`. |
| Perubahan tidak muncul | Cache browser. Coba **Ctrl+F5** atau buka tab incognito. Cek juga tab **Actions** untuk melihat deploy sudah selesai. |
| Filter atau daftar project kosong | Ada tanda koma atau kurung yang salah di `data.js`. Buka Console browser (F12) untuk melihat pesan errornya. |

---

## Daftar cek sebelum dibagikan

- [ ] Project contoh sudah diganti project asli (dengan screenshot)
- [ ] Nama, deskripsi, dan daftar keahlian sesuai kenyataan
- [ ] Email atau form kontak sudah diisi dan dites
- [ ] Link GitHub, LinkedIn, atau Instagram sudah diisi
- [ ] Domain aktif dan **Enforce HTTPS** tercentang
- [ ] Dicek di HP dan desktop
- [ ] Tidak ada error di Console (F12)

## Menjalankan di komputer sendiri (opsional)

Klik dua kali `index.html`, atau jalankan server lokal:

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000`.
