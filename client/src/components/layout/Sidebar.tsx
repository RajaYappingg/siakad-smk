import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  Layers,
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  CalendarDays,
  Award,
  UserCog,
  Settings,
  User as UserIcon,
  BookMarked,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavGroup {
  groupTitle?: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role;

  // Build navigation based on user role
  const getNavGroups = (): NavGroup[] => {
    if (role === 'ADMIN') {
      return [
        {
          items: [{ label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }],
        },
        {
          groupTitle: 'Master Data',
          items: [
            { label: 'Jurusan', path: '/admin/jurusan', icon: <Layers className="w-4 h-4" /> },
            { label: 'Kelas', path: '/admin/kelas', icon: <GraduationCap className="w-4 h-4" /> },
            { label: 'Siswa', path: '/admin/siswa', icon: <Users className="w-4 h-4" /> },
            { label: 'Guru', path: '/admin/guru', icon: <UserCheck className="w-4 h-4" /> },
            { label: 'Mata Pelajaran', path: '/admin/mapel', icon: <BookOpen className="w-4 h-4" /> },
          ],
        },
        {
          groupTitle: 'Akademik',
          items: [
            { label: 'Jadwal Pelajaran', path: '/admin/jadwal', icon: <Calendar className="w-4 h-4" /> },
            { label: 'Tahun Ajaran', path: '/admin/tahun-ajaran', icon: <CalendarDays className="w-4 h-4" /> },
            { label: 'Nilai Siswa', path: '/admin/nilai', icon: <Award className="w-4 h-4" /> },
          ],
        },
        {
          groupTitle: 'Sistem',
          items: [
            { label: 'Pengguna', path: '/admin/users', icon: <UserCog className="w-4 h-4" /> },
            { label: 'Pengaturan', path: '/settings', icon: <Settings className="w-4 h-4" /> },
          ],
        },
      ];
    }

    if (role === 'GURU') {
      return [
        {
          items: [{ label: 'Dashboard', path: '/guru/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }],
        },
        {
          groupTitle: 'Pembelajaran',
          items: [
            { label: 'Jadwal Saya', path: '/guru/jadwal', icon: <Calendar className="w-4 h-4" /> },
            { label: 'Kelas Saya', path: '/guru/kelas', icon: <GraduationCap className="w-4 h-4" /> },
            { label: 'Input Nilai', path: '/guru/nilai', icon: <Award className="w-4 h-4" /> },
          ],
        },
        {
          groupTitle: 'Akun',
          items: [
            { label: 'Profil Saya', path: '/profile', icon: <UserIcon className="w-4 h-4" /> },
            { label: 'Pengaturan', path: '/settings', icon: <Settings className="w-4 h-4" /> },
          ],
        },
      ];
    }

    // Default: SISWA
    return [
      {
        items: [{ label: 'Dashboard', path: '/siswa/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }],
      },
      {
        groupTitle: 'Akademik',
        items: [
          { label: 'Jadwal Pelajaran', path: '/siswa/jadwal', icon: <Calendar className="w-4 h-4" /> },
          { label: 'Raport & Nilai', path: '/siswa/nilai', icon: <Award className="w-4 h-4" /> },
        ],
      },
      {
        groupTitle: 'Akun',
        items: [
          { label: 'Profil Saya', path: '/profile', icon: <UserIcon className="w-4 h-4" /> },
          { label: 'Pengaturan', path: '/settings', icon: <Settings className="w-4 h-4" /> },
        ],
      },
    ];
  };

  const navGroups = getNavGroups();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r border-border bg-card transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand logo header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-border">
          <Link
            to="/"
            title="Kunjungi Beranda Utama"
            className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-white shadow-xs group-hover:scale-105 transition-transform">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-foreground">SIAKAD</span>
              <span className="ml-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                SMK
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:bg-muted lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User preview banner */}
        <div className="p-3.5 mx-3 mt-3 rounded-lg bg-muted/40 border border-border/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-sm uppercase shrink-0">
            {user?.nama?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">{user?.nama}</p>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {group.groupTitle && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.groupTitle}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`
                    }
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-border text-[11px] text-muted-foreground text-center">
          SIAKAD v1.0 &bull; Sistem Akademik
        </div>
      </aside>
    </>
  );
};
