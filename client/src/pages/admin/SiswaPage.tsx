import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Siswa, Kelas, Jurusan } from '../../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Plus, Search, Pencil, Trash2, Eye, Users } from 'lucide-react';

export const SiswaPage: React.FC = () => {
  const [data, setData] = useState<Siswa[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Siswa | null>(null);
  const [formData, setFormData] = useState({
    nis: '',
    id_kelas: '',
    nama_siswa: '',
    jenis_kelamin: 'L' as 'L' | 'P',
    tanggal_lahir: '',
    alamat: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog
  const [deletingItem, setDeletingItem] = useState<Siswa | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [students, classes, jurusans] = await Promise.all([
        api.get<Siswa[]>('/siswa', {
          search,
          id_kelas: selectedKelas,
          id_jurusan: selectedJurusan,
          jenis_kelamin: selectedGender,
        }),
        api.get<Kelas[]>('/kelas'),
        api.get<Jurusan[]>('/jurusan'),
      ]);
      setData(students);
      setKelasList(classes);
      setJurusanList(jurusans);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengambil data siswa.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, selectedKelas, selectedJurusan, selectedGender]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      nis: '',
      id_kelas: kelasList[0]?.id_kelas ? String(kelasList[0].id_kelas) : '',
      nama_siswa: '',
      jenis_kelamin: 'L',
      tanggal_lahir: '2008-01-01',
      alamat: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Siswa) => {
    setEditingItem(item);
    const dateFormatted = item.tanggal_lahir ? item.tanggal_lahir.split('T')[0] : '';
    setFormData({
      nis: item.nis,
      id_kelas: String(item.id_kelas),
      nama_siswa: item.nama_siswa,
      jenis_kelamin: item.jenis_kelamin,
      tanggal_lahir: dateFormatted,
      alamat: item.alamat,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nis || !formData.nama_siswa || !formData.id_kelas || !formData.tanggal_lahir || !formData.alamat) {
      showToast('Semua kolom formulir siswa wajib diisi.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nis: formData.nis.trim(),
        id_kelas: parseInt(formData.id_kelas, 10),
        nama_siswa: formData.nama_siswa.trim(),
        jenis_kelamin: formData.jenis_kelamin,
        tanggal_lahir: formData.tanggal_lahir,
        alamat: formData.alamat.trim(),
      };

      if (editingItem) {
        await api.put(`/siswa/${editingItem.nis}`, payload);
        showToast('Data siswa berhasil diperbarui.', 'success');
      } else {
        await api.post('/siswa', payload);
        showToast('Data siswa berhasil ditambahkan.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data siswa.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await api.delete(`/siswa/${deletingItem.nis}`);
      showToast('Data siswa berhasil dihapus.', 'success');
      setDeletingItem(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus data siswa.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Data Siswa</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manajemen data identitas, rombel, dan akademik peserta didik
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Siswa
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          placeholder="Temukan siswa berdasarkan nama atau NIS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        <Select
          value={selectedKelas}
          onChange={(e) => setSelectedKelas(e.target.value)}
          placeholder="Semua Kelas"
          options={kelasList.map((k) => ({
            value: k.id_kelas,
            label: k.nama_kelas,
          }))}
        />

        <Select
          value={selectedJurusan}
          onChange={(e) => setSelectedJurusan(e.target.value)}
          placeholder="Semua Jurusan"
          options={jurusanList.map((j) => ({
            value: j.id_jurusan,
            label: j.kode_jurusan,
          }))}
        />

        <Select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
          placeholder="Semua Jenis Kelamin"
          options={[
            { value: 'L', label: 'Laki-laki (L)' },
            { value: 'P', label: 'Perempuan (P)' },
          ]}
        />
      </div>

      {/* Main Table */}
      {isLoading ? (
        <LoadingState message="Memuat data siswa..." />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<Users className="w-10 h-10 text-muted-foreground/60" />}
          title="Tidak Ada Data Siswa"
          description={
            search || selectedKelas || selectedJurusan || selectedGender
              ? 'Tidak ada data siswa yang cocok dengan kriteria pencarian dan filter.'
              : 'Belum ada data siswa terdaftar di sistem.'
          }
          action={
            search || selectedKelas || selectedJurusan || selectedGender ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSelectedKelas('');
                  setSelectedJurusan('');
                  setSelectedGender('');
                }}
              >
                Reset Filter
              </Button>
            ) : (
              <Button size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
                Tambah Siswa
              </Button>
            )
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">NIS</TableHead>
              <TableHead>Nama Siswa</TableHead>
              <TableHead className="w-20 text-center">L/P</TableHead>
              <TableHead className="w-28">Kelas</TableHead>
              <TableHead className="w-24">Jurusan</TableHead>
              <TableHead className="w-32">Tgl Lahir</TableHead>
              <TableHead className="w-28 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const birthDate = item.tanggal_lahir
                ? new Date(item.tanggal_lahir).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '-';

              return (
                <TableRow key={item.nis}>
                  <TableCell className="font-mono text-xs font-semibold">{item.nis}</TableCell>
                  <TableCell className="font-semibold text-foreground">{item.nama_siswa}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.jenis_kelamin === 'L' ? 'blue' : 'rose'} size="sm">
                      {item.jenis_kelamin}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold text-foreground">
                      {item.kelas?.nama_kelas}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="gray" size="sm">
                      {item.kelas?.jurusan?.kode_jurusan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{birthDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/admin/siswa/${item.nis}`)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Lihat Detail Siswa"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit Data Siswa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingItem(item)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Hapus Siswa"
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
        description="Lengkapi identitas siswa dan pilih kelas penempatannya."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nomor Induk Siswa (NIS)"
              placeholder="Contoh: 20241001"
              value={formData.nis}
              onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
              required
              autoFocus
            />

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
          </div>

          <Input
            label="Nama Lengkap Siswa"
            placeholder="Contoh: Ahmad Fauzi"
            value={formData.nama_siswa}
            onChange={(e) => setFormData({ ...formData, nama_siswa: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Jenis Kelamin"
              value={formData.jenis_kelamin}
              onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value as 'L' | 'P' })}
              options={[
                { value: 'L', label: 'Laki-laki (L)' },
                { value: 'P', label: 'Perempuan (P)' },
              ]}
              required
            />

            <Input
              label="Tanggal Lahir"
              type="date"
              value={formData.tanggal_lahir}
              onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground/80">Alamat Tempat Tinggal</label>
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary"
              rows={3}
              placeholder="Contoh: Jl. Merdeka No. 45, Kota Baru"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
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
              {editingItem ? 'Simpan Perubahan' : 'Tambah Siswa'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Siswa"
        message={`Apakah Anda yakin ingin menghapus data siswa "${deletingItem?.nama_siswa}" (NIS: ${deletingItem?.nis})? Data nilai siswa ini juga akan terhapus.`}
        confirmText="Hapus Siswa"
        isLoading={isDeleting}
      />
    </div>
  );
};
