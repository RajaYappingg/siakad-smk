import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  BookMarked,
  Lock,
  User,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
  GraduationCap,
  Users,
  ArrowLeft,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const navigateToRoleDashboard = (role: string) => {
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'GURU') navigate('/guru/dashboard');
    else navigate('/siswa/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      showToast('Mohon isi email/NIP/NIS dan kata sandi.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const loggedUser = await login(identifier, password);
      showToast('Login berhasil! Selamat datang di SIAKAD.', 'success');
      navigateToRoleDashboard(loggedUser.role);
    } catch (error: any) {
      showToast(error.message || 'Gagal masuk. Periksa kembali data Anda.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoId: string, demoPass: string) => {
    setIdentifier(demoId);
    setPassword(demoPass);
    setIsLoading(true);
    try {
      const loggedUser = await login(demoId, demoPass);
      showToast('Masuk dengan akun demo berhasil.', 'success');
      navigateToRoleDashboard(loggedUser.role);
    } catch (error: any) {
      showToast(error.message || 'Gagal masuk akun demo.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative select-none">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1 rounded-lg border border-border bg-card">
        <button
          onClick={() => setTheme('light')}
          className={`p-1.5 rounded-md text-xs transition-colors ${
            theme === 'light' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Mode Terang"
        >
          <Sun className="w-4 h-4 text-amber-500" />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`p-1.5 rounded-md text-xs transition-colors ${
            theme === 'dark' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Mode Gelap"
        >
          <Moon className="w-4 h-4 text-blue-400" />
        </button>
        <button
          onClick={() => setTheme('system')}
          className={`p-1.5 rounded-md text-xs transition-colors ${
            theme === 'system' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Ikuti Sistem"
        >
          <Monitor className="w-4 h-4 text-primary" />
        </button>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Back to landing page */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda Utama
          </Link>
        </div>

        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-md shadow-primary/25 mb-1">
            <BookMarked className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">SIAKAD Sekolah</h1>
          <p className="text-sm text-muted-foreground">
            Sistem Informasi Akademik Terpadu SMK
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                label="Email, NIP, atau NIS"
                placeholder="nama@example.com / NIP / NIS"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
                autoFocus
              />
            </div>

            <div>
              <Input
                label="Kata Sandi"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
            >
              Masuk ke Akun
            </Button>
          </form>

          {/* Demo account quick login box */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs font-semibold text-center text-muted-foreground mb-3">
              Coba Langsung dengan Akun Demo:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@example.com', 'admin123')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-border bg-muted/40 hover:bg-muted hover:border-primary/40 transition-colors text-center group"
              >
                <ShieldCheck className="w-4 h-4 text-primary mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground">Admin</span>
                <span className="text-[10px] text-muted-foreground">admin123</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('guru@example.com', 'guru123')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-border bg-muted/40 hover:bg-muted hover:border-primary/40 transition-colors text-center group"
              >
                <GraduationCap className="w-4 h-4 text-primary mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground">Guru</span>
                <span className="text-[10px] text-muted-foreground">guru123</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('siswa@example.com', 'siswa123')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-border bg-muted/40 hover:bg-muted hover:border-primary/40 transition-colors text-center group"
              >
                <Users className="w-4 h-4 text-primary mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground">Siswa</span>
                <span className="text-[10px] text-muted-foreground">siswa123</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground">
          SIAKAD &bull; Dibangun dengan standar modern & keandalan tinggi
        </p>
      </div>
    </div>
  );
};
