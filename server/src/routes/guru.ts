import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../prisma.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = Router();

const guruSchema = z.object({
  nip: z.string().min(1, 'NIP wajib diisi').max(30),
  nama_guru: z.string().min(1, 'Nama guru wajib diisi').max(100),
  email: z.string().email('Email tidak valid').max(100),
  no_hp: z.string().min(1, 'Nomor HP wajib diisi').max(20),
});

// GET /api/guru
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { nip: { contains: String(search) } },
        { nama_guru: { contains: String(search) } },
        { email: { contains: String(search) } },
      ];
    }

    const data = await prisma.guru.findMany({
      where,
      include: {
        _count: {
          select: { jadwal: true, nilai: true },
        },
      },
      orderBy: { nama_guru: 'asc' },
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Fetch guru error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data guru.' });
  }
});

// GET /api/guru/:id
router.get('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    const guru = await prisma.guru.findUnique({
      where: { id_guru: id },
      include: {
        jadwal: {
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
        },
      },
    });

    if (!guru) {
      res.status(404).json({ success: false, message: 'Data guru tidak ditemukan.' });
      return;
    }

    // Extract unique classes and subjects taught
    const classesMap = new Map<number, any>();
    const subjectsMap = new Map<number, any>();

    guru.jadwal.forEach((j) => {
      classesMap.set(j.kelas.id_kelas, j.kelas);
      subjectsMap.set(j.mataPelajaran.id_mapel, j.mataPelajaran);
    });

    res.json({
      success: true,
      data: {
        ...guru,
        kelasYangDiajar: Array.from(classesMap.values()),
        mapelYangDiajar: Array.from(subjectsMap.values()),
      },
    });
  } catch (error) {
    console.error('Detail guru error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail guru.' });
  }
});

// POST /api/guru (Admin only)
router.post('/', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = guruSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    // Check duplicate NIP or Email
    const existingNip = await prisma.guru.findUnique({ where: { nip: parsed.data.nip } });
    if (existingNip) {
      res.status(400).json({ success: false, message: `Guru dengan NIP ${parsed.data.nip} sudah terdaftar.` });
      return;
    }

    const existingEmail = await prisma.guru.findUnique({ where: { email: parsed.data.email } });
    if (existingEmail) {
      res.status(400).json({ success: false, message: `Email ${parsed.data.email} sudah terdaftar.` });
      return;
    }

    const created = await prisma.guru.create({
      data: parsed.data,
    });

    res.status(201).json({ success: true, message: 'Data guru berhasil ditambahkan.', data: created });
  } catch (error) {
    console.error('Create guru error:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan data guru.' });
  }
});

// PUT /api/guru/:id (Admin only)
router.put('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const parsed = guruSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const dupNip = await prisma.guru.findFirst({
      where: {
        nip: parsed.data.nip,
        NOT: { id_guru: id },
      },
    });
    if (dupNip) {
      res.status(400).json({ success: false, message: `NIP ${parsed.data.nip} sudah digunakan oleh guru lain.` });
      return;
    }

    const dupEmail = await prisma.guru.findFirst({
      where: {
        email: parsed.data.email,
        NOT: { id_guru: id },
      },
    });
    if (dupEmail) {
      res.status(400).json({ success: false, message: `Email ${parsed.data.email} sudah digunakan oleh guru lain.` });
      return;
    }

    const updated = await prisma.guru.update({
      where: { id_guru: id },
      data: parsed.data,
    });

    // Also update User profile if linked
    await prisma.user.updateMany({
      where: { id_guru: id },
      data: {
        nama: parsed.data.nama_guru,
        email: parsed.data.email,
      },
    });

    res.json({ success: true, message: 'Data guru berhasil diperbarui.', data: updated });
  } catch (error) {
    console.error('Update guru error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui data guru.' });
  }
});

// DELETE /api/guru/:id (Admin only)
router.delete('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    const scheduleCount = await prisma.jadwal.count({
      where: { id_guru: id },
    });
    if (scheduleCount > 0) {
      res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus guru ini karena masih memiliki ${scheduleCount} jadwal mengajar aktif.`,
      });
      return;
    }

    const gradeCount = await prisma.nilai.count({
      where: { id_guru: id },
    });
    if (gradeCount > 0) {
      res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus guru ini karena telah menginputkan ${gradeCount} nilai siswa.`,
      });
      return;
    }

    await prisma.guru.delete({
      where: { id_guru: id },
    });

    res.json({ success: true, message: 'Data guru berhasil dihapus.' });
  } catch (error) {
    console.error('Delete guru error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus data guru.' });
  }
});

export default router;
