import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  Edit,
  Save,
  Bell,
  Calendar,
  Users,
  UserPlus,
  BookOpen,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
} from 'lucide-react';
import {
  Announcement,
  AttendanceRecord,
  CollegeGroup,
  PeriodSchedule,
  Student,
  SubjectItem,
  TimetableEntry,
} from '../types';

interface AdminCabinetViewProps {
  announcements: Announcement[];
  onAddAnnouncement: (a: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  timetable: TimetableEntry[];
  onAddTimetableEntry: (entry: TimetableEntry) => void;
  groups: CollegeGroup[];
  onAddGroup: (grp: CollegeGroup) => void;
  students: Student[];
  onAddStudent: (std: Student) => void;
  attendanceHistory: AttendanceRecord[];
  periods: PeriodSchedule[];
  onUpdatePeriods: (periods: PeriodSchedule[]) => void;
  subjects: SubjectItem[];
}

export const AdminCabinetView: React.FC<AdminCabinetViewProps> = ({
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  timetable,
  onAddTimetableEntry,
  groups,
  onAddGroup,
  students,
  onAddStudent,
  attendanceHistory,
  periods,
  onUpdatePeriods,
  subjects,
}) => {
  const [activeTab, setActiveTab] = useState<
    'announcements' | 'timetable' | 'groups' | 'students' | 'bellTimes' | 'stats'
  >('announcements');

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<'E’lon' | 'Yangilik' | 'Muhim' | 'Tadbir'>('E’lon');
  const [annAuthor, setAnnAuthor] = useState('Kollej ma’muriyati');
  const [annIsImportant, setAnnIsImportant] = useState(false);
  const [annSuccessMsg, setAnnSuccessMsg] = useState(false);

  // Group Form State
  const [grpName, setGrpName] = useState('');
  const [grpSpecialty, setGrpSpecialty] = useState('');
  const [grpCourse, setGrpCourse] = useState(1);
  const [grpCurator, setGrpCurator] = useState('');
  const [grpSuccessMsg, setGrpSuccessMsg] = useState(false);

  // Student Form State
  const [stdName, setStdName] = useState('');
  const [stdGroupId, setStdGroupId] = useState(groups[0]?.id || 'grp-202');
  const [stdParentName, setStdParentName] = useState('');
  const [stdParentPhone, setStdParentPhone] = useState('+998 90 ');
  const [stdStudentPhone, setStdStudentPhone] = useState('+998 93 ');
  const [stdSuccessMsg, setStdSuccessMsg] = useState(false);

  // Timetable Entry Form State
  const [ttGroup, setTtGroup] = useState(groups[0]?.id || 'grp-202');
  const [ttDay, setTtDay] = useState<'Dushanba' | 'Seshanba' | 'Chorshanba' | 'Payshanba' | 'Juma' | 'Shanba'>('Dushanba');
  const [ttPeriod, setTtPeriod] = useState<number>(1);
  const [ttSubjectId, setTtSubjectId] = useState(subjects[0]?.id || 'sub-1');
  const [ttLessonType, setTtLessonType] = useState<'Laboratoriya' | 'Amaliyot' | 'Ma’ruza'>('Laboratoriya');
  const [ttSuccessMsg, setTtSuccessMsg] = useState(false);

  // Bell Times Form State
  const [tempPeriods, setTempPeriods] = useState<PeriodSchedule[]>(periods);
  const [bellSaveSuccess, setBellSaveSuccess] = useState(false);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    const newAnn: Announcement = {
      id: `anc-${Date.now()}`,
      title: annTitle.trim(),
      content: annContent.trim(),
      category: annCategory,
      date: new Date().toISOString().split('T')[0],
      author: annAuthor.trim(),
      isImportant: annIsImportant,
      readCount: 1,
    };
    onAddAnnouncement(newAnn);
    setAnnTitle('');
    setAnnContent('');
    setAnnSuccessMsg(true);
    setTimeout(() => setAnnSuccessMsg(false), 3000);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grpName.trim() || !grpSpecialty.trim()) return;

