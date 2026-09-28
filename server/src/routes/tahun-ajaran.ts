import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../prisma.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = Router();

const tahunAjaranSchema = z.object({
  tahun_ajaran: z.string().min(1, 'Tahun ajaran wajib diisi (misal: 2025/2026)').max(20),
  semester: z.enum(['Ganjil', 'Genap'], { errorMap: () => ({ message: 'Semester harus Ganjil atau Genap' }) }),
  status: z.enum(['Aktif', 'Tidak Aktif'], { errorMap: () => ({ message: 'Status harus Aktif atau Tidak Aktif' }) }),
});

// GET /api/tahun-ajaran
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await prisma.tahunAjaran.findMany({
      orderBy: [
        { status: 'asc' }, // 'Aktif' comes before 'Tidak Aktif' alphabetically
        { tahun_ajaran: 'desc' },
        { semester: 'desc' },
      ],
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Fetch tahun ajaran error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data tahun ajaran.' });
  }
});

// GET /api/tahun-ajaran/aktif
router.get('/aktif', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const active = await prisma.tahunAjaran.findFirst({
      where: { status: 'Aktif' },
    });

    res.json({ success: true, data: active });
  } catch (error) {
    console.error('Fetch active tahun ajaran error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil tahun ajaran aktif.' });
  }
});

// POST /api/tahun-ajaran (Admin only)
router.post('/', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = tahunAjaranSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    // If marked as Aktif, deactivate all others
    if (parsed.data.status === 'Aktif') {
      await prisma.tahunAjaran.updateMany({
        data: { status: 'Tidak Aktif' },
      });
    }

    const created = await prisma.tahunAjaran.create({
      data: parsed.data,
    });

    res.status(201).json({ success: true, message: 'Tahun ajaran berhasil ditambahkan.', data: created });
  } catch (error) {
    console.error('Create tahun ajaran error:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan tahun ajaran.' });
  }
});

// PUT /api/tahun-ajaran/:id (Admin only)
router.put('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const parsed = tahunAjaranSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    // If marked as Aktif, deactivate all other periods
    if (parsed.data.status === 'Aktif') {
      await prisma.tahunAjaran.updateMany({
        where: { id_tahun_ajaran: { not: id } },
        data: { status: 'Tidak Aktif' },
      });
    }

    const updated = await prisma.tahunAjaran.update({
      where: { id_tahun_ajaran: id },
      data: parsed.data,
    });

    res.json({ success: true, message: 'Tahun ajaran berhasil diperbarui.', data: updated });
  } catch (error) {
    console.error('Update tahun ajaran error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui tahun ajaran.' });
  }
});

// DELETE /api/tahun-ajaran/:id (Admin only)
router.delete('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    const gradeCount = await prisma.nilai.count({
      where: { id_tahun_ajaran: id },
    });

    if (gradeCount > 0) {
      res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus tahun ajaran ini karena memiliki ${gradeCount} data nilai tersimpan.`,
      });
      return;
    }

    await prisma.tahunAjaran.delete({
      where: { id_tahun_ajaran: id },
    });

    res.json({ success: true, message: 'Tahun ajaran berhasil dihapus.' });
  } catch (error) {
    console.error('Delete tahun ajaran error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus tahun ajaran.' });
  }
});

export default router;
