import React from 'react';
import { StudentStatus, TeamStatus, OpportunityStatus } from '../types';

interface StatusBadgeProps {
  status: StudentStatus | TeamStatus | OpportunityStatus | 'READY' | 'IN_PROGRESS' | 'ACTION_REQUIRED' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  }[size];

  switch (status) {
    // Student statuses
    case 'PENDING':
    case 'PENDING_REVIEW':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-400 animate-pulse" />
          Pending Review
        </span>
      );
    case 'CONTACTED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-blue-400" />
          Contacted WhatsApp
        </span>
      );
    case 'INVITED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-purple-400" />
          Invited to Group
        </span>
      );
    case 'JOINED':
    case 'JOINED_COMMUNITY':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400" />
          Joined Community
        </span>
      );
    case 'NOT_JOINED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-neutral-500/15 text-neutral-400 border border-neutral-500/30 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-neutral-400" />
          Not Joined
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-400" />
          Tidak Sesuai
        </span>
      );
    case 'ARCHIVED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-zinc-500/15 text-zinc-300 border border-zinc-500/30 ${sizeClasses}`}>
          Archived
        </span>
      );

    // Team statuses
    case 'FORMING':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 ${sizeClasses}`}>
          🟡 Sedang Dibentuk (Forming)
        </span>
      );
    case 'READY':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 ${sizeClasses}`}>
          🟢 Bersedia (Ready)
        </span>
      );
    case 'LOCKED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 ${sizeClasses}`}>
          🔒 Team Locked
        </span>
      );

    // Opportunity statuses
    case 'OPEN':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 ${sizeClasses}`}>
          🟢 Terbuka (Open)
        </span>
      );
    case 'UPCOMING':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 ${sizeClasses}`}>
          🟡 Akan Datang
        </span>
      );
    case 'CLOSED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-zinc-500/20 text-zinc-400 border border-zinc-700 ${sizeClasses}`}>
          ⚫ Ditutup
        </span>
      );

    // Readiness statuses
    case 'ACTION_REQUIRED':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 ${sizeClasses}`}>
          🔴 Tindakan Diperlukan
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 ${sizeClasses}`}>
          🟡 Sedang Dijalankan
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
