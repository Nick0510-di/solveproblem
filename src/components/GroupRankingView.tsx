import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Flame,
  ArrowUpDown,
  Search,
  Users,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { CollegeGroup } from '../types';

interface GroupRankingViewProps {
  groups: CollegeGroup[];
}

export const GroupRankingView: React.FC<GroupRankingViewProps> = ({ groups }) => {
  const [sortBy, setSortBy] = useState<'points' | 'attendance' | 'lateness'>('points');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<CollegeGroup | null>(null);

  // Sorting
  const sortedGroups = [...groups].sort((a, b) => {
    if (sortBy === 'points') {
      return b.totalPoints - a.totalPoints;
    } else if (sortBy === 'attendance') {
      return b.attendancePercentage - a.attendancePercentage;
    } else {
      return a.latenessCount - b.latenessCount; // Lower lateness is better
    }
  });

  const filteredGroups = sortedGroups.filter((g) => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return g.name.toLowerCase().includes(q) || g.specialty.toLowerCase().includes(q);
  });

  // Top 3 Podium
  const top1 = sortedGroups[0];
  const top2 = sortedGroups[1];
  const top3 = sortedGroups[2];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                Kollej Musobaqasi
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">Davomat va Fan Ko‘rsatkichlari</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Guruhlar Reytingi va Yetakchilar Jadvali
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-0.5">
              Guruhlarning umumiy ballari, davomat intizomi va kechikishlar soniga asoslangan reyting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Saralash:</span>
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSortBy('points')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  sortBy === 'points' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ballar bo‘yicha
              </button>
              <button
                onClick={() => setSortBy('attendance')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  sortBy === 'attendance' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Davomat %
              </button>
              <button
                onClick={() => setSortBy('lateness')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  sortBy === 'lateness' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kam kechikish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 2nd Place */}
        {top2 && (
          <div
            onClick={() => setSelectedGroup(top2)}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-400 transition-all cursor-pointer order-2 md:order-1"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500">2-O‘RIN (KUMUSH)</span>
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center justify-center">
                  2
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-extrabold text-slate-900">{top2.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{top2.specialty}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Jami Ball:</span>
                <span className="text-lg font-mono font-extrabold text-slate-900 tabular-nums">
                  {top2.totalPoints} ball
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Davomat:</span>
                <span className="text-sm font-mono font-bold text-emerald-600 tabular-nums">
                  {top2.attendancePercentage}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 1st Place (Winner / Gold) */}
        {top1 && (
          <div
            onClick={() => setSelectedGroup(top1)}
            className="bg-gradient-to-b from-amber-500/10 via-white to-white rounded-2xl border-2 border-amber-300 p-6 shadow-md flex flex-col justify-between hover:border-amber-400 transition-all cursor-pointer relative order-1 md:order-2"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>MUTLAQ YETAKCHI</span>
            </div>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <span className="text-xs font-bold text-amber-800">1-O‘RIN (OLTIN)</span>
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-black text-lg flex items-center justify-center shadow-xs">
                  1
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-slate-900">{top1.name}</h3>
                  <Flame className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-xs text-slate-600 mt-1">{top1.specialty}</p>
                <div className="mt-2 text-xs text-slate-500">
                  Kurator: <span className="font-semibold text-slate-800">{top1.curator}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Jami Ball:</span>
                <span className="text-2xl font-mono font-black text-amber-600 tabular-nums">
                  {top1.totalPoints} ball
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Davomat / Kechikish:</span>
                <span className="text-base font-mono font-extrabold text-emerald-600 tabular-nums">
                  {top1.attendancePercentage}% ({top1.latenessCount} kech.)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {top3 && (
          <div
            onClick={() => setSelectedGroup(top3)}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-400 transition-all cursor-pointer order-3"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-amber-900">3-O‘RIN (BRONZA)</span>
                <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-extrabold text-sm flex items-center justify-center">
                  3
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-extrabold text-slate-900">{top3.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{top3.specialty}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Jami Ball:</span>
                <span className="text-lg font-mono font-extrabold text-slate-900 tabular-nums">
                  {top3.totalPoints} ball
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Davomat:</span>
                <span className="text-sm font-mono font-bold text-emerald-600 tabular-nums">
                  {top3.attendancePercentage}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Complete Groups Table (Prompt Requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Kollej Guruhlarining To‘liq Reyting Jadvali
            </h3>
            <p className="text-xs text-slate-500">
              Guruh nomi, umumiy ball, davomat foizi, kechikishlar soni va egallagan o‘rni
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Guruh nomini qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-3">O‘rni</th>
                <th className="py-3 px-3">Guruh nomi</th>
                <th className="py-3 px-3">Mutaxassislik yo‘nalishi</th>
                <th className="py-3 px-3">Talabalar soni</th>
                <th className="py-3 px-3 text-right">Umumiy ball</th>
                <th className="py-3 px-3 text-right">Davomat foizi</th>
                <th className="py-3 px-3 text-right">Kechikishlar soni</th>
                <th className="py-3 px-3">Guruh murabbiyi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGroups.map((group, index) => {
                const position = index + 1;
                const isGold = position === 1;
                const isSilver = position === 2;
                const isBronze = position === 3;

                return (
                  <tr
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs ${
                          isGold
                            ? 'bg-amber-500 text-white'
                            : isSilver
                            ? 'bg-slate-400 text-white'
                            : isBronze
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {position}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-extrabold text-slate-900 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span>{group.name}</span>
                        {isGold && <Flame className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 font-medium">
                      {group.specialty}
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-mono tabular-nums">
                      {group.studentCount} nafar
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-extrabold text-slate-900 text-sm tabular-nums">
                      {group.totalPoints}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-600 tabular-nums">
                      {group.attendancePercentage}%
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums">
                      <span className={group.latenessCount > 10 ? 'text-rose-600' : 'text-amber-600'}>
                        {group.latenessCount} ta
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600">
                      {group.curator}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Group Detail Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Guruh Pasporti
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">
                Reytingda: #{selectedGroup.rank}-o‘rin
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mt-3">
              {selectedGroup.name} guruhi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedGroup.specialty} ({selectedGroup.course}-kurs)
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-400 block">Jami Ball</span>
                <span className="text-lg font-mono font-extrabold text-slate-900">{selectedGroup.totalPoints}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[11px] text-emerald-700 block">Davomat %</span>
                <span className="text-lg font-mono font-extrabold text-emerald-800">{selectedGroup.attendancePercentage}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-400 block">Talabalar</span>
                <span className="text-lg font-mono font-extrabold text-slate-900">{selectedGroup.studentCount} nafar</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[11px] text-amber-800 block">Kechikishlar</span>
                <span className="text-lg font-mono font-extrabold text-amber-900">{selectedGroup.latenessCount} ta</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <div>Kurator: <strong className="text-slate-800">{selectedGroup.curator}</strong></div>
              <div>Holat: <span className="text-emerald-700 font-semibold">Faol o‘quv guruhi</span></div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setSelectedGroup(null)}
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
