import React, { useState, useEffect, useRef } from 'react';
import { TheatreEvent } from '../types';
import { PageView } from './Navbar';
import { storage } from '../lib/storage';
import { 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  MapPin, 
  Users, 
  Sparkles, 
  Edit3, 
  Plus, 
  X, 
  Check, 
  Clock, 
  ArrowRight,
  Sliders,
  Calendar,
  Play,
  Pause
} from 'lucide-react';

interface EventSpotlightCarouselProps {
  onNavigate: (page: PageView) => void;
  onOpenAdmin?: () => void;
}

const AUTO_SWIPE_INTERVAL = 8500; // Slower pace: 8.5 seconds per slide for comfortable reading

export const EventSpotlightCarousel: React.FC<EventSpotlightCarouselProps> = ({ 
  onNavigate,
  onOpenAdmin
}) => {
  const [events, setEvents] = useState<TheatreEvent[]>(() => storage.getEvents());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TheatreEvent | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const [slideKey, setSlideKey] = useState(0);

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isInteracting = useRef(false);

  // Check admin status & subscribe to real-time storage updates
  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(localStorage.getItem('teater_admin_auth') === 'true');
    };
    checkAdmin();
    window.addEventListener('storage', checkAdmin);

    const unsub = storage.subscribe((store) => {
      setEvents(store.events);
      if (currentIndex >= store.events.length) {
        setCurrentIndex(Math.max(0, store.events.length - 1));
      }
    });

    return () => {
      window.removeEventListener('storage', checkAdmin);
      unsub();
    };
  }, [currentIndex]);

  const refreshEvents = () => {
    const updated = storage.getEvents();
    setEvents(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(0, updated.length - 1));
    }
  };

  const currentEvent = events[currentIndex] || events[0] || null;

  const nextSlide = () => {
    if (events.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % events.length);
    setSlideKey((k) => k + 1);
  };

  const prevSlide = () => {
    if (events.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    setSlideKey((k) => k + 1);
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    setSlideKey((k) => k + 1);
  };

  // Auto Swipe Medium Speed Timer (5 seconds)
  useEffect(() => {
    if (!isAutoPlayEnabled || events.length <= 1 || isHovered || isEditModalOpen) {
      return;
    }

    const timer = setInterval(() => {
      if (!isInteracting.current) {
        nextSlide();
      }
    }, AUTO_SWIPE_INTERVAL);

    return () => clearInterval(timer);
  }, [isAutoPlayEnabled, events.length, isHovered, isEditModalOpen, currentIndex]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isInteracting.current = true;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    isInteracting.current = false;
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Open Edit Modal
  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentEvent) return;
    setEditingEvent({ ...currentEvent });
    setIsCreatingNew(false);
    setIsEditModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newTemplate: TheatreEvent = {
      id: 'event-' + Date.now(),
      title: 'Pertandingan Teater Baharu 2026',
      tagline: 'Pentas Cipta Bakat Siswa KPMBP',
      description: 'Pertandingan teater interaktif mencungkil bakat dan kreativiti mahasiswa KPMBP.',
      date: '2026-09-30',
      day: 'Rabu',
      start_time: '8:00 PM',
      end_time: '10:30 PM',
      venue: 'Dewan Seminar KPMBP',
      group_size: 5,
      registration_deadline: '2026-09-24T23:59:00',
      status: 'UPCOMING',
      theme_color: 'ruby',
      highlight_badge: 'ACARA BAHARU',
      deadline_label: '24 SEPT DEADLINE',
      prizes: [
        { rank: 'Hadiah Utama', amount: 'RM 150.00', description: 'Trofi + Sijil Penghargaan + Hadiah Tunai' },
        { rank: 'Tempat Kedua', amount: 'RM 100.00', description: 'Trofi + Sijil Penghargaan' },
        { rank: 'Tempat Ketiga', amount: 'RM 60.00', description: 'Sijil Penyertaan' }
      ],
      organizer: 'Kelab Legasi KPMBP',
      rules: [
        'Terbuka kepada semua mahasiswa KPMBP.',
        'Masa pementasan terhad kepada 10 minit.'
      ],
      team_formation_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setEditingEvent(newTemplate);
    setIsCreatingNew(true);
    setIsEditModalOpen(true);
  };

  // Save Event Changes
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    if (isCreatingNew) {
      storage.createEvent(editingEvent);
      refreshEvents();
      setCurrentIndex(events.length); // Jump to new item
    } else {
      storage.updateEvent(editingEvent.id, editingEvent);
      refreshEvents();
    }

    setIsEditModalOpen(false);
    setEditingEvent(null);
  };

  // Delete current event
  const handleDeleteEvent = () => {
    if (!editingEvent) return;
    if (events.length <= 1) {
      alert('Sekurang-kurangnya satu acara perlu kekal di dalam sistem.');
      return;
    }
    if (window.confirm(`Adakah anda pasti mahu memadam acara "${editingEvent.title}"?`)) {
      storage.deleteEvent(editingEvent.id);
      refreshEvents();
      setIsEditModalOpen(false);
      setEditingEvent(null);
      setCurrentIndex(0);
    }
  };

  // Determine Gradient & Theme Styling
  const getThemeClasses = (color?: string) => {
    switch (color) {
      case 'ruby':
        return {
          bg: 'bg-gradient-to-br from-rose-600 via-red-600 to-amber-700',
          shadow: 'shadow-red-950/40',
          badgeBg: 'bg-black text-white',
          pillBg: 'bg-black/20 text-white',
          mainBtn: 'bg-black text-white hover:bg-neutral-900',
          accentText: 'text-white'
        };
      case 'emerald':
        return {
          bg: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-800',
          shadow: 'shadow-emerald-950/40',
          badgeBg: 'bg-black text-white',
          pillBg: 'bg-black/20 text-white',
          mainBtn: 'bg-black text-white hover:bg-neutral-900',
          accentText: 'text-white'
        };
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-800',
          shadow: 'shadow-indigo-950/40',
          badgeBg: 'bg-black text-white',
          pillBg: 'bg-black/20 text-white',
          mainBtn: 'bg-black text-white hover:bg-neutral-900',
          accentText: 'text-white'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-600 via-fuchsia-700 to-indigo-800',
          shadow: 'shadow-purple-950/40',
          badgeBg: 'bg-black text-white',
          pillBg: 'bg-black/20 text-white',
          mainBtn: 'bg-black text-white hover:bg-neutral-900',
          accentText: 'text-white'
        };
      case 'amber':
      default:
        return {
          bg: 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700',
          shadow: 'shadow-amber-950/30',
          badgeBg: 'bg-black text-white',
          pillBg: 'bg-black/15 text-black',
          mainBtn: 'bg-black text-white hover:bg-neutral-900',
          accentText: 'text-black'
        };
    }
  };

  if (!currentEvent) return null;

  const theme = getThemeClasses(currentEvent.theme_color);
  const firstPrize = currentEvent.prizes?.[0]?.amount || 'RM 150.00';
  const prizeDesc = currentEvent.prizes?.[0]?.description || 'Trofi + Sijil';
  const groupLabel = currentEvent.group_size === 1 
    ? 'Solo / Individu' 
    : currentEvent.group_size === 2 
    ? 'Pasangan (2 Orang)' 
    : `${currentEvent.group_size} Orang / Kumpulan`;

  return (
    <div className="md:col-span-5 relative group/card flex flex-col">
      {/* Bento Spotlight Card Container */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`${theme.bg} ${theme.shadow} rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-black shadow-xl min-h-[440px] relative overflow-hidden transition-all duration-500 select-none`}
      >
        {/* Decorative Background Glow Effect */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        {/* Subtle Auto-Swipe Progress Indicator Bar (Top Edge) */}
        {events.length > 1 && isAutoPlayEnabled && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-black/10 overflow-hidden">
            <div 
              key={slideKey}
              style={{
                animationDuration: `${AUTO_SWIPE_INTERVAL}ms`,
                animationPlayState: (isHovered || isEditModalOpen) ? 'paused' : 'running'
              }}
              className="h-full bg-white/75 w-full origin-left animate-swipe-progress"
            />
          </div>
        )}

        {/* Top Header Row: Badges, Counter & Admin Quick Edit */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`${theme.badgeBg} px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm`}>
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{currentEvent.highlight_badge || 'EVENT SEMASA'}</span>
              </span>

              {events.length > 1 && (
                <div className="flex items-center gap-1 bg-black/20 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  <span>{currentIndex + 1} / {events.length}</span>
                  {isAutoPlayEnabled && !isHovered && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Auto Swipe Aktif (Kelajuan Perlahan & Santai)" />
                  )}
                  {isHovered && (
                    <span className="text-[9px] opacity-80 font-sans font-normal ml-0.5">Jeda</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {isAdmin && (
                <button
                  onClick={handleOpenEdit}
                  title="Edit Acara Ini (Admin)"
                  className="bg-black/70 hover:bg-black text-amber-400 border border-amber-400/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}

              <span className={`${theme.pillBg} font-mono font-black text-xs px-2.5 py-1 rounded-lg tracking-tight uppercase`}>
                {currentEvent.deadline_label || `${currentEvent.date} DEADLINE`}
              </span>
            </div>
          </div>

          {/* Event Title & Subtitle */}
          <div className="space-y-1.5 pr-2 transition-opacity duration-300">
            <h3 className="text-2xl sm:text-3xl font-black uppercase leading-tight tracking-tight text-white drop-shadow-sm line-clamp-2">
              {currentEvent.title}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-white/90 leading-snug line-clamp-2">
              {currentEvent.tagline || currentEvent.description}
            </p>
          </div>
        </div>

        {/* Interactive Middle Info Blocks */}
        <div className="space-y-2.5 my-4">
          <div 
            onClick={() => onNavigate('opportunities')}
            className="flex items-center gap-3 bg-black/15 hover:bg-black/25 backdrop-blur-sm p-3 rounded-2xl border border-black/10 cursor-pointer transition-all active:scale-[0.99] text-white"
          >
            <div className="text-2xl select-none flex-shrink-0">🏆</div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-75">Hadiah Utama</p>
              <p className="font-black text-base sm:text-lg leading-tight truncate">
                {firstPrize}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 flex-shrink-0" />
          </div>

          <div 
            onClick={() => onNavigate('teams')}
            className="flex items-center gap-3 bg-black/15 hover:bg-black/25 backdrop-blur-sm p-3 rounded-2xl border border-black/10 cursor-pointer transition-all active:scale-[0.99] text-white"
          >
            <div className="text-2xl select-none flex-shrink-0">📍</div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-75">Lokasi & Format</p>
              <p className="font-black text-xs sm:text-sm leading-tight truncate">
                {currentEvent.venue} • {groupLabel}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 opacity-50 flex-shrink-0" />
          </div>
        </div>

        {/* Bottom CTA Action Buttons & Carousel Controls */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('teams')}
              className={`flex-1 ${theme.mainBtn} py-3 rounded-2xl font-bold text-xs uppercase tracking-widest text-center transition-all shadow-md active:scale-95 cursor-pointer`}
            >
              Casting & Teams
            </button>
            <button
              onClick={() => onNavigate('join')}
              className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-colors cursor-pointer active:scale-95 shadow-sm"
            >
              Daftar
            </button>
          </div>

          {/* Carousel Pagination & Controls (when >= 2 events) */}
          <div className="flex items-center justify-between pt-1">
            {events.length > 1 ? (
              <>
                <div className="flex items-center gap-1.5">
                  {events.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Pergi ke acara ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentIndex === idx 
                          ? 'w-6 bg-white shadow-sm' 
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  {/* Play / Pause Toggle Button */}
                  <button
                    onClick={() => setIsAutoPlayEnabled(prev => !prev)}
                    title={isAutoPlayEnabled ? 'Jeda Auto-Swipe' : 'Mula Auto-Swipe'}
                    className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all active:scale-90 cursor-pointer mr-0.5"
                  >
                    {isAutoPlayEnabled ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={prevSlide}
                    aria-label="Acara Sebelumnya"
                    className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all active:scale-90 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Acara Seterusnya"
                    className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all active:scale-90 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              isAdmin && (
                <button
                  onClick={handleOpenCreate}
                  className="text-[11px] font-bold text-white/80 hover:text-white flex items-center gap-1 underline underline-offset-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Pertandingan Ke-2</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Admin Quick Add / Manage Button Under Card */}
      {isAdmin && (
        <div className="mt-2 flex items-center justify-between px-2 text-xs text-neutral-400">
          <span className="text-[11px] font-mono text-amber-500/80">⚡ Carousel Pertandingan Aktif</span>
          <button
            onClick={handleOpenCreate}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Cipta Pertandingan Baharu</span>
          </button>
        </div>
      )}

      {/* Inline Admin Edit / Create Event Modal */}
      {isEditModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white">
                    {isCreatingNew ? 'Cipta Acara / Pertandingan' : 'Edit Acara Pentas'}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Kemas kini butiran pertandingan yang dipaparkan dalam Carousel Spotlight.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold uppercase text-[10px] mb-1">
                  Tajuk Pertandingan *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="Cth: Pertandingan Teater KPMBP 2026"
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase text-[10px] mb-1">
                    Label Lencana (Badge)
                  </label>
                  <input
                    type="text"
                    value={editingEvent.highlight_badge || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, highlight_badge: e.target.value })}
                    placeholder="Cth: EVENT UTAMA / TERBUKA"
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase text-[10px] mb-1">
                    Tema Warna Kad
                  </label>
                  <select
                    value={editingEvent.theme_color || 'amber'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, theme_color: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="amber">Emas / Amber (Gold)</option>
                    <option value="ruby">Merah / Ruby Crimson</option>
                    <option value="emerald">Hijau / Emerald Jade</option>
                    <option value="blue">Biru / Ocean Indigo</option>
                    <option value="purple">Ungu / Royal Purple</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase text-[10px] mb-1">
                  Tagline / Ringkasan Menarik
                </label>
                <textarea
                  rows={2}
                  value={editingEvent.tagline || editingEvent.description}
                  onChange={(e) => setEditingEvent({ 
                    ...editingEvent, 
                    tagline: e.target.value,
                    description: e.target.value 
                  })}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase text-[10px] mb-1">
                    Hadiah Utama (Amount) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.prizes?.[0]?.amount || 'RM 150.00'}
                    onChange={(e) => {
                      const updatedPrizes = [...(editingEvent.prizes || [])];
                      if (updatedPrizes.length === 0) {
                        updatedPrizes.push({ rank: 'Hadiah Utama', amount: e.target.value, description: 'Trofi + Sijil' });
                      } else {
                        updatedPrizes[0] = { ...updatedPrizes[0], amount: e.target.value };
                      }
                      setEditingEvent({ ...editingEvent, prizes: updatedPrizes });
                    }}
                    placeholder="Cth: RM 150.00"
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase text-[10px] mb-1">
                    Label Tarikh Tutup (Deadline)
                  </label>
                  <input
                    type="text"
                    value={editingEvent.deadline_label || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, deadline_label: e.target.value })}
                    placeholder="Cth: 17 OGOS DEADLINE"
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase text-[10px] mb-1">
                    Lokasi / Venue Pentas *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.venue}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    placeholder="Cth: Dewan Seminar KPMBP"
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase text-[10px] mb-1">
                    Bilangan Ahli (Format)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={editingEvent.group_size}
                    onChange={(e) => setEditingEvent({ ...editingEvent, group_size: parseInt(e.target.value) || 1 })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase text-[10px] mb-1">
                    Tarikh Pementasan
                  </label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase text-[10px] mb-1">
                    Status Pendaftaran
                  </label>
                  <select
                    value={editingEvent.status}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="ACTIVE">AKTIF (ACTIVE)</option>
                    <option value="UPCOMING">AKAN DATANG (UPCOMING)</option>
                    <option value="CLOSED">DITUTUP (CLOSED)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10 gap-3">
                {!isCreatingNew && events.length > 1 ? (
                  <button
                    type="button"
                    onClick={handleDeleteEvent}
                    className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                  >
                    Padam Acara
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-amber-950/40 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
