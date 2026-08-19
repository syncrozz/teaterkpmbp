import React, { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { SirNote, SirCategory, MentorTip } from '../types';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Users, 
  Smile, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  MessageSquareQuote,
  Flame,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  Play,
  Pause,
  Sliders,
  Lock,
  Check,
  X,
  RotateCcw
} from 'lucide-react';

const CATEGORIES: ('Semua' | SirCategory)[] = [
  'Semua',
  'Jalan Cerita',
  'Lakonan',
  'Pengurusan',
  'Tips & Tricks'
];

const TAG_PRESETS = [
  'AMANAT PENASIHAT',
  'PETUA PENTAS & PENGUCAPAN',
  'DINAMIKA ENSEMBEL',
  'SAFE SPACE & EKSPLORASI',
  'PRINSIP LAKONAN',
  'NOTA MOTIVASI SIR'
];

export const SirCorner: React.FC = () => {
  const [notes] = useState<SirNote[]>(storage.getSirNotes());
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | SirCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNote, setActiveNote] = useState<SirNote | null>(null);

  // Carousel & Mentor Tips State
  const [mentorTips, setMentorTips] = useState<MentorTip[]>(() => storage.getMentorTips());
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Admin Management Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Form State for Adding / Editing Tip
  const [editingTipId, setEditingTipId] = useState<string | null>(null);
  const [tipFormTag, setTipFormTag] = useState('AMANAT PENASIHAT');
  const [tipFormQuote, setTipFormQuote] = useState('');
  const [tipFormAuthor, setTipFormAuthor] = useState('— Sir Penasihat Seni Teater KPMBP');
  const [tipFormSubtext, setTipFormSubtext] = useState('Sentiasa terbuka untuk sesi bimbingan skrip & lakonan secara bersemuka atau WhatsApp.');
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Auto-play Carousel Effect
  useEffect(() => {
    if (!isPlaying || isHovered || showAdminModal || showPinModal || mentorTips.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      setActiveTipIndex(prev => (prev + 1) % mentorTips.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, showAdminModal, showPinModal, mentorTips.length]);

  const currentTip = mentorTips[activeTipIndex] || mentorTips[0];

  const handleNextTip = () => {
    setActiveTipIndex(prev => (prev + 1) % mentorTips.length);
  };

  const handlePrevTip = () => {
    setActiveTipIndex(prev => (prev - 1 + mentorTips.length) % mentorTips.length);
  };

  // Open Admin Handler
  const handleOpenAdmin = () => {
    const isAuth = localStorage.getItem('teater_admin_auth') === 'true';
    if (isAuth) {
      resetForm();
      setShowAdminModal(true);
    } else {
      setPinInput('');
      setPinError(null);
      setShowPinModal(true);
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '5313') {
      localStorage.setItem('teater_admin_auth', 'true');
      setShowPinModal(false);
      resetForm();
      setShowAdminModal(true);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('teater_admin_auth_changed'));
    } else {
      setPinError('Kod PIN Penasihat salah. Sila masukkan PIN yang sah.');
    }
  };

  const resetForm = () => {
    setEditingTipId(null);
    setTipFormTag('AMANAT PENASIHAT');
    setTipFormQuote('');
    setTipFormAuthor('— Sir Penasihat Seni Teater KPMBP');
    setTipFormSubtext('Sentiasa terbuka untuk sesi bimbingan skrip & lakonan secara bersemuka atau WhatsApp.');
    setFormSuccessMessage(null);
  };

  const handleStartEdit = (tip: MentorTip) => {
    setEditingTipId(tip.id);
    setTipFormTag(tip.tag);
    setTipFormQuote(tip.quote);
    setTipFormAuthor(tip.author);
    setTipFormSubtext(tip.subtext || '');
    setFormSuccessMessage(null);
  };

  const handleSaveTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipFormQuote.trim()) return;

    if (editingTipId) {
      storage.updateMentorTip(editingTipId, {
        tag: tipFormTag.trim() || 'AMANAT PENASIHAT',
        quote: tipFormQuote.trim(),
        author: tipFormAuthor.trim() || '— Sir Penasihat Seni Teater KPMBP',
        subtext: tipFormSubtext.trim()
      });
      setFormSuccessMessage('Amanat berjaya dikemaskini!');
    } else {
      storage.addMentorTip({
        tag: tipFormTag.trim() || 'AMANAT PENASIHAT',
        quote: tipFormQuote.trim(),
        author: tipFormAuthor.trim() || '— Sir Penasihat Seni Teater KPMBP',
        subtext: tipFormSubtext.trim()
      });
      setFormSuccessMessage('Amanat baharu berjaya ditambah!');
    }

    const updated = storage.getMentorTips();
    setMentorTips(updated);
    if (!editingTipId) {
      setActiveTipIndex(0);
    }
    resetForm();
  };

  const handleDeleteTip = (id: string) => {
    if (mentorTips.length <= 1) {
      alert('Perlu sekurang-kurangnya 1 amanat aktif dalam sistem.');
      return;
    }
    if (window.confirm('Adakah anda pasti mahu memadam amanat ini dari paparan carousel?')) {
      storage.deleteMentorTip(id);
      const updated = storage.getMentorTips();
      setMentorTips(updated);
      setActiveTipIndex(0);
      if (editingTipId === id) {
        resetForm();
      }
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesCat = selectedCategory === 'Semua' || note.category === selectedCategory;
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Bento Row: 8-col Header + 4-col Mentor Quote Bento Card (Carousel + Editable) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <GraduationCap className="w-3.5 h-3.5" />
              BIMBINGAN, NOTA & PETUA PENTAS
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              BIMBINGAN
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Penasihat membimbing proses, bukan menentukan hasil. Ruang diberikan kepada pelajar untuk meneroka idea, membina keyakinan dan membuat keputusan artistik mereka sendiri.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Prinsip Pentas</span>
              <p className="text-xs font-bold text-white">Safe Space & Keberanian</p>
            </div>
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Kuasa Kreatif</span>
              <p className="text-xs font-bold text-amber-400">100% Milik Pelajar</p>
            </div>
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Kemas Kini</span>
              <p className="text-xs font-bold text-green-400">Mingguan Berkala</p>
            </div>
          </div>
        </div>

        {/* 4-col Carousel & Editable Mentor Quote Card */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="md:col-span-4 bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl space-y-6 relative overflow-hidden transition-all duration-300"
        >
          {/* Card Top Bar: Tag, Counter & Carousel Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono uppercase font-black tracking-widest text-neutral-900/90 bg-neutral-950/15 px-2.5 py-0.5 rounded-full">
                {currentTip?.tag || 'AMANAT PENASIHAT'}
              </span>
              <span className="text-[9px] font-mono font-black text-neutral-900/70 bg-neutral-950/10 px-1.5 py-0.5 rounded-md">
                {activeTipIndex + 1}/{mentorTips.length}
              </span>
            </div>

            {/* Carousel & Admin Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-xl bg-neutral-950/20 hover:bg-neutral-950/35 text-neutral-950 transition-colors cursor-pointer"
                title={isPlaying ? 'Jeda Carousel' : 'Mainkan Carousel'}
                aria-label={isPlaying ? 'Pause Carousel' : 'Play Carousel'}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>

              <button
                onClick={handlePrevTip}
                className="p-1.5 rounded-xl bg-neutral-950/20 hover:bg-neutral-950/35 text-neutral-950 transition-colors cursor-pointer"
                title="Amanat Sebelum"
                aria-label="Previous Tip"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleNextTip}
                className="p-1.5 rounded-xl bg-neutral-950/20 hover:bg-neutral-950/35 text-neutral-950 transition-colors cursor-pointer"
                title="Amanat Seterusnya"
                aria-label="Next Tip"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleOpenAdmin}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-950 text-amber-400 hover:bg-neutral-900 text-[10px] font-mono font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ml-1"
                title="Urus / Tambah Amanat Baharu (Admin)"
              >
                <Pencil className="w-3 h-3" />
                <span>Urus</span>
              </button>
            </div>
          </div>

          {/* Active Tip Content */}
          <div className="space-y-3 min-h-[110px] flex flex-col justify-center">
            <div className="flex items-start gap-2">
              <MessageSquareQuote className="w-6 h-6 text-neutral-950/70 flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base font-black text-neutral-950 leading-snug italic transition-opacity duration-300">
                {currentTip?.quote}
              </p>
            </div>
            <p className="text-[11px] font-bold text-neutral-900/85 font-mono pl-8">
              {currentTip?.author || '— Sir Penasihat Seni Teater KPMBP'}
            </p>
          </div>

          {/* Card Footer: Subtext & Pagination Dots */}
          <div className="space-y-3">
            {currentTip?.subtext && (
              <div className="p-3 bg-neutral-950/20 rounded-2xl text-[11px] font-semibold text-neutral-900 leading-snug">
                {currentTip.subtext}
              </div>
            )}

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {mentorTips.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTipIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeTipIndex === idx
                      ? 'w-6 bg-neutral-950'
                      : 'w-1.5 bg-neutral-950/35 hover:bg-neutral-950/60'
                  }`}
                  title={`Pergi ke slide ${idx + 1}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bento Bar */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari tips atau kata kunci..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Notes Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <div
            key={note.id}
            onClick={() => setActiveNote(note)}
            className="bg-neutral-900 border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 transition-all hover:-translate-y-1 cursor-pointer shadow-xl flex flex-col justify-between group space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                  {note.category}
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  {new Date(note.created_at).toLocaleDateString('ms-MY')}
                </span>
              </div>

              <h3 className="text-base font-black uppercase text-white group-hover:text-amber-400 transition-colors">
                {note.title}
              </h3>

              <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">
                {note.summary}
              </p>

              {note.key_points && note.key_points.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  {note.key_points.slice(0, 2).map((kp, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300 bg-neutral-950/60 p-2 rounded-xl border border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{kp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
              <span>Baca Panduan Penuh</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-xs font-mono uppercase">
          Tiada panduan dijumpai untuk carian ini.
        </div>
      )}

      {/* READING MODAL */}
      {activeNote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                  {activeNote.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white mt-2">
                  {activeNote.title}
                </h2>
                <p className="text-xs text-neutral-400 mt-1 font-mono">
                  Oleh: {activeNote.author_name} ({activeNote.author_title})
                </p>
              </div>
              <button
                onClick={() => setActiveNote(null)}
                className="text-neutral-400 hover:text-white text-xs font-mono px-3 py-1.5 rounded-xl bg-neutral-950 border border-white/5 cursor-pointer"
              >
                ✕ TUTUP
              </button>
            </div>

            <div className="text-neutral-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {activeNote.content}
            </div>

            {activeNote.key_points && activeNote.key_points.length > 0 && (
              <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Intipati Utama:
                </h4>
                <ul className="space-y-1 text-xs text-neutral-300">
                  {activeNote.key_points.map((kp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveNote(null)}
                className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-950/40 cursor-pointer"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN PIN VERIFICATION MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase text-white">Akses Admin / Penasihat</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Sila masukkan kod PIN keselamatan 4-digit untuk menyunting atau menambah amanat & tips.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  maxLength={4}
                  autoFocus
                  placeholder="••••"
                  value={pinInput}
                  onChange={e => {
                    setPinInput(e.target.value);
                    if (e.target.value === '5313') {
                      localStorage.setItem('teater_admin_auth', 'true');
                      setShowPinModal(false);
                      resetForm();
                      setShowAdminModal(true);
                      window.dispatchEvent(new Event('storage'));
                      window.dispatchEvent(new Event('teater_admin_auth_changed'));
                    }
                  }}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3.5 text-center text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 text-lg tracking-[0.4em] font-mono"
                />
                {pinError && (
                  <p className="text-xs text-red-400 mt-2 text-center font-medium">{pinError}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="w-1/2 py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Sahkan PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN MENTOR TIPS MANAGEMENT MODAL (EDITABLE COMPONENT) */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                  <Sliders className="w-3.5 h-3.5" />
                  PENGURUSAN CAROUSEL AMANAT
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                  Urus Tips & Amanat Penasihat
                </h3>
                <p className="text-neutral-400 text-xs">
                  Tambah amanat baharu atau sunting teks sedia ada untuk dipaparkan pada kad carousel bimbingan.
                </p>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccessMessage && (
              <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs flex items-center justify-between">
                <span>{formSuccessMessage}</span>
                <button 
                  onClick={() => setFormSuccessMessage(null)}
                  className="text-emerald-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Form Section */}
            <form onSubmit={handleSaveTip} className="bg-neutral-950 p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  {editingTipId ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {editingTipId ? 'Sunting Amanat Sedia Ada' : 'Tambah Amanat / Tips Baharu'}
                </h4>
                {editingTipId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-[11px] font-mono text-neutral-400 hover:text-white underline"
                  >
                    Batal Sunting (Tambah Baharu)
                  </button>
                )}
              </div>

              {/* Tag & Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 uppercase font-bold">
                  Tag / Tajuk Kecil
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {TAG_PRESETS.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTipFormTag(preset)}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        tipFormTag === preset
                          ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
                          : 'bg-neutral-900 text-neutral-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder="cth. AMANAT PENASIHAT / PETUA PENTAS"
                  value={tipFormTag}
                  onChange={e => setTipFormTag(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quote / Tip Text */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 uppercase font-bold">
                  Kandungan Amanat / Tips Pentas *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="«Masukkan teks amanat, bimbingan, atau petua pentas di sini...»"
                  value={tipFormQuote}
                  onChange={e => setTipFormQuote(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 leading-relaxed italic"
                />
              </div>

              {/* Author & Subtext */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-bold">
                    Nama Penulis / Tandatangan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="— Sir Penasihat Seni Teater KPMBP"
                    value={tipFormAuthor}
                    onChange={e => setTipFormAuthor(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase font-bold">
                    Nota Bawah / Subtext
                  </label>
                  <input
                    type="text"
                    placeholder="cth. Terbuka untuk sesi bimbingan skrip..."
                    value={tipFormSubtext}
                    onChange={e => setTipFormSubtext(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingTipId ? 'Simpan Perubahan' : 'Tambah ke Carousel'}</span>
                </button>
              </div>
            </form>

            {/* List of Active Carousel Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                  Senarai Amanat Aktif Dalam Carousel ({mentorTips.length})
                </h4>
                <span className="text-[10px] font-mono text-neutral-500">
                  Klik 'Sunting' untuk kemaskini teks atau 'Padam' untuk buang.
                </span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {mentorTips.map((tip, idx) => (
                  <div
                    key={tip.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      editingTipId === tip.id
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : 'bg-neutral-950 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-white/5 text-amber-400">
                          {tip.tag}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-500">
                          Slide #{idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-200 italic line-clamp-2">
                        {tip.quote}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        {tip.author} {tip.subtext ? `• ${tip.subtext}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 pt-1">
                      <button
                        onClick={() => handleStartEdit(tip)}
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 transition-colors cursor-pointer border border-white/5"
                        title="Sunting Amanat"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteTip(tip.id)}
                        disabled={mentorTips.length <= 1}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          mentorTips.length <= 1
                            ? 'bg-neutral-900 text-neutral-600 border-white/5 cursor-not-allowed'
                            : 'bg-neutral-900 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border-white/5'
                        }`}
                        title={mentorTips.length <= 1 ? 'Sekurang-kurangnya 1 amanat diperlukan' : 'Padam Amanat'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider border border-white/5 cursor-pointer"
              >
                Tutup Papan Pengurusan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
