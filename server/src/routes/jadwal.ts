import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../prisma.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { checkScheduleConflict } from '../utils/scheduleConflict.js';

const router = Router();

const jadwalSchema = z.object({
  id_guru: z.number().int().positive('Guru wajib dipilih'),
  id_kelas: z.number().int().positive('Kelas wajib dipilih'),
  id_mapel: z.number().int().positive('Mata pelajaran wajib dipilih'),
  hari: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'], {
    errorMap: () => ({ message: 'Hari harus antara Senin sampai Sabtu' }),
  }),
  jam_mulai: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format jam mulai harus HH:mm (contoh: 07:30)'),
  jam_selesai: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format jam selesai harus HH:mm (contoh: 09:00)'),
  ruang: z.string().min(1, 'Ruangan wajib diisi').max(50),
});

// GET /api/jadwal
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { hari, id_kelas, id_guru, id_mapel } = req.query;

    const where: any = {};
    if (hari) where.hari = String(hari);
    if (id_kelas) where.id_kelas = parseInt(String(id_kelas), 10);
    if (id_guru) where.id_guru = parseInt(String(id_guru), 10);
    if (id_mapel) where.id_mapel = parseInt(String(id_mapel), 10);

    const data = await prisma.jadwal.findMany({
      where,
      include: {
        guru: true,
        kelas: {
          include: { jurusan: true },
        },
        mataPelajaran: true,
      },
      orderBy: [
        { hari: 'asc' },
        { jam_mulai: 'asc' },
      ],
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Fetch jadwal error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data jadwal pelajaran.' });
  }
});

// GET /api/jadwal/guru/:id_guru
router.get('/guru/:id_guru', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const id_guru = parseInt(req.params.id_guru as string, 10);

    // If teacher role, verify accessing own schedule
    if (req.user?.role === Role.GURU && req.user.id_guru !== id_guru) {
      res.status(403).json({ success: false, message: 'Anda hanya dapat melihat jadwal Anda sendiri.' });
      return;
    }

    const data = await prisma.jadwal.findMany({
      where: { id_guru },
      include: {
        kelas: {
          include: { jurusan: true },
        },
        mataPelajaran: true,
      },
      orderBy: [
        { hari: 'asc' },
        { jam_mulai: 'asc' },
      ],
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Fetch jadwal guru error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil jadwal guru.' });
  }
});

// GET /api/jadwal/kelas/:id_kelas
router.get('/kelas/:id_kelas', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const id_kelas = parseInt(req.params.id_kelas as string, 10);

    const data = await prisma.jadwal.findMany({
      where: { id_kelas },
      include: {
        guru: true,
        mataPelajaran: true,
        kelas: {
          include: { jurusan: true },
        },
      },
      orderBy: [
        { hari: 'asc' },
        { jam_mulai: 'asc' },
      ],
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Fetch jadwal kelas error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil jadwal kelas.' });
  }
});

// POST /api/jadwal (Admin only)
router.post('/', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = jadwalSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    // Schedule conflict check!
    const conflict = await checkScheduleConflict(prisma, {
      id_guru: parsed.data.id_guru,
      id_kelas: parsed.data.id_kelas,
      hari: parsed.data.hari,
      jam_mulai: parsed.data.jam_mulai,
      jam_selesai: parsed.data.jam_selesai,
      ruang: parsed.data.ruang,
    });

    if (conflict.hasConflict) {
      res.status(409).json({
        success: false,
        message: conflict.message || 'Jadwal bertabrakan dengan jadwal lain yang sudah ada.',
      });
      return;
    }

    const created = await prisma.jadwal.create({
      data: parsed.data,
      include: {
        guru: true,
        kelas: {
          include: { jurusan: true },
        },
        mataPelajaran: true,
      },
    });

    res.status(201).json({ success: true, message: 'Jadwal berhasil ditambahkan.', data: created });
  } catch (error) {
    console.error('Create jadwal error:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan jadwal pelajaran.' });
  }
});

// PUT /api/jadwal/:id (Admin only)
router.put('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const parsed = jadwalSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    // Schedule conflict check excluding current record
    const conflict = await checkScheduleConflict(prisma, {
      id_jadwal: id,
      id_guru: parsed.data.id_guru,
      id_kelas: parsed.data.id_kelas,
      hari: parsed.data.hari,
      jam_mulai: parsed.data.jam_mulai,
      jam_selesai: parsed.data.jam_selesai,
      ruang: parsed.data.ruang,
    });

    if (conflict.hasConflict) {
      res.status(409).json({
        success: false,
        message: conflict.message || 'Jadwal bertabrakan dengan jadwal lain yang sudah ada.',
      });
      return;
    }

    const updated = await prisma.jadwal.update({
      where: { id_jadwal: id },
      data: parsed.data,
      include: {
        guru: true,
        kelas: {
          include: { jurusan: true },
        },
        mataPelajaran: true,
      },
    });

    res.json({ success: true, message: 'Jadwal berhasil diperbarui.', data: updated });
  } catch (error) {
    console.error('Update jadwal error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui jadwal pelajaran.' });
  }
});

// DELETE /api/jadwal/:id (Admin only)
router.delete('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    await prisma.jadwal.delete({
      where: { id_jadwal: id },
    });

    res.json({ success: true, message: 'Jadwal berhasil dihapus.' });
  } catch (error) {
    console.error('Delete jadwal error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus jadwal pelajaran.' });
  }
});

export default router;
