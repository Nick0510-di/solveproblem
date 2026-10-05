import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  CalendarDays,
  BellRing,
  Trophy,
  Sliders,
  GraduationCap,
  Sparkles,
  Wifi,
  Clock,
} from 'lucide-react';
import { ActiveTab, UserRole } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  userRole: UserRole;
  esp32Connected: boolean;
  nextBellTime: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  userRole,
  esp32Connected,
  nextBellTime,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Bosh sahifa',
      sublabel: 'Yangiliklar va umumiy ko‘rinish',
      icon: LayoutDashboard,
    },
    {
      id: 'attendance' as ActiveTab,
      label: 'Davomat',
      sublabel: 'Kamera nazorati va kechikishlar',
      icon: UserCheck,
    },
    {
      id: 'timetable' as ActiveTab,
      label: 'Dars jadvali',
      sublabel: '15 ta fan va avto-generatsiya',
      icon: CalendarDays,
    },
    {
      id: 'bell' as ActiveTab,
      label: 'Aqlli qo‘ng‘iroq',
      sublabel: 'Zvonok & ESP32 rele nazorati',
      icon: BellRing,
    },
    {
      id: 'ranking' as ActiveTab,
      label: 'Guruhlar reytingi',
      sublabel: 'Ballar va intizom yetakchilari',
      icon: Trophy,
    },
    {
      id: 'admin' as ActiveTab,
      label: 'Boshqaruv paneli',
      sublabel: 'E’lonlar, jadval va sozlamalar',
      icon: Sliders,
    },
  ];

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                  Smart<span className="text-blue-600">School</span>
                </span>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Texnik Kollej Platformasi</p>
            </div>
          </div>
        </div>

        {/* Quick System Badge */}
        <div className="px-4 pt-3 pb-2">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Qo‘ng‘iroq:</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">{nextBellTime}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium">
              <Wifi className={`w-3.5 h-3.5 ${esp32Connected ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span className={esp32Connected ? 'text-emerald-700' : 'text-slate-500'}>ESP32</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-start gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20 font-medium'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold tracking-tight truncate">
                    {item.label}
                  </div>
                  <div
                    className={`text-xs truncate ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {item.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Technical College Profile Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden ring-2 ring-slate-100 shrink-0">
              <img
                src="/src/assets/images/college_student_avatar_1790170514884.jpg"
                alt="Foydalanuvchi"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23475569"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">Jasur Alimov</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="truncate">202-DI guruhi</span>
                <span>·</span>
                <span className="font-semibold text-blue-700 capitalize">
                  {userRole === 'admin' ? 'Admin' : userRole === 'teacher' ? 'O‘qituvchi' : 'Talaba'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
