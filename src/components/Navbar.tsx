import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  Shield, 
  Users, 
  Calendar, 
  BookOpen, 
  Trophy, 
  Film, 
  Award, 
  GraduationCap, 
  Bell,
  HeartHandshake,
  Lock
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
    { id: 'skills', label: 'Skills Academy', icon: BookOpen },
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

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-neutral-900 text-white border border-white/15 shadow-sm ring-1 ring-amber-500/40'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Admin Control Button & Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight transition-all flex items-center gap-1.5 border ${
                    currentPage === 'admin'
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-neutral-900 text-amber-400 border-white/10 hover:bg-neutral-800'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
                {onAdminLogout && (
                  <button
                    onClick={onAdminLogout}
                    className="p-1.5 rounded-full text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition-colors"
                    title="Log Keluar Admin"
                  >
                    <Lock className="w-3.5 h-3.5" />
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
                <span className="hidden sm:inline">Admin Access</span>
              </button>
            )}

            {/* Quick Register CTA on Desktop */}
            <button
              onClick={() => handleNavClick('join')}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider shadow-md shadow-red-950/40 transition-transform active:scale-95"
            >
              <span>Daftar Minat</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 focus:outline-none border border-white/5"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A0A0A] border-b border-white/10 px-4 pt-3 pb-6 space-y-1 max-h-[80vh] overflow-y-auto">
          <div className="px-3 py-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-500 border-b border-white/5 mb-2">
            Pusat Navigasi Teater KPMBP
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-amber-400 border border-white/15 ring-1 ring-amber-500/30'
                    : 'text-neutral-300 hover:bg-neutral-900/60 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
            <button
              onClick={() => handleNavClick('join')}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest text-center shadow-lg shadow-red-950/40"
            >
              🎭 Sertai Komuniti Teater KPMBP
            </button>

            {isAdminLoggedIn ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-2.5 rounded-2xl bg-neutral-900 text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10"
              >
                <Shield className="w-4 h-4" /> Buka Admin Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAdminLogin) onOpenAdminLogin();
                  else handleNavClick('admin');
                }}
                className="w-full py-2.5 rounded-2xl bg-white text-black hover:bg-amber-500 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" /> Log Masuk Pentadbir / Pensyarah
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
