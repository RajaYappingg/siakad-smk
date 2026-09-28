import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { User, Lock, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordLama || !passwordBaru) {
      showToast('Mohon isi kata sandi lama dan kata sandi baru.', 'warning');
      return;
    }
    if (passwordBaru.length < 6) {
      showToast('Kata sandi baru minimal 6 karakter.', 'warning');
      return;
    }
    if (passwordBaru !== konfirmasiPassword) {
      showToast('Konfirmasi kata sandi baru tidak sesuai.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/change-password', {
        password_lama: passwordLama,
        password_baru: passwordBaru,
      });
      showToast('Kata sandi berhasil diperbarui!', 'success');
      setPasswordLama('');
      setPasswordBaru('');
      setKonfirmasiPassword('');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah kata sandi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Profil Pengguna</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Informasi akun dan pengaturan keamanan kata sandi Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: User Identity Card */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-primary/15 text-primary font-bold text-3xl flex items-center justify-center uppercase">
              {user?.nama?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">{user?.nama}</h3>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Badge variant="blue" size="md">
              Peran: {user?.role}
            </Badge>

            <div className="w-full pt-4 border-t border-border space-y-2 text-left text-xs">
              {user?.role === 'GURU' && user.guru && (
                <>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">NIP Guru:</span>
                    <span className="font-mono font-semibold text-foreground">{user.guru.nip}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">No. Telepon:</span>
                    <span className="font-mono text-foreground">{user.guru.no_hp}</span>
                  </div>
                </>
              )}

              {user?.role === 'SISWA' && user.siswa && (
                <>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">NIS Siswa:</span>
                    <span className="font-mono font-semibold text-foreground">{user.siswa.nis}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Kelas:</span>
                    <span className="font-semibold text-foreground">{user.siswa.kelas?.nama_kelas}</span>
                  </div>
                </>
              )}

              {user?.role === 'ADMIN' && (
                <div className="p-2.5 rounded-lg bg-muted/40 text-muted-foreground text-[11px]">
                  Akun ini memiliki hak akses administrator penuh ke seluruh data master dan konfigurasi sistem.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right: Security / Change Password Form */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Ubah Kata Sandi
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Perbarui kata sandi Anda secara berkala demi menjaga keamanan akun
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label="Kata Sandi Saat Ini"
                  type="password"
                  placeholder="Masukkan kata sandi lama"
                  value={passwordLama}
                  onChange={(e) => setPasswordLama(e.target.value)}
                  required
                />

                <Input
                  label="Kata Sandi Baru"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  required
                />

                <Input
                  label="Konfirmasi Kata Sandi Baru"
                  type="password"
                  placeholder="Ketik ulang kata sandi baru"
                  value={konfirmasiPassword}
                  onChange={(e) => setKonfirmasiPassword(e.target.value)}
                  required
                />

                <div className="pt-2 flex justify-end">
                  <Button type="submit" isLoading={isSubmitting} size="sm">
                    Perbarui Kata Sandi
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-muted/20">
            <CardContent className="p-5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Kebijakan Keamanan dan Hak Akses</p>
                <p>
                  Identitas resmi guru dan siswa dikelola secara terpusat oleh pihak administrasi sekolah guna memastikan validitas data raport dan jadwal resmi.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
