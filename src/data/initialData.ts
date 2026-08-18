import {
  TheatreEvent,
  Student,
  Team,
  Announcement,
  Opportunity,
  SkillLesson,
  SirNote,
  ArchiveRecord,
  BehindTheScenesItem,
  TalentProfile,
  CalendarEvent
} from '../types';

export const INITIAL_EVENTS: TheatreEvent[] = [
  {
    id: 'event-kpmbp-2026',
    title: 'Pertandingan Teater KPMBP 2026',
    tagline: 'Pentas Seni Perdana Mahasiswa Kolej',
    description: 'Pentas pencarian bakat lakonan, skrip & kru teknikal terbaik antara kelas & jurusan.',
    date: '2026-08-20',
    day: 'Khamis',
    start_time: '8:00 PM',
    end_time: '10:00 PM',
    venue: 'Dewan Seminar KPMBP',
    group_size: 5,
    registration_deadline: '2026-08-17T22:00:00',
    status: 'ACTIVE',
    theme_color: 'amber',
    highlight_badge: 'EVENT UTAMA',
    deadline_label: '17 OGOS DEADLINE',
    prizes: [
      { rank: 'Hadiah Utama', amount: 'RM 150.00', description: 'Trofi + Sijil Penghargaan + Hadiah Tunai' },
      { rank: 'Tempat Kedua', amount: 'RM 100.00', description: 'Trofi + Sijil Penghargaan + Hadiah Tunai' },
      { rank: 'Tempat Ketiga', amount: 'RM 80.00', description: 'Trofi + Sijil Penghargaan + Hadiah Tunai' },
      { rank: 'Saguhati', amount: 'RM 50.00', description: 'Sijil Penyertaan + Hadiah Tunai Saguhati' },
    ],
    organizer: 'Kelab Legasi KPMBP x MPP KPMBP',
    rules: [
      'Penyertaan terbuka kepada semua pelajar aktif KPMBP (Semester 1 - 6).',
      'Setiap kumpulan mestilah terdiri daripada tepat 5 orang ahli.',
      'Masa persembahan pentas adalah antara 8 hingga 12 minit bagi setiap kumpulan.',
      'Kandungan teater hendaklah mematuhi etika, nilai murni, dan tidak menyentuh sensitiviti 3R (Race, Religion, Royalty).'
    ],
    banner_url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
    team_formation_enabled: true,
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-15T12:00:00Z'
  },
  {
    id: 'event-monolog-2026',
    title: 'Festival Monolog Siswa KPMBP',
    tagline: 'Karisma Solo, Jiwa & Emosi Pentas',
    description: 'Pentas persembahan solo menguji penguasaan watak, penghayatan skrip dan lontaran vokal.',
    date: '2026-09-10',
    day: 'Khamis',
    start_time: '8:30 PM',
    end_time: '10:30 PM',
    venue: 'Panggung Mini Kuliah KPMBP',
    group_size: 1,
    registration_deadline: '2026-09-03T23:59:00',
    status: 'UPCOMING',
    theme_color: 'ruby',
    highlight_badge: 'TERBUKA INDIVIDU',
    deadline_label: '03 SEPT DEADLINE',
    prizes: [
      { rank: 'Hadiah Utama', amount: 'RM 120.00', description: 'Trofi Monolog Terbaik + Sijil' },
      { rank: 'Tempat Kedua', amount: 'RM 80.00', description: 'Trofi + Sijil' },
      { rank: 'Tempat Ketiga', amount: 'RM 50.00', description: 'Sijil Penghargaan' }
    ],
    organizer: 'Unit Ko-Kurikulum Seni Budaya KPMBP',
    rules: [
      'Terbuka kepada penyertaan individu bagi semua program diploma.',
      'Masa persembahan solo antara 4 hingga 7 minit.',
      'Props minimum dan dibenarkan membawa muzik iringan sendiri.'
    ],
    banner_url: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1200&q=80',
    team_formation_enabled: false,
    created_at: '2026-08-10T08:00:00Z',
    updated_at: '2026-08-15T12:00:00Z'
  },
  {
    id: 'event-skrip-2026',
    title: 'Sayembara Cipta Skrip Pendek',
    tagline: 'Cipta Naratif Asli Kehidupan Kampus',
    description: 'Pertandingan menulis skrip teater pendek 10 minit berimpak tinggi dengan mesej inspirasi.',
    date: '2026-09-25',
    day: 'Jumaat',
    start_time: '5:00 PM',
    end_time: '11:59 PM',
    venue: 'Dewan Multimedia & Portal KPMBP',
    group_size: 2,
    registration_deadline: '2026-09-20T23:59:00',
    status: 'UPCOMING',
    theme_color: 'emerald',
    highlight_badge: 'KARYA ASLI',
    deadline_label: '20 SEPT DEADLINE',
    prizes: [
      { rank: 'Hadiah Utama', amount: 'RM 100.00', description: 'Pementasan Skrip Eksklusif + Sijil Khas' },
      { rank: 'Tempat Kedua', amount: 'RM 70.00', description: 'Sijil Penghargaan Penulis' },
      { rank: 'Tempat Ketiga', amount: 'RM 50.00', description: 'Sijil Penyertaan' }
    ],
    organizer: 'Kelab Bahasa & Seni Teater KPMBP',
    rules: [
      'Penyertaan individu atau berpasangan (maksimum 2 orang).',
      'Skrip mestilah karya tulen dan belum pernah dipentaskan.',
      'Format penghantaran PDF standard skrip lakonan pentas.'
    ],
    banner_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    team_formation_enabled: false,
    created_at: '2026-08-12T08:00:00Z',
    updated_at: '2026-08-15T12:00:00Z'
  }
];

