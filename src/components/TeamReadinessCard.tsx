import React, { useState } from 'react';
import { Team, TeamReadinessChecklist, TeamStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { storage } from '../lib/storage';
import { 
  Users, 
  Crown, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Phone, 
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Pencil,
  X,
  Save
} from 'lucide-react';
import { generateTeamCaptainWhatsAppLink } from '../lib/whatsapp';

interface TeamReadinessCardProps {
  team: Team;
  eventTitle?: string;
  onUpdateChecklist?: (teamId: string, checklist: TeamReadinessChecklist) => void;
  onUpdateTeam?: (teamId: string, updates: Partial<Team>) => void;
  isAdmin?: boolean;
  onAssignMemberClick?: (teamId: string) => void;
}

export const TeamReadinessCard: React.FC<TeamReadinessCardProps> = ({
  team,
  eventTitle = 'Pertandingan Teater KPMBP 2026',
  onUpdateChecklist,
  onUpdateTeam,
  isAdmin = false,
  onAssignMemberClick
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(team.name);
  const [editPlayTitle, setEditPlayTitle] = useState(team.play_title || '');
  const [editSynopsis, setEditSynopsis] = useState(team.synopsis || '');
  const [editCaptainName, setEditCaptainName] = useState(team.captain_name || '');
  const [editStatus, setEditStatus] = useState<TeamStatus>(team.status);
  const [editMaxMembers, setEditMaxMembers] = useState(team.max_members || 5);
  const [editChecklist, setEditChecklist] = useState<TeamReadinessChecklist>(team.checklist);

  const checklistItems = [
    { key: 'has_five_members', label: '5 Ahli Lengkap', value: team.members.length >= 5 },
    { key: 'has_captain', label: 'Ketua Kumpulan (Captain)', value: Boolean(team.captain_name) || team.members.some(m => m.is_captain) },
    { key: 'has_title', label: 'Tajuk Persembahan', value: team.checklist.has_title || Boolean(team.play_title) },
    { key: 'has_storyline', label: 'Jalan Cerita (Sinopsis)', value: team.checklist.has_storyline || Boolean(team.synopsis) },
    { key: 'has_character_split', label: 'Pembahagian Watak', value: team.checklist.has_character_split },
    { key: 'has_script', label: 'Skrip Selesai / Draf Akhir', value: team.checklist.has_script },
    { key: 'has_props', label: 'Senarai & Persediaan Props', value: team.checklist.has_props },
    { key: 'has_costume', label: 'Kostum / Pakaian Pelakon', value: team.checklist.has_costume },
    { key: 'has_technical_req', label: 'Keperluan Audio & Lighting', value: team.checklist.has_technical_req },
    { key: 'rehearsal_started', label: 'Rehearsal / Sesi Latihan Dimulakan', value: team.checklist.rehearsal_started }
  ];

  const totalPassed = checklistItems.filter(item => item.value).length;
  const progressPercent = Math.round((totalPassed / checklistItems.length) * 100);

  const handleToggle = (key: keyof TeamReadinessChecklist) => {
    const updated: TeamReadinessChecklist = {
      ...team.checklist,
      [key]: !team.checklist[key]
    };
    if (onUpdateChecklist) {
      onUpdateChecklist(team.id, updated);
    } else {
      storage.updateTeamChecklist(team.id, updated);
    }
  };

  const handleMarkAllDone = () => {
    const allDoneChecklist: TeamReadinessChecklist = {
      has_five_members: true,
      has_captain: true,
      has_title: true,
      has_storyline: true,
      has_character_split: true,
      has_script: true,
      has_props: true,
      has_costume: true,
      has_technical_req: true,
      rehearsal_started: true
    };
    if (onUpdateChecklist) {
      onUpdateChecklist(team.id, allDoneChecklist);
    } else {
      storage.updateTeamChecklist(team.id, allDoneChecklist);
    }
  };

  const handleResetChecklist = () => {
    const resetChecklist: TeamReadinessChecklist = {
      has_five_members: team.members.length >= 5,
      has_captain: Boolean(team.captain_name) || team.members.some(m => m.is_captain),
      has_title: Boolean(team.play_title),
      has_storyline: Boolean(team.synopsis),
      has_character_split: false,
      has_script: false,
      has_props: false,
      has_costume: false,
      has_technical_req: false,
      rehearsal_started: false
    };
    if (onUpdateChecklist) {
      onUpdateChecklist(team.id, resetChecklist);
    } else {
      storage.updateTeamChecklist(team.id, resetChecklist);
    }
  };

  const handleOpenEdit = () => {
    setEditName(team.name);
    setEditPlayTitle(team.play_title || '');
    setEditSynopsis(team.synopsis || '');
    setEditCaptainName(team.captain_name || '');
    setEditStatus(team.status);
    setEditMaxMembers(team.max_members || 5);
    setEditChecklist({ ...team.checklist });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const mergedChecklist: TeamReadinessChecklist = {
      ...editChecklist,
      has_title: Boolean(editPlayTitle.trim()) || editChecklist.has_title,
      has_storyline: Boolean(editSynopsis.trim()) || editChecklist.has_storyline,
      has_captain: Boolean(editCaptainName.trim()) || editChecklist.has_captain
    };

    const hasAll = Object.values(mergedChecklist).every(v => v === true);
    const finalStatus: TeamStatus = hasAll ? 'READY' : editStatus;

    const updates: Partial<Team> = {
      name: editName.trim(),
      play_title: editPlayTitle.trim() || undefined,
      synopsis: editSynopsis.trim() || undefined,
      captain_name: editCaptainName.trim() || undefined,
      status: finalStatus,
      max_members: Number(editMaxMembers) || 5,
      checklist: mergedChecklist
    };

    if (onUpdateTeam) {
      onUpdateTeam(team.id, updates);
    } else {
      storage.updateTeam(team.id, updates);
    }

    setShowEditModal(false);
  };

  const captainPhone = team.members.find(m => m.is_captain || m.student_name === team.captain_name)?.student_phone;

  return (
    <div className="bg-neutral-900 border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 transition-all shadow-xl flex flex-col justify-between space-y-5 relative">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-neutral-800 text-amber-400 font-bold border border-white/5">
                {team.code}
              </span>
              <StatusBadge status={team.status} />
            </div>
            <h3 className="text-lg font-black uppercase text-white tracking-tight truncate">
              {team.name}
            </h3>
            {team.play_title ? (
              <p className="text-amber-400 text-xs italic mt-0.5 font-medium">
                "{team.play_title}"
              </p>
            ) : (
              <p className="text-neutral-500 text-xs italic mt-0.5">
                Tajuk belum dimuktamadkan
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Edit Button */}
            <button
              onClick={handleOpenEdit}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-amber-500/20 text-neutral-400 hover:text-amber-400 border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer"
              title="Edit Maklumat Pasukan & Tajuk Naskhah"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950 border border-white/5 text-neutral-300 text-xs font-mono">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{team.members.length}/{team.max_members}</span>
            </div>
          </div>
        </div>

        {/* Synopsis if available */}
        {team.synopsis && (
          <p className="text-neutral-400 text-xs line-clamp-2 mb-4 bg-neutral-950 p-3 rounded-2xl border border-white/5 leading-relaxed">
            {team.synopsis}
          </p>
        )}

        {/* Readiness Meter */}
        <div className="bg-neutral-950 p-3.5 rounded-2xl border border-white/5 mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase text-neutral-400">Kesediaan Pasukan</span>
            <span className="font-mono font-bold text-amber-400 text-xs">{progressPercent}% ({totalPassed}/10)</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                progressPercent >= 80 ? 'bg-green-500' : progressPercent >= 40 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Members Quick List */}
        <div className="space-y-1.5 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Ahli Kumpulan:</p>
          <div className="space-y-1">
            {team.members.map((member, idx) => {
              const displayName = member.student_nickname?.trim() ? member.student_nickname.trim() : member.student_name;
              return (
                <div key={idx} className="flex items-center justify-between text-xs bg-neutral-950/60 px-3 py-1.5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-1.5 truncate">
                    {member.is_captain && <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                    <span className="text-white font-bold truncate">{displayName}</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-medium">{member.role}</span>
                </div>
              );
            })}
            {team.members.length === 0 && (
              <p className="text-xs text-neutral-500 italic py-1">Belum ada ahli berdaftar.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Controls & WhatsApp */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-neutral-400 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
        >
          <span>{expanded ? 'Tutup Checklist' : 'Semak Checklist (10)'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {captainPhone && (
          <a
            href={generateTeamCaptainWhatsAppLink(captainPhone, team.name, eventTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white border border-green-500/30 transition-all"
            title="Hubungi Ketua Pasukan"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Expanded Checklist details */}
      {expanded && (
        <div className="pt-3 border-t border-white/5 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-950/80 p-3 rounded-2xl border border-white/5">
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                10 Perkara Kesediaan Produksi
              </span>
              <span className="text-[11px] text-amber-400">
                Klik mana-mana perkara di bawah untuk tanda selesai (DONE)
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleMarkAllDone}
                className="px-2.5 py-1 rounded-xl bg-green-500 hover:bg-green-400 text-neutral-950 text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow"
                title="Tandakan kesemua 10 perkara sebagai selesai"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Tanda Semua Selesai</span>
              </button>
              <button
                type="button"
                onClick={handleResetChecklist}
                className="px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                title="Tetapkan semula checklist"
              >
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {checklistItems.map((item, idx) => (
              <button
                type="button"
                key={item.key}
                onClick={() => handleToggle(item.key as keyof TeamReadinessChecklist)}
                className={`w-full text-left flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
                  item.value
                    ? 'bg-green-500/10 border-green-500/30 text-green-300 hover:bg-green-500/20'
                    : 'bg-neutral-950/80 border-white/5 text-neutral-400 hover:border-amber-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="font-mono text-[10px] text-neutral-500 shrink-0">
                    {idx + 1}.
                  </span>
                  <span className={`text-xs ${item.value ? 'font-bold text-white' : ''}`}>
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.value ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-500/20 text-green-400 font-mono text-[10px] font-bold border border-green-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>SELESAI</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-neutral-900 text-neutral-500 font-mono text-[10px] border border-white/5 group-hover:text-neutral-300">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>BELUM</span>
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODAL EDIT PASUKAN & TAJUK NASKHAH */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-white tracking-tight">
                    Edit Maklumat Pasukan
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Kemaskini tajuk naskhah, sinopsis, nama pasukan & status ({team.code})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1 font-bold">
                  Nama Pasukan / Kumpulan *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Contoh: Pentas Sutera 26"
                  className="w-full bg-neutral-950 border border-white/10 focus:border-amber-500 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-amber-400 mb-1 font-bold">
                  Tajuk Persembahan / Naskhah Teater
                </label>
                <input
                  type="text"
                  value={editPlayTitle}
                  onChange={e => setEditPlayTitle(e.target.value)}
                  placeholder="Contoh: Mahkamah Keadilan, Atap Genting Atap Rumbia"
                  className="w-full bg-neutral-950 border border-amber-500/30 focus:border-amber-500 rounded-2xl px-4 py-2.5 text-xs text-amber-300 placeholder-neutral-600 focus:outline-none"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Tajuk lakonan yang akan dipaparkan di bawah nama kumpulan dan di laman utama.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1 font-bold">
                  Sinopsis / Jalan Cerita Ringkas
                </label>
                <textarea
                  rows={3}
                  value={editSynopsis}
                  onChange={e => setEditSynopsis(e.target.value)}
                  placeholder="Tulis ringkasan plot atau mesej utama persembahan..."
                  className="w-full bg-neutral-950 border border-white/10 focus:border-amber-500 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1 font-bold">
                    Ketua Kumpulan (Captain)
                  </label>
                  <input
                    type="text"
                    value={editCaptainName}
                    onChange={e => setEditCaptainName(e.target.value)}
                    placeholder="Nama Ketua"
                    className="w-full bg-neutral-950 border border-white/10 focus:border-amber-500 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1 font-bold">
                    Status Pasukan
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as TeamStatus)}
                    className="w-full bg-neutral-950 border border-white/10 focus:border-amber-500 rounded-2xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                  >
                    <option value="FORMING">FORMING (Membentuk)</option>
                    <option value="READY">READY (Bersedia)</option>
                    <option value="LOCKED">LOCKED (Terkunci)</option>
                    <option value="COMPLETED">COMPLETED (Selesai/Tamat)</option>
                  </select>
                </div>
              </div>

              {/* Checklist items inside Modal */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase text-neutral-300 font-bold">
                    10 Perkara Kesediaan Produksi (Tanda Siap)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditChecklist({
                        has_five_members: true,
                        has_captain: true,
                        has_title: true,
                        has_storyline: true,
                        has_character_split: true,
                        has_script: true,
                        has_props: true,
                        has_costume: true,
                        has_technical_req: true,
                        rehearsal_started: true
                      });
                    }}
                    className="text-[10px] text-green-400 hover:text-green-300 font-mono font-bold uppercase underline cursor-pointer"
                  >
                    Tanda Semua Siap
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 bg-neutral-950 rounded-2xl border border-white/5">
                  {checklistItems.map(item => {
                    const isChecked = editChecklist[item.key as keyof TeamReadinessChecklist];
                    return (
                      <label
                        key={item.key}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                          isChecked
                            ? 'bg-green-500/10 border-green-500/30 text-green-300 font-medium'
                            : 'bg-neutral-900 border-white/5 text-neutral-400 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(isChecked)}
                          onChange={e => {
                            setEditChecklist(prev => ({
                              ...prev,
                              [item.key]: e.target.checked
                            }));
                          }}
                          className="w-4 h-4 rounded text-amber-500 bg-neutral-950 border-white/10 focus:ring-0 cursor-pointer"
                        />
                        <span className="truncate">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
