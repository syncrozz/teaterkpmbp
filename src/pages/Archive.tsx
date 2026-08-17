import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { ArchiveRecord, BehindTheScenesItem } from '../types';
import { 
  Film, 
  Sparkles, 
  Calendar, 
  Trophy, 
  User, 
  Users, 
  Camera, 
  Search, 
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';

export const Archive: React.FC = () => {
  const [archives] = useState<ArchiveRecord[]>(storage.getArchives());
  const [btsList] = useState<BehindTheScenesItem[]>(storage.getBehindTheScenes());
  
  const [activeTab, setActiveTab] = useState<'pementasan' | 'bts'>('pementasan');
  const [selectedYear, setSelectedYear] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [search, setSearch] = useState('');
  const [activeRecord, setActiveRecord] = useState<ArchiveRecord | null>(null);

  // Filter for Archives
  const filteredArchives = archives.filter(item => {
    const matchesYear = selectedYear === 'Semua' || item.year.toString() === selectedYear;
    const matchesCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.synopsis.toLowerCase().includes(search.toLowerCase()) ||
      item.director.toLowerCase().includes(search.toLowerCase());
    return matchesYear && matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Bento Row: 8-col Header + 4-col Archive Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Film className="w-3.5 h-3.5" />
              ARKIB SEJARAH & REKOD PRODUKSI PENTAS
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              KPMBP Theatre Archive
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Dokumentasi bersejarah karya naskhah, kemenangan anugerah, serta galeri eksklusif di sebalik tabir produksi teater Kolej Profesional MARA Bandar Penawar dari tahun ke tahun.
            </p>
          </div>

          {/* Mode Selector Tabs inside Bento Box */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setActiveTab('pementasan')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                activeTab === 'pementasan'
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40'
                  : 'bg-neutral-950 text-neutral-300 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Produksi Pementasan ({archives.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bts')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                activeTab === 'bts'
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40'
                  : 'bg-neutral-950 text-neutral-300 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Behind The Scenes ({btsList.length})</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-4 bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-neutral-900/80">
              WARISAN TEATER
            </span>
            <Trophy className="w-6 h-6 text-neutral-950" />
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-950">
              {archives.length} Naskhah
            </div>
            <p className="text-xs font-bold text-neutral-900">
              Koleksi Dokumentasi Pentas KPMBP
            </p>
          </div>

          <div className="p-3 bg-neutral-950/20 rounded-2xl text-[11px] font-semibold text-neutral-900 leading-snug">
            Memelihara legasi seni lakon dan pencapaian teater mahasiswa kolej untuk generasi hadapan.
          </div>
        </div>
      </div>

      {/* TAB 1: PEMENTASAN ARCHIVE */}
      {activeTab === 'pementasan' && (
        <div className="space-y-6">
          {/* Filters Bento Bar */}
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold mr-1">Tahun:</span>
                {['Semua', '2026', '2025', '2024', '2023'].map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase transition-all ${
                      selectedYear === year
                        ? 'bg-amber-400 text-neutral-950 shadow-sm'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold mr-1">Kategori:</span>
                {['Semua', 'Drama', 'Competition', 'Musical', 'Showcase'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-400 text-neutral-950 shadow-sm'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari naskhah atau pengarah..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Grid of Archive Cards (Bento Style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArchives.map(rec => (
              <div
                key={rec.id}
                onClick={() => setActiveRecord(rec)}
                className="bg-neutral-900 border border-white/10 hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all hover:-translate-y-1 cursor-pointer shadow-xl flex flex-col justify-between group"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={rec.cover_image}
                    alt={rec.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-neutral-950/90 text-amber-400 border border-white/10 backdrop-blur-sm">
                      {rec.year}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-neutral-950/90 text-neutral-300 border border-white/10 backdrop-blur-sm">
                      {rec.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 bg-neutral-950/80 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
                      <Trophy className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                      <span className="truncate">{rec.achievement}</span>
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-black uppercase text-white group-hover:text-amber-400 transition-colors">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {rec.synopsis}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                    <span>Pengarah: <strong className="text-white">{rec.director}</strong></span>
                    <span>{rec.participants_count} Peserta</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArchives.length === 0 && (
            <div className="text-center py-16 text-neutral-500 text-xs font-mono uppercase">
              Tiada rekod arkib ditemui untuk carian ini.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BEHIND THE SCENES */}
      {activeTab === 'bts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {btsList.map(bts => (
              <div
                key={bts.id}
                className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-amber-500/40 transition-all"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={bts.image_url}
                    alt={bts.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-neutral-950/90 text-amber-300 border border-white/10 backdrop-blur-sm">
                    {bts.category}
                  </span>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-white group-hover:text-amber-400 transition-colors">
                      {bts.title}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed mt-1 line-clamp-2">
                      {bts.description}
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span>{bts.event_title} ({bts.year})</span>
                    {bts.credit && <span>Kredit: {bts.credit}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ARCHIVE DETAIL MODAL */}
      {activeRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                    Tahun {activeRecord.year}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-neutral-950 text-neutral-300 border border-white/5">
                    {activeRecord.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
                  {activeRecord.title}
                </h2>
                <p className="text-xs text-neutral-400 mt-1 font-mono">
                  Acara: {activeRecord.event_name} • Tarikh: {activeRecord.event_date}
                </p>
              </div>
              <button
                onClick={() => setActiveRecord(null)}
                className="text-neutral-400 hover:text-white text-xs font-mono px-3 py-1.5 rounded-xl bg-neutral-950 border border-white/5"
              >
                ✕ TUTUP
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden max-h-72 border border-white/5">
              <img
                src={activeRecord.cover_image}
                alt={activeRecord.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl text-xs sm:text-sm text-amber-200 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-bold">Pencapaian / Anugerah:</p>
                <p className="text-neutral-300">{activeRecord.achievement}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Sinopsis Pementasan:
              </h4>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                {activeRecord.synopsis}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-neutral-950 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Pengarah:</span>
                <p className="font-bold text-white">{activeRecord.director}</p>
              </div>
              <div className="bg-neutral-950 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Penganjur:</span>
                <p className="font-bold text-white">{activeRecord.organiser}</p>
              </div>
              <div className="bg-neutral-950 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Peserta:</span>
                <p className="font-bold text-amber-400">{activeRecord.participants_count} Pelajar</p>
              </div>
            </div>

            {/* Gallery images if available */}
            {activeRecord.gallery_images && activeRecord.gallery_images.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Galeri Foto:
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {activeRecord.gallery_images.map((img, i) => (
                    <div key={i} className="h-24 rounded-2xl overflow-hidden border border-white/5">
                      <img
                        src={img}
                        alt={`Galeri ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setActiveRecord(null)}
                className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-950/40"
              >
                Tutup Rekod
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
