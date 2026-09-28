import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  GraduationCap,
  Users,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface TabItem {
  id: 'kepsek' | 'guru' | 'siswa';
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  features: {
    title: string;
    description: string;
  }[];
}

const TABS: TabItem[] = [
  {
    id: 'kepsek',
    label: 'Kepala Sekolah & Manajemen',
    sublabel: 'Pengambilan keputusan strategis berbasis data',
    icon: ShieldCheck,
    features: [
      {
        title: 'Executive Analytics & KPI Dashboard',
        description: 'Pantau metrik tingkat kehadiran agregat, rata-rata capaian kompetensi, dan tren kelulusan secara real-time.',
      },
      {
        title: 'Laporan Akreditasi & Standar BNSP Otomatis',
        description: 'Ekspor berkas instrumen akreditasi sekolah dan portofolio kejuruan tanpa kompilasi lembaran dokumen fisik.',
      },
      {
        title: 'Monitoring Kinerja Guru & Kehadiran Mengajar',
        description: 'Ketahui kepatuhan jam mengajar guru sesuai jadwal dan progres input nilai per semester tanpa harus sidak kelas.',
      },
      {
        title: 'Transparansi Realisasi BOS & Kas SPP',
        description: 'Rekapitulasi penerimaan dana SPP dan anggaran operasional pembelajaran vokasi dalam satu tampilan terpadu.',
      },
    ],
  },
  {
    id: 'guru',
    label: 'Guru & Wali Kelas',
    sublabel: 'Otomasi administrasi tanpa beban lembur',
    icon: GraduationCap,
    features: [
      {
        title: 'Input Nilai Massal Sekali Klik',
        description: 'Unggah atau input nilai tugas (30%), UTS (30%), dan UAS (40%) untuk 36 siswa rombel secara instan dengan auto-predikat.',
      },
      {
        title: 'Jadwal Mengajar Harian Interaktif',
        description: 'Tampilan linimasa mengajar hari ini lengkap dengan nomor ruangan lab, materi ajar, dan status presensi kelas.',
      },
      {
        title: 'E-Raport Otomatis Sesuai Kurikulum Merdeka',
        description: 'Deskripsi capaian tujuan pembelajaran (TP) digenerate secara otomatis berdasarkan capaian kompetensi siswa.',
      },
      {
        title: 'Pencatatan Kehadiran Siswa Cepat',
        description: 'Presensi kelas cepat (Hadir, Sakit, Izin, Alpa) yang otomatis terintegrasi ke notifikasi wali murid.',
      },
    ],
  },
  {
    id: 'siswa',
    label: 'Siswa & Wali Murid',
    sublabel: 'Transparansi akademik di genggaman tangan',
    icon: Users,
    features: [
      {
        title: 'Jadwal Pelajaran Real-Time di Smartphone',
        description: 'Akses jadwal harian, info pergantian jam pelajaran atau ruangan lab tanpa perlu mencatat di buku agenda.',
      },
      {
        title: 'Transkrip Nilai & Capaian Belajar Transparan',
        description: 'Pantau akumulasi nilai tugas, kuis, dan ujian tengah semester secara berkala sebelum pembagian rapor.',
      },
      {
        title: 'Cetak E-Raport PDF Kualitas A4 Mandiri',
        description: 'Unduh lembaran rapor berkala dengan format resmi bertanda tangan digital langsung dari portal kapan saja.',
      },
      {
        title: 'Notifikasi Kehadiran & Status Tagihan SPP',
        description: 'Wali murid menerima kabar kedatangan siswa di sekolah serta link pembayaran SPP yang aman dan praktis.',
      },
    ],
  },
];

