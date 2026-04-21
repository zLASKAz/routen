"use client";

import { useState, useEffect } from "react";
import { Activity, CATEGORY_COLORS } from "@/lib/types";
import {
  formatTime,
  formatDuration,
  formatCountdown,
  getActivityStatus,
  getCurrentTimeMinutes,
  timeToMinutes,
  cn,
} from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Check,
  Pencil,
  Sunrise,
  Briefcase,
  Car,
  Code,
  Dumbbell,
  BookOpen,
  Coffee,
  Moon,
  Trophy,
  Home,
  Shirt,
  Sparkles,
  Battery,
  Circle,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sunrise,
  Briefcase,
  Car,
  Code,
  Dumbbell,
  BookOpen,
  Coffee,
  Moon,
  Trophy,
  Home,
  Shirt,
  Sparkles,
  Battery,
};

interface ActivityCardProps {
  activity: Activity;
  index: number;
  onToggleDone: (id: string) => void;
  onEdit: (activity: Activity) => void;
  isSunday?: boolean;
}

export default function ActivityCard({
  activity,
  index,
  onToggleDone,
  onEdit,
  isSunday,
}: ActivityCardProps) {
  const currentMinutes = getCurrentTimeMinutes();
  const status = getActivityStatus(
    activity.startTime,
    activity.duration,
    currentMinutes
  );
  const Icon = ICON_MAP[activity.icon] || Circle;
  const color = CATEGORY_COLORS[activity.category];

  const isActive = status === "active" && !activity.done;
  const isPassed = status === "passed" || activity.done;

  // Countdown timer: compute seconds remaining from current time
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const now = new Date();
    const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const endSecs = (timeToMinutes(activity.startTime) + activity.duration) * 60;
    return Math.max(0, endSecs - nowSecs);
  });

  useEffect(() => {
    if (!isActive || activity.duration <= 0) return;
    const startTime = activity.startTime;
    const duration = activity.duration;
    const calcSeconds = () => {
      const now = new Date();
      const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const endSecs = (timeToMinutes(startTime) + duration) * 60;
      return Math.max(0, endSecs - nowSecs);
    };
    const interval = setInterval(() => setSecondsLeft(calcSeconds()), 1000);
    return () => clearInterval(interval);
  }, [isActive, activity.startTime, activity.duration]);

  const totalSeconds = activity.duration * 60;
  const progressPercent =
    totalSeconds > 0 ? Math.min(100, (secondsLeft / totalSeconds) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex gap-3 items-start"
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center pt-1">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shrink-0",
            isActive
              ? "border-violet-400 bg-violet-500/20 shadow-[0_0_12px_rgba(139,92,246,0.4)]"
              : isPassed
              ? "border-purple-700/40 bg-purple-900/20"
              : "border-purple-500/20 bg-white/5"
          )}
          style={
            isActive
              ? { borderColor: color, boxShadow: `0 0 12px ${color}40` }
              : {}
          }
        >
          <Icon
            className={cn(
              "w-4.5 h-4.5",
              isActive
                ? "text-white"
                : isPassed
                ? "text-purple-500/40"
                : "text-purple-300/60"
            )}
          />
        </div>
        <div
          className={cn(
            "w-0.5 flex-1 min-h-[24px]",
            isPassed ? "bg-purple-700/20" : "bg-purple-500/15"
          )}
        />
      </div>

      {/* Card */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex-1 rounded-2xl border p-3.5 mb-2 transition-all",
          isActive
            ? "bg-white/[0.07] border-purple-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
            : isPassed
            ? "bg-white/[0.02] border-purple-800/15 opacity-50"
            : "bg-white/[0.04] border-purple-500/10"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[13px] font-semibold",
                  isPassed
                    ? "text-purple-400/40 line-through"
                    : isActive
                    ? "text-white"
                    : "text-purple-100/80"
                )}
              >
                {activity.name}
              </span>
              {isActive && (
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  "text-xs",
                  isPassed ? "text-purple-500/30" : "text-purple-300/50"
                )}
              >
                {formatTime(activity.startTime)}
              </span>
              {activity.duration > 0 && (
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-md",
                    isPassed
                      ? "bg-purple-900/10 text-purple-500/30"
                      : "bg-purple-500/10 text-purple-300/50"
                  )}
                >
                  {formatDuration(activity.duration)}
                </span>
              )}
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: `${color}60` }}
              />
            </div>

            {/* Countdown timer */}
            {isActive && activity.duration > 0 && (
              <div className="mt-2 flex items-center gap-2">
                {secondsLeft <= 0 ? (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-xs font-mono text-emerald-400 tabular-nums"
                  >
                    Time&apos;s up! ✅
                  </motion.span>
                ) : (
                  <>
                    <span className="text-xs font-mono text-violet-300 tabular-nums">
                      {formatCountdown(secondsLeft)}
                    </span>
                    <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Notes */}
            {activity.notes && activity.notes.trim() && (
              <p className="text-xs italic text-purple-300/40 mt-1 truncate">
                {activity.notes}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {!isSunday && (
              <button
                onClick={() => onEdit(activity)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-purple-400/40 hover:text-purple-300 hover:bg-white/5 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {!isSunday && (
              <button
                onClick={() => onToggleDone(activity.id)}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                  activity.done
                    ? "bg-violet-500/20 text-violet-400"
                    : "bg-white/5 text-purple-400/30 hover:text-purple-300"
                )}
              >
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
