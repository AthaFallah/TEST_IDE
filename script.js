// ===== Data siswa (ubah sesuai kebutuhan) =====
const students = [
  { name: "Aulia Rahma",   category: "Seni & Desain", desc: "Ilustrator digital dan pelukis cat air. Suka membuat poster dan logo untuk acara sekolah.", color: "#6366f1" },
  { name: "Bima Pratama",  category: "Musik",         desc: "Gitaris akustik dan vokalis band sekolah. Bisa mengiringi acara atau latihan bersama.", color: "#8b5cf6" },
  { name: "Citra Dewi",    category: "Pemrograman",   desc: "Membuat website dan bot dengan JavaScript & Python. Siap membantu tugas coding.", color: "#4f46e5" },
  { name: "Dimas Saputra", category: "Olahraga",      desc: "Pemain basket tingkat provinsi. Bersedia berbagi tips latihan dan strategi bermain.", color: "#7c3aed" },
  { name: "Eka Lestari",   category: "Menulis",       desc: "Penulis cerpen dan puisi, juara lomba menulis tingkat kota. Bisa membantu penyuntingan.", color: "#a855f7" },
  { name: "Fajar Nugroho", category: "Seni & Desain", desc: "Desainer grafis dan fotografer. Berpengalaman membuat desain mading dan dokumentasi.", color: "#5b5bd6" },
  { name: "Gita Maharani", category: "Musik",         desc: "Pianis klasik dan penyanyi paduan suara. Suka mengaransemen lagu sederhana.", color: "#9061f9" },
  { name: "Hadi Kurniawan",category: "Pemrograman",   desc: "Pengembang game 2D dan penggemar robotika Arduino. Terbuka untuk proyek kolaborasi.", color: "#6d5df0" },
];

// ===== Elemen =====
const $ = (s) => document.querySelector(s);
const grid = $("#grid"), modal = $("#modal"), form = $("#msgForm"), toast = $("#toast");
let activeStudent = null;

// ===== Dark Mode =====
const root = document.documentElement;
function setTheme(t) { root.setAttribute("data-theme", t); try { localStorage.setItem("theme", t); } catch (e) {} }
(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
})();
$("#themeToggle").addEventListener("click", () =>
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

// ===== Render kartu =====
function render(filter = "Semua") {
  const list = filter === "Semua" ? students : students.filter(s => s.category === filter);
  grid.innerHTML = list.length ? list.map((s, i) => `
    <article class="card" style="animation-delay:${i * 60}ms">
      <div class="avatar" style="background:linear-gradient(135deg, ${s.color}, #c4b5fd)" aria-hidden="true">${s.name.charAt(0)}</div>
      <h3>${s.name}</h3>
      <span class="tag">${s.category}</span>
      <p>${s.desc}</p>
      <button class="btn btn-primary" data-name="${s.name}">Kirim Pesan / Minta Tolong</button>
    </article>`).join("") : `<p class="empty">Belum ada siswa di kategori ini.</p>`;
}
render();

// ===== Filter =====
$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  render(btn.dataset.filter);
});

// ===== Modal =====
function openModal(name) {
  activeStudent = name;
  $("#modalTitle").textContent = "Kirim Pesan ke " + name;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  setTimeout(() => $("#sender").focus(), 100);
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-name]");
  if (btn) openModal(btn.dataset.name);
});
$("#modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// ===== Simulasi kirim pesan =====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true; btn.textContent = "Mengirim…";
  setTimeout(() => {
    closeModal();
    form.reset();
    btn.disabled = false; btn.textContent = "Kirim Pesan";
    showToast(`✅ Pesan untuk ${activeStudent} berhasil dikirim!`);
  }, 900);
});

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ===== Tahun footer =====
$("#year").textContent = new Date().getFullYear();
