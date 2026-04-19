"use client";

import { getCurrentTimeMinutes, formatTime, minutesToTime } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function TimeProgress() {
  const [currentMinutes, setCurrentMinutes] = useState(getCurrentTimeMinutes());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMinutes(getCurrentTimeMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const dayStartMinutes = 8 * 60; // 8 AM
  const dayEndMinutes = 24 * 60; // midnight
  const totalDayMinutes = dayEndMinutes - dayStartMinutes;
  const elapsed = Math.max(
    0,
    Math.min(totalDayMinutes, currentMinutes - dayStartMinutes)
  );
  const progress = (elapsed / totalDayMinutes) * 100;

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-purple-300/40">
          {formatTime(minutesToTime(currentMinutes))}
        </span>
        <span className="text-xs text-purple-300/40">
          {Math.round(progress)}% of day
        </span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-purple-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