export const INITIAL_EVENT: TheatreEvent = INITIAL_EVENTS[0];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-001',
    full_name: 'Muhammad Amirul Hafiz',
    nickname: 'Amirul',
    student_id: 'DIT23014',
    programme: 'Diploma in Information Technology (DIT)',
    class_name: 'DIT 4A',
    semester: 4,
    phone: '0112345678',
    email: 'amirul.hafiz@student.kpmbp.edu.my',
    interests: ['Lakonan', 'Voice / Dubbing', 'Pengarah'],
    experience_level: 'Berpengalaman',
    motivation: 'Pernah berlakon teater peringkat sekolah menengah dan ingin kembali aktif di pentas KPMBP bersama rakan-rakan.',
    group_status: 'Sudah mempunyai kumpulan',
    status: 'JOINED',
    consent: true,
    assigned_team_id: 'team-01',
    notes: 'Sudah dijemput ke WhatsApp Rasmi.',
    created_at: '2026-08-02T10:15:00Z',
    updated_at: '2026-08-05T14:30:00Z'
  },
  {
    id: 'std-002',
    full_name: 'Nur Aisyah Binti Zulkifli',
    nickname: 'Aisyah',
    student_id: 'DIA24009',
    programme: 'Diploma in Accounting (DIA)',
    class_name: 'DIA 2B',
    semester: 2,
    phone: '0139876543',
    email: 'aisyah.zul@student.kpmbp.edu.my',
    interests: ['Penulisan Skrip', 'Costume', 'Makeup'],
    experience_level: 'Sedikit pengalaman',
    motivation: 'Sangat berminat dengan penulisan skrip drama pentas dan ingin belajar seni prop serta kostum teater.',
    group_status: 'Saya mahu mencari kumpulan',
    status: 'CONTACTED',
    consent: true,
    assigned_team_id: 'team-02',
    notes: 'Hubungi via WhatsApp pada 10 Ogos.',
    created_at: '2026-08-06T09:20:00Z',
    updated_at: '2026-08-10T11:00:00Z'
  },
  {
    id: 'std-003',
    full_name: 'Danish Haiqal Bin Roslan',
    nickname: 'Danish',
    student_id: 'DBS23088',
    programme: 'Diploma in Business Studies (DBS)',
    class_name: 'DBS 3C',
    semester: 3,
    phone: '0178899001',
    email: 'danish.haiqal@student.kpmbp.edu.my',
    interests: ['Lighting', 'Sound', 'Stage Management', 'Technical Crew'],
    experience_level: 'Pernah menyertai',
    motivation: 'Minat bahagian teknikal audio dan lighting sistem untuk dewan seminar.',
    group_status: 'Belum mempunyai kumpulan',
    status: 'PENDING',
    consent: true,
    notes: 'Menunggu semakan admin.',
    created_at: '2026-08-12T16:45:00Z',
    updated_at: '2026-08-12T16:45:00Z'
  },
  {
    id: 'std-004',
    full_name: 'Farah Nadia Binti Kamaruddin',
    nickname: 'Farah',
    student_id: 'DIB24031',
    programme: 'Diploma in International Business (DIB)',
    class_name: 'DIB 1A',
    semester: 1,
    phone: '0197766554',
    email: 'farah.nadia@student.kpmbp.edu.my',
    interests: ['Lakonan', 'Tari / Pergerakan', 'Pengacaraan'],
    experience_level: 'Tiada pengalaman',
    motivation: 'Ingin mencuba sesuatu yang baharu, bina keyakinan diri dan serlahkan bakat.',
    group_status: 'Saya mahu mencari kumpulan',
    status: 'PENDING',
    consent: true,
    created_at: '2026-08-14T11:05:00Z',
    updated_at: '2026-08-14T11:05:00Z'
  },
  {
    id: 'std-005',
    full_name: 'Syed Imran Bin Syed Ahmad',
    nickname: 'Imran',
    student_id: 'DEB23022',
    programme: 'Diploma in English for Business Communication (DEB)',
    class_name: 'DEB 4A',
    semester: 4,
    phone: '0123344556',
    email: 'syed.imran@student.kpmbp.edu.my',
    interests: ['Lakonan', 'Penulisan Skrip', 'Pengarah'],
    experience_level: 'Berpengalaman',
    motivation: 'Mahu mengetuai satu produksi naskhah komedi santai bertemakan kehidupan kolej.',
    group_status: 'Belum cukup ahli',
    status: 'INVITED',
    consent: true,
    assigned_team_id: 'team-01',
    created_at: '2026-08-08T14:10:00Z',
    updated_at: '2026-08-11T17:00:00Z'
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-01',
    event_id: 'event-kpmbp-2026',
    name: 'Teater Citra Warisan',
    code: 'TCW-26',
    captain_id: 'std-001',
    captain_name: 'Muhammad Amirul Hafiz',
    play_title: 'Malam Di Sebalik Tabir',
    synopsis: 'Sebuah kisah drama komedi tentang 5 orang pelajar yang terkandas di dewan latihan malam sebelum pementasan sebenar.',
    status: 'READY',
    max_members: 5,
    checklist: {
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
    },
    members: [
      { id: 'm-1', team_id: 'team-01', student_id: 'std-001', student_name: 'Muhammad Amirul Hafiz', student_phone: '0112345678', role: 'Pengarah & Pelakon Utama', is_captain: true, joined_at: '2026-08-03' },
      { id: 'm-2', team_id: 'team-01', student_id: 'std-005', student_name: 'Syed Imran Bin Syed Ahmad', student_phone: '0123344556', role: 'Penulis Skrip & Pelakon', joined_at: '2026-08-04' },
      { id: 'm-3', team_id: 'team-01', student_id: 'std-demo-3', student_name: 'Haziq Najmi', role: 'Pelakon Pembantu', joined_at: '2026-08-05' },
      { id: 'm-4', team_id: 'team-01', student_id: 'std-demo-4', student_name: 'Nurin Athirah', role: 'Props & Pelakon', joined_at: '2026-08-06' },
      { id: 'm-5', team_id: 'team-01', student_id: 'std-demo-5', student_name: 'Ahmad Faiz', role: 'Pengurus Pentas (Stage Manager)', joined_at: '2026-08-07' }
    ],
    notes: 'Kumpulan lengkap dan telah selesai sesi rehearsal pertama.',
    created_at: '2026-08-03T10:00:00Z'
  },
  {
    id: 'team-02',
    event_id: 'event-kpmbp-2026',
    name: 'Sanggar Mahasiswa (Group B)',
    code: 'SNG-02',
    captain_id: 'std-002',
    captain_name: 'Nur Aisyah Binti Zulkifli',
    play_title: 'Gema Di Hujung Koridor',
    synopsis: 'Eksplorasi misteri dan persahabatan sekumpulan pelajar tahun akhir yang mencari erti kejayaan.',
    status: 'FORMING',
    max_members: 5,
    checklist: {
      has_five_members: false,
      has_captain: true,
      has_title: true,
      has_storyline: true,
      has_character_split: false,
      has_script: true,
      has_props: false,
      has_costume: false,
      has_technical_req: false,
      rehearsal_started: false
    },
    members: [
      { id: 'm-6', team_id: 'team-02', student_id: 'std-002', student_name: 'Nur Aisyah Binti Zulkifli', student_phone: '0139876543', role: 'Penulis Skrip & Kapten', is_captain: true, joined_at: '2026-08-08' },
      { id: 'm-7', team_id: 'team-02', student_id: 'std-demo-7', student_name: 'Khairul Anwar', role: 'Pelakon Watak Utama', joined_at: '2026-08-09' },
      { id: 'm-8', team_id: 'team-02', student_id: 'std-demo-8', student_name: 'Siti Sarah', role: 'Kostum & Pelakon', joined_at: '2026-08-10' }
    ],
    notes: 'Memerlukan lagi 2 orang ahli (Pelakon Lelaki & Technical Crew).',
    created_at: '2026-08-08T15:00:00Z'
  },
  {
    id: 'team-03',
    event_id: 'event-kpmbp-2026',
    name: 'Karya Remaja (Group C)',
    code: 'KYR-03',
    captain_name: 'Aiman Hakimi',
    play_title: 'Titik Pertemuan',
    synopsis: 'Kisah komedi santai tentang pertembungan dialek negeri di kolej kediaman.',
    status: 'FORMING',
    max_members: 5,
    checklist: {
      has_five_members: false,
      has_captain: true,
      has_title: true,
      has_storyline: true,
      has_character_split: true,
      has_script: false,
      has_props: false,
      has_costume: false,
      has_technical_req: false,
      rehearsal_started: false
    },
    members: [
      { id: 'm-9', team_id: 'team-03', student_id: 'std-demo-9', student_name: 'Aiman Hakimi', role: 'Kapten & Pelakon', is_captain: true, joined_at: '2026-08-11' },
      { id: 'm-10', team_id: 'team-03', student_id: 'std-demo-10', student_name: 'Luqman Hakim', role: 'Pelakon', joined_at: '2026-08-12' }
    ],
    notes: 'Terbuka untuk 3 orang ahli baharu.',
    created_at: '2026-08-11T12:00:00Z'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Pendaftaran Rasmi Pertandingan Teater KPMBP 2026 Kini Dibuka!',
    content: 'Peluang untuk semua pelajar KPMBP menyerlahkan bakat lakonan, penulisan skrip dan kru pentas. Tarikh tutup pendaftaran adalah 17 Ogos 2026 jam 10.00 PM. Pelajar tanpa Microsoft Teams amat dialu-alukan untuk mendaftar terus di web ini!',
    category: 'Competition',
    priority: 'High',
    event_id: 'event-kpmbp-2026',
    published: true,
    author: 'Jawatankuasa Penganjur Teater KPMBP',
    created_at: '2026-08-01T09:00:00Z'
  },
  {
    id: 'ann-02',
    title: 'Sesi Bengkel Lakonan & Projeksi Vokal Pentas (Sabtu Ini)',
    content: 'Semua peserta dan ahli komuniti yang berminat dijemput menghadiri Sesi Bimbingan Intensif Lakonan dan Suara bersama Sir Penasihat di Bilik Aktiviti Pelajar pada jam 2.30 PM.',
    category: 'Training',
    priority: 'Normal',
    published: true,
    author: 'Sir Penasihat Teater',
    created_at: '2026-08-10T14:00:00Z'
  },
  {
    id: 'ann-03',
    title: 'Pembentukan Kumpulan Melalui Komuniti WhatsApp',
    content: 'Bagi pelajar yang mendaftar secara solo atau belum cukup ahli, penganjur akan menguruskan padanan kumpulan dalam Group WhatsApp Rasmi Teater KPMBP bermula minggu hadapan.',
    category: 'Team',
    priority: 'Normal',
    published: true,
    author: 'Penyelaras Komuniti',
    created_at: '2026-08-12T11:30:00Z'
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-01',
    title: 'Festival Teater Institusi Pendidikan MARA (FESTIM 2026)',
    organiser: 'Bahagian Pendidikan Tinggi MARA (BPT)',
    description: 'Festival teater dwi-tahunan peringkat kebangsaan menghimpunkan produksi terbaik daripada seluruh KPM dan Kolej MARA se-Malaysia.',
    event_date: '15 - 18 Oktober 2026',
    deadline: '2026-09-05',
    venue: 'Auditorium MARA, Ibu Pejabat MARA Kuala Lumpur',
    prize: 'Johan RM3,000 + Piala Pusingan | Naib Johan RM2,000 | Ke-3 RM1,000',
    eligibility: 'Pelajar KPM/Kolej MARA aktif berdaftar.',
    official_url: 'https://www.mara.gov.my',
    status: 'OPEN',
    category: 'Festival Kebangsaan',
    created_at: '2026-08-05T08:00:00Z'
  },
  {
    id: 'opp-02',
    title: 'Sayembara Teater Pendek & Monolog Belia Johor 2026',
    organiser: 'Yayasan Warisan Johor & JKKN Negeri Johor',
    description: 'Pertandingan persembahan teater monolog dan karya pendek bertemakan aspirasi anak muda Johor.',
    event_date: '28 September 2026',
    deadline: '2026-08-30',
    venue: 'Kompleks Warisan Sultan Abu Bakar, Johor Bahru',
    prize: 'Hadiah Wang Tunai Keseluruhan RM5,000',
    eligibility: 'Terbuka kepada belia Johor berumur 18 - 25 tahun.',
    official_url: 'https://www.jkkn.gov.my',
    status: 'OPEN',
    category: 'Monolog & Teater Pendek',
    created_at: '2026-08-08T10:00:00Z'
  },
  {
    id: 'opp-03',
    title: 'Pertandingan Penulisan Skrip Teater Remaja Kebangsaan',
    organiser: 'Dewan Bahasa dan Pustaka (DBP)',
    description: 'Peluang kepada mahasiswa mencurahkan bakat mengarang skrip drama pentas berkualiti dalam Bahasa Melayu.',
    event_date: 'Penghakiman: November 2026',
    deadline: '2026-09-30',
    venue: 'Penghantaran Digital Atas Talian',
    prize: 'Hadiah Utama RM2,500 + Penerbitan Antologi Skrip',
    eligibility: 'Warganegara Malaysia 18 - 30 tahun.',
    official_url: 'https://www.dbp.gov.my',
    status: 'UPCOMING',
    category: 'Penulisan Skrip',
    created_at: '2026-08-10T12:00:00Z'
  }
];

