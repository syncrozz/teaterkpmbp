export const SUPABASE_SQL_SCHEMA = `-- =========================================================
-- TEATER KPMBP HUB — SUPABASE POSTGRESQL SCHEMA WITH RLS
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    student_id TEXT NOT NULL UNIQUE,
    programme TEXT NOT NULL,
    class_name TEXT NOT NULL,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    experience_level TEXT NOT NULL,
    motivation TEXT,
    group_status TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    consent BOOLEAN NOT NULL DEFAULT true,
    assigned_team_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. STUDENT SKILLS / INTERESTS
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. THEATRE EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    day TEXT,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    venue TEXT NOT NULL,
    group_size INTEGER NOT NULL DEFAULT 5,
    registration_deadline TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    prizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    organizer TEXT NOT NULL,
    rules JSONB DEFAULT '[]'::jsonb,
    banner_url TEXT,
    team_formation_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TEAMS
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    captain_id UUID,
    captain_name TEXT,
    play_title TEXT,
    synopsis TEXT,
    status TEXT NOT NULL DEFAULT 'FORMING',
    max_members INTEGER NOT NULL DEFAULT 5,
    checklist JSONB NOT NULL DEFAULT '{"has_five_members":false,"has_captain":false,"has_title":false,"has_storyline":false,"has_character_split":false,"has_script":false,"has_props":false,"has_costume":false,"has_technical_req":false,"rehearsal_started":false}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    role TEXT NOT NULL,
    is_captain BOOLEAN NOT NULL DEFAULT false,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TEAM PREFERENCES (Poll-based exploration)
CREATE TABLE IF NOT EXISTS public.team_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    preferred_team_group TEXT NOT NULL,
    preferred_role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'EXPLORING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    priority TEXT NOT NULL DEFAULT 'Normal',
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    published BOOLEAN NOT NULL DEFAULT true,
    author TEXT NOT NULL DEFAULT 'Penganjur Teater KPMBP',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. OPPORTUNITIES (External / KPMBP Competitions)
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organiser TEXT NOT NULL,
    description TEXT NOT NULL,
    event_date TEXT NOT NULL,
    deadline TEXT NOT NULL,
    venue TEXT NOT NULL,
    prize TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    official_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN',
    category TEXT NOT NULL DEFAULT 'Teater & Drama',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SKILLS ACADEMY
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    short_description TEXT NOT NULL,
    content TEXT NOT NULL,
    key_takeaways JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    video_url TEXT,
    read_time_minutes INTEGER DEFAULT 5,
    published BOOLEAN NOT NULL DEFAULT true,
    author TEXT NOT NULL DEFAULT 'Sir Advisor Teater',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ARCHIVE & MEDIA
CREATE TABLE IF NOT EXISTS public.archive (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    event_date TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Showcase',
    event_name TEXT NOT NULL,
    organiser TEXT NOT NULL,
    director TEXT NOT NULL,
    synopsis TEXT NOT NULL,
    achievement TEXT NOT NULL,
    participants_count INTEGER NOT NULL DEFAULT 10,
    cover_image TEXT NOT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. TALENT PROFILES (Publicly approved student recognition)
CREATE TABLE IF NOT EXISTS public.talent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    public_name TEXT NOT NULL,
    programme TEXT NOT NULL,
    class_name TEXT,
    roles JSONB NOT NULL DEFAULT '[]'::jsonb,
    bio TEXT NOT NULL,
    involvement_history JSONB DEFAULT '[]'::jsonb,
    awards JSONB DEFAULT '[]'::jsonb,
    avatar_url TEXT,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SIR'S CORNER NOTES
CREATE TABLE IF NOT EXISTS public.sir_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    key_points JSONB DEFAULT '[]'::jsonb,
    author_name TEXT NOT NULL DEFAULT 'Sir Advisor',
    author_title TEXT NOT NULL DEFAULT 'Penasihat Teater KPMBP',
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sir_notes ENABLE ROW LEVEL SECURITY;

-- Allow public insertion for student registration
CREATE POLICY "Allow public insert to students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to student_skills" ON public.student_skills FOR INSERT WITH CHECK (true);

-- Allow public read of published content
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (published = true);
CREATE POLICY "Public read opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (published = true);
CREATE POLICY "Public read archive" ON public.archive FOR SELECT USING (published = true);
CREATE POLICY "Public read talent" ON public.talent_profiles FOR SELECT USING (published = true);
CREATE POLICY "Public read sir_notes" ON public.sir_notes FOR SELECT USING (published = true);
CREATE POLICY "Public read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public read team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public insert team preferences" ON public.team_preferences FOR INSERT WITH CHECK (true);
`;

export const SUPABASE_POSTGRES_SCHEMA = SUPABASE_SQL_SCHEMA;
