"use client";

import { DayOfWeek, DAY_SHORT_LABELS, ALL_DAYS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DaySelectorProps {
  currentDay: DayOfWeek;
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
}

export default function DaySelector({
  currentDay,
  selectedDay,
  onSelectDay,
}: DaySelectorProps) {
  return (
    <div className="flex gap-1.5 px-4 py-3 overflow-x-auto scrollbar-hide">
      {ALL_DAYS.map((day) => {
        const isSelected = day === selectedDay;
        const isToday = day === currentDay;

        return (
          <button
            key={day}
            onClick={() => onSelectDay(day)}
            className={cn(
              "relative flex-1 min-w-[44px] py-2.5 rounded-xl text-xs font-medium transition-colors",
              isSelected
                ? "text-white"
                : "text-purple-300/60 hover:text-purple-300/80"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="daySelector"
                className="absolute inset-0 bg-purple-600/40 border border-purple-500/30 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex flex-col items-center gap-0.5">
              <span>{DAY_SHORT_LABELS[day]}</span>
              {isToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