export const INITIAL_SKILLS: SkillLesson[] = [
  {
    id: 'skl-01',
    title: 'Asas Lakonan Pentas: Membina "Stage Presence"',
    category: 'ACTING',
    difficulty: 'Asas',
    short_description: 'Teknik berdiri, mengisi ruang pentas, dan memancarkan aura watak tanpa kelihatan kaku.',
    content: `
### Pengenalan Kepada Stage Presence
*Stage presence* bukan tentang siapa yang menjerit paling kuat, tetapi siapa yang mampu menarik fokus penonton walaupun ketika dia sedang diam.

#### 1. Postur Tubuh & Titik Graviti
- Pastikan tapak kaki anda 'grounded' (tertancap kukuh pada lantai).
- Elakkan memindahkan berat badan dari kaki kiri ke kanan secara berterusan (ini menandakan anda gugup).
- Buka dada dan turunkan bahu supaya pernafasan diafragma berjalan lancar.

#### 2. Menghidupkan Mata (Eye Contact)
- Dalam teater pentas, tatapan mata mestilah dilemparkan melepasi barisan hadapan ke arah tengah dewan.
- Jangan melihat ke bawah (lantai pentas) kecuali watak anda sengaja diarahkan demikian.

#### 3. Kuasa Kesunyian (The Power of Pauses)
- Sebelum memulakan dialog penting, ambil masa 1–2 saat. Beri peluang penonton menyerap emosi anda.
    `,
    key_takeaways: [
      'Pijak lantai dengan yakin tanpa goyangan.',
      'Gunakan nafas diafragma untuk kestabilan emosi.',
      'Beri ruang kepada kesunyian sebelum lontaran dialog dramatik.'
    ],
    image_url: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
    read_time_minutes: 4,
    published: true,
    author: 'Sir Advisor Teater',
    created_at: '2026-08-02T08:00:00Z'
  },
  {
    id: 'skl-02',
    title: 'Projeksi Suara: Cara Suara Sampai Ke Barisan Belakang Dewan',
    category: 'ACTING',
    difficulty: 'Pertengahan',
    short_description: 'Latihan pernafasan diafragma dan artikulasi supaya dialog jelas tanpa merosakkan peti suara.',
    content: `
### Beza Menjerit dan Melontar Suara (Projection)
Menjerit menggunakan otot tekak dan akan menyebabkan suara anda serak dalam 5 minit. Melontar suara (*projection*) menggunakan udara dari perut (diafragma) dan ruang gema (resonation chambers) di dada serta kepala.

#### Latihan Harian Projeksi Suara:
1. **Pernafasan Diafragma (3 Fasa):** Tarik nafas melalui hidung (perut mengembang), tahan selama 4 saat, hembus perlahan melalui mulut dengan bunyi "Sssss..." selama 8 saat.
2. **Latihan Vokal Konsonan Keras (P-T-K):** Sebutkan perkataan "PA-TA-KA", "BA-DA-GA" dengan mulut dibuka luas sebanyak 3 jari.
3. **Mengangkat Suara ke Bumbung Dewan:** Bayangkan anda sedang bercakap dengan penonton di barisan paling hujung di Dewan Seminar KPMBP.
    `,
    key_takeaways: [
      'Jangan menjerit dari tekak, gunakan tolakan diafragma.',
      'Artikulasi mulut mesti jelas (buka rahang secukupnya).',
      'Minum air suam dan elakkan minuman berais sebelum latihan.'
    ],
    image_url: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80',
    read_time_minutes: 5,
    published: true,
    author: 'Sir Advisor Teater',
    created_at: '2026-08-04T10:00:00Z'
  },
  {
    id: 'skl-03',
    title: 'Struktur Skrip 10 Minit: Eksposisi, Konflik & Klimaks Pantas',
    category: 'SCRIPT',
    difficulty: 'Asas',
    short_description: 'Formula membina cerita teater pendek yang padat dan memberi impak emosi dalam masa terhad.',
    content: `
### Anatomi Skrip Teater 10 Minit

Untuk pertandingan seperti Pertandingan Teater KPMBP 2026 (had masa 8-12 minit), anda tidak mempunyai masa untuk mukadimah yang berlarutan.

#### Pembahagian Masa Optimum:
* **Minit 0 - 2 (Eksposisi Pantas):** Perkenalkan siapa watak, di mana mereka berada, dan apa yang mereka mahukan.
* **Minit 3 - 6 (Peningkatan Konflik):** Munculkan halangan! Watak A mahukan sesuatu, tetapi Watak B menentang.
* **Minit 7 - 9 (Klimaks & Titik Puncak):** Konfrontasi paling hangat atau pendedahan rahsia utama.
* **Minit 10 (Peleraian / Punchline):** Pengakhiran yang memberi mesej mendalam atau twist mengejutkan.
    `,
    key_takeaways: [
      'Masuk terus ke dalam adegan yang penting.',
      'Setiap watak mesti ada matlamat (goal) yang jelas.',
      'Elakkan dialog berbunga-bunga yang tidak menggerakkan plot.'
    ],
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    read_time_minutes: 6,
    published: true,
    author: 'Sir Penasihat Skrip',
    created_at: '2026-08-06T11:00:00Z'
  },
  {
    id: 'skl-04',
    title: 'Blocking & Pergerakan Pentas (Stage Geometry)',
    category: 'STAGE',
    difficulty: 'Pertengahan',
    short_description: 'Memahami zon pentas (Upstage, Downstage, Center) dan mengelakkan blocking yang bertindih.',
    content: `
### Memahami 9 Zon Pentas
Pentas dewan terbahagi kepada:
- **Upstage Right (USR) | Upstage Center (USC) | Upstage Left (USL)** (Bahagian belakang pentas)
- **Center Right (CR) | Center Stage (CS) | Center Left (CL)** (Bahagian tengah)
- **Downstage Right (DSR) | Downstage Center (DSC) | Downstage Left (DSL)** (Bahagian hadapan berhampiran penonton)

#### Peraturan Emas Blocking:
1. **Jangan Membelakangi Penonton (No Backs to House):** Kecuali atas tujuan artistik yang sangat spesifik.
2. **Kekalkan Segitiga Visual (The Triangle Rule):** Jika ada 3 pelakon di pentas, susun kedudukan dalam bentuk segi tiga supaya semua wajah kelihatan.
3. **Bergerak dengan Tujuan:** Jangan berjalan mundar-mandir tanpa motivasi watak. Setiap langkah mestilah ada dorongan emosi.
    `,
    key_takeaways: [
      'Downstage Center (DSC) adalah titik emosi paling intim.',
      'Gunakan segitiga visual apabila ada lebih daripada 2 pelakon.',
      'Pastikan watak tidak terlindung di belakang prop atau pelakon lain.'
    ],
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    read_time_minutes: 5,
    published: true,
    author: 'Sir Advisor Teater',
    created_at: '2026-08-07T09:30:00Z'
  },
  {
    id: 'skl-05',
    title: 'Peranan Stage Manager & Disiplin Di Sebalik Tabir',
    category: 'PRODUCTION',
    difficulty: 'Lanjutan',
    short_description: 'Panduan menyelaras prop, pencahayaan, susunan giliran masuk (cue), dan komunikasi kru.',
    content: `
### Jantung Sebuah Produksi: Stage Manager (SM)
Pengarah mencipta visi persembahan, tetapi **Stage Manager** yang memastikan visi tersebut terlaksana dengan lancar pada malam pementasan.

#### Senarai Semak SM Sebelum Persembahan:
1. **Master Prop Table:** Setiap prop mesti ditandakan petak dan disemak 30 minit sebelum tirai dibuka.
2. **Cue Sheet Audio & Lighting:** Padankan kod lampu dengan dialog spesifik pelakon.
3. **Standby Call:** Buat panggilan masa "15 minit ke mula", "5 minit ke mula", dan "Pelakon standby di sayap pentas".
    `,
    key_takeaways: [
      'Disiplin masa di belakang tabir menentukan kejayaan di hadapan tabir.',
      'Sediakan prop backup sekiranya berlaku kerosakan kecemasan.',
      'Komunikasi tenang antara kru menstabilkan emosi pelakon.'
    ],
    image_url: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80',
    read_time_minutes: 5,
    published: true,
    author: 'Sir Advisor Teater',
    created_at: '2026-08-09T15:00:00Z'
  }
];

