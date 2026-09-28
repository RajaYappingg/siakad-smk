import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { TahunAjaran } from '../../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Plus, CalendarDays, CheckCircle2, Pencil, Trash2 } from 'lucide-react';

export const TahunAjaranPage: React.FC = () => {
  const [data, setData] = useState<TahunAjaran[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TahunAjaran | null>(null);
  const [formData, setFormData] = useState({
    tahun_ajaran: '2025/2026',
    semester: 'Ganjil' as 'Ganjil' | 'Genap',
    status: 'Tidak Aktif' as 'Aktif' | 'Tidak Aktif',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete
  const [deletingItem, setDeletingItem] = useState<TahunAjaran | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<TahunAjaran[]>('/tahun-ajaran');
      setData(res);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat tahun ajaran.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      tahun_ajaran: '2025/2026',
      semester: 'Ganjil',
      status: 'Tidak Aktif',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TahunAjaran) => {
    setEditingItem(item);
    setFormData({
      tahun_ajaran: item.tahun_ajaran,
      semester: item.semester,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSetActive = async (item: TahunAjaran) => {
    try {
      await api.put(`/tahun-ajaran/${item.id_tahun_ajaran}`, {
        tahun_ajaran: item.tahun_ajaran,
        semester: item.semester,
        status: 'Aktif',
      });
      showToast(`Tahun ajaran ${item.tahun_ajaran} (${item.semester}) berhasil diaktifkan.`, 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah status aktif.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tahun_ajaran) {
      showToast('Tahun ajaran wajib diisi.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await api.put(`/tahun-ajaran/${editingItem.id_tahun_ajaran}`, formData);
        showToast('Data tahun ajaran berhasil diperbarui.', 'success');
      } else {
        await api.post('/tahun-ajaran', formData);
        showToast('Tahun ajaran baru berhasil ditambahkan.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan tahun ajaran.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await api.delete(`/tahun-ajaran/${deletingItem.id_tahun_ajaran}`);
      showToast('Tahun ajaran berhasil dihapus.', 'success');
      setDeletingItem(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus tahun ajaran.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Tahun Ajaran & Semester</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Pengaturan periode akademik aktif untuk penilaian dan kalender sekolah
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Tahun Ajaran
        </Button>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <LoadingState message="Memuat tahun ajaran..." />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-10 h-10 text-muted-foreground/60" />}
          title="Belum Ada Periode Tahun Ajaran"
          description="Tambahkan tahun ajaran dan semester aktif untuk memulai pencatatan akademik."
          action={
            <Button size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
              Tambah Tahun Ajaran
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tahun Ajaran</TableHead>
              <TableHead className="w-36 text-center">Semester</TableHead>
              <TableHead className="w-36 text-center">Status</TableHead>
              <TableHead className="w-44 text-center">Aktivasi</TableHead>
              <TableHead className="w-28 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const isAktif = item.status === 'Aktif';

              return (
                <TableRow key={item.id_tahun_ajaran}>
                  <TableCell className="font-bold text-foreground">
                    {item.tahun_ajaran}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.semester}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={isAktif ? 'emerald' : 'gray'} size="sm">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {isAktif ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Sedang Aktif
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetActive(item)}
                        className="text-xs h-7"
                      >
                        Set Sebagai Aktif
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingItem(item)}
                        disabled={isAktif}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        title={isAktif ? 'Periode aktif tidak dapat dihapus' : 'Hapus'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran Baru'}
        description="Atur periode tahun ajaran dan pilih semester yang bersangkutan."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tahun Ajaran"
            placeholder="Contoh: 2025/2026"
            value={formData.tahun_ajaran}
            onChange={(e) => setFormData({ ...formData, tahun_ajaran: e.target.value })}
            required
            autoFocus
          />

          <Select
            label="Semester"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value as 'Ganjil' | 'Genap' })}
            options={[
              { value: 'Ganjil', label: 'Ganjil' },
              { value: 'Genap', label: 'Genap' },
            ]}
            required
          />

          <Select
            label="Status Periode"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Tidak Aktif' })}
            options={[
              { value: 'Tidak Aktif', label: 'Tidak Aktif' },
              { value: 'Aktif', label: 'Aktif (Akan menonaktifkan periode lain)' },
            ]}
            required
          />

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
              {editingItem ? 'Simpan Perubahan' : 'Tambah Periode'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Tahun Ajaran"
        message={`Apakah Anda yakin ingin menghapus tahun ajaran "${deletingItem?.tahun_ajaran}" (${deletingItem?.semester})? Periode yang telah memiliki data nilai tidak dapat dihapus.`}
        confirmText="Hapus Periode"
        isLoading={isDeleting}
      />
    </div>
  );
};
