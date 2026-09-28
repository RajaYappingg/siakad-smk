import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../prisma.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { hitungNilaiAkhir, predikatNilai } from '../utils/grade.js';

const router = Router();

const singleNilaiSchema = z.object({
  nis: z.string().min(1, 'NIS wajib diisi'),
  id_tahun_ajaran: z.number().int().positive('Tahun ajaran wajib dipilih'),
  id_guru: z.number().int().positive('Guru wajib dipilih'),
  id_mapel: z.number().int().positive('Mata pelajaran wajib dipilih'),
  nilai_tugas: z.number().min(0).max(100, 'Nilai tugas maksimal 100'),
  nilai_uts: z.number().min(0).max(100, 'Nilai UTS maksimal 100'),
  nilai_uas: z.number().min(0).max(100, 'Nilai UAS maksimal 100'),
});

const batchNilaiSchema = z.object({
  id_tahun_ajaran: z.number().int().positive('Tahun ajaran wajib dipilih'),
  id_guru: z.number().int().positive('Guru wajib dipilih'),
  id_mapel: z.number().int().positive('Mata pelajaran wajib dipilih'),
  grades: z.array(
    z.object({
      nis: z.string().min(1),
      nilai_tugas: z.number().min(0).max(100),
      nilai_uts: z.number().min(0).max(100),
      nilai_uas: z.number().min(0).max(100),
    })
  ),
});

// GET /api/nilai
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_tahun_ajaran, id_kelas, id_mapel, id_guru, nis } = req.query;

    const where: any = {};

    // Role-based restrictions
    if (req.user?.role === Role.SISWA) {
      if (!req.user.nis) {
        res.status(403).json({ success: false, message: 'Akun siswa tidak terhubung dengan NIS valid.' });
        return;
      }
      where.nis = req.user.nis;
    } else {
      if (nis) where.nis = String(nis);
    }

    if (req.user?.role === Role.GURU && !req.user.id_guru) {
      res.status(403).json({ success: false, message: 'Akun guru tidak terhubung dengan ID Guru valid.' });
      return;
    }

    if (id_tahun_ajaran) where.id_tahun_ajaran = parseInt(String(id_tahun_ajaran), 10);
    if (id_mapel) where.id_mapel = parseInt(String(id_mapel), 10);
    if (id_guru) where.id_guru = parseInt(String(id_guru), 10);
    if (id_kelas) {
      where.siswa = { id_kelas: parseInt(String(id_kelas), 10) };
    }

    const data = await prisma.nilai.findMany({
      where,
      include: {
        siswa: {
          include: {
            kelas: {
              include: { jurusan: true },
            },
          },
        },
        mataPelajaran: true,
        guru: true,
        tahunAjaran: true,
      },
      orderBy: [
        { siswa: { nama_siswa: 'asc' } },
        { mataPelajaran: { nama_mapel: 'asc' } },
      ],
    });

    const enriched = data.map((item) => ({
      ...item,
      ...predikatNilai(item.nilai_akhir),
    }));

    res.json({ success: true, data: enriched });
  } catch (error) {
    console.error('Fetch nilai error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data nilai.' });
  }
});

// GET /api/nilai/raport/:nis
router.get('/raport/:nis', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const targetNis = String(req.params.nis);
    const { id_tahun_ajaran } = req.query;

    // Student can only see their own raport
    if (req.user?.role === Role.SISWA && req.user.nis !== targetNis) {
      res.status(403).json({ success: false, message: 'Anda hanya dapat melihat raport Anda sendiri.' });
      return;
    }

    const student = await prisma.siswa.findUnique({
      where: { nis: targetNis },
      include: {
        kelas: {
          include: { jurusan: true },
        },
      },
    });

    if (!student) {
      res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });
      return;
    }

    // Default to active academic year if not provided
    let tahunAjaranId: number | undefined;
    if (id_tahun_ajaran) {
      tahunAjaranId = parseInt(String(id_tahun_ajaran), 10);
    } else {
      const activeTA = await prisma.tahunAjaran.findFirst({ where: { status: 'Aktif' } });
      tahunAjaranId = activeTA?.id_tahun_ajaran;
    }

    const where: any = { nis: targetNis };
    if (tahunAjaranId) {
      where.id_tahun_ajaran = tahunAjaranId;
    }

    const grades = await prisma.nilai.findMany({
      where,
      include: {
        mataPelajaran: true,
        guru: true,
        tahunAjaran: true,
      },
      orderBy: [
        { mataPelajaran: { kelompok: 'asc' } },
        { mataPelajaran: { nama_mapel: 'asc' } },
      ],
    });

    const enrichedGrades = grades.map((g) => ({
      ...g,
      ...predikatNilai(g.nilai_akhir),
    }));

    const totalNilai = enrichedGrades.reduce((sum, g) => sum + g.nilai_akhir, 0);
    const rerata = enrichedGrades.length > 0 ? Math.round((totalNilai / enrichedGrades.length) * 100) / 100 : 0;

    res.json({
      success: true,
      data: {
        siswa: student,
        nilai: enrichedGrades,
        statistik: {
          totalMapel: enrichedGrades.length,
          rataRata: rerata,
          ...predikatNilai(rerata),
        },
      },
    });
  } catch (error) {
    console.error('Fetch raport error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data raport.' });
  }
});

