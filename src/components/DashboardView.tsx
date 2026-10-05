import React, { useState } from 'react';
import {
  Bell,
  Clock,
  BookOpen,
  Trophy,
  ChevronRight,
  AlertTriangle,
  Newspaper,
  Calendar,
  CheckCircle2,
  Users,
  Camera,
  ArrowUpRight,
  Flame,
  Volume2,
} from 'lucide-react';
import {
  ActiveTab,
  Announcement,
  CollegeGroup,
  PeriodSchedule,
  TimetableEntry,
} from '../types';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
  announcements: Announcement[];
  groups: CollegeGroup[];
  todaySchedule: TimetableEntry[];
  currentPeriod: PeriodSchedule | null;
  nextPeriod: PeriodSchedule | null;
  nextBellTime: string;
  minutesToNextBell: number;
  seriousLateCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  announcements,
  groups,
  todaySchedule,
  currentPeriod,
  nextPeriod,
  nextBellTime,
  minutesToNextBell,
  seriousLateCount,
}) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [activeCategory, setActiveCategory] = useState<'barchasi' | 'E’lon' | 'Yangilik' | 'Muhim'>('barchasi');

  // Filtered announcements
  const filteredAnnouncements = announcements.filter((item) => {
    if (activeCategory === 'barchasi') return true;
    return item.category === activeCategory;
  });

  // Top 3 groups by points
  const topGroups = [...groups].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 5);

  const importantAlerts = announcements.filter((a) => a.isImportant);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 3x Serious Lateness Warning Banner if applicable */}
      {seriousLateCount >= 3 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-rose-950">
                Ogohlantirish: Ota-onaga qo‘ng‘iroq qilish kerak!
              </h2>
              <p className="text-xs sm:text-sm text-rose-800 font-medium mt-0.5">
                Talabada ushbu oy davomida <span className="font-bold underline">{seriousLateCount} marotaba jiddiy kechikish (16+ daqiqa)</span> qayd etilgan.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('attendance')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            Davomatni ko‘rish & Aloqa
          </button>
        </div>
      )}

      {/* Hero Welcome & Live Schedule Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: College Banner Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 flex flex-col justify-between min-h-[240px] shadow-md">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none hidden sm:block">
            <img
              src="/src/assets/images/smartschool_campus_1790170496707.jpg"
              alt="Kollej binosi"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover mix-blend-luminosity"
            />
          </div>
          <div className="relative z-10 space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300">
              <span>Toshkent Axborot Texnologiyalari Texnikumi</span>
              <span aria-hidden="true">·</span>
              <span>2026 / 2027 O‘quv yili</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
              SmartSchool Raqamli Ta’lim va Davomat Tizimi
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              Talabalar davomati, dars jadvali shaffofligi hamda aqlli avtomatlashtirilgan qo‘ng‘iroq (ESP32) boshqaruvi.
            </p>
          </div>

          <div className="relative z-10 pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm shadow-blue-500/30 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Davomatdan o‘tish (Face Scan)</span>
            </button>
            <button
              onClick={() => onNavigate('timetable')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold rounded-xl transition-colors backdrop-blur-xs cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Dars jadvalini ko‘rish</span>
            </button>
          </div>
        </div>

        {/* Right: Live Bell & Period Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500">Joriy Holat</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                Dars Jarayoni
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {/* Current Lesson */}
              <div>
                <p className="text-xs text-slate-400 font-medium">Hozirgi para</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {currentPeriod ? currentPeriod.name : 'Dars boshlanishi kutilyapti'}
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-600 tabular-nums">
                    {currentPeriod ? `${currentPeriod.startTime}–${currentPeriod.endTime}` : '08:00'}
                  </span>
                </div>
              </div>

              {/* Next Bell Countdown */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold">Keyingi qo‘ng‘iroq:</span>
                  </div>
                  <span className="text-sm font-mono font-extrabold text-amber-700 tabular-nums">
                    {nextBellTime}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-amber-800">
                  <span>Qolgan vaqt:</span>
                  <span className="font-mono font-bold text-amber-900 tabular-nums">
                    ~{minutesToNextBell} daqiqa
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigate('bell')}
              className="w-full flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              <span>Aqlli zvonok & ESP32 rele monitori</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Important Notifications Ticker / List */}
      {importantAlerts.length > 0 && (
        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-amber-900">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="font-extrabold">Muhim bildirishnoma:</span>
            <span className="font-medium truncate max-w-xl text-amber-800">
              {importantAlerts[0].title}
            </span>
          </div>
          <button
            onClick={() => setSelectedAnnouncement(importantAlerts[0])}
            className="text-xs font-bold text-amber-900 hover:text-amber-950 underline underline-offset-2 shrink-0 cursor-pointer"
          >
            Batafsil o‘qish
          </button>
        </div>
      )}

      {/* Main Grid: Announcements & News (Left) + Group Ranking (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Announcements & College News */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Texnik Kollej E’lonlari va Yangiliklar
                </h3>
                <p className="text-xs text-slate-500">
                  Talabalar va professor-o‘qituvchilar uchun rasmiy axborotlar
                </p>
              </div>

              {/* Segmented Filter */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium self-start sm:self-auto">
                <button
                  onClick={() => setActiveCategory('barchasi')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeCategory === 'barchasi'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Barchasi
                </button>
                <button
                  onClick={() => setActiveCategory('E’lon')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeCategory === 'E’lon'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  E’lonlar
                </button>
                <button
                  onClick={() => setActiveCategory('Yangilik')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeCategory === 'Yangilik'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Yangiliklar
                </button>
                <button
                  onClick={() => setActiveCategory('Muhim')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeCategory === 'Muhim'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Muhim
                </button>
              </div>
            </div>

            {/* List of Announcements */}
            <div className="divide-y divide-slate-100">
              {filteredAnnouncements.map((item) => (
                <article
                  key={item.id}
                  onClick={() => setSelectedAnnouncement(item)}
                  className="py-4 first:pt-4 last:pb-1 group cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span
                          className={`font-semibold ${
                            item.category === 'Muhim'
                              ? 'text-rose-600'
                              : item.category === 'E’lon'
                              ? 'text-blue-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {item.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{item.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.author}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                    <div className="p-2 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Today's Schedule Timeline Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Bugungi Darslar Ketma-ketligi (202-DI guruhi)
                </h3>
                <p className="text-xs text-slate-500">1-para 08:00 da boshlanadi</p>
              </div>
              <button
                onClick={() => onNavigate('timetable')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Haftalik jadval
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {todaySchedule.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 text-xs font-extrabold flex items-center justify-center shrink-0">
                      {lesson.period}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {lesson.subjectName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{lesson.teacherName}</span>
                        <span>·</span>
                        <span className="font-medium text-slate-600">{lesson.room}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-700 tabular-nums">
                      {lesson.timeRange}
                    </span>
                    <span className="block text-[11px] font-semibold text-blue-600 mt-0.5">
                      {lesson.lessonType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Groups Ranking Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Guruhlar Reytingi</span>
                </h3>
                <p className="text-xs text-slate-500">Eng yuqori ball va davomat</p>
              </div>
              <button
                onClick={() => onNavigate('ranking')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Barchasi
              </button>
            </div>

            {/* Ranking Table/Cards */}
            <div className="mt-4 space-y-2.5">
              {topGroups.map((group, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;

                return (
                  <div
                    key={group.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isFirst
                        ? 'bg-amber-50/70 border-amber-200'
                        : isSecond
                        ? 'bg-slate-50 border-slate-200'
                        : isThird
                        ? 'bg-orange-50/50 border-orange-200'
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                            isFirst
                              ? 'bg-amber-500 text-white'
                              : isSecond
                              ? 'bg-slate-400 text-white'
                              : isThird
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {group.rank}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-extrabold text-slate-900">
                              {group.name}
                            </span>
                            {isFirst && <Flame className="w-3.5 h-3.5 text-amber-500" />}
                          </div>
                          <span className="text-[11px] text-slate-500 line-clamp-1">
                            {group.specialty}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-mono font-extrabold text-slate-900 tabular-nums">
                          {group.totalPoints} ball
                        </div>
                        <div className="text-[11px] text-emerald-600 font-semibold tabular-nums">
                          {group.attendancePercentage}% davomat
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                onClick={() => onNavigate('ranking')}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                To‘liq intizom va reyting jadvalini ochish
              </button>
            </div>
          </div>

          {/* Quick Rules Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Dars va Davomat Reglamenti</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong className="text-white">08:00</strong> — Darslar qat’iy boshlanish vaqti.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>0–10 min kechikish: kechirilgan (yashil).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>11–15 min: kechikish qayd etiladi (sariq).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>16+ min: jiddiy kechikish (qizil).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Oyiga 3 marta jiddiy kechikish = ota-onaga qo‘ng‘iroq!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {selectedAnnouncement.category}
              </span>
              <span className="text-xs text-slate-400">{selectedAnnouncement.date}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-3">
              {selectedAnnouncement.title}
            </h3>
            <p className="text-sm text-slate-700 mt-3 leading-relaxed">
              {selectedAnnouncement.content}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Muallif: {selectedAnnouncement.author}</span>
              <span>Ko‘rishlar: {selectedAnnouncement.readCount}</span>
            </div>
            <div className="mt-5 text-right">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
