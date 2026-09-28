import { PrismaClient } from '@prisma/client';

export interface ConflictCheckParams {
  id_jadwal?: number;
  id_guru: number;
  id_kelas: number;
  id_mapel?: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  ruang?: string;
}

export interface ConflictResult {
  hasConflict: boolean;
  message?: string;
}

function timeToMinutes(timeStr: string): number {
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

export function isTimeOverlapping(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);

  return aStart < bEnd && aEnd > bStart;
}

export async function checkScheduleConflict(
  prisma: PrismaClient,
  params: ConflictCheckParams
): Promise<ConflictResult> {
  const { id_jadwal, id_guru, id_kelas, hari, jam_mulai, jam_selesai, ruang } = params;

  // Validate start < end
  if (timeToMinutes(jam_mulai) >= timeToMinutes(jam_selesai)) {
    return {
      hasConflict: true,
      message: 'Jam mulai harus lebih awal daripada jam selesai.',
    };
  }

  // Find all schedules on the same day, excluding current one if editing
  const existingSchedules = await prisma.jadwal.findMany({
    where: {
      hari,
      ...(id_jadwal ? { id_jadwal: { not: id_jadwal } } : {}),
    },
    include: {
      guru: true,
      kelas: true,
      mataPelajaran: true,
    },
  });

  for (const item of existingSchedules) {
    if (isTimeOverlapping(jam_mulai, jam_selesai, item.jam_mulai, item.jam_selesai)) {
      // 1. Teacher Conflict
      if (item.id_guru === id_guru) {
        return {
          hasConflict: true,
          message: `Guru ${item.guru.nama_guru} sudah memiliki jadwal mengajar di kelas ${item.kelas.nama_kelas} pada hari ${hari} pukul ${item.jam_mulai}–${item.jam_selesai}.`,
        };
      }

      // 2. Class Conflict
      if (item.id_kelas === id_kelas) {
        return {
          hasConflict: true,
          message: `Kelas ${item.kelas.nama_kelas} sudah memiliki jadwal ${item.mataPelajaran.nama_mapel} pada hari ${hari} pukul ${item.jam_mulai}–${item.jam_selesai}.`,
        };
      }

      // 3. Room Conflict
      if (ruang && item.ruang && item.ruang.toLowerCase().trim() === ruang.toLowerCase().trim()) {
        return {
          hasConflict: true,
          message: `Ruang ${ruang} sedang digunakan oleh kelas ${item.kelas.nama_kelas} pada hari ${hari} pukul ${item.jam_mulai}–${item.jam_selesai}.`,
        };
      }
    }
  }

  return { hasConflict: false };
}
