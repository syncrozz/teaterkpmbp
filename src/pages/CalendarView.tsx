import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { CalendarEvent } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Tag
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [events] = useState<CalendarEvent[]>(storage.getCalendarEvents());
  const [selectedType, setSelectedType] = useState<string>('Semua');

  const types = ['Semua', 'Competition', 'Workshop', 'Rehearsal', 'Briefing', 'Showcase', 'Meeting'];

  const filtered = events.filter(e => {
    return selectedType === 'Semua' || e.type === selectedType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Bento Row: 8-col Header + 4-col Calendar Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <CalendarIcon className="w-3.5 h-3.5" />
              TAKWIM & JADUAL PENTAS KPMBP
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Teater Calendar
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Semak jadual aktiviti teater tahunan merangkumi sesi taklimat arahan teknikal, bengkel lakonan, latihan raptai penuh pentas, dan malam pementasan rasmi.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all border ${
                  selectedType === t
                    ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/5'
                }`}
              >
                {t === 'Competition' ? '🏆 Pertandingan' : t === 'Workshop' ? '🎭 Bengkel' : t === 'Rehearsal' ? '🎬 Raptai' : t}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-neutral-900/80">
              SESI & ACARA
            </span>
            <Clock className="w-6 h-6 text-neutral-950" />
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-950">
              {events.length} Jadual
            </div>
            <p className="text-xs font-bold text-neutral-900">
              Aktiviti Berjadual Sepanjang Musim
            </p>
          </div>

          <div className="p-3 bg-neutral-950/20 rounded-2xl text-[11px] font-semibold text-neutral-900 leading-snug">
            Kemas kini tarikh pementasan akan dipaparkan secara langsung di sini.
          </div>
        </div>
      </div>

      {/* Timeline Schedule Cards (Bento Style) */}
      <div className="space-y-4">
        {filtered.map(evt => (
          <div
            key={evt.id}
            className="bg-neutral-900 border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 group"
          >
            <div className="flex items-start gap-4">
              {/* Date Box */}
              <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col items-center justify-center text-center flex-shrink-0">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                  {new Date(evt.date).toLocaleDateString('ms-MY', { month: 'short' })}
                </span>
                <span className="text-xl font-black text-white leading-none">
                  {new Date(evt.date).getDate()}
                </span>
                <span className="text-[9px] font-mono text-neutral-500 uppercase">
                  {new Date(evt.date).toLocaleDateString('ms-MY', { weekday: 'short' })}
                </span>
              </div>

              {/* Event details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-neutral-950 text-amber-300 border border-white/5">
                    {evt.type}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black uppercase text-white group-hover:text-amber-400 transition-colors">
                  {evt.title}
                </h3>
                <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </div>

            {/* Time, Venue & Target */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 md:text-right text-xs text-neutral-400 border-t md:border-t-0 border-white/5 pt-3 md:pt-0 font-mono">
              <div className="flex items-center md:justify-end gap-1.5 text-white font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{evt.time}</span>
              </div>
              <div className="flex items-center md:justify-end gap-1.5 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>{evt.venue}</span>
              </div>
              <div className="flex items-center md:justify-end gap-1.5 text-neutral-500 text-[11px]">
                <Users className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{evt.target_audience}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
