// --- 1. Data Awal (Dummy Data) ---
// Kita menyiapkan beberapa sampel data bakat awal
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

// Variabel untuk menyimpan ID siswa yang sedang dipilih saat ingin kirim pesan
let idSiswaTerpilih = null;

// --- 2. Menghubungkan Elemen HTML ke JavaScript ---
const formBakat = document.getElementById('form-bakat');
const wadahDaftarBakat = document.getElementById('daftar-bakat');

const modalPesan = document.getElementById('modal-pesan');
const btnTutupModal = document.getElementById('btn-tutup-modal');
const formPesan = document.getElementById('form-pesan');
const modalDeskripsiTujuan = document.getElementById('modal-deskripsi-tujuan');

// --- 3. Fungsi Menampilkan Semua Bakat ke Layar ---
function tampilkanDaftarBakat() {
    // Kosongkan wadah terlebih dahulu agar tidak menumpuk saat di-update
    wadahDaftarBakat.innerHTML = '';

    // Perulangan untuk setiap item di dataBakat
    dataBakat.forEach(item => {
        // Buat elemen div baru untuk kartu siswa
        const kartu = document.createElement('div');
        kartu.className = 'item-bakat';

        // Buat daftar pesan yang pernah dikirim ke siswa ini
        let HTMLPesan = '';
        if (item.pesan.length > 0) {
            HTMLPesan = `<div class="daftar-pesan-masuk"><h4>📩 Pesan/Permintaan Bantuan:</h4>`;
            item.pesan.forEach(p => {
                HTMLPesan += `
                    <div class="pesan-box">
                        <strong>${p.pengirim}:</strong> "${p.isi}"
                    </div>
                `;
            });
            HTMLPesan += `</div>`;
        }

        // Isi elemen kartu dengan data siswa
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

        // Masukkan kartu ke dalam wadah di halaman
        wadahDaftarBakat.appendChild(kartu);
    });
}

// --- 4. Menangani Form Tambah Bakat Baru ---
formBakat.addEventListener('submit', function(e) {
    // Mencegah browser melakukan reload halaman saat form di-submit
    e.preventDefault();

    // Ambil nilai dari input form
    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;
    const bakat = document.getElementById('bakat').value;
    const deskripsi = document.getElementById('deskripsi').value;

    // Buat objek bakat baru
    const bakatBaru = {
        id: Date.now(), // Menggunakan timestamp unik sebagai ID
        nama: nama,
        kelas: kelas,
        bakat: bakat,
        deskripsi: deskripsi,
        pesan: []
    };

    // Tambahkan ke dalam array dataBakat
    dataBakat.unshift(bakatBaru); // unshift menaruh data baru di urutan paling atas

    // Reset form agar kolom input menjadi kosong kembali
    formBakat.reset();

    // Perbarui tampilan daftar bakat di halaman
    tampilkanDaftarBakat();
});

// --- 5. Fungsi Membuka Modal Pop-up Pesan ---
function bukaModalPesan(id) {
    idSiswaTerpilih = id;
    
    // Cari data siswa berdasarkan ID
    const siswa = dataBakat.find(s => s.id === id);
    
    if (siswa) {
        modalDeskripsiTujuan.innerText = `Kirim pesan ke ${siswa.nama} (${siswa.bakat})`;
        modalPesan.classList.remove('hidden'); // Tampilkan modal
    }
}

// --- 6. Fungsi Menutup Modal Pop-up ---
btnTutupModal.addEventListener('click', function() {
    modalPesan.classList.add('hidden'); // Sembunyikan modal
});

// --- 7. Menangani Form Kirim Pesan ---
formPesan.addEventListener('submit', function(e) {
    e.preventDefault();

    const pengirim = document.getElementById('pengirim').value;
    const isiPesan = document.getElementById('isi-pesan').value;

    // Cari siswa yang dituju
    const siswa = dataBakat.find(s => s.id === idSiswaTerpilih);

    if (siswa) {
        // Tambahkan pesan baru ke dalam array pesan milik siswa tersebut
        siswa.pesan.push({
            pengirim: pengirim,
            isi: isiPesan
        });

        // Reset form pesan & tutup modal
        formPesan.reset();
        modalPesan.classList.add('hidden');

        // Perbarui tampilan layar
        tampilkanDaftarBakat();
        alert('Pesan berhasil dikirim!');
    }
});

// --- 8. Jalankan Fungsi Tampil Pertama Kali ---
// Fungsi ini dijalankan ketika halaman web selesai dimuat
tampilkanDaftarBakat();
