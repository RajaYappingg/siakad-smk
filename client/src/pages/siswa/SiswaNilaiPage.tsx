import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { TahunAjaran } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Award, Printer, Sparkles, CheckCircle2 } from 'lucide-react';

export const SiswaNilaiPage: React.FC = () => {
  const { user } = useAuth();
  const [periods, setPeriods] = useState<TahunAjaran[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const res = await api.get<TahunAjaran[]>('/tahun-ajaran');
        setPeriods(res);
        const activeP = res.find((p) => p.status === 'Aktif') || res[0];
        if (activeP) {
          setSelectedPeriodId(String(activeP.id_tahun_ajaran));
        }
      } catch (err: any) {
        showToast(err.message || 'Gagal memuat periode tahun ajaran.', 'error');
      }
    };
    fetchPeriods();
  }, []);

  useEffect(() => {
    const fetchRaport = async () => {
      if (!user?.nis) return;
      try {
        setIsLoading(true);
        const res = await api.get(`/nilai/raport/${user.nis}`, {
          id_tahun_ajaran: selectedPeriodId,
        });
        setReportData(res);
      } catch (err: any) {
        showToast(err.message || 'Gagal memuat raport siswa.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.nis) {
      fetchRaport();
    }
  }, [user, selectedPeriodId]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <LoadingState message="Memuat lembar raport siswa..." />;
  }

  const grades = reportData?.nilai || [];
  const stats = reportData?.statistik || {};
  const student = reportData?.siswa || user?.siswa;

  const activePeriod = periods.find((p) => String(p.id_tahun_ajaran) === selectedPeriodId);

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Laporan Hasil Belajar (Raport)</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Rekapitulasi pencapaian kompetensi akademik siswa
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-56">
            <Select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              options={periods.map((p) => ({
                value: p.id_tahun_ajaran,
                label: `${p.tahun_ajaran} (${p.semester}) ${p.status === 'Aktif' ? '★' : ''}`,
              }))}
            />
          </div>

          <Button variant="outline" size="md" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Cetak Raport
          </Button>
        </div>
      </div>

      {/* Raport Sheet Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs print:border-none print:shadow-none print:p-0 space-y-6">
        {/* School & Student Identification Header */}
        <div className="border-b border-border pb-6 space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-foreground">
              SMK NEGERI INDONESIA
            </h1>
            <p className="text-xs text-muted-foreground">
              LAPORAN HASIL CAPAIAN KOMPETENSI PESERTA DIDIK
            </p>
            <p className="text-xs font-semibold text-primary">
              Tahun Ajaran {activePeriod?.tahun_ajaran} &bull; Semester {activePeriod?.semester}
            </p>
          </div>

          {/* Student Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/20 border border-border/60 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Nama Peserta Didik</span>
              <span className="font-bold text-foreground text-sm">{student?.nama_siswa}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Nomor Induk Siswa (NIS)</span>
              <span className="font-mono font-semibold text-foreground">{student?.nis}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Kelas / Rombel</span>
              <span className="font-semibold text-foreground">{student?.kelas?.nama_kelas}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Program Keahlian</span>
              <span className="font-semibold text-foreground">{student?.kelas?.jurusan?.nama_jurusan}</span>
            </div>
          </div>
        </div>

        {/* Statistical Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
          <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Rata-Rata Nilai Akhir</p>
                <h3 className="text-2xl font-bold text-primary">{stats.rataRata || 0}</h3>
              </div>
              <Sparkles className="w-8 h-8 text-primary opacity-80" />
            </CardContent>
          </Card>

          <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Predikat Capaian</p>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.predikat || '-'}
                </h3>
              </div>
              <Badge variant="emerald">{stats.keterangan || '-'}</Badge>
            </CardContent>
          </Card>

          <Card className="bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Status Akademik</p>
                <h3 className="text-xl font-bold text-foreground">
                  {stats.status || 'Lulus'}
                </h3>
              </div>
              <CheckCircle2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 opacity-80" />
            </CardContent>
          </Card>
        </div>

        {/* Grades Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Daftar Nilai Capaian Belajar
          </h3>

          {grades.length === 0 ? (
            <EmptyState
              icon={<Award className="w-10 h-10 text-muted-foreground/60" />}
              title="Belum Ada Nilai Masuk"
              description="Belum ada guru yang memasukkan nilai untuk periode tahun ajaran yang dipilih."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>Guru Pengampu</TableHead>
                  <TableHead className="w-20 text-center">Tugas (30%)</TableHead>
                  <TableHead className="w-20 text-center">UTS (30%)</TableHead>
                  <TableHead className="w-20 text-center">UAS (40%)</TableHead>
                  <TableHead className="w-24 text-center font-bold">Nilai Akhir</TableHead>
                  <TableHead className="w-20 text-center">Predikat</TableHead>
                  <TableHead className="w-24 text-center">Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((item: any, idx: number) => (
                  <TableRow key={item.id_nilai}>
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-foreground text-sm">{item.mataPelajaran?.nama_mapel}</p>
                      <span className="text-[11px] text-muted-foreground">{item.mataPelajaran?.kelompok}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.guru?.nama_guru}
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">{item.nilai_tugas}</TableCell>
                    <TableCell className="text-center font-mono text-xs">{item.nilai_uts}</TableCell>
                    <TableCell className="text-center font-mono text-xs">{item.nilai_uas}</TableCell>
                    <TableCell className="text-center font-mono font-bold text-sm text-primary">
                      {item.nilai_akhir}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={item.predikat === 'A' ? 'emerald' : item.predikat === 'B' ? 'blue' : 'amber'}
                        size="sm"
                      >
                        {item.predikat}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-xs font-medium text-foreground">
                        {item.keterangan}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Legend / Predicate table */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Keterangan Rentang Nilai Predikat:</p>
            <p>
              A: 88–100 (Sangat Baik) &bull; B: 78–87 (Baik) &bull; C: 70–77 (Cukup) &bull; D: &lt; 70 (Perlu Bimbingan)
            </p>
          </div>
          <div className="text-right sm:border-l border-border sm:pl-4">
            <p className="text-[11px]">Rumus Resmi:</p>
            <p className="font-mono text-foreground font-semibold text-xs">
              Nilai Akhir = (Tugas × 30%) + (UTS × 30%) + (UAS × 40%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
