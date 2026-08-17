import {
  Student,
  TheatreEvent,
  Team,
  TeamStatus,
  Announcement,
  Opportunity,
  SkillLesson,
  SirNote,
  ArchiveRecord,
  BehindTheScenesItem,
  TalentProfile,
  CalendarEvent,
  TeamPreference,
  StudentStatus
} from '../types';
import {
  INITIAL_EVENTS,
  INITIAL_STUDENTS,
  INITIAL_TEAMS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_OPPORTUNITIES,
  INITIAL_SKILLS,
  INITIAL_SIR_NOTES,
  INITIAL_ARCHIVES,
  INITIAL_BTS,
  INITIAL_TALENTS,
  INITIAL_CALENDAR
} from '../data/initialData';
import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'teater_kpmbp_hub_v1';

export interface AppStore {
  students: Student[];
  events: TheatreEvent[];
  teams: Team[];
  team_preferences: TeamPreference[];
  announcements: Announcement[];
  opportunities: Opportunity[];
  skills: SkillLesson[];
  sir_notes: SirNote[];
  archives: ArchiveRecord[];
  bts: BehindTheScenesItem[];
  talents: TalentProfile[];
  calendar: CalendarEvent[];
}

function getInitialStore(): AppStore {
  return {
    students: INITIAL_STUDENTS,
    events: INITIAL_EVENTS,
    teams: INITIAL_TEAMS,
    team_preferences: [
      {
        id: 'pref-01',
        event_id: 'event-kpmbp-2026',
        student_id: 'std-002',
        student_name: 'Nur Aisyah Binti Zulkifli',
        preferred_team_group: 'Group B',
        preferred_role: 'Penulisan Skrip',
        status: 'CONFIRMED',
        created_at: '2026-08-06T10:00:00Z',
        updated_at: '2026-08-08T15:00:00Z'
      },
      {
        id: 'pref-02',
        event_id: 'event-kpmbp-2026',
        student_id: 'std-003',
        student_name: 'Danish Haiqal Bin Roslan',
        preferred_team_group: 'Group B',
        preferred_role: 'Technical Crew / Sound',
        status: 'EXPLORING',
        created_at: '2026-08-12T17:00:00Z',
        updated_at: '2026-08-12T17:00:00Z'
      }
    ],
    announcements: INITIAL_ANNOUNCEMENTS,
    opportunities: INITIAL_OPPORTUNITIES,
    skills: INITIAL_SKILLS,
    sir_notes: INITIAL_SIR_NOTES,
    archives: INITIAL_ARCHIVES,
    bts: INITIAL_BTS,
    talents: INITIAL_TALENTS,
    calendar: INITIAL_CALENDAR
  };
}

