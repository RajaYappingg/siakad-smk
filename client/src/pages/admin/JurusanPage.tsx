import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Jurusan } from '../../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Plus, Search, Pencil, Trash2, Layers } from 'lucide-react';

export const JurusanPage: React.FC = () => {
  const [data, setData] = useState<Jurusan[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Jurusan | null>(null);
  const [formData, setFormData] = useState({ kode_jurusan: '', nama_jurusan: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog states
  const [deletingItem, setDeletingItem] = useState<Jurusan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<Jurusan[]>('/jurusan', { search });
      setData(res);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengambil data jurusan.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ kode_jurusan: '', nama_jurusan: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Jurusan) => {
    setEditingItem(item);
    setFormData({ kode_jurusan: item.kode_jurusan, nama_jurusan: item.nama_jurusan });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kode_jurusan.trim() || !formData.nama_jurusan.trim()) {
      showToast('Mohon lengkapi seluruh isian form.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await api.put(`/jurusan/${editingItem.id_jurusan}`, formData);
        showToast('Data jurusan berhasil diperbarui.', 'success');
      } else {
        await api.post('/jurusan', formData);
        showToast('Data jurusan berhasil ditambahkan.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan saat menyimpan data jurusan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await api.delete(`/jurusan/${deletingItem.id_jurusan}`);
      showToast('Data jurusan berhasil dihapus.', 'success');
      setDeletingItem(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus jurusan.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Data Jurusan</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Daftar program kompetensi keahlian / kejuruan di sekolah
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Jurusan
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Cari jurusan berdasarkan kode atau nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Main Table / Content */}
      {isLoading ? (
        <LoadingState message="Memuat data jurusan..." />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-10 h-10 text-muted-foreground/60" />}
          title="Belum Ada Data Jurusan"
          description={
            search
              ? `Tidak ditemukan jurusan dengan kata kunci "${search}".`
              : 'Silakan klik tombol di bawah untuk menambahkan data jurusan pertama.'
          }
          action={
            search ? (
              <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                Reset Pencarian
              </Button>
            ) : (
              <Button size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
                Tambah Jurusan
              </Button>
            )
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Kode</TableHead>
              <TableHead>Nama Jurusan</TableHead>
              <TableHead className="w-36 text-center">Jumlah Kelas</TableHead>
              <TableHead className="w-28 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id_jurusan}>
                <TableCell>
                  <Badge variant="blue" size="md">
                    {item.kode_jurusan}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {item.nama_jurusan}
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold text-xs text-muted-foreground">
                    {item._count?.kelas ?? 0} Kelas
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Jurusan"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Hapus Jurusan"
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
        title={editingItem ? 'Edit Data Jurusan' : 'Tambah Jurusan Baru'}
        description="Lengkapi informasi kode dan nama program keahlian di bawah."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Kode Jurusan"
            placeholder="Contoh: PPLG, TJKT"
            value={formData.kode_jurusan}
            onChange={(e) => setFormData({ ...formData, kode_jurusan: e.target.value.toUpperCase() })}
            required
            autoFocus
          />

          <Input
            label="Nama Jurusan"
            placeholder="Contoh: Pengembangan Perangkat Lunak dan Gim"
            value={formData.nama_jurusan}
            onChange={(e) => setFormData({ ...formData, nama_jurusan: e.target.value })}
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
              {editingItem ? 'Simpan Perubahan' : 'Tambah Jurusan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Jurusan"
        message={`Apakah Anda yakin ingin menghapus jurusan "${deletingItem?.nama_jurusan}" (${deletingItem?.kode_jurusan})? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Jurusan"
        isLoading={isDeleting}
      />
    </div>
  );
};
