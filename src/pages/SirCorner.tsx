import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { SirNote, SirCategory } from '../types';
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
  Flame
} from 'lucide-react';

const CATEGORIES: ('Semua' | SirCategory)[] = [
  'Semua',
  'Jalan Cerita',
  'Lakonan',
  'Pengurusan',
  'Tips & Tricks'
];

export const SirCorner: React.FC = () => {
  const [notes] = useState<SirNote[]>(storage.getSirNotes());
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | SirCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNote, setActiveNote] = useState<SirNote | null>(null);

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
      
      {/* Top Bento Row: 8-col Header + 4-col Mentor Quote Bento Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <GraduationCap className="w-3.5 h-3.5" />
              BIMBINGAN, NOTA & PETUA PENTAS
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Sir's Corner
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Ruang panduan artistik daripada Penasihat Teater KPMBP. Peranan Sir adalah sebagai <strong>coach, fasilitator, dan mentor</strong> — membimbing anda mencari suara, keyakinan, dan estetika pentas anda sendiri.
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

        <div className="md:col-span-4 bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-neutral-900/80">
              AMANAT PENASIHAT
            </span>
            <MessageSquareQuote className="w-6 h-6 text-neutral-950" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-black text-neutral-950 leading-snug italic">
              «Sir bukan menentukan semua perkara. Tugas saya membina ruang selamat untuk anda berani beraksi. Keputusan artistik terakhir tetap di tangan pelajar!»
            </p>
            <p className="text-[11px] font-bold text-neutral-900/80 font-mono">
              — Sir Penasihat Seni Teater KPMBP
            </p>
          </div>

          <div className="p-3 bg-neutral-950/20 rounded-2xl text-[11px] font-semibold text-neutral-900 leading-snug">
            Sentiasa terbuka untuk sesi bimbingan skrip & lakonan secara bersemuka atau WhatsApp.
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
                className="text-neutral-400 hover:text-white text-xs font-mono px-3 py-1.5 rounded-xl bg-neutral-950 border border-white/5"
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
                className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-950/40"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
