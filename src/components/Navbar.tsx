import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  Shield, 
  ShieldCheck,
  Users, 
  Calendar, 
  BookOpen, 
  Trophy, 
  Film, 
  Award, 
  GraduationCap, 
  Bell,
  HeartHandshake,
  Lock,
  LogOut
} from 'lucide-react';

export type PageView = 
  | 'home'
  | 'join'
  | 'announcements'
  | 'opportunities'
  | 'teams'
  | 'skills'
  | 'sircorner'
  | 'archive'
  | 'talent'
  | 'calendar'
  | 'admin';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  isAdminLoggedIn?: boolean;
  onOpenAdminLogin?: () => void;
  onAdminLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isAdminLoggedIn = false,
  onOpenAdminLogin,
  onAdminLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'join', label: 'Sertai Komuniti', icon: HeartHandshake },
    { id: 'announcements', label: 'Pengumuman', icon: Bell },
    { id: 'opportunities', label: 'Peluang', icon: Trophy },
    { id: 'teams', label: 'Casting & Teams', icon: Users },
    { id: 'skills', label: 'Tips & Trick', icon: BookOpen },
    { id: 'sircorner', label: "Sir's Corner", icon: GraduationCap },
    { id: 'archive', label: 'Arkib Teater', icon: Film },
    { id: 'talent', label: 'Hall of Talent', icon: Award },
    { id: 'calendar', label: 'Kalendar', icon: Calendar }
  ];

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo & Brand matching Bento Grid theme */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg shadow-red-950/40 group-hover:scale-105 transition-transform flex-shrink-0">
              <img 
                src="https://raw.githubusercontent.com/syncrozz/syncrozz-assets/main/logo/Teater/android-chrome-192x192.png" 
                alt="Teater KPMBP"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase group-hover:text-amber-400 transition-colors">
                  TEATER <span className="text-amber-500 italic">KPMBP</span>
                </h1>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium hidden xs:block">
                Komuniti • Bakat • Persembahan • Peluang
              </p>
            </div>
          </button>

          {/* Navigation Links - Hidden horizontally, accessible via Menu button */}

          {/* Admin Control Button & Menu Trigger */}
          <div className="flex items-center gap-2.5">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight transition-all flex items-center gap-1.5 border cursor-pointer ${
                    currentPage === 'admin'
                      ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-md shadow-emerald-500/25'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25 hover:border-emerald-400'
                  }`}
                  title="Mod Pentadbir Aktif"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
                {onAdminLogout && (
                  <button
                    onClick={onAdminLogout}
                    className="px-3 py-1.5 rounded-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 hover:border-red-500 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-red-950/40 active:scale-95"
                    title="Log Keluar Mod Pentadbir"
                    aria-label="Log Keluar"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onOpenAdminLogin) {
                    onOpenAdminLogin();
                  } else {
                    handleNavClick('admin');
                  }
                }}
                className="bg-white text-black px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-tight hover:bg-amber-500 hover:text-black transition-colors flex items-center gap-1.5"
                title="Log Masuk Pentadbir / Pensyarah"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Mode On</span>
              </button>
            )}

            {/* Quick Register CTA */}
            <button
              onClick={() => handleNavClick('join')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider shadow-md shadow-red-950/40 transition-transform active:scale-95"
            >
              <span>Daftar Minat</span>
            </button>

            {/* Menu Button (SVG Trigger) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 focus:outline-none border border-white/10 transition-colors flex items-center gap-2"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-white" />}
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider text-neutral-300">
                {mobileMenuOpen ? 'Tutup' : 'Menu'}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Drawer / Dropdown Navigation when Menu button is clicked */}
      {mobileMenuOpen && (
        <div className="bg-[#0A0A0A] border-b border-white/10 px-4 sm:px-6 lg:px-8 pt-4 pb-6 space-y-1 max-h-[85vh] overflow-y-auto shadow-2xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between px-3 py-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-500 border-b border-white/5 mb-3">
              <span>Pusat Navigasi Teater KPMBP</span>
              <span className="text-[10px] text-neutral-500 font-normal">Pilih Halaman</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold uppercase tracking-wider transition-all text-left ${
                      isActive
                        ? 'bg-neutral-900 text-amber-400 border border-white/15 ring-1 ring-amber-500/30 shadow-md'
                        : 'text-neutral-300 hover:bg-neutral-900/80 hover:text-white border border-transparent hover:border-white/5'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-950 text-neutral-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm">{item.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => handleNavClick('join')}
                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest text-center shadow-lg shadow-red-950/40"
              >
                🎭 Sertai Komuniti Teater KPMBP
              </button>

              {isAdminLoggedIn ? (
                <div className="flex flex-col sm:flex-row gap-2 flex-1">
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="flex-1 py-3 rounded-2xl bg-emerald-950/50 text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-emerald-500/40 hover:bg-emerald-900/50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" /> Buka Admin Dashboard
                  </button>
                  {onAdminLogout && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onAdminLogout();
                      }}
                      className="py-3 px-4 rounded-2xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 hover:border-red-500 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Log Keluar Admin
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAdminLogin) onOpenAdminLogin();
                    else handleNavClick('admin');
                  }}
                  className="flex-1 py-3 rounded-2xl bg-white text-black hover:bg-amber-500 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" /> Log Masuk Pentadbir / Pensyarah
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
