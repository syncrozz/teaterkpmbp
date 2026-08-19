import React, { useState } from 'react';
import { PageView } from '../components/Navbar';
import { storage, useLiveStorage } from '../lib/storage';
import { EventSpotlight } from '../components/EventSpotlight';
import { EventSpotlightCarousel } from '../components/EventSpotlightCarousel';
import { WhatsAppCommunityCard } from '../components/WhatsAppCommunityCard';
import { StatusBadge } from '../components/StatusBadge';
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
  Award,
  Search,
  UserCheck,
  X,
  HeartHandshake
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

  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

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
      
      {/* 1. HERO ELEMENT: STATS KOMUNITI TEATER KPMBP */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 rounded-3xl p-5 sm:p-7 border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-5">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        {/* Header with Live Pulse */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black uppercase text-white tracking-tight">
                  Stats Komuniti Teater
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Papan pemuka perkembangan bakat & penyertaan aktif warga KPMBP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('join')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-red-950/40 active:scale-95 cursor-pointer"
            >
              <span>Daftar Minat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Interactive Hero Stat Cards - 3 Columns per card */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 relative z-10">
          {/* Stat 1: Pelajar Minat */}
          <div 
            onClick={() => setShowStudentListModal(true)}
            className="bg-neutral-950/80 hover:bg-neutral-800/90 border border-white/5 hover:border-amber-500/40 rounded-2xl p-4 transition-all hover:-translate-y-0.5 cursor-pointer group shadow-lg grid grid-cols-3 items-center gap-2.5"
            title="Klik untuk melihat senarai asas pelajar berdaftar (Nama Panggilan x Kumpulan x Status)"
          >
            {/* Col 1: Icon & Label */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 tracking-wider block truncate">
                  Pelajar
                </span>
                <span className="text-[10px] text-neutral-500 block truncate">
                  Minat
                </span>
              </div>
            </div>

            {/* Col 2: Metric */}
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 group-hover:text-amber-300 font-mono tracking-tight">
                {studentsCount}
              </div>
            </div>

            {/* Col 3: Subtext & Action Arrow */}
            <div className="flex items-center justify-end gap-1.5 text-right">
              <span className="text-[10px] font-medium text-neutral-400 group-hover:text-amber-400 transition-colors hidden sm:inline truncate">
                Senarai
              </span>
              <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-amber-500/20 flex items-center justify-center text-neutral-400 group-hover:text-amber-400 transition-all shrink-0">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Stat 2: Team Aktif */}
          <div 
            onClick={() => onNavigate('teams')}
            className="bg-neutral-950/80 hover:bg-neutral-800/90 border border-white/5 hover:border-amber-500/40 rounded-2xl p-4 transition-all hover:-translate-y-0.5 cursor-pointer group shadow-lg grid grid-cols-3 items-center gap-2.5"
            title="Klik untuk melihat senarai kumpulan aktif berdaftar"
          >
            {/* Col 1: Icon & Label */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 tracking-wider block truncate">
                  Team
                </span>
                <span className="text-[10px] text-neutral-500 block truncate">
                  Aktif
                </span>
              </div>
            </div>

            {/* Col 2: Metric */}
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-400 font-mono tracking-tight transition-colors">
                {teamsCount}
              </div>
            </div>

            {/* Col 3: Subtext & Action Arrow */}
            <div className="flex items-center justify-end gap-1.5 text-right">
              <span className="text-[10px] font-medium text-neutral-400 group-hover:text-amber-400 transition-colors hidden sm:inline truncate">
                Casting
              </span>
              <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center text-neutral-400 group-hover:text-amber-400 transition-all shrink-0">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Stat 3: Pentas Luar */}
          <div 
            onClick={() => onNavigate('opportunities')}
            className="bg-neutral-950/80 hover:bg-neutral-800/90 border border-white/5 hover:border-red-500/40 rounded-2xl p-4 transition-all hover:-translate-y-0.5 cursor-pointer group shadow-lg grid grid-cols-3 items-center gap-2.5"
            title="Klik untuk melihat peluang pentas & festival luar"
          >
            {/* Col 1: Icon & Label */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 tracking-wider block truncate">
                  Pentas
                </span>
                <span className="text-[10px] text-neutral-500 block truncate">
                  Luar
                </span>
              </div>
            </div>

            {/* Col 2: Metric */}
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-red-400 group-hover:text-red-300 font-mono tracking-tight">
                {store.opportunities ? String(store.opportunities.length).padStart(2, '0') : '03'}
              </div>
            </div>

            {/* Col 3: Subtext & Action Arrow */}
            <div className="flex items-center justify-end gap-1.5 text-right">
              <span className="text-[10px] font-medium text-neutral-400 group-hover:text-red-400 transition-colors hidden sm:inline truncate">
                Acara
              </span>
              <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center text-neutral-400 group-hover:text-red-400 transition-all shrink-0">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Stat 4: WhatsApp Status */}
          <div 
            onClick={() => onNavigate('join')}
            className="bg-neutral-950/80 hover:bg-neutral-800/90 border border-green-500/20 hover:border-green-500/50 rounded-2xl p-4 transition-all hover:-translate-y-0.5 cursor-pointer group shadow-lg grid grid-cols-3 items-center gap-2.5"
            title="Klik untuk menyertai Komuniti WhatsApp Rasmi"
          >
            {/* Col 1: Icon & Label */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-2 rounded-xl bg-green-500/10 text-green-400 group-hover:scale-110 transition-transform shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase font-bold text-green-400 tracking-wider block truncate">
                  WhatsApp
                </span>
                <span className="text-[10px] text-neutral-500 block truncate">
                  Komuniti
                </span>
              </div>
            </div>

            {/* Col 2: Status Indicator */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                <span>ONLINE</span>
              </div>
            </div>

            {/* Col 3: Subtext & Action Arrow */}
            <div className="flex items-center justify-end gap-1.5 text-right">
              <span className="text-[10px] font-medium text-neutral-400 group-hover:text-green-400 transition-colors hidden sm:inline truncate">
                Sertai
              </span>
              <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-green-500/20 flex items-center justify-center text-neutral-400 group-hover:text-green-400 transition-all shrink-0">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRIMARY BENTO GRID HERO & ACTION SECTION */}
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

        {/* Bento Cell 3: Skills Academy (Col 6 / 12) */}
        <div 
          onClick={() => onNavigate('skills')}
          className="md:col-span-6 bg-neutral-900/60 rounded-3xl p-6 border border-white/5 flex flex-col justify-between hover:border-amber-500/40 hover:bg-neutral-900 transition-all group cursor-pointer"
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
            <div className="w-full grid grid-cols-4 gap-2 mb-4">
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
                className="bg-neutral-900/60 border border-white/5 hover:border-amber-500/40 hover:bg-neutral-900 rounded-3xl p-5 sm:p-6 transition-all hover:-translate-y-1 shadow-lg group cursor-pointer grid grid-cols-[auto_1fr] items-start gap-4"
              >
                {/* Column 1: Icon */}
                <div className="w-12 h-12 rounded-2xl bg-neutral-950/80 border border-white/5 flex items-center justify-center text-2xl select-none group-hover:scale-110 group-hover:border-amber-500/30 transition-transform shrink-0 shadow-inner">
                  {card.icon}
                </div>

                {/* Column 2: Title & Description */}
                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors flex items-center justify-between gap-1.5">
                    <span className="truncate">{card.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
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
            isAdmin={typeof window !== 'undefined' && localStorage.getItem('teater_admin_auth') === 'true'}
            onEditEventClick={() => onNavigate('admin')}
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

      {/* MODAL: SENARAI PELAJAR BERDAFTAR (NAMA PANGGILAN x KUMPULAN x STATUS) */}
      {showStudentListModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                  <UserCheck className="w-3.5 h-3.5" /> KOMUNITI PELAJAR ({students.length})
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                  Senarai Pelajar Berdaftar
                </h3>
                <p className="text-neutral-400 text-xs">
                  Paparan asas komuniti: <span className="text-amber-400 font-semibold">Nama Panggilan</span> • <span className="text-amber-400 font-semibold">Kumpulan</span> • <span className="text-amber-400 font-semibold">Status</span>
                </p>
              </div>
              <button
                onClick={() => setShowStudentListModal(false)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama panggilan atau status kumpulan..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-950 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
              {studentSearch && (
                <button
                  onClick={() => setStudentSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Students Table / List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar min-h-[220px]">
              {students.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-xs">
                  Belum ada pelajar mendaftar. Jadilah yang pertama!
                </div>
              ) : (
                (() => {
                  const filtered = students.filter(s => {
                    const q = studentSearch.toLowerCase().trim();
                    if (!q) return true;
                    const nickname = (s.nickname || s.full_name.split(' ')[0] || '').toLowerCase();
                    const group = (s.group_status || '').toLowerCase();
                    const assigned = teams.find(t => t.id === s.assigned_team_id)?.name?.toLowerCase() || '';
                    return nickname.includes(q) || group.includes(q) || assigned.includes(q);
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-10 text-neutral-500 text-xs">
                        Tiada pelajar dijumpai untuk carian "{studentSearch}".
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-hidden border border-white/5 rounded-2xl bg-neutral-950/60">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 bg-neutral-950 text-[10px] font-mono uppercase text-neutral-400">
                            <th className="py-3 px-4">Nama Panggilan</th>
                            <th className="py-3 px-4">Kumpulan</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                          {filtered.map((std, idx) => {
                            const displayName = std.nickname?.trim() || std.full_name?.split(' ')[0] || 'Ahli Komuniti';
                            const assignedTeam = teams.find(t => t.id === std.assigned_team_id);
                            const groupDisplay = assignedTeam ? assignedTeam.name : std.group_status || 'Belum Mempunyai Kumpulan';
                            
                            return (
                              <tr key={std.id || idx} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                                      {displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-bold text-white uppercase tracking-wide">
                                      {displayName}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-1.5 text-neutral-300">
                                    <Users className="w-3.5 h-3.5 text-neutral-500" />
                                    <span className="text-xs font-medium">{groupDisplay}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <StatusBadge status={std.status || 'JOINED'} size="sm" />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Footer actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-[11px] text-neutral-500">
                Jumlah: <strong className="text-white">{students.length}</strong> pelajar berdaftar
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStudentListModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setShowStudentListModal(false);
                    onNavigate('join');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Sertai Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
