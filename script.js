// --- 1. Data Awal & Fungsi Mengambil dari LocalStorage ---
// Mengambil data tersimpan di localStorage, atau memakai data dummy default jika masih kosong
let dataBakat = JSON.parse(localStorage.getItem('data_bakat_siswa')) || [
    {
        id: 1,
        nama: "Rizky Pratama",
        kelas: "XI RPL 2",
        bakat: "Pemrograman Web & Python",
        deskripsi: "Saya bisa membantu membuatkan website sederhana untuk tugas sekolah atau project organisasi.",
        pin: "1234",
        pesan: [
            { pengirim: "Siti", isi: "Halo Rizky, bisakah bantu saya belajar dasar HTML?" }
        ]
    },
    {
        id: 2,
        nama: "Dewi Lestari",
        kelas: "XII MM 1",
        bakat: "Desain Ilustrasi & Logo",
        deskripsi: "Suka menggambar digital. Bisa bantu desain logo stiker, kelas, atau kaos acara.",
        pin: "1234",
        pesan: []
    }
];

// Fungsi untuk menyimpan data terbaru ke LocalStorage browser
function simpanKeLocalStorage() {
    localStorage.setItem('data_bakat_siswa', JSON.stringify(dataBakat));
}

// Variabel untuk menyimpan ID siswa yang dipilih untuk dikirimi pesan
let idSiswaTerpilih = null;

// --- 2. Mengambil Elemen HTML dari DOM ---
const halBeranda = document.getElementById('halaman-beranda');
const halTambah = document.getElementById('halaman-tambah');
const halLihat = document.getElementById('halaman-lihat');

const navHome = document.getElementById('nav-home');
const navTambah = document.getElementById('nav-tambah');
const navLihat = document.getElementById('nav-lihat');
const navLogo = document.getElementById('nav-logo');

const kartuKeTambah = document.getElementById('kartu-ke-tambah');
const kartuKeLihat = document.getElementById('kartu-ke-lihat');

const formBakat = document.getElementById('form-bakat');
const wadahDaftarBakat = document.getElementById('daftar-bakat');
const modalPesan = document.getElementById('modal-pesan');
const btnTutupModal = document.getElementById('btn-tutup-modal');
const formPesan = document.getElementById('form-pesan');
const modalDeskripsiTujuan = document.getElementById('modal-deskripsi-tujuan');

// --- 3. Fungsi Sistem Navigasi Pindah Halaman ---
function bukaHalaman(namaHalaman) {
    if (halBeranda) halBeranda.classList.add('hidden');
    if (halTambah) halTambah.classList.add('hidden');
    if (halLihat) halLihat.classList.add('hidden');

    if (navHome) navHome.classList.remove('active');
    if (navTambah) navTambah.classList.remove('active');
    if (navLihat) navLihat.classList.remove('active');

    if (namaHalaman === 'halaman-beranda') {
        if (halBeranda) halBeranda.classList.remove('hidden');
        if (navHome) navHome.classList.add('active');
    } else if (namaHalaman === 'halaman-tambah') {
        if (halTambah) halTambah.classList.remove('hidden');
        if (navTambah) navTambah.classList.add('active');
    } else if (namaHalaman === 'halaman-lihat') {
        if (halLihat) halLihat.classList.remove('hidden');
        if (navLihat) navLihat.classList.add('active');
        tampilkanDaftarBakat(); // Refresh isi daftar bakat
    }
}

// Menghubungkan Tombol Navigasi
if (navHome) navHome.addEventListener('click', () => bukaHalaman('halaman-beranda'));
if (navLogo) navLogo.addEventListener('click', () => bukaHalaman('halaman-beranda'));
if (navTambah) navTambah.addEventListener('click', () => bukaHalaman('halaman-tambah'));
if (navLihat) navLihat.addEventListener('click', () => bukaHalaman('halaman-lihat'));

if (kartuKeTambah) kartuKeTambah.addEventListener('click', () => bukaHalaman('halaman-tambah'));
if (kartuKeLihat) kartuKeLihat.addEventListener('click', () => bukaHalaman('halaman-lihat'));

