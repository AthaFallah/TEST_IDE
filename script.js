// --- 1. Data Sampel Bakat Siswa (Dummy Data) ---
let dataBakat = [
    {
        id: 1,
        nama: "Rizky Pratama",
        kelas: "XI RPL 2",
        bakat: "Pemrograman Web & Python",
        deskripsi: "Saya bisa membantu membuatkan website sederhana untuk tugas sekolah atau project organisasi.",
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
        pesan: []
    }
];

// Variabel untuk menyimpan ID siswa yang dipilih untuk dikirimi pesan
let idSiswaTerpilih = null;

// --- 2. Mengambil Elemen HTML dari DOM ---
// Elemen Halaman
const halBeranda = document.getElementById('halaman-beranda');
const halTambah = document.getElementById('halaman-tambah');
const halLihat = document.getElementById('halaman-lihat');

// Elemen Navigasi
const navHome = document.getElementById('nav-home');
const navTambah = document.getElementById('nav-tambah');
const navLihat = document.getElementById('nav-lihat');
const navLogo = document.getElementById('nav-logo');

// Elemen Kartu Pilihan di Beranda
const kartuKeTambah = document.getElementById('kartu-ke-tambah');
const kartuKeLihat = document.getElementById('kartu-ke-lihat');

// Elemen Form & Modal
const formBakat = document.getElementById('form-bakat');
const wadahDaftarBakat = document.getElementById('daftar-bakat');
const modalPesan = document.getElementById('modal-pesan');
const btnTutupModal = document.getElementById('btn-tutup-modal');
const formPesan = document.getElementById('form-pesan');
const modalDeskripsiTujuan = document.getElementById('modal-deskripsi-tujuan');

// --- 3. Fungsi Sistem Navigasi Pindah Halaman ---
function bukaHalaman(namaHalaman) {
    // Sembunyikan semua halaman terlebih dahulu
    halBeranda.classList.add('hidden');
    halTambah.classList.add('hidden');
    halLihat.classList.add('hidden');

    // Hapus status 'active' dari semua tombol navigasi
    navHome.classList.remove('active');
    navTambah.classList.remove('active');
    navLihat.classList.remove('active');

    // Tampilkan halaman yang dipilih dan aktifkan tombol navigasinya
    if (namaHalaman === 'halaman-beranda') {
        halBeranda.classList.remove('hidden');
        navHome.classList.add('active');
    } else if (namaHalaman === 'halaman-tambah') {
        halTambah.classList.remove('hidden');
        navTambah.classList.add('active');
    } else if (namaHalaman === 'halaman-lihat') {
        halLihat.classList.remove('hidden');
        navLihat.classList.add('active');
        tampilkanDaftarBakat(); // Refresh isi daftar bakat saat halaman dibuka
    }
}

// Menghubungkan klik tombol navigasi dengan fungsi bukaHalaman
navHome.addEventListener('click', () => bukaHalaman('halaman-beranda'));
navLogo.addEventListener('click', () => bukaHalaman('halaman-beranda'));
navTambah.addEventListener('click', () => bukaHalaman('halaman-tambah'));
navLihat.addEventListener('click', () => bukaHalaman('halaman-lihat'));

// Menghubungkan klik kartu di Halaman Beranda
kartuKeTambah.addEventListener('click', () => bukaHalaman('halaman-tambah'));
kartuKeLihat.addEventListener('click', () => bukaHalaman('halaman-lihat'));

// --- 4. Fungsi Menampilkan Daftar Bakat di Halaman Penampil ---
function tampilkanDaftarBakat() {
    wadahDaftarBakat.innerHTML = ''; // Kosongkan wadah

    // Jika belum ada data bakat
    if (dataBakat.length === 0) {
        wadahDaftarBakat.innerHTML = '<p>Belum ada siswa yang mempromosikan bakat. Jadilah yang pertama!</p>';
        return;
    }

    // Tampilkan setiap bakat siswa ke dalam kartu
    dataBakat.forEach(item => {
        const kartu = document.createElement('div');
        kartu.className = 'item-bakat';

        // Format pesan yang pernah diterima
        let HTMLPesan = '';
        if (item.pesan.length > 0) {
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
                <span class="lencana-bakat">${item.bakat}</span>
                <h3>${item.nama}</h3>
                <p class="sub-info">Kelas: ${item.kelas}</p>
                <p>${item.deskripsi}</p>
                ${HTMLPesan}
            </div>
            <button class="btn-pesan" onclick="bukaModalPesan(${item.id})">💬 Minta Bantuan / Kirim Pesan</button>
        `;

        wadahDaftarBakat.appendChild(kartu);
    });
}

// --- 5. Menangani Form Promosikan Bakat Baru ---
formBakat.addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah reload halaman

    // Ambil data dari input form
    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;
    const bakat = document.getElementById('bakat').value;
    const deskripsi = document.getElementById('deskripsi').value;

    // Buat objek data bakat baru
    const bakatBaru = {
        id: Date.now(), // ID unik berdasarkan waktu
        nama: nama,
        kelas: kelas,
        bakat: bakat,
        deskripsi: deskripsi,
        pesan: []
    };

    // Tambahkan data ke urutan teratas
    dataBakat.unshift(bakatBaru);

    // Reset isi form
    formBakat.reset();

    // Notifikasi dan pindah ke Halaman Bakat secara otomatis
    alert('Bakatmu berhasil dipromosikan!');
    bukaHalaman('halaman-lihat');
});

// --- 6. Fungsi Membuka & Menutup Pop-up Kirim Pesan ---
function bukaModalPesan(id) {
    idSiswaTerpilih = id;
    const siswa = dataBakat.find(s => s.id === id);
    
    if (siswa) {
        modalDeskripsiTujuan.innerText = `Kirim pesan ke: ${siswa.nama} (${siswa.bakat})`;
        modalPesan.classList.remove('hidden');
    }
}

btnTutupModal.addEventListener('click', function() {
    modalPesan.classList.add('hidden');
});

// --- 7. Menangani Pengiriman Pesan ---
formPesan.addEventListener('submit', function(e) {
    e.preventDefault();

    const pengirim = document.getElementById('pengirim').value;
    const isiPesan = document.getElementById('isi-pesan').value;

    const siswa = dataBakat.find(s => s.id === idSiswaTerpilih);

    if (siswa) {
        // Masukkan pesan ke dalam siswa yang bersangkutan
        siswa.pesan.push({
            pengirim: pengirim,
            isi: isiPesan
        });

        formPesan.reset();
        modalPesan.classList.add('hidden');

        // Refresh daftar bakat untuk langsung memperlihatkan pesan baru
        tampilkanDaftarBakat();
        alert('Pesan bantuan berhasil terkirim!');
    }
});

// --- 8. Jalankan Halaman Beranda Saat Pertama Dibuka ---
bukaHalaman('halaman-beranda');
