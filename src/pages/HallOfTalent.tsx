import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { TalentProfile } from '../types';
import { 
  Award, 
  Sparkles, 
  GraduationCap, 
  Trophy, 
  CheckCircle2, 
  User, 
  Search,
  Star,
  Film
} from 'lucide-react';

export const HallOfTalent: React.FC = () => {
  const [talents] = useState<TalentProfile[]>(storage.getTalents().filter(t => t.published));
  const [selectedRole, setSelectedRole] = useState<string>('Semua');
  const [search, setSearch] = useState('');

  const filtered = talents.filter(t => {
    const matchesRole = selectedRole === 'Semua' || t.roles.includes(selectedRole);
    const matchesSearch = 
      t.public_name.toLowerCase().includes(search.toLowerCase()) ||
      t.programme.toLowerCase().includes(search.toLowerCase()) ||
      t.bio.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Bento Row: 8-col Header + 4-col Talent Roster Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              PENGIKTIRAFAN BAKAT MAHASISWA KPMBP
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Hall of Talent
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Mengiktiraf dedikasi mahasiswa KPMBP dalam seni lakonan watak, penulisan skrip, pengarahan pementasan, serta kepakaran teknikal & prop pentas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Bidang</span>
              <p className="text-xs font-bold text-white">Lakonan & Skrip</p>
            </div>
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Teknikal</span>
              <p className="text-xs font-bold text-amber-400">Lighting & Props</p>
            </div>
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Pengiktirafan</span>
              <p className="text-xs font-bold text-green-400">Anugerah Kolej & MARA</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-neutral-900/80">
              ROSTER BAKAT
            </span>
            <Star className="w-6 h-6 text-neutral-950" />
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-950">
              {talents.length} Bakat
            </div>
            <p className="text-xs font-bold text-neutral-900">
              Mahasiswa Profil Terpilih Teater
            </p>
          </div>

          <div className="p-3 bg-neutral-950/20 rounded-2xl text-[11px] font-semibold text-neutral-900 leading-snug">
            Sertai pementasan teater KPMBP untuk dicalonkan ke dalam Hall of Talent rasmi kolej.
          </div>
        </div>
      </div>

      {/* Role Filters & Search Bento Bar */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {['Semua', 'Actor', 'Scriptwriter', 'Director', 'Technical Crew', 'Stage Manager'].map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all ${
                selectedRole === role
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {role === 'Semua' ? 'Semua Peranan' : `⭐ ${role}`}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama atau program..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Talent Cards Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(talent => (
          <div
            key={talent.id}
            className="bg-neutral-900 border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              
              {/* Avatar & Name Header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 flex-shrink-0">
                  {talent.avatar_url ? (
                    <img
                      src={talent.avatar_url}
                      alt={talent.public_name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-400 text-xl font-bold font-mono">
                      {talent.public_name.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-black uppercase text-white">
                    {talent.public_name}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium mt-0.5">
                    {talent.programme}
                  </p>
                  {talent.class_name && (
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {talent.class_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Roles Chips */}
              <div className="flex flex-wrap gap-1.5">
                {talent.roles.map((r, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-neutral-950 text-neutral-300 border border-white/5"
                  >
                    ⭐ {r}
                  </span>
                ))}
              </div>

              {/* Bio */}
              <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3.5 rounded-2xl border border-white/5 italic">
                "{talent.bio}"
              </p>

              {/* Involvement list */}
              {talent.involvement_history && talent.involvement_history.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    Penglibatan Utama:
                  </span>
                  {talent.involvement_history.map((inv, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                      <Film className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{inv}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Awards list */}
              {talent.awards && talent.awards.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Anugerah & Pengiktirafan:
                  </span>
                  {talent.awards.map((award, idx) => (
                    <p key={idx} className="text-xs text-amber-200 font-medium">
                      🏆 {award}
                    </p>
                  ))}
                </div>
              )}

            </div>

            <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span>Status: Aktif Komuniti Teater</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-xs font-mono uppercase">
          Tiada profil bakat dijumpai untuk carian ini.
        </div>
      )}

    </div>
  );
};
