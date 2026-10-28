// =====================================================
//  KONFIGURASI
// =====================================================
// Isi dengan URL Formspree agar setiap pendaftaran juga dikirim ke email pengelola.
// Contoh: "https://formspree.io/f/abcdwxyz". Biarkan "" jika tidak dipakai.
const SUBMIT_ENDPOINT = "";

const STORAGE_KEY = "bakatkita_siswa_baru";

// Data bawaan (ubah sesuai kebutuhan)
const baseStudents = [
  { name: "Aulia Rahma",   category: "Seni & Desain", desc: "Ilustrator digital dan pelukis cat air. Suka membuat poster dan logo untuk acara sekolah.", color: "#6366f1" },
  { name: "Bima Pratama",  category: "Musik",         desc: "Gitaris akustik dan vokalis band sekolah. Bisa mengiringi acara atau latihan bersama.", color: "#8b5cf6" },
  { name: "Citra Dewi",    category: "Pemrograman",   desc: "Membuat website dan bot dengan JavaScript & Python. Siap membantu tugas coding.", color: "#4f46e5" },
  { name: "Dimas Saputra", category: "Olahraga",      desc: "Pemain basket tingkat provinsi. Bersedia berbagi tips latihan dan strategi bermain.", color: "#7c3aed" },
  { name: "Eka Lestari",   category: "Menulis",       desc: "Penulis cerpen dan puisi, juara lomba menulis tingkat kota. Bisa membantu penyuntingan.", color: "#a855f7" },
  { name: "Fajar Nugroho", category: "Seni & Desain", desc: "Desainer grafis dan fotografer. Berpengalaman membuat desain mading dan dokumentasi.", color: "#5b5bd6" },
  { name: "Gita Maharani", category: "Musik",         desc: "Pianis klasik dan penyanyi paduan suara. Suka mengaransemen lagu sederhana.", color: "#9061f9" },
  { name: "Hadi Kurniawan",category: "Pemrograman",   desc: "Pengembang game 2D dan penggemar robotika Arduino. Terbuka untuk proyek kolaborasi.", color: "#6d5df0" },
];

// =====================================================
//  Helper
// =====================================================
const $ = (s) => document.querySelector(s);
const palette = ["#6366f1", "#8b5cf6", "#4f46e5", "#7c3aed", "#a855f7", "#5b5bd6", "#9061f9", "#6d5df0"];

// Cegah XSS: semua teks dari pengguna WAJIB di-escape sebelum masuk innerHTML
function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
// Hanya izinkan link http/https
function safeUrl(u) {
  try {
    const url = new URL(u);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch (e) { return ""; }
}
function colorFor(name) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return palette[h % palette.length];
}

// =====================================================
//  Penyimpanan data pendaftar (localStorage)
// =====================================================
function loadUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; }
}
function saveUsers() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(userStudents)); return true; } catch (e) { return false; }
}
let userStudents = loadUsers();
let activeFilter = "Semua";
let activeStudent = null;
let photoData = "";

// =====================================================
//  Dark Mode
// =====================================================
const root = document.documentElement;
function setTheme(t) {
  root.setAttribute("data-theme", t);
  try { localStorage.setItem("theme", t); } catch (e) {}
}
(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
})();
$("#themeToggle").addEventListener("click", () =>
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

// =====================================================
//  Render kartu
// =====================================================
function cardHTML(s, { preview = false, index = 0 } = {}) {
  const link = safeUrl(s.link);
  const avatar = s.photo
    ? `<img class="avatar" src="${esc(s.photo)}" alt="Foto ${esc(s.name)}">`
    : `<div class="avatar" style="background:linear-gradient(135deg, ${esc(s.color)}, #c4b5fd)" aria-hidden="true">${esc(s.name.charAt(0).toUpperCase())}</div>`;
  return `
    <article class="card" style="animation-delay:${index * 60}ms">
      ${s.mine && !preview ? `<span class="badge-mine">Profil kamu</span>` : ""}
      ${avatar}
      <h3>${esc(s.name)}</h3>
      ${s.kelas ? `<span class="meta">Kelas ${esc(s.kelas)}</span>` : ""}
      <span class="tag">${esc(s.category)}</span>
      <p>${esc(s.desc)}</p>
      <div class="card-actions">
        ${link ? `<a class="btn-link" href="${esc(link)}" target="_blank" rel="noopener noreferrer">Lihat Karya ↗</a>` : ""}
        ${preview ? "" : `<button class="btn btn-primary" data-name="${esc(s.name)}">Kirim Pesan / Minta Tolong</button>`}
        ${s.mine && !preview ? `<button class="btn-del" data-del="${esc(s.id)}">Hapus profil ini</button>` : ""}
      </div>
    </article>`;
}

function render() {
  const all = [...userStudents.map((s) => ({ ...s, mine: true })), ...baseStudents];
  const list = activeFilter === "Semua" ? all : all.filter((s) => s.category === activeFilter);
  $("#grid").innerHTML = list.length
    ? list.map((s, i) => cardHTML(s, { index: i })).join("")
    : `<p class="empty">Belum ada siswa di kategori ini. Jadilah yang pertama!</p>`;
}
render();

// Filter
$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  render();
});

