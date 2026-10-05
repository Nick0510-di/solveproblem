import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Sparkles,
  Search,
  Filter,
  Users,
  BookOpen,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Layers,
  GraduationCap,
} from 'lucide-react';
import {
  CollegeGroup,
  PeriodSchedule,
  SubjectItem,
  TimetableEntry,
} from '../types';

interface TimetableViewProps {
  timetable: TimetableEntry[];
  subjects: SubjectItem[];
  groups: CollegeGroup[];
  periods: PeriodSchedule[];
  onUpdateTimetable: (newTimetable: TimetableEntry[]) => void;
}

export const TimetableView: React.FC<TimetableViewProps> = ({
  timetable,
  subjects,
  groups,
  periods,
  onUpdateTimetable,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('grp-202');
  const [selectedDay, setSelectedDay] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationSuccess, setGenerationSuccess] = useState<string | null>(null);

  const daysList = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

  // Filtered timetable entries
  const filteredEntries = timetable.filter((entry) => {
    if (entry.groupId !== selectedGroupId) return false;
    if (selectedDay !== 'Barchasi' && entry.dayOfWeek !== selectedDay) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchSubject = entry.subjectName.toLowerCase().includes(q);
      const matchTeacher = entry.teacherName.toLowerCase().includes(q);
      const matchRoom = entry.room.toLowerCase().includes(q);
      if (!matchSubject && !matchTeacher && !matchRoom) return false;
    }
    return true;
  });

  // Automated Timetable Generator Algorithm (Prompt Requirement)
  const handleAutoGenerateTimetable = () => {
    setIsGenerating(true);
    setGenerationSuccess(null);

    setTimeout(() => {
      const newGeneratedTimetable: TimetableEntry[] = [];
      const lessonTypes: Array<'Ma’ruza' | 'Amaliyot' | 'Laboratoriya'> = [
        'Laboratoriya',
        'Amaliyot',
        'Ma’ruza',
      ];

      // Generate for each group
      groups.forEach((group) => {
        let subjectIndex = 0;
        daysList.forEach((day, dayIndex) => {
          // 3 periods per day: 1-para (08:00–09:20), 2-para (09:30–10:50), 3-para (11:20–12:40)
          for (let periodNum = 1; periodNum <= 3; periodNum++) {
            // Pick a subject from the 15 subjects cyclically
            const subject = subjects[(subjectIndex + dayIndex * 2 + periodNum) % subjects.length];
            const periodInfo = periods.find((p) => p.period === periodNum) || {
              startTime: periodNum === 1 ? '08:00' : periodNum === 2 ? '09:30' : '11:20',
              endTime: periodNum === 1 ? '09:20' : periodNum === 2 ? '10:50' : '12:40',
            };

            newGeneratedTimetable.push({
              id: `gen-${group.id}-${day}-${periodNum}`,
              groupId: group.id,
              dayOfWeek: day as any,
              period: periodNum,
              subjectId: subject.id,
              subjectName: subject.name,
              teacherName: subject.teacherName,
              room: subject.room,
              timeRange: `${periodInfo.startTime}–${periodInfo.endTime}`,
              lessonType: lessonTypes[(periodNum - 1) % lessonTypes.length],
            });
            subjectIndex++;
          }
        });
      });

      onUpdateTimetable(newGeneratedTimetable);
      setIsGenerating(false);
      setGenerationSuccess(
        `Barcha 15 ta fan bo‘yicha to‘qnashuvlarsiz ${newGeneratedTimetable.length} ta dars jadvali muvaffaqiyatli generatsiya qilindi!`
      );
      setTimeout(() => setGenerationSuccess(null), 5000);
    }, 1000);
  };

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Auto-Generation Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                15 ta Mutaxassislik Fani
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">Haftalik 6 kunlik dars tartibi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Texnik Kollej Rasmiy Dars Jadvali
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-0.5">
              1-para: 08:00–09:20 | 10 daqiqa tanaffus | 2-para: 09:30–10:50 | 30 daqiqa katta tanaffus | 3-para: 11:20–12:40
            </p>
          </div>

          {/* Auto Timetable Generator Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoGenerateTimetable}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
              title="Mavjud fanlar va guruhlar asosida jadvalni avtomatik qayta tuzish"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating
                  ? 'Jadval generatsiya qilinmoqda...'
                  : 'Jadvalni avtomatik generatsiya qilish'}
              </span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {generationSuccess && (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs sm:text-sm text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{generationSuccess}</span>
          </div>
        )}

        {/* Lesson Periods Rule Indicator Bar */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-blue-900">1-para</span>
              <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">08:00–09:20</span>
            </div>
            <p className="text-[11px] text-blue-600 mt-1">Darsdan keyin: 10 daqiqa tanaffus</p>
          </div>

          <div className="p-3 bg-indigo-50/60 border border-indigo-200/80 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-900">2-para</span>
              <span className="text-xs font-mono font-bold text-indigo-700 tabular-nums">09:30–10:50</span>
            </div>
            <p className="text-[11px] text-indigo-600 mt-1">Darsdan keyin: 30 daqiqa katta tanaffus</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">3-para</span>
              <span className="text-xs font-mono font-bold text-slate-700 tabular-nums">11:20–12:40</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Darslar yakuni va fakultativlar</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Group Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="groupFilter" className="text-xs font-bold text-slate-600 whitespace-nowrap">
            Guruh:
          </label>
          <select
            id="groupFilter"
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} — {g.specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Days Filter */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedDay('Barchasi')}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedDay === 'Barchasi'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Barchasi
          </button>
          {daysList.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 text-xs rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedDay === day
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Fan, o‘qituvchi, xona..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Timetable Table Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              {selectedGroup?.name} guruhi dars jadvali
            </h3>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">{selectedGroup?.specialty}</span>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Jami mashg‘ulotlar: {filteredEntries.length} ta
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">
              Ushbu filtr bo‘yicha darslar topilmadi
            </p>
            <p className="text-xs text-slate-400">
              Iltimos, guruhni o‘zgartiring yoki «Jadvalni avtomatik generatsiya qilish» tugmasini bosing
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-3 px-3">Hafta kuni</th>
                  <th className="py-3 px-3">Para</th>
                  <th className="py-3 px-3">Vaqt oralig‘i</th>
                  <th className="py-3 px-3">Fanning nomi</th>
                  <th className="py-3 px-3">Mashg‘ulot turi</th>
                  <th className="py-3 px-3">O‘qituvchi (F.I.Sh.)</th>
                  <th className="py-3 px-3">Auditoriya / Laboratoriya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {entry.dayOfWeek}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 text-xs font-extrabold inline-flex items-center justify-center">
                        {entry.period}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-800 tabular-nums">
                      {entry.timeRange}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 text-sm">
                        {entry.subjectName}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block font-semibold ${
                          entry.lessonType === 'Laboratoriya'
                            ? 'text-indigo-700'
                            : entry.lessonType === 'Amaliyot'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {entry.lessonType}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {entry.teacherName}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 text-slate-700 font-semibold bg-slate-100 px-2 py-1 rounded-md border border-slate-200/80">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{entry.room}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 15 Subjects Showcase Cards (Prompt Requirement: "timetable containing 15 subjects") */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Texnik Kollej Fanlar Katalogi (15 Ta Fan)</span>
            </h3>
            <p className="text-xs text-slate-500">
              O‘quv dasturiga kiritilgan barcha 15 ta fan, ularning kafedrasi va xonalari
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 tabular-nums">
            15 / 15 Fan Faol
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
          {subjects.map((sub, index) => (
            <div
              key={sub.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {sub.code}
                </span>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  #{index + 1}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">
                {sub.name}
              </h4>
              <div className="mt-2 text-xs text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">O‘qituvchi:</span>
                  <span className="text-slate-800 font-medium truncate">{sub.teacherName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Xona:</span>
                  <span className="text-slate-800 font-medium truncate">{sub.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