export const INITIAL_SIR_NOTES: SirNote[] = [
  {
    id: 'sir-01',
    title: 'Keputusan Akhir Tetap di Tangan Pelajar!',
    category: 'Pengurusan',
    summary: 'Peranan Sir sebagai mentor, fasilitator dan coach — bukan penentu mutlak karya anda.',
    content: `
Pentas teater adalah medan pembelajaran dan ekspresi kreatif anda sebagai mahasiswa. 

Sebagai penasihat dan coach, peranan saya adalah:
1. Membantu anda meneroka potensi vokal dan lakonan.
2. Memberi maklum balas kritis terhadap jalan cerita dan blocking pentas.
3. Memastikan kebajikan, disiplin, dan persediaan teknikal kumpulan berjalan lancar.

Namun, **jiwa, interpretasi skrip, dan gaya lakonan adalah milik anda dan kumpulan anda sepenuhnya!** Jangan takut mencuba idea berani dan segar. Banggalah dengan karya ciptaan anda sendiri.
    `,
    key_points: [
      'Sir sebagai fasilitator & mentor, bukan pengarah autokratik.',
      'Kreativiti dan sentuhan asli lahir dari perbincangan sesama ahli kumpulan.',
      'Saling menghormati pendapat dalam bilik latihan.'
    ],
    author_name: 'Sir Penasihat Teater',
    author_title: 'Pensyarah & Penasihat Seni Teater KPMBP',
    published: true,
    created_at: '2026-08-01T10:00:00Z'
  },
  {
    id: 'sir-02',
    title: 'Cara Mengatasi "Stage Fright" & Gugup Sebelum Masuk Pentas',
    category: 'Tips & Tricks',
    summary: 'Rasa gementar itu normal. Rahsianya adalah menukarkan debaran menjadi tenaga lakonan.',
    content: `
Hampir 100% pelakon hebat di dunia masih berasa gugup beberapa minit sebelum melangkah ke atas pentas. Gugup bermaksud anda peduli dengan persembahan anda.

#### Formula 3 Minit Menghilangkan Gugup:
- **Teknik Nafas 4-7-8:** Tarik nafas 4 saat, tahan 7 saat, hembus perlahan 8 saat. Degupan jantung anda akan turun secara biologi.
- **Shake It Out:** Goncangkan tangan, bahu, dan lompat kecil di sayap pentas (backstage) untuk melepaskan ketegangan otot.
- **Tumpu Kepada Rakan Lakon:** Apabila anda berada di atas pentas, jangan fikir tentang apa yang orang di kerusi penonton fikirkan tentang anda. Fikirkan tentang apa yang watak rakan anda sedang katakan. Dengar dengan teliti!
    `,
    key_points: [
      'Gugup adalah tenaga yang belum disalurkan.',
      'Gunakan teknik pernafasan 4-7-8.',
      'Fokus kepada rakan lakon di atas pentas, bukan penonton di luar.'
    ],
    author_name: 'Sir Penasihat Teater',
    author_title: 'Pensyarah & Penasihat Seni Teater KPMBP',
    published: true,
    created_at: '2026-08-03T11:00:00Z'
  },
  {
    id: 'sir-03',
    title: '5 Kesilapan Biasa Peserta Teater Pendek',
    category: 'Lakonan',
    summary: 'Elakkan perangkap ini supaya markah persembahan kumpulan anda tidak terjejas.',
    content: `
Berdasarkan pengalaman menilai pementasan pelajar:

1. **Bercakap Terlalu Laju:** Semasa gugup, kita cenderung menghabiskan dialog secepat mungkin. Perlahankan 20% daripada kelajuan biasa anda.
2. **Kaku di Pentas Kerana Menghafal Ayat:** Jangan hafal perkataan demi perkataan seperti membaca buku teks. Fahami motif dan mesej yang ingin disampaikan.
3. **Mengabaikan Reaksi Tanpa Suara:** Lakonan berlaku bukan sahaja ketika anda bercakap, tetapi ketika anda sedang mendengar watak lain bercakap.
4. **Prop Terlalu Banyak & Menyusahkan:** Gunakan prop yang benar-benar penting sahaja. Prop yang rumit melambatkan pertukaran babak.
5. **Kurang Latihan Transisi (In & Out):** Latihlah bagaimana pelakon masuk dan keluar pentas dengan kemas.
    `,
    key_points: [
      'Perlahankan tempo dialog sebanyak 20%.',
      'Lakonan reaksi tanpa suara sama pentingnya dengan dialog.',
      'Pastikan keluar masuk pentas kemas dan terlatih.'
    ],
    author_name: 'Sir Penasihat Teater',
    author_title: 'Pensyarah & Penasihat Seni Teater KPMBP',
    published: true,
    created_at: '2026-08-05T14:00:00Z'
  },
  {
    id: 'sir-04',
    title: 'Merangka Jalan Cerita: Jangan Biarkan Penonton Bosan',
    category: 'Jalan Cerita',
    summary: 'Bagaimana membina babak pembukaan yang memukau dan klimaks yang memuaskan.',
    content: `
Kunci pementasan 10 minit adalah **ketegangan (tension)**.

- **Babak 1 (Minit 1):** Mesti ada "Inciting Incident" dalam 60 saat pertama. Jangan mulakan dengan adegan watak termenung panjang tanpa tindakan.
- **Konflik:** Setiap watak mesti mempunyai motif bertentangan. Contoh: Si A mahu pulang ke kampung, Si B mahu kekal menyiapkan tugasan, Si C memegang kunci bilik.
- **Klimaks:** Semua watak berkumpul dan rahsia terbongkar.
- **Peleraian:** Berikan rasa kesimpulan yang meninggalkan kesan kepada jiwa penonton.
    `,
    key_points: [
      'Mulakan dengan peristiwa pencetus dalam 60 saat pertama.',
      'Cipta matlamat watak yang bertembung.',
      'Akhiri dengan mesej yang bermakna.'
    ],
    author_name: 'Sir Penasihat Teater',
    author_title: 'Pensyarah & Penasihat Seni Teater KPMBP',
    published: true,
    created_at: '2026-08-07T16:00:00Z'
  }
];

