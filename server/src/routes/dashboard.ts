import { Router, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../prisma.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { predikatNilai } from '../utils/grade.js';

const router = Router();

// Indonesian day of week helper
function getIndonesianDay(): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[new Date().getDay()];
}

// GET /api/dashboard/public-stats (Public statistics for landing page)
router.get('/public-stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalSiswa, totalGuru, totalKelas, totalMapel, totalJurusan, activeTA] = await Promise.all([
      prisma.siswa.count(),
      prisma.guru.count(),
      prisma.kelas.count(),
      prisma.mataPelajaran.count(),
      prisma.jurusan.count(),
      prisma.tahunAjaran.findFirst({ where: { status: 'Aktif' } }),
    ]);

    res.json({
      success: true,
      data: {
        totalSiswa,
        totalGuru,
        totalKelas,
        totalMapel,
        totalJurusan,
        tahunAjaranAktif: activeTA ? `${activeTA.tahun_ajaran} (${activeTA.semester})` : '2025/2026 (Ganjil)',
      },
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        totalSiswa: 18,
        totalGuru: 6,
        totalKelas: 6,
        totalMapel: 10,
        totalJurusan: 3,
        tahunAjaranAktif: '2025/2026 (Ganjil)',
      },
    });
  }
});

// GET /api/dashboard/admin
router.get('/admin', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const today = getIndonesianDay();

    const [totalSiswa, totalGuru, totalKelas, totalMapel, activeTA, jurusanData, todaySchedules, recentGrades] = await Promise.all([
      prisma.siswa.count(),
      prisma.guru.count(),
      prisma.kelas.count(),
      prisma.mataPelajaran.count(),
      prisma.tahunAjaran.findFirst({ where: { status: 'Aktif' } }),
      prisma.jurusan.findMany({
        include: {
          kelas: {
            include: {
              _count: { select: { siswa: true } },
            },
          },
        },
      }),
      prisma.jadwal.findMany({
        where: { hari: today },
        include: {
          guru: true,
          kelas: { include: { jurusan: true } },
          mataPelajaran: true,
        },
        orderBy: { jam_mulai: 'asc' },
      }),
      prisma.nilai.findMany({
        take: 5,
        orderBy: { id_nilai: 'desc' },
        include: {
          siswa: { include: { kelas: true } },
          mataPelajaran: true,
          guru: true,
        },
      }),
    ]);

    // Format distribution per major
    const distribusiJurusan = jurusanData.map((j) => {
      const siswaCount = j.kelas.reduce((sum, k) => sum + k._count.siswa, 0);
      return {
        id_jurusan: j.id_jurusan,
        kode: j.kode_jurusan,
        nama: j.nama_jurusan,
        totalSiswa: siswaCount,
        totalKelas: j.kelas.length,
      };
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalSiswa,
          totalGuru,
          totalKelas,
          totalMapel,
          tahunAjaranAktif: activeTA ? `${activeTA.tahun_ajaran} (${activeTA.semester})` : 'Belum diatur',
        },
        hariIni: today,
        jadwalHariIni: todaySchedules,
        distribusiJurusan,
        aktivitasNilaiTerbaru: recentGrades.map((g) => ({
          ...g,
          ...predikatNilai(g.nilai_akhir),
        })),
      },
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Gagal memuat data dashboard admin.' });
  }
});

