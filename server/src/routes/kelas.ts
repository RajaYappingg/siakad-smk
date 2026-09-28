import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../prisma.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = Router();

const kelasSchema = z.object({
  id_jurusan: z.number().int().positive('Jurusan wajib dipilih'),
  tingkat: z.string().min(1, 'Tingkat wajib diisi (misal: X, XI, XII)').max(10),
  nama_kelas: z.string().min(1, 'Nama kelas wajib diisi (misal: X PPLG 1)').max(50),
});

// GET /api/kelas
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, tingkat, id_jurusan } = req.query;

    const where: any = {};
    if (search) {
      where.nama_kelas = { contains: String(search) };
    }
    if (tingkat) {
      where.tingkat = String(tingkat);
    }
    if (id_jurusan) {
      where.id_jurusan = parseInt(String(id_jurusan), 10);
    }

    const data = await prisma.kelas.findMany({
      where,
      include: {
        jurusan: true,
        _count: {
          select: { siswa: true, jadwal: true },
        },
      },
      orderBy: [
        { tingkat: 'asc' },
        { nama_kelas: 'asc' },
      ],
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Fetch kelas error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data kelas.' });
  }
});

// GET /api/kelas/:id
router.get('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const item = await prisma.kelas.findUnique({
      where: { id_kelas: id },
      include: {
        jurusan: true,
        siswa: {
          orderBy: { nama_siswa: 'asc' },
        },
        jadwal: {
          include: {
            guru: true,
            mataPelajaran: true,
          },
          orderBy: [
            { hari: 'asc' },
            { jam_mulai: 'asc' },
          ],
        },
      },
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Kelas tidak ditemukan.' });
      return;
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Detail kelas error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail kelas.' });
  }
});

// POST /api/kelas (Admin only)
router.post('/', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = kelasSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const created = await prisma.kelas.create({
      data: parsed.data,
      include: { jurusan: true },
    });

    res.status(201).json({ success: true, message: 'Kelas berhasil ditambahkan.', data: created });
  } catch (error) {
    console.error('Create kelas error:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan kelas.' });
  }
});

// PUT /api/kelas/:id (Admin only)
router.put('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const parsed = kelasSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const updated = await prisma.kelas.update({
      where: { id_kelas: id },
      data: parsed.data,
      include: { jurusan: true },
    });

    res.json({ success: true, message: 'Kelas berhasil diperbarui.', data: updated });
  } catch (error) {
    console.error('Update kelas error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui kelas.' });
  }
});

// DELETE /api/kelas/:id (Admin only)
router.delete('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    const studentCount = await prisma.siswa.count({
      where: { id_kelas: id },
    });

    if (studentCount > 0) {
      res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus kelas ini karena masih memiliki ${studentCount} siswa terdaftar.`,
      });
      return;
    }

    const scheduleCount = await prisma.jadwal.count({
      where: { id_kelas: id },
    });

    if (scheduleCount > 0) {
      res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus kelas ini karena masih memiliki ${scheduleCount} jadwal pelajaran.`,
      });
      return;
    }

    await prisma.kelas.delete({
      where: { id_kelas: id },
    });

    res.json({ success: true, message: 'Kelas berhasil dihapus.' });
  } catch (error) {
    console.error('Delete kelas error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus kelas.' });
  }
});

export default router;
