import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../prisma.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = Router();

const jurusanSchema = z.object({
  kode_jurusan: z.string().min(1, 'Kode jurusan wajib diisi').max(20),
  nama_jurusan: z.string().min(1, 'Nama jurusan wajib diisi').max(100),
});

// GET /api/jurusan (All authenticated users can view)
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string;

    const where: any = {};
    if (search) {
      where.OR = [
        { kode_jurusan: { contains: search } },
        { nama_jurusan: { contains: search } },
      ];
    }

    const data = await prisma.jurusan.findMany({
      where,
      include: {
        _count: {
          select: { kelas: true },
        },
      },
      orderBy: { kode_jurusan: 'asc' },
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Fetch jurusan error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data jurusan.' });
  }
});

// GET /api/jurusan/:id
router.get('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const item = await prisma.jurusan.findUnique({
      where: { id_jurusan: id },
      include: {
        kelas: {
          include: {
            _count: {
              select: { siswa: true, jadwal: true },
            },
          },
        },
      },
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Jurusan tidak ditemukan.' });
      return;
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Detail jurusan error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail jurusan.' });
  }
});

// POST /api/jurusan (Admin only)
router.post('/', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = jurusanSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const existing = await prisma.jurusan.findUnique({
      where: { kode_jurusan: parsed.data.kode_jurusan },
    });

    if (existing) {
      res.status(400).json({ success: false, message: `Kode jurusan "${parsed.data.kode_jurusan}" sudah digunakan.` });
      return;
    }

    const created = await prisma.jurusan.create({
      data: parsed.data,
    });

    res.status(201).json({ success: true, message: 'Jurusan berhasil ditambahkan.', data: created });
  } catch (error) {
    console.error('Create jurusan error:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan jurusan.' });
  }
});

// PUT /api/jurusan/:id (Admin only)
router.put('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const parsed = jurusanSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const duplicate = await prisma.jurusan.findFirst({
      where: {
        kode_jurusan: parsed.data.kode_jurusan,
        NOT: { id_jurusan: id },
      },
    });

    if (duplicate) {
      res.status(400).json({ success: false, message: `Kode jurusan "${parsed.data.kode_jurusan}" sudah digunakan oleh jurusan lain.` });
      return;
    }

    const updated = await prisma.jurusan.update({
      where: { id_jurusan: id },
      data: parsed.data,
    });

    res.json({ success: true, message: 'Jurusan berhasil diperbarui.', data: updated });
  } catch (error) {
    console.error('Update jurusan error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui jurusan.' });
  }
});

// DELETE /api/jurusan/:id (Admin only)
router.delete('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    const relatedClassCount = await prisma.kelas.count({
      where: { id_jurusan: id },
    });

    if (relatedClassCount > 0) {
      res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus jurusan ini karena masih memiliki ${relatedClassCount} kelas yang terdaftar.`,
      });
      return;
    }

    await prisma.jurusan.delete({
      where: { id_jurusan: id },
    });

    res.json({ success: true, message: 'Jurusan berhasil dihapus.' });
  } catch (error) {
    console.error('Delete jurusan error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus jurusan.' });
  }
});

export default router;
