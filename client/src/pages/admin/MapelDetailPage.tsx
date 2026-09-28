import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { ArrowLeft, BookOpen, UserCheck, Calendar, Clock, MapPin } from 'lucide-react';

export const MapelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/mapel/${id}`);
        setData(res);
      } catch (err: any) {
        showToast(err.message || 'Gagal mengambil detail mata pelajaran.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Memuat detail mata pelajaran..." />;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Mata pelajaran tidak ditemukan.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/admin/mapel')}>
          Kembali ke Data Mapel
        </Button>
      </div>
    );
  }

  const schedules = data.jadwal || [];
  const teachers = data.guruPengampu || [];

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/admin/mapel')}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        className="text-muted-foreground"
      >
        Kembali ke Data Mapel
      </Button>

      {/* Header */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-2xl uppercase">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{data.nama_mapel}</h2>
                <Badge variant="blue">{data.kode_mapel}</Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Kelompok Kurikulum: <span className="font-semibold text-foreground">{data.kelompok}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{teachers.length}</p>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold">Guru Pengampu</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{schedules.length}</p>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold">Total Sesi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Teachers List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <UserCheck className="w-4 h-4 text-primary" />
            Guru Pengampu Mata Pelajaran ({teachers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Belum ada guru yang ditugaskan pada jadwal mata pelajaran ini.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {teachers.map((g: any) => (
                <div
                  key={g.id_guru}
                  className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1"
                >
                  <p className="font-semibold text-sm text-foreground">{g.nama_guru}</p>
                  <p className="text-xs text-muted-foreground font-mono">NIP: {g.nip}</p>
                  <p className="text-xs text-muted-foreground">{g.email}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Calendar className="w-4 h-4 text-primary" />
            Jadwal Mengajar Mapel Ini ({schedules.length} Sesi)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Belum ada jadwal untuk mata pelajaran ini.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {schedules.map((sc: any) => (
                <div
                  key={sc.id_jadwal}
                  className="p-3.5 rounded-xl border border-border bg-card space-y-2 hover:border-primary/40 transition-colors"
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
                    <h4 className="font-bold text-sm text-foreground">Kelas: {sc.kelas?.nama_kelas}</h4>
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
    </div>
  );
};
