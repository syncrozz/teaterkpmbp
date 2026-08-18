import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { StudentExperience, GroupStatus } from '../types';
import { 
  formatLiveName, 
  normalizeFullName, 
  validateFullName, 
  maskStudentId, 
  validateStudentId, 
  maskICNumber, 
  validateICNumber, 
  maskPhoneNumber, 
  validatePhone, 
  normalizePhone, 
  validateEmail,
  toTitleCase,
  formatLiveNickname,
  extractSuggestedNickname
} from '../lib/validation';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HeartHandshake, 
  ShieldCheck, 
  Send, 
  User, 
  Phone, 
  Mail, 
  BookOpen, 
  GraduationCap,
  MessageCircle,
  HelpCircle,
  CreditCard,
  Check
} from 'lucide-react';

const INTEREST_OPTIONS = [
  'Lakonan',
  'Penulisan Skrip',
  'Pengarah',
  'Pengacaraan',
  'Voice / Dubbing',
  'Tari / Pergerakan',
  'Props',
  'Costume',
  'Makeup',
  'Lighting',
  'Sound',
  'Stage Management',
  'Fotografi',
  'Videografi',
  'Media & Promosi',
  'Pengurusan Produksi'
];

const PROGRAMMES = [
  'Diploma in Logistic (DLM)',
  'Diploma in Accounting (DIA)',
  'Lain-lain Program KPMBP'
];

const EXPERIENCE_OPTIONS: StudentExperience[] = [
  'Tiada pengalaman',
  'Pernah menyertai',
  'Sedikit pengalaman',
  'Berpengalaman'
];

const GROUP_STATUS_OPTIONS: GroupStatus[] = [
  'Sudah mempunyai kumpulan',
  'Belum cukup ahli',
  'Belum mempunyai kumpulan',
  'Saya mahu mencari kumpulan'
];

interface JoinCommunityProps {
  onSuccessNavigate?: () => void;
}

