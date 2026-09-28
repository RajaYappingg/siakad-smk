import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { MataPelajaran } from '../../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Plus, Search, Pencil, Trash2, Eye, BookOpen } from 'lucide-react';

export const MapelPage: React.FC = () => {
  const [data, setData] = useState<MataPelajaran[]>([]);
  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MataPelajaran | null>(null);
  const [formData, setFormData] = useState({
    kode_mapel: '',
    nama_mapel: '',
    kelompok: 'Muatan Kejuruan',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete
  const [deletingItem, setDeletingItem] = useState<MataPelajaran | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<MataPelajaran[]>('/mapel', {
        search,
        kelompok: selectedKelompok,
      });
      setData(res);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengambil data mata pelajaran.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, selectedKelompok]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      kode_mapel: '',
      nama_mapel: '',
      kelompok: 'Muatan Kejuruan',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MataPelajaran) => {
    setEditingItem(item);
    setFormData({
      kode_mapel: item.kode_mapel,
      nama_mapel: item.nama_mapel,
      kelompok: item.kelompok,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kode_mapel || !formData.nama_mapel || !formData.kelompok) {
      showToast('Semua data mata pelajaran wajib diisi.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await api.put(`/mapel/${editingItem.id_mapel}`, formData);
        showToast('Mata pelajaran berhasil diperbarui.', 'success');
      } else {
        await api.post('/mapel', formData);
        showToast('Mata pelajaran berhasil ditambahkan.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data mata pelajaran.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await api.delete(`/mapel/${deletingItem.id_mapel}`);
      showToast('Mata pelajaran berhasil dihapus.', 'success');
      setDeletingItem(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus mata pelajaran.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Mata Pelajaran</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Kurikulum dan kelompok mata pelajaran kejuruan serta nasional
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Mata Pelajaran
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
        <Input
          placeholder="Temukan mata pelajaran..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        <Select
          value={selectedKelompok}
          onChange={(e) => setSelectedKelompok(e.target.value)}
          placeholder="Semua Kelompok Mapel"
          options={[
            { value: 'Muatan Kejuruan', label: 'Muatan Kejuruan' },
            { value: 'Muatan Nasional', label: 'Muatan Nasional' },
            { value: 'Muatan Kewilayahan', label: 'Muatan Kewilayahan' },
          ]}
        />
      </div>

      {/* Main Table */}
      {isLoading ? (
        <LoadingState message="Memuat data mata pelajaran..." />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-10 h-10 text-muted-foreground/60" />}
          title="Tidak Ada Mata Pelajaran"
          description={
            search || selectedKelompok
              ? 'Tidak ditemukan mata pelajaran yang cocok dengan filter.'
              : 'Belum ada mata pelajaran terdaftar.'
          }
          action={
            search || selectedKelompok ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSelectedKelompok('');
                }}
              >
                Reset Filter
              </Button>
            ) : (
              <Button size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
                Tambah Mapel
              </Button>
            )
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Kode</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead className="w-48">Kelompok</TableHead>
              <TableHead className="w-36 text-center">Jumlah Jadwal</TableHead>
              <TableHead className="w-28 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id_mapel}>
                <TableCell>
                  <Badge variant="blue" size="md">
                    {item.kode_mapel}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {item.nama_mapel}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.kelompok === 'Muatan Kejuruan'
                        ? 'purple'
                        : item.kelompok === 'Muatan Nasional'
                        ? 'emerald'
                        : 'gray'
                    }
                    size="sm"
                  >
                    {item.kelompok}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {item._count?.jadwal ?? 0} Sesi
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => navigate(`/admin/mapel/${item.id_mapel}`)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Lihat Detail Mapel"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Mapel"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Hapus Mapel"
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
        title={editingItem ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
        description="Masukkan kode, nama mata pelajaran, dan kelompok kurikulum."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Kode Mata Pelajaran"
            placeholder="Contoh: PWEB, BD, MTK"
            value={formData.kode_mapel}
            onChange={(e) => setFormData({ ...formData, kode_mapel: e.target.value.toUpperCase() })}
            required
            autoFocus
          />

          <Input
            label="Nama Mata Pelajaran"
            placeholder="Contoh: Pemrograman Web"
            value={formData.nama_mapel}
            onChange={(e) => setFormData({ ...formData, nama_mapel: e.target.value })}
            required
          />

          <Select
            label="Kelompok Kurikulum"
            value={formData.kelompok}
            onChange={(e) => setFormData({ ...formData, kelompok: e.target.value })}
            options={[
              { value: 'Muatan Kejuruan', label: 'Muatan Kejuruan' },
              { value: 'Muatan Nasional', label: 'Muatan Nasional' },
              { value: 'Muatan Kewilayahan', label: 'Muatan Kewilayahan' },
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
              {editingItem ? 'Simpan Perubahan' : 'Tambah Mapel'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Mata Pelajaran"
        message={`Apakah Anda yakin ingin menghapus mata pelajaran "${deletingItem?.nama_mapel}" (${deletingItem?.kode_mapel})? Mapel yang memiliki jadwal atau nilai tidak dapat dihapus.`}
        confirmText="Hapus Mapel"
        isLoading={isDeleting}
      />
    </div>
  );
};
