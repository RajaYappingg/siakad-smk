import React from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, ArrowUp, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand & Overview Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <BookMarked className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SIAKAD</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                SMK
              </span>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Sistem Informasi Akademik Sekolah Menengah Kejuruan generasi baru. 
              Menghilangkan hambatan birokrasi manual dengan integrasi jadwal cerdas, 
              otomasi e-rapor, dan manajemen kemitraan industri (BKK).
            </p>

            {/* Tech Badges */}
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-zinc-500">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                React 19
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                TypeScript
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                Prisma ORM
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                MariaDB
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                Tailwind CSS
              </span>
            </div>
          </div>

          {/* Nav Links Column: Navigasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button
                  onClick={() => scrollTo('#fitur')}
                  className="hover:text-white transition-colors"
                >
                  Fitur Unggulan
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('#solusi')}
                  className="hover:text-white transition-colors"
                >
                  Solusi Peran
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('#kalkulator')}
                  className="hover:text-white transition-colors"
                >
                  Kalkulator Anggaran
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('#harga')}
                  className="hover:text-white transition-colors"
                >
                  Paket & Biaya
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('#faq')}
                  className="hover:text-white transition-colors"
                >
                  Tanya Jawab
                </button>
              </li>
            </ul>
          </div>

          {/* Access Portals Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
              Akses Portal
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Portal Administrator
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Portal Guru & Wali Kelas
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Portal Peserta Didik
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Akses Demo Cepat
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
              Standar & Kepatuhan
            </h4>
            <div className="space-y-2 text-xs text-zinc-400 leading-relaxed">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Format Standar Kemendikbud</span>
              </div>
              <p className="text-zinc-500 text-[11px]">
                Kompatibel dengan struktur kurikulum Merdeka SMK dan sinkronisasi data pokok pendidikan (Dapodik).
              </p>
              <div className="pt-2 text-[11px] text-zinc-500">
                Penyimpanan data lokal di server Indonesia sesuai regulasi perlindungan data pribadi (UU PDP).
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© 2026 SIAKAD SMK Indonesia. Semua hak cipta dilindungi undang-undang.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-zinc-500">
              Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk Vokasi Indonesia
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
              title="Kembali ke atas"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