export const INITIAL_ARCHIVES: ArchiveRecord[] = [
  {
    id: 'arc-2025-01',
    title: 'Pementasan Citra Mahasiswa 2025: Jebat Durhaka',
    year: 2025,
    event_date: '14 Ogos 2025',
    category: 'Drama',
    event_name: 'Malam Gala Teater KPMBP 2025',
    organiser: 'Kelab Seni Kreatif & MPP KPMBP',
    director: 'Ahmad Daniel (Alumni DIT)',
    synopsis: 'Adaptasi moden konflik kesetiaan dan keadilan Hang Jebat yang diterjemahkan dalam suasana perdebatan kepimpinan anak muda abad ke-21.',
    achievement: 'Anugerah Persembahan Terbaik & Pengarah Harapan KPMBP 2025',
    participants_count: 14,
    cover_image: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
    ],
    published: true,
    created_at: '2025-08-16T10:00:00Z'
  },
  {
    id: 'arc-2024-01',
    title: 'Teater Pendek: Bayang Di Balik Tabir (2024)',
    year: 2024,
    event_date: '22 Ogos 2024',
    category: 'Competition',
    event_name: 'Pertandingan Teater Mahasiswa KPMBP 2024',
    organiser: 'Kelab Legasi KPMBP',
    director: 'Nurul Izzah (Alumni DIA)',
    synopsis: 'Kisah komedi kekecohan lima pelajar menguruskan prop dan pakaian tradisi beberapa minit sebelum persembahan rasmi bermula.',
    achievement: 'Juara Keseluruhan Pertandingan Teater KPMBP 2024',
    participants_count: 8,
    cover_image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80'
    ],
    published: true,
    created_at: '2024-08-25T10:00:00Z'
  },
  {
    id: 'arc-2023-01',
    title: 'Showcase Teater Muzikal: Destinasi Impian (2023)',
    year: 2023,
    event_date: '05 September 2023',
    category: 'Musical',
    event_name: 'Minggu Aspirasi Seni KPMBP 2023',
    organiser: 'Unit Ko-Kurikulum & Kebudayaan KPMBP',
    director: 'Farhan Hakim',
    synopsis: 'Persembahan gabungan nyanyian akustik dan monolog tentang perjuangan anak perantau menyesuaikan diri di bumi Bandar Penawar.',
    achievement: 'Anugerah Khas Juri Citra Seni KPMBP',
    participants_count: 18,
    cover_image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80'
    ],
    published: true,
    created_at: '2023-09-10T10:00:00Z'
  }
];

