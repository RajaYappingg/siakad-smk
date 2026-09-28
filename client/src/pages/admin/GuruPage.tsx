import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Guru } from '../../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Plus, Search, Pencil, Trash2, Eye, UserCheck } from 'lucide-react';

export const GuruPage: React.FC = () => {
  const [data, setData] = useState<Guru[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Guru | null>(null);
  const [formData, setFormData] = useState({
    nip: '',
    nama_guru: '',
    email: '',
    no_hp: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete
  const [deletingItem, setDeletingItem] = useState<Guru | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<Guru[]>('/guru', { search });
      setData(res);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengambil data guru.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      nip: '',
      nama_guru: '',
      email: '',
      no_hp: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Guru) => {
    setEditingItem(item);
    setFormData({
      nip: item.nip,
      nama_guru: item.nama_guru,
      email: item.email,
      no_hp: item.no_hp,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nip || !formData.nama_guru || !formData.email || !formData.no_hp) {
      showToast('Semua data guru wajib diisi.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await api.put(`/guru/${editingItem.id_guru}`, formData);
        showToast('Data guru berhasil diperbarui.', 'success');
      } else {
        await api.post('/guru', formData);
        showToast('Data guru berhasil ditambahkan.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data guru.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await api.delete(`/guru/${deletingItem.id_guru}`);
      showToast('Data guru berhasil dihapus.', 'success');
      setDeletingItem(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus data guru.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Data Guru</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Daftar tenaga pendidik dan instruktur mata pelajaran
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Guru
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Temukan guru berdasarkan nama atau NIP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <LoadingState message="Memuat data guru..." />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<UserCheck className="w-10 h-10 text-muted-foreground/60" />}
          title="Tidak Ada Data Guru"
          description={
            search
              ? `Tidak ditemukan data guru dengan kata kunci "${search}".`
              : 'Belum ada guru yang terdaftar. Tambahkan guru pertama Anda.'
          }
          action={
            search ? (
              <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                Reset Pencarian
              </Button>
            ) : (
              <Button size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
                Tambah Guru
              </Button>
            )
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48">NIP</TableHead>
              <TableHead>Nama Guru</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-36">No. HP</TableHead>
              <TableHead className="w-28 text-center">Jadwal</TableHead>
              <TableHead className="w-28 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id_guru}>
                <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                  {item.nip}
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {item.nama_guru}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {item.email}
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  {item.no_hp}
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {item._count?.jadwal ?? 0} Sesi
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => navigate(`/admin/guru/${item.id_guru}`)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Lihat Detail Guru"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Guru"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Hapus Guru"
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
        title={editingItem ? 'Edit Data Guru' : 'Tambah Guru Baru'}
        description="Lengkapi identitas tenaga pendidik di bawah ini."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nomor Induk Pegawai (NIP)"
            placeholder="Contoh: 198205122008011005"
            value={formData.nip}
            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
            required
            autoFocus
          />

          <Input
            label="Nama Lengkap Beserta Gelar"
            placeholder="Contoh: Budi Santoso, S.Kom."
            value={formData.nama_guru}
            onChange={(e) => setFormData({ ...formData, nama_guru: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Resmi"
              type="email"
              placeholder="budi@sekolah.sch.id"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Nomor Handphone / WA"
              placeholder="081234567890"
              value={formData.no_hp}
              onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
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
              {editingItem ? 'Simpan Perubahan' : 'Tambah Guru'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Guru"
        message={`Apakah Anda yakin ingin menghapus data guru "${deletingItem?.nama_guru}" (NIP: ${deletingItem?.nip})? Guru yang memiliki jadwal aktif atau telah menginput nilai tidak dapat dihapus.`}
        confirmText="Hapus Guru"
        isLoading={isDeleting}
      />
    </div>
  );
};
