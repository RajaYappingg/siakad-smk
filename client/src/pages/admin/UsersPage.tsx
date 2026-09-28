import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { User, Guru, Siswa, Role } from '../../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Plus, Search, Pencil, Trash2, UserCog } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'SISWA' as Role,
    id_guru: '',
    nis: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete
  const [deletingItem, setDeletingItem] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [uList, gList, sList] = await Promise.all([
        api.get<User[]>('/users', { search, role: roleFilter }),
        api.get<Guru[]>('/guru'),
        api.get<Siswa[]>('/siswa'),
      ]);
      setUsers(uList);
      setGuruList(gList);
      setSiswaList(sList);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat pengguna.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, roleFilter]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      nama: '',
      email: '',
      password: '',
      role: 'ADMIN',
      id_guru: '',
      nis: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: User) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      email: item.email,
      password: '', // Leave blank if not changing
      role: item.role,
      id_guru: item.id_guru ? String(item.id_guru) : '',
      nis: item.nis || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.email || (!editingItem && !formData.password)) {
      showToast('Nama, email, dan kata sandi wajib diisi.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        nama: formData.nama.trim(),
        email: formData.email.trim(),
        role: formData.role,
        id_guru: formData.role === 'GURU' && formData.id_guru ? parseInt(formData.id_guru, 10) : null,
        nis: formData.role === 'SISWA' && formData.nis ? formData.nis : null,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (editingItem) {
        await api.put(`/users/${editingItem.id}`, payload);
        showToast('Akun pengguna berhasil diperbarui.', 'success');
      } else {
        await api.post('/users', payload);
        showToast('Pengguna baru berhasil ditambahkan.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan pengguna.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await api.delete(`/users/${deletingItem.id}`);
      showToast('Pengguna berhasil dihapus.', 'success');
      setDeletingItem(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus pengguna.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Akun Pengguna</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manajemen akun login dan hak akses (Role-Based Access Control)
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Pengguna
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
        <Input
          placeholder="Cari email atau nama pengguna..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          placeholder="Semua Peran (Role)"
          options={[
            { value: 'ADMIN', label: 'Administrator' },
            { value: 'GURU', label: 'Guru' },
            { value: 'SISWA', label: 'Siswa' },
          ]}
        />
      </div>

      {/* Main Table */}
      {isLoading ? (
        <LoadingState message="Memuat akun pengguna..." />
      ) : users.length === 0 ? (
        <EmptyState
          icon={<UserCog className="w-10 h-10 text-muted-foreground/60" />}
          title="Tidak Ada Pengguna"
          description="Tidak ditemukan akun pengguna yang cocok dengan kriteria."
          action={
            <Button size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
              Tambah Pengguna
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Email Login</TableHead>
              <TableHead className="w-32 text-center">Peran (Role)</TableHead>
              <TableHead>Tautan Profil</TableHead>
              <TableHead className="w-28 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-semibold text-foreground">
                  {item.nama}
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  {item.email}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      item.role === 'ADMIN' ? 'purple' : item.role === 'GURU' ? 'blue' : 'emerald'
                    }
                    size="sm"
                  >
                    {item.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {item.role === 'GURU' && item.guru ? (
                    <span>Guru: {item.guru.nama_guru}</span>
                  ) : item.role === 'SISWA' && item.siswa ? (
                    <span>Siswa: {item.siswa.nama_siswa} ({item.nis})</span>
                  ) : (
                    <span className="italic text-muted-foreground/60">Akses Global</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Pengguna"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Hapus Pengguna"
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
        title={editingItem ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
        description="Atur kredensial email dan peran pengguna pada sistem."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="Contoh: Muhammad Ihsan"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            required
            autoFocus
          />

          <Input
            label="Email Pengguna"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label={editingItem ? 'Kata Sandi Baru (Kosongkan jika tidak ingin diubah)' : 'Kata Sandi'}
            type="password"
            placeholder="Minimal 6 karakter"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!editingItem}
          />

          <Select
            label="Peran (Role)"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
            options={[
              { value: 'ADMIN', label: 'ADMIN - Akses Penuh Sistem' },
              { value: 'GURU', label: 'GURU - Akses Mengajar & Input Nilai' },
              { value: 'SISWA', label: 'SISWA - Akses Jadwal & Raport' },
            ]}
            required
          />

          {formData.role === 'GURU' && (
            <Select
              label="Tautkan dengan Profil Guru"
              value={formData.id_guru}
              onChange={(e) => setFormData({ ...formData, id_guru: e.target.value })}
              placeholder="Pilih Guru Terdaftar..."
              options={guruList.map((g) => ({
                value: g.id_guru,
                label: `${g.nama_guru} (NIP: ${g.nip})`,
              }))}
            />
          )}

          {formData.role === 'SISWA' && (
            <Select
              label="Tautkan dengan Profil Siswa"
              value={formData.nis}
              onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
              placeholder="Pilih Siswa Terdaftar..."
              options={siswaList.map((s) => ({
                value: s.nis,
                label: `${s.nama_siswa} (NIS: ${s.nis} - ${s.kelas?.nama_kelas})`,
              }))}
            />
          )}

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
              {editingItem ? 'Simpan Perubahan' : 'Tambah Pengguna'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Pengguna"
        message={`Apakah Anda yakin ingin menghapus akun pengguna "${deletingItem?.nama}" (${deletingItem?.email})?`}
        confirmText="Hapus Pengguna"
        isLoading={isDeleting}
      />
    </div>
  );
};
