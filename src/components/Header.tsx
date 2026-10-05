import React, { useState, useEffect } from 'react';
import {
  Menu,
  BellRing,
  Clock,
  Calendar,
  Volume2,
  ShieldCheck,
  User,
  Sliders,
} from 'lucide-react';
import { ActiveTab, UserRole } from '../types';
import { bellAudio } from '../utils/audio';

interface HeaderProps {
  activeTab: ActiveTab;
  setIsOpenMobile: (open: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onManualBellRing: () => void;
  isBellRinging: boolean;
  nextBellTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setIsOpenMobile,
  userRole,
  setUserRole,
  onManualBellRing,
  isBellRinging,
  nextBellTime,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date in Uzbek
  const monthsUz = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];
  const daysUz = [
    'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'
  ];

  const formattedDate = `${daysUz[currentTime.getDay()]}, ${currentTime.getDate()}-${monthsUz[currentTime.getMonth()]} ${currentTime.getFullYear()}`;
  const formattedTime = currentTime.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const getPageTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Boshqaruv Paneli & Yangiliklar';
      case 'attendance':
        return 'Talabalar Davomati & Kamera Nazorati';
      case 'timetable':
        return 'Dars Jadvali & 15 Ta Texnik Fan';
      case 'bell':
        return 'Aqlli Qo‘ng‘iroq & ESP32 Boshqaruvi';
      case 'ranking':
        return 'Guruhlar Reytingi & Intizom Jadvali';
      case 'admin':
        return 'Texnikum Boshqaruv & Ma’muriyat Paneli';
      default:
        return 'SmartSchool Texnik Kollej';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpenMobile(true)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Menyu ochish"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {getPageTitle(activeTab)}
            </h1>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formattedDate}</span>
              </span>
              <span>·</span>
              <span className="font-mono font-semibold text-slate-700 tabular-nums">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Bell Trigger & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Bell Ring Action */}
          <button
            onClick={onManualBellRing}
            disabled={isBellRinging}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
              isBellRinging
                ? 'bg-amber-500 border-amber-600 text-white animate-pulse'
                : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100/90 shadow-2xs'
            }`}
            title="Qo‘ng‘iroq tovushini chalish va ESP32 relega signal jo‘natish"
          >
            <BellRing className={`w-4 h-4 ${isBellRinging ? 'animate-bounce' : 'text-amber-600'}`} />
            <span className="hidden sm:inline">
              {isBellRinging ? 'Qo‘ng‘iroq chalinmoqda...' : 'Qo‘ng‘iroqni chalish'}
            </span>
            <span className="sm:hidden text-xs">Zvonok</span>
          </button>

          {/* Role Switcher (Simulated Portal Access) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/70 text-xs font-semibold">
            <button
              onClick={() => setUserRole('student')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                userRole === 'student'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Talaba
            </button>
            <button
              onClick={() => setUserRole('teacher')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                userRole === 'teacher'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              O‘qituvchi
            </button>
            <button
              onClick={() => setUserRole('admin')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                userRole === 'admin'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
