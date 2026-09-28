import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { ArrowLeft, User, Calendar, Award, Clock, MapPin, MapPinned, Cake } from 'lucide-react';

export const SiswaDetailPage: React.FC = () => {
  const { nis } = useParams<{ nis: string }>();
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'nilai' | 'jadwal'>('nilai');
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/siswa/${nis}`);
        setStudent(res);
      } catch (err: any) {
        showToast(err.message || 'Gagal mengambil data detail siswa.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudent();
  }, [nis]);

  if (isLoading) {
    return <LoadingState message="Memuat profil siswa..." />;
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Data siswa tidak ditemukan.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/admin/siswa')}>
          Kembali ke Data Siswa
        </Button>
      </div>
    );
  }

  const birthFormatted = student.tanggal_lahir
    ? new Date(student.tanggal_lahir).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-';

  const grades = student.nilai || [];
  const schedules = student.kelas?.jadwal || [];

  const averageGrade =
    grades.length > 0
      ? Math.round((grades.reduce((sum: number, g: any) => sum + g.nilai_akhir, 0) / grades.length) * 100) / 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/admin/siswa')}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        className="text-muted-foreground"
      >
        Kembali ke Data Siswa
      </Button>

      {/* Student Profile Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-primary flex items-center justify-center font-bold text-2xl uppercase">
              {student.nama_siswa?.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{student.nama_siswa}</h2>
                <Badge variant={student.jenis_kelamin === 'L' ? 'blue' : 'rose'}>
                  {student.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                NIS: <span className="font-mono font-semibold text-foreground">{student.nis}</span> &bull; Kelas:{' '}
                <span className="font-semibold text-foreground">{student.kelas?.nama_kelas}</span> (
                {student.kelas?.jurusan?.nama_jurusan})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{averageGrade}</p>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold">Rata-Rata Nilai</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{grades.length}</p>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold">Mata Pelajaran</p>
            </div>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border text-xs">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Cake className="w-4 h-4 text-primary" />
            <div>
              <span className="text-muted-foreground/80 block">Tanggal Lahir</span>
              <span className="font-medium text-foreground">{birthFormatted}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-muted-foreground">
            <MapPinned className="w-4 h-4 text-primary" />
            <div>
              <span className="text-muted-foreground/80 block">Alamat</span>
              <span className="font-medium text-foreground">{student.alamat}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-muted-foreground">
            <User className="w-4 h-4 text-primary" />
            <div>
              <span className="text-muted-foreground/80 block">Program Keahlian</span>
              <span className="font-medium text-foreground">{student.kelas?.jurusan?.nama_jurusan}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('nilai')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'nilai'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Rekapitulasi Nilai ({grades.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('jadwal')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'jadwal'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal Kelas ({schedules.length})</span>
        </button>
      </div>

      {/* Tab 1: Nilai */}
      {activeTab === 'nilai' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Daftar Nilai Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            {grades.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Belum ada data nilai yang terinput untuk siswa ini.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead>Guru Pengampu</TableHead>
                    <TableHead className="w-20 text-center">Tugas (30%)</TableHead>
                    <TableHead className="w-20 text-center">UTS (30%)</TableHead>
                    <TableHead className="w-20 text-center">UAS (40%)</TableHead>
                    <TableHead className="w-24 text-center">Nilai Akhir</TableHead>
                    <TableHead className="w-24 text-center">Predikat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((g: any) => (
                    <TableRow key={g.id_nilai}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-foreground">{g.mataPelajaran?.nama_mapel}</p>
                          <span className="text-[11px] text-muted-foreground">{g.mataPelajaran?.kelompok}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {g.guru?.nama_guru}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs">{g.nilai_tugas}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{g.nilai_uts}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{g.nilai_uas}</TableCell>
                      <TableCell className="text-center font-mono font-bold text-sm text-primary">
                        {g.nilai_akhir}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={g.nilai_akhir >= 85 ? 'emerald' : g.nilai_akhir >= 75 ? 'blue' : 'amber'}
                          size="sm"
                        >
                          {g.nilai_akhir >= 85 ? 'A' : g.nilai_akhir >= 75 ? 'B' : g.nilai_akhir >= 65 ? 'C' : 'D'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Jadwal */}
      {activeTab === 'jadwal' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Jadwal Pelajaran Kelas {student.kelas?.nama_kelas}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {schedules.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Belum ada jadwal yang terdaftar untuk kelas ini.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {schedules.map((sc: any) => (
                  <div
                    key={sc.id_jadwal}
                    className="p-4 rounded-xl border border-border bg-card space-y-2 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="blue" size="sm">
                        {sc.hari}
                      </Badge>
                      <span className="text-xs font-mono flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {sc.jam_mulai} - {sc.jam_selesai}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{sc.mataPelajaran?.nama_mapel}</h4>
                      <p className="text-xs text-muted-foreground">Guru: {sc.guru?.nama_guru}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t border-border/60">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{sc.ruang}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
