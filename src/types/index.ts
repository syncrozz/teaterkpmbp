export type StudentExperience = 'Tiada pengalaman' | 'Pernah menyertai' | 'Sedikit pengalaman' | 'Berpengalaman';

export type StudentStatus = 'PENDING' | 'CONTACTED' | 'INVITED' | 'JOINED' | 'REJECTED' | 'ARCHIVED' | 'PENDING_REVIEW' | 'JOINED_COMMUNITY' | 'NOT_JOINED';
export type RegistrationStatus = StudentStatus;

export type GroupStatus = 'Sudah mempunyai kumpulan' | 'Belum cukup ahli' | 'Belum mempunyai kumpulan' | 'Saya mahu mencari kumpulan';

export interface Student {
  id: string;
  full_name: string;
  nickname?: string;
  student_id: string;
  ic_number?: string;
  programme: string;
  class_name: string;
  semester: number;
  phone: string;
  email: string;
  interests: string[];
  experience_level: StudentExperience;
  motivation: string;
  group_status: GroupStatus;
  status: StudentStatus;
  consent: boolean;
  assigned_team_id?: string;
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export type EventStatus = 'ACTIVE' | 'UPCOMING' | 'CLOSED' | 'REGISTRATION OPEN';

export interface EventPrize {
  rank: string;
  amount: string;
  description?: string;
}

export interface TheatreEvent {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  date: string;
  day?: string;
  start_time: string;
  end_time: string;
  venue: string;
  group_size: number;
  registration_deadline: string;
  status: EventStatus;
  prizes: EventPrize[];
  organizer: string;
  rules?: string[];
  banner_url?: string;
  theme_color?: 'amber' | 'ruby' | 'emerald' | 'blue' | 'purple';
  highlight_badge?: string;
  deadline_label?: string;
  team_formation_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type TeamStatus = 'FORMING' | 'READY' | 'LOCKED' | 'COMPLETED';

export interface TeamMember {
  id: string;
  team_id: string;
  student_id: string;
  student_name: string;
  student_nickname?: string;
  student_phone?: string;
  role: string;
  is_captain?: boolean;
  joined_at: string;
}

export interface TeamReadinessChecklist {
  has_five_members: boolean;
  has_captain: boolean;
  has_title: boolean;
  has_storyline: boolean;
  has_character_split: boolean;
  has_script: boolean;
  has_props: boolean;
  has_costume: boolean;
  has_technical_req: boolean;
  rehearsal_started: boolean;
}

export interface Team {
  id: string;
  event_id: string;
  name: string;
  code: string;
  captain_id?: string;
  captain_name?: string;
  play_title?: string;
  synopsis?: string;
  status: TeamStatus;
  max_members: number;
  checklist: TeamReadinessChecklist;
  members: TeamMember[];
  notes?: string;
  created_at: string;
}

export interface TeamPreference {
  id: string;
  event_id: string;
  student_id: string;
  student_name: string;
  preferred_team_group: string; // e.g. "Group A", "Group B"
  preferred_role: string;
  status: 'EXPLORING' | 'CONFIRMED';
  created_at: string;
  updated_at: string;
}

export type AnnouncementCategory = 'General' | 'Competition' | 'Training' | 'Team' | 'Important';
export type AnnouncementPriority = 'High' | 'Normal';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  event_id?: string;
  published: boolean;
  author: string;
  created_at: string;
}

export type OpportunityStatus = 'OPEN' | 'UPCOMING' | 'CLOSED';

export interface Opportunity {
  id: string;
  title: string;
  organiser: string;
  description: string;
  event_date: string;
  deadline: string;
  venue: string;
  prize: string;
  eligibility: string;
  official_url: string;
  status: OpportunityStatus;
  category: string;
  created_at: string;
}

export type SkillCategory = 'ACTING' | 'SCRIPT' | 'STAGE' | 'PRODUCTION';
export type SkillDifficulty = 'Asas' | 'Pertengahan' | 'Lanjutan';

export interface SkillLesson {
  id: string;
  title: string;
  category: SkillCategory;
  difficulty: SkillDifficulty;
  short_description: string;
  content: string;
  key_takeaways: string[];
  image_url?: string;
  video_url?: string;
  read_time_minutes: number;
  published: boolean;
  author: string;
  created_at: string;
}

export type SirCategory = 'Jalan Cerita' | 'Lakonan' | 'Pengurusan' | 'Tips & Tricks';

export interface SirNote {
  id: string;
  title: string;
  category: SirCategory;
  summary: string;
  content: string;
  key_points: string[];
  author_name: string;
  author_title: string;
  published: boolean;
  created_at: string;
}

export interface MentorTip {
  id: string;
  tag: string;
  quote: string;
  author: string;
  subtext: string;
  created_at: string;
}

export interface ArchiveRecord {
  id: string;
  title: string;
  year: number;
  event_date: string;
  category: 'Festival' | 'Competition' | 'Showcase' | 'Drama' | 'Musical';
  event_name: string;
  organiser: string;
  director: string;
  synopsis: string;
  achievement: string;
  participants_count: number;
  cover_image: string;
  gallery_images: string[];
  video_url?: string;
  published: boolean;
  created_at: string;
}

export interface BehindTheScenesItem {
  id: string;
  title: string;
  category: 'Rehearsal' | 'Backstage' | 'Makeup' | 'Props' | 'Costume' | 'Stage Setup' | 'Teamwork';
  description: string;
  image_url: string;
  event_title: string;
  year: number;
  credit?: string;
}

export interface TalentProfile {
  id: string;
  student_id?: string;
  public_name: string;
  programme: string;
  class_name?: string;
  roles: string[]; // e.g. ["Actor", "Scriptwriter", "Technical Crew"]
  bio: string;
  involvement_history: string[];
  awards: string[];
  avatar_url?: string;
  published: boolean;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'Competition' | 'Workshop' | 'Audition' | 'Rehearsal' | 'Showcase' | 'Meeting' | 'Training';
  date: string; // YYYY-MM-DD
  time: string;
  venue: string;
  description: string;
  target_audience: string;
}
