import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'siakad_secret_key_default';

export interface AuthUserPayload {
  id: number;
  email: string;
  role: Role;
  nama: string;
  id_guru?: number | null;
  nis?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Akses ditolak: Token autentikasi tidak ditemukan.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Sesi telah kedaluwarsa atau tidak valid. Silakan login kembali.' });
  }
}

export function authorize(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Belum terautentikasi.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Akses ditolak: Anda tidak memiliki izin untuk melakukan aksi ini.',
      });
      return;
    }

    next();
  };
}