// POST /api/nilai (Single create or update - Teacher or Admin)
router.post('/', authenticateToken, authorize([Role.ADMIN, Role.GURU]), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = singleNilaiSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    // Teacher check: teacher can only input grades under their own id_guru
    if (req.user?.role === Role.GURU && req.user.id_guru !== parsed.data.id_guru) {
      res.status(403).json({ success: false, message: 'Anda hanya dapat menginput nilai sebagai diri Anda sendiri.' });
      return;
    }

    const nilai_akhir = hitungNilaiAkhir(parsed.data.nilai_tugas, parsed.data.nilai_uts, parsed.data.nilai_uas);

    const saved = await prisma.nilai.upsert({
      where: {
        nis_id_mapel_id_tahun_ajaran: {
          nis: parsed.data.nis,
          id_mapel: parsed.data.id_mapel,
          id_tahun_ajaran: parsed.data.id_tahun_ajaran,
        },
      },
      update: {
        nilai_tugas: parsed.data.nilai_tugas,
        nilai_uts: parsed.data.nilai_uts,
        nilai_uas: parsed.data.nilai_uas,
        nilai_akhir,
        id_guru: parsed.data.id_guru,
      },
      create: {
        ...parsed.data,
        nilai_akhir,
      },
      include: {
        siswa: true,
        mataPelajaran: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Nilai berhasil disimpan.',
      data: {
        ...saved,
        ...predikatNilai(saved.nilai_akhir),
      },
    });
  } catch (error) {
    console.error('Save nilai error:', error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan data nilai.' });
  }
});

// POST /api/nilai/batch (Batch save grades for an entire class - Teacher or Admin)
router.post('/batch', authenticateToken, authorize([Role.ADMIN, Role.GURU]), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = batchNilaiSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const { id_tahun_ajaran, id_guru, id_mapel, grades } = parsed.data;

    // Teacher check
    if (req.user?.role === Role.GURU && req.user.id_guru !== id_guru) {
      res.status(403).json({ success: false, message: 'Anda hanya dapat menginput nilai sebagai diri Anda sendiri.' });
      return;
    }

    const results = [];
    for (const item of grades) {
      const akhir = hitungNilaiAkhir(item.nilai_tugas, item.nilai_uts, item.nilai_uas);
      const saved = await prisma.nilai.upsert({
        where: {
          nis_id_mapel_id_tahun_ajaran: {
            nis: item.nis,
            id_mapel,
            id_tahun_ajaran,
          },
        },
        update: {
          nilai_tugas: item.nilai_tugas,
          nilai_uts: item.nilai_uts,
          nilai_uas: item.nilai_uas,
          nilai_akhir: akhir,
          id_guru,
        },
        create: {
          nis: item.nis,
          id_tahun_ajaran,
          id_guru,
          id_mapel,
          nilai_tugas: item.nilai_tugas,
          nilai_uts: item.nilai_uts,
          nilai_uas: item.nilai_uas,
          nilai_akhir: akhir,
        },
      });
      results.push(saved);
    }

    res.json({
      success: true,
      message: `${results.length} data nilai berhasil disimpan.`,
      data: results,
    });
  } catch (error) {
    console.error('Batch save nilai error:', error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan nilai secara massal.' });
  }
});

// DELETE /api/nilai/:id (Admin or authorized Guru)
router.delete('/:id', authenticateToken, authorize([Role.ADMIN, Role.GURU]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    const existing = await prisma.nilai.findUnique({
      where: { id_nilai: id },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Data nilai tidak ditemukan.' });
      return;
    }

    if (req.user?.role === Role.GURU && req.user.id_guru !== existing.id_guru) {
      res.status(403).json({ success: false, message: 'Anda hanya dapat menghapus nilai yang Anda inputkan.' });
      return;
    }

    await prisma.nilai.delete({
      where: { id_nilai: id },
    });

    res.json({ success: true, message: 'Data nilai berhasil dihapus.' });
  } catch (error) {
    console.error('Delete nilai error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus data nilai.' });
  }
});

export default router;
