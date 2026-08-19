import React from 'react';
import { PageView } from './Navbar';
import { Sparkles, MessageCircle, Heart, Shield, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdminLogin }) => {
  const handleAdminClick = () => {
    if (onOpenAdminLogin) {
      onOpenAdminLogin();
    } else {
      onNavigate('admin');
    }
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 text-neutral-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg shadow-red-950/40 flex-shrink-0">
                <img 
                  src="https://raw.githubusercontent.com/syncrozz/syncrozz-assets/main/logo/Teater/android-chrome-192x192.png" 
                  alt="Teater KPMBP"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg tracking-tight uppercase">
                  TEATER <span className="text-amber-500 italic">KPMBP</span>
                </h3>
                <p className="text-[10px] text-amber-500 uppercase tracking-widest font-semibold">
                  «Komuniti • Bakat • Persembahan • Peluang»
                </p>
              </div>
            </div>

            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed max-w-md">
              Pusat komuniti rasmi, pembangunan bakat, arkib pementasan dan peluang pertandingan teater Kolej Profesional MARA Bandar Penawar. Direka untuk pelajar masa kini dan generasi akan datang.
            </p>

            <div className="flex items-center gap-2 text-xs text-neutral-300 bg-neutral-900 p-3 rounded-2xl border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Penyertaan terbuka sepanjang semester</span>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Eksplorasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[11px]">
                  Laman Utama (Home)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('join')} className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[11px]">
                  Sertai Komuniti Teater
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('teams')} className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[11px]">
                  Team Formation & Casting
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('opportunities')} className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[11px]">
                  Peluang Pertandingan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calendar')} className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[11px]">
                  Jadual & Kalendar
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Pembelajaran & Sejarah
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('skills')} className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[11px]">
                  Tips & Trick
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sircorner')} className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[11px]">
                  Bimbingan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('archive')} className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[11px]">
                  KPMBP Theatre Archive
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('talent')} className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[11px]">
                  Hall of Talent Mahasiswa
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('announcements')} className="hover:text-amber-400 transition-colors uppercase tracking-wider text-[11px]">
                  Pengumuman Terkini
                </button>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Pentadbiran & Privasi
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Semua maklumat pendaftaran pelajar dilindungi di bawah polisi pengurusan aktiviti dalaman KPMBP.
            </p>
            <div className="pt-2">
              <button
                onClick={handleAdminClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black hover:bg-amber-500 text-xs font-bold uppercase tracking-tight transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Access</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex items-center justify-center text-[10px] text-neutral-500 uppercase tracking-[0.15em]">
          <span>
            DEVELOP BY{' '}
            <a
              href="https://sites.google.com/view/khairi-innovation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 font-bold hover:text-amber-400 underline underline-offset-2 transition-colors cursor-pointer"
            >
              SYNCROZZ
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};