// --- 4. Fungsi Menampilkan Daftar Bakat ---
function tampilkanDaftarBakat() {
    if (!wadahDaftarBakat) return;
    wadahDaftarBakat.innerHTML = '';

    if (dataBakat.length === 0) {
        wadahDaftarBakat.innerHTML = '<p>Belum ada siswa yang mempromosikan bakat.</p>';
        return;
    }

    dataBakat.forEach(item => {
        const kartu = document.createElement('div');
        kartu.className = 'item-bakat';

        let HTMLPesan = '';
        if (item.pesan && item.pesan.length > 0) {
            HTMLPesan = `<div class="daftar-pesan-masuk"><h4>📩 Pesan Masuk / Permintaan Bantuan:</h4>`;
            item.pesan.forEach(p => {
                HTMLPesan += `
                    <div class="pesan-box">
                        <strong>${p.pengirim}:</strong> "${p.isi}"
                    </div>
                `;
            });
            HTMLPesan += `</div>`;
        }

        kartu.innerHTML = `
            <div>
                <div class="header-kartu">
                    <span class="lencana-bakat">${item.bakat}</span>
                    <button class="btn-hapus-post" type="button" onclick="hapusPostingan(${item.id})">🗑️ Hapus</button>
                </div>
                <h3>${item.nama}</h3>
                <p class="sub-info">Kelas: ${item.kelas}</p>
                <p>${item.deskripsi}</p>
                ${HTMLPesan}
            </div>
            <button class="btn-pesan" type="button" onclick="bukaModalPesan(${item.id})">💬 Minta Bantuan / Kirim Pesan</button>
        `;

        wadahDaftarBakat.appendChild(kartu);
    });
}

// --- 5. Menangani Form Tambah Bakat Baru ---
if (formBakat) {
    formBakat.addEventListener('submit', function(e) {
        e.preventDefault();

        const nama = document.getElementById('nama').value;
        const kelas = document.getElementById('kelas').value;
        const bakat = document.getElementById('bakat').value;
        const deskripsi = document.getElementById('deskripsi').value;
        const pin = document.getElementById('pin').value;

        const bakatBaru = {
            id: Date.now(),
            nama: nama,
            kelas: kelas,
            bakat: bakat,
            deskripsi: deskripsi,
            pin: pin,
            pesan: []
        };

        // Simpan ke array
        dataBakat.unshift(bakatBaru);
        
        // Simpan ke LocalStorage agar tetap ada saat refresh
        simpanKeLocalStorage();

        formBakat.reset();

        alert('Bakatmu berhasil dipromosikan! Ingat PIN yang kamu masukkan untuk menghapus postingan ini nanti.');
        bukaHalaman('halaman-lihat');
    });
}

// --- 6. Fungsi Menghapus Postingan dengan Otorisasi PIN ---
window.hapusPostingan = function(id) {
    const siswa = dataBakat.find(s => s.id === id);

    if (!siswa) return;

    // Tampilkan pop-up input PIN
    const inputPin = prompt(`Masukkan PIN Rahasia 4-6 Digit untuk menghapus postingan milik "${siswa.nama}":`);

    if (inputPin === null) return; // Jika user menekan Cancel

    if (inputPin === siswa.pin) {
        // Hapus data dari array jika PIN cocok
        dataBakat = dataBakat.filter(s => s.id !== id);
        
        // Simpan perubahan ke LocalStorage
        simpanKeLocalStorage();
        
        tampilkanDaftarBakat();
        alert('Postingan berhasil dihapus!');
    } else {
        alert('❌ PIN Salah! Kamu tidak memiliki akses untuk menghapus postingan ini.');
    }
};

// --- 7. Fungsi Pop-up Pesan ---
window.bukaModalPesan = function(id) {
    idSiswaTerpilih = id;
    const siswa = dataBakat.find(s => s.id === id);
    
    if (siswa && modalDeskripsiTujuan && modalPesan) {
        modalDeskripsiTujuan.innerText = `Kirim pesan ke: ${siswa.nama} (${siswa.bakat})`;
        modalPesan.classList.remove('hidden');
    }
};

if (btnTutupModal && modalPesan) {
    btnTutupModal.addEventListener('click', function() {
        modalPesan.classList.add('hidden');
    });
}

// --- 8. Menangani Pengiriman Pesan ---
if (formPesan) {
    formPesan.addEventListener('submit', function(e) {
        e.preventDefault();

        const pengirim = document.getElementById('pengirim').value;
        const isiPesan = document.getElementById('isi-pesan').value;

        const siswa = dataBakat.find(s => s.id === idSiswaTerpilih);

        if (siswa) {
            siswa.pesan.push({
                pengirim: pengirim,
                isi: isiPesan
            });

            // Simpan perubahan pesan ke LocalStorage
            simpanKeLocalStorage();

            formPesan.reset();
            if (modalPesan) modalPesan.classList.add('hidden');

            tampilkanDaftarBakat();
            alert('Pesan berhasil terkirim!');
        }
    });
}

// --- 9. Inisialisasi Pertama Kali ---
bukaHalaman('halaman-beranda');
