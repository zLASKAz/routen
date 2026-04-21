"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Activity } from "@/lib/types";
import { formatTime } from "@/lib/utils";

const QUOTES = [
  "Small steps every day lead to big results.",
  "The secret of getting ahead is getting started.",
  "Discipline is the bridge between goals and accomplishment.",
  "Every morning is a fresh start. Make it count.",
  "Your only limit is your mind.",
  "Success is the sum of small efforts repeated day in and day out.",
];

interface MorningSummaryProps {
  activities: Activity[];
  onDismiss: () => void;
}

export default function MorningSummary({
  activities,
  onDismiss,
}: MorningSummaryProps) {
  const quote = QUOTES[new Date().getDay() % QUOTES.length];
  const firstActivity = activities[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mx-4 mb-3 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-200/80">
            Good morning ☀️
          </p>
          <p className="text-xs text-purple-300/50 mt-1">
            You have{" "}
            <span className="text-white/70">{activities.length} activities</span>{" "}
            today
          </p>
          {firstActivity && (
            <p className="text-xs text-purple-300/40 mt-0.5">
              Starting with{" "}
              <span className="text-violet-300/70">{firstActivity.name}</span> at{" "}
              {formatTime(firstActivity.startTime)}
            </p>
          )}
          <p className="text-[10px] italic text-amber-300/30 mt-2 leading-relaxed">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-purple-400/30 hover:text-purple-300 transition-colors shrink-0 mt-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
