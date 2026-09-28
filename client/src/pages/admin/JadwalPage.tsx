import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Jadwal, Guru, Kelas, MataPelajaran } from '../../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

export const JadwalPage: React.FC = () => {
  const [data, setData] = useState<Jadwal[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [mapelList, setMapelList] = useState<MataPelajaran[]>([]);

  // View mode: 'list' (Table) or 'calendar' (Timetable Grid)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Filters
  const [filterHari, setFilterHari] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterGuru, setFilterGuru] = useState('');
  const [filterMapel, setFilterMapel] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Jadwal | null>(null);
  const [formData, setFormData] = useState({
    id_guru: '',
    id_kelas: '',
    id_mapel: '',
    hari: 'Senin',
    jam_mulai: '07:30',
    jam_selesai: '09:00',
    ruang: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete
  const [deletingItem, setDeletingItem] = useState<Jadwal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [schedules, teachers, classes, subjects] = await Promise.all([
        api.get<Jadwal[]>('/jadwal', {
          hari: filterHari,
          id_kelas: filterKelas,
          id_guru: filterGuru,
          id_mapel: filterMapel,
        }),
        api.get<Guru[]>('/guru'),
        api.get<Kelas[]>('/kelas'),
        api.get<MataPelajaran[]>('/mapel'),
      ]);

      setData(schedules);
      setGuruList(teachers);
      setKelasList(classes);
      setMapelList(subjects);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat jadwal pelajaran.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterHari, filterKelas, filterGuru, filterMapel]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormError(null);
    setFormData({
      id_guru: guruList[0]?.id_guru ? String(guruList[0].id_guru) : '',
      id_kelas: kelasList[0]?.id_kelas ? String(kelasList[0].id_kelas) : '',
      id_mapel: mapelList[0]?.id_mapel ? String(mapelList[0].id_mapel) : '',
      hari: 'Senin',
      jam_mulai: '07:30',
      jam_selesai: '09:00',
      ruang: 'Lab Komputer 1',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Jadwal) => {
    setEditingItem(item);
    setFormError(null);
    setFormData({
      id_guru: String(item.id_guru),
      id_kelas: String(item.id_kelas),
      id_mapel: String(item.id_mapel),
      hari: item.hari,
      jam_mulai: item.jam_mulai,
      jam_selesai: item.jam_selesai,
      ruang: item.ruang,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (
      !formData.id_guru ||
      !formData.id_kelas ||
      !formData.id_mapel ||
      !formData.hari ||
      !formData.jam_mulai ||
      !formData.jam_selesai ||
      !formData.ruang
    ) {
      setFormError('Seluruh kolom jadwal wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id_guru: parseInt(formData.id_guru, 10),
        id_kelas: parseInt(formData.id_kelas, 10),
        id_mapel: parseInt(formData.id_mapel, 10),
        hari: formData.hari,
        jam_mulai: formData.jam_mulai,
        jam_selesai: formData.jam_selesai,
        ruang: formData.ruang.trim(),
      };

      if (editingItem) {
        await api.put(`/jadwal/${editingItem.id_jadwal}`, payload);
        showToast('Jadwal pelajaran berhasil diperbarui.', 'success');
      } else {
        await api.post('/jadwal', payload);
        showToast('Jadwal pelajaran berhasil ditambahkan.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      // Show clean Indonesian conflict message in modal & toast
      const msg = err.message || 'Gagal menyimpan jadwal pelajaran.';
      setFormError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await api.delete(`/jadwal/${deletingItem.id_jadwal}`);
      showToast('Jadwal pelajaran berhasil dihapus.', 'success');
      setDeletingItem(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus jadwal pelajaran.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Group schedules by Day for Timetable view
  const schedulesByDay = DAYS.reduce((acc, day) => {
    acc[day] = data.filter((s) => s.hari === day);
    return acc;
  }, {} as Record<string, Jadwal[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Jadwal Pelajaran</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manajemen jadwal kegiatan belajar mengajar dan alokasi ruang kelas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-lg border border-border bg-card">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Jadwal Harian</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
          </div>

          <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Jadwal
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select
          value={filterHari}
          onChange={(e) => setFilterHari(e.target.value)}
          placeholder="Semua Hari"
          options={DAYS.map((d) => ({ value: d, label: d }))}
        />

        <Select
          value={filterKelas}
          onChange={(e) => setFilterKelas(e.target.value)}
          placeholder="Semua Kelas"
          options={kelasList.map((k) => ({
            value: k.id_kelas,
            label: k.nama_kelas,
          }))}
        />

        <Select
          value={filterGuru}
          onChange={(e) => setFilterGuru(e.target.value)}
          placeholder="Semua Guru"
          options={guruList.map((g) => ({
            value: g.id_guru,
            label: g.nama_guru,
          }))}
        />

        <Select
          value={filterMapel}
          onChange={(e) => setFilterMapel(e.target.value)}
          placeholder="Semua Mata Pelajaran"
          options={mapelList.map((m) => ({
            value: m.id_mapel,
            label: m.nama_mapel,
          }))}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingState message="Memuat jadwal pelajaran..." />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-10 h-10 text-muted-foreground/60" />}
          title="Tidak Ada Jadwal Pelajaran"
          description={
            filterHari || filterKelas || filterGuru || filterMapel
              ? 'Tidak ada jadwal yang sesuai dengan filter yang dipilih.'
              : 'Belum ada jadwal yang dijadwalkan di sistem.'
          }
          action={
            filterHari || filterKelas || filterGuru || filterMapel ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterHari('');
                  setFilterKelas('');
                  setFilterGuru('');
                  setFilterMapel('');
                }}
              >
                Reset Filter
              </Button>
            ) : (
              <Button size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
                Tambah Jadwal
              </Button>
            )
          }
        />
      ) : viewMode === 'calendar' ? (
        /* Timetable / Calendar Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DAYS.map((day) => {
            const daySchedules = schedulesByDay[day] || [];
            if (filterHari && filterHari !== day) return null;

            return (
              <div
                key={day}
                className="rounded-xl border border-border bg-card flex flex-col overflow-hidden shadow-xs"
              >
                <div className="p-3.5 bg-muted/40 border-b border-border flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{day}</span>
                  <Badge variant="blue" size="sm">
                    {daySchedules.length} Sesi
                  </Badge>
                </div>

                <div className="p-3 space-y-2.5 flex-1 overflow-y-auto max-h-[500px]">
                  {daySchedules.length === 0 ? (
                    <div className="text-center py-8 text-xs text-muted-foreground">
                      Tidak ada jadwal di hari {day}.
                    </div>
                  ) : (
                    daySchedules.map((item) => (
                      <div
                        key={item.id_jadwal}
                        className="p-3 rounded-lg border border-border/80 bg-background hover:border-primary/50 transition-all space-y-2 shadow-xs group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-primary flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {item.jam_mulai} – {item.jam_selesai}
                          </span>
                          <Badge variant="gray" size="sm">
                            {item.kelas?.nama_kelas}
                          </Badge>
                        </div>

                        <div>
                          <p className="font-bold text-sm text-foreground leading-tight">
                            {item.mataPelajaran?.nama_mapel}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.guru?.nama_guru}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 truncate max-w-[150px]">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {item.ruang}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingItem(item)}
                              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Hari</TableHead>
              <TableHead className="w-32">Waktu</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Guru Pengampu</TableHead>
              <TableHead className="w-36">Ruang</TableHead>
              <TableHead className="w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id_jadwal}>
                <TableCell className="font-semibold text-foreground">{item.hari}</TableCell>
                <TableCell className="font-mono text-xs text-primary font-medium">
                  {item.jam_mulai} – {item.jam_selesai}
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {item.mataPelajaran?.nama_mapel}
                </TableCell>
                <TableCell>
                  <Badge variant="blue" size="sm">
                    {item.kelas?.nama_kelas}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {item.guru?.nama_guru}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-medium">
                  {item.ruang}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Jadwal"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Hapus Jadwal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Jadwal Pelajaran' : 'Tambah Jadwal Pelajaran Baru'}
        description="Sistem secara otomatis memeriksa tabrakan jadwal guru, kelas, dan ruang."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-xs font-medium">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Hari"
              value={formData.hari}
              onChange={(e) => setFormData({ ...formData, hari: e.target.value })}
              options={DAYS.map((d) => ({ value: d, label: d }))}
              required
            />

            <Input
              label="Ruangan / Lab"
              placeholder="Contoh: Lab Komputer 1, R. Teori 201"
              value={formData.ruang}
              onChange={(e) => setFormData({ ...formData, ruang: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Jam Mulai (HH:mm)"
              type="time"
              value={formData.jam_mulai}
              onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
              required
            />

            <Input
              label="Jam Selesai (HH:mm)"
              type="time"
              value={formData.jam_selesai}
              onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
              required
            />
          </div>

          <Select
            label="Mata Pelajaran"
            value={formData.id_mapel}
            onChange={(e) => setFormData({ ...formData, id_mapel: e.target.value })}
            options={mapelList.map((m) => ({
              value: m.id_mapel,
              label: `${m.nama_mapel} (${m.kode_mapel} - ${m.kelompok})`,
            }))}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Kelas"
              value={formData.id_kelas}
              onChange={(e) => setFormData({ ...formData, id_kelas: e.target.value })}
              options={kelasList.map((k) => ({
                value: k.id_kelas,
                label: `${k.nama_kelas} (${k.jurusan?.kode_jurusan})`,
              }))}
              required
            />

            <Select
              label="Guru Pengampu"
              value={formData.id_guru}
              onChange={(e) => setFormData({ ...formData, id_guru: e.target.value })}
              options={guruList.map((g) => ({
                value: g.id_guru,
                label: g.nama_guru,
              }))}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              {editingItem ? 'Simpan Perubahan' : 'Tambah Jadwal'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Jadwal"
        message={`Apakah Anda yakin ingin menghapus jadwal "${deletingItem?.mataPelajaran?.nama_mapel}" pada hari ${deletingItem?.hari} pukul ${deletingItem?.jam_mulai}–${deletingItem?.jam_selesai}?`}
        confirmText="Hapus Jadwal"
        isLoading={isDeleting}
      />
    </div>
  );
};
