import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../prisma.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = Router();

const siswaSchema = z.object({
  nis: z.string().min(1, 'NIS wajib diisi').max(20),
  id_kelas: z.number().int().positive('Kelas wajib dipilih'),
  nama_siswa: z.string().min(1, 'Nama siswa wajib diisi').max(100),
  jenis_kelamin: z.enum(['L', 'P'], { errorMap: () => ({ message: 'Jenis kelamin harus L atau P' }) }),
  tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
});

// GET /api/siswa
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, id_kelas, id_jurusan, jenis_kelamin } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { nis: { contains: String(search) } },
        { nama_siswa: { contains: String(search) } },
      ];
    }
    if (id_kelas) {
      where.id_kelas = parseInt(String(id_kelas), 10);
    }
    if (id_jurusan) {
      where.kelas = { id_jurusan: parseInt(String(id_jurusan), 10) };
    }
    if (jenis_kelamin) {
      where.jenis_kelamin = String(jenis_kelamin);
    }

    const data = await prisma.siswa.findMany({
      where,
      include: {
        kelas: {
          include: {
            jurusan: true,
          },
        },
      },
      orderBy: [
        { id_kelas: 'asc' },
        { nama_siswa: 'asc' },
      ],
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Fetch siswa error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data siswa.' });
  }
});

// GET /api/siswa/:nis
router.get('/:nis', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const nis = String(req.params.nis);

    // Student authorization check: student can only view their own profile
    if (req.user?.role === Role.SISWA && req.user.nis !== nis) {
      res.status(403).json({ success: false, message: 'Anda hanya dapat melihat data profil Anda sendiri.' });
      return;
    }

    const student = await prisma.siswa.findUnique({
      where: { nis },
      include: {
        kelas: {
          include: {
            jurusan: true,
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
        },
        nilai: {
          include: {
            mataPelajaran: true,
            guru: true,
            tahunAjaran: true,
          },
          orderBy: { id_tahun_ajaran: 'desc' },
        },
      },
    });

    if (!student) {
      res.status(404).json({ success: false, message: 'Data siswa tidak ditemukan.' });
      return;
    }

    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Detail siswa error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data siswa.' });
  }
});

// POST /api/siswa (Admin only)
router.post('/', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = siswaSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const existing = await prisma.siswa.findUnique({
      where: { nis: parsed.data.nis },
    });

    if (existing) {
      res.status(400).json({ success: false, message: `Siswa dengan NIS ${parsed.data.nis} sudah terdaftar.` });
      return;
    }

    const created = await prisma.siswa.create({
      data: {
        ...parsed.data,
        tanggal_lahir: new Date(parsed.data.tanggal_lahir),
      },
      include: {
        kelas: {
          include: {
            jurusan: true,
          },
        },
      },
    });

    res.status(201).json({ success: true, message: 'Data siswa berhasil ditambahkan.', data: created });
  } catch (error) {
    console.error('Create siswa error:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan data siswa.' });
  }
});

// PUT /api/siswa/:nis (Admin only)
router.put('/:nis', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const targetNis = String(req.params.nis);
    const parsed = siswaSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    // If changing NIS, check duplicate
    if (parsed.data.nis !== targetNis) {
      const duplicate = await prisma.siswa.findUnique({
        where: { nis: parsed.data.nis },
      });
      if (duplicate) {
        res.status(400).json({ success: false, message: `NIS ${parsed.data.nis} sudah digunakan oleh siswa lain.` });
        return;
      }
    }

    const updated = await prisma.siswa.update({
      where: { nis: targetNis },
      data: {
        ...parsed.data,
        tanggal_lahir: new Date(parsed.data.tanggal_lahir),
      },
      include: {
        kelas: {
          include: {
            jurusan: true,
          },
        },
      },
    });

    res.json({ success: true, message: 'Data siswa berhasil diperbarui.', data: updated });
  } catch (error) {
    console.error('Update siswa error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui data siswa.' });
  }
});

// DELETE /api/siswa/:nis (Admin only)
router.delete('/:nis', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const nis = String(req.params.nis);

    await prisma.siswa.delete({
      where: { nis },
    });

    res.json({ success: true, message: 'Data siswa berhasil dihapus.' });
  } catch (error) {
    console.error('Delete siswa error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus data siswa.' });
  }
});

export default router;
