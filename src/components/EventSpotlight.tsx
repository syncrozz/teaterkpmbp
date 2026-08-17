import React from 'react';
import { TheatreEvent } from '../types';
import { StatusBadge } from './StatusBadge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Users, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface EventSpotlightProps {
  event: TheatreEvent;
  onJoinClick: () => void;
  onViewTeamsClick: () => void;
}

export const EventSpotlight: React.FC<EventSpotlightProps> = ({
  event,
  onJoinClick,
  onViewTeamsClick
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-white/10 p-6 sm:p-8 md:p-10 shadow-2xl space-y-8">
      
      {/* Header Badges & Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Acara Teater Utama 2026
          </span>
          <StatusBadge status={event.status} size="md" />
        </div>

        <div className="text-xs text-neutral-400 bg-neutral-950 px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2 font-mono">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>TUTUP: <strong className="text-white">17 OGOS 2026, 10.00 PM</strong></span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
          🎭 {event.title}
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-3xl">
          {event.description}
        </p>
      </div>

      {/* Key Event Details Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-neutral-800 text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Tarikh & Hari</p>
            <p className="text-sm font-black text-white">{event.date} ({event.day || 'Khamis'})</p>
          </div>
        </div>

        <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-neutral-800 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Masa Pementasan</p>
            <p className="text-sm font-black text-white">{event.start_time} – {event.end_time}</p>
          </div>
        </div>

        <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-neutral-800 text-amber-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Lokasi Pentas</p>
            <p className="text-sm font-black text-white">{event.venue}</p>
          </div>
        </div>

        <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-neutral-800 text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Syarat Ahli</p>
            <p className="text-sm font-black text-white">{event.group_size} orang / kumpulan</p>
          </div>
        </div>
      </div>

      {/* Prizes Section */}
      <div className="bg-neutral-950 rounded-3xl p-5 md:p-6 border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <Trophy className="w-5 h-5" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">
            Hadiah & Ganjaran Pemenang
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {event.prizes.map((prize, idx) => (
            <div
              key={idx}
              className="bg-neutral-900 rounded-2xl p-4 text-center border border-white/5 flex flex-col justify-between"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                {prize.rank}
              </span>
              <span className="text-lg md:text-xl font-black text-amber-400 my-0.5 font-mono">
                {prize.amount}
              </span>
              <span className="text-[10px] text-neutral-500">
                {prize.description || 'Trofi + Sijil'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rules & Guidelines Summary */}
      {event.rules && event.rules.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Syarat Ringkas Pertandingan:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-neutral-300">
            {event.rules.slice(0, 4).map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-neutral-950 p-3 rounded-2xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action CTAs */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onJoinClick}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest transition-all transform active:scale-95 shadow-xl shadow-red-950/50 flex items-center justify-center gap-2"
        >
          <span>Daftar Minat / Sertai Teater</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onViewTeamsClick}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2"
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Lihat Kumpulan & Casting</span>
        </button>
      </div>

    </div>
  );
};
