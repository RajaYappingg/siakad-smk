import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Kelas } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { GraduationCap, Users } from 'lucide-react';

export const GuruKelasPage: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Kelas[]>([]);
  const [selectedClass, setSelectedClass] = useState<Kelas | null>(null);
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchTeacherClasses = async () => {
      if (!user?.id_guru) return;
      try {
        setIsLoading(true);
        const res = await api.get(`/guru/${user.id_guru}`);
        const taughtClasses = res.kelasYangDiajar || [];
        setClasses(taughtClasses);
        if (taughtClasses.length > 0) {
          selectClass(taughtClasses[0]);
        }
      } catch (err: any) {
        showToast(err.message || 'Gagal memuat data kelas yang diajar.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeacherClasses();
  }, [user]);

  const selectClass = async (cls: Kelas) => {
    setSelectedClass(cls);
    try {
      setIsLoadingStudents(true);
      const detail = await api.get(`/kelas/${cls.id_kelas}`);
      setClassStudents(detail.siswa || []);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengambil data siswa kelas.', 'error');
    } finally {
      setIsLoadingStudents(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Memuat daftar kelas yang diajar..." />;
  }

  if (classes.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap className="w-10 h-10 text-muted-foreground/60" />}
        title="Belum Memiliki Kelas Ajar"
        description="Anda belum terdaftar mengajar di kelas manapun. Hubungi administrator kurikulum untuk penugasan kelas."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Kelas Saya</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Daftar rombel dan data peserta didik yang Anda ampu
        </p>
      </div>

      {/* Class Selector Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {classes.map((cls) => {
          const isSelected = selectedClass?.id_kelas === cls.id_kelas;
          return (
            <button
              key={cls.id_kelas}
              onClick={() => selectClass(cls)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-card text-foreground border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold opacity-80">Tingkat {cls.tingkat}</span>
                <Users className="w-4 h-4 opacity-70" />
              </div>
              <h3 className="font-bold text-base">{cls.nama_kelas}</h3>
              <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-blue-100' : 'text-muted-foreground'}`}>
                {cls.jurusan?.nama_jurusan}
              </p>
            </button>
          );
        })}
      </div>

      {/* Students in Selected Class */}
      {selectedClass && (
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Daftar Siswa di {selectedClass.nama_kelas}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Total {classStudents.length} siswa terdaftar pada kelas ini
              </p>
            </div>
            <Badge variant="blue">Tingkat {selectedClass.tingkat}</Badge>
          </CardHeader>
          <CardContent>
            {isLoadingStudents ? (
              <LoadingState message="Memuat data siswa..." rows={3} />
            ) : classStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Belum ada siswa yang ditempatkan di kelas ini.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">No</TableHead>
                    <TableHead className="w-32">NIS</TableHead>
                    <TableHead>Nama Lengkap Siswa</TableHead>
                    <TableHead className="w-28 text-center">Jenis Kelamin</TableHead>
                    <TableHead>Alamat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.map((s, idx) => (
                    <TableRow key={s.nis}>
                      <TableCell className="text-center font-mono text-xs text-muted-foreground">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold">{s.nis}</TableCell>
                      <TableCell className="font-semibold text-foreground">{s.nama_siswa}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={s.jenis_kelamin === 'L' ? 'blue' : 'rose'} size="sm">
                          {s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{s.alamat}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