export const INITIAL_BTS: BehindTheScenesItem[] = [
  {
    id: 'bts-01',
    title: 'Sesi Rehearsal Suara & Nada Di Dewan Seminar',
    category: 'Rehearsal',
    description: 'Pelajar menjalani latihan lontaran vokal dan penyesuaian akustik dewan bersama bimbingan penasihat.',
    image_url: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=600&q=80',
    event_title: 'Persediaan Pertandingan Teater',
    year: 2026,
    credit: 'Krew Media KPMBP'
  },
  {
    id: 'bts-02',
    title: 'Kekecohan & Ketelitian Di Meja Makeup Pentas',
    category: 'Makeup',
    description: 'Sentuhan solekan watak tua dan kesan khas sebelum pelakon melangkah ke pentas.',
    image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    event_title: 'Gala Teater KPMBP',
    year: 2025,
    credit: 'Tim Solekan Produksi'
  },
  {
    id: 'bts-03',
    title: 'Pengurusan Prop Buatan Tangan Pelajar',
    category: 'Props',
    description: 'Kreativiti pelajar membina replika latar pentas menggunakan bahan kitar semula dan pencahayaan kreatif.',
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    event_title: 'Festival Seni KPMBP',
    year: 2025,
    credit: 'Kru Prop & Set'
  },
  {
    id: 'bts-04',
    title: 'Ujian Pencahayaan (Lighting Cue Check)',
    category: 'Stage Setup',
    description: 'Krew teknikal memastikan lampu sorot (spotlight) dan lampu latar bersedia mengikut tempo skrip.',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    event_title: 'Pementasan Citra Mahasiswa',
    year: 2025,
    credit: 'Teknikal Dewan KPMBP'
  }
];

