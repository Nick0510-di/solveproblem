import React, { useState, useEffect } from 'react';
import {
  BellRing,
  Clock,
  Wifi,
  Cpu,
  Activity,
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  Code,
  Terminal,
  Volume2,
  Coffee,
  RotateCw,
  Power,
  ShieldCheck,
} from 'lucide-react';
import { ESP32Status, PeriodSchedule } from '../types';
import { bellAudio } from '../utils/audio';

interface SmartBellViewProps {
  periods: PeriodSchedule[];
  currentPeriod: PeriodSchedule | null;
  nextPeriod: PeriodSchedule | null;
  nextBellTime: string;
  minutesToNextBell: number;
  esp32Status: ESP32Status;
  onManualBellRing: () => void;
  isBellRinging: boolean;
  onUpdateESP32: (status: ESP32Status) => void;
}

export const SmartBellView: React.FC<SmartBellViewProps> = ({
  periods,
  currentPeriod,
  nextPeriod,
  nextBellTime,
  minutesToNextBell,
  esp32Status,
  onManualBellRing,
  isBellRinging,
  onUpdateESP32,
}) => {
  // Live seconds calculation for current minute
  const [seconds, setSeconds] = useState<number>(0);
  const [activeSubTab, setActiveSubTab] = useState<'monitor' | 'hardware' | 'schedule'>('monitor');
  const [relayTestDuration, setRelayTestDuration] = useState<number>(5);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSeconds(60 - now.getSeconds());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalRemainingSeconds = Math.max(0, minutesToNextBell * 60 + seconds);
  const displayMin = Math.floor(totalRemainingSeconds / 60);
  const displaySec = totalRemainingSeconds % 60;

  // Toggle ESP32 Connection
  const handleToggleConnection = () => {
    const updated: ESP32Status = {
      ...esp32Status,
      connected: !esp32Status.connected,
      logs: [
        {
          timestamp: new Date().toLocaleTimeString('uz-UZ'),
          event: esp32Status.connected
            ? 'ESP32 moduli tarmoqdan uzildi (Manual disconnect)'
            : 'ESP32 mikrokontrolleri bilan ulanish tiklandi (192.168.1.120:80)',
          type: esp32Status.connected ? 'error' : 'info',
        },
        ...esp32Status.logs,
      ],
    };
    onUpdateESP32(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                Zvonok Tizimi
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">IoT & ESP32 Avtomatlashtirilgan Nazorat</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Aqlli Qo‘ng‘iroq (Smart Bell) Boshqaruvi
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-0.5">
              Dars boshlanishi, tugashi va tanaffuslarni avtomatlashtirilgan tarzda real vaqtda boshqarish.
            </p>
          </div>

          {/* Quick Ring Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onManualBellRing}
              disabled={isBellRinging}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl border transition-all shadow-xs cursor-pointer ${
                isBellRinging
                  ? 'bg-amber-500 border-amber-600 text-white animate-pulse'
                  : 'bg-amber-600 hover:bg-amber-700 border-amber-600 text-white'
              }`}
            >
              <BellRing className={`w-4 h-4 ${isBellRinging ? 'animate-bounce' : ''}`} />
              <span>{isBellRinging ? 'Qo‘ng‘iroq chalinmoqda (5s)...' : 'Qo‘ng‘iroqni chalish'}</span>
            </button>
          </div>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-1 mt-5 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('monitor')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              activeSubTab === 'monitor'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Jonli Monitor & Countdown
          </button>
          <button
            onClick={() => setActiveSubTab('hardware')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              activeSubTab === 'hardware'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            ESP32 Arxitekturasi & IoT Rele
          </button>
          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              activeSubTab === 'schedule'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Qo‘ng‘iroqlar Jadvali
          </button>
        </div>
      </div>

      {/* Main Tab 1: Live Monitor & Countdown */}
      {activeSubTab === 'monitor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Big Circular Countdown Display */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Qo‘ng‘iroq Taymeri
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  ESP32 Faol
                </span>
              </div>

              {/* Digital Countdown Box */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 text-white text-center relative overflow-hidden border border-slate-800 shadow-inner">
                {isBellRinging && (
                  <div className="absolute inset-0 bg-amber-500/20 animate-pulse pointer-events-none"></div>
                )}
                <p className="text-xs font-semibold text-slate-400">
                  KEYINGI QO‘NG‘IROQQACHA QOLGAN VAQT:
                </p>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="bg-slate-900/90 border border-slate-800 px-5 py-3 rounded-2xl min-w-[90px]">
                    <span className="text-4xl sm:text-5xl font-mono font-extrabold text-amber-400 tabular-nums">
                      {String(displayMin).padStart(2, '0')}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-400 mt-1 uppercase">Daqiqa</span>
                  </div>
                  <span className="text-3xl font-mono font-bold text-amber-500/80 animate-pulse">:</span>
                  <div className="bg-slate-900/90 border border-slate-800 px-5 py-3 rounded-2xl min-w-[90px]">
                    <span className="text-4xl sm:text-5xl font-mono font-extrabold text-amber-400 tabular-nums">
                      {String(displaySec).padStart(2, '0')}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-400 mt-1 uppercase">Soniya</span>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Qo‘ng‘iroq vaqti: <strong className="text-white">{nextBellTime}</strong></span>
                </div>
              </div>
            </div>

            {/* Current Lesson vs Next Lesson Card */}
            <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                  Hozirgi dars:
                </span>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {currentPeriod ? currentPeriod.name : 'Dars boshlanishi'}
                </div>
                <div className="text-xs font-mono font-semibold text-blue-900 mt-1 tabular-nums">
                  {currentPeriod ? `${currentPeriod.startTime} — ${currentPeriod.endTime}` : '08:00'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Keyingi tanaffus / Dars:
                </span>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {nextPeriod ? nextPeriod.name : 'Katta tanaffus'}
                </div>
                <div className="text-xs font-mono font-semibold text-slate-700 mt-1 tabular-nums">
                  {currentPeriod?.breakName || '10 daqiqa dam olish'}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Periods & Breaks Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Dars va Tanaffuslar Sxemasi</span>
                <span className="text-xs text-blue-600 font-semibold">Kollej tartibi</span>
              </h3>

              <div className="mt-4 space-y-3">
                {/* 1-para */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">1-para</span>
                    <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">08:00–09:20</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Tanaffus: 10 daqiqa (09:20–09:30)</span>
                  </div>
                </div>

                {/* 2-para */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">2-para</span>
                    <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">09:30–10:50</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg font-medium">
                    <Coffee className="w-3.5 h-3.5 text-amber-600" />
                    <span>Katta tanaffus / Tushlik: 30 daqiqa (10:50–11:20)</span>
                  </div>
                </div>

                {/* 3-para */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">3-para</span>
                    <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">11:20–12:40</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <span>Kunlik majburiy darslar yakunlanishi (12:40)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick ESP32 Status Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold tracking-tight">ESP32 RELE MODULI</span>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    esp32Status.connected ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300'
                  }`}
                >
                  {esp32Status.connected ? 'ONLAYN' : 'OFLAYN'}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">IP-MANZIL:</span>
                  <span className="text-white font-bold">{esp32Status.ipAddress}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SIGNAL (WIFI):</span>
                  <span className="text-emerald-400 font-bold">{esp32Status.wifiSignal} dBm</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">RELE PINI:</span>
                  <span className="text-amber-300 font-bold">{esp32Status.relayPin}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">RELE HOLATI:</span>
                  <span className={isBellRinging ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-400'}>
                    {isBellRinging ? 'HIGH (5s)' : 'LOW (IDLE)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: ESP32 Hardware Integration Architecture (Prompt Requirement) */}
      {activeSubTab === 'hardware' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>ESP32 Mikrokontrolleri va Jismoniy Qo‘ng‘iroq Integratsiyasi</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Platforma real texnik kollejlardagi elektr qo‘ng‘iroqni boshqarish uchun ESP32 (Wi-Fi + Bluetooth) moduli bilan REST API yoki MQTT protokoli orqali bog‘lanadi.
            </p>

            {/* Architecture Pipeline Flow Diagram */}
            <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[700px] gap-3 text-center">
                {/* Node 1: SmartSchool Web */}
                <div className="flex-1 p-4 rounded-xl bg-white border border-slate-300 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 block">SmartSchool Platform</span>
                  <span className="text-[11px] text-slate-500">Web Dashboard & Cron</span>
                </div>

                <div className="text-slate-400 font-bold text-xs">
                  <span>HTTP POST / MQTT</span>
                  <div className="w-12 h-0.5 bg-blue-400 mx-auto my-1"></div>
                  <span className="text-[10px] text-blue-600 font-mono">JSON Payload</span>
                </div>

                {/* Node 2: Local WiFi Gateway */}
                <div className="flex-1 p-4 rounded-xl bg-white border border-slate-300 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-2">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 block">Wi-Fi Router</span>
                  <span className="text-[11px] text-slate-500">192.168.1.1 (LAN)</span>
                </div>

                <div className="text-slate-400 font-bold text-xs">
                  <span>802.11 b/g/n</span>
                  <div className="w-12 h-0.5 bg-indigo-400 mx-auto my-1"></div>
                  <span className="text-[10px] text-indigo-600 font-mono">Port 80 / 1883</span>
                </div>

                {/* Node 3: ESP32 Microcontroller */}
                <div className="flex-1 p-4 rounded-xl bg-white border border-amber-300 shadow-2xs ring-2 ring-amber-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 block">ESP32-WROOM-32</span>
                  <span className="text-[11px] text-slate-500">GPIO 2 (D2) Relay Control</span>
                </div>

                <div className="text-slate-400 font-bold text-xs">
                  <span>12V Rele</span>
                  <div className="w-12 h-0.5 bg-amber-500 mx-auto my-1"></div>
                  <span className="text-[10px] text-amber-600 font-mono">NO / COM Kontakti</span>
                </div>

                {/* Node 4: College Physical Bell */}
                <div className="flex-1 p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-2">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-white block">Kollej Qo‘ng‘irog‘i</span>
                  <span className="text-[11px] text-slate-300">220V AC / 10A Sirena</span>
                </div>
              </div>
            </div>

            {/* Interactive ESP32 Controller Panel */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">ESP32 Ulanishini Boshqarish</span>
                  <button
                    onClick={handleToggleConnection}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      esp32Status.connected
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }`}
                  >
                    {esp32Status.connected ? 'Ulanishni uzish' : 'Qayta ulash'}
                  </button>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 font-mono">
                  <div>Device ID: <span className="font-bold text-slate-900">ESP32-BELL-TATT-01</span></div>
                  <div>IP Address: <span className="font-bold text-slate-900">{esp32Status.ipAddress}</span></div>
                  <div>MAC Address: <span className="font-bold text-slate-900">{esp32Status.macAddress}</span></div>
                  <div>Signal: <span className="font-bold text-emerald-700">{esp32Status.wifiSignal} dBm (A’lo)</span></div>
                </div>
              </div>

              {/* JSON Payload Spec */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>HTTP POST /api/v1/trigger-bell</span>
                  <span className="text-emerald-400">Content-Type: json</span>
                </div>
                <pre className="text-amber-300 text-[11px] overflow-x-auto p-2 bg-slate-900 rounded-lg">
{`{
  "device": "ESP32-BELL-TATT-01",
  "command": "TRIGGER_RELAY",
  "pin": 2,
  "duration_seconds": ${relayTestDuration},
  "auth_token": "TATT_SECURE_TOKEN_2026",
  "timestamp": "${new Date().toISOString()}"
}`}
                </pre>
              </div>
            </div>

            {/* Arduino ESP32 Firmware Snippet Preview */}
            <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-blue-600" />
                  <span>ESP32 Arduino C++ Kود namunasi (Kollej muhandislari uchun):</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">SmartBell_ESP32.ino</span>
              </div>
              <pre className="text-[11px] font-mono text-slate-800 bg-white p-3.5 rounded-lg border border-slate-300 overflow-x-auto leading-relaxed">
{`#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "TATT_COLLEGE_WIFI";
const char* password = "SECRET_PASSWORD";
const int RELAY_PIN = 2; // GPIO 2 D2

WebServer server(80);

void handleBellTrigger() {
  digitalWrite(RELAY_PIN, HIGH); // Rele yoniq (Qo'ng'iroq chaladi)
  delay(5000);                   // 5 soniya
  digitalWrite(RELAY_PIN, LOW);  // Rele o'chiq
  server.send(200, "application/json", "{\\"status\\":\\"SUCCESS\\",\\"relay\\":\\"TRIGGERED\\"}");
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  WiFi.begin(ssid, password);
  server.on("/api/v1/trigger-bell", HTTP_POST, handleBellTrigger);
  server.begin();
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 3: Detailed Bell Schedule */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Kollej Qo‘ng‘iroqlarining Rasmiy Vaqti
          </h3>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-2.5 px-3">Bosqich</th>
                  <th className="py-2.5 px-3">Boshlanish qo‘ng‘irog‘i</th>
                  <th className="py-2.5 px-3">Tugash qo‘ng‘irog‘i</th>
                  <th className="py-2.5 px-3">Davomiyligi</th>
                  <th className="py-2.5 px-3">Tanaffus vaqti</th>
                  <th className="py-2.5 px-3">ESP32 Rele buyrug‘i</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 font-sans font-bold text-slate-900">1-para</td>
                  <td className="py-3 px-3 text-emerald-700 font-bold">08:00 (5 soniya)</td>
                  <td className="py-3 px-3 text-amber-700 font-bold">09:20 (5 soniya)</td>
                  <td className="py-3 px-3 text-slate-600">80 daqiqa</td>
                  <td className="py-3 px-3 font-sans text-blue-700 font-semibold">10 daqiqa tanaffus</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">GPIO2:HIGH:5000ms</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 font-sans font-bold text-slate-900">2-para</td>
                  <td className="py-3 px-3 text-emerald-700 font-bold">09:30 (5 soniya)</td>
                  <td className="py-3 px-3 text-amber-700 font-bold">10:50 (5 soniya)</td>
                  <td className="py-3 px-3 text-slate-600">80 daqiqa</td>
                  <td className="py-3 px-3 font-sans text-amber-700 font-bold">30 daqiqa katta tanaffus / Tushlik</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">GPIO2:HIGH:5000ms</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 font-sans font-bold text-slate-900">3-para</td>
                  <td className="py-3 px-3 text-emerald-700 font-bold">11:20 (5 soniya)</td>
                  <td className="py-3 px-3 text-amber-700 font-bold">12:40 (5 soniya)</td>
                  <td className="py-3 px-3 text-slate-600">80 daqiqa</td>
                  <td className="py-3 px-3 font-sans text-slate-600 font-medium">Fakultativ va to‘garaklar</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">GPIO2:HIGH:5000ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Real-time Hardware Event Log */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-600" />
            <span>ESP32 Jonli Hodisalar va Rele Jurnali (Logs)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Oxirgi 5 ta buyruq</span>
        </div>

        <div className="mt-3 divide-y divide-slate-100 text-xs font-mono">
          {esp32Status.logs.map((log, idx) => (
            <div key={idx} className="py-2.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="text-slate-400 tabular-nums">[{log.timestamp}]</span>
                <span
                  className={
                    log.type === 'trigger'
                      ? 'text-amber-800 font-bold'
                      : log.type === 'error'
                      ? 'text-rose-700 font-bold'
                      : 'text-slate-700'
                  }
                >
                  {log.event}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 uppercase">
                {log.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
