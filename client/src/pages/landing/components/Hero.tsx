import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
} from 'lucide-react';

interface HeroProps {
  onOpenDemo: () => void;
}

const TRUST_BADGES = [
  'Multi-Peran RBAC',
  'Anti-Bentrok Jadwal 3 Arah',
  'E-Raport PDF Standar',
  'Light & Dark Mode',
];

const METRICS = [
  { label: 'Total Siswa', value: '1.247', icon: Users, color: 'text-indigo-400' },
  { label: 'Guru Aktif', value: '86', icon: GraduationCap, color: 'text-violet-400' },
  { label: 'Rombel', value: '42', icon: BookOpen, color: 'text-sky-400' },
  { label: 'Kehadiran', value: '98.4%', icon: Calendar, color: 'text-emerald-400' },
];

export const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {
  return (
    <section className="relative pt-32 sm:pt-44 pb-20 sm:pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/[0.15] blur-[120px] rounded-full" />
        {/* Secondary glow */}
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-violet-500/[0.08] blur-[100px] rounded-full" />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(148,163,184,0.15) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Announcement Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] mb-8"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-zinc-400">Standar Baru Tata Kelola SMK</span>
            <span className="text-zinc-700">•</span>
            <span className="text-sm text-indigo-400">Kurikulum Merdeka</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            <span className="text-white">Transformasi Akademik SMK yang </span>
            <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400">
              Cerdas & Terintegrasi.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mt-6"
          >
            Platform all-in-one untuk kepala sekolah, guru, dan siswa. Hapus
            administrasi manual, jadwal bentrok, dan chaos penilaian — semua
            dalam satu sistem cerdas.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <button
              onClick={onOpenDemo}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-indigo-500 hover:bg-indigo-400 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200"
            >
              Mulai Demo Gratis
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl transition-all duration-200"
            >
              Masuk ke Portal
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10"
          >
            {TRUST_BADGES.map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-sm text-zinc-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-5xl mx-auto mt-16 sm:mt-20 relative"
        >
          {/* Outer glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-violet-500/15 to-sky-500/20 rounded-3xl blur-2xl opacity-60" />

          {/* Main container */}
          <div className="relative rounded-2xl border border-white/[0.1] bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-2xl">
            {/* Browser bar */}
            <div className="h-10 sm:h-12 bg-zinc-900/80 border-b border-white/[0.06] flex items-center px-4 gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="max-w-md mx-auto h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <span className="text-[11px] text-zinc-600 font-mono">
                    siakad-smk.app/admin/dashboard
                  </span>
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Stat cards row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {METRICS.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div
                      key={metric.label}
                      className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 sm:p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-zinc-500">{metric.label}</span>
                        <Icon className={`w-4 h-4 ${metric.color}`} />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white">{metric.value}</div>
                    </div>
                  );
                })}
              </div>

              {/* Mini schedule table */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/[0.04]">
                  <span className="text-xs font-medium text-zinc-500">
                    Jadwal Hari Ini — Senin, 28 September 2026
                  </span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {[
                    { time: '07:30', subject: 'Pemrograman Web', class: 'XI PPLG 1', room: 'Lab Komputer 1' },
                    { time: '09:15', subject: 'Basis Data', class: 'XII PPLG 2', room: 'Lab Komputer 2' },
                    { time: '10:45', subject: 'Matematika', class: 'X PPLG 1', room: 'Kelas 101' },
                  ].map((row) => (
                    <div key={row.time} className="flex items-center gap-4 px-4 py-2.5 text-xs">
                      <span className="font-mono text-indigo-400 w-12">{row.time}</span>
                      <span className="text-white font-medium flex-1">{row.subject}</span>
                      <span className="text-zinc-500 hidden sm:block">{row.class}</span>
                      <span className="text-zinc-600 hidden lg:block">{row.room}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating micro-cards */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute -right-2 sm:-right-6 -top-3 sm:-top-5 hidden sm:flex items-center gap-2 bg-zinc-900 border border-white/[0.12] rounded-xl p-3 shadow-2xl shadow-black/50"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-zinc-300 font-medium whitespace-nowrap">
              Sinkronisasi Nilai Berhasil ✓
            </span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -left-2 sm:-left-6 -bottom-3 sm:-bottom-5 hidden sm:flex items-center gap-2 bg-zinc-900 border border-white/[0.12] rounded-xl p-3 shadow-2xl shadow-black/50"
          >
            <Zap className="w-4 h-4 text-sky-400" />
            <span className="text-xs text-zinc-300 font-medium whitespace-nowrap">
              Jadwal Bebas Bentrok ⚡
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
