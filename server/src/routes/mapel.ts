import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../prisma.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = Router();

const mapelSchema = z.object({
  kode_mapel: z.string().min(1, 'Kode mapel wajib diisi').max(20),
  nama_mapel: z.string().min(1, 'Nama mata pelajaran wajib diisi').max(100),
  kelompok: z.string().min(1, 'Kelompok mata pelajaran wajib diisi').max(50),
});

// GET /api/mapel
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, kelompok } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { kode_mapel: { contains: String(search) } },
        { nama_mapel: { contains: String(search) } },
      ];
    }
    if (kelompok) {
      where.kelompok = String(kelompok);
    }

    const data = await prisma.mataPelajaran.findMany({
      where,
      include: {
        _count: {
          select: { jadwal: true, nilai: true },
        },
      },
      orderBy: [
        { kelompok: 'asc' },
        { nama_mapel: 'asc' },
      ],
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Fetch mapel error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data mata pelajaran.' });
  }
});

// GET /api/mapel/:id
router.get('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    const mapel = await prisma.mataPelajaran.findUnique({
      where: { id_mapel: id },
      include: {
        jadwal: {
          include: {
            guru: true,
            kelas: {
              include: { jurusan: true },
            },
          },
        },
      },
    });

    if (!mapel) {
      res.status(404).json({ success: false, message: 'Mata pelajaran tidak ditemukan.' });
      return;
    }

    // Extract unique teachers teaching this subject
    const teachersMap = new Map<number, any>();
    mapel.jadwal.forEach((j) => {
      teachersMap.set(j.guru.id_guru, j.guru);
    });

    res.json({
      success: true,
      data: {
        ...mapel,
        guruPengampu: Array.from(teachersMap.values()),
      },
    });
  } catch (error) {
    console.error('Detail mapel error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail mata pelajaran.' });
  }
});

// POST /api/mapel (Admin only)
router.post('/', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = mapelSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const existing = await prisma.mataPelajaran.findUnique({
      where: { kode_mapel: parsed.data.kode_mapel },
    });
    if (existing) {
      res.status(400).json({ success: false, message: `Kode mapel ${parsed.data.kode_mapel} sudah digunakan.` });
      return;
    }

    const created = await prisma.mataPelajaran.create({
      data: parsed.data,
    });

    res.status(201).json({ success: true, message: 'Mata pelajaran berhasil ditambahkan.', data: created });
  } catch (error) {
    console.error('Create mapel error:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan mata pelajaran.' });
  }
});

// PUT /api/mapel/:id (Admin only)
router.put('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const parsed = mapelSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const dup = await prisma.mataPelajaran.findFirst({
      where: {
        kode_mapel: parsed.data.kode_mapel,
        NOT: { id_mapel: id },
      },
    });
    if (dup) {
      res.status(400).json({ success: false, message: `Kode mapel ${parsed.data.kode_mapel} sudah digunakan oleh mata pelajaran lain.` });
      return;
    }

    const updated = await prisma.mataPelajaran.update({
      where: { id_mapel: id },
      data: parsed.data,
    });

    res.json({ success: true, message: 'Mata pelajaran berhasil diperbarui.', data: updated });
  } catch (error) {
    console.error('Update mapel error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui mata pelajaran.' });
  }
});

// DELETE /api/mapel/:id (Admin only)
router.delete('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    const scheduleCount = await prisma.jadwal.count({
      where: { id_mapel: id },
    });
    if (scheduleCount > 0) {
      res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus mata pelajaran ini karena masih memiliki ${scheduleCount} jadwal pelajaran.`,
      });
      return;
    }

    const gradeCount = await prisma.nilai.count({
      where: { id_mapel: id },
    });
    if (gradeCount > 0) {
      res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus mata pelajaran ini karena telah memiliki ${gradeCount} data nilai.`,
      });
      return;
    }

    await prisma.mataPelajaran.delete({
      where: { id_mapel: id },
    });

    res.json({ success: true, message: 'Mata pelajaran berhasil dihapus.' });
  } catch (error) {
    console.error('Delete mapel error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus mata pelajaran.' });
  }
});

export default router;
