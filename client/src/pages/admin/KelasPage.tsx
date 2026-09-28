import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Kelas, Jurusan } from '../../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Plus, Search, Pencil, Trash2, Eye, GraduationCap } from 'lucide-react';

export const KelasPage: React.FC = () => {
  const [data, setData] = useState<Kelas[]>([]);
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTingkat, setSelectedTingkat] = useState('');
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Kelas | null>(null);
  const [formData, setFormData] = useState({
    id_jurusan: '',
    tingkat: 'X',
    nama_kelas: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog
  const [deletingItem, setDeletingItem] = useState<Kelas | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [kelasList, jurusans] = await Promise.all([
        api.get<Kelas[]>('/kelas', {
          search,
          tingkat: selectedTingkat,
          id_jurusan: selectedJurusan,
        }),
        api.get<Jurusan[]>('/jurusan'),
      ]);
      setData(kelasList);
      setJurusanList(jurusans);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengambil data kelas.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, selectedTingkat, selectedJurusan]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id_jurusan: jurusanList[0]?.id_jurusan ? String(jurusanList[0].id_jurusan) : '',
      tingkat: 'X',
      nama_kelas: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Kelas) => {
    setEditingItem(item);
    setFormData({
      id_jurusan: String(item.id_jurusan),
      tingkat: item.tingkat,
      nama_kelas: item.nama_kelas,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_kelas.trim() || !formData.id_jurusan) {
      showToast('Mohon lengkapi data kelas.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id_jurusan: parseInt(formData.id_jurusan, 10),
        tingkat: formData.tingkat,
        nama_kelas: formData.nama_kelas.trim(),
      };

      if (editingItem) {
        await api.put(`/kelas/${editingItem.id_kelas}`, payload);
        showToast('Data kelas berhasil diperbarui.', 'success');
      } else {
        await api.post('/kelas', payload);
        showToast('Data kelas berhasil ditambahkan.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data kelas.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await api.delete(`/kelas/${deletingItem.id_kelas}`);
      showToast('Kelas berhasil dihapus.', 'success');
      setDeletingItem(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus data kelas.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Data Kelas</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Daftar rombongan belajar, tingkatan, dan jurusan siswa
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Kelas
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          placeholder="Cari kelas (misal: X PPLG 1)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        <Select
          value={selectedTingkat}
          onChange={(e) => setSelectedTingkat(e.target.value)}
          placeholder="Semua Tingkat (X, XI, XII)"
          options={[
            { value: 'X', label: 'Tingkat X' },
            { value: 'XI', label: 'Tingkat XI' },
            { value: 'XII', label: 'Tingkat XII' },
          ]}
        />

        <Select
          value={selectedJurusan}
          onChange={(e) => setSelectedJurusan(e.target.value)}
          placeholder="Semua Jurusan"
          options={jurusanList.map((j) => ({
            value: j.id_jurusan,
            label: `${j.kode_jurusan} - ${j.nama_jurusan}`,
          }))}
        />
      </div>

      {/* Table Content */}
      {isLoading ? (
        <LoadingState message="Memuat data kelas..." />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="w-10 h-10 text-muted-foreground/60" />}
          title="Tidak Ada Data Kelas"
          description={
            search || selectedTingkat || selectedJurusan
              ? 'Tidak ditemukan kelas yang cocok dengan filter pencarian Anda.'
              : 'Belum ada kelas terdaftar. Silakan tambahkan kelas baru.'
          }
          action={
            search || selectedTingkat || selectedJurusan ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSelectedTingkat('');
                  setSelectedJurusan('');
                }}
              >
                Reset Filter
              </Button>
            ) : (
              <Button size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
                Tambah Kelas
              </Button>
            )
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-44">Kelas</TableHead>
              <TableHead className="w-28 text-center">Tingkat</TableHead>
              <TableHead>Jurusan</TableHead>
              <TableHead className="w-36 text-center">Jumlah Siswa</TableHead>
              <TableHead className="w-32 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id_kelas}>
                <TableCell className="font-semibold text-foreground">
                  {item.nama_kelas}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="blue" size="sm">
                    Tingkat {item.tingkat}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.jurusan?.nama_jurusan} ({item.jurusan?.kode_jurusan})
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {item._count?.siswa ?? 0} Siswa
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => navigate(`/admin/kelas/${item.id_kelas}`)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Lihat Detail Kelas"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Kelas"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Hapus Kelas"
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
        title={editingItem ? 'Edit Data Kelas' : 'Tambah Kelas Baru'}
        description="Masukkan data rombongan belajar dan tentukan program keahliannya."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Program Keahlian (Jurusan)"
            value={formData.id_jurusan}
            onChange={(e) => setFormData({ ...formData, id_jurusan: e.target.value })}
            options={jurusanList.map((j) => ({
              value: j.id_jurusan,
              label: `${j.kode_jurusan} - ${j.nama_jurusan}`,
            }))}
            required
          />

          <Select
            label="Tingkat"
            value={formData.tingkat}
            onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
            options={[
              { value: 'X', label: 'Tingkat X' },
              { value: 'XI', label: 'Tingkat XI' },
              { value: 'XII', label: 'Tingkat XII' },
            ]}
            required
          />

          <Input
            label="Nama Kelas"
            placeholder="Contoh: X PPLG 1"
            value={formData.nama_kelas}
            onChange={(e) => setFormData({ ...formData, nama_kelas: e.target.value })}
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
              {editingItem ? 'Simpan Perubahan' : 'Tambah Kelas'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Kelas"
        message={`Apakah Anda yakin ingin menghapus kelas "${deletingItem?.nama_kelas}"? Data kelas tidak dapat dihapus jika masih memiliki siswa atau jadwal terdaftar.`}
        confirmText="Hapus Kelas"
        isLoading={isDeleting}
      />
    </div>
  );
};
