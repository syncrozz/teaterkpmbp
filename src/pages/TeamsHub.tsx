import React, { useState } from 'react';
import { storage, useLiveStorage } from '../lib/storage';
import { Team, TeamPreference, TeamReadinessChecklist } from '../types';
import { TeamReadinessCard } from '../components/TeamReadinessCard';
import { WhatsAppCommunityCard } from '../components/WhatsAppCommunityCard';
import { formatLiveName, maskStudentId } from '../lib/validation';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Plus, 
  Search, 
  Vote, 
  Crown,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCheck,
  Clock,
  Layers,
  Sparkle
} from 'lucide-react';

interface TeamsHubProps {
  onJoinCommunityClick: () => void;
  isAdmin?: boolean;
}

export const TeamsHub: React.FC<TeamsHubProps> = ({ onJoinCommunityClick, isAdmin = false }) => {
  const store = useLiveStorage();
  const activeEvent = store.events.find(e => e.status === 'ACTIVE' || e.status === 'REGISTRATION OPEN') || store.events[0] || storage.getActiveEvent();
  
  // Use live store teams
  const allTeams = store.teams;
  const preferences = store.team_preferences;
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'READY' | 'FORMING'>('ALL');

  // Student preference poll state
  const [pollStudentName, setPollStudentName] = useState('');
  const [pollStudentId, setPollStudentId] = useState('');
  const [pollSelectedGroup, setPollSelectedGroup] = useState('Group A');
  const [pollSelectedRole, setPollSelectedRole] = useState('Lakonan (Pelakon)');
  const [pollSuccessMsg, setPollSuccessMsg] = useState<string | null>(null);
  const [showPollSection, setShowPollSection] = useState(false);

  // New team modal / inline form state
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCaptain, setNewTeamCaptain] = useState('');
  const [newPlayTitle, setNewPlayTitle] = useState('');
  const [newSynopsis, setNewSynopsis] = useState('');

  const handleUpdateChecklist = (teamId: string, checklist: TeamReadinessChecklist) => {
    storage.updateTeamChecklist(teamId, checklist);
  };

  const handlePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollStudentName.trim() || !pollStudentId.trim()) return;

    storage.saveTeamPreference({
      event_id: activeEvent?.id || 'event-kpmbp-2026',
      student_id: pollStudentId.trim().toUpperCase(),
      student_name: pollStudentName.trim(),
      preferred_team_group: pollSelectedGroup,
      preferred_role: pollSelectedRole,
      status: 'EXPLORING'
    });

    setPollSuccessMsg(`Pilihan kecenderungan anda untuk ${pollSelectedGroup} (${pollSelectedRole}) telah direkodkan.`);
    setTimeout(() => setPollSuccessMsg(null), 6000);
    setPollStudentName('');
    setPollStudentId('');
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const code = 'GRP-' + Math.floor(100 + Math.random() * 900);
    storage.createTeam({
      event_id: activeEvent?.id || 'event-kpmbp-2026',
      name: newTeamName.trim(),
      code,
      captain_name: newTeamCaptain.trim() || undefined,
      play_title: newPlayTitle.trim() || undefined,
      synopsis: newSynopsis.trim() || undefined,
      status: 'FORMING',
      max_members: 5,
      checklist: {
        has_five_members: false,
        has_captain: Boolean(newTeamCaptain.trim()),
        has_title: Boolean(newPlayTitle.trim()),
        has_storyline: Boolean(newSynopsis.trim()),
        has_character_split: false,
        has_script: false,
        has_props: false,
        has_costume: false,
        has_technical_req: false,
        rehearsal_started: false
      },
      members: newTeamCaptain.trim() ? [
        {
          id: 'tm-' + Date.now(),
          team_id: '',
          student_id: 'std-' + Date.now(),
          student_name: newTeamCaptain.trim(),
          role: 'Ketua Kumpulan (Captain)',
          is_captain: true,
          joined_at: new Date().toISOString().split('T')[0]
        }
      ] : []
    });

    setShowCreateTeamModal(false);
    setNewTeamName('');
    setNewTeamCaptain('');
    setNewPlayTitle('');
    setNewSynopsis('');
  };

  // Filtered teams list based on user search & status tab
  const filteredTeams = allTeams.filter(team => {
    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'READY' ? team.status === 'READY' :
      team.status === 'FORMING';

    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesStatus;

    const matchesName = team.name.toLowerCase().includes(term);
    const matchesCode = team.code.toLowerCase().includes(term);
    const matchesPlay = team.play_title?.toLowerCase().includes(term);
    const matchesCaptain = team.captain_name?.toLowerCase().includes(term);
    const matchesMember = team.members.some(m => 
      m.student_name.toLowerCase().includes(term) ||
      m.student_nickname?.toLowerCase().includes(term) ||
      m.role.toLowerCase().includes(term)
    );

    return matchesStatus && (matchesName || matchesCode || matchesPlay || matchesCaptain || matchesMember);
  });

  const readyTeamsCount = allTeams.filter(t => t.status === 'READY').length;
  const formingTeamsCount = allTeams.filter(t => t.status === 'FORMING').length;
  const totalMembersCount = allTeams.reduce((acc, t) => acc + (t.members?.length || 0), 0);

  const groupPollSummary: Record<string, number> = {
    'Group A': preferences.filter(p => p.preferred_team_group === 'Group A').length,
    'Group B': preferences.filter(p => p.preferred_team_group === 'Group B').length,
    'Group C': preferences.filter(p => p.preferred_team_group === 'Group C').length,
    'Group D': preferences.filter(p => p.preferred_team_group === 'Group D').length,
    'Group E': preferences.filter(p => p.preferred_team_group === 'Group E').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Bento Row: 8-col Header + 4-col Team Readiness Metric Bento Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" />
              KOMUNITI & CASTING HUB TEATER KPMBP
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Kumpulan Aktif Berdaftar
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Senarai rasmi pasukan produksi dan pementasan teater yang sedang aktif berdaftar dalam komuniti Teater KPMBP. Anda boleh melihat perkembangan persediaan setiap pasukan, bilangan ahli, naskhah lakonan, dan menyertai latihan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Total Kumpulan</span>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="text-amber-400 font-mono text-base">{allTeams.length}</span> Pasukan
              </p>
            </div>
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Pasukan Bersedia (Ready)</span>
              <p className="text-sm font-bold text-green-400 flex items-center gap-1.5">
                <CheckCheck className="w-4 h-4" />
                <span className="font-mono text-base">{readyTeamsCount}</span> Siap Pentas
              </p>
            </div>
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Pelajar Dalam Pasukan</span>
              <p className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span className="font-mono text-base">{totalMembersCount}</span> Pelajar
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-neutral-900/80">
              STATUS KOMUNITI
            </span>
            <Crown className="w-5 h-5 text-neutral-950" />
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center gap-3.5 bg-black/10 p-3.5 rounded-2xl border border-black/10">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-950 font-mono pr-1">
              {allTeams.length}
            </div>
            <p className="text-xs font-extrabold text-neutral-900 leading-snug">
              Kumpulan Aktif Berdaftar Komuniti
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowCreateTeamModal(true)}
              className="w-full py-3 px-4 rounded-2xl bg-neutral-950 hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Daftar Pasukan Baru</span>
            </button>
            <button
              onClick={onJoinCommunityClick}
              className="w-full py-2.5 px-4 rounded-2xl bg-black/15 hover:bg-black/25 text-neutral-950 font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Sertai Pendaftaran Bakat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* PRIMARY SECTION: SENARAI KUMPULAN AKTIF BERDAFTAR (DEFAULT VIEW) */}
      <section id="registered-teams" className="space-y-6">
        
        {/* Controls: Search, Filter Tabs, Add Button */}
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5">
                <Layers className="w-3.5 h-3.5" /> SENARAI RASMI KOMUNITI
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                Paparan Kumpulan Aktif Berdaftar ({filteredTeams.length})
              </h2>
            </div>

            {/* Quick Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateTeamModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-red-950/40 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pasukan</span>
              </button>
              <button
                onClick={() => setShowPollSection(!showPollSection)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-white/5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                <Vote className="w-4 h-4" />
                <span>{showPollSection ? 'Tutup Undian' : 'Undian Minat'}</span>
              </button>
            </div>
          </div>

          {/* Search bar & Filter Pills */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/5">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-2xl border border-white/5 w-full sm:w-auto">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-amber-500 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Semua ({allTeams.length})
              </button>
              <button
                onClick={() => setStatusFilter('READY')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  statusFilter === 'READY'
                    ? 'bg-green-500 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Bersedia / Ready</span>
                <span className="font-mono text-[11px]">({readyTeamsCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter('FORMING')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  statusFilter === 'FORMING'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Membentuk</span>
                <span className="font-mono text-[11px]">({formingTeamsCount})</span>
              </button>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari pasukan, ahli, naskhah..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-sans"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Team Cards Grid (Always visible by default) */}
        {filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map(team => (
              <TeamReadinessCard
                key={team.id}
                team={team}
                eventTitle={activeEvent?.title}
                onUpdateChecklist={handleUpdateChecklist}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        ) : (
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-2xl">
              🎭
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white">Tiada Kumpulan Dijumpai</h3>
              <p className="text-xs text-neutral-400">
                {searchTerm
                  ? `Tiada padanan pasukan untuk carian "${searchTerm}". Sila cuba kata kunci yang lain.`
                  : 'Belum ada kumpulan didaftarkan untuk kategori ini.'}
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold hover:bg-neutral-700"
                >
                  Kosongkan Carian
                </button>
              )}
              <button
                onClick={() => setShowCreateTeamModal(true)}
                className="px-5 py-2 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold uppercase tracking-wider hover:bg-amber-400"
              >
                Daftar Kumpulan Pertama
              </button>
            </div>
          </div>
        )}
      </section>

      {/* WhatsApp Community reminder card */}
      <WhatsAppCommunityCard onJoinClick={onJoinCommunityClick} />

      {/* SECTION: POLL-BASED EXPLORATION (Toggleable or Expandable) */}
      {showPollSection && (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-white/10 animate-in fade-in duration-300">
          
          {/* Left Bento Cell (4-col): Live Preference Stats */}
          <div className="md:col-span-4 bg-neutral-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                <Vote className="w-3 h-3" /> STATISTIK PILIHAN
              </div>
              <h3 className="text-lg font-black uppercase text-white tracking-tight">
                Kecenderungan Kumpulan
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Taburan undian minat pelajar mengikut grup eksplorasi A hingga E.
              </p>
            </div>

            <div className="space-y-2.5">
              {Object.entries(groupPollSummary).map(([grp, count]) => (
                <div key={grp} className="bg-neutral-950 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300">{grp}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{count} calon</span>
                    <div className="w-16 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, count * 20)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-neutral-950 rounded-2xl border border-white/5 text-[11px] text-neutral-400 text-center">
              Pilihan ini adalah untuk rujukan awal dan fleksibel sebelum pasukan dimuktamadkan.
            </div>
          </div>

          {/* Right Bento Cell (8-col): Interactive Exploration Form */}
          <div className="md:col-span-8 bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  BORANG EKSPLORASI BAKAT
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> TERBUKA
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                Nyatakan Kecenderungan Kumpulan Anda
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm">
                Pilih peranan yang paling anda gemari (Lakonan, Skrip, Pengarahan, atau Teknikal) dan grup pilihan anda.
              </p>
            </div>

            {pollSuccessMsg && (
              <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-300 text-xs rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>{pollSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handlePollSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-400">Nama Penuh</label>
                  <input
                    type="text"
                    required
                    placeholder="cth: MUHAMMAD DANIAL"
                    value={pollStudentName}
                    onChange={e => setPollStudentName(formatLiveName(e.target.value))}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-400">No. ID Pelajar</label>
                  <input
                    type="text"
                    required
                    placeholder="cth: PDA-2502-011"
                    value={pollStudentId}
                    onChange={e => setPollStudentId(maskStudentId(e.target.value))}
                    className="w-full uppercase bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-400">Pilihan Grup</label>
                  <select
                    value={pollSelectedGroup}
                    onChange={e => setPollSelectedGroup(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Group A">Group A</option>
                    <option value="Group B">Group B</option>
                    <option value="Group C">Group C</option>
                    <option value="Group D">Group D</option>
                    <option value="Group E">Group E</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-400">Peranan Utama Diminati</label>
                  <select
                    value={pollSelectedRole}
                    onChange={e => setPollSelectedRole(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Lakonan (Pelakon)">Lakonan (Pelakon)</option>
                    <option value="Penulisan Skrip">Penulisan Skrip</option>
                    <option value="Pengarah / Pengurus">Pengarah / Pengurus</option>
                    <option value="Technical Crew / Audio / Lighting">Technical Crew / Audio / Lighting</option>
                    <option value="Props & Kostum">Props & Kostum</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  Hantar Pilihan Kumpulan
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* CREATE TEAM MODAL */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Cadang Pasukan Baharu
              </h3>
              <button
                onClick={() => setShowCreateTeamModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-mono p-1 cursor-pointer"
              >
                ✕ TUTUP
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] uppercase text-neutral-400">
                  Nama Pasukan / Kumpulan <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="cth: Sanggar Teater Kencana"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] uppercase text-neutral-400">
                  Ketua Kumpulan (Captain)
                </label>
                <input
                  type="text"
                  placeholder="Nama pelajar yang memimpin"
                  value={newTeamCaptain}
                  onChange={e => setNewTeamCaptain(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] uppercase text-neutral-400">
                  Cadangan Tajuk Naskhah / Lakonan
                </label>
                <input
                  type="text"
                  placeholder="cth: Di Hujung Persimpangan"
                  value={newPlayTitle}
                  onChange={e => setNewPlayTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] uppercase text-neutral-400">
                  Sinopsis Ringkas (1-2 ayat)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan serba sedikit tentang idea cerita kumpulan anda..."
                  value={newSynopsis}
                  onChange={e => setNewSynopsis(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateTeamModal(false)}
                  className="px-4 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  Daftarkan Pasukan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
