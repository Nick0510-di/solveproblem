export type AttendanceStatus = 'present' | 'late_forgiven' | 'late' | 'serious_late' | 'absent';

export interface Student {
  id: string;
  fullName: string;
  groupId: string;
  groupName: string;
  avatarUrl?: string;
  parentName: string;
  parentPhone: string;
  studentPhone: string;
  seriousLateCount: string | number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // Dushanba, Seshanba, etc.
  checkInTime: string; // HH:mm:ss
  minutesLate: number;
  status: AttendanceStatus;
  statusLabelUz: string;
  verifiedBy: 'camera' | 'manual' | 'nfc';
  photoSnapshot?: string;
  lessonNumber: number;
  subjectName: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  hoursPerWeek: number;
  category: 'professional' | 'general' | 'specialized';
  teacherId: string;
  teacherName: string;
  room: string;
  color: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  specialty: string;
  phone: string;
  email: string;
}

export interface PeriodSchedule {
  period: number; // 1, 2, 3
  name: string;   // 1-para, 2-para, 3-para
  startTime: string; // 08:00
  endTime: string;   // 09:20
  breakAfterMinutes: number; // 10, 30
  breakName?: string;
}

export interface TimetableEntry {
  id: string;
  groupId: string;
  dayOfWeek: 'Dushanba' | 'Seshanba' | 'Chorshanba' | 'Payshanba' | 'Juma' | 'Shanba';
  period: number;
  subjectId: string;
  subjectName: string;
  teacherName: string;
  room: string;
  timeRange: string;
  lessonType: 'Ma’ruza' | 'Amaliyot' | 'Laboratoriya' | 'Seminar';
}

export interface CollegeGroup {
  id: string;
  name: string;
  course: number;
  specialty: string;
  studentCount: number;
  totalPoints: number;
  attendancePercentage: number;
  latenessCount: number;
  rank: number;
  curator: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'E’lon' | 'Yangilik' | 'Muhim' | 'Tadbir';
  date: string;
  author: string;
  isImportant: boolean;
  readCount: number;
}

export interface ESP32Status {
  connected: boolean;
  ipAddress: string;
  macAddress: string;
  lastPing: string;
  relayPin: string;
  currentRelayState: 'IDLE' | 'RINGING';
  mode: 'AUTO' | 'MANUAL';
  wifiSignal: number; // -45 dBm
  lastRungAt?: string;
  logs: Array<{
    timestamp: string;
    event: string;
    type: 'info' | 'trigger' | 'error';
  }>;
}

export type ActiveTab = 'dashboard' | 'attendance' | 'timetable' | 'bell' | 'ranking' | 'admin';
export type UserRole = 'student' | 'teacher' | 'admin';
