import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  TrendingDown,
  Clock,
  FileSpreadsheet,
  Download,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

interface RoiCalculatorProps {
  onOpenDemo?: () => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onOpenDemo }) => {
  const [jumlahSiswa, setJumlahSiswa] = useState<number>(850);
  const [biayaKertasPerSiswa, setBiayaKertasPerSiswa] = useState<number>(175000);
  const { showToast } = useToast();

  // Calculations:
  // Operational paper & printing savings (~75% reduction via e-raport and digital workflows)
  const totalBiayaManualPerTahun = jumlahSiswa * biayaKertasPerSiswa * 2;
  const estimasiHematRupiah = Math.round(totalBiayaManualPerTahun * 0.72);

  // Time saved (approx 0.045 hours per student per week across all teachers & admin staff)
  const waktuTerpangkasJam = Math.round(jumlahSiswa * 0.035);

  // Paper reams saved (1 student ~ 0.4 ream/semester for exam papers, report booklets, forms)
  const rimKertasTerselamatkan = Math.round(jumlahSiswa * 0.45 * 2);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleDownloadSimulation = () => {
    showToast('Simulasi anggaran PDF berhasil diunduh (Pratinjau).', 'success');
  };

  return (
    <section id="kalkulator" className="py-24 sm:py-32 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.04] blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4"
          >
            <Calculator className="w-3.5 h-3.5" />
            Kalkulator Efisiensi Anggaran
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Hitung Potensi{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400">
              Penghematan Sekolah Anda
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed"
          >
            Bandingkan biaya operasional cetak kertas raport konvensional, fotokopi lembar ujian,
            dan lembur staf dengan sistem otomasi SIAKAD SMK.
          </motion.p>
        </div>

        {/* Calculator Main Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto rounded-3xl border border-white/[0.08] bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
            {/* Left Column: Interactive Sliders */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Parameter Sekolah</h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Geser nilai di bawah ini sesuai profil institusi sekolah Anda saat ini.
                </p>
              </div>

              {/* Slider 1: Jumlah Siswa */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="range-siswa" className="text-sm font-semibold text-zinc-300">
                    Jumlah Peserta Didik Aktif
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold text-base">
                    {jumlahSiswa.toLocaleString('id-ID')} Siswa
                  </span>
                </div>
                <input
                  id="range-siswa"
                  type="range"
                  min="200"
                  max="3000"
                  step="50"
                  value={jumlahSiswa}
                  onChange={(e) => setJumlahSiswa(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                  <span>200 Siswa (SMK Rintisan)</span>
                  <span>3.000 Siswa (SMK Pusat Keunggulan)</span>
                </div>
              </div>

              {/* Slider 2: Biaya Kertas & Cetak */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="range-biaya" className="text-sm font-semibold text-zinc-300">
                    Biaya Kertas, Cetak & Raport Fisik / Siswa / Semester
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-base">
                    {formatRupiah(biayaKertasPerSiswa)}
                  </span>
                </div>
                <input
                  id="range-biaya"
                  type="range"
                  min="50000"
                  max="500000"
                  step="25000"
                  value={biayaKertasPerSiswa}
                  onChange={(e) => setBiayaKertasPerSiswa(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                  <span>Rp 50.000 (Minimalis)</span>
                  <span>Rp 500.000 (Raport Hardcover + Ujian Fisik)</span>
                </div>
              </div>

              {/* Methodology Explanation */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-400 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Metodologi Perhitungan Efisiensi:
                </div>
                <p className="leading-relaxed text-zinc-500">
                  Model menghitung penghematan 72% dari beban cetak buku raport manual, kertas asesmen,
                  tinta printer, serta eliminasi 30+ jam lembur staf tata usaha per minggu berkat otomasi format e-raport digital.
                </p>
              </div>
            </div>

            {/* Right Column: Financial Projections Glass Card */}
            <div className="lg:col-span-5 p-6 sm:p-10 bg-gradient-to-b from-zinc-900/80 via-zinc-950/90 to-zinc-950 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                    HASIL SIMULASI ANGGARAN
                  </span>
                  <span className="text-[11px] text-zinc-500">Per Tahun Ajaran</span>
                </div>

                {/* Metric 1: Estimasi Penghematan */}
                <div className="mb-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                    <TrendingDown className="w-4 h-4" />
                    Estimasi Penghematan Operasional
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
                    {formatRupiah(estimasiHematRupiah)}
                  </div>
                  <div className="text-[11px] text-emerald-300/80 mt-1">
                    Dana BOS dapat dialihkan ke fasilitas laboratorium vokasi
                  </div>
                </div>

                {/* Metric 2 & 3: Waktu & Rim Kertas */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      Waktu Dipangkas
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                      {waktuTerpangkasJam} Jam
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">per minggu untuk staf & guru</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-1.5 text-xs text-violet-400 font-semibold mb-1">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      Kertas Terhemat
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                      {rimKertasTerselamatkan} Rim
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">pengurangan jejak karbon</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                <button
                  onClick={handleDownloadSimulation}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  Unduh Simulasi Anggaran (PDF)
                </button>
                {onOpenDemo && (
                  <button
                    onClick={onOpenDemo}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    Uji Coba Langsung di Sekolah
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