export const INITIAL_TALENTS: TalentProfile[] = [
  {
    id: 'tal-01',
    public_name: 'Muhammad Amirul Hafiz',
    programme: 'Diploma in Information Technology (DIT)',
    class_name: 'DIT 4A',
    roles: ['Actor', 'Director'],
    bio: 'Aktif berteater sejak tahun 2024. Mempunyai kekuatan dalam watak dramatik dan perwatakan ekspresif.',
    involvement_history: [
      'Pelakon Utama — Pementasan Citra Mahasiswa 2025',
      'Pengarah Kumpulan Citra Warisan 2026'
    ],
    awards: ['Pelakon Harapan Terbaik KPMBP 2025'],
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    published: true,
    created_at: '2026-08-05T10:00:00Z'
  },
  {
    id: 'tal-02',
    public_name: 'Nur Aisyah Binti Zulkifli',
    programme: 'Diploma in Accounting (DIA)',
    class_name: 'DIA 2B',
    roles: ['Scriptwriter', 'Costume Designer'],
    bio: 'Penulis skrip muda yang menggemari naratif kehidupan kolej dan isu kekeluargaan dengan sentuhan emosi mendalam.',
    involvement_history: [
      'Penulis Skrip — Bayang Di Balik Tabir (2024)',
      'Ketua Rekaan Kostum — Sanggar Mahasiswa 2026'
    ],
    awards: ['Anugerah Skrip Paling Kreatif KPMBP 2024'],
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    published: true,
    created_at: '2026-08-07T11:00:00Z'
  },
  {
    id: 'tal-03',
    public_name: 'Danish Haiqal',
    programme: 'Diploma in Business Studies (DBS)',
    roles: ['Technical Crew', 'Stage Manager'],
    bio: 'Pakar koordinasi sistem audio, mik dan pencahayaan pentas yang memastikan kelancaran setiap babak.',
    involvement_history: [
      'Ketua Teknikal Dewan — Gala Teater 2025',
      'Stage Manager — Showcase Citra Warisan'
    ],
    awards: ['Kru Produksi Paling Berdisiplin 2025'],
    avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    published: true,
    created_at: '2026-08-09T14:00:00Z'
  }
];

