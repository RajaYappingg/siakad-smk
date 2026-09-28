import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Nilai, Kelas, MataPelajaran, Guru, TahunAjaran, Siswa } from '../../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Plus, Award, Pencil, Trash2 } from 'lucide-react';

export const NilaiPage: React.FC = () => {
  const [data, setData] = useState<Nilai[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [mapelList, setMapelList] = useState<MataPelajaran[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [taList, setTaList] = useState<TahunAjaran[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);

  // Filters
  const [filterTA, setFilterTA] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterMapel, setFilterMapel] = useState('');
  const [filterGuru, setFilterGuru] = useState('');
  const [searchSiswa, setSearchSiswa] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Nilai | null>(null);
  const [formData, setFormData] = useState({
    nis: '',
    id_tahun_ajaran: '',
    id_guru: '',
    id_mapel: '',
    nilai_tugas: 80,
    nilai_uts: 80,
    nilai_uas: 80,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete
  const [deletingItem, setDeletingItem] = useState<Nilai | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [grades, classes, subjects, teachers, periods, students] = await Promise.all([
        api.get<Nilai[]>('/nilai', {
          id_tahun_ajaran: filterTA,
          id_kelas: filterKelas,
          id_mapel: filterMapel,
          id_guru: filterGuru,
        }),
        api.get<Kelas[]>('/kelas'),
        api.get<MataPelajaran[]>('/mapel'),
        api.get<Guru[]>('/guru'),
        api.get<TahunAjaran[]>('/tahun-ajaran'),
        api.get<Siswa[]>('/siswa'),
      ]);

      setData(grades);
      setKelasList(classes);
      setMapelList(subjects);
      setGuruList(teachers);
      setTaList(periods);
      setSiswaList(students);

      // Default filter to active TA if not set
      if (!filterTA) {
        const active = periods.find((p) => p.status === 'Aktif');
        if (active) setFilterTA(String(active.id_tahun_ajaran));
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengambil data nilai.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterTA, filterKelas, filterMapel, filterGuru]);

  // Client-side filter for student name/nis
  const filteredData = data.filter((item) => {
    if (!searchSiswa) return true;
    const q = searchSiswa.toLowerCase();
    return (
      item.nis.toLowerCase().includes(q) ||
      (item.siswa?.nama_siswa && item.siswa.nama_siswa.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    const activeTA = taList.find((p) => p.status === 'Aktif') || taList[0];
    setFormData({
      nis: siswaList[0]?.nis || '',
      id_tahun_ajaran: activeTA ? String(activeTA.id_tahun_ajaran) : '',
      id_guru: guruList[0]?.id_guru ? String(guruList[0].id_guru) : '',
      id_mapel: mapelList[0]?.id_mapel ? String(mapelList[0].id_mapel) : '',
      nilai_tugas: 80,
      nilai_uts: 80,
      nilai_uas: 80,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Nilai) => {
    setEditingItem(item);
    setFormData({
      nis: item.nis,
      id_tahun_ajaran: String(item.id_tahun_ajaran),
      id_guru: String(item.id_guru),
      id_mapel: String(item.id_mapel),
      nilai_tugas: item.nilai_tugas,
      nilai_uts: item.nilai_uts,
      nilai_uas: item.nilai_uas,
    });
    setIsModalOpen(true);
  };

  // Live calculation preview: 30% tugas + 30% uts + 40% uas
  const previewNilaiAkhir =
    Math.round(
      ((Number(formData.nilai_tugas) || 0) * 0.3 +
        (Number(formData.nilai_uts) || 0) * 0.3 +
        (Number(formData.nilai_uas) || 0) * 0.4) *
        100
    ) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nis || !formData.id_tahun_ajaran || !formData.id_guru || !formData.id_mapel) {
      showToast('Seluruh kolom formulir nilai wajib diisi.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nis: formData.nis,
        id_tahun_ajaran: parseInt(formData.id_tahun_ajaran, 10),
        id_guru: parseInt(formData.id_guru, 10),
        id_mapel: parseInt(formData.id_mapel, 10),
        nilai_tugas: Number(formData.nilai_tugas) || 0,
        nilai_uts: Number(formData.nilai_uts) || 0,
        nilai_uas: Number(formData.nilai_uas) || 0,
      };

      await api.post('/nilai', payload);
      showToast('Data nilai berhasil disimpan.', 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan data nilai.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await api.delete(`/nilai/${deletingItem.id_nilai}`);
      showToast('Data nilai berhasil dihapus.', 'success');
      setDeletingItem(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus data nilai.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Nilai Siswa</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Rekapitulasi nilai akademik berbobot: Tugas (30%), UTS (30%), UAS (40%)
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Input Nilai
        </Button>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Input
          placeholder="Cari nama / NIS siswa..."
          value={searchSiswa}
          onChange={(e) => setSearchSiswa(e.target.value)}
        />

        <Select
          value={filterTA}
          onChange={(e) => setFilterTA(e.target.value)}
          placeholder="Semua Periode"
          options={taList.map((t) => ({
            value: t.id_tahun_ajaran,
            label: `${t.tahun_ajaran} (${t.semester}) ${t.status === 'Aktif' ? '★' : ''}`,
          }))}
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
          value={filterMapel}
          onChange={(e) => setFilterMapel(e.target.value)}
          placeholder="Semua Mapel"
          options={mapelList.map((m) => ({
            value: m.id_mapel,
            label: m.nama_mapel,
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
      </div>

      {/* Main Table */}
      {isLoading ? (
        <LoadingState message="Memuat data nilai siswa..." />
      ) : filteredData.length === 0 ? (
        <EmptyState
          icon={<Award className="w-10 h-10 text-muted-foreground/60" />}
          title="Tidak Ada Data Nilai"
          description="Tidak ditemukan data nilai yang cocok dengan kriteria filter."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchSiswa('');
                setFilterKelas('');
                setFilterMapel('');
                setFilterGuru('');
              }}
            >
              Reset Filter
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Siswa</TableHead>
              <TableHead className="w-28">Kelas</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead className="w-20 text-center">Tugas (30%)</TableHead>
              <TableHead className="w-20 text-center">UTS (30%)</TableHead>
              <TableHead className="w-20 text-center">UAS (40%)</TableHead>
              <TableHead className="w-24 text-center">Nilai Akhir</TableHead>
              <TableHead className="w-20 text-center">Predikat</TableHead>
              <TableHead className="w-24 text-center">Status</TableHead>
              <TableHead className="w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id_nilai}>
                <TableCell>
                  <p className="font-semibold text-foreground leading-tight">
                    {item.siswa?.nama_siswa}
                  </p>
                  <span className="font-mono text-[11px] text-muted-foreground">{item.nis}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="gray" size="sm">
                    {item.siswa?.kelas?.nama_kelas}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-xs text-foreground">
                    {item.mataPelajaran?.nama_mapel}
                  </p>
                  <span className="text-[10px] text-muted-foreground">{item.guru?.nama_guru}</span>
                </TableCell>
                <TableCell className="text-center font-mono text-xs">{item.nilai_tugas}</TableCell>
                <TableCell className="text-center font-mono text-xs">{item.nilai_uts}</TableCell>
                <TableCell className="text-center font-mono text-xs">{item.nilai_uas}</TableCell>
                <TableCell className="text-center font-mono font-bold text-sm text-primary">
                  {item.nilai_akhir}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      item.predikat === 'A' ? 'emerald' : item.predikat === 'B' ? 'blue' : 'amber'
                    }
                    size="sm"
                  >
                    {item.predikat}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={item.status === 'Lulus' ? 'emerald' : 'rose'}
                    size="sm"
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Nilai"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Hapus Nilai"
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Nilai Siswa' : 'Input Nilai Siswa'}
        description="Masukkan nilai angka (skala 0–100). Nilai akhir dihitung secara otomatis."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Pilih Siswa"
              value={formData.nis}
              onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
              options={siswaList.map((s) => ({
                value: s.nis,
                label: `${s.nama_siswa} (${s.nis} - ${s.kelas?.nama_kelas})`,
              }))}
              required
            />

            <Select
              label="Periode Tahun Ajaran"
              value={formData.id_tahun_ajaran}
              onChange={(e) => setFormData({ ...formData, id_tahun_ajaran: e.target.value })}
              options={taList.map((t) => ({
                value: t.id_tahun_ajaran,
                label: `${t.tahun_ajaran} (${t.semester}) ${t.status === 'Aktif' ? '★' : ''}`,
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Mata Pelajaran"
              value={formData.id_mapel}
              onChange={(e) => setFormData({ ...formData, id_mapel: e.target.value })}
              options={mapelList.map((m) => ({
                value: m.id_mapel,
                label: `${m.nama_mapel} (${m.kode_mapel})`,
              }))}
              required
            />

            <Select
              label="Guru Penilai"
              value={formData.id_guru}
              onChange={(e) => setFormData({ ...formData, id_guru: e.target.value })}
              options={guruList.map((g) => ({
                value: g.id_guru,
                label: g.nama_guru,
              }))}
              required
            />
          </div>

          {/* Score inputs with automatic live calculation box */}
          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Komponen Penilaian
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Tugas (30%)"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={formData.nilai_tugas}
                onChange={(e) => setFormData({ ...formData, nilai_tugas: parseFloat(e.target.value) || 0 })}
                required
              />

              <Input
                label="UTS (30%)"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={formData.nilai_uts}
                onChange={(e) => setFormData({ ...formData, nilai_uts: parseFloat(e.target.value) || 0 })}
                required
              />

              <Input
                label="UAS (40%)"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={formData.nilai_uas}
                onChange={(e) => setFormData({ ...formData, nilai_uas: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/80">
              <span className="text-xs text-muted-foreground font-medium">
                Hasil Perhitungan Nilai Akhir:
              </span>
              <span className="font-mono text-lg font-bold text-primary">
                {previewNilaiAkhir}
              </span>
            </div>
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
              {editingItem ? 'Simpan Perubahan' : 'Simpan Nilai'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Nilai"
        message={`Apakah Anda yakin ingin menghapus data nilai ${deletingItem?.mataPelajaran?.nama_mapel} untuk siswa ${deletingItem?.siswa?.nama_siswa}?`}
        confirmText="Hapus Nilai"
        isLoading={isDeleting}
      />
    </div>
  );
};
