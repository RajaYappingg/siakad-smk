import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

interface CtaBannerProps {
  onOpenDemo: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenDemo }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleScheduleDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Masukkan alamat email sekolah yang valid.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Permintaan demo diterima! Tim konsultan kami akan menghubungi email Anda.', 'success');
      setEmail('');
    }, 600);
  };

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-indigo-500/30 bg-gradient-to-b from-indigo-950/60 via-zinc-900/80 to-zinc-950 p-8 sm:p-14 lg:p-16 shadow-2xl text-center"
        >
          {/* Ambient Lighting Beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-indigo-500/25 to-transparent blur-[100px] pointer-events-none rounded-full" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Langkah Cepat Transformasi Kampus Vokasi
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Siap Modernisasi Tata Kelola Sekolah Anda Menuju Era Digital?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Bergabunglah dengan puluhan SMK berprestasi di seluruh Indonesia. Mulai uji coba penuh tanpa komitmen kartu kredit dan dapatkan pendampingan teknis gratis.
          </p>

          {/* Instant Booking Input Form */}
          <form
            onSubmit={handleScheduleDemo}
            className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-3 items-center"
          >
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                placeholder="nama@smk-negeri.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-950/90 border border-white/[0.12] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto shrink-0 px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Mengirim...' : 'Jadwalkan Demo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Alternative Link */}
          <div className="mt-4">
            <button
              type="button"
              onClick={onOpenDemo}
              className="text-xs text-zinc-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Atau coba langsung portal dengan data contoh (Tanpa Daftar) →
            </button>
          </div>

          {/* Reassurances & Trust Indicators */}
          <div className="mt-10 pt-8 border-t border-white/[0.08] flex flex-wrap justify-center gap-6 sm:gap-10 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tanpa Biaya Komitmen Awal</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Pendampingan Setup 1-on-1 Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Siap Beroperasi dalam 48 Jam</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
