"use client";

import { motion } from "framer-motion";
import { DayOfWeek, DAY_SHORT_LABELS, ALL_DAYS } from "@/lib/types";

interface DayStats {
  total: number;
  done: number;
}

function getWeekKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  // ISO week number (simple day-of-year / 7 grouping, good enough for streak/stats)
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(year, 0, 0).getTime()) / 86400000
  );
  const week = Math.ceil(dayOfYear / 7);
  return `routn-weekly-${year}-${week}`;
}

function loadWeekData(): Record<DayOfWeek, DayStats> {
  if (typeof window === "undefined") return {} as Record<DayOfWeek, DayStats>;
  try {
    const raw = localStorage.getItem(getWeekKey());
    return raw ? JSON.parse(raw) : ({} as Record<DayOfWeek, DayStats>);
  } catch {
    return {} as Record<DayOfWeek, DayStats>;
  }
}

function calcStreak(data: Record<DayOfWeek, DayStats>): number {
  let streak = 0;
  const today = new Date().getDay(); // 0=sun
  const ordered: DayOfWeek[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  // map JS day (0=sun) to our ordered array index
  const todayIdx = today === 0 ? 6 : today - 1;

  for (let i = todayIdx; i >= 0; i--) {
    const day = ordered[i];
    const d = data[day];
    if (!d || d.total === 0) break;
    if (d.done / d.total >= 0.5) streak++;
    else break;
  }
  return streak;
}

function getBestStreak(currentStreak: number): number {
  if (typeof window === "undefined") return currentStreak;
  try {
    const stored = parseInt(localStorage.getItem("routn-best-streak") || "0", 10);
    const best = Math.max(stored, currentStreak);
    localStorage.setItem("routn-best-streak", String(best));
    return best;
  } catch {
    return currentStreak;
  }
}

interface WeeklyStatsProps {
  show: boolean;
}

export default function WeeklyStats({ show }: WeeklyStatsProps) {
  const data = loadWeekData();
  const streak = calcStreak(data);
  const bestStreak = getBestStreak(streak);

  const totalDone = ALL_DAYS.reduce((sum, d) => sum + (data[d]?.done || 0), 0);

  return (
    <motion.div
      initial={false}
      animate={show ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      <div className="px-4 pb-2">
        <div className="rounded-2xl border border-purple-500/15 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-purple-200/70">
              This Week
            </span>
            <span className="text-xs text-purple-300/40">
              🔥 {streak} day streak {bestStreak > streak ? `· best ${bestStreak}` : ""}
            </span>
          </div>

          {/* 7 mini bars Mon–Sun */}
          <div className="flex gap-1.5 items-end h-12 mb-2">
            {ALL_DAYS.map((day) => {
              const d = data[day];
              const pct = d && d.total > 0 ? d.done / d.total : 0;
              const height = Math.max(4, Math.round(pct * 48));
              return (
                <div
                  key={day}
                  className="flex-1 flex items-end"
                  style={{ height: 48 }}
                >
                  <div
                    className="w-full rounded-sm transition-all"
                    style={{
                      height,
                      background:
                        pct >= 0.5
                          ? "linear-gradient(to top, #7c3aed, #a78bfa)"
                          : "rgba(139,92,246,0.15)",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Day labels */}
          <div className="flex gap-1.5">
            {ALL_DAYS.map((day) => (
              <div
                key={day}
                className="flex-1 text-center text-[10px] text-purple-400/30"
              >
                {DAY_SHORT_LABELS[day].slice(0, 1)}
              </div>
            ))}
          </div>

          {/* Summary row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-500/10">
            <span className="text-[10px] text-purple-400/40">
              {totalDone} activities done
            </span>
            <span className="text-[10px] text-purple-400/40">
              Best streak: {bestStreak}d
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export { getWeekKey };
