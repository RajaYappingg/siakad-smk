import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Smartphone,
  Award,
  CreditCard,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-white/[0.2] ${className}`}
    >
      {/* Dynamic mouse spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.12), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
};

export const BentoFeatures: React.FC = () => {
  const [activeTimelineStep, setActiveTimelineStep] = useState(2);

  const pklSteps = [
    { title: 'Pengajuan & Verifikasi', desc: 'Matching minat kompetensi siswa', done: true },
    { title: 'Seleksi Mitra DUDI', desc: 'PT Telekomunikasi Indonesia Tbk', done: true },
    { title: 'Monitoring & Logbook', desc: 'Bimbingan berkala guru pamong', active: true },
    { title: 'Uji Sertifikasi Industri', desc: 'Konversi nilai standar BNSP', done: false },
  ];

  return (
    <section id="fitur" className="py-24 sm:py-32 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/[0.05] blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-sky-500/[0.05] blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Fitur Unggulan Generasi Baru
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Dirancang Presisi untuk{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400">
              Ekosistem Vokasi SMK
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed"
          >
            Kombinasi otomasi kurikulum vokasi, sinkronisasi kemitraan industri (BKK), 
            dan transparansi pembiayaan tanpa hambatan teknis.
          </motion.p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 (Span 2 Cols) - PKL & Kemitraan Industri */}
          <BentoCard className="lg:col-span-2 p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      Bursa Kerja Khusus & DUDI
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                      Manajemen PKL & Kemitraan Industri
                    </h3>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  92% Penyerapan Industri
                </span>
              </div>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
                Pantau penempatan praktik kerja lapangan, jurnal kegiatan harian siswa,
                evaluasi pembimbing industri, hingga konversi sertifikasi kompetensi dalam satu pipeline visual terpadu.
              </p>
            </div>

            {/* Interactive Timeline Mockup */}
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5 sm:p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-xs font-semibold text-zinc-300">
                    Pelacakan Siswa: Bagas Pratama (XII PPLG 1)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">Mitra: PT Telkom Akses</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {pklSteps.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTimelineStep(idx)}
                    className={`cursor-pointer p-3.5 rounded-xl border transition-all text-left ${
                      activeTimelineStep === idx
                        ? 'bg-indigo-500/10 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                        : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {idx < activeTimelineStep ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : idx === activeTimelineStep ? (
                        <Clock className="w-4 h-4 text-indigo-400 shrink-0 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-zinc-600 flex items-center justify-center text-[10px] text-zinc-500">
                          {idx + 1}
                        </div>
                      )}
                      <span className={`text-xs font-semibold truncate ${idx <= activeTimelineStep ? 'text-white' : 'text-zinc-500'}`}>
                        {step.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-tight">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Card 2 (Span 1 Col) - Presensi RFID & Geolocation */}
          <BentoCard className="p-8 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Akurasi Kedisiplinan
              </span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">
                Presensi RFID & Geolocation
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Pencatatan kehadiran bebas manipulasi menggunakan kartu pintar RFID gerbang sekolah serta validasi radius GPS smartphone.
              </p>
            </div>

            {/* Mobile Check-In Widget Mockup */}
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
                <span className="text-zinc-400">Radius Lokasi Sekolah</span>
                <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> 18m (Dalam Radius)
                </span>
              </div>
              <div className="mt-4 text-center">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="text-white font-bold text-base">Check-In Terverifikasi</div>
                <div className="text-zinc-500 text-xs mt-0.5">Pukul 06:42:15 WIB • Gerbang Utama</div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Status Kehadiran:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                  Tepat Waktu (+10 Poin)
                </span>
              </div>
            </div>
          </BentoCard>

          {/* Card 3 (Span 1 Col) - Raport Kurikulum Merdeka */}
          <BentoCard className="p-8 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 w-fit mb-6">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                Standar Nasional
              </span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">
                Raport Otomatis Kurikulum Merdeka
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Penghitungan terotomasi bobot capaian pembelajaran (TP/ATP) dan deskripsi kompetensi tanpa komputasi manual.
              </p>
            </div>

            {/* Score Breakdown Chart Mockup */}
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Tugas Praktik & Portofolio (30%)</span>
                  <span className="text-indigo-400 font-bold font-mono">92/100</span>
                </div>
                <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Penilaian Tengah Semester (30%)</span>
                  <span className="text-violet-400 font-bold font-mono">88/100</span>
                </div>
                <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Uji Asesmen Akhir Semester (40%)</span>
                  <span className="text-sky-400 font-bold font-mono">95/100</span>
                </div>
                <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">Predikat Akhir:</span>
                <span className="text-sm font-extrabold text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  A (Sangat Baik - 92.0)
                </span>
              </div>
            </div>
          </BentoCard>

          {/* Card 4 (Span 2 Cols) - Portal Keuangan & Tagihan SPP */}
          <BentoCard className="lg:col-span-2 p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Otomasi Finansial & Rekonsiliasi
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                      Portal SPP & Multi-Payment Gateway
                    </h3>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Auto-Notif WhatsApp
                </span>
              </div>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
                Kirim tagihan SPP berkala otomatis langsung ke WhatsApp orang tua dengan link pembayaran QRIS, Virtual Account bank, dan minimarket. Rekonsiliasi kas bendahara 100% real-time.
              </p>
            </div>

            {/* WA Notification & Payment Settlement Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Message Simulation */}
              <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-4 relative">
                <div className="flex items-center gap-2 mb-3 text-xs text-emerald-400 font-semibold">
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp Gateway Sekolah
                </div>
                <div className="bg-[#128C7E]/10 border border-[#128C7E]/20 p-3 rounded-xl text-[12px] text-zinc-300 leading-relaxed font-sans">
                  <p className="font-semibold text-emerald-300 mb-1">
                    Yth. Bpk/Ibu Wali Siswa Bagas Pratama,
                  </p>
                  <p className="text-zinc-400">
                    Tagihan SPP Bulan Oktober 2026 telah terbit sebesar <strong className="text-white">Rp 250.000</strong>.
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-[11px] text-indigo-400 font-mono underline">
                      pay.siakad-smk.id/inv/88391
                    </span>
                    <span className="text-[10px] text-zinc-500">10:00 ✓✓</span>
                  </div>
                </div>
              </div>

              {/* Settlement Status Card */}
              <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Status Pembayaran Real-Time</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                    Settled • Terverifikasi
                  </span>
                </div>
                <div className="my-2">
                  <div className="text-xs text-zinc-500">Kanal Transaksi</div>
                  <div className="text-sm font-bold text-white mt-0.5">BCA Virtual Account (Auto-Detect)</div>
                  <div className="text-lg font-extrabold text-white font-mono mt-1">Rp 250.000</div>
                </div>
                <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-2 border-t border-white/[0.06]">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Saldo kas otomatis terbukukan ke neraca sekolah
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 5 (Full Width 3 Cols) - Deteksi Bentrok 3 Arah */}
          <BentoCard className="md:col-span-2 lg:col-span-3 p-8 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Engine Validasi Cerdas
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Penjadwalan Otomatis Bebas Bentrok 3 Arah
                </h3>
                <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
                  Algoritma pencegah konflik simultan memastikan guru tidak dobel jadwal, kelas tidak tabrakan waktu, dan laboratorium praktik tidak over-capacity.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Cek Jadwal Guru
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Cek Rombel
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Cek Lab & Ruang
                </span>
              </div>
            </div>

            {/* Timetable Interactive Grid Visualization */}
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 sm:p-5 overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-5 gap-3 text-center text-xs font-semibold text-zinc-400 pb-3 border-b border-white/[0.06]">
                  <div>Senin</div>
                  <div>Selasa</div>
                  <div>Rabu</div>
                  <div>Kamis</div>
                  <div>Jumat</div>
                </div>
                <div className="grid grid-cols-5 gap-3 pt-3">
                  {/* Senin */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-left">
                      <span className="text-[10px] text-indigo-400 font-mono font-bold">07:30 - 09:45</span>
                      <div className="text-xs font-bold text-white truncate">Pemrograman Web</div>
                      <div className="text-[10px] text-zinc-400">Lab RPL 1 • Pak Hendra</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left">
                      <span className="text-[10px] text-zinc-500 font-mono">10:00 - 11:30</span>
                      <div className="text-xs font-medium text-zinc-300 truncate">Matematika Vokasi</div>
                      <div className="text-[10px] text-zinc-500">R. Teori 204 • Bu Maya</div>
                    </div>
                  </div>

                  {/* Selasa */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-left">
                      <span className="text-[10px] text-violet-400 font-mono font-bold">07:30 - 11:00</span>
                      <div className="text-xs font-bold text-white truncate">Praktik Jaringan (TJKT)</div>
                      <div className="text-[10px] text-zinc-400">Lab Fiber Optik • Pak Budi</div>
                    </div>
                  </div>

                  {/* Rabu */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-left">
                      <span className="text-[10px] text-sky-400 font-mono font-bold">07:30 - 09:45</span>
                      <div className="text-xs font-bold text-white truncate">Basis Data & Cloud</div>
                      <div className="text-[10px] text-zinc-400">Lab Komputer 3 • Pak Hendra</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-left">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">10:00 - 11:30</span>
                      <div className="text-xs font-bold text-white truncate">Bahasa Inggris Kerja</div>
                      <div className="text-[10px] text-zinc-400">R. Multimedia • Miss Sarah</div>
                    </div>
                  </div>

                  {/* Kamis */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left">
                      <span className="text-[10px] text-zinc-500 font-mono">07:30 - 10:00</span>
                      <div className="text-xs font-medium text-zinc-300 truncate">Projek Kreatif & PKWU</div>
                      <div className="text-[10px] text-zinc-500">Workshop Kreatif • Pak Joko</div>
                    </div>
                  </div>

                  {/* Jumat */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-left">
                      <span className="text-[10px] text-indigo-400 font-mono font-bold">07:30 - 11:00</span>
                      <div className="text-xs font-bold text-white truncate">Uji Kompetensi Keahlian</div>
                      <div className="text-[10px] text-zinc-400">Lab Sertifikasi • Asesor LSP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};
