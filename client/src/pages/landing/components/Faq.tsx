import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'Integrasi',
    question: 'Apakah SIAKAD SMK dapat disinkronkan dengan data Dapodik Kemendikbudristek?',
    answer:
      'Ya. Sistem mendukung ekspor-impor format standar Dapodik dan EMIS untuk data pokok peserta didik, nomor registrasi GTK (Guru dan Tenaga Kependidikan), rombongan belajar (rombel), hingga struktur kurikulum, sehingga sekolah tidak perlu menginput data ulang secara manual.',
  },
  {
    category: 'Jadwal & Penilaian',
    question: 'Bagaimana cara kerja algoritma anti-bentrok 3 arah pada jadwal pelajaran?',
    answer:
      'Engine validasi jadwal memeriksa tiga dimensi secara simultan: ketersediaan guru (mencegah guru dijadwalkan di 2 kelas bersamaan), ketersediaan rombel (mencegah kelas menerima 2 mapel bersamaan), dan ketersediaan ruang/lab praktik. Jika terdapat bentrok, sistem segera menolak penyimpanan dan menampilkan peringatan konflik secara spesifik.',
  },
  {
    category: 'Format Nilai',
    question: 'Bagaimana rumus penghitungan nilai akhir e-raport dan konversi predikat?',
    answer:
      'Formula default mengikuti standar asesmen nasional vokasi: Nilai Akhir = (30% × Tugas Praktik/Portofolio) + (30% × Asesmen Tengah Semester) + (40% × Asesmen Akhir Semester). Sistem otomatis mengonversi angka ke predikat: A (85 - 100), B (75 - 84), C (65 - 74), dan D (< 65). Bobot persentase ini juga dapat disesuaikan per kompetensi keahlian.',
  },
  {
    category: 'Keamanan Data',
    question: 'Bagaimana jaminan keamanan dan kerahasiaan data siswa serta nilai sekolah?',
    answer:
      'Sistem mengadopsi standar enkripsi industri dengan hashing bcrypt untuk kata sandi dan JWT (JSON Web Token) dengan session timeout untuk setiap komunikasi API. Akses data dibatasi ketat melalui Role-Based Access Control (RBAC) sehingga siswa hanya dapat melihat portofolionya sendiri, dan dewan guru hanya mengelola mata pelajaran yang diampunya.',
  },
  {
    category: 'Akses & Perangkat',
    question: 'Apakah siswa atau guru dapat login menggunakan NIS atau NIP tanpa email?',
    answer:
      'Tentu. Sistem mengenali identitas ganda: siswa dapat masuk menggunakan NIS (Nomor Induk Siswa), dewan guru dapat masuk menggunakan NIP, dan administrator menggunakan alamat email resmi. Antarmuka web kami sepenuhnya responsif di ponsel cerdas Android dan iOS tanpa memerlukan instalasi aplikasi berat dari app store.',
  },
  {
    category: 'Pelatihan & Setup',
    question: 'Berapa lama proses implementasi dan apakah staf sekolah mendapatkan pendampingan?',
    answer:
      'Sekolah dapat beroperasi penuh dalam waktu kurang dari 48 jam. Tim kami mendampingi migrasi data awal dari spreadsheet Excel sekolah secara gratis, serta menyelenggarakan sesi pelatihan online (atau on-site untuk paket Enterprise) bagi operator TU, wakasek kurikulum, dan dewan guru.',
  },
];

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Tanya Jawab Seputar Platform
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Pertanyaan yang Sering Diajukan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed"
          >
            Temukan jawaban lengkap seputar tata kelola, keamanan data, dan mekanisme implementasi SIAKAD di sekolah Anda.
          </motion.p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-indigo-500/40 bg-zinc-900/70 shadow-lg shadow-indigo-500/5'
                    : 'border-white/[0.08] bg-zinc-900/30 hover:border-white/[0.15]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06] hidden sm:inline-block">
                      {item.category}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
