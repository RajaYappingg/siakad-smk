import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Sparkles } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  school: string;
  avatarText: string;
  avatarGradient: string;
  quote: string;
  highlight: string;
}

const TESTIMONIALS_ROW_1: Testimonial[] = [
  {
    name: 'Drs. H. Mulyadi, M.Pd.',
    role: 'Kepala Sekolah',
    school: 'SMKN 1 Cimahi, Jawa Barat',
    avatarText: 'MY',
    avatarGradient: 'from-indigo-500 to-violet-600',
    highlight: 'Administrasi Rapor 3x Lebih Cepat',
    quote:
      'Sebelumnya, dewan guru harus lembur berminggu-minggu saat akhir semester untuk merekap nilai rapor Kurikulum Merdeka. Dengan SIAKAD SMK, cetak 1.200 e-raport selesai tuntas dalam 2 hari.',
  },
  {
    name: 'Siti Nurjanah, S.T., M.Kom.',
    role: 'Wakasek Kurikulum & Produktif PPLG',
    school: 'SMKN 2 Surabaya, Jawa Timur',
    avatarText: 'SN',
    avatarGradient: 'from-violet-500 to-sky-600',
    highlight: 'Zero Conflict Penjadwalan Lab',
    quote:
      'Validasi 3 arah pada jadwal mengajar benar-benar mengubah cara kami menyusun jam praktik bengkel dan lab komputer. Tidak ada lagi kasus dobel jadwal guru mengajar.',
  },
  {
    name: 'Ir. Bambang Trihatmojo',
    role: 'Koordinator Hubungan Industri (BKK)',
    school: 'SMKS Telkom Purwokerto',
    avatarText: 'BT',
    avatarGradient: 'from-emerald-500 to-teal-600',
    highlight: 'Monitoring PKL Terkendali Penuh',
    quote:
      'Logbook digital siswa PKL di perusahaan mitra langsung terpantau guru pembimbing. Penilaian DUDI terstandarisasi otomatis masuk ke transkrip kompetensi keahlian.',
  },
];

const TESTIMONIALS_ROW_2: Testimonial[] = [
  {
    name: 'Rahmat Hidayat, S.Pd.',
    role: 'Guru Produktif Teknik Jaringan Komputer',
    school: 'SMKN 5 Semarang, Jawa Tengah',
    avatarText: 'RH',
    avatarGradient: 'from-sky-500 to-indigo-600',
    highlight: 'Input Nilai Massal Sangat Ringan',
    quote:
      'Formulir input nilai massal dengan auto-kalkulasi bobot 30-30-40 sangat intuitif. Tidak perlu lagi bolak-balik buka spreadsheet Excel manual yang rentan typo.',
  },
  {
    name: 'Dewi Anggraini, S.E.',
    role: 'Bendahara Sekolah & Komite',
    school: 'SMK Muhammadiyah 1 Yogyakarta',
    avatarText: 'DA',
    avatarGradient: 'from-amber-500 to-orange-600',
    highlight: 'Tunggakan SPP Berkurang 45%',
    quote:
      'Notifikasi WhatsApp otomatis berisi rincian tagihan dan link pembayaran QRIS memudahkan wali murid melunasi kewajiban bulanan tanpa perlu datang antre di loket TU.',
  },
  {
    name: 'Bagas Pratama',
    role: 'Siswa Kelas XII PPLG',
    school: 'SMKN 4 Bandung',
    avatarText: 'BP',
    avatarGradient: 'from-teal-500 to-emerald-600',
    highlight: 'Jadwal & Nilai Selalu di HP',
    quote:
      'Saya bisa mengecek ruang kelas praktikum dan jadwal pelajaran besok langsung lewat HP. E-raport juga bisa langsung diunduh PDF untuk berkas pendaftaran kerja.',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/[0.04] blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16 sm:mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Kisah Nyata Transformasi Digital
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
        >
          Dipercaya Lebih dari{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400">
            50+ Sekolah Menengah Kejuruan
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto"
        >
          Dengar pengalaman langsung dari kepala sekolah, guru pengampu, bendahara, hingga peserta didik yang telah beralih ke SIAKAD SMK.
        </motion.p>
      </div>

      {/* Testimonials Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...TESTIMONIALS_ROW_1, ...TESTIMONIALS_ROW_2].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between hover:border-white/[0.18] transition-all duration-300 group"
            >
              <div>
                {/* Rating & Highlight */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {item.highlight}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Profile */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.avatarGradient} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md`}
                >
                  {item.avatarText}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-white truncate">
                      {item.name}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    {item.role} • {item.school}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