export const JoinCommunity: React.FC<JoinCommunityProps> = ({ onSuccessNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [isManualNickname, setIsManualNickname] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [programme, setProgramme] = useState(PROGRAMMES[0]);
  const [className, setClassName] = useState('');
  const [semester, setSemester] = useState<number>(1);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<StudentExperience>('Tiada pengalaman');
  const [motivation, setMotivation] = useState('');
  const [groupStatus, setGroupStatus] = useState<GroupStatus>('Saya mahu mencari kumpulan');
  const [consent, setConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedStudent, setSubmittedStudent] = useState<{ name: string; id: string; studentId: string } | null>(null);

  // Live pattern checks for instant feedback
  const isStudentIdPatternValid = /^[A-Z]{3}-[0-9]{4}-[0-9]{3}$/.test(studentId.trim());
  const isIcPatternValid = /^[0-9]{6}-[0-9]{2}-[0-9]{4}$/.test(icNumber.trim());
  const isPhonePatternValid = /^(?:\+?601[0-9]-[0-9]{7,8}|01[0-9]-[0-9]{7,8})$/.test(phone.trim()) || phone.replace(/\D/g, '').length >= 10;
  const isFullNameValid = fullName.trim().length >= 3;

  const handleFullNameChange = (val: string) => {
    const formatted = formatLiveName(val);
    setFullName(formatted);
    // If user has not manually overridden the nickname, automatically suggest in Title Case
    if (!isManualNickname) {
      const suggested = extractSuggestedNickname(formatted);
      setNickname(suggested);
    }
  };

  const handleFullNameBlur = () => {
    const normalized = normalizeFullName(fullName);
    setFullName(normalized);
    if (!isManualNickname && !nickname) {
      const suggested = extractSuggestedNickname(normalized);
      setNickname(suggested);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Validation according to user's strict rules
    const nameCheck = validateFullName(fullName);
    if (!nameCheck.isValid) {
      setFormError(nameCheck.message || 'Sila masukkan nama penuh yang sah (cth: NUR AINA BATRISYIA BINTI ZULHILMI).');
      return;
    }

    const idCheck = validateStudentId(studentId);
    if (!idCheck.isValid) {
      setFormError(idCheck.message || 'Format ID Pelajar tidak sah. Sila gunakan format XXX-XXXX-XXX (cth: PDA-2502-011).');
      return;
    }

    if (icNumber.trim()) {
      const icCheck = validateICNumber(icNumber);
      if (!icCheck.isValid) {
        setFormError(icCheck.message || 'Format No. Isi tidak sah. Sila gunakan format XXXXXX-XX-XXXX (cth: 861115-46-5305).');
        return;
      }
    }

    if (!className.trim()) {
      setFormError('Sila nyatakan kelas anda (cth: DIT 4A / DIA 2B).');
      return;
    }

    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.isValid) {
      setFormError(phoneCheck.message || 'Format No. Telefon tidak sah. Sila gunakan nombor telefon yang sah (cth: 014-5313756 atau 6014-5313756).');
      return;
    }

    if (!validateEmail(email)) {
      setFormError('Sila masukkan alamat emel pelajar yang sah (cth: nama@student.kpmbp.edu.my).');
      return;
    }

    if (selectedInterests.length === 0) {
      setFormError('Sila pilih sekurang-kurangnya satu minat teater (cth: Lakonan, Skrip, Props).');
      return;
    }

    if (!consent) {
      setFormError('Sila tandakan persetujuan pengurusan maklumat untuk meneruskan.');
      return;
    }

    setLoading(true);

    // Call storage register with normalized values
    const finalNickname = nickname.trim() ? toTitleCase(nickname) : extractSuggestedNickname(nameCheck.cleaned);

    const result = storage.registerStudent({
      full_name: nameCheck.cleaned,
      nickname: finalNickname,
      student_id: studentId.trim().toUpperCase(),
      ic_number: icNumber.trim() ? maskICNumber(icNumber) : undefined,
      programme,
      class_name: className.trim().toUpperCase(),
      semester: Number(semester),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      interests: selectedInterests,
      experience_level: experienceLevel,
      motivation: motivation.trim(),
      group_status: groupStatus,
      consent: true
    });

    setLoading(false);

    if (!result.success) {
      setFormError(result.error || 'Pendaftaran tidak berjaya. Sila cuba lagi.');
      return;
    }

    // Success!
    if (result.student) {
      setSubmittedStudent({
        name: result.student.full_name,
        id: result.student.id,
        studentId: result.student.student_id
      });

      // Fire festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Non-blocking
      }
    }
  };

  const handleResetForm = () => {
    setSubmittedStudent(null);
    setFullName('');
    setNickname('');
    setIsManualNickname(false);
    setStudentId('');
    setIcNumber('');
    setClassName('');
    setPhone('');
    setEmail('');
    setSelectedInterests([]);
    setMotivation('');
    setFormError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Bento Header Card */}
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          PENDAFTARAN KOMUNITI RASMI KPMBP
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
          Sertai Komuniti Teater
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
          Berminat dengan lakonan watak, penulisan skrip, atau kru teknikal pentas? Daftarkan minat anda di sini. 
          <strong className="text-amber-400 font-bold"> Anda tidak perlu mempunyai kumpulan untuk mendaftar.</strong> Urusetia penganjur akan menyemak dan menghubungi anda melalui WhatsApp.
        </p>
      </div>

      {/* SUCCESS STATE MODAL / CARD */}
      {submittedStudent ? (
        <div className="bg-neutral-900 border border-emerald-500/40 rounded-3xl p-8 md:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center text-3xl">
            🎭
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
              Terima Kasih, {submittedStudent.name}!
            </h2>
            <p className="text-emerald-400 font-semibold text-xs sm:text-sm">
              Pendaftaran minat anda telah berjaya direkodkan ke dalam pangkalan data Teater KPMBP.
            </p>
          </div>

          <div className="bg-neutral-950 p-5 rounded-2xl border border-white/5 text-left max-w-md mx-auto space-y-3 text-xs">
            <div className="flex justify-between items-center text-neutral-400">
              <span className="font-mono uppercase text-[10px]">Status Semakan:</span>
              <span className="font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                PENDING REVIEW
              </span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span className="font-mono uppercase text-[10px]">ID Pelajar:</span>
              <span className="font-mono text-white font-bold">{submittedStudent.studentId}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span className="font-mono uppercase text-[10px]">Saluran Komunikasi:</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1 font-mono">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Rasmi
              </span>
            </div>
          </div>

          <div className="bg-neutral-950 border border-emerald-500/30 rounded-2xl p-4 text-xs text-neutral-300 text-left max-w-lg mx-auto space-y-2">
            <p className="font-bold text-emerald-400 flex items-center gap-1.5 font-mono uppercase text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Langkah Seterusnya:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-xs leading-relaxed">
              <li>Penganjur akan menyemak borang dan padanan minat anda.</li>
              <li>Penganjur akan menghubungi anda melalui WhatsApp untuk pengesahan.</li>
              <li>Anda akan dimasukkan ke Group WhatsApp rasmi bagi penyelarasan aktiviti & kumpulan.</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {onSuccessNavigate && (
              <button
                onClick={onSuccessNavigate}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-950/40"
              >
                Lihat Acara & Kumpulan Semasa
              </button>
            )}
            <button
              onClick={handleResetForm}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs font-mono font-medium transition-colors border border-white/5"
            >
              Daftar Pelajar Baharu
            </button>
          </div>
        </div>
      ) : (
        /* REGISTRATION FORM */
        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-8">
          
          {/* Error notification */}
          {formError && (
            <div className="bg-red-500/15 border border-red-500/40 text-red-200 text-xs sm:text-sm p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Perhatian</p>
                <p>{formError}</p>
              </div>
            </div>
          )}

          {/* SECTION 1: IDENTITI PELAJAR */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <User className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                1. Identiti Pelajar
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Penuh */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Nama Penuh Pelajar <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => handleFullNameChange(e.target.value)}
                    onBlur={handleFullNameBlur}
                    placeholder="cth: NUR AINA BATRISYIA BINTI ZULHILMI"
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all uppercase"
                  />
                  {isFullNameValid && (
                    <Check className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3" />
                  )}
                </div>
              </div>

              {/* Nama Panggilan */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Nama Panggilan <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => {
                      setIsManualNickname(true);
                      setNickname(formatLiveNickname(e.target.value));
                    }}
                    onBlur={() => {
                      if (nickname.trim()) {
                        setNickname(toTitleCase(nickname));
                      }
                    }}
                    placeholder="cth: Aina"
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                  {nickname.trim().length >= 2 && (
                    <Check className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3" />
                  )}
                </div>
              </div>

              {/* ID Pelajar */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  ID Pelajar (Student ID) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={e => setStudentId(maskStudentId(e.target.value))}
                    placeholder="cth: PDA-2502-011"
                    maxLength={12}
                    className="w-full uppercase bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono transition-all pr-10"
                  />
                  {isStudentIdPatternValid && (
                    <Check className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3" />
                  )}
                </div>
              </div>

              {/* No. Kad Pengenalan / No. Isi */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  No. Kad Pengenalan / No. Isi
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={icNumber}
                    onChange={e => setIcNumber(maskICNumber(e.target.value))}
                    placeholder="cth: 861115-46-5305"
                    maxLength={14}
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono transition-all"
                  />
                  {icNumber.trim().length > 0 && isIcPatternValid && (
                    <Check className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3" />
                  )}
                </div>
              </div>

              {/* Program */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Program Pengajian <span className="text-red-400">*</span>
                </label>
                <select
                  value={programme}
                  onChange={e => setProgramme(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                >
                  {PROGRAMMES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Kelas */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Kelas <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={e => setClassName(e.target.value.toUpperCase())}
                  placeholder="cth: DIA2B"
                  className="w-full uppercase bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono transition-all"
                />
              </div>

              {/* Semester */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Semester Semasa <span className="text-red-400">*</span>
                </label>
                <select
                  value={semester}
                  onChange={e => setSemester(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              {/* No Telefon */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  No. Telefon (WhatsApp) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(maskPhoneNumber(e.target.value))}
                    placeholder="cth: 014-5313756"
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono transition-all"
                  />
                  {isPhonePatternValid && (
                    <Check className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3" />
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Emel Pelajar (Student Email) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="cth: nama@bpenawar.kpm.edu.my"
                    className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: MINAT TEATER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                  2. Minat & Bidang Teater
                </h2>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                Pilih satu atau lebih ({selectedInterests.length} dipilih)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
              {INTEREST_OPTIONS.map(interest => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase transition-all text-left flex items-center justify-between border ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-sm'
                        : 'bg-neutral-950 text-neutral-300 border-white/5 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span>{interest}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-950 flex-shrink-0 ml-1" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: PENGALAMAN & MOTIVASI */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                3. Pengalaman & Status Kumpulan
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tahap Pengalaman */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Tahap Pengalaman Teater
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {EXPERIENCE_OPTIONS.map(exp => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setExperienceLevel(exp)}
                      className={`p-2.5 rounded-2xl text-xs font-mono font-bold uppercase border text-center transition-all ${
                        experienceLevel === exp
                          ? 'bg-amber-400 text-neutral-950 border-amber-400'
                          : 'bg-neutral-950 text-neutral-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Kumpulan */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Status Kumpulan Semasa
                </label>
                <select
                  value={groupStatus}
                  onChange={e => setGroupStatus(e.target.value as GroupStatus)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                >
                  {GROUP_STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <p className="text-[10px] font-mono text-neutral-500 mt-1">
                  Jika anda belum ada kumpulan, penganjur sedia membantu dalam sesi padanan kumpulan di WhatsApp.
                </p>
              </div>

              {/* Motivasi */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  Apakah yang membuatkan anda berminat dengan teater? (Pilihan)
                </label>
                <textarea
                  rows={3}
                  value={motivation}
                  onChange={e => setMotivation(e.target.value)}
                  placeholder="Ceritakan serba sedikit tentang minat, inspirasi atau apa yang ingin anda pelajari di atas pentas..."
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* CONSENT & SUBMIT */}
          <div className="space-y-5 pt-4 border-t border-white/5">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 text-red-600 focus:ring-red-500 bg-neutral-950 cursor-pointer"
              />
              <span className="text-xs text-neutral-300 leading-relaxed">
                Saya bersetuju maklumat ini digunakan oleh pihak penganjur untuk tujuan pengurusan komuniti dan aktiviti Teater KPMBP.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Menghantar Maklumat...</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>DAFTAR MINAT SEKARANG</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
