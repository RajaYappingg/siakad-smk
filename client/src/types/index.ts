export type Role = 'ADMIN' | 'GURU' | 'SISWA';

export interface User {
  id: number;
  email: string;
  role: Role;
  nama: string;
  id_guru?: number | null;
  nis?: string | null;
  guru?: Guru | null;
  siswa?: Siswa | null;
}

export interface Jurusan {
  id_jurusan: number;
  kode_jurusan: string;
  nama_jurusan: string;
  _count?: {
    kelas?: number;
  };
  kelas?: Kelas[];
}

export interface Kelas {
  id_kelas: number;
  id_jurusan: number;
  tingkat: string;
  nama_kelas: string;
  jurusan?: Jurusan;
  _count?: {
    siswa?: number;
    jadwal?: number;
  };
  siswa?: Siswa[];
  jadwal?: Jadwal[];
}

export interface Siswa {
  nis: string;
  id_kelas: number;
  nama_siswa: string;
  jenis_kelamin: 'L' | 'P';
  tanggal_lahir: string;
  alamat: string;
  kelas?: Kelas;
  nilai?: Nilai[];
}

export interface Guru {
  id_guru: number;
  nip: string;
  nama_guru: string;
  email: string;
  no_hp: string;
  _count?: {
    jadwal?: number;
    nilai?: number;
  };
  jadwal?: Jadwal[];
  kelasYangDiajar?: Kelas[];
  mapelYangDiajar?: MataPelajaran[];
}

export interface MataPelajaran {
  id_mapel: number;
  kode_mapel: string;
  nama_mapel: string;
  kelompok: string;
  _count?: {
    jadwal?: number;
    nilai?: number;
  };
  jadwal?: Jadwal[];
  guruPengampu?: Guru[];
}

export interface Jadwal {
  id_jadwal: number;
  id_guru: number;
  id_kelas: number;
  id_mapel: number;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jam_mulai: string;
  jam_selesai: string;
  ruang: string;
  guru: Guru;
  kelas: Kelas;
  mataPelajaran: MataPelajaran;
}

export interface TahunAjaran {
  id_tahun_ajaran: number;
  tahun_ajaran: string;
  semester: 'Ganjil' | 'Genap';
  status: 'Aktif' | 'Tidak Aktif';
}

export interface Nilai {
  id_nilai: number;
  nis: string;
  id_tahun_ajaran: number;
  id_guru: number;
  id_mapel: number;
  nilai_tugas: number;
  nilai_uts: number;
  nilai_uas: number;
  nilai_akhir: number;
  predikat: string;
  keterangan: string;
  status: 'Lulus' | 'Remedial';
  siswa?: Siswa;
  mataPelajaran?: MataPelajaran;
  guru?: Guru;
  tahunAjaran?: TahunAjaran;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}
