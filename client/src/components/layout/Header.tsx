import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
  Settings,
  ChevronDown,
  RefreshCw,
  BookMarked,
} from 'lucide-react';
import { Role } from '../../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  title?: string;
  description?: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title, description }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const themeRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleSwitch = async (newRole: Role) => {
    await switchDemoRole(newRole);
    setIsUserOpen(false);
    if (newRole === 'ADMIN') navigate('/admin/dashboard');
    else if (newRole === 'GURU') navigate('/guru/dashboard');
    else navigate('/siswa/dashboard');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 border-b border-border bg-card/80 backdrop-blur-md">
      {/* Left section: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          {title && <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight">{title}</h1>}
          {description && <p className="hidden sm:block text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>

      {/* Right section: Theme switcher & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher for Demo / Testing */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-lg bg-muted/60 border border-border text-xs">
          <span className="text-[10px] font-semibold text-muted-foreground px-1.5 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Akun Demo:
          </span>
          <button
            onClick={() => handleRoleSwitch('ADMIN')}
            className={`px-2 py-0.5 rounded font-medium text-xs transition-colors ${
              user?.role === 'ADMIN'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => handleRoleSwitch('GURU')}
            className={`px-2 py-0.5 rounded font-medium text-xs transition-colors ${
              user?.role === 'GURU'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Guru
          </button>
          <button
            onClick={() => handleRoleSwitch('SISWA')}
            className={`px-2 py-0.5 rounded font-medium text-xs transition-colors ${
              user?.role === 'SISWA'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Siswa
          </button>
        </div>

        {/* Theme Switcher Dropdown */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Ganti Tema (Terang / Gelap)"
            aria-label="Ganti Tema"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Monitor className="w-4 h-4 text-primary" />
            )}
          </button>

          {isThemeOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-lg border border-border bg-card p-1 shadow-lg animate-in fade-in-50 zoom-in-95 z-50">
              <button
                onClick={() => {
                  setTheme('light');
                  setIsThemeOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  theme === 'light' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Terang</span>
              </button>
              <button
                onClick={() => {
                  setTheme('dark');
                  setIsThemeOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  theme === 'dark' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span>Gelap</span>
              </button>
              <button
                onClick={() => {
                  setTheme('system');
                  setIsThemeOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  theme === 'system' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-primary" />
                <span>Sistem</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Menu Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setIsUserOpen(!isUserOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-xs">
              {user?.nama?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-semibold text-foreground leading-tight truncate max-w-[120px]">
                {user?.nama}
              </span>
              <span className="block text-[10px] font-medium text-muted-foreground uppercase">
                {user?.role}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </button>

          {isUserOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card p-1 shadow-lg animate-in fade-in-50 zoom-in-95 z-50">
              <div className="p-2.5 border-b border-border mb-1">
                <p className="text-xs font-bold text-foreground truncate">{user?.nama}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase">
                  {user?.role}
                </span>
              </div>

              <button
                onClick={() => {
                  navigate('/');
                  setIsUserOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <BookMarked className="w-4 h-4 text-primary" />
                <span>Beranda Utama SIAKAD</span>
              </button>

              <button
                onClick={() => {
                  navigate('/profile');
                  setIsUserOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Profil Saya</span>
              </button>

              <button
                onClick={() => {
                  navigate('/settings');
                  setIsUserOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Pengaturan Akun</span>
              </button>

              <div className="border-t border-border my-1" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-md transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
