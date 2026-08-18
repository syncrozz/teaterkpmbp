import React, { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { 
  Student, 
  RegistrationStatus, 
  Team, 
  Announcement, 
  SirNote, 
  Opportunity,
  TalentProfile,
  TheatreEvent 
} from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { generateWhatsAppLink } from '../lib/whatsapp';
import { 
  ShieldCheck, 
  Users, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Download, 
  Upload,
  FileText,
  Edit3, 
  Trash2, 
  Plus, 
  Phone, 
  Mail, 
  Filter, 
  Database, 
  Lock, 
  Key, 
  Sparkles,
  FileSpreadsheet,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  Layers,
  Crown,
  Calendar,
  Trophy,
  MapPin,
  X,
  Check,
  Sliders
} from 'lucide-react';
import { SUPABASE_POSTGRES_SCHEMA } from '../lib/sqlSchema';

export const AdminDashboard: React.FC = () => {
  // Admin Authentication Gate state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('teater_admin_auth') === 'true';
  });
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'students' | 'teams' | 'events' | 'announcements' | 'sirnotes' | 'database'>('students');

  // Student Filter state
  const [students, setStudents] = useState<Student[]>(storage.getStudents());
  const [teams, setTeams] = useState<Team[]>(storage.getTeams());
  const [events, setEvents] = useState<TheatreEvent[]>(storage.getEvents());
  const [announcements, setAnnouncements] = useState<Announcement[]>(storage.getAnnouncements());
  const [sirNotes, setSirNotes] = useState<SirNote[]>(storage.getSirNotes());

  // Event Edit / Create State
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TheatreEvent | null>(null);
  const [isCreatingNewEvent, setIsCreatingNewEvent] = useState(false);

  const [studentSearch, setStudentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RegistrationStatus>('ALL');
  const [programmeFilter, setProgrammeFilter] = useState<string>('ALL');
  const [selectedStudentForNote, setSelectedStudentForNote] = useState<Student | null>(null);
  const [adminNoteText, setAdminNoteText] = useState('');

  // Announcement Form State
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [newAnnounceTitle, setNewAnnounceTitle] = useState('');
  const [newAnnounceContent, setNewAnnounceContent] = useState('');
  const [newAnnounceCategory, setNewAnnounceCategory] = useState<Announcement['category']>('General');
  const [newAnnouncePriority, setNewAnnouncePriority] = useState<'Normal' | 'High'>('Normal');

  // Sir Note Form State
  const [showSirModal, setShowSirModal] = useState(false);
  const [newSirTitle, setNewSirTitle] = useState('');
  const [newSirSummary, setNewSirSummary] = useState('');
  const [newSirContent, setNewSirContent] = useState('');
  const [newSirCategory, setNewSirCategory] = useState<SirNote['category']>('Tips & Tricks');

  // CSV Import Modal State
  const [showCsvImportModal, setShowCsvImportModal] = useState(false);
  const [csvImportText, setCsvImportText] = useState('');
  const [csvImportResult, setCsvImportResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [csvImportError, setCsvImportError] = useState<string | null>(null);

  const [firebaseSyncing, setFirebaseSyncing] = useState(false);
  const [firebaseSyncMsg, setFirebaseSyncMsg] = useState<string | null>(null);

  const refreshAll = () => {
    setStudents(storage.getStudents());
    setTeams(storage.getTeams());
    setEvents(storage.getEvents());
    setAnnouncements(storage.getAnnouncements());
    setSirNotes(storage.getSirNotes());
  };

  useEffect(() => {
    const unsub = storage.subscribe(() => {
      refreshAll();
    });
    return () => unsub();
  }, []);

  const handleForceSyncFirebase = async () => {
    setFirebaseSyncing(true);
    setFirebaseSyncMsg(null);
    const res = await storage.pushAllToFirestore();
    setFirebaseSyncing(false);
    setFirebaseSyncMsg(res.message);
    setTimeout(() => setFirebaseSyncMsg(null), 5000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin.trim() === '5313') {
      setIsAuthenticated(true);
      localStorage.setItem('teater_admin_auth', 'true');
      window.dispatchEvent(new Event('teater_admin_auth_changed'));
      setAuthError(null);
    } else {
      setAuthError('Kod PIN keselamatan tidak sah. Sila cuba lagi.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('teater_admin_auth');
    window.dispatchEvent(new Event('teater_admin_auth_changed'));
  };

  // Student status update
  const handleUpdateStudentStatus = (id: string, status: RegistrationStatus) => {
    storage.updateStudentStatus(id, status);
    refreshAll();
  };

  const handleSaveStudentNote = () => {
    if (!selectedStudentForNote) return;
    storage.updateStudentStatus(selectedStudentForNote.id, selectedStudentForNote.status, adminNoteText);
    setSelectedStudentForNote(null);
    setAdminNoteText('');
    refreshAll();
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID Pelajar', 'Nama Penuh', 'Program', 'Kelas', 'Semester', 'Telefon', 'Emel', 'Status', 'Minat', 'Pengalaman', 'Status Kumpulan', 'Tarikh Daftar'];
    const rows = students.map(s => [
      s.student_id,
      `"${s.full_name}"`,
      `"${s.programme}"`,
      s.class_name,
      s.semester,
      `"${s.phone}"`,
      s.email,
      s.status,
      `"${s.interests.join(', ')}"`,
      `"${s.experience_level}"`,
      `"${s.group_status}"`,
      s.created_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `teater_kpmbp_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to parse CSV line handling quotes
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim().replace(/^"|"$/g, ''));
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim().replace(/^"|"$/g, ''));
    return result;
  };

  // Process CSV Text Import
  const handleProcessCsvImport = () => {
    setCsvImportError(null);
    setCsvImportResult(null);

    if (!csvImportText.trim()) {
      setCsvImportError('Sila masukkan atau muat naik kandungan fail CSV terlebih dahulu.');
      return;
    }

    const lines = csvImportText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      setCsvImportError('Format fail CSV kosong.');
      return;
    }

    // Check if first row is header
    const firstRow = parseCSVLine(lines[0]);
    const isHeader = firstRow.some(col => 
      col.toLowerCase().includes('id') || 
      col.toLowerCase().includes('nama') || 
      col.toLowerCase().includes('program') ||
      col.toLowerCase().includes('student')
    );

    const dataRows = isHeader ? lines.slice(1) : lines;

    if (dataRows.length === 0) {
      setCsvImportError('Tiada data pelajar ditemui dalam fail CSV.');
      return;
    }

    const parsedStudents: Omit<Student, 'id' | 'status' | 'created_at' | 'updated_at'>[] = [];

    dataRows.forEach(rowStr => {
      const cols = parseCSVLine(rowStr);
      if (cols.length >= 2) {
        // [ID, Nama, Program, Kelas, Sem, Phone, Email, ...]
        const studentId = cols[0] || '';
        const fullName = cols[1] || '';
        const programme = (cols[2] || 'DIT') as any;
        const className = cols[3] || 'DIT 1A';
        const sem = parseInt(cols[4]) || 1;
        const phone = cols[5] || '012-3456789';
        const email = cols[6] || `${studentId.toLowerCase()}@kpmbp.edu.my`;
        const interestsRaw = cols[8] || cols[7] || 'LAKONAN';
        const interests = interestsRaw.split(/[,;/]/).map(s => s.trim().toUpperCase()).filter(Boolean);

        if (studentId && fullName) {
          parsedStudents.push({
            student_id: studentId.toUpperCase(),
            full_name: fullName,
            programme: programme || 'DLM',
            class_name: className,
            semester: sem,
            phone: phone,
            email: email,
            interests: interests.length > 0 ? interests : ['LAKONAN'],
            experience_level: 'Tiada pengalaman',
            motivation: 'Pendaftaran pukal melalui import CSV admin',
            group_status: 'Saya mahu mencari kumpulan',
            consent: true
          });
        }
      }
    });

    if (parsedStudents.length === 0) {
      setCsvImportError('Gagal memproses baris data. Pastikan format CSV sekurang-kurangnya mengandungi [ID Pelajar, Nama Penuh].');
      return;
    }

    const res = storage.bulkImportStudents(parsedStudents);
    setCsvImportResult({
      imported: res.importedCount,
      skipped: res.skippedCount
    });
    refreshAll();
  };

  // Handle File Input for CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvImportText(text || '');
    };
    reader.readAsText(file);
  };

  // Announcement submit
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnounceTitle.trim() || !newAnnounceContent.trim()) return;

    storage.addAnnouncement({
      title: newAnnounceTitle.trim(),
      content: newAnnounceContent.trim(),
      category: newAnnounceCategory,
      priority: newAnnouncePriority,
      published: true,
      author: 'Jawatankuasa Teater KPMBP'
    });

    setShowAnnounceModal(false);
    setNewAnnounceTitle('');
    setNewAnnounceContent('');
    refreshAll();
  };

  // Sir Note submit
  const handleCreateSirNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSirTitle.trim() || !newSirContent.trim()) return;

    storage.addSirNote({
      title: newSirTitle.trim(),
      category: newSirCategory,
      summary: newSirSummary.trim(),
      content: newSirContent.trim(),
      author_name: 'Sir Penasihat',
      author_title: 'Penasihat Seni Teater KPMBP',
      published: true,
      key_points: ['Fokus kepada emosi tulus', 'Kerjasama pasukan lebih penting daripada ego']
    });

    setShowSirModal(false);
    setNewSirTitle('');
    setNewSirSummary('');
    setNewSirContent('');
    refreshAll();
  };

  // Event handlers
  const handleOpenEditEvent = (evt: TheatreEvent) => {
    setEditingEvent({ ...evt });
    setIsCreatingNewEvent(false);
    setShowEventModal(true);
  };

  const handleOpenCreateEvent = () => {
    const newTemplate: TheatreEvent = {
      id: 'event-' + Date.now(),
      title: 'Pertandingan Teater Baharu 2026',
      tagline: 'Pentas Seni Cipta Bakat Siswa KPMBP',
      description: 'Pertandingan teater interaktif mencungkil bakat dan kreativiti mahasiswa KPMBP.',
      date: '2026-10-15',
      day: 'Khamis',
      start_time: '8:00 PM',
      end_time: '10:30 PM',
      venue: 'Dewan Seminar KPMBP',
      group_size: 5,
      registration_deadline: '2026-10-08T23:59:00',
      status: 'UPCOMING',
      theme_color: 'purple',
      highlight_badge: 'ACARA BAHARU',
      deadline_label: '08 OKT DEADLINE',
      prizes: [
        { rank: 'Hadiah Utama', amount: 'RM 150.00', description: 'Trofi + Sijil Penghargaan + Hadiah Tunai' },
        { rank: 'Tempat Kedua', amount: 'RM 100.00', description: 'Trofi + Sijil Penghargaan' },
        { rank: 'Tempat Ketiga', amount: 'RM 60.00', description: 'Sijil Penyertaan' }
      ],
      organizer: 'Kelab Legasi KPMBP',
      rules: [
        'Terbuka kepada semua mahasiswa aktif KPMBP.',
        'Pementasan antara 8-10 minit.'
      ],
      team_formation_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setEditingEvent(newTemplate);
    setIsCreatingNewEvent(true);
    setShowEventModal(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    if (isCreatingNewEvent) {
      storage.createEvent(editingEvent);
    } else {
      storage.updateEvent(editingEvent.id, editingEvent);
    }

    setShowEventModal(false);
    setEditingEvent(null);
    refreshAll();
  };

  const handleDeleteEvent = (eventId: string, title: string) => {
    if (events.length <= 1) {
      alert('Sekurang-kurangnya satu acara perlu kekal di dalam sistem.');
      return;
    }
    if (window.confirm(`Adakah anda pasti mahu memadam acara "${title}"?`)) {
      storage.deleteEvent(eventId);
      refreshAll();
    }
  };

  // Filtered students list
  const filteredStudents = students.filter(s => {
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesProg = programmeFilter === 'ALL' || s.programme.includes(programmeFilter);
    const matchesSearch = 
      s.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.student_id.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.phone.includes(studentSearch) ||
      s.class_name.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesStatus && matchesProg && matchesSearch;
  });

  // Calculate high-level stats
  const totalStudents = students.length;
  const pendingCount = students.filter(s => s.status === 'PENDING_REVIEW').length;
  const contactedCount = students.filter(s => s.status === 'CONTACTED').length;
  const joinedCount = students.filter(s => s.status === 'JOINED_COMMUNITY').length;
  const totalTeams = teams.length;
  const readyTeamsCount = teams.filter(t => t.status === 'READY' || t.status === 'LOCKED').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 mx-auto flex items-center justify-center text-3xl">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase text-white">
              Pusat Kawalan Pentadbir
            </h1>
            <p className="text-xs text-neutral-400">
              Sila masukkan Kod Laluan Pengurusan Teater KPMBP untuk mengakses dashboard.
            </p>
          </div>

          {authError && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-300 text-xs p-3 rounded-2xl font-mono">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                maxLength={4}
                autoComplete="current-password"
                placeholder="••••"
                value={adminPin}
                onChange={e => setAdminPin(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3.5 text-center text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 text-lg tracking-[0.4em] font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-950/40 cursor-pointer active:scale-95"
            >
              Buka Papan Pemuka
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Header & Action Bento Banner */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            ADMIN & COMMITTEE CONSOLE
          </div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">
            Pengurusan Teater KPMBP
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm">
            Semak pendaftaran, hubungi pelajar melalui WhatsApp secara terus, dan pantau kelancaran produksi.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              setCsvImportText('');
              setCsvImportResult(null);
              setCsvImportError(null);
              setShowCsvImportModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white border border-white/10 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-2xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          >
            Log Keluar
          </button>
        </div>
      </div>

      {/* KPI Stats Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-neutral-900 border border-white/10 p-4 rounded-3xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">Jumlah Pelajar</span>
          <p className="text-2xl font-black text-white">{totalStudents}</p>
          <span className="text-[10px] font-mono text-neutral-500 block">Mendaftar Minat</span>
        </div>

        <div className="bg-neutral-900 border border-amber-500/30 p-4 rounded-3xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-amber-300 font-bold">Pending Review</span>
          <p className="text-2xl font-black text-amber-400">{pendingCount}</p>
          <span className="text-[10px] font-mono text-amber-500/80 block">Perlu Disemak</span>
        </div>

        <div className="bg-neutral-900 border border-blue-500/30 p-4 rounded-3xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-blue-300 font-bold">Dihubungi</span>
          <p className="text-2xl font-black text-blue-400">{contactedCount}</p>
          <span className="text-[10px] font-mono text-blue-500/80 block">WhatsApp Sent</span>
        </div>

        <div className="bg-neutral-900 border border-emerald-500/30 p-4 rounded-3xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold">Joined Group</span>
          <p className="text-2xl font-black text-emerald-400">{joinedCount}</p>
          <span className="text-[10px] font-mono text-emerald-500/80 block">Komuniti Rasmi</span>
        </div>

        <div className="bg-neutral-900 border border-white/10 p-4 rounded-3xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">Jumlah Kumpulan</span>
          <p className="text-2xl font-black text-white">{totalTeams}</p>
          <span className="text-[10px] font-mono text-neutral-500 block">Pertandingan 2026</span>
        </div>

        <div className="bg-neutral-900 border border-red-500/30 p-4 rounded-3xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-red-400 font-bold">Kumpulan Bersedia</span>
          <p className="text-2xl font-black text-red-400">{readyTeamsCount}</p>
          <span className="text-[10px] font-mono text-neutral-500 block">Siap 100% Pentas</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'students'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/40'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pelajar ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'teams'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/40'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/5'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Kumpulan ({teams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'events'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/40'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Acara & Carousel ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'announcements'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/40'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Pengumuman ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sirnotes')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'sirnotes'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/40'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/5'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Sir's Corner ({sirNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'database'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/40'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/5'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database Schema</span>
        </button>
      </div>

      {/* TAB 1: STUDENT MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-neutral-900 border border-white/10 p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari nama, ID, telefon, kelas..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="bg-neutral-950 border border-white/10 rounded-2xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="CONTACTED">Contacted</option>
                <option value="JOINED_COMMUNITY">Joined Community</option>
                <option value="NOT_JOINED">Not Joined</option>
              </select>

              <select
                value={programmeFilter}
                onChange={e => setProgrammeFilter(e.target.value)}
                className="bg-neutral-950 border border-white/10 rounded-2xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="ALL">Semua Program</option>
                <option value="DLM">DLM</option>
                <option value="DIA">DIA</option>
                <option value="DIT">DIT</option>
                <option value="DBS">DBS</option>
                <option value="DIB">DIB</option>
                <option value="DEB">DEB</option>
              </select>

              <button
                onClick={() => {
                  setCsvImportText('');
                  setCsvImportResult(null);
                  setCsvImportError(null);
                  setShowCsvImportModal(true);
                }}
                className="px-3.5 py-2 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Import Pukal Senarai Pelajar Melalui CSV"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import CSV</span>
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 font-mono font-bold uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="py-3.5 px-4 text-[10px]">Pelajar & ID</th>
                    <th className="py-3.5 px-4 text-[10px]">Program / Kelas</th>
                    <th className="py-3.5 px-4 text-[10px]">Minat Teater</th>
                    <th className="py-3.5 px-4 text-[10px]">Status & Status Kumpulan</th>
                    <th className="py-3.5 px-4 text-right text-[10px]">Tindakan Pentadbir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredStudents.map(std => {
                    const waLink = generateWhatsAppLink(std.phone, std.full_name, 'PENGESAHAN_PENDAFTARAN');
                    const waGroupInviteLink = generateWhatsAppLink(std.phone, std.full_name, 'JEMPUT_GROUP');

                    return (
                      <tr key={std.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Student Name & Contact */}
                        <td className="py-4 px-4 space-y-1">
                          <div className="font-sans font-bold text-white text-sm">{std.full_name}</div>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                            <span className="px-1.5 py-0.5 rounded bg-neutral-950 text-amber-400 font-bold border border-white/5">
                              {std.student_id}
                            </span>
                            <span>• Sem {std.semester}</span>
                          </div>
                          <div className="text-[10px] text-neutral-500 font-sans">{std.email}</div>
                        </td>

                        {/* Programme & Class */}
                        <td className="py-4 px-4 space-y-1 font-sans">
                          <div className="font-medium text-neutral-200 text-xs">{std.programme}</div>
                          <div className="text-neutral-500 font-mono text-[10px]">Kelas: {std.class_name}</div>
                        </td>

                        {/* Interests */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {std.interests.map((interest, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-lg bg-neutral-950 text-[10px] text-neutral-300 border border-white/5"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                          <div className="text-[10px] text-neutral-500 mt-1.5 font-sans">
                            Tahap: <span className="text-neutral-300 font-medium">{std.experience_level}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 space-y-2 font-sans">
                          <StatusBadge status={std.status} />
                          <div className="text-[11px] text-neutral-400">
                            Status Kumpulan: <span className="text-neutral-200 font-medium">{std.group_status}</span>
                          </div>
                          {std.admin_notes && (
                            <div className="text-[10px] text-amber-400 italic bg-neutral-950 p-1.5 rounded-xl border border-white/5 font-mono">
                              Nota: {std.admin_notes}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right space-y-2">
                          <div className="flex items-center justify-end gap-2">
                            {/* WhatsApp Direct 1-Click Action */}
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                if (std.status === 'PENDING_REVIEW') {
                                  handleUpdateStudentStatus(std.id, 'CONTACTED');
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
                              title="Hubungi melalui WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Hubungi WA</span>
                            </a>

                            {/* Group Invite Link */}
                            <a
                              href={waGroupInviteLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleUpdateStudentStatus(std.id, 'JOINED_COMMUNITY')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-colors"
                              title="Jemput ke Group WhatsApp"
                            >
                              <span>+ Group</span>
                            </a>
                          </div>

                          {/* Quick Status Dropdown & Note button */}
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={std.status}
                              onChange={e => handleUpdateStudentStatus(std.id, e.target.value as RegistrationStatus)}
                              className="bg-neutral-950 border border-white/10 rounded-xl px-2 py-1 text-[10px] text-neutral-300 focus:outline-none focus:border-amber-500"
                            >
                              <option value="PENDING_REVIEW">Pending Review</option>
                              <option value="CONTACTED">Contacted</option>
                              <option value="JOINED_COMMUNITY">Joined Community</option>
                              <option value="NOT_JOINED">Not Joined</option>
                              <option value="REJECTED">Rejected</option>
                            </select>

                            <button
                              onClick={() => {
                                setSelectedStudentForNote(std);
                                setAdminNoteText(std.admin_notes || '');
                              }}
                              className="px-2.5 py-1 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-[10px] border border-white/5"
                            >
                              Nota
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-neutral-500 text-xs font-mono">
                Tiada rekod pelajar berdaftar dijumpai untuk carian ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TEAM MANAGEMENT */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map(team => (
              <div key={team.id} className="bg-neutral-900 border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-950 text-amber-400 border border-white/5">
                      {team.code}
                    </span>
                    <h3 className="text-base font-black uppercase text-white mt-1.5">{team.name}</h3>
                    <p className="text-xs text-neutral-400">Tajuk Lakonan: {team.play_title || 'Belum Ditetapkan'}</p>
                  </div>
                  <StatusBadge status={team.status} />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs text-neutral-300">
                  <p className="font-mono uppercase text-[10px] text-neutral-400">Ahli Kumpulan ({team.members.length}/{team.max_members}):</p>
                  {team.members.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-neutral-950 p-2.5 rounded-2xl border border-white/5">
                      <span className="font-medium text-white">{m.student_name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">{m.role}</span>
                    </div>
                  ))}
                  {team.members.length === 0 && (
                    <p className="text-neutral-500 italic text-[11px]">Belum ada ahli didaftarkan.</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <span className="text-neutral-500 font-mono text-[10px] uppercase">Ubah Status:</span>
                  <select
                    value={team.status}
                    onChange={e => {
                      storage.updateTeamStatus(team.id, e.target.value as any);
                      refreshAll();
                    }}
                    className="bg-neutral-950 border border-white/10 rounded-xl px-3 py-1 text-xs text-neutral-200 font-mono"
                  >
                    <option value="FORMING">FORMING</option>
                    <option value="READY">READY</option>
                    <option value="LOCKED">LOCKED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: EVENTS & CAROUSEL MANAGER */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase text-white flex items-center gap-2">
                <span>Pengurusan Acara Pentas & Carousel ({events.length})</span>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Ready to Swipe
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Acara-acara ini dipaparkan dalam Spotlight Carousel di laman utama untuk diteroka dan diswipe oleh pelajar.
              </p>
            </div>
            <button
              onClick={handleOpenCreateEvent}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-950/40 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Acara Baharu</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt, idx) => (
              <div 
                key={evt.id} 
                className="bg-neutral-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-neutral-950 text-amber-400 border border-white/5">
                      #{idx + 1} {evt.highlight_badge || 'ACARA'}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      evt.status === 'ACTIVE' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : evt.status === 'UPCOMING'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {evt.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors uppercase leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                      {evt.tagline || evt.description}
                    </p>
                  </div>

                  <div className="bg-neutral-950 rounded-2xl p-3 border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-neutral-300">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">🏆 Hadiah Utama:</span>
                      <span className="font-bold text-amber-400">{evt.prizes?.[0]?.amount || 'RM 150.00'}</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-300">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">📍 Lokasi:</span>
                      <span className="font-medium text-white truncate max-w-[140px]">{evt.venue}</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-300">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">👥 Format:</span>
                      <span className="font-medium text-white">
                        {evt.group_size === 1 ? 'Solo' : `${evt.group_size} Orang`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-300">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">⏳ Tarikh Tutup:</span>
                      <span className="font-mono text-red-400 font-bold text-[11px]">
                        {evt.deadline_label || evt.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleOpenEditEvent(evt)}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Acara</span>
                  </button>
                  {events.length > 1 && (
                    <button
                      onClick={() => handleDeleteEvent(evt.id, evt.title)}
                      title="Padam Acara"
                      className="p-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/60 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS MANAGER */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black uppercase text-white">Senarai Pengumuman ({announcements.length})</h2>
            <button
              onClick={() => setShowAnnounceModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengumuman</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map(ann => (
              <div key={ann.id} className="bg-neutral-900 border border-white/10 p-5 rounded-3xl flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-neutral-950 text-amber-400 border border-white/5">
                      {ann.category}
                    </span>
                    {ann.priority === 'High' && (
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                        High Priority
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white">{ann.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed whitespace-pre-line">{ann.content}</p>
                </div>

                <button
                  onClick={() => {
                    storage.deleteAnnouncement(ann.id);
                    refreshAll();
                  }}
                  className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                  title="Padam"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SIR'S CORNER MANAGER */}
      {activeTab === 'sirnotes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black uppercase text-white">Bimbingan & Nasihat Sir ({sirNotes.length})</h2>
            <button
              onClick={() => setShowSirModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Nota Sir</span>
            </button>
          </div>

          <div className="space-y-3">
            {sirNotes.map(note => (
              <div key={note.id} className="bg-neutral-900 border border-white/10 p-5 rounded-3xl flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-neutral-950 text-amber-400 border border-white/5">
                    {note.category}
                  </span>
                  <h3 className="text-sm font-bold text-white">{note.title}</h3>
                  <p className="text-xs text-neutral-400">{note.summary}</p>
                </div>

                <button
                  onClick={() => {
                    storage.deleteSirNote(note.id);
                    refreshAll();
                  }}
                  className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DATABASE & CLOUD SYNC */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          {/* Firebase Cloud Firestore Card */}
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/20 border border-amber-500/20 p-6 sm:p-8 rounded-3xl space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black uppercase text-white">Firebase Cloud Firestore</h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      SYNC AKTIF
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">Penyegerakan Data Masa Nyata (Real-time Device-to-Device)</p>
                </div>
              </div>

              <button
                onClick={handleForceSyncFirebase}
                disabled={firebaseSyncing}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Database className="w-4 h-4" />
                <span>{firebaseSyncing ? 'Menyegerakkan...' : 'Segerak Data ke Cloud'}</span>
              </button>
            </div>

            {firebaseSyncMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-mono">
                ✓ {firebaseSyncMsg}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
                <div className="text-[10px] font-mono uppercase text-neutral-400">Pendaftaran</div>
                <div className="text-lg font-black text-white font-mono">{students.length} Pelajar</div>
              </div>
              <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
                <div className="text-[10px] font-mono uppercase text-neutral-400">Acara Teater</div>
                <div className="text-lg font-black text-white font-mono">{events.length} Acara</div>
              </div>
              <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
                <div className="text-[10px] font-mono uppercase text-neutral-400">Kumpulan</div>
                <div className="text-lg font-black text-white font-mono">{teams.length} Kumpulan</div>
              </div>
              <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
                <div className="text-[10px] font-mono uppercase text-neutral-400">Pengumuman</div>
                <div className="text-lg font-black text-white font-mono">{announcements.length} Siaran</div>
              </div>
            </div>

            <div className="text-[11px] text-neutral-400 bg-neutral-950/40 p-3.5 rounded-2xl border border-white/5 flex items-center justify-between flex-wrap gap-2 font-mono">
              <span>Cloud Project: <strong className="text-neutral-200">gen-lang-client-0739778545</strong></span>
              <span>Status: <strong className="text-emerald-400">Firestore Rules Deployed & Connected</strong></span>
            </div>
          </div>

          {/* Supabase Schema Card */}
          <div className="bg-neutral-900 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Database className="w-5 h-5" />
              <h2 className="text-lg font-black uppercase text-white">PostgreSQL / Supabase Schema (Pilihan Tambahan)</h2>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Skema PostgreSQL di bawah disediakan sekiranya penganjur ingin mengeksport atau menyambungkan pangkalan data relasi SQL luaran.
            </p>

            <div className="bg-neutral-950 p-5 rounded-2xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  PostgreSQL Schema & Row Level Security (RLS) DDL:
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_POSTGRES_SCHEMA);
                    alert('SQL Schema telah disalin ke clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 text-xs font-mono border border-white/10 cursor-pointer"
                >
                  Salin SQL Schema
                </button>
              </div>
              <pre className="text-[11px] font-mono text-neutral-400 overflow-x-auto p-4 bg-neutral-900 rounded-2xl max-h-60 border border-white/5">
                {SUPABASE_POSTGRES_SCHEMA}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN NOTE MODAL */}
      {selectedStudentForNote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black uppercase text-white">
              Catatan Pentadbir: {selectedStudentForNote.full_name}
            </h3>
            <textarea
              rows={4}
              value={adminNoteText}
              onChange={e => setAdminNoteText(e.target.value)}
              placeholder="cth: Telah dihubungi di WhatsApp. Berminat sertai Group A sebagai pelakon utama..."
              className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedStudentForNote(null)}
                className="px-4 py-2 rounded-2xl bg-neutral-950 text-neutral-300 text-xs font-mono font-semibold border border-white/5"
              >
                Batal
              </button>
              <button
                onClick={handleSaveStudentNote}
                className="px-4 py-2 rounded-2xl bg-red-600 text-white text-xs font-bold uppercase tracking-wider"
              >
                Simpan Nota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black uppercase text-white">Tambah Pengumuman Baharu</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono uppercase text-[10px] text-neutral-400 mb-1">Tajuk Pengumuman</label>
                <input
                  type="text"
                  required
                  value={newAnnounceTitle}
                  onChange={e => setNewAnnounceTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-mono uppercase text-[10px] text-neutral-400 mb-1">Kategori</label>
                  <select
                    value={newAnnounceCategory}
                    onChange={e => setNewAnnounceCategory(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-3 py-2 text-white"
                  >
                    <option value="General">General</option>
                    <option value="Competition">Competition</option>
                    <option value="Training">Training</option>
                    <option value="Team">Team</option>
                    <option value="Important">Important</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono uppercase text-[10px] text-neutral-400 mb-1">Keutamaan</label>
                  <select
                    value={newAnnouncePriority}
                    onChange={e => setNewAnnouncePriority(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-3 py-2 text-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-neutral-400 mb-1">Isi Kandungan</label>
                <textarea
                  rows={4}
                  required
                  value={newAnnounceContent}
                  onChange={e => setNewAnnounceContent(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-4 py-2 rounded-2xl bg-neutral-950 text-neutral-300 font-mono font-semibold border border-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-red-600 text-white font-bold uppercase tracking-wider"
                >
                  Terbitkan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT EVENT MODAL */}
      {showEventModal && editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white">
                    {isCreatingNewEvent ? 'Cipta Acara / Pertandingan Baharu' : 'Edit Acara Pentas'}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Kemas kini butiran pertandingan yang dipaparkan dalam Carousel Spotlight laman utama.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-mono font-bold uppercase text-[10px] mb-1">
                  Tajuk Pertandingan *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="Cth: Pertandingan Teater KPMBP 2026"
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-mono font-bold uppercase text-[10px] mb-1">
                    Label Lencana (Badge)
                  </label>
                  <input
                    type="text"
                    value={editingEvent.highlight_badge || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, highlight_badge: e.target.value })}
                    placeholder="Cth: EVENT UTAMA / KARYA ASLI"
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono font-bold uppercase text-[10px] mb-1">
                    Tema Warna Kad Carousel
                  </label>
                  <select
                    value={editingEvent.theme_color || 'amber'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, theme_color: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="amber">Emas / Amber (Gold)</option>
                    <option value="ruby">Merah / Ruby Crimson</option>
                    <option value="emerald">Hijau / Emerald Jade</option>
                    <option value="blue">Biru / Ocean Indigo</option>
                    <option value="purple">Ungu / Royal Purple</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-mono font-bold uppercase text-[10px] mb-1">
                  Tagline / Ringkasan Menarik
                </label>
                <textarea
                  rows={2}
                  value={editingEvent.tagline || editingEvent.description}
                  onChange={(e) => setEditingEvent({ 
                    ...editingEvent, 
                    tagline: e.target.value,
                    description: e.target.value 
                  })}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-mono font-bold uppercase text-[10px] mb-1">
                    Hadiah Utama (Amount) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.prizes?.[0]?.amount || 'RM 150.00'}
                    onChange={(e) => {
                      const updatedPrizes = [...(editingEvent.prizes || [])];
                      if (updatedPrizes.length === 0) {
                        updatedPrizes.push({ rank: 'Hadiah Utama', amount: e.target.value, description: 'Trofi + Sijil' });
                      } else {
                        updatedPrizes[0] = { ...updatedPrizes[0], amount: e.target.value };
                      }
                      setEditingEvent({ ...editingEvent, prizes: updatedPrizes });
                    }}
                    placeholder="Cth: RM 150.00"
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono font-bold uppercase text-[10px] mb-1">
                    Label Tarikh Tutup (Deadline)
                  </label>
                  <input
                    type="text"
                    value={editingEvent.deadline_label || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, deadline_label: e.target.value })}
                    placeholder="Cth: 17 OGOS DEADLINE"
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-mono font-bold uppercase text-[10px] mb-1">
                    Lokasi / Venue Pentas *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.venue}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    placeholder="Cth: Dewan Seminar KPMBP"
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono font-bold uppercase text-[10px] mb-1">
                    Bilangan Ahli (Format)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={editingEvent.group_size}
                    onChange={(e) => setEditingEvent({ ...editingEvent, group_size: parseInt(e.target.value) || 1 })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-mono font-bold uppercase text-[10px] mb-1">
                    Tarikh Pementasan
                  </label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono font-bold uppercase text-[10px] mb-1">
                    Status Acara
                  </label>
                  <select
                    value={editingEvent.status}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="ACTIVE">AKTIF (ACTIVE)</option>
                    <option value="UPCOMING">AKAN DATANG (UPCOMING)</option>
                    <option value="CLOSED">DITUTUP (CLOSED)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end border-t border-white/10 gap-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-amber-950/40 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Acara</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SIR NOTE MODAL */}
      {showSirModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black uppercase text-white">Tambah Bimbingan / Nota Sir</h3>
            <form onSubmit={handleCreateSirNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono uppercase text-[10px] text-neutral-400 mb-1">Tajuk Panduan</label>
                <input
                  type="text"
                  required
                  value={newSirTitle}
                  onChange={e => setNewSirTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-neutral-400 mb-1">Kategori</label>
                <select
                  value={newSirCategory}
                  onChange={e => setNewSirCategory(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-3 py-2 text-white"
                >
                  <option value="Jalan Cerita">Jalan Cerita</option>
                  <option value="Lakonan">Lakonan</option>
                  <option value="Pengurusan">Pengurusan</option>
                  <option value="Tips & Tricks">Tips & Tricks</option>
                </select>
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-neutral-400 mb-1">Ringkasan (1-2 ayat)</label>
                <input
                  type="text"
                  value={newSirSummary}
                  onChange={e => setNewSirSummary(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-neutral-400 mb-1">Kandungan Nasihat Lengkap</label>
                <textarea
                  rows={5}
                  required
                  value={newSirContent}
                  onChange={e => setNewSirContent(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSirModal(false)}
                  className="px-4 py-2 rounded-2xl bg-neutral-950 text-neutral-300 font-mono font-semibold border border-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-red-600 text-white font-bold uppercase tracking-wider"
                >
                  Simpan Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL */}
      {showCsvImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white">
                    Import Senarai Pelajar (CSV)
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Muat naik fail .csv atau tampal data teks untuk pendaftaran pukal ke Firestore
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCsvImportModal(false)}
                className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Template Info Card */}
            <div className="bg-neutral-950/80 border border-white/5 p-4 rounded-2xl space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-amber-400 font-bold uppercase text-[10px]">
                <span>Susunan Lajur Format CSV:</span>
                <span className="text-neutral-500">Pemisah Koma (,)</span>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 text-[11px] text-neutral-300 select-all overflow-x-auto whitespace-nowrap">
                ID Pelajar,Nama Penuh,Program,Kelas,Semester,No Telefon,Emel,Minat
              </div>
              <p className="text-[10px] text-neutral-400">
                Contoh: <span className="text-neutral-200">DLM202401,Ahmad Daniel,DLM,DLM 2A,2,012-3456789,ahmad@kpmbp.edu.my,LAKONAN</span>
              </p>
            </div>

            {/* File Upload Option */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-neutral-300">
                1. Pilih Fail .CSV dari Peranti
              </label>
              <input
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleFileUpload}
                className="w-full text-xs text-neutral-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-bold file:bg-neutral-950 file:text-amber-400 file:border-white/10 hover:file:bg-neutral-800 cursor-pointer bg-neutral-950/50 p-2 rounded-2xl border border-white/10"
              />
            </div>

            {/* Textarea Option */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-neutral-300">
                2. Atau Tampal Teks CSV di Sini
              </label>
              <textarea
                rows={6}
                value={csvImportText}
                onChange={(e) => setCsvImportText(e.target.value)}
                placeholder="ID Pelajar,Nama Penuh,Program,Kelas,Semester,No Telefon,Emel,Minat&#10;DIA202409,Nur Aina,DIA,DIA 2B,2,011-2233445,aina@kpmbp.edu.my,SKRIP&#10;DLM202501,Muhammad Faiz,DLM,DLM 1A,1,019-8765432,faiz@kpmbp.edu.my,STAGE"
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Alert Error / Success */}
            {csvImportError && (
              <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-2xl text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{csvImportError}</span>
              </div>
            )}

            {csvImportResult && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center justify-between font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Berjaya import: <strong>{csvImportResult.imported}</strong> pelajar</span>
                </div>
                {csvImportResult.skipped > 0 && (
                  <span className="text-amber-400 text-[11px]">(Diabaikan / Duplikasi: {csvImportResult.skipped})</span>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCsvImportModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 text-xs font-bold uppercase border border-white/5"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleProcessCsvImport}
                className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Proses & Import ke Sistem</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
