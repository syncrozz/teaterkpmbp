import React, { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { Announcement, AnnouncementCategory } from '../types';
import { 
  Bell, 
  Sparkles, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Tag, 
  User, 
  Search,
  Flame
} from 'lucide-react';

const CATEGORIES: ('Semua' | AnnouncementCategory)[] = [
  'Semua',
  'Important',
  'Competition',
  'Training',
  'Team',
  'General'
];

export const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => 
    storage.getAnnouncements().filter(a => a.published)
  );
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | AnnouncementCategory>('Semua');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = storage.subscribe((store) => {
      setAnnouncements(store.announcements.filter(a => a.published));
    });
    return () => unsub();
  }, []);

  const filtered = announcements.filter(item => {
    const matchesCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Bento Row: 8-col Header + 4-col Announcement Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Bell className="w-3.5 h-3.5" />
              MAKLUMAN & NOTIS RASMI PENTAS
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Pengumuman Rasmi
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Notis rasmi daripada Jawatankuasa Penganjur Teater KPMBP mengenai jadual pementasan, taklimat teknikal, latihan intensif, dan perkembangan komuniti.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all border ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/5'
                }`}
              >
                {cat === 'Important' ? '🔥 Penting' : cat === 'Competition' ? '🏆 Pertandingan' : cat === 'Training' ? '🎭 Latihan' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-neutral-900/80">
              NOTIFIKASI
            </span>
            <Bell className="w-6 h-6 text-neutral-950" />
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-950">
              {announcements.length} Notis
            </div>
            <p className="text-xs font-bold text-neutral-900">
              Pengumuman Rasmi Diterbitkan
            </p>
          </div>

          <div className="p-3 bg-neutral-950/20 rounded-2xl text-[11px] font-semibold text-neutral-900 leading-snug">
            Sila semak saluran pengumuman dari semasa ke semasa untuk maklumat terkini.
          </div>
        </div>
      </div>

      {/* Search Bento Bar */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase text-neutral-400">
          Senarai Hebahan Terkini ({filtered.length})
        </span>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari kata kunci pengumuman..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Announcements List (Bento Style) */}
      <div className="space-y-4">
        {filtered.map(ann => (
          <div
            key={ann.id}
            className={`bg-neutral-900 rounded-3xl p-6 sm:p-7 transition-all border shadow-xl ${
              ann.priority === 'High'
                ? 'border-red-500/40 bg-gradient-to-r from-red-950/20 via-neutral-900 to-neutral-900'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                {ann.priority === 'High' && (
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-red-400" />
                    Keutamaan Tinggi
                  </span>
                )}
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-neutral-950 text-amber-400 border border-white/5">
                  {ann.category}
                </span>
              </div>

              <span className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                {new Date(ann.created_at).toLocaleDateString('ms-MY', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>

            <h3 className="text-lg font-black uppercase text-white mb-2 tracking-tight">
              {ann.title}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-500" /> Dikeluarkan oleh: <strong className="text-white">{ann.author}</strong>
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-400/90">Teater KPMBP Rasmi</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-xs font-mono uppercase">
          Tiada pengumuman dijumpai untuk carian ini.
        </div>
      )}

    </div>
  );
};
