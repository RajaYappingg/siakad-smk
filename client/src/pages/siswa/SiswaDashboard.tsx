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
  Sparkles,
} from 'lucide-react';

export const SiswaDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/dashboard/siswa');
        setData(res);
      } catch (err) {
        console.error('Failed to load siswa dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <LoadingState message="Memuat dashboard siswa..." />;
  }

  const siswa = data?.siswa;
  const jadwalHariIni = data?.jadwalHariIni || [];
  const nilaiList = data?.nilai || [];
  const statistik = data?.statistik || {};

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <Badge variant="blue" className="bg-white/20 text-white border-white/30 text-xs">
            Periode: {data?.tahunAjaranAktif}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Halo, {siswa?.nama_siswa || user?.nama}!
          </h2>
          <p className="text-sm text-blue-100 max-w-xl">
            NIS: <span className="font-mono font-semibold">{siswa?.nis}</span> &bull; Kelas:{' '}
            <span className="font-semibold">{siswa?.kelas?.nama_kelas}</span> &bull;{' '}
            {siswa?.kelas?.jurusan?.nama_jurusan}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Rata-Rata Nilai</p>
              <h3 className="text-2xl font-bold text-primary">{statistik.rataRata || 0}</h3>
              <p className="text-[11px] text-muted-foreground">
                Predikat: <span className="font-semibold text-foreground">{statistik.predikat || '-'}</span> ({statistik.keterangan || '-'})
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Sparkles className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Mata Pelajaran Dinilai</p>
              <h3 className="text-2xl font-bold text-foreground">{statistik.totalMapelDinilai || 0} Mapel</h3>
              <p className="text-[11px] text-muted-foreground">Semester aktif</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Jadwal Hari Ini</p>
              <h3 className="text-2xl font-bold text-foreground">{jadwalHariIni.length} Pelajaran</h3>
              <p className="text-[11px] text-muted-foreground">Hari {data?.hariIni}</p>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
              <Calendar className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Jadwal Belajar Hari Ini ({data?.hariIni})
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mata pelajaran yang perlu Anda ikuti hari ini
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary"
                onClick={() => navigate('/siswa/jadwal')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Lihat Jadwal Lengkap
              </Button>
            </CardHeader>
            <CardContent>
              {jadwalHariIni.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Tidak ada jadwal pelajaran untuk kelas Anda pada hari {data?.hariIni}.
                </div>
              ) : (
                <div className="space-y-3">
                  {jadwalHariIni.map((sc: any) => (
                    <div
                      key={sc.id_jadwal}
                      className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-foreground">
                          {sc.mataPelajaran?.nama_mapel}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Guru Pengampu: {sc.guru?.nama_guru}
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

          {/* Recent Grades Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Ringkasan Nilai Terbaru
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nilai yang telah dipublikasikan oleh guru pengampu
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary"
                onClick={() => navigate('/siswa/nilai')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Lihat Raport Lengkap
              </Button>
            </CardHeader>
            <CardContent>
              {nilaiList.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  Belum ada nilai yang dipublikasikan pada semester aktif ini.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {nilaiList.map((g: any) => (
                    <div
                      key={g.id_nilai}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {g.mataPelajaran?.nama_mapel}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          Guru: {g.guru?.nama_guru}
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

        {/* Right Info Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Informasi Siswa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground">Nama Siswa:</span>
                <p className="font-semibold text-foreground text-sm mt-0.5">{siswa?.nama_siswa}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Nomor Induk Siswa (NIS):</span>
                <p className="font-mono font-semibold text-foreground mt-0.5">{siswa?.nis}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Kelas / Tingkat:</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {siswa?.kelas?.nama_kelas} (Tingkat {siswa?.kelas?.tingkat})
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Program Keahlian:</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {siswa?.kelas?.jurusan?.nama_jurusan}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Alamat Tinggal:</span>
                <p className="text-muted-foreground mt-0.5">{siswa?.alamat}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
