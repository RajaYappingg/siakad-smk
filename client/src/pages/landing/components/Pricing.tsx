import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight, Zap } from 'lucide-react';

interface PricingProps {
  onOpenDemo: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onOpenDemo }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: 'Starter',
      badge: 'SMK Berkembang',
      description: 'Ideal untuk sekolah menengah kejuruan mandiri yang baru memulai digitalisasi.',
      monthlyPrice: 650000,
      annualMonthlyPrice: 520000,
      isFeatured: false,
      features: [
        'Hingga 500 Peserta Didik Aktif',
        'Akses Guru & Wali Kelas Tak Terbatas',
        'Penjadwalan Otomatis Anti-Bentrok',
        'Input Nilai Bobot (Tugas, UTS, UAS)',
        'Cetak Raport Standar PDF A4',
        'Backup Data Berkala (Cloud Storage)',
        'Dukungan Teknis via Tiket & Email',
      ],
      ctaText: 'Pilih Starter',
    },
    {
      name: 'Pro Kejuruan',
      badge: 'Paling Banyak Dipilih • SMK PK',
      description: 'Solusi terlengkap untuk SMK Pusat Keunggulan dengan kebutuhan integrasi industri & BKK.',
      monthlyPrice: 1250000,
      annualMonthlyPrice: 990000,
      isFeatured: true,
      features: [
        'Hingga 1.800 Peserta Didik Aktif',
        'Semua Fitur di Paket Starter',
        'Modul Manajemen PKL & Kemitraan DUDI',
        'Portal Bursa Kerja Khusus (BKK)',
        'Presensi RFID & Geolocation Mobile',
        'Gateway Notifikasi WhatsApp Orang Tua',
        'Multi-Payment SPP (QRIS & Virtual Account)',
        'SLA Response Time 2 Jam (Prioritas)',
      ],
      ctaText: 'Mulai Uji Coba Pro 14 Hari',
    },
    {
      name: 'Enterprise Yayasan',
      badge: 'Konsorsium & Cabang',
      description: 'Arsitektur multi-tenancy terpusat untuk yayasan besar pengelola jaringan sekolah.',
      monthlyPrice: null,
      annualMonthlyPrice: null,
      isFeatured: false,
      features: [
        'Kapasitas Siswa & Guru Tanpa Batas',
        'Multi-Kampus & Multi-Tenant Terpadu',
        'Sinkronisasi Master Dapodik & EMIS API',
        'Custom Domain & Server On-Premise/Private',
        'Audit Log Finansial & Keamanan Ketat',
        'Pelatihan On-Site & Setup Pamong Khusus',
        'Dedicated Account Manager 24/7 SLA 99.9%',
      ],
      ctaText: 'Hubungi Konsultan Kami',
    },
  ];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="harga" className="py-24 sm:py-32 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-500/[0.04] blur-[160px] pointer-events-none rounded-full" />

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
            Investasi Transparan & Terjangkau
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Pilihan Paket yang{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400">
              Tumbuh Bersama Sekolah Anda
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed"
          >
            Tanpa biaya instalasi tersembunyi. Dapatkan pendampingan migrasi data nilai siswa secara cuma-cuma.
          </motion.p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-zinc-900/90 border border-white/[0.08]">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                !isAnnual
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tagihan Bulanan
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                isAnnual
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Tagihan Tahunan</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                Hemat 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                tier.isFeatured
                  ? 'bg-gradient-to-b from-indigo-950/40 via-zinc-900/60 to-zinc-950 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/15 scale-[1.03] z-10'
                  : 'bg-zinc-900/40 backdrop-blur-md border border-white/[0.08] hover:border-white/[0.2]'
              }`}
            >
              {/* Highlight badge for featured tier */}
              {tier.isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold tracking-wide uppercase shadow-lg shadow-indigo-500/30 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  {tier.badge}
                </div>
              )}

              <div>
                {!tier.isFeatured && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {tier.badge}
                  </span>
                )}
                <h3 className="text-2xl font-bold text-white mt-1">
                  {tier.name}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 min-h-[40px] leading-relaxed">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="mt-6 mb-8 pb-6 border-b border-white/[0.08]">
                  {tier.monthlyPrice ? (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                          {formatRupiah(isAnnual ? tier.annualMonthlyPrice! : tier.monthlyPrice)}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">/ bulan</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1">
                        {isAnnual ? 'Ditagih tahunan (Gratis setup & migrasi data)' : 'Ditagih setiap bulan fleksibel'}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-white">
                        Hubungi Tim
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1">
                        Kustomisasi penuh sesuai skala yayasan
                      </div>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-8">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Fitur yang Diikutsertakan:
                  </span>
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                      <div className={`p-1 rounded-full shrink-0 mt-0.5 ${
                        tier.isFeatured
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Action CTA */}
              <button
                onClick={onOpenDemo}
                className={`w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  tier.isFeatured
                    ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-xl shadow-indigo-500/25'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1]'
                }`}
              >
                <span>{tier.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
