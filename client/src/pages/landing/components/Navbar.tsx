import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenDemo: () => void;
}

const NAV_LINKS = [
  { label: 'Fitur', href: '#fitur' },
  { label: 'Solusi', href: '#solusi' },
  { label: 'Kalkulator', href: '#kalkulator' },
  { label: 'Harga', href: '#harga' },
  { label: 'FAQ', href: '#faq' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4">
      <div
        className={`max-w-5xl mx-auto mt-4 px-5 py-2.5 rounded-full border transition-all duration-300 ${
          isScrolled
            ? 'bg-zinc-950/80 backdrop-blur-xl border-white/[0.1] shadow-2xl shadow-black/40'
            : 'bg-zinc-950/50 backdrop-blur-lg border-white/[0.06]'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="p-1.5 rounded-lg bg-indigo-500/10">
              <BookMarked className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              SIAKAD
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              SMK
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-3.5 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-full transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Masuk
            </Link>
            <button
              onClick={onOpenDemo}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-400 rounded-full shadow-lg shadow-indigo-500/20 transition-all duration-200"
            >
              Coba Demo
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden max-w-5xl mx-auto mt-2 rounded-2xl border border-white/[0.08] bg-zinc-950/90 backdrop-blur-xl overflow-hidden shadow-2xl"
          >
            <div className="p-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-2">
                <Link
                  to="/login"
                  className="block text-center px-4 py-2.5 text-sm text-zinc-300 hover:text-white rounded-lg border border-white/[0.08] hover:bg-white/[0.04] transition-all"
                >
                  Masuk ke Portal
                </Link>
                <button
                  onClick={() => { setIsMobileOpen(false); onOpenDemo(); }}
                  className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-400 rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Coba Demo Gratis
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
