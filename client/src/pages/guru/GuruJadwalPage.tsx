import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Jadwal } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Calendar, Clock, MapPin, LayoutGrid, Table as TableIcon } from 'lucide-react';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const GuruJadwalPage: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Jadwal[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user?.id_guru) return;
      try {
        setIsLoading(true);
        const res = await api.get<Jadwal[]>(`/jadwal/guru/${user.id_guru}`);
        setSchedules(res);
      } catch (err: any) {
        showToast(err.message || 'Gagal memuat jadwal mengajar.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, [user]);

  const filtered = selectedDay ? schedules.filter((s) => s.hari === selectedDay) : schedules;

  const schedulesByDay = DAYS.reduce((acc, day) => {
    acc[day] = schedules.filter((s) => s.hari === day);
    return acc;
  }, {} as Record<string, Jadwal[]>);

  if (isLoading) {
    return <LoadingState message="Memuat jadwal mengajar Anda..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Jadwal Mengajar Saya</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Daftar penugasan kelas dan jam mengajar Anda
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-lg border border-border bg-card">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Harian</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Day Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedDay('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
            selectedDay === ''
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-card text-muted-foreground border-border hover:bg-muted'
          }`}
        >
          Semua Hari ({schedules.length})
        </button>
        {DAYS.map((day) => {
          const count = schedulesByDay[day]?.length || 0;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                selectedDay === day
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {day} ({count})
            </button>
          );
        })}
      </div>

      {/* Content */}
      {schedules.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-10 h-10 text-muted-foreground/60" />}
          title="Belum Ada Jadwal Mengajar"
          description="Anda belum memiliki sesi mengajar yang terdaftar dalam jadwal sekolah."
        />
      ) : viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DAYS.map((day) => {
            const dayList = schedulesByDay[day] || [];
            if (selectedDay && selectedDay !== day) return null;

            return (
              <Card key={day} className="overflow-hidden">
                <div className="p-3.5 bg-muted/40 border-b border-border flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{day}</span>
                  <Badge variant="blue" size="sm">
                    {dayList.length} Sesi
                  </Badge>
                </div>
                <CardContent className="p-3 space-y-2.5">
                  {dayList.length === 0 ? (
                    <div className="text-center py-8 text-xs text-muted-foreground">
                      Tidak ada jam mengajar di hari {day}.
                    </div>
                  ) : (
                    dayList.map((sc) => (
                      <div
                        key={sc.id_jadwal}
                        className="p-3 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-primary font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {sc.jam_mulai} – {sc.jam_selesai}
                          </span>
                          <Badge variant="gray" size="sm">
                            {sc.kelas?.nama_kelas}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{sc.mataPelajaran?.nama_mapel}</p>
                          <p className="text-xs text-muted-foreground">{sc.kelas?.jurusan?.nama_jurusan}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t border-border/60">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{sc.ruang}</span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Hari</TableHead>
              <TableHead className="w-32">Waktu</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Ruangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((sc) => (
              <TableRow key={sc.id_jadwal}>
                <TableCell className="font-semibold text-foreground">{sc.hari}</TableCell>
                <TableCell className="font-mono text-xs text-primary font-medium">
                  {sc.jam_mulai} – {sc.jam_selesai}
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {sc.mataPelajaran?.nama_mapel}
                </TableCell>
                <TableCell>
                  <Badge variant="blue" size="sm">
                    {sc.kelas?.nama_kelas}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-medium">
                  {sc.ruang}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
