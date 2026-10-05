import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PhoneCall,
  Clock,
  Calendar,
  Sparkles,
  RefreshCw,
  User,
  ShieldAlert,
  MessageSquare,
  FileText,
  Video,
  VideoOff,
  Sliders,
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, Student } from '../types';

interface AttendanceViewProps {
  currentStudent: Student;
  attendanceHistory: AttendanceRecord[];
  onAddAttendanceRecord: (record: AttendanceRecord) => void;
  seriousLateCount: number;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentStudent,
  attendanceHistory,
  onAddAttendanceRecord,
  seriousLateCount,
}) => {
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    status: AttendanceStatus;
    label: string;
    minutesLate: number;
    time: string;
    photoUrl?: string;
  } | null>(null);

  // Time simulation state
  const [customArrivalTime, setCustomArrivalTime] = useState<string>('08:05');
  const [simulationMode, setSimulationMode] = useState<'current' | 'custom'>('custom');

  // Parent Call Modal
  const [showParentModal, setShowParentModal] = useState<boolean>(false);
  const [smsSentNotice, setSmsSentNotice] = useState<boolean>(false);

  // Video element ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCameraStream = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      // In sandbox if camera permission denied, simulation mode still works seamlessly!
      setIsCameraActive(true);
    }
  };

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Helper to calculate lateness based on 08:00
  const evaluateLateness = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const arrivalMinutes = h * 60 + m;
    const lessonStartMinutes = 8 * 60; // 08:00 = 480 min

    const diff = arrivalMinutes - lessonStartMinutes;

    if (diff <= 10) {
      // 0–10 minutes late: forgiven / green
      return {
        status: (diff <= 0 ? 'present' : 'late_forgiven') as AttendanceStatus,
        label: diff <= 0 ? 'Vaqtida' : 'Vaqtida (0–10 min kechirilgan)',
        minutesLate: Math.max(0, diff),
      };
    } else if (diff >= 11 && diff <= 15) {
      // 11–15 minutes late: yellow
      return {
        status: 'late' as AttendanceStatus,
        label: 'Kechikdingiz',
        minutesLate: diff,
      };
    } else {
      // 16+ minutes late: serious lateness / red
      return {
        status: 'serious_late' as AttendanceStatus,
        label: 'Jiddiy kechikish',
        minutesLate: diff,
      };
    }
  };

  // Trigger attendance verification scan
  const handleVerifyAttendance = (overrideTime?: string) => {
    setIsScanning(true);
    setScanResult(null);

    const timeToUse = overrideTime || (simulationMode === 'custom'
      ? customArrivalTime
      : new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }));

    setTimeout(() => {
      const evaluation = evaluateLateness(timeToUse);
      const now = new Date();
      const dayNames = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
      const dayOfWeek = dayNames[now.getDay()];
      const dateString = now.toISOString().split('T')[0];

      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        studentId: currentStudent.id,
        studentName: currentStudent.fullName,
        groupId: currentStudent.groupId,
        groupName: currentStudent.groupName,
        date: dateString,
        dayOfWeek: dayOfWeek,
        checkInTime: `${timeToUse}:00`,
        minutesLate: evaluation.minutesLate,
        status: evaluation.status,
        statusLabelUz: evaluation.label,
        verifiedBy: 'camera',
        photoSnapshot: '/src/assets/images/college_student_avatar_1790170514884.jpg',
        lessonNumber: 1,
        subjectName: 'Dasturlash asoslari (C++ / Python)',
      };

      onAddAttendanceRecord(newRecord);

      setScanResult({
        status: evaluation.status,
        label: evaluation.label,
        minutesLate: evaluation.minutesLate,
        time: timeToUse,
        photoUrl: '/src/assets/images/college_student_avatar_1790170514884.jpg',
      });
      setIsScanning(false);
    }, 1200);
  };

  // Weekly attendance data
  const daysOfWeek = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  const studentRecords = attendanceHistory.filter((r) => r.studentId === currentStudent.id);

  const getRecordForDay = (day: string) => {
    return studentRecords.find((r) => r.dayOfWeek === day);
  };

  // Stats calculation
  const totalChecked = studentRecords.length;
  const countPresent = studentRecords.filter((r) => r.status === 'present' || r.status === 'late_forgiven').length;
  const countLate = studentRecords.filter((r) => r.status === 'late').length;
  const countSeriousLate = studentRecords.filter((r) => r.status === 'serious_late').length;
  const countAbsent = 1; // Sample absent

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 3x Serious Lateness Warning Banner (Prompt Requirement) */}
      {seriousLateCount >= 3 && (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-600 text-white rounded-xl shadow-xs">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                  Qat’iy Intizomiy Ogohlantirish
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-rose-950 mt-1">
                  Ogohlantirish: Ota-onaga qo‘ng‘iroq qilish kerak.
                </h2>
                <p className="text-xs sm:text-sm text-rose-900 mt-0.5 max-w-2xl">
                  Talaba {currentStudent.fullName} ({currentStudent.groupName}) ushbu oy davomida{' '}
                  <strong className="underline">{seriousLateCount} marta jiddiy kechikkan (16+ daqiqa)</strong>.
                  Kollej ichki tartib-qoidalariga muvofiq, zudlik bilan ota-onasi bilan bog‘lanish talab etiladi.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={() => setShowParentModal(true)}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Ota-onaga bog‘lanish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Attendance Section: Camera Area & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Interface & Verification Terminal */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span>Kamera Orqali Davomatni Qayd Etish</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Talaba yuzi va kelish vaqti avtomatik skanerlanadi
                </p>
              </div>

              {/* Camera Stream Toggle */}
              <button
                onClick={isCameraActive ? stopCameraStream : startCameraStream}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {isCameraActive ? (
                  <>
                    <VideoOff className="w-3.5 h-3.5 text-rose-500" />
                    <span>Kamerani o‘chirish</span>
                  </>
                ) : (
                  <>
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    <span>Veb-kamerani yoqish</span>
                  </>
                )}
              </button>
            </div>

            {/* Camera Viewport / Face Scanner Frame */}
            <div className="relative mt-4 aspect-4/3 w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {/* Actual Video or Fallback Snapshot */}
              {isCameraActive && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {!isCameraActive && (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <img
                    src="/src/assets/images/college_student_avatar_1790170514884.jpg"
                    alt="Talaba kamerasi"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-35 filter grayscale contrast-125"
                  />
                  <div className="relative z-10 space-y-2">
                    <div className="w-14 h-14 mx-auto rounded-full bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-300 backdrop-blur-xs">
                      <Camera className="w-7 h-7" />
                    </div>
                    <p className="text-xs font-semibold text-slate-200">
                      SmartSchool Biometrik Skanner
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-xs">
                      Jonli kamera yoki fotosurat orqali talabaning kelgan vaqtini tasdiqlash
                    </p>
                  </div>
                </div>
              )}

              {/* Scanning HUD Overlay */}
              <div className="absolute inset-4 border border-blue-400/30 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-blue-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    CAM-01 [GATE_A]
                  </span>
                  <span>08:00 DARS BOSHLANISHI</span>
                </div>

                {/* Face Target Box */}
                <div className="self-center w-48 h-48 border-2 border-dashed border-blue-400/70 rounded-2xl relative flex items-center justify-center">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-400"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-400"></div>

                  {isScanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanline shadow-sm shadow-blue-400"></div>
                  )}

                  <span className="text-[10px] font-mono text-blue-300/80 tracking-wider">
                    {isScanning ? 'YUZ ANIQLANMOQDA...' : 'YUZNI JOYLASHTIRING'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>TALABA: {currentStudent.fullName}</span>
                  <span>GURUH: {currentStudent.groupName}</span>
                </div>
              </div>
            </div>

            {/* Quick Time Simulator Buttons for Testing All 3 Required States */}
            <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kechikish qoidalarini sinab ko‘rish:</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Dars: 08:00</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCustomArrivalTime('08:05');
                    handleVerifyAttendance('08:05');
                  }}
                  disabled={isScanning}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg transition-colors text-left cursor-pointer"
                >
                  <span className="block font-extrabold">08:05 da kelish</span>
                  <span className="text-[10px] text-emerald-700">0–10 min (Yashil / Vaqtida)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCustomArrivalTime('08:14');
                    handleVerifyAttendance('08:14');
                  }}
                  disabled={isScanning}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold rounded-lg transition-colors text-left cursor-pointer"
                >
                  <span className="block font-extrabold">08:14 da kelish</span>
                  <span className="text-[10px] text-amber-700">11–15 min (Sariq / Kechikish)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCustomArrivalTime('08:24');
                    handleVerifyAttendance('08:24');
                  }}
                  disabled={isScanning}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs font-bold rounded-lg transition-colors text-left cursor-pointer"
                >
                  <span className="block font-extrabold">08:24 da kelish</span>
                  <span className="text-[10px] text-rose-700">16+ min (Qizil / Jiddiy)</span>
                </button>
              </div>

              {/* Custom Time Input & Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label htmlFor="customTime" className="text-xs font-medium text-slate-600 whitespace-nowrap">
                    Boshqa vaqt:
                  </label>
                  <input
                    id="customTime"
                    type="time"
                    value={customArrivalTime}
                    onChange={(e) => setCustomArrivalTime(e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleVerifyAttendance()}
                  disabled={isScanning}
                  className="w-full sm:flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isScanning ? 'Tekshirilmoqda...' : 'Davomatni qayd qilish'}</span>
                </button>
              </div>
            </div>

            {/* Scan Result Alert Banner */}
            {scanResult && (
              <div
                className={`mt-4 p-4 rounded-xl border flex items-start gap-3.5 animate-in fade-in duration-200 ${
                  scanResult.status === 'present' || scanResult.status === 'late_forgiven'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : scanResult.status === 'late'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                {scanResult.status === 'present' || scanResult.status === 'late_forgiven' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : scanResult.status === 'late' ? (
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold">
                      {scanResult.status === 'present' || scanResult.status === 'late_forgiven'
                        ? '“Vaqtida”'
                        : scanResult.status === 'late'
                        ? '“Kechikdingiz”'
                        : '“Jiddiy kechikish”'}
                    </span>
                    <span className="text-xs font-mono font-bold tabular-nums">
                      {scanResult.time}
                    </span>
                  </div>
                  <p className="text-xs font-medium mt-1">
                    {scanResult.status === 'present' || scanResult.status === 'late_forgiven'
                      ? `0–10 daqiqalik me’yor doirasida kelindi (${scanResult.minutesLate} daqiqa). Yashil maqom berildi.`
                      : scanResult.status === 'late'
                      ? `11–15 daqiqa kechikish qayd etildi (${scanResult.minutesLate} daqiqa). Sariq maqom.`
                      : `16+ daqiqa kechikish! Jiddiy kechikish hisoblandi (${scanResult.minutesLate} daqiqa). Qizil maqom.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Lateness Rules & Summary Stats */}
        <div className="lg:col-span-5 space-y-4">
          {/* Lateness Rules Visual Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kechikish Mezonlari (08:00 dan hisoblanadi)
              </h3>
              <p className="text-xs text-slate-500">
                Texnik kollej nizomiga muvofiq qat’iy me’yorlar
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 shrink-0"></div>
                <div>
                  <div className="text-xs font-extrabold text-emerald-950">
                    0–10 daqiqa: “Vaqtida” (Kechirilgan) — Yashil
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    08:00 dan 08:10 gacha kelgan talabalar uchun kechiriladi va darsga ruxsat etiladi.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/70 flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 shrink-0"></div>
                <div>
                  <div className="text-xs font-extrabold text-amber-950">
                    11–15 daqiqa: “Kechikdingiz” — Sariq
                  </div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    08:11 dan 08:15 gacha kelganlarga ogohlantirish beriladi va jurnalga qayd etiladi.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/70 flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500 mt-1 shrink-0"></div>
                <div>
                  <div className="text-xs font-extrabold text-rose-950">
                    16+ daqiqa: “Jiddiy kechikish” — Qizil
                  </div>
                  <p className="text-[11px] text-rose-800 mt-0.5">
                    08:16 dan so‘ng kelish jiddiy qoidabuzarlik hisoblanadi. Oyiga 3 marta takrorlansa ota-onaga qo‘ng‘iroq qilinadi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Month Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Oylik Davomat Ko‘rsatkichi ({currentStudent.fullName.split(' ')[0]})
            </h3>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 font-medium">Vaqtida kelgan</span>
                <div className="text-xl font-mono font-extrabold text-emerald-600 mt-0.5 tabular-nums">
                  {countPresent} kun
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 font-medium">Kechikkan (11-15 min)</span>
                <div className="text-xl font-mono font-extrabold text-amber-600 mt-0.5 tabular-nums">
                  {countLate} marta
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80">
                <span className="text-[11px] text-rose-700 font-bold">Jiddiy kechikish</span>
                <div className="text-xl font-mono font-extrabold text-rose-700 mt-0.5 tabular-nums">
                  {countSeriousLate} marta
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 font-medium">Sababsiz kelmagan</span>
                <div className="text-xl font-mono font-extrabold text-slate-700 mt-0.5 tabular-nums">
                  {countAbsent} kun
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Attendance Section (Prompt Requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Haftalik Davomat Dinamikasi (Dushanba — Shanba)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Haftaning har bir kuni bo‘yicha talabaning davomat holati
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Joriy hafta (2026-yil sentabr)
          </span>
        </div>

        {/* Days of Week Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          {daysOfWeek.map((day) => {
            const record = getRecordForDay(day);

            let statusBg = 'bg-slate-50 border-slate-200 text-slate-600';
            let badgeText = 'Kutilmoqda';
            let badgeClass = 'text-slate-500';

            if (record) {
              if (record.status === 'present' || record.status === 'late_forgiven') {
                statusBg = 'bg-emerald-50/70 border-emerald-300 text-emerald-950';
                badgeText = 'Vaqtida';
                badgeClass = 'text-emerald-700 font-bold';
              } else if (record.status === 'late') {
                statusBg = 'bg-amber-50/70 border-amber-300 text-amber-950';
                badgeText = 'Kechikkan';
                badgeClass = 'text-amber-700 font-bold';
              } else if (record.status === 'serious_late') {
                statusBg = 'bg-rose-50/80 border-rose-300 text-rose-950';
                badgeText = 'Jiddiy kechikish';
                badgeClass = 'text-rose-700 font-bold';
              }
            }

            return (
              <div
                key={day}
                className={`p-3.5 rounded-xl border flex flex-col justify-between min-h-[105px] transition-all ${statusBg}`}
              >
                <div>
                  <div className="text-xs font-bold tracking-tight">{day}</div>
                  <div className={`text-[11px] mt-1 ${badgeClass}`}>
                    {badgeText}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-mono">
                  <span>{record ? record.checkInTime.slice(0, 5) : '--:--'}</span>
                  <span>{record ? `${record.minutesLate} daq.` : '0 daq.'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Davomat Tarixi va Qaydlar Jurnali
            </h3>
            <p className="text-xs text-slate-500">
              Kamera va tizim orqali qayd etilgan barcha kirish vaqtlari
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Jami qaydlar: <span className="font-bold text-slate-800">{attendanceHistory.length} ta</span>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-2.5 px-3">Sana & Kun</th>
                <th className="py-2.5 px-3">Talaba F.I.Sh.</th>
                <th className="py-2.5 px-3">Guruh</th>
                <th className="py-2.5 px-3">Kelgan vaqti</th>
                <th className="py-2.5 px-3">Kechikish</th>
                <th className="py-2.5 px-3">Holati</th>
                <th className="py-2.5 px-3">Fanning nomi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceHistory.map((rec) => {
                const isGreen = rec.status === 'present' || rec.status === 'late_forgiven';
                const isYellow = rec.status === 'late';
                const isRed = rec.status === 'serious_late';

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-900">
                      <div>{rec.date}</div>
                      <div className="text-[11px] text-slate-400">{rec.dayOfWeek}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {rec.studentName}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {rec.groupName}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 tabular-nums">
                      {rec.checkInTime}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums">
                      {rec.minutesLate > 0 ? (
                        <span className={isRed ? 'text-rose-600 font-bold' : isYellow ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                          +{rec.minutesLate} daq
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">0 daq</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          isGreen
                            ? 'text-emerald-700'
                            : isYellow
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isGreen ? 'bg-emerald-500' : isYellow ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                        ></span>
                        {rec.statusLabelUz}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {rec.subjectName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parent Call Dialog / Modal */}
      {showParentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <PhoneCall className="w-4 h-4" />
                <span>Ota-ona Bilan Bog‘lanish Paneli</span>
              </div>
              <span className="text-xs text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                3+ jiddiy kechikish
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-xs text-slate-500">Talaba ma’lumotlari:</div>
                <div className="text-sm font-bold text-slate-900">
                  {currentStudent.fullName} ({currentStudent.groupName})
                </div>
                <div className="text-xs text-slate-700">
                  Ota-onasi: <strong className="text-slate-900">{currentStudent.parentName}</strong>
                </div>
                <div className="text-xs text-slate-700">
                  Telefon: <strong className="font-mono text-slate-900">{currentStudent.parentPhone}</strong>
                </div>
              </div>

              {/* Ready-to-Send SMS Notification Preview */}
              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs text-rose-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                    SMS Xabarnoma Namunasi
                  </span>
                  <span>O‘zbek tilida</span>
                </div>
                <p className="text-xs text-rose-950 font-medium leading-relaxed bg-white/80 p-2.5 rounded-lg border border-rose-200">
                  «Hurmatli {currentStudent.parentName}! Farzandingiz {currentStudent.fullName} joriy oyda darslarga 3 marta 16 daqiqadan ortiq jiddiy kechikib keldi. Iltimos, ta’lim sifatini ta’minlash maqsadida guruh murabbiyi bilan bog‘laning. Kollej ma’muriyati.»
                </p>
              </div>

              {smsSentNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>SMS xabarnoma muvaffaqiyatli yuborildi va qoidabuzarlik jurnali yangilandi!</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSmsSentNotice(false);
                  setShowParentModal(false);
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Yopish
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSmsSentNotice(true)}
                  className="px-3.5 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  SMS Yuborish
                </button>
                <a
                  href={`tel:${currentStudent.parentPhone}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Qo‘ng‘iroq qilish</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