export const INITIAL_CALENDAR: CalendarEvent[] = [
  {
    id: 'cal-01',
    title: 'Taklimat Peserta & Pengenalan Acara Teater 2026',
    type: 'Briefing' as any,
    date: '2026-08-14',
    time: '4:30 PM - 5:30 PM',
    venue: 'Bilik Seminar 2, KPMBP',
    description: 'Sesi penerangan peraturan pertandingan, had masa, dan bantuan teknikal yang disediakan oleh penganjur.',
    target_audience: 'Semua Ketua Kumpulan & Peserta Berdaftar'
  },
  {
    id: 'cal-02',
    title: 'Bengkel Lakonan Pentas & Latihan Vokal',
    type: 'Workshop',
    date: '2026-08-15',
    time: '2:30 PM - 5:00 PM',
    venue: 'Dewan Seminar KPMBP',
    description: 'Bengkel praktikal bersama Sir Penasihat mengenai projeksi vokal, gerak pentas dan cara mengatasi rasa gugup.',
    target_audience: 'Terbuka kepada semua ahli komuniti teater'
  },
  {
    id: 'cal-03',
    title: 'Tarikh Tutup Pendaftaran Kumpulan',
    type: 'Competition',
    date: '2026-08-17',
    time: '10:00 PM',
    venue: 'Portal Teater KPMBP Hub',
    description: 'Tarikh akhir penghantaran senarai 5 orang ahli kumpulan dan tajuk skrip ringkas.',
    target_audience: 'Semua Kumpulan Bertanding'
  },
  {
    id: 'cal-04',
    title: 'Rehearsal Penuh (Dry Run & Technical Check)',
    type: 'Rehearsal',
    date: '2026-08-19',
    time: '8:00 PM - 10:30 PM',
    venue: 'Pentas Dewan Seminar KPMBP',
    description: 'Sesi giliran ujian pencahayaan, mikrofon, dan susunan prop di atas pentas sebenar.',
    target_audience: 'Semua Kumpulan yang layak'
  },
  {
    id: 'cal-05',
    title: '🎭 Malam Pertandingan Teater KPMBP 2026',
    type: 'Competition',
    date: '2026-08-20',
    time: '8:00 PM - 10:00 PM',
    venue: 'Dewan Seminar KPMBP',
    description: 'Malam pementasan akhir dan penyampaian hadiah pertandingan tahunan teater KPMBP.',
    target_audience: 'Warga KPMBP, Pensyarah & Pelajar'
  }
];