// =====================================================
//  Modal (umum)
// =====================================================
function openModal(el) {
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
}
function closeModal(el) {
  el.classList.remove("open");
  el.setAttribute("aria-hidden", "true");
}
document.querySelectorAll(".modal").forEach((m) => {
  m.addEventListener("click", (e) => {
    if (e.target === m || e.target.closest("[data-close]")) closeModal(m);
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") document.querySelectorAll(".modal.open").forEach(closeModal);
});

// =====================================================
//  Modal pesan
// =====================================================
const msgModal = $("#msgModal"), msgForm = $("#msgForm");
$("#grid").addEventListener("click", (e) => {
  const del = e.target.closest("[data-del]");
  if (del) {
    if (confirm("Hapus profil ini dari showcase?")) {
      userStudents = userStudents.filter((s) => s.id !== del.dataset.del);
      saveUsers();
      render();
      showToast("🗑️ Profil dihapus.");
    }
    return;
  }
  const btn = e.target.closest("button[data-name]");
  if (btn) {
    activeStudent = btn.dataset.name;
    $("#msgTitle").textContent = "Kirim Pesan ke " + activeStudent;
    openModal(msgModal);
    setTimeout(() => $("#sender").focus(), 100);
  }
});

msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = msgForm.querySelector("button[type=submit]");
  btn.disabled = true; btn.textContent = "Mengirim…";
  setTimeout(() => {
    closeModal(msgModal);
    msgForm.reset();
    btn.disabled = false; btn.textContent = "Kirim Pesan";
    showToast(`✅ Pesan untuk ${activeStudent} berhasil dikirim!`);
  }, 900);
});

// =====================================================
//  Modal pendaftaran bakat
// =====================================================
const regModal = $("#registerModal"), regForm = $("#registerForm");
const f = {
  name: $("#rName"), kelas: $("#rClass"), category: $("#rCategory"),
  desc: $("#rDesc"), link: $("#rLink"), photo: $("#rPhoto"),
};

document.querySelectorAll(".js-open-register").forEach((b) =>
  b.addEventListener("click", () => { openModal(regModal); updatePreview(); setTimeout(() => f.name.focus(), 100); }));

function currentData() {
  return {
    name: f.name.value.trim() || "Nama Kamu",
    kelas: f.kelas.value.trim(),
    category: f.category.value || "Kategori Bakat",
    desc: f.desc.value.trim() || "Deskripsi kemampuanmu akan tampil di sini.",
    link: f.link.value.trim(),
    photo: photoData,
    color: colorFor(f.name.value.trim() || "Nama Kamu"),
  };
}
function updatePreview() {
  $("#preview").innerHTML = cardHTML(currentData(), { preview: true });
  $("#descCount").textContent = `${f.desc.value.length}/160`;
}
Object.values(f).forEach((el) => el.addEventListener("input", updatePreview));

// Baca foto, potong persegi, kecilkan ke 320px agar hemat penyimpanan
function resizeImage(file, size = 320) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("File harus berupa gambar."));
    if (file.size > 5 * 1024 * 1024) return reject(new Error("Ukuran foto maksimal 5 MB."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gambar tidak valid."));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        canvas.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

f.photo.addEventListener("change", async () => {
  const file = f.photo.files[0];
  $("#formError").textContent = "";
  photoData = "";
  if (file) {
    try { photoData = await resizeImage(file); }
    catch (err) { $("#formError").textContent = err.message; f.photo.value = ""; }
  }
  updatePreview();
});

regForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const err = $("#formError");
  err.textContent = "";

  const name = f.name.value.trim();
  const desc = f.desc.value.trim();
  const link = f.link.value.trim();

  if (name.length < 3) return (err.textContent = "Nama minimal 3 karakter.");
  if (!f.category.value) return (err.textContent = "Pilih kategori bakat.");
  if (desc.length < 10) return (err.textContent = "Deskripsi minimal 10 karakter.");
  if (link && !safeUrl(link)) return (err.textContent = "Link karya harus diawali http:// atau https://");

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name, kelas: f.kelas.value.trim(), category: f.category.value,
    desc, link, photo: photoData, color: colorFor(name),
  };

  const btn = $("#regSubmit");
  btn.disabled = true; btn.textContent = "Menyimpan…";

  userStudents.unshift(entry);
  if (!saveUsers()) {
    userStudents.shift();
    btn.disabled = false; btn.textContent = "Tampilkan Bakatku";
    return (err.textContent = "Penyimpanan penuh. Coba tanpa foto atau hapus profil lama.");
  }

  // Opsional: kirim salinan ke pengelola (tanpa foto agar ringan)
  let sent = false;
  if (SUBMIT_ENDPOINT) {
    try {
      const { photo, color, id, ...payload } = entry;
      const res = await fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      sent = res.ok;
    } catch (e2) { sent = false; }
  }

  regForm.reset();
  photoData = "";
  closeModal(regModal);
  activeFilter = "Semua";
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("active", b.dataset.filter === "Semua"));
  render();
  btn.disabled = false; btn.textContent = "Tampilkan Bakatku";
  $("#showcase").scrollIntoView({ behavior: "smooth" });
  showToast(SUBMIT_ENDPOINT && !sent
    ? "⚠️ Profil tersimpan, tetapi gagal dikirim ke pengelola."
    : "🎉 Bakatmu berhasil ditambahkan!");
});

// =====================================================
//  Toast & footer
// =====================================================
let toastTimer;
function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}
$("#year").textContent = new Date().getFullYear();