function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue;
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      clean[key] = sanitizeForFirestore(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

type ListenerCallback = (store: AppStore) => void;

class StorageManager {
  private store: AppStore;
  private listeners: Set<ListenerCallback> = new Set();
  private unsubscribes: Unsubscribe[] = [];
  public isFirebaseConnected: boolean = false;
  public lastSyncedAt: Date | null = null;
  private seededCollections: Set<string> = new Set();

  constructor() {
    this.store = this.loadLocal();
    this.initFirestoreSync();
  }

  private loadLocal(): AppStore {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as AppStore;
        if (!parsed.events || parsed.events.length < 2) {
          parsed.events = INITIAL_EVENTS;
          this.saveLocal(parsed, false);
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
    const initial = getInitialStore();
    this.saveLocal(initial, false);
    return initial;
  }

  private saveLocal(data: AppStore, notify: boolean = true): void {
    this.store = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
    if (notify) {
      this.notifyListeners();
    }
  }

  public subscribe(callback: ListenerCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.store);
      } catch (err) {
        console.error('Error in storage listener:', err);
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('teater_storage_updated', { detail: this.store }));
    }
  }

  // --- FIRESTORE REAL-TIME SYNCHRONIZATION ---
  private initFirestoreSync(): void {
    try {
      // 1. Students Sync
      this.listenCollection<Student>('students', (remoteItems) => {
        this.store.students = remoteItems;
        this.saveLocal({ ...this.store, students: remoteItems });
      }, INITIAL_STUDENTS);

      // 2. Events Sync
      this.listenCollection<TheatreEvent>('events', (remoteItems) => {
        this.store.events = remoteItems;
        this.saveLocal({ ...this.store, events: remoteItems });
      }, INITIAL_EVENTS);

      // 3. Teams Sync
      this.listenCollection<Team>('teams', (remoteItems) => {
        this.store.teams = remoteItems;
        this.saveLocal({ ...this.store, teams: remoteItems });
      }, INITIAL_TEAMS);

      // 4. Team Preferences Sync
      this.listenCollection<TeamPreference>('team_preferences', (remoteItems) => {
        this.store.team_preferences = remoteItems;
        this.saveLocal({ ...this.store, team_preferences: remoteItems });
      }, getInitialStore().team_preferences);

      // 5. Announcements Sync
      this.listenCollection<Announcement>('announcements', (remoteItems) => {
        this.store.announcements = remoteItems;
        this.saveLocal({ ...this.store, announcements: remoteItems });
      }, INITIAL_ANNOUNCEMENTS);

      // 6. Opportunities Sync
      this.listenCollection<Opportunity>('opportunities', (remoteItems) => {
        this.store.opportunities = remoteItems;
        this.saveLocal({ ...this.store, opportunities: remoteItems });
      }, INITIAL_OPPORTUNITIES);

      // 7. Skills Academy Sync
      this.listenCollection<SkillLesson>('skills', (remoteItems) => {
        this.store.skills = remoteItems;
        this.saveLocal({ ...this.store, skills: remoteItems });
      }, INITIAL_SKILLS);

      // 8. Sir's Notes Sync
      this.listenCollection<SirNote>('sir_notes', (remoteItems) => {
        this.store.sir_notes = remoteItems;
        this.saveLocal({ ...this.store, sir_notes: remoteItems });
      }, INITIAL_SIR_NOTES);

      // 9. Archives Sync
      this.listenCollection<ArchiveRecord>('archives', (remoteItems) => {
        this.store.archives = remoteItems;
        this.saveLocal({ ...this.store, archives: remoteItems });
      }, INITIAL_ARCHIVES);

      // 10. BTS Sync
      this.listenCollection<BehindTheScenesItem>('bts', (remoteItems) => {
        this.store.bts = remoteItems;
        this.saveLocal({ ...this.store, bts: remoteItems });
      }, INITIAL_BTS);

      // 11. Talents Sync
      this.listenCollection<TalentProfile>('talents', (remoteItems) => {
        this.store.talents = remoteItems;
        this.saveLocal({ ...this.store, talents: remoteItems });
      }, INITIAL_TALENTS);

      // 12. Calendar Sync
      this.listenCollection<CalendarEvent>('calendar', (remoteItems) => {
        this.store.calendar = remoteItems;
        this.saveLocal({ ...this.store, calendar: remoteItems });
      }, INITIAL_CALENDAR);

    } catch (e) {
      console.warn('Firestore initialization notice:', e);
    }
  }

  private listenCollection<T extends { id: string }>(
    collectionName: string,
    onUpdate: (items: T[]) => void,
    defaultSeed: T[]
  ): void {
    const colRef = collection(db, collectionName);

    const unsub = onSnapshot(
      colRef,
      (snapshot) => {
        this.isFirebaseConnected = true;
        this.lastSyncedAt = new Date();

        if (snapshot.empty && !this.seededCollections.has(collectionName)) {
          // Auto-seed collection in Firestore on initial first run
          this.seededCollections.add(collectionName);
          this.seedCollection(collectionName, defaultSeed);
          return;
        }

        if (!snapshot.empty) {
          const items: T[] = [];
          snapshot.forEach((docSnap) => {
            items.push(docSnap.data() as T);
          });
          onUpdate(items);
        }
      },
      (error) => {
        console.warn(`Firestore snapshot notice for [${collectionName}]:`, error.message);
      }
    );

    this.unsubscribes.push(unsub);
  }

  private async seedCollection<T extends { id: string }>(collectionName: string, items: T[]) {
    try {
      const batch = writeBatch(db);
      for (const item of items) {
        const itemDoc = doc(db, collectionName, item.id);
        batch.set(itemDoc, sanitizeForFirestore(item), { merge: true });
      }
      await batch.commit();
    } catch (err) {
      console.warn(`Seed batch notice for ${collectionName}:`, err);
    }
  }

  // Generic Firestore write helper
  private async syncDocToFirestore(collectionName: string, docId: string, data: Record<string, any>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, sanitizeForFirestore(data), { merge: true });
      this.lastSyncedAt = new Date();
    } catch (e) {
      console.warn(`Firestore sync doc error [${collectionName}/${docId}]:`, e);
    }
  }

  // Generic Firestore delete helper
  private async syncDeleteFromFirestore(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      this.lastSyncedAt = new Date();
    } catch (e) {
      console.warn(`Firestore delete doc error [${collectionName}/${docId}]:`, e);
    }
  }

  // --- STUDENTS ---
  public getStudents(): Student[] {
    return [...this.store.students];
  }

  public registerStudent(studentData: Omit<Student, 'id' | 'status' | 'created_at' | 'updated_at'>): {
    success: boolean;
    student?: Student;
    error?: string;
  } {
    const cleanStudentId = studentData.student_id.trim().toUpperCase();

    // Duplicate check by student_id
    const existing = this.store.students.find(
      s => s.student_id.trim().toUpperCase() === cleanStudentId
    );

    if (existing) {
      return {
        success: false,
        error: `Anda telah mendaftarkan minat sebelum ini dengan ID Pelajar ${cleanStudentId}. Sila hubungi pihak penganjur untuk sebarang perubahan maklumat.`
      };
    }

    const newStudent: Student = {
      ...studentData,
      id: 'std-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      student_id: cleanStudentId,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updatedStudents = [newStudent, ...this.store.students];
    this.saveLocal({ ...this.store, students: updatedStudents });

    // Sync to Cloud Firestore across devices
    this.syncDocToFirestore('students', newStudent.id, newStudent);

    return { success: true, student: newStudent };
  }

  public updateStudentStatus(
    studentId: string,
    status: StudentStatus,
    notes?: string,
    assignedTeamId?: string
  ): boolean {
    let updatedStudent: Student | null = null;
    const students = this.store.students.map(s => {
      if (s.id === studentId) {
        updatedStudent = {
          ...s,
          status,
          notes: notes !== undefined ? notes : s.notes,
          assigned_team_id: assignedTeamId !== undefined ? assignedTeamId : s.assigned_team_id,
          updated_at: new Date().toISOString()
        };
        return updatedStudent;
      }
      return s;
    });

    this.saveLocal({ ...this.store, students });

    if (updatedStudent) {
      this.syncDocToFirestore('students', studentId, updatedStudent);
    }
    return true;
  }

  public deleteStudent(studentId: string): boolean {
    const students = this.store.students.filter(s => s.id !== studentId);
    this.saveLocal({ ...this.store, students });
    this.syncDeleteFromFirestore('students', studentId);
    return true;
  }

  // --- EVENTS ---
  public getEvents(): TheatreEvent[] {
    return [...this.store.events];
  }

  public getEvent(eventId: string): TheatreEvent | undefined {
    return this.store.events.find(e => e.id === eventId);
  }

  public getActiveEvent(): TheatreEvent | undefined {
    return this.store.events.find(e => e.status === 'ACTIVE' || e.status === 'REGISTRATION OPEN') || this.store.events[0];
  }

  public createEvent(eventData: Omit<TheatreEvent, 'id' | 'created_at' | 'updated_at'>): TheatreEvent {
    const newEvent: TheatreEvent = {
      ...eventData,
      id: 'event-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const events = [newEvent, ...this.store.events];
    this.saveLocal({ ...this.store, events });
    this.syncDocToFirestore('events', newEvent.id, newEvent);
    return newEvent;
  }

  public updateEvent(eventId: string, updates: Partial<TheatreEvent>): boolean {
    let targetEvent: TheatreEvent | null = null;
    const events = this.store.events.map(e => {
      if (e.id === eventId) {
        targetEvent = { ...e, ...updates, updated_at: new Date().toISOString() };
        return targetEvent;
      }
      return e;
    });
    this.saveLocal({ ...this.store, events });
    if (targetEvent) {
      this.syncDocToFirestore('events', eventId, targetEvent);
    }
    return true;
  }

  public deleteEvent(eventId: string): boolean {
    if (this.store.events.length <= 1) {
      return false; // Prevent deleting the last event
    }
    const events = this.store.events.filter(e => e.id !== eventId);
    this.saveLocal({ ...this.store, events });
    this.syncDeleteFromFirestore('events', eventId);
    return true;
  }

  // --- TEAMS ---
  public getTeams(eventId?: string): Team[] {
    if (eventId) {
      return this.store.teams.filter(t => t.event_id === eventId);
    }
    return [...this.store.teams];
  }

  public createTeam(teamData: Omit<Team, 'id' | 'created_at'>): Team {
    const newTeam: Team = {
      ...teamData,
      id: 'team-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const teams = [...this.store.teams, newTeam];
    this.saveLocal({ ...this.store, teams });
    this.syncDocToFirestore('teams', newTeam.id, newTeam);
    return newTeam;
  }

  public updateTeam(teamId: string, updates: Partial<Team>): boolean {
    let targetTeam: Team | null = null;
    const teams = this.store.teams.map(t => {
      if (t.id === teamId) {
        targetTeam = { ...t, ...updates };
        return targetTeam;
      }
      return t;
    });
    this.saveLocal({ ...this.store, teams });
    if (targetTeam) {
      this.syncDocToFirestore('teams', teamId, targetTeam);
    }
    return true;
  }

  public updateTeamChecklist(teamId: string, checklist: Team['checklist']): boolean {
    let targetTeam: Team | null = null;
    const teams: Team[] = this.store.teams.map(t => {
      if (t.id === teamId) {
        const hasAll = Object.values(checklist).every(v => v === true);
        const newStatus: TeamStatus = hasAll ? 'READY' : t.status === 'READY' ? 'FORMING' : t.status;
        targetTeam = { ...t, checklist, status: newStatus };
        return targetTeam;
      }
      return t;
    });
    this.saveLocal({ ...this.store, teams });
    if (targetTeam) {
      this.syncDocToFirestore('teams', teamId, targetTeam);
    }
    return true;
  }

  public updateTeamStatus(teamId: string, status: TeamStatus): boolean {
    let targetTeam: Team | null = null;
    const teams: Team[] = this.store.teams.map(t => {
      if (t.id === teamId) {
        targetTeam = { ...t, status };
        return targetTeam;
      }
      return t;
    });
    this.saveLocal({ ...this.store, teams });
    if (targetTeam) {
      this.syncDocToFirestore('teams', teamId, targetTeam);
    }
    return true;
  }

  public addTeamMember(teamId: string, member: Omit<Team['members'][0], 'id' | 'team_id' | 'joined_at'>): boolean {
    let targetTeam: Team | null = null;
    const teams = this.store.teams.map(t => {
      if (t.id === teamId) {
        if (t.members.length >= t.max_members) {
          return t;
        }
        const newMember = {
          ...member,
          id: 'tm-' + Date.now(),
          team_id: teamId,
          joined_at: new Date().toISOString().split('T')[0]
        };
        const updatedMembers = [...t.members, newMember];
        const hasFive = updatedMembers.length >= 5;
        const updatedChecklist = {
          ...t.checklist,
          has_five_members: hasFive,
          has_captain: updatedMembers.some(m => m.is_captain) || Boolean(t.captain_name)
        };
        targetTeam = {
          ...t,
          members: updatedMembers,
          checklist: updatedChecklist
        };
        return targetTeam;
      }
      return t;
    });
    this.saveLocal({ ...this.store, teams });
    if (targetTeam) {
      this.syncDocToFirestore('teams', teamId, targetTeam);
    }
    return true;
  }

  public removeTeamMember(teamId: string, memberId: string): boolean {
    let targetTeam: Team | null = null;
    const teams = this.store.teams.map(t => {
      if (t.id === teamId) {
        const updatedMembers = t.members.filter(m => m.id !== memberId);
        const updatedChecklist = {
          ...t.checklist,
          has_five_members: updatedMembers.length >= 5,
          has_captain: updatedMembers.some(m => m.is_captain) || Boolean(t.captain_name)
        };
        targetTeam = {
          ...t,
          members: updatedMembers,
          checklist: updatedChecklist
        };
        return targetTeam;
      }
      return t;
    });
    this.saveLocal({ ...this.store, teams });
    if (targetTeam) {
      this.syncDocToFirestore('teams', teamId, targetTeam);
    }
    return true;
  }

  // --- TEAM PREFERENCES (Poll Exploration) ---
  public getTeamPreferences(eventId?: string): TeamPreference[] {
    if (eventId) {
      return this.store.team_preferences.filter(p => p.event_id === eventId);
    }
    return [...this.store.team_preferences];
  }

  public saveTeamPreference(pref: Omit<TeamPreference, 'id' | 'created_at' | 'updated_at'>): TeamPreference {
    const existingIndex = this.store.team_preferences.findIndex(
      p => p.student_id === pref.student_id && p.event_id === pref.event_id
    );

    let updatedPreferences = [...this.store.team_preferences];
    let result: TeamPreference;

    if (existingIndex >= 0) {
      result = {
        ...updatedPreferences[existingIndex],
        preferred_team_group: pref.preferred_team_group,
        preferred_role: pref.preferred_role,
        status: pref.status,
        updated_at: new Date().toISOString()
      };
      updatedPreferences[existingIndex] = result;
    } else {
      result = {
        ...pref,
        id: 'pref-' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      updatedPreferences.push(result);
    }

    this.saveLocal({ ...this.store, team_preferences: updatedPreferences });
    this.syncDocToFirestore('team_preferences', result.id, result);
    return result;
  }

  // --- ANNOUNCEMENTS ---
  public getAnnouncements(): Announcement[] {
    return [...this.store.announcements];
  }

  public createAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at'>): Announcement {
    const newAnn: Announcement = {
      ...announcement,
      id: 'ann-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const announcements = [newAnn, ...this.store.announcements];
    this.saveLocal({ ...this.store, announcements });
    this.syncDocToFirestore('announcements', newAnn.id, newAnn);
    return newAnn;
  }

  public addAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at'>): Announcement {
    return this.createAnnouncement(announcement);
  }

  public deleteAnnouncement(id: string): boolean {
    const announcements = this.store.announcements.filter(a => a.id !== id);
    this.saveLocal({ ...this.store, announcements });
    this.syncDeleteFromFirestore('announcements', id);
    return true;
  }

  // --- OPPORTUNITIES ---
  public getOpportunities(): Opportunity[] {
    return [...this.store.opportunities];
  }

  public createOpportunity(opp: Omit<Opportunity, 'id' | 'created_at'>): Opportunity {
    const newOpp: Opportunity = {
      ...opp,
      id: 'opp-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const opportunities = [newOpp, ...this.store.opportunities];
    this.saveLocal({ ...this.store, opportunities });
    this.syncDocToFirestore('opportunities', newOpp.id, newOpp);
    return newOpp;
  }

  public deleteOpportunity(id: string): boolean {
    const opportunities = this.store.opportunities.filter(o => o.id !== id);
    this.saveLocal({ ...this.store, opportunities });
    this.syncDeleteFromFirestore('opportunities', id);
    return true;
  }

  // --- SKILLS ACADEMY ---
  public getSkills(): SkillLesson[] {
    return [...this.store.skills];
  }

  public createSkill(skill: Omit<SkillLesson, 'id' | 'created_at'>): SkillLesson {
    const newSkill: SkillLesson = {
      ...skill,
      id: 'skl-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const skills = [newSkill, ...this.store.skills];
    this.saveLocal({ ...this.store, skills });
    this.syncDocToFirestore('skills', newSkill.id, newSkill);
    return newSkill;
  }

  public deleteSkill(id: string): boolean {
    const skills = this.store.skills.filter(s => s.id !== id);
    this.saveLocal({ ...this.store, skills });
    this.syncDeleteFromFirestore('skills', id);
    return true;
  }

  // --- SIR'S NOTES ---
  public getSirNotes(): SirNote[] {
    return [...this.store.sir_notes];
  }

  public createSirNote(note: Omit<SirNote, 'id' | 'created_at'>): SirNote {
    const newNote: SirNote = {
      ...note,
      id: 'sir-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const sir_notes = [newNote, ...this.store.sir_notes];
    this.saveLocal({ ...this.store, sir_notes });
    this.syncDocToFirestore('sir_notes', newNote.id, newNote);
    return newNote;
  }

  public addSirNote(note: Omit<SirNote, 'id' | 'created_at'>): SirNote {
    return this.createSirNote(note);
  }

  public deleteSirNote(id: string): boolean {
    const sir_notes = this.store.sir_notes.filter(s => s.id !== id);
    this.saveLocal({ ...this.store, sir_notes });
    this.syncDeleteFromFirestore('sir_notes', id);
    return true;
  }

  // --- ARCHIVE & BTS ---
  public getArchives(): ArchiveRecord[] {
    return [...this.store.archives];
  }

  public createArchive(record: Omit<ArchiveRecord, 'id' | 'created_at'>): ArchiveRecord {
    const newArchive: ArchiveRecord = {
      ...record,
      id: 'arc-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const archives = [newArchive, ...this.store.archives];
    this.saveLocal({ ...this.store, archives });
    this.syncDocToFirestore('archives', newArchive.id, newArchive);
    return newArchive;
  }

  public deleteArchive(id: string): boolean {
    const archives = this.store.archives.filter(a => a.id !== id);
    this.saveLocal({ ...this.store, archives });
    this.syncDeleteFromFirestore('archives', id);
    return true;
  }

  public getBehindTheScenes(): BehindTheScenesItem[] {
    return [...this.store.bts];
  }

  // --- TALENTS ---
  public getTalents(): TalentProfile[] {
    return [...this.store.talents];
  }

  public createTalent(talent: Omit<TalentProfile, 'id' | 'created_at'>): TalentProfile {
    const newTalent: TalentProfile = {
      ...talent,
      id: 'tal-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const talents = [newTalent, ...this.store.talents];
    this.saveLocal({ ...this.store, talents });
    this.syncDocToFirestore('talents', newTalent.id, newTalent);
    return newTalent;
  }

  public updateTalent(talentId: string, updates: Partial<TalentProfile>): boolean {
    let targetTalent: TalentProfile | null = null;
    const talents = this.store.talents.map(t => {
      if (t.id === talentId) {
        targetTalent = { ...t, ...updates };
        return targetTalent;
      }
      return t;
    });
    this.saveLocal({ ...this.store, talents });
    if (targetTalent) {
      this.syncDocToFirestore('talents', talentId, targetTalent);
    }
    return true;
  }

  // --- CALENDAR ---
  public getCalendarEvents(): CalendarEvent[] {
    return [...this.store.calendar];
  }

  public addCalendarEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const newCal: CalendarEvent = {
      ...event,
      id: 'cal-' + Date.now()
    };
    const calendar = [...this.store.calendar, newCal];
    this.saveLocal({ ...this.store, calendar });
    this.syncDocToFirestore('calendar', newCal.id, newCal);
    return newCal;
  }

  // --- EXPORT CSV ---
  public exportStudentsToCSV(): string {
    const headers = [
      'Nama Penuh',
      'ID Pelajar',
      'Program',
      'Kelas',
      'Semester',
      'No. Telefon',
      'Email',
      'Minat Teater',
      'Tahap Pengalaman',
      'Status Kumpulan',
      'Status Pendaftaran',
      'Tarikh Daftar',
      'Nota Penganjur'
    ];

    const rows = this.store.students.map(s => [
      `"${s.full_name.replace(/"/g, '""')}"`,
      `"${s.student_id}"`,
      `"${s.programme}"`,
      `"${s.class_name}"`,
      s.semester,
      `"${s.phone}"`,
      `"${s.email}"`,
      `"${s.interests.join(', ')}"`,
      `"${s.experience_level}"`,
      `"${s.group_status}"`,
      `"${s.status}"`,
      `"${new Date(s.created_at).toLocaleDateString('ms-MY')}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // Force Push All Local Data to Firestore (Initial Sync / Repair)
  public async pushAllToFirestore(): Promise<{ success: boolean; message: string }> {
    try {
      await this.seedCollection('students', this.store.students);
      await this.seedCollection('events', this.store.events);
      await this.seedCollection('teams', this.store.teams);
      await this.seedCollection('team_preferences', this.store.team_preferences);
      await this.seedCollection('announcements', this.store.announcements);
      await this.seedCollection('opportunities', this.store.opportunities);
      await this.seedCollection('skills', this.store.skills);
      await this.seedCollection('sir_notes', this.store.sir_notes);
      await this.seedCollection('archives', this.store.archives);
      await this.seedCollection('bts', this.store.bts);
      await this.seedCollection('talents', this.store.talents);
      await this.seedCollection('calendar', this.store.calendar);
      this.lastSyncedAt = new Date();
      return { success: true, message: 'Semua data berjaya disegerakkan ke Firebase Cloud Firestore!' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Ralat semasa penyegerakan Firebase.' };
    }
  }

  // Reset to default seed
  public resetToDefault(): void {
    const initial = getInitialStore();
    this.saveLocal(initial);
    this.pushAllToFirestore();
  }
}

export const storage = new StorageManager();

/**
 * Custom React hook that subscribes to real-time storage changes from Firestore
 */
export function useLiveStorage(): AppStore {
  const [store, setStore] = useState<AppStore>(() => ({
    students: storage.getStudents(),
    events: storage.getEvents(),
    teams: storage.getTeams(),
    team_preferences: storage.getTeamPreferences(),
    announcements: storage.getAnnouncements(),
    opportunities: storage.getOpportunities(),
    skills: storage.getSkills(),
    sir_notes: storage.getSirNotes(),
    archives: storage.getArchives(),
    bts: storage.getBehindTheScenes(),
    talents: storage.getTalents(),
    calendar: storage.getCalendarEvents()
  }));

  useEffect(() => {
    const unsub = storage.subscribe((updatedStore) => {
      setStore({ ...updatedStore });
    });

    const handleWindowUpdate = () => {
      setStore({
        students: storage.getStudents(),
        events: storage.getEvents(),
        teams: storage.getTeams(),
        team_preferences: storage.getTeamPreferences(),
        announcements: storage.getAnnouncements(),
        opportunities: storage.getOpportunities(),
        skills: storage.getSkills(),
        sir_notes: storage.getSirNotes(),
        archives: storage.getArchives(),
        bts: storage.getBehindTheScenes(),
        talents: storage.getTalents(),
        calendar: storage.getCalendarEvents()
      });
    };

    window.addEventListener('teater_storage_updated', handleWindowUpdate);

    return () => {
      unsub();
      window.removeEventListener('teater_storage_updated', handleWindowUpdate);
    };
  }, []);

  return store;
}
