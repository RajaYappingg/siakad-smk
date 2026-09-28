/**
 * Centralized Grade Utilities
 * Formula required: nilai_akhir = (nilai_tugas * 30%) + (nilai_uts * 30%) + (nilai_uas * 40%)
 */

export const BOBOT = {
  TUGAS: 0.30,
  UTS: 0.30,
  UAS: 0.40,
};

export function hitungNilaiAkhir(tugas: number, uts: number, uas: number): number {
  const clamp = (val: number) => Math.min(100, Math.max(0, Number(val) || 0));
  const t = clamp(tugas);
  const m = clamp(uts);
  const a = clamp(uas);
  
  const hasil = (t * BOBOT.TUGAS) + (m * BOBOT.UTS) + (a * BOBOT.UAS);
  return Math.round(hasil * 100) / 100;
}

export function predikatNilai(nilaiAkhir: number): { predikat: string; keterangan: string; status: 'Lulus' | 'Remedial' } {
  if (nilaiAkhir >= 88) {
    return { predikat: 'A', keterangan: 'Sangat Baik', status: 'Lulus' };
  } else if (nilaiAkhir >= 78) {
    return { predikat: 'B', keterangan: 'Baik', status: 'Lulus' };
  } else if (nilaiAkhir >= 70) {
    return { predikat: 'C', keterangan: 'Cukup', status: 'Lulus' };
  } else {
    return { predikat: 'D', keterangan: 'Perlu Bimbingan', status: 'Remedial' };
  }
}
