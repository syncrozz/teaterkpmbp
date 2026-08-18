import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { SkillLesson, SkillCategory, SkillDifficulty } from '../types';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  Film, 
  PenTool, 
  Layers, 
  Settings, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap,
  Edit3,
  Plus,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';

const CATEGORY_MAP: { id: 'SEMUA' | SkillCategory; label: string; icon: any }[] = [
  { id: 'SEMUA', label: 'Semua Kategori', icon: Sparkles },
  { id: 'ACTING', label: 'Lakonan (Acting)', icon: Film },
  { id: 'SCRIPT', label: 'Penulisan Skrip', icon: PenTool },
  { id: 'STAGE', label: 'Pentas & Teknikal (Stage)', icon: Layers },
  { id: 'PRODUCTION', label: 'Pengurusan Produksi', icon: Settings }
];

export const SkillsAcademy: React.FC = () => {
  const [skills, setSkills] = useState<SkillLesson[]>(() => storage.getSkills());
  const [selectedCat, setSelectedCat] = useState<'SEMUA' | SkillCategory>('SEMUA');
  const [selectedDiff, setSelectedDiff] = useState<'Semua' | SkillDifficulty>('Semua');
  const [search, setSearch] = useState('');
  const [activeLesson, setActiveLesson] = useState<SkillLesson | null>(null);

  // Admin status check from localStorage
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('teater_admin_auth') === 'true';
  });

  // Edit / Add Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillLesson | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<SkillCategory>('ACTING');
  const [formDifficulty, setFormDifficulty] = useState<SkillDifficulty>('Asas');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formReadTime, setFormReadTime] = useState(5);
  const [formAuthor, setFormAuthor] = useState('Kelab Teater KPMBP');
  const [formTakeaways, setFormTakeaways] = useState<string>('');

  // Custom Delete Confirmation Modal State (No window.confirm!)
  const [deletingSkill, setDeletingSkill] = useState<SkillLesson | null>(null);

  // Listen to storage & admin changes
  React.useEffect(() => {
    const unsub = storage.subscribe(store => {
      setSkills([...store.skills]);
    });

    const checkAdmin = () => {
      setIsAdminLoggedIn(localStorage.getItem('teater_admin_auth') === 'true');
    };

    window.addEventListener('storage', checkAdmin);
    window.addEventListener('teater_admin_auth_changed', checkAdmin);

    return () => {
      unsub();
      window.removeEventListener('storage', checkAdmin);
      window.removeEventListener('teater_admin_auth_changed', checkAdmin);
    };
  }, []);

  const filteredSkills = skills.filter(item => {
    const matchesCat = selectedCat === 'SEMUA' || item.category === selectedCat;
    const matchesDiff = selectedDiff === 'Semua' || item.difficulty === selectedDiff;
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.short_description.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesDiff && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setEditingSkill(null);
    setFormTitle('');
    setFormCategory('ACTING');
    setFormDifficulty('Asas');
    setFormShortDesc('');
    setFormContent('');
    setFormImageUrl('');
    setFormReadTime(5);
    setFormAuthor('Kelab Teater KPMBP');
    setFormTakeaways('');
    setShowEditModal(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, skill: SkillLesson) => {
    e.stopPropagation();
    setEditingSkill(skill);
    setFormTitle(skill.title);
    setFormCategory(skill.category);
    setFormDifficulty(skill.difficulty);
    setFormShortDesc(skill.short_description);
    setFormContent(skill.content);
    setFormImageUrl(skill.image_url || '');
    setFormReadTime(skill.read_time_minutes);
    setFormAuthor(skill.author);
    setFormTakeaways(skill.key_takeaways?.join('\n') || '');
    setShowEditModal(true);
  };

  const handlePromptDelete = (e: React.MouseEvent, skill: SkillLesson) => {
    e.stopPropagation();
    setDeletingSkill(skill);
  };

  const handleConfirmDelete = () => {
    if (!deletingSkill) return;
    const targetId = deletingSkill.id;
    storage.deleteSkill(targetId);
    setSkills(storage.getSkills());
    if (activeLesson?.id === targetId) {
      setActiveLesson(null);
    }
    setDeletingSkill(null);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const takeawaysArray = formTakeaways
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingSkill) {
      storage.updateSkill(editingSkill.id, {
        title: formTitle,
        category: formCategory,
        difficulty: formDifficulty,
        short_description: formShortDesc,
        content: formContent,
        image_url: formImageUrl || undefined,
        read_time_minutes: Number(formReadTime) || 5,
        author: formAuthor || 'Kelab Teater KPMBP',
        key_takeaways: takeawaysArray
      });
    } else {
      storage.createSkill({
        title: formTitle,
        category: formCategory,
        difficulty: formDifficulty,
        short_description: formShortDesc,
        content: formContent,
        image_url: formImageUrl || undefined,
        read_time_minutes: Number(formReadTime) || 5,
        published: true,
        author: formAuthor || 'Kelab Teater KPMBP',
        key_takeaways: takeawaysArray
      });
    }

    setSkills(storage.getSkills());
    setShowEditModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Bento Row: 8-col Hero + 4-col Academy Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                <BookOpen className="w-3.5 h-3.5" />
                PERPUSTAKAAN ILMU & BENGKEL TEATER
              </div>
              {isAdminLoggedIn && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Edit3 className="w-3 h-3" /> Admin Mode: Edit & Padam Aktif
                </div>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              TIPS & TRICK
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Tingkatkan ilmu teori dan praktikal pentas merangkumi lakonan watak, penulisan skrip dramatik, pembahagian ruang blocking, rekaan props, pencahayaan, dan pengurusan pentas profesional.
            </p>
          </div>

          {/* Category Selector inside Bento Hero */}
          <div className="flex flex-wrap gap-2 pt-2">
            {CATEGORY_MAP.map(c => {
              const Icon = c.icon;
              const isSelected = selectedCat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCat(c.id)}
                  className={`px-3.5 py-2 rounded-2xl text-[11px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40'
                      : 'bg-neutral-950 text-neutral-300 border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-col Stat Bento Card */}
        <div className="md:col-span-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-4 shadow-xl text-neutral-950">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-neutral-950/70">
              MODUL DISEDIAKAN
            </span>
            <GraduationCap className="w-6 h-6 text-neutral-950" />
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-950">
              {skills.length} Topik
            </div>
            <p className="text-xs font-bold text-neutral-900">
              Silibus Pentas & Teater Komprehensif
            </p>
          </div>

          <div className="p-3 bg-neutral-950/20 rounded-2xl text-[11px] font-medium text-neutral-900 leading-snug">
            Setiap modul dirangka khusus mengikut keperluan pertandingan teater institusi pengajian tinggi.
          </div>
        </div>
      </div>

      {/* Filter, Search & Admin Add Bar */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold mr-1">Tahap Silibus:</span>
          {(['Semua', 'Asas', 'Pertengahan', 'Lanjutan'] as ('Semua' | SkillDifficulty)[]).map(d => (
            <button
              key={d}
              onClick={() => setSelectedDiff(d)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all ${
                selectedDiff === d
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari topik atau kata kunci..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {isAdminLoggedIn && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-transform active:scale-95 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Modul</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Lessons (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map(lesson => (
          <div
            key={lesson.id}
            onClick={() => setActiveLesson(lesson)}
            className="relative bg-neutral-900 border border-white/10 hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all hover:-translate-y-1 cursor-pointer shadow-xl flex flex-col justify-between group"
          >
            {/* Quick Admin Edit/Delete Floating Overlay */}
            {isAdminLoggedIn && (
              <div 
                className="absolute top-3 right-3 z-30 flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-950/95 border border-amber-500/50 shadow-lg backdrop-blur-md"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={e => handleOpenEditModal(e, lesson)}
                  className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 transition-colors flex items-center gap-1 text-[11px] font-bold px-2"
                  title="Kemaskini Modul"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={e => handlePromptDelete(e, lesson)}
                  className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-bold px-2"
                  title="Padam Modul"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Padam</span>
                </button>
              </div>
            )}

            {lesson.image_url && (
              <div className="h-48 overflow-hidden relative">
                <img
                  src={lesson.image_url}
                  alt={lesson.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-neutral-950/90 text-amber-300 border border-white/10 backdrop-blur-sm">
                    {lesson.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-neutral-950/90 text-neutral-300 border border-white/10 backdrop-blur-sm">
                    {lesson.difficulty}
                  </span>
                </div>
                <div className={`absolute bottom-3 ${isAdminLoggedIn ? 'left-3' : 'right-3'} text-[10px] font-mono text-neutral-300 bg-neutral-950/90 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10`}>
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{lesson.read_time_minutes} min</span>
                </div>
              </div>
            )}

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-black uppercase text-white group-hover:text-amber-400 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {lesson.short_description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
                <span>Buka Modul</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-xs font-mono uppercase">
          Tiada artikel kemahiran dijumpai untuk carian ini.
        </div>
      )}

      {/* READING DRAWER / MODAL */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30">
                    {activeLesson.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-neutral-950 text-neutral-300 border border-white/5">
                    Tahap: {activeLesson.difficulty}
                  </span>
                  {isAdminLoggedIn && (
                    <button
                      onClick={(e) => {
                        handleOpenEditModal(e, activeLesson);
                      }}
                      className="px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] uppercase flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
                  {activeLesson.title}
                </h2>
                <p className="text-xs text-neutral-400 mt-1 font-mono">
                  Oleh: {activeLesson.author} • {activeLesson.read_time_minutes} minit bacaan
                </p>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="text-neutral-400 hover:text-white text-xs font-mono px-3 py-1.5 rounded-xl bg-neutral-950 border border-white/5"
              >
                ✕ TUTUP
              </button>
            </div>

            {activeLesson.image_url && (
              <div className="rounded-2xl overflow-hidden max-h-64 border border-white/5">
                <img
                  src={activeLesson.image_url}
                  alt={activeLesson.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="text-neutral-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {activeLesson.content}
            </div>

            {activeLesson.key_takeaways && activeLesson.key_takeaways.length > 0 && (
              <div className="bg-neutral-950 p-5 rounded-2xl border border-white/5 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Nota Ringkas & Tips Amali:
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  {activeLesson.key_takeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 flex justify-between items-center border-t border-white/10">
              {isAdminLoggedIn ? (
                <button
                  onClick={(e) => handlePromptDelete(e, activeLesson)}
                  className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/40 text-xs font-bold uppercase flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Padam Modul Ini
                </button>
              ) : <div />}

              <button
                onClick={() => setActiveLesson(null)}
                className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-950/40"
              >
                Tutup Modul
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL (CUSTOM SAFE UI INSTEAD OF WINDOW.CONFIRM) */}
      {deletingSkill && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase text-white">
                Padam Topik Tips & Trik?
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Adakah anda pasti mahu memadam topik <span className="font-bold text-amber-400">"{deletingSkill.title}"</span>? Tindakan ini akan memadam data dari storan & Firebase Firestore secara kekal.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingSkill(null)}
                className="flex-1 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 text-xs font-bold uppercase border border-white/5"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Padam</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN EDIT / CREATE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white">
                    {editingSkill ? 'Kemaskini Topik Tips & Trik' : 'Tambah Topik Tips & Trik Baharu'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">Modul Pembelajaran & Silibus Teater</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-neutral-400 hover:text-white p-2 rounded-xl bg-neutral-950 border border-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Tajuk Topik / Modul <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="cth: Teknik Vokal & Projeksi Suara Di Pentas Terbuka"
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Kategori <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as SkillCategory)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="ACTING">Lakonan (Acting)</option>
                    <option value="SCRIPT">Penulisan Skrip</option>
                    <option value="STAGE">Pentas & Teknikal (Stage)</option>
                    <option value="PRODUCTION">Pengurusan Produksi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Tahap Silibus <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={e => setFormDifficulty(e.target.value as SkillDifficulty)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Asas">Asas</option>
                    <option value="Pertengahan">Pertengahan</option>
                    <option value="Lanjutan">Lanjutan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Ringkasan Pendek (Short Description) <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formShortDesc}
                  onChange={e => setFormShortDesc(e.target.value)}
                  placeholder="Ringkasan 2-3 ayat yang menarik minat pembaca..."
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Kandungan Penuh Silibus <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  placeholder="Tulis penerangan lengkap langkah demi langkah, teknik, latihan praktikal..."
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Tips Amali / Takeaways (1 baris setiap 1 tips)
                </label>
                <textarea
                  rows={3}
                  value={formTakeaways}
                  onChange={e => setFormTakeaways(e.target.value)}
                  placeholder="Amalkan pernafasan diafragma 10 minit setiap pagi&#10;Pastikan kedudukan leher tidak tegang semasa melontarkan vokal"
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    URL Imej / Poster
                  </label>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="url"
                      value={formImageUrl}
                      onChange={e => setFormImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Masa Bacaan (Minit)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={formReadTime}
                    onChange={e => setFormReadTime(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 text-xs font-bold uppercase border border-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingSkill ? 'Simpan Perubahan' : 'Terbitkan Modul'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
