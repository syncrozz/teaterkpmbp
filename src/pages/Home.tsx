import React from 'react';
import { PageView } from '../components/Navbar';
import { storage, useLiveStorage } from '../lib/storage';
import { EventSpotlight } from '../components/EventSpotlight';
import { EventSpotlightCarousel } from '../components/EventSpotlightCarousel';
import { WhatsAppCommunityCard } from '../components/WhatsAppCommunityCard';
import { 
  Sparkles, 
  ArrowRight, 
  Film, 
  PenTool, 
  Sliders, 
  Trophy, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Bell, 
  ShieldCheck,
  Calendar,
  MessageCircle,
  HelpCircle,
  Clock,
  Layers,
  Award
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: PageView) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const store = useLiveStorage();
  const activeEvent = store.events.find(e => e.status === 'ACTIVE' || e.status === 'REGISTRATION OPEN') || store.events[0] || storage.getActiveEvent();
  const announcements = store.announcements.filter(a => a.published).slice(0, 3);
  const students = store.students;
  const teams = store.teams;
  const studentsCount = students.length;
  const teamsCount = teams.length;
  const sirNotes = store.sir_notes.slice(0, 2);

  const valueProps = [
    {
      icon: '🎭',
      title: 'Lakonan (Acting)',
      desc: 'Pelajari asas watak, ekspresi emosi, dan lontaran suara bertenaga di atas pentas.'
    },
    {
      icon: '✍️',
      title: 'Penulisan Skrip',
      desc: 'Tukarkan idea cerita dan konflik menarik kepada skrip drama pentas yang padat.'
    },
    {
      icon: '💡',
      title: 'Technical Crew',
      desc: 'Kuasai kawalan pencahayaan dewan, mikrofon, audio dramatik dan kesan bunyi.'
    },
    {
      icon: '🎬',
      title: 'Produksi & Pentas',
      desc: 'Ketahui peranan Stage Manager, susunan props, kostum, dan disiplin di sebalik tabir.'
    },
    {
      icon: '🏆',
      title: 'Peluang Pertandingan',
      desc: 'Rebut hadiah tunai, trofi, sijil penghargaan, dan peluang mewakili kolej ke peringkat MARA.'
    },
    {
      icon: '🤝',
      title: 'Komuniti Mahasiswa',
      desc: 'Bina kenalan baharu merentasi jurusan DIT, DIA, DBS, DIB, dan DEB dalam suasana positif.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8 sm:space-y-12">
      
      {/* 1. PRIMARY BENTO GRID HERO & ACTION SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5">
        
        {/* Bento Cell 1: Big Hero Welcome (Col 7 / 12) */}
        <div className="md:col-span-7 bg-neutral-900 rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between border border-white/5 min-h-[420px] shadow-2xl">
          {/* Subtle Mask Watermark */}
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none select-none">
            <span className="text-8xl md:text-9xl">🎭</span>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-xs sm:text-sm font-black uppercase tracking-widest">
                SELAMAT DATANG KE TEATER KPMBP
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tight text-white">
              KOMUNITI • BAKAT<br />
              <span className="text-amber-400">PELUANG PENTAS</span>
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base max-w-lg leading-relaxed">
              Hab rasmi aktiviti, pementasan drama, dan pembentukan pasukan teater Kolej Profesional MARA Bandar Penawar. Dari lakonan ke kru teknikal, cari rentak anda di sini.
            </p>

            {/* Quick Skills Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              <button
                onClick={() => onNavigate('skills')}
                className="bg-neutral-800/80 hover:bg-neutral-800 border border-white/5 hover:border-amber-500/40 p-2 rounded-xl text-center cursor-pointer transition-all active:scale-95 text-left sm:text-center"
              >
                <span className="text-amber-400 font-bold block text-[11px]">Suka Berlakon?</span>
                <span className="text-neutral-400 text-[10px]">Asah watak & suara</span>
              </button>
              <button
                onClick={() => onNavigate('skills')}
                className="bg-neutral-800/80 hover:bg-neutral-800 border border-white/5 hover:border-amber-500/40 p-2 rounded-xl text-center cursor-pointer transition-all active:scale-95 text-left sm:text-center"
              >
                <span className="text-amber-400 font-bold block text-[11px]">Tulis Skrip?</span>
                <span className="text-neutral-400 text-[10px]">Cipta karya asli</span>
              </button>
              <button
                onClick={() => onNavigate('skills')}
                className="bg-neutral-800/80 hover:bg-neutral-800 border border-white/5 hover:border-amber-500/40 p-2 rounded-xl text-center cursor-pointer transition-all active:scale-95 text-left sm:text-center"
              >
                <span className="text-amber-400 font-bold block text-[11px]">Pentas Dewan?</span>
                <span className="text-neutral-400 text-[10px]">Kuasai blocking</span>
              </button>
              <button
                onClick={() => onNavigate('skills')}
                className="bg-neutral-800/80 hover:bg-neutral-800 border border-white/5 hover:border-amber-500/40 p-2 rounded-xl text-center cursor-pointer transition-all active:scale-95 text-left sm:text-center"
              >
                <span className="text-amber-400 font-bold block text-[11px]">Kru & Props?</span>
                <span className="text-neutral-400 text-[10px]">Audio & teknikal</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('join')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all transform active:scale-95 shadow-xl shadow-red-950/60 flex items-center gap-2 cursor-pointer"
            >
              <span>SERTAI KOMUNITI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('opportunities')}
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest border border-white/10 transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>LIHAT PELUANG</span>
            </button>
          </div>
        </div>

        {/* Bento Cell 2: Event Spotlight Carousel (Col 5 / 12) */}
        <EventSpotlightCarousel onNavigate={onNavigate} />

        {/* Bento Cell 3: Skills Academy (Col 3 / 12) */}
        <div 
          onClick={() => onNavigate('skills')}
          className="md:col-span-3 bg-neutral-900/60 rounded-3xl p-6 border border-white/5 flex flex-col justify-between hover:border-amber-500/40 hover:bg-neutral-900 transition-all group cursor-pointer"
        >
          <div>
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
              🎓
            </div>
            <h4 className="font-bold text-lg text-white mb-1 group-hover:text-amber-400 transition-colors">Skills Academy</h4>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Pelajari rahsia lakonan, lontaran vokal, skrip & teknikal pentas dari asas.
            </p>
          </div>

          <div>
            <div className="w-full grid grid-cols-2 gap-2 mb-4">
              <span className="bg-neutral-800 p-2 rounded-xl text-[10px] font-bold uppercase text-center text-neutral-300">Acting</span>
              <span className="bg-neutral-800 p-2 rounded-xl text-[10px] font-bold uppercase text-center text-neutral-300">Script</span>
              <span className="bg-neutral-800 p-2 rounded-xl text-[10px] font-bold uppercase text-center text-neutral-300">Lighting</span>
              <span className="bg-neutral-800 p-2 rounded-xl text-[10px] font-bold uppercase text-center text-neutral-300">Props</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('skills');
              }}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Buka Modul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bento Cell 4: Theatre Archive (Col 6 / 12) */}
        <div className="md:col-span-6 bg-neutral-900/60 rounded-3xl p-6 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-lg text-white">Theatre Archive</h4>
              <p className="text-[11px] text-neutral-400">Rakaman pementasan & legasi teater KPMBP</p>
            </div>
            <button
              onClick={() => onNavigate('archive')}
              className="text-amber-500 hover:text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 cursor-pointer"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 flex-1 min-h-[140px]">
            <div 
              onClick={() => onNavigate('archive')}
              className="bg-neutral-800 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 hover:border-amber-500/40 transition-all flex flex-col justify-end p-3"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0"></div>
              <div className="relative z-10">
                <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block">2025</span>
                <p className="text-xs font-extrabold text-white leading-tight">Malam Gemilang</p>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('archive')}
              className="bg-neutral-800 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 hover:border-amber-500/40 transition-all flex flex-col justify-end p-3"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0"></div>
              <div className="relative z-10">
                <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block">2024</span>
                <p className="text-xs font-extrabold text-white leading-tight">Pentas Merdeka</p>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('archive')}
              className="bg-neutral-800 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 hover:border-amber-500/40 transition-all flex flex-col justify-end p-3"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0"></div>
              <div className="relative z-10">
                <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block">2024</span>
                <p className="text-xs font-extrabold text-white leading-tight">Monolog Hati</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Cell 5: Stats Komuniti (Col 3 / 12) */}
        <div className="md:col-span-3 bg-neutral-900 rounded-3xl p-6 border border-amber-500/30 flex flex-col justify-between gap-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg text-white">Stats Komuniti</h4>
            <span className="text-xs text-amber-400 font-mono">LIVE</span>
          </div>

          <div className="space-y-3">
            <div 
              onClick={() => onNavigate('join')}
              className="flex items-center justify-between border-b border-white/5 pb-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-neutral-400 text-xs">Pelajar Minat</span>
              <span className="text-2xl font-black text-amber-400 font-mono">{studentsCount > 0 ? studentsCount : '142'}</span>
            </div>
            <div 
              onClick={() => onNavigate('teams')}
              className="flex items-center justify-between border-b border-white/5 pb-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-neutral-400 text-xs">Team Aktif</span>
              <span className="text-2xl font-black text-white font-mono">{teamsCount > 0 ? teamsCount : '12'}</span>
            </div>
            <div 
              onClick={() => onNavigate('opportunities')}
              className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-neutral-400 text-xs">Peluang Pentas</span>
              <span className="text-2xl font-black text-red-500 font-mono">03</span>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('join')}
            className="bg-green-500/10 hover:bg-green-500/20 text-green-400 p-3 rounded-2xl text-[10px] font-bold text-center border border-green-500/20 uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>WhatsApp Status: ONLINE</span>
          </div>
        </div>

      </section>

      {/* 2. VALUE PROPOSITIONS BENTO SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">EKOSISTEM KREATIF</span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Kenapa Sertai Teater KPMBP?
            </h3>
          </div>
          <p className="text-neutral-400 text-xs hidden md:block max-w-sm text-right">
            Ruang terbuka dan inklusif untuk semua jurusan meneroka potensi diri.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {valueProps.map((card, idx) => {
            const getTargetPage = (title: string): PageView => {
              if (title.includes('Peluang')) return 'opportunities';
              if (title.includes('Komuniti')) return 'join';
              return 'skills';
            };
            const target = getTargetPage(card.title);

            return (
              <div
                key={idx}
                onClick={() => onNavigate(target)}
                className="bg-neutral-900/60 border border-white/5 hover:border-amber-500/40 hover:bg-neutral-900 rounded-3xl p-6 transition-all hover:-translate-y-1 shadow-lg space-y-3 group cursor-pointer"
              >
                <div className="text-3xl select-none group-hover:scale-110 transition-transform inline-block">
                  {card.icon}
                </div>
                <h4 className="text-base font-bold text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>{card.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-amber-400 transition-opacity" />
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ACTIVE EVENT SPOTLIGHT */}
      {activeEvent && (
        <section>
          <EventSpotlight
            event={activeEvent}
            onJoinClick={() => onNavigate('join')}
            onViewTeamsClick={() => onNavigate('teams')}
          />
        </section>
      )}

      {/* 4. WHATSAPP COMMUNITY WORKFLOW BANNER */}
      <section>
        <WhatsAppCommunityCard onJoinClick={() => onNavigate('join')} />
      </section>

      {/* 5. ANNOUNCEMENTS & SIR'S CORNER BENTO MODULES */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Announcements Col (7 / 12) */}
        <div className="lg:col-span-7 bg-neutral-900/60 rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase text-white">Pengumuman Terkini</h4>
                <p className="text-[11px] text-neutral-400">Maklumat rasmi jawatankuasa</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <span>Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map(ann => (
              <div
                key={ann.id}
                onClick={() => onNavigate('announcements')}
                className="bg-neutral-900 border border-white/5 hover:border-amber-500/30 p-4 rounded-2xl transition-all cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-500">
                  <span className="font-bold text-amber-400 uppercase tracking-widest">{ann.category}</span>
                  <span className="font-mono">{new Date(ann.created_at).toLocaleDateString('ms-MY')}</span>
                </div>
                <h5 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                  {ann.title}
                </h5>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sir's Corner Teaser Col (5 / 12) */}
        <div className="lg:col-span-5 bg-neutral-900/60 rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase text-white">Bimbingan Sir</h4>
                <p className="text-[11px] text-neutral-400">Nasihat & nota motivasi</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('sircorner')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <span>Sir's Corner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {sirNotes.map(sn => (
              <div
                key={sn.id}
                onClick={() => onNavigate('sircorner')}
                className="bg-neutral-900 border border-white/5 hover:border-amber-500/30 p-4 rounded-2xl transition-all cursor-pointer space-y-2 group"
              >
                <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {sn.category}
                </span>
                <h5 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{sn.title}</h5>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{sn.summary}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 6. BOTTOM BENTO CTA BANNER */}
      <section className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 rounded-3xl p-8 sm:p-12 text-center text-black space-y-6 shadow-2xl shadow-amber-950/40">
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="bg-black text-white px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
            PELUANG EMAS MAHASISWA
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
            Bakat Anda Menunggu Pentas Ini.
          </h2>
          <p className="text-black font-semibold text-xs sm:text-sm">
            Jangan biarkan keraguan menghalang anda. Semua watak hebat bermula dari langkah pertama.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('join')}
            className="px-8 py-3.5 rounded-2xl bg-black text-white font-extrabold text-xs uppercase tracking-widest hover:bg-neutral-900 transition-transform active:scale-95 shadow-xl"
          >
            Daftar Minat Sekarang
          </button>
          <button
            onClick={() => onNavigate('skills')}
            className="px-6 py-3.5 rounded-2xl bg-black/10 hover:bg-black/20 text-black font-bold text-xs uppercase tracking-widest transition-colors border border-black/20"
          >
            Terokai Skills Academy
          </button>
        </div>
      </section>

    </div>
  );
};