export const FeatureTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kepsek' | 'guru' | 'siswa'>('kepsek');

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <section id="solusi" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Pengalaman Khusus Pemangku Kepentingan
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Satu Sistem,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-sky-400">
              Tiga Alur Kerja Optimal
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed"
          >
            Dirancang secara modular dengan antarmuka yang disesuaikan untuk kebutuhan spesifik
            kepala sekolah, dewan guru, hingga peserta didik.
          </motion.p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/25 border border-indigo-400/30 scale-[1.02]'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-white/[0.08]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="max-w-6xl mx-auto rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl p-6 sm:p-10 lg:p-12 shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Feature List */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Modul Alur Kerja
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {currentTab.label}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    {currentTab.sublabel}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {currentTab.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all flex items-start gap-3.5"
                    >
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-0.5">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Tailored UI Mockup */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-white/[0.1] bg-zinc-950/80 p-5 sm:p-6 shadow-2xl">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500" />
                      <span className="text-xs font-mono text-zinc-400 font-semibold">
                        {activeTab === 'kepsek' && 'siakad://eksekutif/rekap-kinerja'}
                        {activeTab === 'guru' && 'siakad://guru/input-nilai-massal'}
                        {activeTab === 'siswa' && 'siakad://siswa/transkrip-dan-raport'}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      Live Sync
                    </span>
                  </div>

                  {/* Mockup Body: Tab Specific */}
                  {activeTab === 'kepsek' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <div className="text-[11px] text-zinc-500">Rerata Nilai Uji Vokasi</div>
                          <div className="text-xl font-bold text-white font-mono mt-1">87.4</div>
                          <div className="text-[10px] text-emerald-400 mt-0.5">+4.2% vs Semester Lalu</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <div className="text-[11px] text-zinc-500">Serapan Lulusan BKK</div>
                          <div className="text-xl font-bold text-indigo-400 font-mono mt-1">94.8%</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">Mitra Astra, Telkom, Epson</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>Kelengkapan Rapor 8 Rombel:</span>
                          <span className="font-mono text-emerald-400 font-bold">100% Selesai</span>
                        </div>
                        <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full w-full" />
                        </div>
                        <div className="text-[11px] text-zinc-500 flex justify-between">
                          <span>Semua 36 guru telah mengunci nilai</span>
                          <span>Tepat Waktu</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'guru' && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs flex justify-between items-center">
                        <span className="text-indigo-300 font-semibold">Kelas: XII PPLG 1 • Pemrograman Web</span>
                        <span className="text-[11px] text-zinc-400">Semester Ganjil 2026/2027</span>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-white/[0.03] text-zinc-500 border-b border-white/[0.06]">
                            <tr>
                              <th className="p-2.5">Nama Siswa</th>
                              <th className="p-2.5 text-center">Tugas (30%)</th>
                              <th className="p-2.5 text-center">UTS (30%)</th>
                              <th className="p-2.5 text-center">UAS (40%)</th>
                              <th className="p-2.5 text-center">Akhir</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                            <tr>
                              <td className="p-2.5 font-medium text-white">Bagas Pratama</td>
                              <td className="p-2.5 text-center font-mono">90</td>
                              <td className="p-2.5 text-center font-mono">85</td>
                              <td className="p-2.5 text-center font-mono">92</td>
                              <td className="p-2.5 text-center font-mono font-bold text-emerald-400">89.3 (A)</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-medium text-white">Citra Lestari</td>
                              <td className="p-2.5 text-center font-mono">85</td>
                              <td className="p-2.5 text-center font-mono">88</td>
                              <td className="p-2.5 text-center font-mono">84</td>
                              <td className="p-2.5 text-center font-mono font-bold text-sky-400">85.5 (A)</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-medium text-white">Dimas Wahyu</td>
                              <td className="p-2.5 text-center font-mono">78</td>
                              <td className="p-2.5 text-center font-mono">80</td>
                              <td className="p-2.5 text-center font-mono">82</td>
                              <td className="p-2.5 text-center font-mono font-bold text-indigo-400">80.2 (B)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-[11px] text-zinc-500 flex justify-between">
                        <span>Rumus: (0.3×Tugas) + (0.3×UTS) + (0.4×UAS)</span>
                        <span className="text-emerald-400">Auto-Calculate ✓</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'siswa' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div>
                          <div className="text-xs font-bold text-white">Bagas Pratama (NIS: 20241001)</div>
                          <div className="text-[11px] text-zinc-500">Program Keahlian Pengembangan Perangkat Lunak</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300">
                          IPK: 3.88
                        </span>
                      </div>

                      <div className="space-y-2">
                        {[
                          { mapel: 'Pemrograman Berorientasi Objek', jam: '4 JP', nilai: '94', predikat: 'A' },
                          { mapel: 'Pemodelan Perangkat Lunak', jam: '3 JP', nilai: '88', predikat: 'A' },
                          { mapel: 'Basis Data Terdistribusi', jam: '4 JP', nilai: '90', predikat: 'A' },
                        ].map((m, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="text-white font-medium">{m.mapel}</div>
                              <div className="text-[10px] text-zinc-500">{m.jam} Praktik Mingguan</div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-emerald-400">{m.nilai}</span>
                              <span className="text-zinc-500 text-[11px] ml-1">({m.predikat})</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex justify-between items-center text-emerald-300">
                        <span>Raport Semester Ganjil Tersedia</span>
                        <span className="font-semibold underline cursor-pointer">Unduh PDF A4</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
