import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import {
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  Calendar,
  CalendarDays,
  Layers,
  Award,
  ArrowRight,
  Clock,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/admin');
        setData(res);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <LoadingState message="Memuat data dashboard admin..." />;
  }

  const summary = data?.summary || {};
  const jadwalHariIni = data?.jadwalHariIni || [];
  const distribusiJurusan = data?.distribusiJurusan || [];
  const recentGrades = data?.aktivitasNilaiTerbaru || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <Badge variant="blue" className="bg-white/20 text-white border-white/30 text-xs">
            Tahun Ajaran: {summary.tahunAjaranAktif}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Selamat Datang di Panel Administrator
          </h2>
          <p className="text-sm text-blue-100 max-w-xl">
            Kelola data master, jadwal kegiatan belajar mengajar, serta rekapitulasi penilaian akademik siswa secara terpadu dan efisien.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Siswa</p>
              <h3 className="text-2xl font-bold text-foreground">{summary.totalSiswa}</h3>
              <p className="text-[11px] text-muted-foreground">Terdaftar di sistem</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Guru</p>
              <h3 className="text-2xl font-bold text-foreground">{summary.totalGuru}</h3>
              <p className="text-[11px] text-muted-foreground">Tenaga pendidik</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <UserCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Kelas</p>
              <h3 className="text-2xl font-bold text-foreground">{summary.totalKelas}</h3>
              <p className="text-[11px] text-muted-foreground">Rombongan belajar</p>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
              <GraduationCap className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mata Pelajaran</p>
              <h3 className="text-2xl font-bold text-foreground">{summary.totalMapel}</h3>
              <p className="text-[11px] text-muted-foreground">Kurikulum aktif</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <BookOpen className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedules */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Calendar className="w-4 h-4 text-primary" />
                  Jadwal Pelajaran Hari Ini ({data?.hariIni})
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Aktivitas belajar mengajar yang dijadwalkan berlangsung hari ini
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary"
                onClick={() => navigate('/admin/jadwal')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent>
              {jadwalHariIni.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Tidak ada jadwal pelajaran yang aktif untuk hari {data?.hariIni}.
                </div>
              ) : (
                <div className="space-y-3">
                  {jadwalHariIni.slice(0, 5).map((item: any) => (
                    <div
                      key={item.id_jadwal}
                      className="p-3.5 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">
                            {item.mataPelajaran?.nama_mapel}
                          </span>
                          <Badge variant="blue" size="sm">
                            {item.kelas?.nama_kelas}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Guru: {item.guru?.nama_guru}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {item.jam_mulai} - {item.jam_selesai}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                          {item.ruang}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Grade Input Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Award className="w-4 h-4 text-primary" />
                  Aktivitas Nilai Terbaru
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nilai yang baru saja diinput atau diperbarui oleh guru pengampu
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary"
                onClick={() => navigate('/admin/nilai')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Data Nilai
              </Button>
            </CardHeader>
            <CardContent>
              {recentGrades.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  Belum ada data nilai terbaru.
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
                          {g.mataPelajaran?.nama_mapel} &bull; Guru: {g.guru?.nama_guru}
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

        {/* Right Column: Major Distribution & Quick Actions */}
        <div className="space-y-6">
          {/* Distribution of Students per Major */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Layers className="w-4 h-4 text-primary" />
                Distribusi Siswa per Jurusan
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Persebaran siswa pada kompetensi keahlian
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {distribusiJurusan.map((j: any) => {
                const totalAll = summary.totalSiswa || 1;
                const percentage = Math.round((j.totalSiswa / totalAll) * 100);

                return (
                  <div key={j.id_jurusan} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{j.kode}</span>
                      <span className="text-muted-foreground font-medium">
                        {j.totalSiswa} siswa ({percentage}%)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{j.nama}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="bg-muted/30 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Aksi Cepat Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => navigate('/admin/siswa')}
                leftIcon={<Users className="w-4 h-4 text-primary" />}
              >
                Kelola Data Siswa
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => navigate('/admin/guru')}
                leftIcon={<UserCheck className="w-4 h-4 text-primary" />}
              >
                Kelola Data Guru
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => navigate('/admin/jadwal')}
                leftIcon={<Calendar className="w-4 h-4 text-primary" />}
              >
                Atur Jadwal Pelajaran
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => navigate('/admin/tahun-ajaran')}
                leftIcon={<CalendarDays className="w-4 h-4 text-primary" />}
              >
                Kelola Semester & Periode
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
