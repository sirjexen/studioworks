# Studioworks

Situs portofolio pribadi **Muhammad Rafly** — dibangun tangan dengan HTML, CSS, dan JavaScript murni, tanpa framework, tanpa proses build, tanpa dependensi runtime.

**Live:** https://studioworks.my.id

## Isi

| Halaman | Berkas | Keterangan |
| --- | --- | --- |
| Beranda | `index.html` | Profil, indeks kerja, metode, kontak |
| Lab | `lab/index.html` | Delapan perkakas kriptografi & konversi teks |
| 404 | `404.html` | Halaman galat khusus |

## Lab

Semua perhitungan berjalan di peramban pengunjung; tidak ada permintaan jaringan dan tidak ada data yang disimpan.

Caesar cipher (termasuk percobaan 25 kunci), ROT13, Base64 dengan dukungan UTF-8, URL encode/decode, hash SHA-1/256/384/512 lewat Web Crypto API, XOR cipher berbasis kunci dengan keluaran heksadesimal, konversi biner dan heksadesimal, serta pembangkit sandi acak memakai `crypto.getRandomValues()` lengkap dengan hitungan entropi.

Setiap perkakas bisa ditautkan langsung, misalnya `/lab/#pass` membuka pembangkit sandi.

## Teknis

CSS dan JavaScript ditulis inline di masing-masing halaman agar hanya ada satu permintaan HTTP per halaman. Tema terang/gelap mengikuti preferensi sistem dan tersimpan di `localStorage`. Animasi dimatikan otomatis bila pengguna mengaktifkan `prefers-reduced-motion`. Navigasi tab di Lab memakai pola ARIA tablist dan bisa dijalankan dengan tombol panah.

## Menjalankan secara lokal

Cukup buka `index.html` di peramban. Untuk menguji hash SHA, jalankan lewat server lokal karena Web Crypto memerlukan konteks aman:

