import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../prisma.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = Router();

const createUserSchema = z.object({
  email: z.string().email('Format email tidak valid').max(100),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  role: z.enum(['ADMIN', 'GURU', 'SISWA']),
  nama: z.string().min(1, 'Nama lengkap wajib diisi').max(100),
  id_guru: z.number().int().optional().nullable(),
  nis: z.string().optional().nullable(),
});

const updateUserSchema = z.object({
  email: z.string().email('Format email tidak valid').max(100),
  password: z.string().min(6).optional().nullable(),
  role: z.enum(['ADMIN', 'GURU', 'SISWA']),
  nama: z.string().min(1, 'Nama lengkap wajib diisi').max(100),
  id_guru: z.number().int().optional().nullable(),
  nis: z.string().optional().nullable(),
});

// GET /api/users (Admin only)
router.get('/', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, role } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: String(search) } },
        { nama: { contains: String(search) } },
      ];
    }
    if (role) {
      where.role = role as Role;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        nama: true,
        id_guru: true,
        nis: true,
        createdAt: true,
        guru: {
          select: { id_guru: true, nip: true, nama_guru: true },
        },
        siswa: {
          select: { nis: true, nama_siswa: true, kelas: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data akun pengguna.' });
  }
});

// POST /api/users (Admin only)
router.post('/', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      res.status(400).json({ success: false, message: `Email ${parsed.data.email} sudah digunakan.` });
      return;
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    const created = await prisma.user.create({
      data: {
        email: parsed.data.email,
        password: hashedPassword,
        role: parsed.data.role,
        nama: parsed.data.nama,
        id_guru: parsed.data.id_guru || null,
        nis: parsed.data.nis || null,
      },
      select: {
        id: true,
        email: true,
        role: true,
        nama: true,
        id_guru: true,
        nis: true,
        createdAt: true,
      },
    });

    res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan.', data: created });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat akun pengguna.' });
  }
});

// PUT /api/users/:id (Admin only)
router.put('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const dup = await prisma.user.findFirst({
      where: {
        email: parsed.data.email,
        NOT: { id },
      },
    });

    if (dup) {
      res.status(400).json({ success: false, message: `Email ${parsed.data.email} sudah digunakan oleh akun lain.` });
      return;
    }

    const updateData: any = {
      email: parsed.data.email,
      role: parsed.data.role,
      nama: parsed.data.nama,
      id_guru: parsed.data.id_guru || null,
      nis: parsed.data.nis || null,
    };

    if (parsed.data.password && parsed.data.password.trim() !== '') {
      updateData.password = await bcrypt.hash(parsed.data.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        nama: true,
        id_guru: true,
        nis: true,
      },
    });

    res.json({ success: true, message: 'Pengguna berhasil diperbarui.', data: updated });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui akun pengguna.' });
  }
});

// DELETE /api/users/:id (Admin only)
router.delete('/:id', authenticateToken, authorize([Role.ADMIN]), async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);

    if (req.user?.id === id) {
      res.status(400).json({ success: false, message: 'Anda tidak dapat menghapus akun Anda sendiri saat sedang aktif.' });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Pengguna berhasil dihapus.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus akun pengguna.' });
  }
});

export default router;
