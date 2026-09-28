import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import {
  ArrowLeft,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
} from 'lucide-react';

export const GuruDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/guru/${id}`);
        setData(res);
      } catch (err: any) {
        showToast(err.message || 'Gagal mengambil detail guru.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Memuat profil guru..." />;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Data guru tidak ditemukan.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/admin/guru')}>
          Kembali ke Data Guru
        </Button>
      </div>
    );
  }

  const schedules = data.jadwal || [];
  const kelasYangDiajar = data.kelasYangDiajar || [];
  const mapelYangDiajar = data.mapelYangDiajar || [];

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/admin/guru')}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        className="text-muted-foreground"
      >
        Kembali ke Data Guru
      </Button>

      {/* Profile Header */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-2xl uppercase">
              {data.nama_guru?.charAt(0)}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{data.nama_guru}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                NIP: <span className="font-mono font-semibold text-foreground">{data.nip}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{kelasYangDiajar.length}</p>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold">Kelas Diajar</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{schedules.length}</p>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold">Total Sesi</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border text-xs">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Mail className="w-4 h-4 text-primary" />
            <div>
              <span className="text-muted-foreground/80 block">Email Guru</span>
              <span className="font-medium text-foreground">{data.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Phone className="w-4 h-4 text-primary" />
            <div>
              <span className="text-muted-foreground/80 block">Nomor Telepon / WhatsApp</span>
              <span className="font-mono font-medium text-foreground">{data.no_hp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Mata Pelajaran & Kelas yang Diajar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BookOpen className="w-4 h-4 text-primary" />
              Mata Pelajaran yang Diampu ({mapelYangDiajar.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mapelYangDiajar.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">Belum ada mata pelajaran.</p>
            ) : (
              mapelYangDiajar.map((m: any) => (
                <div
                  key={m.id_mapel}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20"
                >
                  <div>
                    <p className="font-semibold text-sm text-foreground">{m.nama_mapel}</p>
                    <span className="text-xs text-muted-foreground">{m.kelompok}</span>
                  </div>
                  <Badge variant="blue" size="sm">
                    {m.kode_mapel}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <GraduationCap className="w-4 h-4 text-primary" />
              Kelas yang Diajar ({kelasYangDiajar.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {kelasYangDiajar.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">Belum ada kelas.</p>
            ) : (
              kelasYangDiajar.map((k: any) => (
                <div
                  key={k.id_kelas}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20"
                >
                  <div>
                    <p className="font-semibold text-sm text-foreground">{k.nama_kelas}</p>
                    <span className="text-xs text-muted-foreground">{k.jurusan?.nama_jurusan}</span>
                  </div>
                  <Badge variant="gray" size="sm">
                    Tingkat {k.tingkat}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Teaching Schedules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Calendar className="w-4 h-4 text-primary" />
            Jadwal Mengajar ({schedules.length} Sesi)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Belum ada jadwal mengajar aktif.</p>
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
                    <h4 className="font-bold text-sm text-foreground">{sc.mataPelajaran?.nama_mapel}</h4>
                    <p className="text-xs text-muted-foreground">Kelas: {sc.kelas?.nama_kelas}</p>
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