    const newGroup: CollegeGroup = {
      id: `grp-${Date.now()}`,
      name: grpName.trim(),
      course: Number(grpCourse),
      specialty: grpSpecialty.trim(),
      studentCount: 25,
      totalPoints: 800,
      attendancePercentage: 90.0,
      latenessCount: 5,
      rank: groups.length + 1,
      curator: grpCurator.trim() || 'Kafedra o‘qituvchisi',
    };
    onAddGroup(newGroup);
    setGrpName('');
    setGrpSpecialty('');
    setGrpCurator('');
    setGrpSuccessMsg(true);
    setTimeout(() => setGrpSuccessMsg(false), 3000);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdName.trim()) return;

    const targetGroup = groups.find((g) => g.id === stdGroupId);
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      fullName: stdName.trim(),
      groupId: stdGroupId,
      groupName: targetGroup ? targetGroup.name : 'Guruh',
      parentName: stdParentName.trim() || 'Ota-ona',
      parentPhone: stdParentPhone.trim(),
      studentPhone: stdStudentPhone.trim(),
      seriousLateCount: 0,
    };
    onAddStudent(newStudent);
    setStdName('');
    setStdParentName('');
    setStdSuccessMsg(true);
    setTimeout(() => setStdSuccessMsg(false), 3000);
  };

  const handleCreateTimetableEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = subjects.find((s) => s.id === ttSubjectId) || subjects[0];
    const periodObj = periods.find((p) => p.period === ttPeriod);

    const newEntry: TimetableEntry = {
      id: `tt-${Date.now()}`,
      groupId: ttGroup,
      dayOfWeek: ttDay,
      period: ttPeriod,
      subjectId: subject.id,
      subjectName: subject.name,
      teacherName: subject.teacherName,
      room: subject.room,
      timeRange: periodObj ? `${periodObj.startTime}–${periodObj.endTime}` : '08:00–09:20',
      lessonType: ttLessonType,
    };
    onAddTimetableEntry(newEntry);
    setTtSuccessMsg(true);
    setTimeout(() => setTtSuccessMsg(false), 3000);
  };

  const handleSaveBellTimes = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePeriods(tempPeriods);
    setBellSaveSuccess(true);
    setTimeout(() => setBellSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                Ma’muriyat & O‘qituvchi Kabineti
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">Boshqaruv markazi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Texnik Kollej Boshqaruv Paneli
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-0.5">
              E’lonlar chop etish, dars jadvalini o‘zgartirish, guruhlar va talabalarni ro‘yxatga olish hamda qo‘ng‘iroq vaqtlarini sozlash.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 mt-5 pt-4 border-t border-slate-100 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'announcements' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            E’lonlar boshqaruvi
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'timetable' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dars jadvalini tahrirlash
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'groups' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Guruhlar boshqaruvi
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'students' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Talabalar boshqaruvi
          </button>
          <button
            onClick={() => setActiveTab('bellTimes')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'bellTimes' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Qo‘ng‘iroq vaqtlari
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'stats' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Umumiy statistika
          </button>
        </div>
      </div>

      {/* 1. Announcements Management */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* New Announcement Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Yangi E’lon yoki Yangilik Qo‘shish</span>
            </h3>

            {annSuccessMsg && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>E’lon muvaffaqiyatli chop etildi!</span>
              </div>
            )}

            <form onSubmit={handleCreateAnnouncement} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">E’lon sarlavhasi:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Hackathon tanlovi boshlandi..."
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Toifasi:</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="E’lon">E’lon</option>
                    <option value="Yangilik">Yangilik</option>
                    <option value="Muhim">Muhim</option>
                    <option value="Tadbir">Tadbir</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Muallif:</label>
                  <input
                    type="text"
                    value={annAuthor}
                    onChange={(e) => setAnnAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Matni:</label>
                <textarea
                  required
                  rows={4}
                  placeholder="E’lon matnini batafsil yozing..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={annIsImportant}
                  onChange={(e) => setAnnIsImportant(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isImportant" className="text-slate-700 font-semibold cursor-pointer">
                  Muhim bildirishnoma sifatida yuqorida ko‘rsatish
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                E’lonni chop etish
              </button>
            </form>
          </div>

          {/* Existing Announcements List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Faol E’lonlar Ro‘yxati ({announcements.length} ta)
            </h3>

            <div className="mt-4 divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {announcements.map((item) => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-semibold text-blue-600">{item.category}</span>
                      <span>·</span>
                      <span>{item.date}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {item.content}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteAnnouncement(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Timetable Management */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Dars Jadvaliga Yangi Mashg‘ulot Biriktirish
          </h3>

          {ttSuccessMsg && (
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Yangi dars jadvalga muvaffaqiyatli kiritildi!</span>
            </div>
          )}

          <form onSubmit={handleCreateTimetableEntry} className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Guruhni tanlang:</label>
              <select
                value={ttGroup}
                onChange={(e) => setTtGroup(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} — {g.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hafta kuni:</label>
              <select
                value={ttDay}
                onChange={(e) => setTtDay(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
              >
                <option value="Dushanba">Dushanba</option>
                <option value="Seshanba">Seshanba</option>
                <option value="Chorshanba">Chorshanba</option>
                <option value="Payshanba">Payshanba</option>
                <option value="Juma">Juma</option>
                <option value="Shanba">Shanba</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Para (Dars vaqti):</label>
              <select
                value={ttPeriod}
                onChange={(e) => setTtPeriod(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
              >
                <option value={1}>1-para (08:00–09:20)</option>
                <option value={2}>2-para (09:30–10:50)</option>
                <option value={3}>3-para (11:20–12:40)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Fanni tanlang (15 ta fandan):</label>
              <select
                value={ttSubjectId}
                onChange={(e) => setTtSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mashg‘ulot turi:</label>
              <select
                value={ttLessonType}
                onChange={(e) => setTtLessonType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
              >
                <option value="Laboratoriya">Laboratoriya</option>
                <option value="Amaliyot">Amaliyot</option>
                <option value="Ma’ruza">Ma’ruza</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Jadvalga biriktirish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Groups Management */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Yangi O‘quv Guruhi Ochish</span>
            </h3>

            {grpSuccessMsg && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Guruh muvaffaqiyatli ro‘yxatga olindi!</span>
              </div>
            )}

            <form onSubmit={handleCreateGroup} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Guruh nomi (kod):</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: 304-AI"
                  value={grpName}
                  onChange={(e) => setGrpName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mutaxassislik yo‘nalishi:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Kiberxavfsizlik va tarmoqlar"
                  value={grpSpecialty}
                  onChange={(e) => setGrpSpecialty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bosqich (Kurs):</label>
                  <select
                    value={grpCourse}
                    onChange={(e) => setGrpCourse(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                  >
                    <option value={1}>1-kurs</option>
                    <option value={2}>2-kurs</option>
                    <option value={3}>3-kurs</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guruh kuratori:</label>
                  <input
                    type="text"
                    placeholder="F.I.Sh."
                    value={grpCurator}
                    onChange={(e) => setGrpCurator(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Guruhni saqlash
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Mavjud Guruhlar ({groups.length} ta)
            </h3>

            <div className="mt-4 divide-y divide-slate-100">
              {groups.map((grp) => (
                <div key={grp.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">{grp.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">({grp.course}-kurs)</span>
                    </div>
                    <p className="text-xs text-slate-600">{grp.specialty}</p>
                    <span className="text-[11px] text-slate-400">Kurator: {grp.curator}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-900 block">{grp.totalPoints} ball</span>
                    <span className="text-[11px] font-mono text-emerald-600">{grp.attendancePercentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Students Management */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>Yangi Talabani Ro‘yxatga Olish</span>
            </h3>

            {stdSuccessMsg && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Talaba muvaffaqiyatli saqlandi!</span>
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Talabaning to‘liq F.I.Sh.:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Tursunov Dilshodbek"
                  value={stdName}
                  onChange={(e) => setStdName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Biriktirilgan guruh:</label>
                <select
                  value={stdGroupId}
                  onChange={(e) => setStdGroupId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} — {g.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ota-onasi F.I.Sh.:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Tursunov Akrom"
                  value={stdParentName}
                  onChange={(e) => setStdParentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ota-onaning telefoni:</label>
                  <input
                    type="text"
                    required
                    value={stdParentPhone}
                    onChange={(e) => setStdParentPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Talabaning telefoni:</label>
                  <input
                    type="text"
                    value={stdStudentPhone}
                    onChange={(e) => setStdStudentPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Talabani kiritish
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Talabalar va Ota-onalar Aloqa Ro‘yxati
            </h3>

            <div className="mt-4 divide-y divide-slate-100">
              {students.map((std) => (
                <div key={std.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{std.fullName}</h4>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Guruh: <strong className="text-slate-800">{std.groupName}</strong>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Ota-ona: <span className="font-medium text-slate-800">{std.parentName}</span> ({std.parentPhone})
                    </div>
                  </div>

                  <div className="text-right">
                    {Number(std.seriousLateCount) >= 3 ? (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {std.seriousLateCount}x Jiddiy kechikish
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">
                        {std.seriousLateCount}x Kechikish
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Bell Times Management */}
      {activeTab === 'bellTimes' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Dars va Tanaffus Qo‘ng‘iroqlari Sozlamalari</span>
            <span className="text-xs font-semibold text-slate-500">1-para: 08:00</span>
          </h3>

          {bellSaveSuccess && (
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Qo‘ng‘iroq vaqtlari muvaffaqiyatli saqlandi va ESP32 moduliga sinxron qilindi!</span>
            </div>
          )}

          <form onSubmit={handleSaveBellTimes} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tempPeriods.map((p, index) => (
                <div key={p.period} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="font-extrabold text-slate-900 text-sm">{p.name}</div>

                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Boshlanish vaqti:</label>
                    <input
                      type="time"
                      value={p.startTime}
                      onChange={(e) => {
                        const copy = [...tempPeriods];
                        copy[index].startTime = e.target.value;
                        setTempPeriods(copy);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Tugash vaqti:</label>
                    <input
                      type="time"
                      value={p.endTime}
                      onChange={(e) => {
                        const copy = [...tempPeriods];
                        copy[index].endTime = e.target.value;
                        setTempPeriods(copy);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Tanaffus (daqiqa):</label>
                    <input
                      type="number"
                      value={p.breakAfterMinutes}
                      onChange={(e) => {
                        const copy = [...tempPeriods];
                        copy[index].breakAfterMinutes = Number(e.target.value);
                        setTempPeriods(copy);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>O‘zgarishlarni saqlash & ESP32 ga uzatish</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. Overall Statistics */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Jami Guruhlar</span>
              <div className="text-2xl font-mono font-extrabold text-slate-900 mt-1 tabular-nums">
                {groups.length} ta
              </div>
              <span className="text-[11px] text-slate-400">Kunduzgi ta’lim shakli</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold text-slate-500">O‘rtacha Davomat</span>
              <div className="text-2xl font-mono font-extrabold text-emerald-600 mt-1 tabular-nums">
                93.8%
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Yuqori intizom ko‘rsatkichi</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Faol Fanlar</span>
              <div className="text-2xl font-mono font-extrabold text-blue-600 mt-1 tabular-nums">
                15 ta
              </div>
              <span className="text-[11px] text-slate-400">IT & Texnika yo‘nalishlari</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Qayd Etilgan Davomatlar</span>
              <div className="text-2xl font-mono font-extrabold text-slate-900 mt-1 tabular-nums">
                {attendanceHistory.length} ta
              </div>
              <span className="text-[11px] text-slate-400">Kamera va tizim orqali</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
