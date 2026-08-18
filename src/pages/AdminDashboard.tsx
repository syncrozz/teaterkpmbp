import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../lib/storage';
import { 
  Student, 
  RegistrationStatus, 
  Team, 
  TeamStatus,
  Announcement, 
  SirNote, 
  Opportunity,
  OpportunityStatus,
  TalentProfile,
  TheatreEvent 
} from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { generateWhatsAppLink, generateStudentRegistrationWhatsAppLink } from '../lib/whatsapp';
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
import { extractSuggestedNickname } from '../lib/validation';

export const THEATRE_ROLES = [
  'Ketua / Pengarah',
  'Penulis Skrip',
  'Penolong Pengarah',
  'Pengurus Produksi',
  'Pelakon',
  'Stage Manager / Pengurus Pentas',
  'Penata Artistik / Set',
  'Props Master',
  'Kostum & Solekan',
  'Teknikal',
  'Publisiti & Dokumentasi'
];

export const AdminDashboard: React.FC = () => {
  // Admin Authentication Gate state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('teater_admin_auth') === 'true';
  });
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const pinInputRef = useRef<HTMLInputElement>(null);

  // Auto focus PIN input when login screen is displayed
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        pinInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Tabs
  const [activeTab, setActiveTab] = useState<'students' | 'teams' | 'events' | 'opportunities' | 'announcements' | 'sirnotes' | 'database'>('students');

  // Student Filter state
  const [students, setStudents] = useState<Student[]>(storage.getStudents());
  const [teams, setTeams] = useState<Team[]>(storage.getTeams());
  const [events, setEvents] = useState<TheatreEvent[]>(storage.getEvents());
  const [opportunities, setOpportunities] = useState<Opportunity[]>(storage.getOpportunities());
  const [announcements, setAnnouncements] = useState<Announcement[]>(storage.getAnnouncements());
  const [sirNotes, setSirNotes] = useState<SirNote[]>(storage.getSirNotes());

  // Opportunity Form State
  const [showOppModal, setShowOppModal] = useState(false);
  const [newOppTitle, setNewOppTitle] = useState('');
  const [newOppOrganiser, setNewOppOrganiser] = useState('');
  const [newOppCategory, setNewOppCategory] = useState('Pertandingan Drama & Teater');
  const [newOppStatus, setNewOppStatus] = useState<OpportunityStatus>('OPEN');
  const [newOppDeadline, setNewOppDeadline] = useState('');
  const [newOppEventDate, setNewOppEventDate] = useState('');
  const [newOppVenue, setNewOppVenue] = useState('Kolej Profesional MARA / Luar');
  const [newOppPrize, setNewOppPrize] = useState('');
  const [newOppDescription, setNewOppDescription] = useState('');
  const [newOppOfficialUrl, setNewOppOfficialUrl] = useState('https://kpmbp.mara.gov.my');
  const [oppToDelete, setOppToDelete] = useState<Opportunity | null>(null);

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

  // Student Selection state for Bulk Actions
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Single Student Delete Modal (Confirmation popup without PIN)
  const [studentToDeleteSingle, setStudentToDeleteSingle] = useState<Student | null>(null);

  // Bulk Students Delete Modal (Requires 4-Digit PIN)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkDeletePinInput, setBulkDeletePinInput] = useState('');
  const [bulkDeletePinError, setBulkDeletePinError] = useState<string | null>(null);

  // Team Create Modal State
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCode, setNewTeamCode] = useState('');
  const [newTeamPlayTitle, setNewTeamPlayTitle] = useState('');
  const [newTeamCaptainName, setNewTeamCaptainName] = useState('');
  const [newTeamMaxMembers, setNewTeamMaxMembers] = useState(7);
  const [newTeamStatus, setNewTeamStatus] = useState<TeamStatus>('FORMING');
  const [newTeamEventId, setNewTeamEventId] = useState('');

  // Team Delete Modal State (for Inactive/Graduated Teams)
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [teamDeletePinInput, setTeamDeletePinInput] = useState('');
  const [teamDeletePinError, setTeamDeletePinError] = useState<string | null>(null);

  const [firebaseSyncing, setFirebaseSyncing] = useState(false);
  const [firebaseSyncMsg, setFirebaseSyncMsg] = useState<string | null>(null);

  const refreshAll = () => {
    setStudents(storage.getStudents());
    setTeams(storage.getTeams());
    setEvents(storage.getEvents());
    setOpportunities(storage.getOpportunities());
    setAnnouncements(storage.getAnnouncements());
    setSirNotes(storage.getSirNotes());
  };

  const handleCreateOpportunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOppTitle.trim() || !newOppOrganiser.trim()) return;

    storage.createOpportunity({
      title: newOppTitle.trim(),
      organiser: newOppOrganiser.trim(),
      category: newOppCategory,
      status: newOppStatus,
      deadline: newOppDeadline.trim() || 'Akan Dimaklumkan',
      event_date: newOppEventDate.trim() || 'Akan Dimaklumkan',
      venue: newOppVenue.trim() || 'Kolej Profesional MARA / Luar',
      prize: newOppPrize.trim() || 'Sijil & Hadiah Wang Tunai',
      eligibility: 'Terbuka kepada pelajar KPM & Belia Malaysia',
      description: newOppDescription.trim() || 'Penyertaan terbuka kepada mahasiswa Kolej Profesional MARA dan belia Malaysia.',
      official_url: newOppOfficialUrl.trim() || 'https://kpmbp.mara.gov.my'
    });

    setShowOppModal(false);
    setNewOppTitle('');
    setNewOppOrganiser('');
    setNewOppDeadline('');
    setNewOppEventDate('');
    setNewOppPrize('');
    setNewOppDescription('');
    refreshAll();
  };

  const handleConfirmDeleteOpportunity = () => {
    if (!oppToDelete) return;
    storage.deleteOpportunity(oppToDelete.id);
    setOppToDelete(null);
    refreshAll();
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

  // Selection handlers for students
  const handleToggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const handleToggleSelectStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Single Student Delete (Confirmation popup WITHOUT PIN as requested)
  const handleOpenSingleDelete = (std: Student) => {
    setStudentToDeleteSingle(std);
  };

  const handleConfirmSingleDelete = () => {
    if (!studentToDeleteSingle) return;
    storage.deleteStudent(studentToDeleteSingle.id);
    setSelectedStudentIds(prev => prev.filter(id => id !== studentToDeleteSingle.id));
    setStudentToDeleteSingle(null);
    refreshAll();
  };

  // Bulk Students Delete (Requires 4-Digit PIN as requested)
  const handleOpenBulkDelete = () => {
    if (selectedStudentIds.length === 0) return;
    setBulkDeletePinInput('');
    setBulkDeletePinError(null);
    setShowBulkDeleteModal(true);
  };

  const handleConfirmBulkDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkDeletePinInput.trim() !== '5313') {
      setBulkDeletePinError('Kod PIN Keselamatan 4-digit salah. Sila cuba lagi.');
      return;
    }

    storage.bulkDeleteStudents(selectedStudentIds);
    setSelectedStudentIds([]);
    setShowBulkDeleteModal(false);
    setBulkDeletePinInput('');
    setBulkDeletePinError(null);
    refreshAll();
  };

  // Team CRUD handlers
  const handleOpenCreateTeam = () => {
    const activeEvt = events[0]?.id || '';
    setNewTeamName('');
    setNewTeamCode(`TEAM-${teams.length + 1}`);
    setNewTeamPlayTitle('');
    setNewTeamCaptainName('');
    setNewTeamMaxMembers(7);
    setNewTeamStatus('FORMING');
    setNewTeamEventId(activeEvt);
    setShowCreateTeamModal(true);
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    storage.createTeam({
      name: newTeamName.trim(),
      code: newTeamCode.trim() || `TEAM-${teams.length + 1}`,
      play_title: newTeamPlayTitle.trim() || undefined,
      captain_name: newTeamCaptainName.trim() || undefined,
      max_members: newTeamMaxMembers || 7,
      status: newTeamStatus,
      event_id: newTeamEventId || events[0]?.id || 'event-1',
      members: newTeamCaptainName.trim() ? [{
        id: 'tm-' + Date.now(),
        team_id: '',
        student_id: 'CAPT-' + Math.floor(1000 + Math.random() * 9000),
        student_name: newTeamCaptainName.trim(),
        role: 'Ketua / Pengarah',
        joined_at: new Date().toISOString().split('T')[0],
        is_captain: true
      }] : [],
      checklist: {
        has_captain: Boolean(newTeamCaptainName.trim()),
        has_five_members: false,
        has_title: false,
        has_storyline: false,
        has_character_split: false,
        has_script: false,
        has_props: false,
        has_costume: false,
        has_technical_req: false,
        rehearsal_started: false
      }
    });

    setShowCreateTeamModal(false);
    refreshAll();
  };

  // Delete Team handler (with PIN verification)
  const handleOpenDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    setTeamDeletePinInput('');
    setTeamDeletePinError(null);
  };

  const handleConfirmDeleteTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamToDelete) return;

    if (teamDeletePinInput.trim() !== '5313') {
      setTeamDeletePinError('Kod PIN Keselamatan 4-digit salah. Sila cuba lagi.');
      return;
    }

    storage.deleteTeam(teamToDelete.id);
    setTeamToDelete(null);
    setTeamDeletePinInput('');
    setTeamDeletePinError(null);
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
            nickname: extractSuggestedNickname(fullName),
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
    const isPending = s.status === 'PENDING' || s.status === 'PENDING_REVIEW';
    const isContacted = s.status === 'CONTACTED' || s.status === 'INVITED';
    const isJoined = s.status === 'JOINED' || s.status === 'JOINED_COMMUNITY';
    
    let matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    if (statusFilter === 'PENDING_REVIEW') matchesStatus = isPending;
    if (statusFilter === 'CONTACTED') matchesStatus = isContacted;
    if (statusFilter === 'JOINED_COMMUNITY') matchesStatus = isJoined;

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
  const pendingCount = students.filter(s => s.status === 'PENDING_REVIEW' || s.status === 'PENDING').length;
  const contactedCount = students.filter(s => s.status === 'CONTACTED' || s.status === 'INVITED').length;
  const joinedCount = students.filter(s => s.status === 'JOINED_COMMUNITY' || s.status === 'JOINED').length;
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
              Pusat Kawalan
            </h1>
            <p className="text-xs text-neutral-400">
              Masukkan 4 digit Pin Keselamatan
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
                ref={pinInputRef}
                autoFocus
                type="password"
                required
                maxLength={4}
                autoComplete="current-password"
                placeholder="••••"
                value={adminPin}
                onChange={e => {
                  const val = e.target.value;
                  setAdminPin(val);
                  if (val === '2026') {
                    localStorage.setItem('teater_admin_auth', 'true');
                    setIsAuthenticated(true);
                    setAuthError(null);
                    window.dispatchEvent(new Event('storage'));
                  }
                }}
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3.5 text-center text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-lg tracking-[0.4em] font-mono"
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
          <span>Acara ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'opportunities'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/40'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/5'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Peluang Luar ({opportunities.length})</span>
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

              {selectedStudentIds.length > 0 && (
                <button
                  onClick={handleOpenBulkDelete}
                  className="px-3.5 py-2 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-red-950/40"
                  title="Padam Semua Pelajar Terpilih (Perlu PIN Keselamatan)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Padam Terpilih ({selectedStudentIds.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 text-neutral-400 font-mono font-bold uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="py-3.5 px-4 text-[10px] w-10 text-center">
                      <input
                        type="checkbox"
                        checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                        onChange={handleToggleSelectAll}
                        className="w-4 h-4 rounded border-white/20 bg-neutral-900 text-red-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-red-600"
                        title="Pilih Semua (Select All)"
                      />
                    </th>
                    <th className="py-3.5 px-4 text-[10px]">Pelajar & ID</th>
                    <th className="py-3.5 px-4 text-[10px]">Program / Kelas</th>
                    <th className="py-3.5 px-4 text-[10px]">Minat Teater</th>
                    <th className="py-3.5 px-4 text-[10px]">Status & Status Kumpulan</th>
                    <th className="py-3.5 px-4 text-right text-[10px]">Tindakan Pentadbir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredStudents.map(std => {
                    const assignedTeam = teams.find(t => t.id === std.assigned_team_id || t.members.some(m => m.student_id === std.student_id || m.student_name === std.full_name));
                    const waLink = generateStudentRegistrationWhatsAppLink(std, 'PENGESAHAN_PENDAFTARAN', assignedTeam?.name);
                    const waGroupInviteLink = generateStudentRegistrationWhatsAppLink(std, 'JEMPUT_GROUP', assignedTeam?.name);
                    const isSelected = selectedStudentIds.includes(std.id);

                    return (
                      <tr key={std.id} className={`hover:bg-white/[0.02] transition-colors ${isSelected ? 'bg-red-500/5' : ''}`}>
                        {/* Checkbox */}
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectStudent(std.id)}
                            className="w-4 h-4 rounded border-white/20 bg-neutral-900 text-red-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-red-600"
                          />
                        </td>

                        {/* Student Name & Contact */}
                        <td className="py-4 px-4 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-sans font-bold text-white text-sm">{std.full_name}</span>
                            {std.nickname && (
                              <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-sans">
                                🎭 {std.nickname}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                            <span className="px-1.5 py-0.5 rounded bg-neutral-950 text-amber-400 font-bold border border-white/5">
                              {std.student_id}
                            </span>
                            <span>• Sem {std.semester}</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 font-sans flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-neutral-500" />
                            <span>No. Tel: <span className="text-neutral-300 font-mono">{std.phone}</span></span>
                          </div>
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
                            Status: <span className="text-neutral-200 font-medium">{std.group_status}</span>
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
                              <span>Hubungi</span>
                            </a>

                            {/* Group Selection Droplist */}
                            <div className="relative inline-flex items-center">
                              <select
                                value={std.assigned_team_id || (teams.find(t => t.members.some(m => m.student_id === std.student_id || m.student_name === std.full_name))?.id || '')}
                                onChange={e => {
                                  storage.assignStudentToTeam(std.id, e.target.value);
                                  refreshAll();
                                }}
                                className="bg-neutral-950 hover:bg-neutral-800 text-amber-400 border border-amber-500/40 rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono focus:outline-none focus:border-amber-400 cursor-pointer transition-colors max-w-[150px] truncate"
                                title="Pilih kumpulan produksi untuk pelajar ini"
                              >
                                <option value="">-- Tiada Kumpulan --</option>
                                {teams.map(t => (
                                  <option key={t.id} value={t.id}>
                                    {t.code ? `[${t.code}] ` : ''}{t.name} ({t.members.length}/{t.max_members})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Quick Status Dropdown, Note button, and Delete Button */}
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <select
                              value={std.status === 'PENDING' ? 'PENDING_REVIEW' : (std.status === 'JOINED' ? 'JOINED_COMMUNITY' : std.status)}
                              onChange={e => handleUpdateStudentStatus(std.id, e.target.value as RegistrationStatus)}
                              className="bg-neutral-950 border border-white/10 rounded-xl px-2 py-1 text-[10px] text-neutral-300 focus:outline-none focus:border-amber-500 cursor-pointer"
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

                            <button
                              onClick={() => handleOpenSingleDelete(std)}
                              className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/70 text-red-400 border border-red-500/20 text-[10px] transition-colors cursor-pointer"
                              title="Padam Pelajar (Pengesahan Pantas)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase text-white flex items-center gap-2">
                <span>Pengurusan Kumpulan Produksi ({teams.length})</span>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {teams.filter(t => t.status === 'READY').length} Siap
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Urus kumpulan teater, cipta kumpulan baharu, dan padam kumpulan yang tidak aktif atau tamat belajar.
              </p>
            </div>
            <button
              onClick={handleOpenCreateTeam}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Cipta Kumpulan Baru</span>
            </button>
          </div>

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
                    {team.captain_name && (
                      <p className="text-[11px] text-amber-400 font-mono mt-0.5">Ketua: {team.captain_name}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={team.status} />
                    <button
                      onClick={() => handleOpenDeleteTeam(team)}
                      className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/70 text-red-400 border border-red-500/20 text-xs transition-colors cursor-pointer"
                      title="Padam Kumpulan Ini (Tidak Aktif / Tamat Belajar)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-neutral-300">
                  <div className="flex items-center justify-between">
                    <p className="font-mono uppercase text-[10px] text-neutral-400">
                      Ahli Kumpulan ({team.members.length}/{team.max_members}):
                    </p>
                    <span className="text-[10px] text-amber-400/80 font-mono">
                      Peranan boleh diset oleh Admin
                    </span>
                  </div>

                  {team.members.map((m, idx) => {
                    const displayName = m.student_nickname?.trim() ? m.student_nickname.trim() : m.student_name;
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-950 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          {m.is_captain && <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                          <span className="font-bold text-white text-xs truncate">
                            {displayName}
                          </span>
                          {m.student_nickname && m.student_nickname.trim() !== m.student_name && (
                            <span className="text-[10px] text-neutral-500 truncate hidden md:inline">
                              ({m.student_name})
                            </span>
                          )}
                        </div>

                        {/* Dropdown Pilihan Peranan Teater (11 Pilihan Rasmi) */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <select
                            value={m.role}
                            onChange={e => {
                              storage.updateTeamMemberRole(team.id, m.id, e.target.value);
                              refreshAll();
                            }}
                            className="bg-neutral-900 hover:bg-neutral-850 text-amber-400 font-mono font-bold text-[11px] px-3 py-1.5 rounded-xl border border-amber-500/30 focus:border-amber-500 focus:outline-none cursor-pointer transition-all w-full sm:w-auto"
                          >
                            {THEATRE_ROLES.map((roleOpt, rIdx) => (
                              <option key={rIdx} value={roleOpt} className="bg-neutral-950 text-white font-sans">
                                {rIdx + 1}. {roleOpt}
                              </option>
                            ))}
                            {!THEATRE_ROLES.includes(m.role) && (
                              <option value={m.role} className="bg-neutral-950 text-neutral-300 font-sans">
                                {m.role} (Khas)
                              </option>
                            )}
                          </select>

                          <button
                            onClick={() => {
                              if (window.confirm(`Keluarkan ${displayName} daripada kumpulan ${team.name}?`)) {
                                storage.removeMemberFromTeam(team.id, m.id);
                                refreshAll();
                              }
                            }}
                            className="p-1.5 rounded-xl bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition-colors"
                            title="Keluarkan Ahli"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {team.members.length === 0 && (
                    <p className="text-neutral-500 italic text-[11px] py-2 text-center bg-neutral-950/40 rounded-2xl border border-dashed border-white/5">
                      Belum ada ahli didaftarkan ke dalam kumpulan ini.
                    </p>
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
                    <option value="COMPLETED">COMPLETED (Tamat Belajar)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {teams.length === 0 && (
            <div className="text-center py-12 bg-neutral-900 border border-white/10 rounded-3xl p-8 space-y-3">
              <Users className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-neutral-400 text-xs font-mono">Tiada kumpulan teater didaftarkan.</p>
              <button
                onClick={handleOpenCreateTeam}
                className="px-4 py-2 rounded-2xl bg-amber-500 text-neutral-950 font-bold text-xs uppercase"
              >
                Cipta Kumpulan Pertama
              </button>
            </div>
          )}
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

      {/* TAB: OPPORTUNITIES MANAGEMENT */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black uppercase text-white">Pengurusan Peluang Pertandingan Luar ({opportunities.length})</h2>
              <p className="text-xs text-neutral-400">Peluang sayembara, festival drama IPT & pertandingan MARA.</p>
            </div>
            <button
              onClick={() => setShowOppModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-950/40 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Peluang</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map(opp => (
              <div key={opp.id} className="bg-neutral-900 border border-white/10 p-5 rounded-3xl flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-neutral-950 text-amber-400 border border-white/5 truncate max-w-[180px]">
                      {opp.category}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      opp.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400' :
                      opp.status === 'UPCOMING' ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {opp.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{opp.title}</h3>
                    <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Penganjur: {opp.organiser}</p>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{opp.description}</p>

                  <div className="space-y-1 text-[11px] font-mono text-neutral-400 border-t border-white/5 pt-2">
                    <div>📅 Tarikh: <span className="text-white">{opp.event_date}</span></div>
                    <div>⏳ Tutup: <span className="text-white">{opp.deadline}</span></div>
                    <div>🏆 Hadiah: <span className="text-amber-400 font-bold">{opp.prize}</span></div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <a 
                    href={opp.official_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Pautan Penganjur</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => setOppToDelete(opp)}
                    className="p-2 rounded-xl bg-neutral-950 hover:bg-red-950 text-neutral-400 hover:text-red-400 border border-white/5 transition-colors cursor-pointer"
                    title="Padam Peluang"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {opportunities.length === 0 && (
            <div className="text-center py-12 text-neutral-500 text-xs font-mono">
              Tiada peluang pertandingan didaftarkan.
            </div>
          )}
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
              </div>

              {/* Comprehensive Prize Management */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="font-mono font-bold uppercase text-[11px] text-white">
                      Hadiah & Ganjaran Pemenang
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentPrizes = editingEvent.prizes || [];
                      const newPrizes = [
                        ...currentPrizes,
                        { rank: `Hadiah #${currentPrizes.length + 1}`, amount: 'RM 50.00', description: 'Trofi + Sijil' }
                      ];
                      setEditingEvent({ ...editingEvent, prizes: newPrizes });
                    }}
                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-bold font-mono uppercase flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Hadiah</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {(editingEvent.prizes || []).map((prize, pIdx) => (
                    <div key={pIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-neutral-900 p-2.5 rounded-xl border border-white/5 items-center">
                      <div className="sm:col-span-4">
                        <label className="text-[9px] font-mono text-neutral-500 block mb-0.5">Peringkat / Kategori</label>
                        <input
                          type="text"
                          value={prize.rank}
                          onChange={(e) => {
                            const updated = [...(editingEvent.prizes || [])];
                            updated[pIdx] = { ...updated[pIdx], rank: e.target.value };
                            setEditingEvent({ ...editingEvent, prizes: updated });
                          }}
                          placeholder="Cth: Tempat Pertama"
                          className="w-full bg-neutral-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[9px] font-mono text-neutral-500 block mb-0.5">Jumlah / Nilai</label>
                        <input
                          type="text"
                          value={prize.amount}
                          onChange={(e) => {
                            const updated = [...(editingEvent.prizes || [])];
                            updated[pIdx] = { ...updated[pIdx], amount: e.target.value };
                            setEditingEvent({ ...editingEvent, prizes: updated });
                          }}
                          placeholder="Cth: RM 300.00"
                          className="w-full bg-neutral-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-amber-400 text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="text-[9px] font-mono text-neutral-500 block mb-0.5">Penerangan / Sijil</label>
                        <input
                          type="text"
                          value={prize.description || ''}
                          onChange={(e) => {
                            const updated = [...(editingEvent.prizes || [])];
                            updated[pIdx] = { ...updated[pIdx], description: e.target.value };
                            setEditingEvent({ ...editingEvent, prizes: updated });
                          }}
                          placeholder="Cth: Trofi + Sijil"
                          className="w-full bg-neutral-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingEvent.prizes || []).filter((_, idx) => idx !== pIdx);
                            setEditingEvent({ ...editingEvent, prizes: updated });
                          }}
                          disabled={(editingEvent.prizes || []).length <= 1}
                          className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-950 transition-colors disabled:opacity-30 disabled:hover:text-neutral-500 cursor-pointer"
                          title="Padam Hadiah"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* SINGLE STUDENT DELETE CONFIRMATION POPUP (NO PIN REQUIRED AS REQUESTED) */}
      {studentToDeleteSingle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white">
                    Padam Rekod Pelajar?
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Pengesahan Pemadaman Individu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStudentToDeleteSingle(null)}
                className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-neutral-950 border border-white/10 p-4 rounded-2xl space-y-1.5 font-mono text-xs">
              <div className="text-white font-bold text-sm font-sans">{studentToDeleteSingle.full_name}</div>
              <div className="text-neutral-400 text-[11px]">
                ID Pelajar: <span className="text-amber-400 font-bold">{studentToDeleteSingle.student_id}</span> • {studentToDeleteSingle.programme} ({studentToDeleteSingle.class_name})
              </div>
              <div className="text-neutral-500 text-[11px]">
                Emel: {studentToDeleteSingle.email} • Tel: {studentToDeleteSingle.phone}
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              Adakah anda pasti untuk memadam rekod pelajar ini daripada sistem? Tindakan ini tidak boleh diundur.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDeleteSingle(null)}
                className="px-5 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 text-xs font-bold uppercase border border-white/5 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/40 active:scale-95 transition-transform cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Padam Rekod</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK STUDENTS DELETE MODAL (WITH 4-DIGIT PIN AS REQUESTED) */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white">
                    Padam Pukal Pelajar ({selectedStudentIds.length})
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Perlu 4-Digit PIN Keselamatan
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowBulkDeleteModal(false);
                  setBulkDeletePinInput('');
                  setBulkDeletePinError(null);
                }}
                className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-2xl text-red-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Anda memilih untuk memadam sebanyak <strong>{selectedStudentIds.length} rekod pelajar</strong> sekaligus. Tindakan ini memerlukan pengesahan PIN Keselamatan Pentadbir.
              </p>
            </div>

            <form onSubmit={handleConfirmBulkDelete} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase text-neutral-300">
                  Masukkan 4-Digit PIN Keselamatan (5313):
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    maxLength={4}
                    required
                    autoFocus
                    placeholder="••••"
                    value={bulkDeletePinInput}
                    onChange={e => setBulkDeletePinInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-center text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 text-lg tracking-[0.4em] font-mono"
                  />
                </div>
                {bulkDeletePinError && (
                  <p className="text-[11px] font-mono text-red-400 mt-1">{bulkDeletePinError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkDeleteModal(false);
                    setBulkDeletePinInput('');
                    setBulkDeletePinError(null);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 text-xs font-bold uppercase border border-white/5 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/40 active:scale-95 transition-transform cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Sahkan Padam ({selectedStudentIds.length})</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white">
                    Cipta Kumpulan Baru
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Pendaftaran Kumpulan Produksi Teater
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateTeamModal(false)}
                className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="block text-neutral-300 font-bold uppercase text-[11px]">
                  Nama Kumpulan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kumpulan Mahsuri 2.0"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-neutral-300 font-bold uppercase text-[11px]">
                    Kod Kumpulan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: TEAM-01"
                    value={newTeamCode}
                    onChange={e => setNewTeamCode(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-neutral-300 font-bold uppercase text-[11px]">
                    Kapasiti Maksimum
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={20}
                    value={newTeamMaxMembers}
                    onChange={e => setNewTeamMaxMembers(parseInt(e.target.value) || 7)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-neutral-300 font-bold uppercase text-[11px]">
                  Tajuk Skrip / Pementasan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Menanti Di Gerbang Senja"
                  value={newTeamPlayTitle}
                  onChange={e => setNewTeamPlayTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-neutral-300 font-bold uppercase text-[11px]">
                  Nama Ketua / Pengarah (Pilihan)
                </label>
                <input
                  type="text"
                  placeholder="Nama penuh ketua kumpulan..."
                  value={newTeamCaptainName}
                  onChange={e => setNewTeamCaptainName(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-neutral-300 font-bold uppercase text-[11px]">
                    Status Kumpulan
                  </label>
                  <select
                    value={newTeamStatus}
                    onChange={e => setNewTeamStatus(e.target.value as TeamStatus)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="FORMING">FORMING (Sedang Membentuk)</option>
                    <option value="READY">READY (Sedia)</option>
                    <option value="LOCKED">LOCKED (Terkunci)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-neutral-300 font-bold uppercase text-[11px]">
                    Acara Teater
                  </label>
                  <select
                    value={newTeamEventId}
                    onChange={e => setNewTeamEventId(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateTeamModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 text-xs font-bold uppercase border border-white/5 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Daftar Kumpulan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE TEAM MODAL (WITH 4-DIGIT PIN) */}
      {teamToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white">
                    Padam Kumpulan
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Tamat Belajar / Tidak Aktif
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setTeamToDelete(null);
                  setTeamDeletePinInput('');
                  setTeamDeletePinError(null);
                }}
                className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-neutral-950 border border-red-500/20 p-4 rounded-2xl space-y-1.5 font-mono text-xs">
              <div className="text-white font-bold text-sm font-sans">{teamToDelete.name} ({teamToDelete.code})</div>
              <div className="text-neutral-400 text-[11px]">
                Tajuk: {teamToDelete.play_title || 'Belum ditetapkan'}
              </div>
              <div className="text-neutral-500 text-[11px]">
                Bilangan Ahli: {teamToDelete.members.length} Orang • Status: {teamToDelete.status}
              </div>
            </div>

            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-2xl text-red-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Tindakan ini akan memadam rekod kumpulan ini daripada sistem dan <strong>Firestore</strong> secara kekal.
              </p>
            </div>

            <form onSubmit={handleConfirmDeleteTeam} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase text-neutral-300">
                  Masukkan 4-Digit PIN Keselamatan (5313):
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    maxLength={4}
                    required
                    autoFocus
                    placeholder="••••"
                    value={teamDeletePinInput}
                    onChange={e => setTeamDeletePinInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-center text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 text-lg tracking-[0.4em] font-mono"
                  />
                </div>
                {teamDeletePinError && (
                  <p className="text-[11px] font-mono text-red-400 mt-1">{teamDeletePinError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTeamToDelete(null);
                    setTeamDeletePinInput('');
                    setTeamDeletePinError(null);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 text-xs font-bold uppercase border border-white/5 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/40 active:scale-95 transition-transform cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Sahkan Padam</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD OPPORTUNITY */}
      {showOppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Tambah Peluang Pertandingan Luar</span>
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Daftar peluang sayembara & festival teater untuk ahli
                </p>
              </div>
              <button
                onClick={() => setShowOppModal(false)}
                className="p-2 rounded-xl bg-neutral-950 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunitySubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-neutral-400 font-bold uppercase">Nama Pertandingan / Peluang *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Festival Teater IPT Kebangsaan (MAKUM 2026)"
                  value={newOppTitle}
                  onChange={e => setNewOppTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase">Penganjur *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: JKKN / KPT / MARA"
                    value={newOppOrganiser}
                    onChange={e => setNewOppOrganiser(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase">Kategori</label>
                  <input
                    type="text"
                    value={newOppCategory}
                    onChange={e => setNewOppCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase">Status</label>
                  <select
                    value={newOppStatus}
                    onChange={e => setNewOppStatus(e.target.value as OpportunityStatus)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="OPEN">OPEN (Dibuka)</option>
                    <option value="UPCOMING">UPCOMING (Akan Datang)</option>
                    <option value="CLOSED">CLOSED (Tutup)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase">Tarikh Tutup</label>
                  <input
                    type="text"
                    placeholder="Contoh: 15 Ogos 2026"
                    value={newOppDeadline}
                    onChange={e => setNewOppDeadline(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase">Tarikh Acara</label>
                  <input
                    type="text"
                    placeholder="Contoh: 10-14 Sept 2026"
                    value={newOppEventDate}
                    onChange={e => setNewOppEventDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase">Lokasi / Venue</label>
                  <input
                    type="text"
                    value={newOppVenue}
                    onChange={e => setNewOppVenue(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-bold uppercase">Hadiah / Ganjaran</label>
                  <input
                    type="text"
                    placeholder="Contoh: RM 5,000 + Piala Pusingan"
                    value={newOppPrize}
                    onChange={e => setNewOppPrize(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-bold uppercase">Penerangan / Kriteria Penyertaan</label>
                <textarea
                  rows={3}
                  value={newOppDescription}
                  onChange={e => setNewOppDescription(e.target.value)}
                  placeholder="Keterangan mengenai syarat, tema atau format persembahan..."
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-bold uppercase">Pautan Laman Rasmi / Borang</label>
                <input
                  type="url"
                  value={newOppOfficialUrl}
                  onChange={e => setNewOppOfficialUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowOppModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 text-xs font-bold uppercase border border-white/5 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-950/40 active:scale-95 transition-transform cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan Peluang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE OPPORTUNITY MODAL (ADMIN) */}
      {oppToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase text-white">
                  Padam Peluang Pertandingan
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Tindakan Kekal Pentadbir
                </p>
              </div>
            </div>

            <div className="bg-neutral-950 border border-red-500/20 p-4 rounded-2xl space-y-1.5 text-xs">
              <div className="text-white font-bold text-sm">{oppToDelete.title}</div>
              <div className="text-neutral-400 text-[11px]">Penganjur: {oppToDelete.organiser}</div>
              <div className="text-neutral-500 text-[11px]">Kategori: {oppToDelete.category}</div>
            </div>

            <p className="text-xs text-neutral-300">
              Adakah anda pasti mahu memadam peluang pertandingan ini daripada pangkalan data?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOppToDelete(null)}
                className="px-5 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 text-xs font-bold uppercase border border-white/5 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteOpportunity}
                className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/40 active:scale-95 transition-transform cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sahkan Padam</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
