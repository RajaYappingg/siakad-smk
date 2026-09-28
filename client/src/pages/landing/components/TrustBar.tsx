import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { value: '50+', label: 'SMK Mitra di Indonesia' },
  { value: '99.8%', label: 'Uptime & Keandalan Sistem' },
  { value: '15.000+', label: 'Siswa & Guru Aktif' },
  { value: '100%', label: 'Kompatibel Kurikulum Merdeka' },
];

export const TrustBar: React.FC = () => {
  return (
    <section className="py-16 border-y border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center space-y-2"
            >
              <div className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
