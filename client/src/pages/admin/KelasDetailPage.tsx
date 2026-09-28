import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { ArrowLeft, Users, Calendar, Clock, MapPin, GraduationCap } from 'lucide-react';

export const KelasDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'siswa' | 'jadwal'>('siswa');
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/kelas/${id}`);
        setData(res);
      } catch (err: any) {
        showToast(err.message || 'Gagal mengambil detail kelas.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Memuat detail kelas..." />;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Kelas tidak ditemukan.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/admin/kelas')}>
          Kembali ke Daftar Kelas
        </Button>
      </div>
    );
  }

  const siswaList = data.siswa || [];
  const jadwalList = data.jadwal || [];

  return (
    <div className="space-y-6">
      {/* Back Button and Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/kelas')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mb-3 text-muted-foreground"
        >
          Kembali ke Data Kelas
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">{data.nama_kelas}</h2>
                <Badge variant="blue">Tingkat {data.tingkat}</Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Jurusan: <span className="font-semibold text-foreground">{data.jurusan?.nama_jurusan}</span> ({data.jurusan?.kode_jurusan})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
            <div className="text-center px-3">
              <p className="text-xl font-bold text-foreground">{siswaList.length}</p>
              <p className="text-[11px] text-muted-foreground uppercase font-medium">Siswa</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center px-3">
              <p className="text-xl font-bold text-foreground">{jadwalList.length}</p>
              <p className="text-[11px] text-muted-foreground uppercase font-medium">Jadwal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('siswa')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'siswa'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Siswa ({siswaList.length})</span>
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
          <span>Jadwal Pelajaran ({jadwalList.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'siswa' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Siswa Terdaftar di {data.nama_kelas}</CardTitle>
          </CardHeader>
          <CardContent>
            {siswaList.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Belum ada siswa yang ditempatkan di kelas ini.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">NIS</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead className="w-28 text-center">L/P</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead className="w-24 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {siswaList.map((s: any) => (
                    <TableRow key={s.nis}>
                      <TableCell className="font-mono text-xs">{s.nis}</TableCell>
                      <TableCell className="font-semibold text-foreground">{s.nama_siswa}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={s.jenis_kelamin === 'L' ? 'blue' : 'rose'} size="sm">
                          {s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-xs">{s.alamat}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/siswa/${s.nis}`)}
                          className="text-xs"
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'jadwal' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Jadwal Pelajaran Kelas {data.nama_kelas}</CardTitle>
          </CardHeader>
          <CardContent>
            {jadwalList.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Belum ada jadwal pelajaran untuk kelas ini.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {jadwalList.map((j: any) => (
                  <div
                    key={j.id_jadwal}
                    className="p-4 rounded-xl border border-border bg-card space-y-2 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="blue" size="sm">
                        {j.hari}
                      </Badge>
                      <span className="text-xs font-mono font-medium flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {j.jam_mulai} - {j.jam_selesai}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-foreground">{j.mataPelajaran?.nama_mapel}</h4>
                      <p className="text-xs text-muted-foreground">Guru: {j.guru?.nama_guru}</p>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t border-border/60">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{j.ruang}</span>
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
