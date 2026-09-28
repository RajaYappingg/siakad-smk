import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'siakad_secret_key_default';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email, NIP, atau NIS wajib diisi'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message,
      });
      return;
    }

    const { identifier, password } = parseResult.data;
    const cleanId = identifier.trim();

    // Find user by email, or check if identifier is NIP (guru) or NIS (siswa)
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanId },
          { nis: cleanId },
          { guru: { nip: cleanId } },
        ],
      },
      include: {
        guru: true,
        siswa: {
          include: {
            kelas: {
              include: {
                jurusan: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan atau kredensial salah.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Kata sandi yang Anda masukkan salah.',
      });
      return;
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      nama: user.nama,
      id_guru: user.id_guru,
      nis: user.nis,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    res.json({
      success: true,
      message: 'Login berhasil!',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          nama: user.nama,
          id_guru: user.id_guru,
          nis: user.nis,
          guru: user.guru,
          siswa: user.siswa,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server saat login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        guru: true,
        siswa: {
          include: {
            kelas: {
              include: {
                jurusan: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'Data pengguna tidak ditemukan.' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        nama: user.nama,
        id_guru: user.id_guru,
        nis: user.nis,
        guru: user.guru,
        siswa: user.siswa,
      },
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data profil pengguna.' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { password_lama, password_baru } = req.body;

    if (!password_lama || !password_baru) {
      res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi.' });
      return;
    }

    if (password_baru.length < 6) {
      res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      return;
    }

    const isMatch = await bcrypt.compare(password_lama, user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Password lama Anda tidak sesuai.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password_baru, 10);
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: 'Kata sandi berhasil diperbarui.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah kata sandi.' });
  }
});

export default router;
