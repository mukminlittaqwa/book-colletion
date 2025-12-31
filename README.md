# Book Collection App

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)  
![Nuxt](https://img.shields.io/badge/Nuxt%203%2B-00C58E?logo=nuxt.js&logoColor=white)  
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

Aplikasi **fullstack** untuk mengelola koleksi buku pribadi. Dibuat dengan **Nuxt 3**, **Nuxt UI**, dan **MongoDB**.

### Fitur Utama

- Tambah, edit, dan hapus buku di koleksi pribadi
- Upload cover buku menggunakan Cloudinary
- Bookmark buku favorit
- Halaman khusus **"Bookmark Saya"** untuk melihat semua buku yang disimpan
- Pencarian dan pagination di semua daftar buku
- Autentikasi user (wajib login untuk mengelola koleksi & bookmark)
- Responsif dan mendukung dark mode

### Live Demo

_(Ganti dengan link Vercel kamu setelah deploy)_  
🔗 https://your-book-collection.vercel.app

## Tech Stack

- **Frontend & Backend**: Nuxt 3 (fullstack dengan Nitro server)
- **UI**: Nuxt UI (Tailwind CSS + Headless UI)
- **Database**: MongoDB (via Mongoose)
- **Upload Gambar**: Cloudinary
- **Auth**: Session-based authentication (H3 + MongoDB)
- **Deployment**: Vercel (recommended)

## Quick Start

```bash
# Clone repository
git clone https://github.com/username/book-collection-app.git
cd book-collection-app

# Install dependencies
pnpm install
# atau gunakan pnpm / yarn
# pnpm install
# yarn install
```

## .Env

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bookcollection?retryWrites=true&w=majority
SESSION_SECRET=ganti sendiri
CLOUDINARY_CLOUD_NAME=xxxxxxx
```
