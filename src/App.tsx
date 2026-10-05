import React, { useState, useEffect, useMemo } from 'react';
import {
  ActiveTab,
  Announcement,
  AttendanceRecord,
  CollegeGroup,
  ESP32Status,
  PeriodSchedule,
  Student,
  SubjectItem,
  TimetableEntry,
  UserRole,
} from './types';
import { storage } from './utils/storage';
import { bellAudio } from './utils/audio';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AttendanceView } from './components/AttendanceView';
import { TimetableView } from './components/TimetableView';
import { SmartBellView } from './components/SmartBellView';
import { GroupRankingView } from './components/GroupRankingView';
import { AdminCabinetView } from './components/AdminCabinetView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('student');

  // Persistent States
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => storage.getAnnouncements());
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>(() => storage.getAttendance());
  const [groups, setGroups] = useState<CollegeGroup[]>(() => storage.getGroups());
  const [students, setStudents] = useState<Student[]>(() => storage.getStudents());
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => storage.getSubjects());
  const [periods, setPeriods] = useState<PeriodSchedule[]>(() => storage.getPeriods());
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => storage.getTimetable());
  const [esp32Status, setEsp32Status] = useState<ESP32Status>(() => storage.getESP32Status());

  // Bell audio state
  const [isBellRinging, setIsBellRinging] = useState<boolean>(false);

  // Active student (default Jasur Alimov, 202-DI)
  const currentStudent = students[0] || {
    id: 'std-1',
    fullName: 'Alimov Jasur Tohir o‘g‘li',
    groupId: 'grp-202',
    groupName: '202-DI',
    parentName: 'Alimov Tohirbek Qodirovich',
    parentPhone: '+998 90 765-43-21',
    studentPhone: '+998 93 112-34-56',
    seriousLateCount: 3,
  };

  // Calculate serious late count for active student
  const studentRecords = attendanceHistory.filter((r) => r.studentId === currentStudent.id);
  const seriousLateCount = studentRecords.filter((r) => r.status === 'serious_late').length;

  // Real-time period & bell calculator
  const [nowDate, setNowDate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute current period, next period, and next bell time
  const { currentPeriod, nextPeriod, nextBellTime, minutesToNextBell } = useMemo(() => {
    const currentMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();

    let curr: PeriodSchedule | null = null;
    let next: PeriodSchedule | null = null;
    let nextBell = '08:00';
    let minutesLeft = 0;

    for (let i = 0; i < periods.length; i++) {
      const p = periods[i];
      const [startH, startM] = p.startTime.split(':').map(Number);
      const [endH, endM] = p.endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        curr = p;
        next = periods[i + 1] || null;
        nextBell = p.endTime;
        minutesLeft = endMinutes - currentMinutes;
        break;
      } else if (currentMinutes < startMinutes) {
        next = p;
        nextBell = p.startTime;
        minutesLeft = startMinutes - currentMinutes;
        break;
      }
    }

    // Default if after school hours
    if (!curr && !next) {
      nextBell = periods[0]?.startTime || '08:00';
      minutesLeft = 45;
    }

    return {
      currentPeriod: curr,
      nextPeriod: next,
      nextBellTime: nextBell,
      minutesToNextBell: Math.max(1, minutesLeft),
    };
  }, [nowDate, periods]);

  // Today's schedule for 202-DI
  const todaySchedule = useMemo(() => {
    const dayNames: Array<'Yakshanba' | 'Dushanba' | 'Seshanba' | 'Chorshanba' | 'Payshanba' | 'Juma' | 'Shanba'> = [
      'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'
    ];
    const todayName = dayNames[nowDate.getDay()];
    const queryDay = todayName === 'Yakshanba' ? 'Dushanba' : todayName;

    const list = timetable.filter((item) => item.groupId === 'grp-202' && item.dayOfWeek === queryDay);
    return list.length > 0 ? list : timetable.slice(0, 3);
  }, [timetable, nowDate]);

  // Manual Bell Ring Action with Audio and ESP32 Relay simulation
  const handleManualBellRing = () => {
    if (isBellRinging) return;
    setIsBellRinging(true);

    const updatedLogs = [
      {
        timestamp: new Date().toLocaleTimeString('uz-UZ'),
        event: 'Qo‘ng‘iroq chalindi: ESP32 Rele Pin D2 [HIGH] holatiga o‘tkazildi (5 soniya)',
        type: 'trigger' as const,
      },
      ...esp32Status.logs,
    ].slice(0, 15);

    const updatedStatus: ESP32Status = {
      ...esp32Status,
      currentRelayState: 'RINGING',
      lastRungAt: new Date().toLocaleTimeString('uz-UZ'),
      logs: updatedLogs,
    };
    setEsp32Status(updatedStatus);
    storage.saveESP32Status(updatedStatus);

    bellAudio.ring(4.5, () => {
      setIsBellRinging(false);
      setEsp32Status((prev) => {
        const resetStatus: ESP32Status = {
          ...prev,
          currentRelayState: 'IDLE',
        };
        storage.saveESP32Status(resetStatus);
        return resetStatus;
      });
    });
  };

  // Handlers for state updates
  const handleAddAttendanceRecord = (record: AttendanceRecord) => {
    const updated = [record, ...attendanceHistory];
    setAttendanceHistory(updated);
    storage.saveAttendance(updated);
  };

  const handleAddAnnouncement = (ann: Announcement) => {
    const updated = [ann, ...announcements];
    setAnnouncements(updated);
    storage.saveAnnouncements(updated);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    storage.saveAnnouncements(updated);
  };

  const handleUpdateTimetable = (newTimetable: TimetableEntry[]) => {
    setTimetable(newTimetable);
    storage.saveTimetable(newTimetable);
  };

  const handleAddTimetableEntry = (entry: TimetableEntry) => {
    const updated = [entry, ...timetable];
    setTimetable(updated);
    storage.saveTimetable(updated);
  };

  const handleAddGroup = (grp: CollegeGroup) => {
    const updated = [...groups, grp];
    setGroups(updated);
    storage.saveGroups(updated);
  };

  const handleAddStudent = (std: Student) => {
    const updated = [...students, std];
    setStudents(updated);
    storage.saveStudents(updated);
  };

  const handleUpdatePeriods = (newPeriods: PeriodSchedule[]) => {
    setPeriods(newPeriods);
    storage.savePeriods(newPeriods);
  };

  const handleUpdateESP32 = (newStatus: ESP32Status) => {
    setEsp32Status(newStatus);
    storage.saveESP32Status(newStatus);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        userRole={userRole}
        esp32Connected={esp32Status.connected}
        nextBellTime={nextBellTime}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setIsOpenMobile={setIsOpenMobile}
          userRole={userRole}
          setUserRole={setUserRole}
          onManualBellRing={handleManualBellRing}
          isBellRinging={isBellRinging}
          nextBellTime={nextBellTime}
        />

        {/* Content Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setActiveTab(tab)}
              announcements={announcements}
              groups={groups}
              todaySchedule={todaySchedule}
              currentPeriod={currentPeriod}
              nextPeriod={nextPeriod}
              nextBellTime={nextBellTime}
              minutesToNextBell={minutesToNextBell}
              seriousLateCount={seriousLateCount}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              currentStudent={currentStudent}
              attendanceHistory={attendanceHistory}
              onAddAttendanceRecord={handleAddAttendanceRecord}
              seriousLateCount={seriousLateCount}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableView
              timetable={timetable}
              subjects={subjects}
              groups={groups}
              periods={periods}
              onUpdateTimetable={handleUpdateTimetable}
            />
          )}

          {activeTab === 'bell' && (
            <SmartBellView
              periods={periods}
              currentPeriod={currentPeriod}
              nextPeriod={nextPeriod}
              nextBellTime={nextBellTime}
              minutesToNextBell={minutesToNextBell}
              esp32Status={esp32Status}
              onManualBellRing={handleManualBellRing}
              isBellRinging={isBellRinging}
              onUpdateESP32={handleUpdateESP32}
            />
          )}

          {activeTab === 'ranking' && (
            <GroupRankingView groups={groups} />
          )}

          {activeTab === 'admin' && (
            <AdminCabinetView
              announcements={announcements}
              onAddAnnouncement={handleAddAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              timetable={timetable}
              onAddTimetableEntry={handleAddTimetableEntry}
              groups={groups}
              onAddGroup={handleAddGroup}
              students={students}
              onAddStudent={handleAddStudent}
              attendanceHistory={attendanceHistory}
              periods={periods}
              onUpdatePeriods={handleUpdatePeriods}
              subjects={subjects}
            />
          )}
        </main>
      </div>
    </div>
  );
}
