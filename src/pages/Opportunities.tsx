import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { Opportunity, OpportunityStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Award, 
  Clock, 
  Search, 
  Building, 
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const Opportunities: React.FC = () => {
  const [opportunities] = useState<Opportunity[]>(storage.getOpportunities());
  const [selectedStatus, setSelectedStatus] = useState<'Semua' | OpportunityStatus>('Semua');
  const [search, setSearch] = useState('');

  const filtered = opportunities.filter(opp => {
    const matchesStatus = selectedStatus === 'Semua' || opp.status === selectedStatus;
    const matchesSearch = 
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.organiser.toLowerCase().includes(search.toLowerCase()) ||
      opp.category.toLowerCase().includes(search.toLowerCase()) ||
      opp.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Bento Row: 8-col Header + 4-col Opportunities Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Trophy className="w-3.5 h-3.5" />
              PELUANG PERTANDINGAN & SAYEMBARA TEATER
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Peluang & Festival Luar
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Senarai rasmi pertandingan teater MARA, festival drama belia IPT, dan sayembara skrip peringkat negeri dan kebangsaan. Setiap peluang disertakan sumber rasmi penganjur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Peringkat</span>
              <p className="text-xs font-bold text-white">Negeri & Kebangsaan</p>
            </div>
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Penyertaan</span>
              <p className="text-xs font-bold text-amber-400">Terbuka IPT & Belia</p>
            </div>
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Pengesahan</span>
              <p className="text-xs font-bold text-green-400">Pautan Sah Penganjur</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-neutral-900/80">
              JUMLAH PELUANG
            </span>
            <Award className="w-6 h-6 text-neutral-950" />
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-950">
              {opportunities.length} Acara
            </div>
            <p className="text-xs font-bold text-neutral-900">
              Peluang Berprestij Untuk Pelajar KPMBP
            </p>
          </div>

          <div className="p-3 bg-neutral-950/20 rounded-2xl text-[11px] font-semibold text-neutral-900 leading-snug">
            Wakil KPMBP akan dibimbing secara intensif oleh Sir Penasihat Teater.
          </div>
        </div>
      </div>

      {/* Filter & Search Bento Bar */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {(['Semua', 'OPEN', 'UPCOMING', 'CLOSED'] as ('Semua' | OpportunityStatus)[]).map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all ${
                selectedStatus === status
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {status === 'OPEN' ? '🟢 Terbuka' : status === 'UPCOMING' ? '🟡 Akan Datang' : status === 'CLOSED' ? '⚫ Ditutup' : 'Semua Status'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari pertandingan atau penganjur..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Opportunities Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(opp => (
          <div
            key={opp.id}
            className="bg-neutral-900 border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between group space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-neutral-950 text-amber-300 border border-white/5 font-bold">
                  {opp.category}
                </span>
                <StatusBadge status={opp.status} />
              </div>

              <div>
                <h3 className="text-base font-black uppercase text-white group-hover:text-amber-400 transition-colors">
                  {opp.title}
                </h3>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-1 font-mono">
                  <Building className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Penganjur: {opp.organiser}</span>
                </p>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                {opp.description}
              </p>

              {/* Specs */}
              <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Tarikh Acara:
                  </span>
                  <span className="text-white font-mono font-medium">{opp.event_date}</span>
                </div>

                <div className="flex items-center justify-between text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Tarikh Tutup:
                  </span>
                  <span className="text-white font-mono font-medium">{opp.deadline}</span>
                </div>

                <div className="flex items-center justify-between text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> Lokasi:
                  </span>
                  <span className="text-white font-medium truncate max-w-[160px]">{opp.venue}</span>
                </div>

                <div className="flex items-center justify-between text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Hadiah:
                  </span>
                  <span className="text-amber-400 font-bold font-mono truncate max-w-[160px]">{opp.prize}</span>
                </div>
              </div>
            </div>

            {/* Link button */}
            <div className="pt-3 border-t border-white/5">
              <a
                href={opp.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-amber-400 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/5"
              >
                <span>Pautan Rasmi Penganjur</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-xs font-mono uppercase">
          Tiada peluang pertandingan ditemui untuk carian ini.
        </div>
      )}

    </div>
  );
};
