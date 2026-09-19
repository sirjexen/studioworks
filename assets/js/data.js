"use strict";

/*
 * =====================================================================
 *  PENGATURAN SITUS  —  edit bagian ini saja, tidak perlu ubah HTML
 * =====================================================================
 *
 *  email        : alamat email Anda. Jika diisi (dan formEndpoint kosong),
 *                 tombol "Kirim pesan" membuka aplikasi email pengunjung.
 *  formEndpoint : (opsional) URL form dari Formspree, contoh:
 *                 "https://formspree.io/f/abcdwxyz"
 *                 Jika diisi, pesan dikirim langsung ke email Anda
 *                 tanpa membuka aplikasi email pengunjung.
 *  social       : isi link lengkap (https://...). Yang kosong tidak ditampilkan.
 *
 *  Jika email dan formEndpoint sama-sama kosong, bagian kontak
 *  menampilkan "Kontak akan segera tersedia."
 */
window.SITE_CONFIG = {
  email: "rexha4u@gmail.com",
  formEndpoint: "",
  social: {
    github: "",
    linkedin: "",
    instagram: ""
  }
};

/*
 * =====================================================================
 *  DAFTAR PROJECT
 * =====================================================================
 *
 *  Tiga project di bawah ini adalah CONTOH. Ganti dengan project asli Anda.
 *
 *  - category     : harus "web", "uiux", atau "tools"
 *  - image        : path gambar, misalnya "assets/images/nama-project.webp"
 *                   (rasio 16:9, contoh 1200x675)
 *  - demoUrl      : link demo (https://...). Kosongkan jika belum ada.
 *  - repositoryUrl: link repository GitHub. Kosongkan jika belum ada.
 *  - featured     : true = kartu tampil lebar (cukup satu project)
 *  - status       : teks bebas, misalnya "Selesai" atau "Dalam pengembangan"
 *
 *  Menambah project = menyalin satu blok { ... }, lalu beri koma di antaranya.
 */
window.PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: "Nexa Product Catalog",
    category: "web",
    description: "Katalog produk responsif dengan pencarian, filter kategori, dan tampilan detail yang berfokus pada kemudahan eksplorasi.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "assets/images/project-placeholder.svg",
    demoUrl: "",
    repositoryUrl: "",
    featured: true,
    status: "Contoh"
  },
  {
    id: 2,
    title: "Learnspace Redesign",
    category: "uiux",
    description: "Eksplorasi ulang pengalaman aplikasi pembelajaran untuk menyederhanakan navigasi dan meningkatkan fokus pengguna.",
    technologies: ["UI Design", "UX Research", "Prototype"],
    image: "assets/images/project-placeholder.svg",
    demoUrl: "",
    repositoryUrl: "",
    featured: false,
    status: "Contoh"
  },
  {
    id: 3,
    title: "JSON Clarity",
    category: "tools",
    description: "Utility ringan untuk memvalidasi, merapikan, dan membaca struktur data JSON langsung dari browser.",
    technologies: ["JavaScript", "JSON", "Web Utility"],
    image: "assets/images/project-placeholder.svg",
    demoUrl: "",
    repositoryUrl: "",
    featured: false,
    status: "Contoh"
  }
];
