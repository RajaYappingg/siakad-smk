import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { hitungNilaiAkhir } from '../src/utils/grade.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records in correct foreign key order
  await prisma.nilai.deleteMany();
  await prisma.jadwal.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siswa.deleteMany();
  await prisma.kelas.deleteMany();
  await prisma.jurusan.deleteMany();
  await prisma.mataPelajaran.deleteMany();
  await prisma.guru.deleteMany();
  await prisma.tahunAjaran.deleteMany();

  console.log('🧹 Cleaned existing data.');

  // 2. Seed Academic Years (Tahun Ajaran)
  const ta1 = await prisma.tahunAjaran.create({
    data: {
      tahun_ajaran: '2024/2025',
      semester: 'Ganjil',
      status: 'Tidak Aktif',
    },
  });

  const ta2 = await prisma.tahunAjaran.create({
    data: {
      tahun_ajaran: '2024/2025',
      semester: 'Genap',
      status: 'Tidak Aktif',
    },
  });

  const taAktif = await prisma.tahunAjaran.create({
    data: {
      tahun_ajaran: '2025/2026',
      semester: 'Ganjil',
      status: 'Aktif',
    },
  });

  console.log('✅ Seeded Tahun Ajaran.');

  // 3. Seed Jurusan
  const pplg = await prisma.jurusan.create({
    data: {
      kode_jurusan: 'PPLG',
      nama_jurusan: 'Pengembangan Perangkat Lunak dan Gim',
    },
  });

  const tjkt = await prisma.jurusan.create({
    data: {
      kode_jurusan: 'TJKT',
      nama_jurusan: 'Teknik Jaringan Komputer dan Telekomunikasi',
    },
  });

  const mplb = await prisma.jurusan.create({
    data: {
      kode_jurusan: 'MPLB',
      nama_jurusan: 'Manajemen Perkantoran dan Layanan Bisnis',
    },
  });

  console.log('✅ Seeded Jurusan.');

  // 4. Seed Kelas
  const k10pplg1 = await prisma.kelas.create({
    data: { id_jurusan: pplg.id_jurusan, tingkat: 'X', nama_kelas: 'X PPLG 1' },
  });
  const k10pplg2 = await prisma.kelas.create({
    data: { id_jurusan: pplg.id_jurusan, tingkat: 'X', nama_kelas: 'X PPLG 2' },
  });
  const k11pplg1 = await prisma.kelas.create({
    data: { id_jurusan: pplg.id_jurusan, tingkat: 'XI', nama_kelas: 'XI PPLG 1' },
  });
  const k12pplg1 = await prisma.kelas.create({
    data: { id_jurusan: pplg.id_jurusan, tingkat: 'XII', nama_kelas: 'XII PPLG 1' },
  });

  const k10tjkt1 = await prisma.kelas.create({
    data: { id_jurusan: tjkt.id_jurusan, tingkat: 'X', nama_kelas: 'X TJKT 1' },
  });
  const k11tjkt1 = await prisma.kelas.create({
    data: { id_jurusan: tjkt.id_jurusan, tingkat: 'XI', nama_kelas: 'XI TJKT 1' },
  });

  const k10mplb1 = await prisma.kelas.create({
    data: { id_jurusan: mplb.id_jurusan, tingkat: 'X', nama_kelas: 'X MPLB 1' },
  });
  const k11mplb1 = await prisma.kelas.create({
    data: { id_jurusan: mplb.id_jurusan, tingkat: 'XI', nama_kelas: 'XI MPLB 1' },
  });

  console.log('✅ Seeded Kelas.');

  // 5. Seed Guru (Teachers)
  const gBudi = await prisma.guru.create({
    data: {
      nip: '198205122008011005',
      nama_guru: 'Budi Santoso, S.Kom.',
      email: 'guru@example.com',
      no_hp: '081234567801',
    },
  });

  const gSiti = await prisma.guru.create({
    data: {
      nip: '198503142010012012',
      nama_guru: 'Siti Rahmawati, M.Pd.',
      email: 'siti.rahmawati@sekolah.sch.id',
      no_hp: '081234567802',
    },
  });

  const gHendra = await prisma.guru.create({
    data: {
      nip: '197908202005011003',
      nama_guru: 'Hendra Wijaya, S.T.',
      email: 'hendra.wijaya@sekolah.sch.id',
      no_hp: '081234567803',
    },
  });

  const gDewi = await prisma.guru.create({
    data: {
      nip: '199002152015022008',
      nama_guru: 'Dewi Sartika, S.Pd.',
      email: 'dewi.sartika@sekolah.sch.id',
      no_hp: '081234567804',
    },
  });

  const gYusuf = await prisma.guru.create({
    data: {
      nip: '197211051999031002',
      nama_guru: 'Drs. M. Yusuf, M.Ag.',
      email: 'yusuf.mag@sekolah.sch.id',
      no_hp: '081234567805',
    },
  });

  console.log('✅ Seeded Guru.');

  // 6. Seed Mata Pelajaran
  const mPweb = await prisma.mataPelajaran.create({
    data: {
      kode_mapel: 'PWEB',
      nama_mapel: 'Pemrograman Web',
      kelompok: 'Muatan Kejuruan',
    },
  });

  const mBd = await prisma.mataPelajaran.create({
    data: {
      kode_mapel: 'BD',
      nama_mapel: 'Basis Data',
      kelompok: 'Muatan Kejuruan',
    },
  });

  const mPbo = await prisma.mataPelajaran.create({
    data: {
      kode_mapel: 'PBO',
      nama_mapel: 'Pemrograman Berorientasi Objek',
      kelompok: 'Muatan Kejuruan',
    },
  });

  const mMtk = await prisma.mataPelajaran.create({
    data: {
      kode_mapel: 'MTK',
      nama_mapel: 'Matematika',
      kelompok: 'Muatan Nasional',
    },
  });

  const mBing = await prisma.mataPelajaran.create({
    data: {
      kode_mapel: 'BING',
      nama_mapel: 'Bahasa Inggris',
      kelompok: 'Muatan Nasional',
    },
  });

  const mBin = await prisma.mataPelajaran.create({
    data: {
      kode_mapel: 'BIN',
      nama_mapel: 'Bahasa Indonesia',
      kelompok: 'Muatan Nasional',
    },
  });

  const mPai = await prisma.mataPelajaran.create({
    data: {
      kode_mapel: 'PAI',
      nama_mapel: 'Pendidikan Agama Islam',
      kelompok: 'Muatan Nasional',
    },
  });

  const mPpkn = await prisma.mataPelajaran.create({
    data: {
      kode_mapel: 'PPKN',
      nama_mapel: 'Pendidikan Pancasila',
      kelompok: 'Muatan Nasional',
    },
  });

  console.log('✅ Seeded Mata Pelajaran.');

  // 7. Seed Siswa (18 Students)
  const studentsData = [
    {
      nis: '20241001',
      id_kelas: k10pplg1.id_kelas,
      nama_siswa: 'Ahmad Fauzi',
      jenis_kelamin: 'L',
      tanggal_lahir: new Date('2008-04-12'),
      alamat: 'Jl. Merdeka No. 45, Kota Baru',
      isDemo: true,
      email: 'siswa@example.com',
    },
    {
      nis: '20241002',
      id_kelas: k10pplg1.id_kelas,
      nama_siswa: 'Aulia Rahmawati',
      jenis_kelamin: 'P',
      tanggal_lahir: new Date('2008-07-22'),
      alamat: 'Jl. Melati No. 12, Kota Baru',
      email: 'aulia.rahma@siswa.sch.id',
    },
    {
      nis: '20241003',
      id_kelas: k10pplg1.id_kelas,
      nama_siswa: 'Bagas Pratama',
      jenis_kelamin: 'L',
      tanggal_lahir: new Date('2008-01-19'),
      alamat: 'Jl. Sudirman No. 88, Kota Baru',
      email: 'bagas.pratama@siswa.sch.id',
    },
    {
      nis: '20241004',
      id_kelas: k10pplg1.id_kelas,
      nama_siswa: 'Citra Kirana',
      jenis_kelamin: 'P',
      tanggal_lahir: new Date('2008-09-05'),
      alamat: 'Jl. Kenanga Indah No. 3, Kota Baru',
      email: 'citra.kirana@siswa.sch.id',
    },
    {
      nis: '20241005',
      id_kelas: k10pplg1.id_kelas,
      nama_siswa: 'Dimas Setiawan',
      jenis_kelamin: 'L',
      tanggal_lahir: new Date('2008-11-30'),
      alamat: 'Jl. Pahlawan No. 24, Kota Baru',
      email: 'dimas.setiawan@siswa.sch.id',
    },
    {
      nis: '20241006',
      id_kelas: k10pplg2.id_kelas,
      nama_siswa: 'Eko Prasetyo',
      jenis_kelamin: 'L',
      tanggal_lahir: new Date('2008-03-14'),
      alamat: 'Jl. Anggrek No. 15, Kota Baru',
      email: 'eko.prasetyo@siswa.sch.id',
    },
    {
      nis: '20241007',
      id_kelas: k10pplg2.id_kelas,
      nama_siswa: 'Fadhilah Nurul',
      jenis_kelamin: 'P',
      tanggal_lahir: new Date('2008-06-18'),
      alamat: 'Jl. Cempaka Putih No. 9, Kota Baru',
      email: 'fadhilah.nurul@siswa.sch.id',
    },
    {
      nis: '20241008',
      id_kelas: k10pplg2.id_kelas,
      nama_siswa: 'Gilang Ramadhan',
      jenis_kelamin: 'L',
      tanggal_lahir: new Date('2008-08-25'),
      alamat: 'Jl. Dahlia No. 71, Kota Baru',
      email: 'gilang.ramadhan@siswa.sch.id',
    },
    {
      nis: '20241009',
      id_kelas: k10tjkt1.id_kelas,
      nama_siswa: 'Hafizh Al-Farisi',
      jenis_kelamin: 'L',
      tanggal_lahir: new Date('2008-02-10'),
      alamat: 'Jl. Diponegoro No. 33, Kota Baru',
      email: 'hafizh.alfarisi@siswa.sch.id',
    },
    {
      nis: '20241010',
      id_kelas: k10tjkt1.id_kelas,
      nama_siswa: 'Indah Permatasari',
      jenis_kelamin: 'P',
      tanggal_lahir: new Date('2008-10-15'),
      alamat: 'Jl. Mawar No. 4, Kota Baru',
      email: 'indah.permata@siswa.sch.id',
    },
    {
      nis: '20241011',
      id_kelas: k10tjkt1.id_kelas,
      nama_siswa: 'Joko Susilo',
      jenis_kelamin: 'L',
      tanggal_lahir: new Date('2008-05-02'),
      alamat: 'Jl. Veteran No. 17, Kota Baru',
      email: 'joko.susilo@siswa.sch.id',
    },
    {
      nis: '20241012',
      id_kelas: k10mplb1.id_kelas,
      nama_siswa: 'Kurnia Lestari',
      jenis_kelamin: 'P',
      tanggal_lahir: new Date('2008-12-08'),
      alamat: 'Jl. Flamboyan No. 20, Kota Baru',
      email: 'kurnia.lestari@siswa.sch.id',
    },
    {
      nis: '20241013',
      id_kelas: k10mplb1.id_kelas,
      nama_siswa: 'Luthfi Hakim',
      jenis_kelamin: 'L',
      tanggal_lahir: new Date('2008-03-29'),
      alamat: 'Jl. Kartini No. 55, Kota Baru',
      email: 'luthfi.hakim@siswa.sch.id',
    },
    {
      nis: '20241014',
      id_kelas: k10mplb1.id_kelas,
      nama_siswa: 'Maya Safitri',
      jenis_kelamin: 'P',
      tanggal_lahir: new Date('2008-07-04'),
      alamat: 'Jl. Hayam Wuruk No. 8, Kota Baru',
      email: 'maya.safitri@siswa.sch.id',
    },
    {
      nis: '20231015',
      id_kelas: k11pplg1.id_kelas,
      nama_siswa: 'Naufal Rizky',
      jenis_kelamin: 'L',
      tanggal_lahir: new Date('2007-09-17'),
      alamat: 'Jl. Gajah Mada No. 102, Kota Baru',
      email: 'naufal.rizky@siswa.sch.id',
    },
    {
      nis: '20231016',
      id_kelas: k11pplg1.id_kelas,
      nama_siswa: 'Olivia Putri',
      jenis_kelamin: 'P',
      tanggal_lahir: new Date('2007-04-21'),
      alamat: 'Jl. Ahmad Yani No. 60, Kota Baru',
      email: 'olivia.putri@siswa.sch.id',
    },
    {
      nis: '20231017',
      id_kelas: k11tjkt1.id_kelas,
      nama_siswa: 'Pandu Wicaksono',
      jenis_kelamin: 'L',
      tanggal_lahir: new Date('2007-08-11'),
      alamat: 'Jl. Imam Bonjol No. 14, Kota Baru',
      email: 'pandu.wicaksono@siswa.sch.id',
    },
    {
      nis: '20231018',
      id_kelas: k11mplb1.id_kelas,
      nama_siswa: 'Qori Zakiyah',
      jenis_kelamin: 'P',
      tanggal_lahir: new Date('2007-11-09'),
      alamat: 'Jl. Cut Nyak Dien No. 27, Kota Baru',
      email: 'qori.zakiyah@siswa.sch.id',
    },
  ];

  for (const s of studentsData) {
    await prisma.siswa.create({
      data: {
        nis: s.nis,
        id_kelas: s.id_kelas,
        nama_siswa: s.nama_siswa,
        jenis_kelamin: s.jenis_kelamin,
        tanggal_lahir: s.tanggal_lahir,
        alamat: s.alamat,
      },
    });
  }

  console.log(`✅ Seeded ${studentsData.length} Siswa.`);

  // 8. Seed Schedules (Jadwal)
  // Ensure no conflicts!
  const schedules = [
    // Senin
    {
      id_guru: gBudi.id_guru,
      id_kelas: k10pplg1.id_kelas,
      id_mapel: mPweb.id_mapel,
      hari: 'Senin',
      jam_mulai: '07:30',
      jam_selesai: '09:30',
      ruang: 'Lab Komputer 1',
    },
    {
      id_guru: gSiti.id_guru,
      id_kelas: k10pplg1.id_kelas,
      id_mapel: mMtk.id_mapel,
      hari: 'Senin',
      jam_mulai: '10:00',
      jam_selesai: '11:30',
      ruang: 'Ruang Teori X-1',
    },
    {
      id_guru: gDewi.id_guru,
      id_kelas: k10pplg2.id_kelas,
      id_mapel: mBing.id_mapel,
      hari: 'Senin',
      jam_mulai: '07:30',
      jam_selesai: '09:00',
      ruang: 'Ruang Teori X-2',
    },
    {
      id_guru: gBudi.id_guru,
      id_kelas: k10pplg2.id_kelas,
      id_mapel: mPweb.id_mapel,
      hari: 'Senin',
      jam_mulai: '10:00',
      jam_selesai: '12:00',
      ruang: 'Lab Komputer 1',
    },
    {
      id_guru: gHendra.id_guru,
      id_kelas: k10tjkt1.id_kelas,
      id_mapel: mBd.id_mapel,
      hari: 'Senin',
      jam_mulai: '08:00',
      jam_selesai: '10:00',
      ruang: 'Lab Jaringan 1',
    },

    // Selasa
    {
      id_guru: gBudi.id_guru,
      id_kelas: k10pplg1.id_kelas,
      id_mapel: mBd.id_mapel,
      hari: 'Selasa',
      jam_mulai: '07:30',
      jam_selesai: '09:30',
      ruang: 'Lab Komputer 1',
    },
    {
      id_guru: gDewi.id_guru,
      id_kelas: k10pplg1.id_kelas,
      id_mapel: mBing.id_mapel,
      hari: 'Selasa',
      jam_mulai: '10:00',
      jam_selesai: '11:30',
      ruang: 'Ruang Teori X-1',
    },
    {
      id_guru: gSiti.id_guru,
      id_kelas: k10pplg2.id_kelas,
      id_mapel: mMtk.id_mapel,
      hari: 'Selasa',
      jam_mulai: '07:30',
      jam_selesai: '09:00',
      ruang: 'Ruang Teori X-2',
    },
    {
      id_guru: gHendra.id_guru,
      id_kelas: k11pplg1.id_kelas,
      id_mapel: mPbo.id_mapel,
      hari: 'Selasa',
      jam_mulai: '08:00',
      jam_selesai: '10:30',
      ruang: 'Lab Software',
    },

    // Rabu
    {
      id_guru: gYusuf.id_guru,
      id_kelas: k10pplg1.id_kelas,
      id_mapel: mPai.id_mapel,
      hari: 'Rabu',
      jam_mulai: '07:30',
      jam_selesai: '09:00',
      ruang: 'Ruang Teori X-1',
    },
    {
      id_guru: gSiti.id_guru,
      id_kelas: k10tjkt1.id_kelas,
      id_mapel: mMtk.id_mapel,
      hari: 'Rabu',
      jam_mulai: '09:30',
      jam_selesai: '11:00',
      ruang: 'Ruang Teori X-3',
    },

    // Kamis
    {
      id_guru: gBudi.id_guru,
      id_kelas: k11pplg1.id_kelas,
      id_mapel: mPweb.id_mapel,
      hari: 'Kamis',
      jam_mulai: '07:30',
      jam_selesai: '10:00',
      ruang: 'Lab Komputer 2',
    },
    {
      id_guru: gDewi.id_guru,
      id_kelas: k10mplb1.id_kelas,
      id_mapel: mBing.id_mapel,
      hari: 'Kamis',
      jam_mulai: '08:00',
      jam_selesai: '09:30',
      ruang: 'Ruang Teori X-4',
    },

    // Jumat
    {
      id_guru: gYusuf.id_guru,
      id_kelas: k10pplg2.id_kelas,
      id_mapel: mPai.id_mapel,
      hari: 'Jumat',
      jam_mulai: '07:30',
      jam_selesai: '09:00',
      ruang: 'Ruang Teori X-2',
    },
  ];

  for (const sc of schedules) {
    await prisma.jadwal.create({
      data: sc,
    });
  }

  console.log(`✅ Seeded ${schedules.length} Jadwal.`);

  // 9. Seed Nilai (Grades)
  // Grades for students in X PPLG 1 for active academic period
  const rawGrades = [
    // Ahmad Fauzi (Demo Student)
    { nis: '20241001', id_mapel: mPweb.id_mapel, id_guru: gBudi.id_guru, tugas: 88, uts: 85, uas: 90 },
    { nis: '20241001', id_mapel: mBd.id_mapel, id_guru: gBudi.id_guru, tugas: 85, uts: 80, uas: 88 },
    { nis: '20241001', id_mapel: mMtk.id_mapel, id_guru: gSiti.id_guru, tugas: 90, uts: 88, uas: 92 },
    { nis: '20241001', id_mapel: mBing.id_mapel, id_guru: gDewi.id_guru, tugas: 82, uts: 80, uas: 85 },
    { nis: '20241001', id_mapel: mPai.id_mapel, id_guru: gYusuf.id_guru, tugas: 95, uts: 90, uas: 92 },

    // Aulia Rahmawati
    { nis: '20241002', id_mapel: mPweb.id_mapel, id_guru: gBudi.id_guru, tugas: 92, uts: 90, uas: 95 },
    { nis: '20241002', id_mapel: mBd.id_mapel, id_guru: gBudi.id_guru, tugas: 90, uts: 88, uas: 92 },
    { nis: '20241002', id_mapel: mMtk.id_mapel, id_guru: gSiti.id_guru, tugas: 95, uts: 92, uas: 96 },

    // Bagas Pratama
    { nis: '20241003', id_mapel: mPweb.id_mapel, id_guru: gBudi.id_guru, tugas: 75, uts: 70, uas: 78 },
    { nis: '20241003', id_mapel: mBd.id_mapel, id_guru: gBudi.id_guru, tugas: 78, uts: 75, uas: 80 },
    { nis: '20241003', id_mapel: mMtk.id_mapel, id_guru: gSiti.id_guru, tugas: 70, uts: 65, uas: 72 },

    // Citra Kirana
    { nis: '20241004', id_mapel: mPweb.id_mapel, id_guru: gBudi.id_guru, tugas: 85, uts: 82, uas: 88 },
    { nis: '20241004', id_mapel: mMtk.id_mapel, id_guru: gSiti.id_guru, tugas: 88, uts: 85, uas: 90 },

    // Dimas Setiawan
    { nis: '20241005', id_mapel: mPweb.id_mapel, id_guru: gBudi.id_guru, tugas: 65, uts: 60, uas: 68 },
    { nis: '20241005', id_mapel: mMtk.id_mapel, id_guru: gSiti.id_guru, tugas: 60, uts: 58, uas: 62 },

    // Naufal Rizky (XI PPLG 1)
    { nis: '20231015', id_mapel: mPbo.id_mapel, id_guru: gHendra.id_guru, tugas: 90, uts: 86, uas: 92 },
    { nis: '20231015', id_mapel: mPweb.id_mapel, id_guru: gBudi.id_guru, tugas: 88, uts: 85, uas: 90 },
  ];

  for (const rg of rawGrades) {
    const akhir = hitungNilaiAkhir(rg.tugas, rg.uts, rg.uas);
    await prisma.nilai.create({
      data: {
        nis: rg.nis,
        id_tahun_ajaran: taAktif.id_tahun_ajaran,
        id_guru: rg.id_guru,
        id_mapel: rg.id_mapel,
        nilai_tugas: rg.tugas,
        nilai_uts: rg.uts,
        nilai_uas: rg.uas,
        nilai_akhir: akhir,
      },
    });
  }

  console.log(`✅ Seeded ${rawGrades.length} Nilai.`);

  // 10. Seed Users & Demo Accounts
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordGuru = await bcrypt.hash('guru123', 10);
  const hashedPasswordSiswa = await bcrypt.hash('siswa123', 10);

  // Admin Account
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPasswordAdmin,
      role: Role.ADMIN,
      nama: 'Administrator Utama',
    },
  });

  // Guru Demo Account (Budi Santoso)
  await prisma.user.create({
    data: {
      email: 'guru@example.com',
      password: hashedPasswordGuru,
      role: Role.GURU,
      id_guru: gBudi.id_guru,
      nama: gBudi.nama_guru,
    },
  });

  // Siswa Demo Account (Ahmad Fauzi)
  await prisma.user.create({
    data: {
      email: 'siswa@example.com',
      password: hashedPasswordSiswa,
      role: Role.SISWA,
      nis: '20241001',
      nama: 'Ahmad Fauzi',
    },
  });

  // Other Teacher Users
  await prisma.user.create({
    data: {
      email: gSiti.email,
      password: hashedPasswordGuru,
      role: Role.GURU,
      id_guru: gSiti.id_guru,
      nama: gSiti.nama_guru,
    },
  });

  await prisma.user.create({
    data: {
      email: gHendra.email,
      password: hashedPasswordGuru,
      role: Role.GURU,
      id_guru: gHendra.id_guru,
      nama: gHendra.nama_guru,
    },
  });

  // Another Student User (Aulia)
  await prisma.user.create({
    data: {
      email: 'aulia.rahma@siswa.sch.id',
      password: hashedPasswordSiswa,
      role: Role.SISWA,
      nis: '20241002',
      nama: 'Aulia Rahmawati',
    },
  });

  console.log('✅ Seeded Users and Demo Accounts:');
  console.log('   👑 ADMIN: admin@example.com / admin123');
  console.log('   👨‍🏫 GURU : guru@example.com  / guru123');
  console.log('   👨‍🎓 SISWA: siswa@example.com / siswa123');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
