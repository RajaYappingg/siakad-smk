import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import {
  X,
  ShieldCheck,
  GraduationCap,
  Users,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'ADMIN' | 'GURU' | 'SISWA';
}

interface DemoOption {
  role: 'ADMIN' | 'GURU' | 'SISWA';
  label: string;
  email: string;
  pass: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeText: string;
  description: string;
  features: string[];
}

const DEMO_OPTIONS: DemoOption[] = [
  {
    role: 'ADMIN',
    label: 'Administrator Sekolah',
    email: 'admin@example.com',
    pass: 'admin123',
    icon: ShieldCheck,
    badgeText: 'Akses Lengkap Master Data',
    description: 'Akses seluruh data pokok sekolah, rombel, jadwal, kurikulum, dan akun.',
    features: [
      'Kelola Jurusan, Kelas, Siswa & Guru',
      'Atur Jadwal Anti-Bentrok & Ruangan',
      'Kunci Periode & Tahun Ajaran Aktif',
      'Audit Rekapitulasi Nilai Seluruh Rombel',
    ],
  },
  {
    role: 'GURU',
    label: 'Tenaga Pendidik (Guru)',
    email: 'guru@example.com',
    pass: 'guru123',
    icon: GraduationCap,
    badgeText: 'Portal Pengajar & Nilai',
    description: 'Lihat jadwal mengajar mingguan dan input nilai rombel secara instan.',
    features: [
      'Jadwal Mengajar Interaktif Hari Ini',
      'Daftar Rombongan Belajar yang Diampu',
      'Input Nilai Tugas (30%), UTS (30%), UAS (40%)',
      'Simpan Nilai Massal & Kalkulasi Predikat',
    ],
  },
  {
    role: 'SISWA',
    label: 'Peserta Didik (Siswa)',
    email: 'siswa@example.com',
    pass: 'siswa123',
    icon: Users,
    badgeText: 'Portal Raport & Jadwal',
    description: 'Pantau jadwal pelajaran harian dan transkrip nilai e-raport resmi.',
    features: [
      'Jadwal Pelajaran Real-time per Hari',
      'Transkrip Nilai Akademik Lengkap',
      'Predikat Capaian (A / B / C / D)',
      'Lembar E-Raport Resmi Siap Cetak PDF',
    ],
  },
];

export const QuickDemoModal: React.FC<QuickDemoModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'ADMIN',
}) => {
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'GURU' | 'SISWA'>(defaultRole);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const currentOption = DEMO_OPTIONS.find((opt) => opt.role === selectedRole) || DEMO_OPTIONS[0];

  const handleLaunchDemo = async () => {
    setIsLoading(true);
    try {
      const loggedUser = await login(currentOption.email, currentOption.pass);
      showToast(`Berhasil masuk sebagai ${currentOption.label}!`, 'success');
      onClose();
      if (loggedUser.role === 'ADMIN') navigate('/admin/dashboard');
      else if (loggedUser.role === 'GURU') navigate('/guru/dashboard');
      else navigate('/siswa/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Gagal masuk ke akun demo.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl bg-zinc-900 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Uji Coba SIAKAD
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Pilih peran untuk mengeksplorasi tanpa registrasi.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Role Selector */}
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                {DEMO_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedRole === opt.role;
                  return (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => setSelectedRole(opt.role)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-indigo-500/10 text-white border border-indigo-500/30'
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : ''}`} />
                      <span>{opt.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Role Card */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <currentOption.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{currentOption.label}</h3>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {currentOption.badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{currentOption.description}</p>
                    </div>
                  </div>
                </div>

                {/* Credentials */}
                <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Kredensial terisi otomatis:</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06] font-semibold text-white">
                      {currentOption.email}
                    </span>
                    <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-500">
                      {currentOption.pass}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <p className="text-xs font-semibold text-zinc-300 mb-2.5">Fitur yang Dapat Diuji:</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {currentOption.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-zinc-600 text-center sm:text-left">
                Berganti peran kapan saja melalui menu profil.
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-white rounded-xl border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleLaunchDemo}
                  disabled={isLoading}
                  className="w-1/2 sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-400 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Membuka...</span>
                    </>
                  ) : (
                    <>
                      <span>Buka Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
