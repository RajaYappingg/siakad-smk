import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Award,
  ArrowRight,
  Plus,
} from 'lucide-react';

export const GuruDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/dashboard/guru');
        setData(res);
      } catch (err) {
        console.error('Failed to load guru dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <LoadingState message="Memuat dashboard guru..." />;
  }

  const guru = data?.guru;
  const jadwalHariIni = data?.jadwalHariIni || [];
  const kelasDiajar = data?.kelasDiajar || [];
  const recentGrades = data?.aktivitasNilaiTerbaru || [];

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <Badge variant="blue" className="bg-white/20 text-white border-white/30 text-xs">
            Periode Aktif: {data?.tahunAjaranAktif}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Selamat Datang, {guru?.nama_guru || user?.nama}!
          </h2>
          <p className="text-sm text-blue-100 max-w-xl">
            NIP: {guru?.nip} &bull; Kelola kegiatan belajar mengajar, pantau jadwal harian, dan input nilai akademik siswa dengan cepat dan akurat.
          </p>
          <div className="pt-2">
            <Button
              size="sm"
              className="bg-white text-blue-700 hover:bg-white/90 font-semibold"
              onClick={() => navigate('/guru/nilai')}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Input Nilai Siswa Sekarang
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Jadwal Hari Ini</p>
              <h3 className="text-2xl font-bold text-foreground">{jadwalHariIni.length} Sesi</h3>
              <p className="text-[11px] text-muted-foreground">Hari {data?.hariIni}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Calendar className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Kelas yang Diampu</p>
              <h3 className="text-2xl font-bold text-foreground">{data?.totalKelasDiajar ?? 0} Kelas</h3>
              <p className="text-[11px] text-muted-foreground">Rombel aktif</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <GraduationCap className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Total Jadwal Mengajar</p>
              <h3 className="text-2xl font-bold text-foreground">{data?.totalJadwalMengajar ?? 0} Sesi</h3>
              <p className="text-[11px] text-muted-foreground">Seminggu</p>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Today's Schedule & Classes Taught */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Jadwal Mengajar Hari Ini ({data?.hariIni})
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sesi pelajaran Anda yang terjadwal hari ini
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary"
                onClick={() => navigate('/guru/jadwal')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Lihat Jadwal Lengkap
              </Button>
            </CardHeader>
            <CardContent>
              {jadwalHariIni.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Tidak ada jadwal mengajar untuk Anda pada hari {data?.hariIni}.
                </div>
              ) : (
                <div className="space-y-3">
                  {jadwalHariIni.map((sc: any) => (
                    <div
                      key={sc.id_jadwal}
                      className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {sc.mataPelajaran?.nama_mapel}
                          </span>
                          <Badge variant="blue" size="sm">
                            {sc.kelas?.nama_kelas}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Jurusan: {sc.kelas?.jurusan?.nama_jurusan}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-mono flex items-center gap-1 text-primary font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          {sc.jam_mulai} – {sc.jam_selesai}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {sc.ruang}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Grade Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Aktivitas Penilaian Terakhir
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daftar nilai siswa yang baru saja Anda input atau perbarui
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary"
                onClick={() => navigate('/guru/nilai')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Kelola Nilai
              </Button>
            </CardHeader>
            <CardContent>
              {recentGrades.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  Belum ada catatan nilai yang Anda inputkan.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentGrades.map((g: any) => (
                    <div
                      key={g.id_nilai}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {g.siswa?.nama_siswa} ({g.siswa?.kelas?.nama_kelas})
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          Mapel: {g.mataPelajaran?.nama_mapel}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-sm text-primary">{g.nilai_akhir}</span>
                        <Badge
                          variant={g.predikat === 'A' ? 'emerald' : g.predikat === 'B' ? 'blue' : 'amber'}
                          size="sm"
                        >
                          {g.predikat}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Classes Taught Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Kelas yang Diajar
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Daftar rombongan belajar tempat Anda mengajar
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {kelasDiajar.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Belum ada kelas.</p>
              ) : (
                kelasDiajar.map((k: any) => (
                  <div
                    key={k.id_kelas}
                    className="p-3 rounded-lg border border-border bg-muted/20 hover:border-primary/40 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-sm text-foreground">{k.nama_kelas}</p>
                      <p className="text-xs text-muted-foreground">{k.jurusan?.kode_jurusan}</p>
                    </div>
                    <Badge variant="blue" size="sm">
                      {k._count?.siswa ?? 0} Siswa
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
