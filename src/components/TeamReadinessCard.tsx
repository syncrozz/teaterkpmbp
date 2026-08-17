import React, { useState } from 'react';
import { Team, TeamReadinessChecklist } from '../types';
import { StatusBadge } from './StatusBadge';
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
  ChevronUp
} from 'lucide-react';
import { generateTeamCaptainWhatsAppLink } from '../lib/whatsapp';

interface TeamReadinessCardProps {
  team: Team;
  eventTitle?: string;
  onUpdateChecklist?: (teamId: string, checklist: TeamReadinessChecklist) => void;
  isAdmin?: boolean;
  onAssignMemberClick?: (teamId: string) => void;
}

export const TeamReadinessCard: React.FC<TeamReadinessCardProps> = ({
  team,
  eventTitle = 'Pertandingan Teater KPMBP 2026',
  onUpdateChecklist,
  isAdmin = false,
  onAssignMemberClick
}) => {
  const [expanded, setExpanded] = useState(false);

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
    if (!isAdmin || !onUpdateChecklist) return;
    const updated = {
      ...team.checklist,
      [key]: !team.checklist[key]
    };
    onUpdateChecklist(team.id, updated);
  };

  const captainPhone = team.members.find(m => m.is_captain || m.student_name === team.captain_name)?.student_phone;

  return (
    <div className="bg-neutral-900 border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 transition-all shadow-xl flex flex-col justify-between space-y-5">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-neutral-800 text-amber-400 font-bold border border-white/5">
                {team.code}
              </span>
              <StatusBadge status={team.status} />
            </div>
            <h3 className="text-lg font-black uppercase text-white tracking-tight">
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

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950 border border-white/5 text-neutral-300 text-xs font-mono">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>{team.members.length}/{team.max_members}</span>
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
            {team.members.map((member, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-neutral-950/60 px-3 py-1.5 rounded-xl border border-white/5">
                <div className="flex items-center gap-1.5 truncate">
                  {member.is_captain && <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                  <span className="text-white font-medium truncate">{member.student_name}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">{member.role}</span>
              </div>
            ))}
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
          className="text-xs text-neutral-400 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1"
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
        <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400">
            <span>10 Perkara Kesediaan:</span>
            {isAdmin && <span className="text-amber-400 font-sans font-bold">(Klik untuk tanda)</span>}
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {checklistItems.map(item => (
              <div
                key={item.key}
                onClick={() => handleToggle(item.key as keyof TeamReadinessChecklist)}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                  item.value
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-neutral-950 border-white/5 text-neutral-400'
                } ${isAdmin ? 'cursor-pointer hover:border-amber-500/40' : ''}`}
              >
                <span>{item.label}</span>
                {item.value ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-neutral-600" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
