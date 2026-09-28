import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Kelas, MataPelajaran, TahunAjaran } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Award, Save, CheckCircle2 } from 'lucide-react';

interface StudentGradeRow {
  nis: string;
  nama_siswa: string;
  nilai_tugas: number;
  nilai_uts: number;
  nilai_uas: number;
  nilai_akhir: number;
  predikat: string;
  status: 'Lulus' | 'Remedial';
  isDirty?: boolean;
}

export const GuruNilaiPage: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Kelas[]>([]);
  const [subjects, setSubjects] = useState<MataPelajaran[]>([]);
  const [periods, setPeriods] = useState<TahunAjaran[]>([]);

  // Selection states
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');

  // Grades table data
  const [studentRows, setStudentRows] = useState<StudentGradeRow[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { showToast } = useToast();

  const calcGrade = (t: number, m: number, a: number) => {
    const akhir = Math.round((t * 0.3 + m * 0.3 + a * 0.4) * 100) / 100;
    let predikat = 'D';
    let status: 'Lulus' | 'Remedial' = 'Remedial';
    if (akhir >= 88) {
      predikat = 'A';
      status = 'Lulus';
    } else if (akhir >= 78) {
      predikat = 'B';
      status = 'Lulus';
    } else if (akhir >= 70) {
      predikat = 'C';
      status = 'Lulus';
    }
    return { akhir, predikat, status };
  };

  // Load teacher's classes, subjects, and academic periods
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!user?.id_guru) return;
      try {
        setIsLoadingMeta(true);
        const [guruDetail, allPeriods] = await Promise.all([
          api.get(`/guru/${user.id_guru}`),
          api.get<TahunAjaran[]>('/tahun-ajaran'),
        ]);

        const taughtClasses = guruDetail.kelasYangDiajar || [];
        const taughtSubjects = guruDetail.mapelYangDiajar || [];

        setClasses(taughtClasses);
        setSubjects(taughtSubjects);
        setPeriods(allPeriods);

        if (taughtClasses.length > 0) setSelectedClassId(String(taughtClasses[0].id_kelas));
        if (taughtSubjects.length > 0) setSelectedSubjectId(String(taughtSubjects[0].id_mapel));

        const activeP = allPeriods.find((p) => p.status === 'Aktif') || allPeriods[0];
        if (activeP) setSelectedPeriodId(String(activeP.id_tahun_ajaran));
      } catch (err: any) {
        showToast(err.message || 'Gagal memuat informasi guru.', 'error');
      } finally {
        setIsLoadingMeta(false);
      }
    };
    fetchMetadata();
  }, [user]);

  // Load students and existing grades when Class or Subject or Period changes
  useEffect(() => {
    const fetchRosterAndGrades = async () => {
      if (!selectedClassId || !selectedSubjectId || !selectedPeriodId) return;

      try {
        setIsLoadingStudents(true);
        const [classDetail, existingGrades] = await Promise.all([
          api.get(`/kelas/${selectedClassId}`),
          api.get<any[]>('/nilai', {
            id_kelas: selectedClassId,
            id_mapel: selectedSubjectId,
            id_tahun_ajaran: selectedPeriodId,
          }),
        ]);

        const students = classDetail.siswa || [];
        const gradeMap = new Map<string, any>();
        existingGrades.forEach((g) => gradeMap.set(g.nis, g));

        const rows: StudentGradeRow[] = students.map((s: any) => {
          const existing = gradeMap.get(s.nis);
          const t = existing ? existing.nilai_tugas : 80;
          const m = existing ? existing.nilai_uts : 80;
          const a = existing ? existing.nilai_uas : 80;
          const { akhir, predikat, status } = calcGrade(t, m, a);

          return {
            nis: s.nis,
            nama_siswa: s.nama_siswa,
            nilai_tugas: t,
            nilai_uts: m,
            nilai_uas: a,
            nilai_akhir: akhir,
            predikat,
            status,
            isDirty: false,
          };
        });

        setStudentRows(rows);
      } catch (err: any) {
        showToast(err.message || 'Gagal memuat nilai siswa.', 'error');
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchRosterAndGrades();
  }, [selectedClassId, selectedSubjectId, selectedPeriodId]);

  const handleScoreChange = (
    index: number,
    field: 'nilai_tugas' | 'nilai_uts' | 'nilai_uas',
    rawVal: string
  ) => {
    const num = Math.min(100, Math.max(0, parseFloat(rawVal) || 0));

    setStudentRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: num, isDirty: true };
      const { akhir, predikat, status } = calcGrade(row.nilai_tugas, row.nilai_uts, row.nilai_uas);
      row.nilai_akhir = akhir;
      row.predikat = predikat;
      row.status = status;
      updated[index] = row;
      return updated;
    });
  };

  const handleBatchSave = async () => {
    if (!user?.id_guru || !selectedPeriodId || !selectedSubjectId) return;

    setIsSaving(true);
    try {
      const payload = {
        id_tahun_ajaran: parseInt(selectedPeriodId, 10),
        id_guru: user.id_guru,
        id_mapel: parseInt(selectedSubjectId, 10),
        grades: studentRows.map((r) => ({
          nis: r.nis,
          nilai_tugas: r.nilai_tugas,
          nilai_uts: r.nilai_uts,
          nilai_uas: r.nilai_uas,
        })),
      };

      await api.post('/nilai/batch', payload);
      showToast('Seluruh nilai siswa berhasil disimpan!', 'success');
      setStudentRows((prev) => prev.map((r) => ({ ...r, isDirty: false })));
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan nilai.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingMeta) {
    return <LoadingState message="Memuat form input nilai..." />;
  }

  if (classes.length === 0 || subjects.length === 0) {
    return (
      <EmptyState
        icon={<Award className="w-10 h-10 text-muted-foreground/60" />}
        title="Tidak Ada Penugasan Mengajar"
        description="Anda belum memiliki kelas atau mata pelajaran yang ditugaskan untuk menginput nilai."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Input Nilai Siswa</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Pilih kelas dan mata pelajaran, lalu input nilai tugas, UTS, dan UAS
          </p>
        </div>

        <Button
          onClick={handleBatchSave}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
          size="md"
        >
          Simpan Semua Nilai
        </Button>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-border bg-card">
        <Select
          label="Pilih Kelas"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          options={classes.map((c) => ({
            value: c.id_kelas,
            label: `${c.nama_kelas} (${c.jurusan?.kode_jurusan})`,
          }))}
        />

        <Select
          label="Pilih Mata Pelajaran"
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          options={subjects.map((s) => ({
            value: s.id_mapel,
            label: `${s.nama_mapel} (${s.kode_mapel})`,
          }))}
        />

        <Select
          label="Tahun Ajaran & Semester"
          value={selectedPeriodId}
          onChange={(e) => setSelectedPeriodId(e.target.value)}
          options={periods.map((p) => ({
            value: p.id_tahun_ajaran,
            label: `${p.tahun_ajaran} (${p.semester}) ${p.status === 'Aktif' ? '★' : ''}`,
          }))}
        />
      </div>

      {/* Grades Input Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Formulir Penilaian Rombel
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bobot Otomatis: Tugas 30% &bull; UTS 30% &bull; UAS 40%
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Total {studentRows.length} Siswa
          </span>
        </CardHeader>
        <CardContent>
          {isLoadingStudents ? (
            <LoadingState message="Memuat daftar siswa dan nilai..." rows={4} />
          ) : studentRows.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Tidak ada siswa di kelas ini.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead className="w-28">NIS</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead className="w-28 text-center">Tugas (30%)</TableHead>
                  <TableHead className="w-28 text-center">UTS (30%)</TableHead>
                  <TableHead className="w-28 text-center">UAS (40%)</TableHead>
                  <TableHead className="w-28 text-center">Nilai Akhir</TableHead>
                  <TableHead className="w-24 text-center">Predikat</TableHead>
                  <TableHead className="w-24 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentRows.map((row, idx) => (
                  <TableRow key={row.nis} className={row.isDirty ? 'bg-primary/5' : ''}>
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold">{row.nis}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-foreground text-sm">{row.nama_siswa}</span>
                      {row.isDirty && (
                        <span className="ml-2 text-[10px] text-amber-600 font-medium">
                          (Belum disimpan)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={row.nilai_tugas}
                        onChange={(e) => handleScoreChange(idx, 'nilai_tugas', e.target.value)}
                        className="w-20 px-2 py-1 text-center font-mono text-sm border border-border rounded-md bg-background focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={row.nilai_uts}
                        onChange={(e) => handleScoreChange(idx, 'nilai_uts', e.target.value)}
                        className="w-20 px-2 py-1 text-center font-mono text-sm border border-border rounded-md bg-background focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={row.nilai_uas}
                        onChange={(e) => handleScoreChange(idx, 'nilai_uas', e.target.value)}
                        className="w-20 px-2 py-1 text-center font-mono text-sm border border-border rounded-md bg-background focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </TableCell>
                    <TableCell className="text-center font-mono font-bold text-sm text-primary">
                      {row.nilai_akhir}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={row.predikat === 'A' ? 'emerald' : row.predikat === 'B' ? 'blue' : 'amber'}
                        size="sm"
                      >
                        {row.predikat}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={row.status === 'Lulus' ? 'emerald' : 'rose'}
                        size="sm"
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Bottom Save Action Bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Nilai akhir terhitung otomatis berdasarkan rumus pembobotan resmi.</span>
            </div>
            <Button
              onClick={handleBatchSave}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Simpan Semua Nilai
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
