import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import jurusanRouter from './routes/jurusan.js';
import kelasRouter from './routes/kelas.js';
import siswaRouter from './routes/siswa.js';
import guruRouter from './routes/guru.js';
import mapelRouter from './routes/mapel.js';
import jadwalRouter from './routes/jadwal.js';
import tahunAjaranRouter from './routes/tahun-ajaran.js';
import nilaiRouter from './routes/nilai.js';
import dashboardRouter from './routes/dashboard.js';
import usersRouter from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger for development
if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SIAKAD SMK Backend API',
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/jurusan', jurusanRouter);
app.use('/api/kelas', kelasRouter);
app.use('/api/siswa', siswaRouter);
app.use('/api/guru', guruRouter);
app.use('/api/mapel', mapelRouter);
app.use('/api/jadwal', jadwalRouter);
app.use('/api/tahun-ajaran', tahunAjaranRouter);
app.use('/api/nilai', nilaiRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/users', usersRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal pada server.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SIAKAD Backend running on http://localhost:${PORT}`);
});
