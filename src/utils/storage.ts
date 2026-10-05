import {
  Announcement,
  AttendanceRecord,
  CollegeGroup,
  ESP32Status,
  PeriodSchedule,
  Student,
  SubjectItem,
  TimetableEntry,
  Teacher,
} from '../types';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ATTENDANCE_HISTORY,
  INITIAL_ESP32_STATUS,
  INITIAL_GROUPS,
  INITIAL_PERIODS,
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_TEACHERS,
  INITIAL_TIMETABLE,
} from '../data/initialData';

const KEYS = {
  ANNOUNCEMENTS: 'smartschool_announcements_v1',
  ATTENDANCE: 'smartschool_attendance_v1',
  GROUPS: 'smartschool_groups_v1',
  STUDENTS: 'smartschool_students_v1',
  SUBJECTS: 'smartschool_subjects_v1',
  TEACHERS: 'smartschool_teachers_v1',
  PERIODS: 'smartschool_periods_v1',
  TIMETABLE: 'smartschool_timetable_v1',
  ESP32: 'smartschool_esp32_v1',
};

export const storage = {
  getAnnouncements: (): Announcement[] => {
    try {
      const data = localStorage.getItem(KEYS.ANNOUNCEMENTS);
      return data ? JSON.parse(data) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  },
  saveAnnouncements: (data: Announcement[]) => {
    localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(data));
  },

  getAttendance: (): AttendanceRecord[] => {
    try {
      const data = localStorage.getItem(KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : INITIAL_ATTENDANCE_HISTORY;
    } catch {
      return INITIAL_ATTENDANCE_HISTORY;
    }
  },
  saveAttendance: (data: AttendanceRecord[]) => {
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(data));
  },

  getGroups: (): CollegeGroup[] => {
    try {
      const data = localStorage.getItem(KEYS.GROUPS);
      return data ? JSON.parse(data) : INITIAL_GROUPS;
    } catch {
      return INITIAL_GROUPS;
    }
  },
  saveGroups: (data: CollegeGroup[]) => {
    localStorage.setItem(KEYS.GROUPS, JSON.stringify(data));
  },

  getStudents: (): Student[] => {
    try {
      const data = localStorage.getItem(KEYS.STUDENTS);
      return data ? JSON.parse(data) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  },
  saveStudents: (data: Student[]) => {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(data));
  },

  getSubjects: (): SubjectItem[] => {
    try {
      const data = localStorage.getItem(KEYS.SUBJECTS);
      return data ? JSON.parse(data) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  },
  saveSubjects: (data: SubjectItem[]) => {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(data));
  },

  getTeachers: (): Teacher[] => {
    try {
      const data = localStorage.getItem(KEYS.TEACHERS);
      return data ? JSON.parse(data) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  },
  saveTeachers: (data: Teacher[]) => {
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(data));
  },

  getPeriods: (): PeriodSchedule[] => {
    try {
      const data = localStorage.getItem(KEYS.PERIODS);
      return data ? JSON.parse(data) : INITIAL_PERIODS;
    } catch {
      return INITIAL_PERIODS;
    }
  },
  savePeriods: (data: PeriodSchedule[]) => {
    localStorage.setItem(KEYS.PERIODS, JSON.stringify(data));
  },

  getTimetable: (): TimetableEntry[] => {
    try {
      const data = localStorage.getItem(KEYS.TIMETABLE);
      return data ? JSON.parse(data) : INITIAL_TIMETABLE;
    } catch {
      return INITIAL_TIMETABLE;
    }
  },
  saveTimetable: (data: TimetableEntry[]) => {
    localStorage.setItem(KEYS.TIMETABLE, JSON.stringify(data));
  },

  getESP32Status: (): ESP32Status => {
    try {
      const data = localStorage.getItem(KEYS.ESP32);
      return data ? JSON.parse(data) : INITIAL_ESP32_STATUS;
    } catch {
      return INITIAL_ESP32_STATUS;
    }
  },
  saveESP32Status: (data: ESP32Status) => {
    localStorage.setItem(KEYS.ESP32, JSON.stringify(data));
  },

  resetAll: () => {
    localStorage.removeItem(KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(KEYS.ATTENDANCE);
    localStorage.removeItem(KEYS.GROUPS);
    localStorage.removeItem(KEYS.STUDENTS);
    localStorage.removeItem(KEYS.SUBJECTS);
    localStorage.removeItem(KEYS.TEACHERS);
    localStorage.removeItem(KEYS.PERIODS);
    localStorage.removeItem(KEYS.TIMETABLE);
    localStorage.removeItem(KEYS.ESP32);
  },
};