// GET /api/dashboard/guru
router.get('/guru', authenticateToken, authorize([Role.GURU, Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id_guru = req.user?.id_guru;
    if (!id_guru) {
      res.status(400).json({ success: false, message: 'Data akun guru tidak terhubung dengan profil guru.' });
      return;
    }

    const today = getIndonesianDay();

    const [guru, activeTA, todaySchedules, allSchedules, recentGrades] = await Promise.all([
      prisma.guru.findUnique({ where: { id_guru } }),
      prisma.tahunAjaran.findFirst({ where: { status: 'Aktif' } }),
      prisma.jadwal.findMany({
        where: { id_guru, hari: today },
        include: {
          kelas: { include: { jurusan: true } },
          mataPelajaran: true,
        },
        orderBy: { jam_mulai: 'asc' },
      }),
      prisma.jadwal.findMany({
        where: { id_guru },
        include: {
          kelas: { include: { jurusan: true, _count: { select: { siswa: true } } } },
          mataPelajaran: true,
        },
      }),
      prisma.nilai.findMany({
        where: { id_guru },
        take: 6,
        orderBy: { id_nilai: 'desc' },
        include: {
          siswa: { include: { kelas: true } },
          mataPelajaran: true,
        },
      }),
    ]);

    // Unique classes taught
    const classesMap = new Map<number, any>();
    allSchedules.forEach((s) => {
      classesMap.set(s.kelas.id_kelas, s.kelas);
    });

    res.json({
      success: true,
      data: {
        guru,
        tahunAjaranAktif: activeTA ? `${activeTA.tahun_ajaran} (${activeTA.semester})` : 'Belum diatur',
        hariIni: today,
        jadwalHariIni: todaySchedules,
        totalKelasDiajar: classesMap.size,
        kelasDiajar: Array.from(classesMap.values()),
        totalJadwalMengajar: allSchedules.length,
        aktivitasNilaiTerbaru: recentGrades.map((g) => ({
          ...g,
          ...predikatNilai(g.nilai_akhir),
        })),
      },
    });
  } catch (error) {
    console.error('Guru dashboard error:', error);
    res.status(500).json({ success: false, message: 'Gagal memuat dashboard guru.' });
  }
});

// GET /api/dashboard/siswa
router.get('/siswa', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const nis = req.user?.nis;
    if (!nis) {
      res.status(400).json({ success: false, message: 'Data akun tidak terhubung dengan profil siswa.' });
      return;
    }

    const today = getIndonesianDay();

    const [siswa, activeTA] = await Promise.all([
      prisma.siswa.findUnique({
        where: { nis },
        include: {
          kelas: {
            include: { jurusan: true },
          },
        },
      }),
      prisma.tahunAjaran.findFirst({ where: { status: 'Aktif' } }),
    ]);

    if (!siswa) {
      res.status(404).json({ success: false, message: 'Data siswa tidak ditemukan.' });
      return;
    }

    const [todaySchedules, recentGrades] = await Promise.all([
      prisma.jadwal.findMany({
        where: {
          id_kelas: siswa.id_kelas,
          hari: today,
        },
        include: {
          guru: true,
          mataPelajaran: true,
        },
        orderBy: { jam_mulai: 'asc' },
      }),
      prisma.nilai.findMany({
        where: {
          nis,
          ...(activeTA ? { id_tahun_ajaran: activeTA.id_tahun_ajaran } : {}),
        },
        include: {
          mataPelajaran: true,
          guru: true,
        },
      }),
    ]);

    const enrichedGrades = recentGrades.map((g) => ({
      ...g,
      ...predikatNilai(g.nilai_akhir),
    }));

    const totalNilai = enrichedGrades.reduce((sum, g) => sum + g.nilai_akhir, 0);
    const rataRata = enrichedGrades.length > 0 ? Math.round((totalNilai / enrichedGrades.length) * 100) / 100 : 0;

    res.json({
      success: true,
      data: {
        siswa,
        tahunAjaranAktif: activeTA ? `${activeTA.tahun_ajaran} (${activeTA.semester})` : 'Belum diatur',
        hariIni: today,
        jadwalHariIni: todaySchedules,
        nilai: enrichedGrades,
        statistik: {
          totalMapelDinilai: enrichedGrades.length,
          rataRata,
          ...predikatNilai(rataRata),
        },
      },
    });
  } catch (error) {
    console.error('Siswa dashboard error:', error);
    res.status(500).json({ success: false, message: 'Gagal memuat dashboard siswa.' });
  }
});

export default router;
